export type ConstraintType = 'fixed' | 'exclude';

export interface Constraint {
  id: string;
  type: ConstraintType;
  personA: string;
  personB: string;
}

export interface TeamResult {
  id: number;
  name: string;
  members: string[];
}

export interface ConflictDetails {
  type:
    | 'fixed_exclude_collision'
    | 'excessive_excludes'
    | 'group_size_exceeded'
    | 'timeout_or_unsolvable'
    | 'invalid_team_count'
    | 'insufficient_participants';
  message: string;
  details?: string[];
}

export interface SolveResult {
  success: boolean;
  teams: TeamResult[];
  error?: string;
  conflictDetails?: ConflictDetails;
  iterationCount?: number;
  executionTimeMs?: number;
  rulesApplied?: {
    fixedCount: number;
    excludeCount: number;
  };
}

export interface ParseResult {
  names: string[];
  totalCount: number;
  hasDuplicates: boolean;
  duplicateNames: string[];
}
