import type { Category } from "../types";
import { includesAny, scoreHeaders, type Profile } from "./profile";

/**
 * Profil generique pour un releve bancaire ou un CSV inconnu.
 * Gere aussi bien une colonne "Montant" unique que des colonnes
 * "Debit" / "Credit" separees.
 */
export const genericProfile: Profile = {
  id: "generic",
  label: "Banque / generique",
  description: "Releve bancaire ou CSV avec colonnes Date / Libelle / Montant.",
  decimal: "auto",
  dateOrder: "auto",
  columns: {
    date: ["Date", "Date operation", "Date de valeur", "Date comptable", "Date d'operation"],
    type: ["Libelle", "Libelle simplifie", "Description", "Nature", "Label", "Motif", "Operation"],
    name: ["Beneficiaire", "Contrepartie", "Tiers", "Nom"],
    currency: ["Devise", "Currency"],
    gross: ["Montant", "Amount", "Montant operation"],
    debit: ["Debit", "Depense", "Sortie"],
    credit: ["Credit", "Recette", "Entree"],
    net: ["Net"],
    balance: ["Solde", "Balance"],
    transactionId: ["Reference", "Numero", "Id", "Reference operation"],
    status: ["Statut", "Status", "Etat"],
  },

  match(headers) {
    // Score base sur des colonnes generiques. Volontairement bas pour ne
    // gagner que si aucun profil specifique ne correspond mieux.
    const base = scoreHeaders(headers, [
      ["Date", "Date operation", "Date comptable"],
      ["Libelle", "Description", "Nature"],
      ["Montant", "Amount", "Debit", "Credit"],
    ]);
    return base * 0.6;
  },

  categorize(type, gross, net): Category {
    const amount = net || gross;
    if (includesAny(type, ["remboursement", "refund", "avoir"])) return "REMBOURSEMENT";
    if (includesAny(type, ["virement", "transfer"])) {
      return amount >= 0 ? "VENTE" : "RETRAIT_BANQUE";
    }
    if (includesAny(type, ["frais", "commission", "cotisation", "fee"])) return "FRAIS";
    if (includesAny(type, ["prelevement", "achat", "paiement carte", "card"])) return "TRANSFERT";
    if (amount > 0) return "VENTE";
    if (amount < 0) return "TRANSFERT";
    return "AUTRE";
  },
};
