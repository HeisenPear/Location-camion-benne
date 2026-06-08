import type ExcelJS from "exceljs";

export const FONT = "Arial";
// Format monetaire du gabarit (negatifs en rouge) + variante "total".
export const MONEY_FMT = '#,##0.00 €;[Red]-#,##0.00 €';
export const MONEY_TOTAL = '#,##0.00 €';

// Couleurs structurelles (ARGB) — identiques au gabarit de reference.
export const C = {
  navy: "FF1F3864", // bandeau / entete principal
  blue: "FF0D47A1", // entete virements / section virement
  slate: "FF546E7A", // sous-entete rapprochement
  dark: "FF263238", // ligne total fonce
  red: "FFB71C1C", // remboursements
  orange: "FFE65100", // titre anomalies
  anomHead: "FF37474F", // sous-entete anomalies
  purpleHead: "FF4A148C", // sous-entete Pay Later
  lettre: "FFFFF8E1", // cellule "Lettré" (jaune)
  subtotal: "FFECEFF1", // sous-total periode (rapprochement)
  white: "FFFFFFFF",
  creditTxt: "FF1B5E20", // texte Credit (vert)
  debitTxt: "FFB71C1C", // texte Debit (rouge)
  grayTxt: "FF546E7A", // references en italique
  ink: "FF000000",
} as const;

/** Couleur de fond par type de transaction (identique au gabarit). */
export const TYPE_FILL: Record<string, string> = {
  "paiement express checkout": "FFE8F5E9",
  "suspension de paiement": "FFFFF3E0",
  "remboursement de paiement": "FFFFEBEE",
  "retrait initie par l'utilisateur": "FFE3F2FD",
  "deblocage de paiement": "FFF3E5F5",
  "solde suspendu pour enquete sur un litige": "FFFFFDE7",
  "annulation de la suspension pour resolution du litige": "FFF1F8E9",
};
export const TYPE_FILL_DEFAULT = "FFFFFFFF";

const norm = (s: string): string =>
  (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Renvoie la couleur de fond associee a un type de transaction. */
export function fillForType(type: string): string {
  return TYPE_FILL[norm(type)] ?? TYPE_FILL_DEFAULT;
}

export function setFill(cell: ExcelJS.Cell, argb: string): void {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
}

/** Indice de colonne (1-based) -> lettre Excel. */
export function colLetter(n: number): string {
  let s = "";
  let x = n;
  while (x > 0) {
    x -= 1;
    s = String.fromCharCode(65 + (x % 26)) + s;
    x = Math.floor(x / 26);
  }
  return s;
}
