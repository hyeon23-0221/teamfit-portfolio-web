import { ParseResult } from './types';

/**
 * Parses raw text input into a cleansed list of participant names.
 * Supports delimiters: newlines, commas, tabs, and spaces.
 */
export function parseParticipantInput(rawInput: string): ParseResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      names: [],
      totalCount: 0,
      hasDuplicates: false,
      duplicateNames: [],
    };
  }

  // Split by newline, comma, tab, or sequences of whitespace
  const rawTokens = rawInput.split(/[\n,\t\r]+|\s{2,}/);
  
  const names: string[] = [];
  const seenCount = new Map<string, number>();

  for (const token of rawTokens) {
    const trimmed = token.trim();
    if (trimmed.length > 0) {
      names.push(trimmed);
      seenCount.set(trimmed, (seenCount.get(trimmed) || 0) + 1);
    }
  }

  const duplicateNames: string[] = [];
  seenCount.forEach((count, name) => {
    if (count > 1) {
      duplicateNames.push(name);
    }
  });

  return {
    names,
    totalCount: names.length,
    hasDuplicates: duplicateNames.length > 0,
    duplicateNames,
  };
}

/**
 * Deduplicates names while preserving first-seen order.
 */
export function deduplicateNames(names: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const name of names) {
    if (!seen.has(name)) {
      seen.add(name);
      result.push(name);
    }
  }
  return result;
}

/**
 * Automatically appends index numbers to duplicate names.
 * e.g., ["홍길동", "홍길동", "김철수"] -> ["홍길동(1)", "홍길동(2)", "김철수"]
 */
export function autoNumberDuplicates(names: string[]): string[] {
  const totalCounts = new Map<string, number>();
  for (const name of names) {
    totalCounts.set(name, (totalCounts.get(name) || 0) + 1);
  }

  const currentCounts = new Map<string, number>();
  const result: string[] = [];

  for (const name of names) {
    const total = totalCounts.get(name) || 0;
    if (total > 1) {
      const current = (currentCounts.get(name) || 0) + 1;
      currentCounts.set(name, current);
      result.push(`${name}(${current})`);
    } else {
      result.push(name);
    }
  }

  return result;
}
