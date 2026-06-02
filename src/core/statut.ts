import type { Statut, Transaction } from "./types";

export interface StatutInfo {
  key: Statut;
  emoji: string;
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
 * Statut de presentation (pastille) d'une operation, inspire de la structure
 * de lettrage cible : un paiement "en attente" devient sa propre categorie,
 * et un paiement echoue n'est pas compte comme un paiement valide.
 */
export function statutOf(t: Transaction): StatutInfo {
  if (t.pending) return { key: "EN_ATTENTE", emoji: "\u{1F7E1}", label: "En attente" };

  switch (t.category) {
    case "VENTE":
      return isFailed(t.status)
        ? { key: "AUTRE", emoji: "⚪", label: "Annulé" }
        : { key: "PAIEMENT", emoji: "\u{1F7E2}", label: "Paiement" };
    case "REMBOURSEMENT":
    case "LITIGE":
      return { key: "REMBOURSEMENT", emoji: "\u{1F534}", label: "Remboursement" };
    case "RETRAIT_BANQUE":
    case "RECHARGE_BANQUE":
      return { key: "RETRAIT", emoji: "\u{1F535}", label: "Retrait" };
    default:
      return { key: "AUTRE", emoji: "⚪", label: "Autre" };
  }
}

/** Paiement valide et encaisse (compte dans le CA). */
export function isCompletedPayment(t: Transaction): boolean {
  return statutOf(t).key === "PAIEMENT";
}
