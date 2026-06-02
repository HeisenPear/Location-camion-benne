import { statutOf } from "./statut";
import type { DashboardStats, Transaction } from "./types";

/**
 * Agrege les operations pour le tableau de bord (indicateurs de la periode).
 * Le CA / les commissions / le net ne comptent que les paiements valides
 * (ni remboursements, ni retraits, ni operations en attente).
 */
export function buildDashboard(transactions: Transaction[]): DashboardStats {
  const d: DashboardStats = {
    nbPaiements: 0,
    caBrut: 0,
    commissions: 0,
    netEncaisse: 0,
    nbRemboursements: 0,
    totalRemboursements: 0,
    nbRetraits: 0,
    totalRetraits: 0,
    nbAttente: 0,
    totalAttente: 0,
    nbAutres: 0,
  };

  for (const t of transactions) {
    switch (statutOf(t).key) {
      case "PAIEMENT":
        d.nbPaiements += 1;
        d.caBrut += t.gross;
        d.commissions += t.fee;
        d.netEncaisse += t.net;
        break;
      case "REMBOURSEMENT":
        d.nbRemboursements += 1;
        d.totalRemboursements += t.net || t.gross;
        break;
      case "RETRAIT":
        d.nbRetraits += 1;
        d.totalRetraits += t.net || t.gross;
        break;
      case "EN_ATTENTE":
        d.nbAttente += 1;
        d.totalAttente += t.gross;
        break;
      default:
        d.nbAutres += 1;
        break;
    }
  }

  const r2 = (n: number): number => Math.round(n * 100) / 100;
  d.caBrut = r2(d.caBrut);
  d.commissions = r2(d.commissions);
  d.netEncaisse = r2(d.netEncaisse);
  d.totalRemboursements = r2(d.totalRemboursements);
  d.totalRetraits = r2(d.totalRetraits);
  d.totalAttente = r2(d.totalAttente);
  return d;
}
