import type ExcelJS from "exceljs";
import type { Category } from "../core/types";

export const MONEY_FMT = "#,##0.00";
export const DATE_FMT = "dd/mm/yyyy";

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
