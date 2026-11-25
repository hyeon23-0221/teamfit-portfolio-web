/**
 * Disjoint-Set / Union-Find data structure with path compression and union by rank.
 */
export class UnionFind<T> {
  private parent: Map<T, T> = new Map();
  private rank: Map<T, number> = new Map();

  constructor(elements: Iterable<T> = []) {
    for (const elem of Array.from(elements)) {
      this.makeSet(elem);
    }
  }

  makeSet(x: T): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
  }

  find(x: T): T {
    this.makeSet(x);
    const p = this.parent.get(x)!;
    if (p !== x) {
      const root = this.find(p);
      this.parent.set(x, root);
      return root;
    }
    return p;
  }

  union(x: T, y: T): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false; // Already in same set
    }

    const rankX = this.rank.get(rootX) || 0;
    const rankY = this.rank.get(rootY) || 0;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
    return true;
  }

  connected(x: T, y: T): boolean {
    return this.find(x) === this.find(y);
  }

  getGroups(): Map<T, T[]> {
    const groups = new Map<T, T[]>();
    for (const key of Array.from(this.parent.keys())) {
      const root = this.find(key);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root)!.push(key);
    }
    return groups;
  }
}
