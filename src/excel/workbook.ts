import ExcelJS from "exceljs";
import { statutOf } from "../core/statut";
import type { PipelineResult, Transaction } from "../core/types";
import {
  COLORS,
  DATE_FMT,
  EURO_FMT,
  MONEY_FMT,
  STATUT_FILL,
  THEME,
  setFill,
  styleHeaderRow,
} from "./styles";

// Colonnes communes aux feuilles de mouvements (inspirees du fichier cible).
const TX_COLS = [
  { h: "Statut", w: 14 },
  { h: "Date", w: 12 },
  { h: "Heure", w: 9 },
  { h: "Client", w: 22 },
  { h: "Email client", w: 28 },
  { h: "Type transaction", w: 24 },
  { h: "État", w: 12 },
  { h: "Montant brut (€)", w: 15 },
  { h: "Commission (€)", w: 14 },
  { h: "Net (€)", w: 12 },
  { h: "Solde (€)", w: 12 },
  { h: "Article", w: 26 },
  { h: "N° Facture", w: 14 },
  { h: "Sens", w: 10 },
  { h: "Source", w: 12 },
  { h: "Pays", w: 7 },
  { h: "N° Transaction", w: 22 },
  { h: "Lettrage", w: 10 },
];
const TX_N = TX_COLS.length;
const MONEY_COLS = [8, 9, 10, 11];

const THIN = { style: "thin" as const, color: { argb: "FFCBD5E1" } };
const BOX = { top: THIN, left: THIN, bottom: THIN, right: THIN };

function euro(n: number): string {
  return `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}
function frDate(d: Date | null): string {
  return d ? d.toLocaleDateString("fr-FR") : "—";
}
function sum(txs: Transaction[], pick: (t: Transaction) => number): number {
  return txs.reduce((a, t) => a + pick(t), 0);
}

interface SpanOpts {
  font?: Partial<ExcelJS.Font>;
  align?: Partial<ExcelJS.Alignment>;
  fill?: string;
  numFmt?: string;
  border?: boolean;
}

/** Fusionne une plage, y place une valeur et applique un style. */
function span(
  ws: ExcelJS.Worksheet,
  r1: number,
  c1: number,
  r2: number,
  c2: number,
  value: ExcelJS.CellValue,
  opts: SpanOpts = {}
): ExcelJS.Cell {
  ws.mergeCells(r1, c1, r2, c2);
  const cell = ws.getCell(r1, c1);
  cell.value = value;
  if (opts.numFmt) cell.numFmt = opts.numFmt;
  if (opts.font) cell.font = opts.font;
  cell.alignment = opts.align ?? { vertical: "middle" };
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      if (opts.fill) setFill(ws.getCell(r, c), opts.fill);
      if (opts.border) ws.getCell(r, c).border = BOX;
    }
  }
  return cell;
}

// ---------------------------------------------------------------------------
// Feuilles de mouvements (Paiements, Remboursements, Autres, Tous)
// ---------------------------------------------------------------------------
function buildTxSheet(
  wb: ExcelJS.Workbook,
  name: string,
  themeKey: keyof typeof THEME,
  title: string,
  summary: string,
  txs: Transaction[]
): void {
  const theme = THEME[themeKey];
  const ws = wb.addWorksheet(name, { views: [{ state: "frozen", ySplit: 4 }] });

  TX_COLS.forEach((c, i) => (ws.getColumn(i + 1).width = c.w));
  for (const c of MONEY_COLS) {
    ws.getColumn(c).numFmt = MONEY_FMT;
    ws.getColumn(c).alignment = { horizontal: "right" };
  }
  ws.getColumn(2).numFmt = DATE_FMT;

  span(ws, 1, 1, 1, TX_N, title, {
    font: { bold: true, size: 14, color: { argb: "FFFFFFFF" } },
    align: { vertical: "middle", indent: 1 },
    fill: theme.title,
  });
  ws.getRow(1).height = 26;
  span(ws, 2, 1, 2, TX_N, summary, {
    font: { bold: true, size: 11, color: { argb: theme.title } },
    align: { vertical: "middle", indent: 1 },
    fill: theme.soft,
  });
  ws.getRow(2).height = 20;
  ws.getRow(3).height = 6;

  TX_COLS.forEach((c, i) => (ws.getCell(4, i + 1).value = c.h));
  styleHeaderRow(ws.getRow(4));

  let r = 5;
  for (const tx of txs) {
    const st = statutOf(tx);
    const values: ExcelJS.CellValue[] = [
      `${st.emoji} ${st.label}`,
      tx.date ?? tx.dateRaw,
      tx.time,
      tx.name,
      tx.email,
      tx.type,
      tx.status,
      tx.gross,
      tx.fee,
      tx.net,
      tx.balance ?? "",
      tx.article,
      tx.invoiceNumber,
      tx.impact,
      tx.source,
      tx.country,
      tx.transactionId,
      tx.lettrage,
    ];
    values.forEach((v, i) => (ws.getCell(r, i + 1).value = v));
    const statutCell = ws.getCell(r, 1);
    statutCell.font = { bold: true };
    setFill(statutCell, STATUT_FILL[st.key]);
    ws.getCell(r, 2).alignment = { horizontal: "center" };
    ws.getCell(r, 3).alignment = { horizontal: "center" };
    ws.getCell(r, 16).alignment = { horizontal: "center" };
    const lc = ws.getCell(r, 18);
    lc.alignment = { horizontal: "center" };
    if (tx.lettrage) lc.font = { bold: true, color: { argb: COLORS.title } };
    r += 1;
  }

  if (txs.length) {
    ws.getCell(r, 4).value = "TOTAL";
    ws.getCell(r, 8).value = sum(txs, (t) => t.gross);
    ws.getCell(r, 9).value = sum(txs, (t) => t.fee);
    ws.getCell(r, 10).value = sum(txs, (t) => t.net);
    for (let c = 1; c <= TX_N; c++) {
      const cell = ws.getCell(r, c);
      cell.font = { bold: true };
      setFill(cell, theme.soft);
      cell.border = { top: { style: "double", color: { argb: theme.title } } };
    }
  }

  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: TX_N } };
}

// ---------------------------------------------------------------------------
// Tableau de bord
// ---------------------------------------------------------------------------
function card(
  ws: ExcelJS.Worksheet,
  c1: number,
  c2: number,
  label: string,
  value: number,
  color: string,
  money: boolean
): void {
  span(ws, 4, c1, 4, c2, label, {
    font: { bold: true, size: 11, color: { argb: "FFFFFFFF" } },
    align: { horizontal: "center", vertical: "middle" },
    fill: color,
    border: true,
  });
  span(ws, 5, c1, 6, c2, value, {
    font: { bold: true, size: 18, color: { argb: color } },
    align: { horizontal: "center", vertical: "middle" },
    fill: "FFF8FAFC",
    numFmt: money ? EURO_FMT : "0",
    border: true,
  });
}

function card2(
  ws: ExcelJS.Worksheet,
  c1: number,
  c2: number,
  label: string,
  value: number,
  color: string,
  money: boolean
): void {
  span(ws, 8, c1, 8, c2, label, {
    font: { bold: true, size: 11, color: { argb: "FFFFFFFF" } },
    align: { horizontal: "center", vertical: "middle" },
    fill: color,
    border: true,
  });
  span(ws, 9, c1, 10, c2, value, {
    font: { bold: true, size: 16, color: { argb: color } },
    align: { horizontal: "center", vertical: "middle" },
    fill: "FFF8FAFC",
    numFmt: money ? EURO_FMT : "0",
    border: true,
  });
}

function buildDashboardSheet(wb: ExcelJS.Workbook, result: PipelineResult): void {
  const d = result.dashboard;
  const ws = wb.addWorksheet("📊 Tableau de bord");
  const N = 16;
  for (let c = 1; c <= N; c++) ws.getColumn(c).width = 9.5;

  const period = `${frDate(result.stats.periodStart)} → ${frDate(result.stats.periodEnd)}`;
  span(ws, 1, 1, 1, N, "📊 Tableau de bord — Lettrage PayPal", {
    font: { bold: true, size: 16, color: { argb: "FFFFFFFF" } },
    align: { vertical: "middle", indent: 1 },
    fill: THEME.dashboard.title,
  });
  ws.getRow(1).height = 32;
  span(
    ws,
    2,
    1,
    2,
    N,
    `Export ${result.profileLabel}  •  ${period}  •  ${result.stats.txCount} mouvements`,
    {
      font: { size: 11, color: { argb: THEME.dashboard.title } },
      align: { vertical: "middle", indent: 1 },
      fill: THEME.dashboard.soft,
    }
  );
  ws.getRow(2).height = 20;
  ws.getRow(3).height = 8;

  card(ws, 1, 4, "🟢 Paiements reçus", d.nbPaiements, THEME.paiements.title, false);
  card(ws, 5, 8, "💶 CA brut", d.caBrut, "FF4F46E5", true);
  card(ws, 9, 12, "💸 Commissions", d.commissions, THEME.remboursements.title, true);
  card(ws, 13, 16, "✅ Net encaissé", d.netEncaisse, THEME.dashboard.title, true);
  ws.getRow(7).height = 8;

  card2(ws, 1, 4, `🔴 Remboursements (${d.nbRemboursements})`, d.totalRemboursements, THEME.remboursements.title, true);
  card2(ws, 5, 8, `🔵 Retraits (${d.nbRetraits})`, d.totalRetraits, THEME.autres.title, true);
  card2(ws, 9, 12, `🟡 En attente (${d.nbAttente})`, d.totalAttente, "FFD97706", true);
  card2(ws, 13, 16, `⚪ Autres (${d.nbAutres})`, d.nbAutres, "FF64748B", false);
  ws.getRow(11).height = 10;

  // Detail des paiements
  span(ws, 12, 1, 12, N, "🟢 Détail des paiements reçus", {
    font: { bold: true, size: 12, color: { argb: "FFFFFFFF" } },
    align: { vertical: "middle", indent: 1 },
    fill: THEME.paiements.title,
  });
  ws.getRow(12).height = 22;

  const head = (c1: number, c2: number, label: string, left = false) =>
    span(ws, 13, c1, 13, c2, label, {
      font: { bold: true, color: { argb: "FFFFFFFF" } },
      align: { horizontal: left ? "left" : "center", vertical: "middle", indent: left ? 1 : 0 },
      fill: COLORS.header,
      border: true,
    });
  head(1, 2, "Date");
  head(3, 7, "Client", true);
  head(8, 9, "Brut (€)");
  head(10, 11, "Commission (€)");
  head(12, 13, "Net (€)");
  ws.getRow(13).height = 18;

  const payments = result.transactions.filter((t) => statutOf(t).key === "PAIEMENT");
  let r = 14;
  for (const tx of payments) {
    span(ws, r, 1, r, 2, tx.date ?? tx.dateRaw, {
      numFmt: DATE_FMT,
      align: { horizontal: "center" },
      border: true,
    });
    span(ws, r, 3, r, 7, tx.name, { align: { horizontal: "left", indent: 1 }, border: true });
    span(ws, r, 8, r, 9, tx.gross, { numFmt: MONEY_FMT, align: { horizontal: "right" }, border: true });
    span(ws, r, 10, r, 11, tx.fee, { numFmt: MONEY_FMT, align: { horizontal: "right" }, border: true });
    span(ws, r, 12, r, 13, tx.net, { numFmt: MONEY_FMT, align: { horizontal: "right" }, border: true });
    r += 1;
  }
  span(ws, r, 1, r, 7, "TOTAL", {
    font: { bold: true },
    align: { horizontal: "right", indent: 1 },
    fill: THEME.paiements.soft,
  });
  span(ws, r, 8, r, 9, sum(payments, (t) => t.gross), {
    numFmt: MONEY_FMT,
    font: { bold: true },
    align: { horizontal: "right" },
    fill: THEME.paiements.soft,
  });
  span(ws, r, 10, r, 11, sum(payments, (t) => t.fee), {
    numFmt: MONEY_FMT,
    font: { bold: true },
    align: { horizontal: "right" },
    fill: THEME.paiements.soft,
  });
  span(ws, r, 12, r, 13, sum(payments, (t) => t.net), {
    numFmt: MONEY_FMT,
    font: { bold: true },
    align: { horizontal: "right" },
    fill: THEME.paiements.soft,
  });
}

// ---------------------------------------------------------------------------
// Synthese mensuelle (complement)
// ---------------------------------------------------------------------------
function buildMonthlySheet(wb: ExcelJS.Workbook, result: PipelineResult): void {
  const theme = THEME.tous;
  const ws = wb.addWorksheet("📅 Synthèse mensuelle", { views: [{ state: "frozen", ySplit: 4 }] });
  const tvaPct = (result.vatRate * 100).toFixed(result.vatRate * 100 % 1 ? 1 : 0);
  const cols = [
    { h: "Mois", w: 18 },
    { h: "Nb opérations", w: 13 },
    { h: "Ventes brutes (€)", w: 16 },
    { h: "Frais (€)", w: 12 },
    { h: "Remboursements (€)", w: 17 },
    { h: "Net encaissé (€)", w: 15 },
    { h: "CA TTC (€)", w: 13 },
    { h: `TVA ${tvaPct}% (€)`, w: 13 },
    { h: "CA HT (€)", w: 13 },
    { h: "Retraits (€)", w: 14 },
  ];
  const n = cols.length;
  cols.forEach((c, i) => (ws.getColumn(i + 1).width = c.w));
  for (let c = 3; c <= n; c++) {
    ws.getColumn(c).numFmt = MONEY_FMT;
    ws.getColumn(c).alignment = { horizontal: "right" };
  }

  span(ws, 1, 1, 1, n, "📅 Synthèse mensuelle", {
    font: { bold: true, size: 14, color: { argb: "FFFFFFFF" } },
    align: { vertical: "middle", indent: 1 },
    fill: theme.title,
  });
  ws.getRow(1).height = 26;
  span(ws, 2, 1, 2, n, "TVA estimée — CA encaissé supposé TTC, à vérifier selon votre régime", {
    font: { italic: true, size: 10, color: { argb: theme.title } },
    align: { vertical: "middle", indent: 1 },
    fill: theme.soft,
  });
  ws.getRow(2).height = 18;
  ws.getRow(3).height = 6;

  cols.forEach((c, i) => (ws.getCell(4, i + 1).value = c.h));
  styleHeaderRow(ws.getRow(4));

  let r = 5;
  for (const m of result.monthly) {
    const vals = [
      m.monthLabel,
      m.count,
      m.ventesBrut,
      m.frais,
      m.remboursements,
      m.netEncaisse,
      m.caTtc,
      m.tva,
      m.caHt,
      m.retraitsBanque,
    ];
    vals.forEach((v, i) => (ws.getCell(r, i + 1).value = v));
    ws.getCell(r, 2).alignment = { horizontal: "center" };
    r += 1;
  }

  const sumM = (key: keyof (typeof result.monthly)[number]): number =>
    result.monthly.reduce((a, m) => a + (m[key] as number), 0);
  ws.getCell(r, 1).value = "TOTAL";
  [
    [2, "count"],
    [3, "ventesBrut"],
    [4, "frais"],
    [5, "remboursements"],
    [6, "netEncaisse"],
    [7, "caTtc"],
    [8, "tva"],
    [9, "caHt"],
    [10, "retraitsBanque"],
  ].forEach(([c, key]) => {
    ws.getCell(r, c as number).value = sumM(key as keyof (typeof result.monthly)[number]);
  });
  for (let c = 1; c <= n; c++) {
    const cell = ws.getCell(r, c);
    cell.font = { bold: true };
    setFill(cell, theme.soft);
    cell.border = { top: { style: "double", color: { argb: theme.title } } };
  }

  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: n } };
}

/** Construit le classeur Excel complet (structure inspiree du fichier cible). */
export function buildWorkbook(result: PipelineResult): ExcelJS.Workbook {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Lettrage Auto";
  wb.created = new Date();

  const txs = result.transactions;
  const paiements = txs.filter((t) => statutOf(t).key === "PAIEMENT");
  const remboursements = txs.filter((t) => statutOf(t).key === "REMBOURSEMENT");
  const autres = txs.filter((t) => {
    const k = statutOf(t).key;
    return k === "RETRAIT" || k === "EN_ATTENTE" || k === "AUTRE";
  });

  buildDashboardSheet(wb, result);

  buildTxSheet(
    wb,
    "🟢 Paiements",
    "paiements",
    `🟢 Paiements reçus — ${paiements.length} transaction(s)`,
    `CA brut : ${euro(result.dashboard.caBrut)}   •   Commissions : ${euro(
      result.dashboard.commissions
    )}   •   Net encaissé : ${euro(result.dashboard.netEncaisse)}`,
    paiements
  );

  buildTxSheet(
    wb,
    "🔴 Remboursements",
    "remboursements",
    `🔴 Remboursements — ${remboursements.length} transaction(s)`,
    `Total remboursé : ${euro(sum(remboursements, (t) => t.net || t.gross))}`,
    remboursements
  );

  buildTxSheet(
    wb,
    "🔵 Autres mouvements",
    "autres",
    `🔵 Autres mouvements — ${autres.length} transaction(s)`,
    `Retraits : ${euro(result.dashboard.totalRetraits)}   •   En attente : ${euro(
      result.dashboard.totalAttente
    )}`,
    autres
  );

  buildTxSheet(
    wb,
    "📋 Tous les mouvements",
    "tous",
    `📋 Tous les mouvements — ${txs.length} transaction(s)`,
    `Période ${frDate(result.stats.periodStart)} → ${frDate(
      result.stats.periodEnd
    )}   •   Net global : ${euro(sum(txs, (t) => t.net))}`,
    txs
  );

  buildMonthlySheet(wb, result);

  return wb;
}
