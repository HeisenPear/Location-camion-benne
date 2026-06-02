import type { Statut, Transaction } from "./types";

export interface StatutInfo {
  key: Statut;
  label: string;
}

const FAILED = /refus|echou|annul|supprim|denied|failed|expir|rejet|reverse|echec/;

/** Vrai si l'etat indique une operation echouee / annulee. */
export function isFailed(status: string): boolean {
  return FAILED.test(
    (status ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  );
}

/**
 * Statut de presentation d'une operation. La couleur (geree dans la feuille
 * Excel) sert de pastille : on n'utilise pas d'emoji, dont le rendu est
 * incoherent selon les versions d'Excel.
 *
 * Un paiement "en attente" devient sa propre categorie, et un paiement echoue
 * n'est pas compte comme un paiement valide.
 */
export function statutOf(t: Transaction): StatutInfo {
  if (t.pending) return { key: "EN_ATTENTE", label: "En attente" };

  switch (t.category) {
    case "VENTE":
      return isFailed(t.status)
        ? { key: "AUTRE", label: "Annulé" }
        : { key: "PAIEMENT", label: "Paiement" };
    case "REMBOURSEMENT":
    case "LITIGE":
      return { key: "REMBOURSEMENT", label: "Remboursement" };
    case "RETRAIT_BANQUE":
    case "RECHARGE_BANQUE":
      return { key: "RETRAIT", label: "Retrait" };
    default:
      return { key: "AUTRE", label: "Autre" };
  }
}

/** Paiement valide et encaisse (compte dans le CA). */
export function isCompletedPayment(t: Transaction): boolean {
  return statutOf(t).key === "PAIEMENT";
}
