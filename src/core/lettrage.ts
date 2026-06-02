import type { Transaction } from "./types";

/** Convertit un numero de groupe en code de lettrage : 1->A, 26->Z, 27->AA. */
export function toLettrageCode(n: number): string {
  let code = "";
  let x = n;
  while (x > 0) {
    x -= 1;
    code = String.fromCharCode(65 + (x % 26)) + code;
    x = Math.floor(x / 26);
  }
  return code;
}

export interface LettrageStats {
  groupCount: number;
  lettredCount: number;
}

/**
 * Rapproche les operations liees entre elles.
 *
 * Une operation porte un numero de transaction (transactionId) ; les
 * operations rattachees (remboursement, frais, litige...) referencent ce
 * numero via referenceId. On regroupe ces relations avec un union-find, puis
 * on attribue un code de lettrage commun a chaque groupe contenant au moins
 * deux lignes (un rapprochement reel). Les operations isolees restent sans
 * code, comme dans un lettrage comptable classique.
 */
export function applyLettrage(transactions: Transaction[]): LettrageStats {
  const idToIndex = new Map<string, number>();
  transactions.forEach((t, i) => {
    if (t.transactionId) idToIndex.set(t.transactionId, i);
  });

  const parent = transactions.map((_, i) => i);
  const find = (x: number): number => {
    let root = x;
    while (parent[root] !== root) {
      parent[root] = parent[parent[root]];
      root = parent[root];
    }
    return root;
  };
  const union = (a: number, b: number): void => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  };

  transactions.forEach((t, i) => {
    if (t.referenceId && idToIndex.has(t.referenceId)) {
      union(i, idToIndex.get(t.referenceId)!);
    }
  });

  const groups = new Map<number, number[]>();
  transactions.forEach((_, i) => {
    const root = find(i);
    const list = groups.get(root);
    if (list) list.push(i);
    else groups.set(root, [i]);
  });

  // On ne lettre que les vrais rapprochements (>= 2 lignes).
  const realGroups = [...groups.values()].filter((g) => g.length > 1);

  const earliest = (g: number[]): number =>
    Math.min(
      ...g.map((i) => {
        const d = transactions[i].date;
        return d ? d.getTime() : Number.MAX_SAFE_INTEGER;
      })
    );
  realGroups.sort((a, b) => earliest(a) - earliest(b));

  let groupNo = 0;
  let lettredCount = 0;
  for (const g of realGroups) {
    groupNo += 1;
    const code = toLettrageCode(groupNo);
    for (const idx of g) {
      transactions[idx].lettrage = code;
      transactions[idx].group = groupNo;
      lettredCount += 1;
    }
  }

  return { groupCount: realGroups.length, lettredCount };
}
