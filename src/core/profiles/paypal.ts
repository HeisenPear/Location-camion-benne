import type { Category } from "../types";
import { includesAny, scoreHeaders, type Profile } from "./profile";

/**
 * Profil PayPal (exports "Activite" / "Transactions", FR et EN).
 * Couvre les variantes d'entetes les plus courantes.
 */
export const paypalProfile: Profile = {
  id: "paypal",
  label: "PayPal",
  description: "Export d'activite PayPal (FR / EN).",
  decimal: "auto",
  dateOrder: "auto",
  columns: {
    date: ["Date"],
    time: ["Time", "Heure"],
    type: ["Type", "Type de transaction", "Description"],
    name: ["Name", "Nom", "Nom de l'expediteur", "Objet"],
    currency: ["Currency", "Devise"],
    gross: [
      "Gross",
      "Brut",
      "Montant brut",
      "Avant commission",
      "Montant avant commission",
    ],
    fee: ["Fee", "Frais", "Commission", "Frais PayPal"],
    net: ["Net", "Montant net"],
    balance: ["Balance", "Solde"],
    transactionId: [
      "Transaction ID",
      "Numero de transaction",
      "ID de transaction",
      "Numero de l'operation",
    ],
    referenceId: [
      "Reference Txn ID",
      "Reference Transaction ID",
      "Numero de transaction de reference",
      "Numero de la transaction de reference",
      "Reference du numero de transaction associe",
      "Reference de la transaction associee",
    ],
    status: ["Status", "Etat", "Statut"],
  },

  match(headers) {
    // Entetes signatures de PayPal : un numero de transaction de reference et
    // la presence simultanee de brut / frais / net.
    return scoreHeaders(headers, [
      ["Transaction ID", "Numero de transaction", "ID de transaction"],
      [
        "Reference Txn ID",
        "Numero de transaction de reference",
        "Numero de la transaction de reference",
      ],
      ["Gross", "Brut", "Avant commission"],
      ["Fee", "Frais", "Commission"],
      ["Net", "Montant net"],
      ["Type", "Description"],
    ]);
  },

  categorize(type, gross, net): Category {
    const amount = net || gross;

    if (includesAny(type, ["remboursement", "refund"])) return "REMBOURSEMENT";

    if (
      includesAny(type, [
        "retrait",
        "virement vers",
        "withdraw",
        "general withdrawal",
        "retrait de fonds",
        "transfer to bank",
        "transfert vers votre banque",
      ])
    ) {
      return "RETRAIT_BANQUE";
    }

    if (
      includesAny(type, [
        "ajout de fonds",
        "approvisionnement",
        "recharge",
        "add funds",
        "bank deposit",
        "depuis une banque",
      ])
    ) {
      return "RECHARGE_BANQUE";
    }

    if (
      includesAny(type, [
        "litige",
        "chargeback",
        "dispute",
        "annulation",
        "reversal",
        "retrofacturation",
        "rejet",
      ])
    ) {
      return "LITIGE";
    }

    if (includesAny(type, ["conversion", "change de devise", "currency conversion"])) {
      return "CONVERSION";
    }

    if (includesAny(type, ["frais", "fee", "commission"])) return "FRAIS";

    if (
      includesAny(type, [
        "paiement",
        "payment",
        "vente",
        "commande",
        "order",
        "facture",
        "invoice",
        "don",
        "donation",
        "abonnement",
        "subscription",
        "checkout",
        "encaissement",
        "recu",
        "received",
      ])
    ) {
      return amount >= 0 ? "VENTE" : "TRANSFERT";
    }

    if (includesAny(type, ["envoi", "sent", "transfert", "transfer", "payout"])) {
      return "TRANSFERT";
    }

    if (amount > 0) return "VENTE";
    if (amount < 0) return "TRANSFERT";
    return "AUTRE";
  },
};
