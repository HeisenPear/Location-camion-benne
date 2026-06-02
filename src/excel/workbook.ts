import ExcelJS from "exceljs";
import { CATEGORY_LABELS, type PipelineResult, type Transaction } from "../core/types";
import {
  CATEGORY_FILL,
  COLORS,
  DATE_FMT,
  MONEY_FMT,
  colLetter,
  setFill,
  styleHeaderRow,
} from "./styles";

interface ColDef {
  key: string;
  header: string;
  width: number;
  money?: boolean;
  date?: boolean;
  center?: boolean;
}

function setupColumns(ws: ExcelJS.Worksheet, defs: ColDef[]): void {
  ws.columns = defs.map((d) => ({ header: d.header, key: d.key, width: d.width }));
  defs.forEach((d, i) => {
    const col = ws.getColumn(i + 1);
    if (d.money) col.numFmt = MONEY_FMT;
    if (d.money) col.alignment = { horizontal: "right" };
    if (d.date) {
      col.numFmt = DATE_FMT;
      col.alignment = { horizontal: "center" };
    }
    if (d.center) col.alignment = { horizontal: "center" };
  });
}

function finishSheet(ws: ExcelJS.Worksheet, colCount: number): void {
  styleHeaderRow(ws.getRow(1));
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.autoFilter = { from: "A1", to: `${colLetter(colCount)}1` };
}

function addTotalRow(
  ws: ExcelJS.Worksheet,
  values: Record<string, number | string>,
  colCount: number
): ExcelJS.Row {
  const row = ws.addRow(values);
  row.eachCell({ includeEmpty: true }, (cell, col) => {
    if (col > colCount) return;
    cell.font = { bold: true };
    setFill(cell, COLORS.total);
    cell.border = { top: { style: "double", color: { argb: COLORS.header } } };
  });
  return row;
}

// ---------------------------------------------------------------------------
// Feuille 1 : Lettrage
// ---------------------------------------------------------------------------
function buildLettrageSheet(wb: ExcelJS.Workbook, result: PipelineResult): void {
  const defs: ColDef[] = [
    { key: "index", header: "N°", width: 6, center: true },
    { key: "date", header: "Date", width: 12, date: true },
    { key: "time", header: "Heure", width: 9, center: true },
    { key: "category", header: "Catégorie", width: 20 },
    { key: "type", header: "Type", width: 26 },
    { key: "name", header: "Nom / description", width: 28 },
    { key: "currency", header: "Devise", width: 8, center: true },
    { key: "gross", header: "Brut", width: 12, money: true },
    { key: "fee", header: "Frais", width: 11, money: true },
    { key: "net", header: "Net", width: 12, money: true },
    { key: "balance", header: "Solde", width: 13, money: true },
    { key: "transactionId", header: "N° transaction", width: 20 },
    { key: "referenceId", header: "Réf. associée", width: 20 },
    { key: "lettrage", header: "Lettrage", width: 10, center: true },
    { key: "status", header: "Statut", width: 12, center: true },
  ];
  const ws = wb.addWorksheet("Lettrage");
  setupColumns(ws, defs);

  // Couleur de fond par groupe lettre (deux teintes alternees).
  const groupColor = new Map<number, string>();
  let toggle = 0;
  for (const t of result.transactions) {
    if (t.group > 0 && !groupColor.has(t.group)) {
      groupColor.set(t.group, toggle % 2 === 0 ? COLORS.bandLight : COLORS.bandStrong);
      toggle += 1;
    }
  }

  result.transactions.forEach((t) => {
    const row = ws.addRow({
      index: t.index,
      date: t.date ?? t.dateRaw,
      time: t.time,
      category: CATEGORY_LABELS[t.category],
      type: t.type,
      name: t.name,
      currency: t.currency,
      gross: t.gross,
      fee: t.fee,
      net: t.net,
      balance: t.balance ?? "",
      transactionId: t.transactionId,
      referenceId: t.referenceId,
      lettrage: t.lettrage,
      status: t.status,
    });

    if (t.group > 0) {
      const color = groupColor.get(t.group)!;
      row.eachCell({ includeEmpty: true }, (cell, col) => {
        if (col <= defs.length) setFill(cell, color);
      });
    }
    // La cellule Categorie garde sa couleur propre, plus lisible.
    setFill(row.getCell("category"), CATEGORY_FILL[t.category]);
    const lettrageCell = row.getCell("lettrage");
    lettrageCell.font = { bold: true };
    lettrageCell.alignment = { horizontal: "center" };
  });

  const sum = (pick: (t: Transaction) => number): number =>
    result.transactions.reduce((acc, t) => acc + pick(t), 0);
  addTotalRow(
    ws,
    {
      type: "TOTAL",
      gross: sum((t) => t.gross),
      fee: sum((t) => t.fee),
      net: sum((t) => t.net),
    },
    defs.length
  );

  finishSheet(ws, defs.length);
}

// ---------------------------------------------------------------------------
// Feuille 2 : Rapprochement banque
// ---------------------------------------------------------------------------
function buildBankSheet(wb: ExcelJS.Workbook, result: PipelineResult): void {
  const defs: ColDef[] = [
    { key: "date", header: "Date", width: 12, date: true },
    { key: "label", header: "Libellé", width: 32 },
    { key: "category", header: "Catégorie", width: 20 },
    { key: "amount", header: "Montant", width: 14, money: true },
    { key: "currency", header: "Devise", width: 8, center: true },
    { key: "balance", header: "Solde plateforme", width: 16, money: true },
    { key: "pointe", header: "Pointé banque", width: 14, center: true },
    { key: "ecart", header: "Écart", width: 12, money: true },
    { key: "comment", header: "Commentaire", width: 30 },
  ];
  const ws = wb.addWorksheet("Rapprochement banque");
  setupColumns(ws, defs);

  result.bankRows.forEach((b) => {
    const row = ws.addRow({
      date: b.date ?? b.dateRaw,
      label: b.label,
      category: CATEGORY_LABELS[b.category],
      amount: b.amount,
      currency: b.currency,
      balance: b.balance ?? "",
      pointe: "",
      ecart: "",
      comment: "",
    });
    setFill(row.getCell("category"), CATEGORY_FILL[b.category]);
    // Liste deroulante pour pointer chaque ligne contre le releve.
    row.getCell("pointe").dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"OK,A pointer,Écart"'],
    };
  });

  addTotalRow(
    ws,
    { label: "TOTAL mouvements", amount: result.bankRows.reduce((s, b) => s + b.amount, 0) },
    defs.length
  );

  finishSheet(ws, defs.length);
}

// ---------------------------------------------------------------------------
// Feuille 3 : Synthese mensuelle
// ---------------------------------------------------------------------------
function buildMonthlySheet(wb: ExcelJS.Workbook, result: PipelineResult): void {
  const tvaHeader = `TVA (${(result.vatRate * 100).toFixed(result.vatRate * 100 % 1 ? 1 : 0)}%)`;
  const defs: ColDef[] = [
    { key: "month", header: "Mois", width: 18 },
    { key: "count", header: "Nb opérations", width: 13, center: true },
    { key: "ventesBrut", header: "Ventes brutes", width: 14, money: true },
    { key: "frais", header: "Frais", width: 12, money: true },
    { key: "remboursements", header: "Remboursements", width: 15, money: true },
    { key: "netEncaisse", header: "Net encaissé", width: 14, money: true },
    { key: "caTtc", header: "CA TTC", width: 13, money: true },
    { key: "tva", header: tvaHeader, width: 13, money: true },
    { key: "caHt", header: "CA HT", width: 13, money: true },
    { key: "retraitsBanque", header: "Retraits banque", width: 15, money: true },
  ];
  const ws = wb.addWorksheet("Synthèse mensuelle");
  setupColumns(ws, defs);

  result.monthly.forEach((m) => {
    ws.addRow({
      month: m.monthLabel,
      count: m.count,
      ventesBrut: m.ventesBrut,
      frais: m.frais,
      remboursements: m.remboursements,
      netEncaisse: m.netEncaisse,
      caTtc: m.caTtc,
      tva: m.tva,
      caHt: m.caHt,
      retraitsBanque: m.retraitsBanque,
    });
  });

  const sum = (key: keyof (typeof result.monthly)[number]): number =>
    result.monthly.reduce((acc, m) => acc + (m[key] as number), 0);
  addTotalRow(
    ws,
    {
      month: "TOTAL",
      count: sum("count"),
      ventesBrut: sum("ventesBrut"),
      frais: sum("frais"),
      remboursements: sum("remboursements"),
      netEncaisse: sum("netEncaisse"),
      caTtc: sum("caTtc"),
      tva: sum("tva"),
      caHt: sum("caHt"),
      retraitsBanque: sum("retraitsBanque"),
    },
    defs.length
  );

  finishSheet(ws, defs.length);
}

// ---------------------------------------------------------------------------
// Feuille 4 : Infos
// ---------------------------------------------------------------------------
function fmtDate(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleDateString("fr-FR");
}

function buildInfoSheet(wb: ExcelJS.Workbook, result: PipelineResult): void {
  const ws = wb.addWorksheet("Infos");
  ws.columns = [
    { key: "a", width: 28 },
    { key: "b", width: 50 },
  ];

  const title = ws.addRow(["Lettrage Auto — fichier généré"]);
  title.font = { bold: true, size: 16, color: { argb: COLORS.title } };
  ws.addRow([]);

  const info: [string, string][] = [
    ["Généré le", new Date().toLocaleString("fr-FR")],
    ["Plateforme détectée", result.profileLabel],
    ["Lignes lues", String(result.stats.rowCount)],
    ["Opérations", String(result.stats.txCount)],
    ["Groupes lettrés", String(result.stats.groupCount)],
    ["Lignes lettrées", String(result.stats.lettredCount)],
    ["Devises", result.stats.currencies.join(", ") || "—"],
    ["Période", `${fmtDate(result.stats.periodStart)} → ${fmtDate(result.stats.periodEnd)}`],
    ["Taux de TVA (estimation)", `${(result.vatRate * 100).toFixed(0)} %`],
  ];
  for (const [label, value] of info) {
    const row = ws.addRow([label, value]);
    row.getCell(1).font = { bold: true };
  }

  ws.addRow([]);
  const mapTitle = ws.addRow(["Correspondance des colonnes"]);
  mapTitle.font = { bold: true, size: 12 };
  for (const [field, header] of Object.entries(result.mapping)) {
    ws.addRow([field, header]);
  }
  if (result.missingFields.length) {
    const warn = ws.addRow([
      "Champs introuvables",
      result.missingFields.join(", "),
    ]);
    warn.getCell(1).font = { bold: true, color: { argb: "FFB00020" } };
    warn.getCell(2).font = { color: { argb: "FFB00020" } };
  }

  ws.addRow([]);
  const legendTitle = ws.addRow(["Légende des catégories"]);
  legendTitle.font = { bold: true, size: 12 };
  (Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).forEach((cat) => {
    const row = ws.addRow([cat, CATEGORY_LABELS[cat]]);
    setFill(row.getCell(1), CATEGORY_FILL[cat]);
  });

  ws.addRow([]);
  const note = ws.addRow([
    "Note",
    "Le code de lettrage relie les opérations liées (paiement, frais, remboursement) partageant une même référence. La TVA est une estimation à vérifier selon votre régime.",
  ]);
  note.getCell(1).font = { bold: true };
  note.getCell(2).alignment = { wrapText: true };
}

/** Construit le classeur Excel complet a partir du resultat du pipeline. */
export function buildWorkbook(result: PipelineResult): ExcelJS.Workbook {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Lettrage Auto";
  wb.created = new Date();

  buildLettrageSheet(wb, result);
  buildBankSheet(wb, result);
  buildMonthlySheet(wb, result);
  buildInfoSheet(wb, result);

  return wb;
}
