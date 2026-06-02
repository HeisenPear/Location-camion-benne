import type ExcelJS from "exceljs";
import type { Category, Statut } from "../core/types";

export const MONEY_FMT = "#,##0.00";
export const EURO_FMT = '#,##0.00\\ €';
export const DATE_FMT = "dd/mm/yyyy";

/** Palette par feuille (couleur de bandeau + fond clair assorti). */
export const THEME = {
  dashboard: { title: "FF1E3A8A", soft: "FFEAF1FF" },
  paiements: { title: "FF16A34A", soft: "FFEAF7EE" },
  remboursements: { title: "FFDC2626", soft: "FFFCEBEB" },
  autres: { title: "FF2563EB", soft: "FFEAF1FF" },
  tous: { title: "FF4F46E5", soft: "FFEEF0FF" },
} as const;

/** Teinte claire appliquee a toute la ligne selon le statut. */
export const STATUT_FILL: Record<Statut, string> = {
  PAIEMENT: "FFE7F6EC",
  REMBOURSEMENT: "FFFBE9E9",
  RETRAIT: "FFE7EFFC",
  EN_ATTENTE: "FFFDF3D6",
  AUTRE: "FFF1F3F5",
};

/** Couleur pleine de la pastille (cellule "Statut"). */
export const STATUT_COLOR: Record<Statut, string> = {
  PAIEMENT: "FF16A34A",
  REMBOURSEMENT: "FFDC2626",
  RETRAIT: "FF2563EB",
  EN_ATTENTE: "FFD97706",
  AUTRE: "FF64748B",
};

export const COLORS = {
  header: "FF1E3A8A", // bleu fonce
  headerFont: "FFFFFFFF",
  total: "FFDCE6FF",
  bandStrong: "FFD7E3FF",
  bandLight: "FFEFF4FF",
  border: "FFB8C4DE",
  title: "FF2563EB",
};

/** Teintes de fond par categorie, pour reperer les types d'un coup d'oeil. */
export const CATEGORY_FILL: Record<Category, string> = {
  VENTE: "FFE6F4EA",
  REMBOURSEMENT: "FFFCE8E6",
  FRAIS: "FFFFF3E0",
  RETRAIT_BANQUE: "FFE8EEFC",
  RECHARGE_BANQUE: "FFEDE7F6",
  LITIGE: "FFFDE0E4",
  CONVERSION: "FFE3F3F3",
  TRANSFERT: "FFF1F3F5",
  AUTRE: "FFF1F3F5",
};

export function setFill(cell: ExcelJS.Cell, argb: string): void {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
}

export function thinBorder(cell: ExcelJS.Cell): void {
  const side = { style: "thin" as const, color: { argb: COLORS.border } };
  cell.border = { top: side, left: side, bottom: side, right: side };
}

/** Met en forme la ligne d'entete (ligne 1) d'une feuille. */
export function styleHeaderRow(row: ExcelJS.Row): void {
  row.height = 22;
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: COLORS.headerFont } };
    setFill(cell, COLORS.header);
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    thinBorder(cell);
  });
}

/** Indice de colonne (1-based) -> lettre Excel (1 -> A, 27 -> AA). */
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
