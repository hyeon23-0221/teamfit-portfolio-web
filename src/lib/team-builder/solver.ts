import {
  Constraint,
  SolveResult,
  TeamResult,
  ConflictDetails,
} from './types';
import { UnionFind } from './union-find';

interface MetaComponent {
  id: number;
  root: string;
  members: string[];
  size: number;
  excludedMetaIds: Set<number>;
}

/**
 * Solves the conditional team building problem with balanced partition and strict constraint adherence.
 */
export function solveTeams(
  participants: string[],
  teamCount: number,
  constraints: Constraint[]
): SolveResult {
  const startTime = Date.now();
  const N = participants.length;
  const K = teamCount;

  // Validation: Team count bounds
  if (K < 2) {
    return {
      success: false,
      teams: [],
      error: '조 개수는 최소 2개 이상이어야 합니다.',
      conflictDetails: {
        type: 'invalid_team_count',
        message: '조 개수는 최소 2개 이상이어야 합니다.',
      },
    };
  }

  if (N < K) {
    return {
      success: false,
      teams: [],
      error: `참여 인원(${N}명)이 조 개수(${K}개)보다 적습니다.`,
      conflictDetails: {
        type: 'insufficient_participants',
        message: `참여 인원(${N}명)이 조 개수(${K}개)보다 적습니다. 최소 ${K}명 이상의 인원이 필요합니다.`,
      },
    };
  }

  const baseCapacity = Math.floor(N / K);
  const extraCount = N % K;
  const maxCapacity = Math.ceil(N / K);

  // Target team capacities (e.g. for N=14, K=4: [4, 4, 3, 3])
  const targetCapacities: number[] = [];
  for (let i = 0; i < K; i++) {
    targetCapacities.push(i < extraCount ? baseCapacity + 1 : baseCapacity);
  }

  // Filter constraints to only those participants currently present
  const participantSet = new Set(participants);
  const validConstraints = constraints.filter(
    (c) => participantSet.has(c.personA) && participantSet.has(c.personB)
  );

  const fixedConstraints = validConstraints.filter((c) => c.type === 'fixed');
  const excludeConstraints = validConstraints.filter((c) => c.type === 'exclude');

  // Step 1: Union-Find for Fixed Constraints
  const uf = new UnionFind<string>(participants);
  for (const fc of fixedConstraints) {
    uf.union(fc.personA, fc.personB);
  }

  // Conflict 1: Fixed & Exclude Collision (Same pair or transitively connected fixed pair has exclude rule)
  for (const ec of excludeConstraints) {
    if (uf.connected(ec.personA, ec.personB)) {
      return {
        success: false,
        teams: [],
        error: `모순 조건 감지: '${ec.personA}'와(과) '${ec.personB}'는 고정 그룹으로 묶여 있지만 동시에 분리 조건이 지정되었습니다.`,
        conflictDetails: {
          type: 'fixed_exclude_collision',
          message: `고정 조건과 분리 조건이 충돌합니다: '${ec.personA}'와(과) '${ec.personB}'는 같은 조에 속해야 하지만 동시에 분리 조건이 지정되었습니다.`,
          details: [`참여자: ${ec.personA}, ${ec.personB}`],
        },
      };
    }
  }

  // Step 2: Build Meta-Components
  const groups = uf.getGroups();
  const rootToMetaId = new Map<string, number>();
  const metaComponents: MetaComponent[] = [];

  let metaIdCounter = 0;
  for (const [root, members] of groups.entries()) {
    // Conflict 3: Merged fixed group size > maximum team capacity
    if (members.length > maxCapacity) {
      return {
        success: false,
        teams: [],
        error: `모순 조건 감지: 고정 그룹 인원(${members.length}명: ${members.join(', ')})이 조 최대 정원(${maxCapacity}명)을 초과합니다.`,
        conflictDetails: {
          type: 'group_size_exceeded',
          message: `고정 그룹 인원수(${members.length}명)가 조별 최대 수용 인원(${maxCapacity}명)을 초과합니다.`,
          details: members,
        },
      };
    }

    const meta: MetaComponent = {
      id: metaIdCounter,
      root,
      members,
      size: members.length,
      excludedMetaIds: new Set<number>(),
    };
    rootToMetaId.set(root, metaIdCounter);
    metaComponents.push(meta);
    metaIdCounter++;
  }

  // Build exclusion edges between meta-components
  for (const ec of excludeConstraints) {
    const rootA = uf.find(ec.personA);
    const rootB = uf.find(ec.personB);
    const idA = rootToMetaId.get(rootA)!;
    const idB = rootToMetaId.get(rootB)!;
    if (idA !== idB) {
      metaComponents[idA].excludedMetaIds.add(idB);
      metaComponents[idB].excludedMetaIds.add(idA);
    }
  }

  // Conflict 2: Clique detection for mutually excluded members > K
  // Check maximum mutual exclusion clique size among meta-components
  const maxClique = findMaxMutualExclusionClique(metaComponents);
  if (maxClique.length > K) {
    const names = maxClique.map((m) => m.members.join('+')).join(', ');
    return {
      success: false,
      teams: [],
      error: `모순 조건 감지: 상호 분리 지정된 그룹 수(${maxClique.length}개)가 조 개수(${K}개)를 초과하여 배치가 불가능합니다.`,
      conflictDetails: {
        type: 'excessive_excludes',
        message: `상호 분리 지정된 인원(그룹) 수(${maxClique.length}개)가 조 개수(${K}개)보다 많습니다.`,
        details: [names],
      },
    };
  }

  // Step 3: Randomized Constraint Solver with Timeout & Iteration Limits
  const MAX_ITERATIONS = 2000;
  const TIMEOUT_MS = 500;
  let iterations = 0;

  // Sort meta-components descending by size (Largest Fit First heuristic)
  metaComponents.sort((a, b) => b.size - a.size);

  let solutionTeams: TeamResult[] | null = null;

  while (iterations < MAX_ITERATIONS && Date.now() - startTime < TIMEOUT_MS) {
    iterations++;

    // Randomize order of equal-sized components or slight jitter
    const currentComponents = [...metaComponents];
    // Slightly shuffle components while mostly keeping larger first
    for (let i = 0; i < currentComponents.length; i++) {
      const j = i + Math.floor(Math.random() * (currentComponents.length - i));
      if (currentComponents[i].size === currentComponents[j].size) {
        const temp = currentComponents[i];
        currentComponents[i] = currentComponents[j];
        currentComponents[j] = temp;
      }
    }

    // Try backtracking with current target capacities shuffled
    const capacities = [...targetCapacities];
    shuffleArray(capacities);

    const teamAssignments: number[][] = Array.from({ length: K }, () => []);
    const teamSizes: number[] = new Array(K).fill(0);
    const teamExcludes: Set<number>[] = Array.from({ length: K }, () => new Set<number>());

    const backtrack = (compIndex: number): boolean => {
      if (Date.now() - startTime >= TIMEOUT_MS) return false;
      if (compIndex === currentComponents.length) {
        return true;
      }

      const comp = currentComponents[compIndex];
      // Candidate teams where comp fits without exceeding capacity and without conflict
      const candidateTeams: number[] = [];
      for (let t = 0; t < K; t++) {
        if (
          teamSizes[t] + comp.size <= capacities[t] &&
          !teamExcludes[t].has(comp.id)
        ) {
          candidateTeams.push(t);
        }
      }

      // Shuffle candidate teams to ensure random, non-deterministic team assignments
      shuffleArray(candidateTeams);

      for (const t of candidateTeams) {
        // Place
        teamAssignments[t].push(comp.id);
        teamSizes[t] += comp.size;
        const addedExcludes: number[] = [];
        for (const exId of comp.excludedMetaIds) {
          if (!teamExcludes[t].has(exId)) {
            teamExcludes[t].add(exId);
            addedExcludes.push(exId);
          }
        }

        if (backtrack(compIndex + 1)) {
          return true;
        }

        // Unplace
        teamAssignments[t].pop();
        teamSizes[t] -= comp.size;
        for (const exId of addedExcludes) {
          teamExcludes[t].delete(exId);
        }
      }

      return false;
    }

    if (backtrack(0)) {
      // Build final team list
      const teams: TeamResult[] = [];
      const metaMap = new Map<number, MetaComponent>();
      for (const m of metaComponents) metaMap.set(m.id, m);

      for (let i = 0; i < K; i++) {
        const members: string[] = [];
        for (const metaId of teamAssignments[i]) {
          members.push(...metaMap.get(metaId)!.members);
        }
        // Shuffle members within the team for natural look
        shuffleArray(members);
        teams.push({
          id: i + 1,
          name: `${i + 1}조`,
          members,
        });
      }

      solutionTeams = teams;
      break;
    }
  }

  const executionTimeMs = Date.now() - startTime;

  if (solutionTeams) {
    return {
      success: true,
      teams: solutionTeams,
      iterationCount: iterations,
      executionTimeMs,
      rulesApplied: {
        fixedCount: fixedConstraints.length,
        excludeCount: excludeConstraints.length,
      },
    };
  }

  // Conflict 4: Unsolvable within iterations or timeout
  return {
    success: false,
    teams: [],
    iterationCount: iterations,
    executionTimeMs,
    error: `제약 조건을 만족하는 조 편성을 찾을 수 없습니다. (탐색 횟수: ${iterations}회, 소요시간: ${executionTimeMs}ms) 조건이 너무 까다롭거나 서로 충돌할 가능성이 있습니다.`,
    conflictDetails: {
      type: 'timeout_or_unsolvable',
      message: `2,000회 탐색 또는 500ms 제한 시간 내에 모든 조건(고정 ${fixedConstraints.length}건, 분리 ${excludeConstraints.length}건)을 만족하는 조합을 찾지 못했습니다. 분리 또는 고정 조건을 일부 완화해 주세요.`,
    },
  };
}

/**
 * Fisher-Yates array shuffle.
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Bron-Kerbosch algorithm to find maximum clique in the mutual exclusion graph.
 */
function findMaxMutualExclusionClique(metaComponents: MetaComponent[]): MetaComponent[] {
  let maxClique: MetaComponent[] = [];

  function bronKerbosch(
    R: MetaComponent[],
    P: MetaComponent[],
    X: MetaComponent[]
  ): void {
    if (P.length === 0 && X.length === 0) {
      if (R.length > maxClique.length) {
        maxClique = [...R];
      }
      return;
    }

    // Pivot selection
    const u = P.length > 0 ? P[0] : X[0];
    const neighborsOfU = u.excludedMetaIds;

    const candidates = P.filter((v) => !neighborsOfU.has(v.id));

    for (const v of candidates) {
      const vNeighbors = v.excludedMetaIds;
      bronKerbosch(
        [...R, v],
        P.filter((p) => vNeighbors.has(p.id)),
        X.filter((x) => vNeighbors.has(x.id))
      );
      P = P.filter((p) => p.id !== v.id);
      X.push(v);
    }
  }

  bronKerbosch([], [...metaComponents], []);
  return maxClique;
}
