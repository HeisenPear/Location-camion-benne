import { monthKey, monthLabel } from "./parse";
import type { MonthlyRow, Transaction } from "./types";

const NO_DATE_KEY = "9999-99";

/**
 * Agrege les operations par mois pour la saisie comptable et les declarations.
 * La TVA est une estimation : on suppose que le CA encaisse est TTC et on
 * applique le taux fourni (0.20 par defaut). A verifier selon le regime reel.
 */
export function buildMonthly(transactions: Transaction[], vatRate: number): MonthlyRow[] {
  const buckets = new Map<string, MonthlyRow>();

  const get = (key: string, label: string): MonthlyRow => {
    let row = buckets.get(key);
    if (!row) {
      row = {
        month: key,
        monthLabel: label,
        count: 0,
        ventesBrut: 0,
        frais: 0,
        remboursements: 0,
        netEncaisse: 0,
        retraitsBanque: 0,
        caTtc: 0,
        tva: 0,
        caHt: 0,
      };
      buckets.set(key, row);
    }
    return row;
  };

  for (const t of transactions) {
    const key = t.date ? monthKey(t.date) : NO_DATE_KEY;
    const label = t.date ? monthLabel(key) : "Sans date";
    const row = get(key, label);

    row.count += 1;
    row.frais += t.fee;

    switch (t.category) {
      case "VENTE":
        row.ventesBrut += t.gross;
        row.netEncaisse += t.net;
        break;
      case "REMBOURSEMENT":
        row.remboursements += t.gross;
        row.netEncaisse += t.net;
        break;
      case "LITIGE":
        row.remboursements += t.gross;
        row.netEncaisse += t.net;
        break;
      case "FRAIS":
        row.frais += t.gross;
        row.netEncaisse += t.net;
        break;
      case "RETRAIT_BANQUE":
        row.retraitsBanque += t.net || t.gross;
        break;
      default:
        break;
    }
  }

  for (const row of buckets.values()) {
    row.caTtc = row.ventesBrut + row.remboursements; // ventes nettes des remboursements
    row.caHt = vatRate > 0 ? row.caTtc / (1 + vatRate) : row.caTtc;
    row.tva = row.caTtc - row.caHt;
  }

  return [...buckets.values()].sort((a, b) => a.month.localeCompare(b.month));
}
