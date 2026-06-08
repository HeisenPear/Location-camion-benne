// Types partages par tout le moteur de lettrage.

/**
 * Categorie comptable normalisee d'une operation.
 * Elle est independante de la plateforme source : chaque profil traduit ses
 * propres libelles vers ces categories.
 */
export type Category =
  | "VENTE" // encaissement / paiement recu
  | "REMBOURSEMENT" // remboursement emis vers un client
  | "FRAIS" // commission / frais isole (ligne dediee)
  | "RETRAIT_BANQUE" // virement de la plateforme vers le compte bancaire
  | "RECHARGE_BANQUE" // approvisionnement depuis la banque / carte
  | "LITIGE" // chargeback, litige, annulation, reversal
  | "CONVERSION" // conversion de devise
  | "TRANSFERT" // envoi d'argent / paiement sortant (achat)
  | "AUTRE"; // non classe

export const CATEGORY_LABELS: Record<Category, string> = {
  VENTE: "Vente / encaissement",
  REMBOURSEMENT: "Remboursement",
  FRAIS: "Frais / commission",
  RETRAIT_BANQUE: "Retrait vers banque",
  RECHARGE_BANQUE: "Approvisionnement",
  LITIGE: "Litige / chargeback",
  CONVERSION: "Conversion de devise",
  TRANSFERT: "Transfert / achat",
  AUTRE: "Autre",
};

/**
 * Statut de presentation (avec pastille) utilise dans les feuilles Excel,
 * inspire de la structure de lettrage cible.
 */
export type Statut = "PAIEMENT" | "REMBOURSEMENT" | "RETRAIT" | "EN_ATTENTE" | "AUTRE";

/** Une ligne brute du CSV : entete -> valeur texte. */
export type RawRow = Record<string, string>;

/** Une operation normalisee, exploitable pour le lettrage. */
export interface Transaction {
  index: number; // position d'origine dans le fichier (1-based)
  date: Date | null;
  dateRaw: string;
  time: string;
  type: string; // libelle d'origine
  category: Category;
  name: string; // contrepartie / client
  email: string; // adresse email de la contrepartie
  currency: string;
  gross: number; // montant brut
  fee: number; // commission (negatif en general)
  net: number; // montant net
  balance: number | null; // solde apres operation
  article: string; // titre de l'objet / libelle article
  invoiceNumber: string; // numero de facture
  impact: string; // sens : Credit / Debit / Memo
  source: string; // source de paiement (PayPal, Pay Later...)
  country: string; // pays de l'acheteur
  bankId: string; // identifiant bancaire (pour les retraits)
  transactionId: string;
  referenceId: string; // numero de transaction associee
  status: string; // etat (Termine, En attente, Supprime...)
  pending: boolean; // operation en attente
  lettrage: string; // code de lettrage (rempli par le moteur)
  group: number; // identifiant interne du groupe lettre (0 = non lettre)
}

/** Champs normalises que l'on cherche a mapper depuis les entetes du CSV. */
export type Field =
  | "date"
  | "time"
  | "type"
  | "name"
  | "email"
  | "currency"
  | "gross"
  | "fee"
  | "net"
  | "balance"
  | "debit"
  | "credit"
  | "article"
  | "invoiceNumber"
  | "impact"
  | "source"
  | "country"
  | "bankId"
  | "transactionId"
  | "referenceId"
  | "status";

/** Resultat du mapping : pour chaque champ, l'entete reellement trouvee. */
export type ResolvedMapping = Partial<Record<Field, string>>;

/** Ligne de la feuille "Synthese mensuelle". */
export interface MonthlyRow {
  month: string; // "2026-01"
  monthLabel: string; // "Janvier 2026"
  count: number;
  ventesBrut: number;
  frais: number;
  remboursements: number;
  netEncaisse: number;
  retraitsBanque: number;
  caTtc: number;
  tva: number;
  caHt: number;
}

/** Indicateurs du tableau de bord (sur la periode de l'export). */
export interface DashboardStats {
  nbPaiements: number;
  caBrut: number;
  commissions: number;
  netEncaisse: number;
  nbRemboursements: number;
  totalRemboursements: number;
  nbRetraits: number;
  totalRetraits: number;
  nbAttente: number;
  totalAttente: number;
  nbAutres: number;
}

export interface PipelineStats {
  rowCount: number;
  txCount: number;
  groupCount: number; // nombre de groupes effectivement lettres (>1 ligne)
  lettredCount: number; // nombre de lignes portant un code de lettrage
  currencies: string[];
  periodStart: Date | null;
  periodEnd: Date | null;
}

export interface PipelineResult {
  transactions: Transaction[];
  mapping: ResolvedMapping;
  missingFields: Field[]; // champs essentiels introuvables
  monthly: MonthlyRow[];
  dashboard: DashboardStats;
  stats: PipelineStats;
  profileId: string;
  profileLabel: string;
  vatRate: number;
}
