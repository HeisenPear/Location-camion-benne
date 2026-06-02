import type { BankRow, Transaction } from "./types";

/**
 * Construit la liste des mouvements de tresorerie a pointer contre le releve
 * bancaire : retraits de la plateforme vers la banque et approvisionnements.
 * Ce sont les seules lignes qui apparaissent reellement sur le compte
 * bancaire ; les ventes/frais restent internes a la plateforme.
 */
export function buildBankRows(transactions: Transaction[]): BankRow[] {
  const rows: BankRow[] = transactions
    .filter((t) => t.category === "RETRAIT_BANQUE" || t.category === "RECHARGE_BANQUE")
    .map((t) => ({
      date: t.date,
      dateRaw: t.dateRaw,
      label: t.type || t.name || "Mouvement bancaire",
      category: t.category,
      amount: t.net || t.gross,
      currency: t.currency,
      balance: t.balance,
      transactionId: t.transactionId,
    }));

  rows.sort((a, b) => {
    const ta = a.date ? a.date.getTime() : 0;
    const tb = b.date ? b.date.getTime() : 0;
    return ta - tb;
  });

  return rows;
}
