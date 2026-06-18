import ExcelJS from "exceljs";
import type { PipelineResult, Transaction } from "../core/types";
import { C, FONT, MONEY_FMT, MONEY_TOTAL, colLetter, fillForType, setFill } from "./styles";

// ---------------------------------------------------------------------------
// Helpers de mise en forme (police Arial partout, comme le gabarit)
// ---------------------------------------------------------------------------
interface CellOpts {
  fill?: string;
  bold?: boolean;
  italic?: boolean;
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
  wrap?: boolean;
  numFmt?: string;
}

function put(
  ws: ExcelJS.Worksheet,
  r: number,
  c: number,
  value: ExcelJS.CellValue,
  o: CellOpts = {}
): ExcelJS.Cell {
  const cell = ws.getCell(r, c);
  cell.value = value;
  cell.font = {
    name: FONT,
    size: o.size ?? 9,
    bold: !!o.bold,
    italic: !!o.italic,
    color: { argb: o.color ?? C.ink },
  };
  cell.alignment = { vertical: "middle", horizontal: o.align ?? "left", wrapText: !!o.wrap };
  if (o.fill) setFill(cell, o.fill);
  if (o.numFmt) cell.numFmt = o.numFmt;
  return cell;
}

/** Bandeau / section fusionne sur toute la largeur. */
function band(
  ws: ExcelJS.Worksheet,
  r: number,
  lastCol: number,
  text: string,
  o: CellOpts
): void {
  ws.mergeCells(r, 1, r, lastCol);
  put(ws, r, 1, text, o);
}

/** Ligne d'entete de colonnes (fond plein, blanc gras, centre). */
function headerRow(
  ws: ExcelJS.Worksheet,
  r: number,
  labels: string[],
  fill: string,
  height = 28,
  size = 10
): void {
  ws.getRow(r).height = height;
  labels.forEach((label, i) =>
    put(ws, r, i + 1, label, { fill, bold: true, color: C.white, align: "center", wrap: true, size })
  );
}

const eur = (n: number): string =>
  `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const norm = (s: string): string =>
  (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const isRetrait = (t: Transaction): boolean => norm(t.type).includes("retrait");
const isRemboursement = (t: Transaction): boolean => norm(t.type).includes("remboursement");
const isCredit = (t: Transaction): boolean =>
  norm(t.impact).startsWith("cred") || (!t.impact && t.net >= 0);
const isPayLater = (t: Transaction): boolean => norm(t.source).includes("pay later");
const isVente = (t: Transaction): boolean => {
  const n = norm(t.type);
  if (/suspension|deblocage|annulation|retrait|remboursement|litige/.test(n)) return false;
  return t.net > 0;
};
/** HT/TVA d'une ligne : ventes à partir du brut TTC, remboursements du net. */
function htTvaForLine(t: Transaction, rate: number): { ht: number; tva: number } | null {
  let ttc: number | null = null;
  if (isVente(t)) ttc = t.gross;
  else if (isRemboursement(t)) ttc = t.net;
  if (ttc === null) return null;
  const ht = ttc / (1 + rate);
  return { ht, tva: ttc - ht };
}

function timeMs(time: string): number {
  const m = (time || "").match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return 0;
  return Number(m[1]) * 3600000 + Number(m[2]) * 60000 + Number(m[3] || 0) * 1000;
}
/** Horodatage complet (date + heure) pour trier/decouper finement. */
function stamp(t: Transaction): number {
  return (t.date ? t.date.getTime() : 0) + timeMs(t.time);
}

function sortChrono(txs: Transaction[]): Transaction[] {
  return [...txs].sort((a, b) => stamp(a) - stamp(b) || a.index - b.index);
}

// ---------------------------------------------------------------------------
// 1. Transactions PayPal
// ---------------------------------------------------------------------------
const TX_HEADERS = [
  "Date", "Heure", "Nom du client", "Type de transaction", "État",
  "Montant brut (€)", "Commission (€)", "Net reçu (€)", "Impact", "Solde (€)",
  "N° Facture", "Référence commande", "N° Transaction PayPal", "N° Transaction origine",
  "Email client", "Source paiement", "Pays", "Lettrage",
];
const TX_WIDTHS = [12, 10, 28, 32, 12, 16, 15, 15, 10, 15, 20, 26, 22, 22, 34, 14, 7, 20];

function buildTransactions(wb: ExcelJS.Workbook, txs: Transaction[], rate: number): void {
  const ws = wb.addWorksheet("Transactions PayPal", { views: [{ state: "frozen", ySplit: 1 }] });
  const pct = Number((rate * 100).toFixed((rate * 100) % 1 ? 1 : 0));
  const headers = [...TX_HEADERS, "Montant HT (€)", `TVA ${pct} % (€)`];
  const widths = [...TX_WIDTHS, 15, 14];
  widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
  headerRow(ws, 1, headers, C.navy, 36, 10);

  let r = 2;
  for (const t of txs) {
    const fill = fillForType(t.type);
    const money = { align: "right" as const, numFmt: MONEY_FMT };
    put(ws, r, 1, t.dateRaw, { fill });
    put(ws, r, 2, t.time, { fill });
    put(ws, r, 3, t.name, { fill });
    put(ws, r, 4, t.type, { fill });
    put(ws, r, 5, t.status, { fill });
    put(ws, r, 6, t.gross, { fill, ...money });
    put(ws, r, 7, t.fee, { fill, ...money });
    put(ws, r, 8, t.net, { fill, ...money });
    put(ws, r, 9, t.impact, { fill });
    put(ws, r, 10, t.balance ?? "", { fill, ...money });
    put(ws, r, 11, t.invoiceNumber, { fill });
    put(ws, r, 12, t.article, { fill });
    put(ws, r, 13, t.transactionId, { fill });
    put(ws, r, 14, t.referenceId, { fill });
    put(ws, r, 15, t.email, { fill });
    put(ws, r, 16, t.source, { fill });
    put(ws, r, 17, t.country, { fill, align: "center" });
    put(ws, r, 18, t.lettrage, { fill, align: "center" });
    const vt = htTvaForLine(t, rate);
    put(ws, r, 19, vt ? vt.ht : "", { fill, ...money });
    put(ws, r, 20, vt ? vt.tva : "", { fill, ...money });
    ws.getRow(r).height = 16;
    r += 1;
  }
  ws.autoFilter = { from: "A1", to: `${colLetter(20)}1` };
}

// ---------------------------------------------------------------------------
// Decoupage par virement (utilise par Virements + Rapprochement)
// ---------------------------------------------------------------------------
interface Periode {
  retrait: Transaction | null; // null = periode en cours (non viree)
  start: string;
  end: string;
  txs: Transaction[]; // transactions hors retrait
}

function decouperParVirement(txs: Transaction[]): Periode[] {
  const retraits = txs.filter(isRetrait);
  const others = txs.filter((t) => !isRetrait(t));
  const bounds = retraits.map(stamp);
  const firstDate = txs.length ? txs[0].dateRaw : "";

  const groups: Transaction[][] = retraits.map(() => []);
  const enCours: Transaction[] = [];
  for (const t of others) {
    const td = stamp(t);
    const idx = bounds.findIndex((b) => td <= b);
    if (idx === -1) enCours.push(t);
    else groups[idx].push(t);
  }

  const periodes: Periode[] = retraits.map((retrait, i) => ({
    retrait,
    start: i === 0 ? firstDate : retraits[i - 1].dateRaw,
    end: retrait.dateRaw,
    txs: groups[i],
  }));
  if (enCours.length && retraits.length) {
    periodes.push({
      retrait: null,
      start: retraits[retraits.length - 1].dateRaw,
      end: enCours[enCours.length - 1].dateRaw,
      txs: enCours,
    });
  } else if (enCours.length) {
    periodes.push({ retrait: null, start: firstDate, end: enCours[enCours.length - 1].dateRaw, txs: enCours });
  }
  return periodes;
}

// ---------------------------------------------------------------------------
// 2. Virements Banque
// ---------------------------------------------------------------------------
function buildVirements(wb: ExcelJS.Workbook, periodes: Periode[]): void {
  const ws = wb.addWorksheet("Virements Banque");
  [6, 14, 14, 18, 28, 18, 18, 22, 22, 16].forEach((w, i) => (ws.getColumn(i + 1).width = w));

  band(ws, 1, 10, "VIREMENTS PAYPAL → BANQUE  —  Feuille de lettrage", {
    fill: C.navy, bold: true, color: C.white, size: 13, align: "center", wrap: true,
  });
  ws.getRow(1).height = 34;
  headerRow(ws, 2, [
    "#", "Date virement", "Heure", "Période couverte", "Identifiant bancaire",
    "Montant viré (€)", "Solde PayPal restant (€)", "N° transactions", "N° Crédits nets", "✓ Lettré",
  ], C.blue, 28, 10);

  let r = 3;
  let num = 1;
  let totalVire = 0;
  for (const p of periodes) {
    const fill = p.retrait ? "FFE3F2FD" : "FFFFFDE7";
    const creditsNets = p.txs.filter(isCredit).reduce((s, t) => s + t.net, 0);
    const montant = p.retrait ? p.retrait.net : 0;
    totalVire += montant;
    put(ws, r, 1, num, { fill, align: "center", size: 10 });
    put(ws, r, 2, p.retrait ? p.retrait.dateRaw : "En cours", { fill, size: 10 });
    put(ws, r, 3, p.retrait ? p.retrait.time : "—", { fill, size: 10 });
    put(ws, r, 4, `${p.start} → ${p.end}${p.retrait ? "" : " (non viré)"}`, { fill, size: 10 });
    put(ws, r, 5, p.retrait ? p.retrait.bankId || "—" : "—", { fill, italic: true, size: 9, color: C.grayTxt });
    put(ws, r, 6, montant, { fill, bold: true, align: "right", numFmt: MONEY_FMT, size: 10 });
    put(ws, r, 7, p.retrait ? p.retrait.balance ?? "" : lastBalance(p.txs), { fill, align: "right", numFmt: MONEY_FMT, size: 10 });
    put(ws, r, 8, p.txs.length, { fill, align: "center", size: 10 });
    put(ws, r, 9, creditsNets, { fill, align: "right", numFmt: MONEY_FMT, size: 10 });
    put(ws, r, 10, p.retrait ? "" : "En cours", { fill: C.lettre, align: "center", size: 10 });
    ws.getRow(r).height = 20;
    r += 1;
    num += 1;
  }

  r += 1; // ligne vide
  const totalRow = r;
  ws.mergeCells(totalRow, 1, totalRow, 5);
  put(ws, totalRow, 1, "TOTAL VIREMENTS REÇUS EN BANQUE", { fill: C.dark, bold: true, color: C.white, align: "right", size: 10 });
  for (let c = 2; c <= 5; c++) setFill(ws.getCell(totalRow, c), C.dark);
  put(ws, totalRow, 6, totalVire, { fill: C.dark, bold: true, color: C.white, align: "right", numFmt: MONEY_TOTAL, size: 11 });
  for (let c = 7; c <= 10; c++) setFill(ws.getCell(totalRow, c), C.dark);
  ws.getRow(totalRow).height = 22;

  const noteRow = totalRow + 2;
  band(ws, noteRow, 10,
    "ℹ️  Pour lettrer : Retrouvez chaque 'Identifiant bancaire' dans votre relevé bancaire. Le montant doit correspondre exactement à 'Montant viré'. Cochez la colonne ✓ Lettré.",
    { italic: true, size: 9, color: C.grayTxt, wrap: true });
}

function lastBalance(txs: Transaction[]): number | string {
  for (let i = txs.length - 1; i >= 0; i--) if (txs[i].balance != null) return txs[i].balance as number;
  return "";
}

// ---------------------------------------------------------------------------
// 3. Rapprochement par virement
// ---------------------------------------------------------------------------
const RAP_SUB = ["#", "Date", "Heure", "Nom client", "Type transaction", "Brut (€)", "Commission (€)", "Net (€)", "Impact", "N° Facture", "N° Transaction"];

function buildRapprochement(wb: ExcelJS.Workbook, periodes: Periode[]): void {
  const ws = wb.addWorksheet("Rapprochement");
  [6, 13, 10, 26, 30, 13, 14, 14, 14, 22, 16].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  band(ws, 1, 11, "RAPPROCHEMENT PAR VIREMENT  —  Toutes transactions groupées par période de virement", {
    fill: C.navy, bold: true, color: C.white, size: 13, align: "center", wrap: true,
  });
  ws.getRow(1).height = 34;

  let r = 2;
  let vnum = 1;
  for (const p of periodes) {
    const titre = p.retrait
      ? `VIREMENT ${vnum}  ·  ${p.start} → ${p.end}  ·  Viré : ${eur(p.retrait.net)}`
      : `SOLDE EN COURS  ·  ${p.start} → ${p.end}  ·  Non encore viré`;
    band(ws, r, 11, titre, { fill: p.retrait ? C.blue : C.orange, bold: true, color: C.white, size: 11 });
    ws.getRow(r).height = 24;
    r += 1;

    headerRow(ws, r, RAP_SUB, C.slate, 20, 10);
    r += 1;

    let i = 1;
    let sb = 0, sc = 0, sn = 0, nc = 0, nd = 0;
    for (const t of p.txs) {
      const fill = fillForType(t.type);
      const credit = isCredit(t);
      const money = { align: "right" as const, numFmt: MONEY_FMT };
      put(ws, r, 1, i, { fill, align: "center" });
      put(ws, r, 2, t.dateRaw, { fill });
      put(ws, r, 3, t.time, { fill });
      put(ws, r, 4, t.name, { fill });
      put(ws, r, 5, t.type, { fill });
      put(ws, r, 6, t.gross, { fill, ...money });
      put(ws, r, 7, t.fee, { fill, ...money });
      put(ws, r, 8, t.net, { fill, ...money });
      put(ws, r, 9, t.impact, { fill, align: "center", bold: !credit, color: credit ? C.creditTxt : C.debitTxt });
      put(ws, r, 10, t.invoiceNumber, { fill });
      put(ws, r, 11, t.transactionId, { fill });
      ws.getRow(r).height = 15;
      sb += t.gross; sc += t.fee; sn += t.net;
      if (t.net >= 0) nc += 1; else nd += 1;
      i += 1;
      r += 1;
    }

    // Sous-total periode
    ws.mergeCells(r, 1, r, 5);
    put(ws, r, 1, `Sous-total période  (${nc} crédits / ${nd} débits)`, { fill: C.subtotal, bold: true });
    for (let c = 2; c <= 5; c++) setFill(ws.getCell(r, c), C.subtotal);
    put(ws, r, 6, sb, { fill: C.subtotal, bold: true, align: "right", numFmt: MONEY_FMT });
    put(ws, r, 7, sc, { fill: C.subtotal, bold: true, align: "right", numFmt: MONEY_FMT });
    put(ws, r, 8, sn, { fill: C.subtotal, bold: true, align: "right", numFmt: MONEY_FMT });
    for (let c = 9; c <= 11; c++) setFill(ws.getCell(r, c), C.subtotal);
    r += 1;

    // Ligne virement banque
    if (p.retrait) {
      ws.mergeCells(r, 1, r, 5);
      put(ws, r, 1, `▶ VIREMENT BANQUE  ·  ID bancaire : ${p.retrait.bankId || "—"}`, { fill: "FFE3F2FD", bold: true });
      for (let c = 2; c <= 5; c++) setFill(ws.getCell(r, c), "FFE3F2FD");
      put(ws, r, 6, "", { fill: "FFE3F2FD" });
      put(ws, r, 7, "", { fill: "FFE3F2FD" });
      put(ws, r, 8, p.retrait.net, { fill: "FFE3F2FD", bold: true, align: "right", numFmt: MONEY_FMT });
      put(ws, r, 9, "VIREMENT", { fill: "FFE3F2FD", align: "center", bold: true });
      put(ws, r, 10, p.retrait.dateRaw, { fill: "FFE3F2FD" });
      put(ws, r, 11, `Solde PayPal restant : ${(p.retrait.balance ?? 0).toFixed(2)} €`, { fill: "FFE3F2FD" });
      r += 1;
    }
    r += 1; // ligne vide
    if (p.retrait) vnum += 1;
  }
}

// ---------------------------------------------------------------------------
// 4. Remboursements
// ---------------------------------------------------------------------------
function buildRemboursements(wb: ExcelJS.Workbook, txs: Transaction[], byId: Map<string, Transaction>): void {
  const ws = wb.addWorksheet("Remboursements");
  [5, 13, 26, 16, 22, 22, 26, 18, 18, 22, 20].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  band(ws, 1, 11, "REMBOURSEMENTS  —  Liste complète avec lien vers transaction d'origine", {
    fill: C.red, bold: true, color: C.white, size: 13, align: "center", wrap: true,
  });
  ws.getRow(1).height = 34;
  headerRow(ws, 2, [
    "#", "Date", "Nom client remboursé", "Net remboursé (€)", "N° Facture",
    "N° Transaction remboursement", "N° Transaction d'origine", "Date paiement original",
    "Montant original (€)", "Email client", "✓ Lettré",
  ], C.red, 28, 10);

  const fill = "FFFFEBEE";
  const rembs = txs.filter(isRemboursement);
  let r = 3;
  let num = 1;
  let total = 0;
  for (const t of rembs) {
    const orig = t.referenceId ? byId.get(t.referenceId) : undefined;
    put(ws, r, 1, num, { fill, align: "center" });
    put(ws, r, 2, t.dateRaw, { fill });
    put(ws, r, 3, t.name, { fill });
    put(ws, r, 4, t.net, { fill, align: "right", numFmt: MONEY_FMT });
    put(ws, r, 5, t.invoiceNumber, { fill });
    put(ws, r, 6, t.transactionId, { fill, italic: true, size: 8, color: C.grayTxt });
    put(ws, r, 7, t.referenceId, { fill, italic: true, size: 8, color: C.grayTxt });
    put(ws, r, 8, orig ? orig.dateRaw : "", { fill });
    put(ws, r, 9, orig ? orig.gross : "", { fill, align: "right", numFmt: MONEY_FMT });
    put(ws, r, 10, t.email, { fill });
    put(ws, r, 11, "", { fill: C.lettre, align: "center" });
    ws.getRow(r).height = 16;
    total += t.net;
    num += 1;
    r += 1;
  }
  ws.mergeCells(r, 1, r, 3);
  put(ws, r, 1, "TOTAL REMBOURSEMENTS", { fill: C.red, bold: true, color: C.white, align: "right", size: 10 });
  put(ws, r, 4, total, { fill: C.red, bold: true, color: C.white, align: "right", numFmt: MONEY_TOTAL, size: 11 });
  for (let c = 5; c <= 11; c++) setFill(ws.getCell(r, c), C.red);
  ws.getRow(r).height = 22;

  band(ws, r + 2, 11,
    "ℹ️  Chaque remboursement est lié à sa transaction d'origine via le 'N° Transaction d'origine'. Vérifiez que le remboursement a bien été déduit du virement correspondant. Cochez ✓ Lettré une fois contrôlé.",
    { italic: true, size: 9, color: C.grayTxt, wrap: true });
}

// ---------------------------------------------------------------------------
// 5. Anomalies & Attentions
// ---------------------------------------------------------------------------
const ANOM_SUB = ["Catégorie", "Date", "Nom", "Type", "Net (€)", "Impact", "N° Facture", "N° Tx référence", "Source paiement", "Pays"];

function buildAnomalies(wb: ExcelJS.Workbook, txs: Transaction[]): void {
  const ws = wb.addWorksheet("Anomalies & Attentions");
  [14, 13, 26, 30, 14, 16, 22, 22, 18, 18].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  band(ws, 1, 10, "ANOMALIES & POINTS D'ATTENTION  —  Transactions à vérifier manuellement", {
    fill: C.orange, bold: true, color: C.white, size: 13, align: "center", wrap: true,
  });
  ws.getRow(1).height = 34;

  const sections: { title: string; label: string; fill: string; head: string; rows: Transaction[] }[] = [
    { title: "▌ SUSPENSION DE PAIEMENT  —  Paiements temporairement retenus par PayPal", label: "Suspension de paiement", fill: "FFFFF3E0", head: C.anomHead, rows: txs.filter((t) => norm(t.type) === "suspension de paiement") },
    { title: "▌ DÉBLOCAGE DE PAIEMENT  —  Libération des suspensions — à faire correspondre", label: "Déblocage de paiement", fill: "FFF3E5F5", head: C.anomHead, rows: txs.filter((t) => norm(t.type) === "deblocage de paiement") },
    { title: "▌ SOLDE SUSPENDU POUR ENQUÊTE SUR UN LITIGE  —  Litige ouvert — fonds bloqués", label: "Solde suspendu pour enquête sur un litige", fill: "FFFFFDE7", head: C.anomHead, rows: txs.filter((t) => norm(t.type).includes("solde suspendu")) },
    { title: "▌ ANNULATION DE LA SUSPENSION POUR RÉSOLUTION DU LITIGE  —  Litige résolu — fonds libérés", label: "Annulation de la suspension pour résolution du litige", fill: "FFF1F8E9", head: C.anomHead, rows: txs.filter((t) => norm(t.type).includes("annulation de la suspension")) },
    { title: "▌ PAY LATER (Paiement en 4X)  —  Transactions financées par PayPal Credit", label: "Pay Later 4X", fill: "FFF3E5F5", head: C.purpleHead, rows: txs.filter(isPayLater) },
  ];

  let r = 2;
  for (const s of sections) {
    if (!s.rows.length) continue;
    band(ws, r, 10, `${s.title}  (${s.rows.length} lignes)`, { fill: s.fill, bold: true, color: C.anomHead, size: 10 });
    ws.getRow(r).height = 22;
    r += 1;
    headerRow(ws, r, ANOM_SUB, s.head, 18, 10);
    r += 1;
    for (const t of s.rows) {
      put(ws, r, 1, s.label, { fill: s.fill });
      put(ws, r, 2, t.dateRaw, { fill: s.fill });
      put(ws, r, 3, t.name, { fill: s.fill });
      put(ws, r, 4, t.type, { fill: s.fill });
      put(ws, r, 5, t.net, { fill: s.fill, bold: true, align: "right", numFmt: MONEY_FMT, color: t.net < 0 ? C.debitTxt : C.creditTxt });
      put(ws, r, 6, t.impact, { fill: s.fill, align: "center" });
      put(ws, r, 7, t.invoiceNumber, { fill: s.fill });
      put(ws, r, 8, t.referenceId || t.transactionId, { fill: s.fill });
      put(ws, r, 9, t.source, { fill: s.fill });
      put(ws, r, 10, t.country, { fill: s.fill });
      ws.getRow(r).height = 15;
      r += 1;
    }
    ws.getRow(r).height = 8; // espace
    r += 1;
  }
  if (r === 2) band(ws, 2, 10, "Aucune anomalie détectée sur la période.", { italic: true, size: 10, color: C.grayTxt });
}

// ---------------------------------------------------------------------------
// 6. Résumé
// ---------------------------------------------------------------------------
const RESUME_ORDER = [
  "Paiement Express Checkout",
  "Suspension de paiement",
  "Remboursement de paiement",
  "Retrait initié par l'utilisateur",
  "Déblocage de paiement",
  "Solde suspendu pour enquête sur un litige",
  "Annulation de la suspension pour résolution du litige",
];

function buildResume(wb: ExcelJS.Workbook, txs: Transaction[]): void {
  const ws = wb.addWorksheet("Résumé");
  [36, 15, 15].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  headerRow(ws, 1, ["Résumé des transactions", "Nombre", "Montant net (€)"], C.navy, 28, 10);

  const groups = new Map<string, { count: number; net: number }>();
  for (const t of txs) {
    const g = groups.get(t.type) ?? { count: 0, net: 0 };
    g.count += 1;
    g.net += t.net;
    groups.set(t.type, g);
  }
  const ordered = [
    ...RESUME_ORDER.filter((k) => groups.has(k)),
    ...[...groups.keys()].filter((k) => !RESUME_ORDER.includes(k)),
  ];

  let r = 2;
  let credits = 0;
  let debits = 0;
  for (const type of ordered) {
    const g = groups.get(type)!;
    const fill = fillForType(type);
    put(ws, r, 1, type, { fill, size: 10 });
    put(ws, r, 2, g.count, { fill, align: "center", size: 10 });
    put(ws, r, 3, g.net, { fill, size: 10, numFmt: MONEY_FMT });
    if (g.net >= 0) credits += g.net; else debits += g.net;
    r += 1;
  }
  put(ws, r, 1, "TOTAL CRÉDITS", { fill: "FFE8F5E9", bold: true, size: 10 });
  put(ws, r, 2, "", { fill: "FFE8F5E9", size: 10 });
  const creditRow = r;
  put(ws, r, 3, credits, { fill: "FFE8F5E9", bold: true, size: 10, numFmt: MONEY_TOTAL });
  r += 1;
  put(ws, r, 1, "TOTAL DÉBITS", { fill: "FFFFEBEE", bold: true, size: 10 });
  put(ws, r, 2, "", { fill: "FFFFEBEE", size: 10 });
  const debitRow = r;
  put(ws, r, 3, debits, { fill: "FFFFEBEE", bold: true, size: 10, numFmt: MONEY_FMT });
  r += 1;
  put(ws, r, 1, "SOLDE NET", { fill: C.navy, bold: true, color: C.white, size: 10 });
  put(ws, r, 2, "", { fill: C.navy, size: 10 });
  put(ws, r, 3, { formula: `C${creditRow}+C${debitRow}` }, { fill: C.navy, bold: true, color: C.white, align: "right", size: 10, numFmt: MONEY_TOTAL });
}

// ---------------------------------------------------------------------------
// 7. Légende
// ---------------------------------------------------------------------------
const LEGENDE: [string, string][] = [
  ["Paiement Express Checkout  —  Crédit normal", "FFE8F5E9"],
  ["Suspension de paiement  —  Paiement en attente (débit temporaire)", "FFFFF3E0"],
  ["Déblocage de paiement  —  Libération de la suspension", "FFF3E5F5"],
  ["Remboursement de paiement  —  Remboursement client", "FFFFEBEE"],
  ["Retrait initié par l'utilisateur  —  Virement vers banque", "FFE3F2FD"],
  ["Solde suspendu pour enquête sur un litige  —  Litige en cours", "FFFFFDE7"],
  ["Annulation de la suspension pour résolution du litige  —  Litige résolu", "FFF1F8E9"],
];

function buildLegende(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("Légende");
  ws.getColumn(1).width = 40;
  ws.getColumn(2).width = 20;
  headerRow(ws, 1, ["Type de transaction", "Couleur"], C.navy, 18, 10);
  let r = 2;
  for (const [label, fill] of LEGENDE) {
    put(ws, r, 1, label, { fill });
    put(ws, r, 2, "", { fill });
    r += 1;
  }
}

// ---------------------------------------------------------------------------
// 8. Chiffre d'affaires (TTC / TVA / HT)
// ---------------------------------------------------------------------------
const CA_MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function buildCA(wb: ExcelJS.Workbook, txs: Transaction[], rate: number): void {
  const ws = wb.addWorksheet("Chiffre d'affaires", { views: [{ state: "frozen", ySplit: 2 }] });
  [16, 10, 18, 20, 18, 17, 16, 18, 16].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  const pct = Number((rate * 100).toFixed((rate * 100) % 1 ? 1 : 0));

  band(ws, 1, 9, `CHIFFRE D'AFFAIRES  —  TTC / TVA / HT  (TVA ${pct} %)`, {
    fill: C.navy, bold: true, color: C.white, size: 13, align: "center", wrap: true,
  });
  ws.getRow(1).height = 34;
  headerRow(ws, 2, [
    "Mois", "Nb ventes", "CA brut TTC (€)", "Remboursements TTC (€)", "CA net TTC (€)",
    `TVA collectée ${pct} % (€)`, "CA net HT (€)", "Commissions PayPal (€)", "Net encaissé (€)",
  ], C.navy, 30, 10);

  interface M { label: string; nb: number; brut: number; remb: number; comm: number }
  const months = new Map<string, M>();
  const key = (t: Transaction): string =>
    t.date ? `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, "0")}` : "0000-00";
  const label = (k: string): string => {
    const [y, m] = k.split("-");
    const i = Number(m) - 1;
    return i >= 0 && i < 12 ? `${CA_MONTHS[i]} ${y}` : "Sans date";
  };

  for (const t of txs) {
    if (!isVente(t) && !isRemboursement(t)) continue;
    const k = key(t);
    const g = months.get(k) ?? { label: label(k), nb: 0, brut: 0, remb: 0, comm: 0 };
    if (isVente(t)) {
      g.nb += 1;
      g.brut += t.gross;
      g.comm += t.fee;
    } else {
      g.remb += t.net;
    }
    months.set(k, g);
  }

  const money = { align: "right" as const, numFmt: MONEY_FMT };
  const keys = [...months.keys()].sort();
  let r = 3;
  let tNb = 0, tBrut = 0, tRemb = 0, tComm = 0;
  for (const k of keys) {
    const g = months.get(k)!;
    const netTtc = g.brut + g.remb;
    const ht = netTtc / (1 + rate);
    put(ws, r, 1, g.label, { fill: "FFE8F5E9" });
    put(ws, r, 2, g.nb, { fill: "FFE8F5E9", align: "center" });
    put(ws, r, 3, g.brut, { fill: "FFE8F5E9", ...money });
    put(ws, r, 4, g.remb, { fill: "FFE8F5E9", ...money });
    put(ws, r, 5, netTtc, { fill: "FFE8F5E9", ...money });
    put(ws, r, 6, netTtc - ht, { fill: "FFE8F5E9", ...money });
    put(ws, r, 7, ht, { fill: "FFE8F5E9", ...money });
    put(ws, r, 8, g.comm, { fill: "FFE8F5E9", ...money });
    put(ws, r, 9, netTtc + g.comm, { fill: "FFE8F5E9", ...money });
    tNb += g.nb; tBrut += g.brut; tRemb += g.remb; tComm += g.comm;
    r += 1;
  }

  const netTtcT = tBrut + tRemb;
  const htT = netTtcT / (1 + rate);
  const tot = { align: "right" as const, numFmt: MONEY_TOTAL, bold: true, color: C.white };
  put(ws, r, 1, "TOTAL", { fill: C.dark, bold: true, color: C.white, align: "right" });
  put(ws, r, 2, tNb, { fill: C.dark, bold: true, color: C.white, align: "center" });
  put(ws, r, 3, tBrut, { fill: C.dark, ...tot });
  put(ws, r, 4, tRemb, { fill: C.dark, ...tot });
  put(ws, r, 5, netTtcT, { fill: C.dark, ...tot });
  put(ws, r, 6, netTtcT - htT, { fill: C.dark, ...tot });
  put(ws, r, 7, htT, { fill: C.dark, ...tot });
  put(ws, r, 8, tComm, { fill: C.dark, ...tot });
  put(ws, r, 9, netTtcT + tComm, { fill: C.dark, ...tot });
  ws.getRow(r).height = 22;

  band(ws, r + 2, 9,
    `ℹ️  CA net TTC = ventes − remboursements.  TVA collectée = CA net TTC × ${pct}/${100 + pct}.  CA net HT = CA net TTC / ${(1 + rate).toFixed(2)}.  Les commissions PayPal sont des charges (déduites du net encaissé), sans TVA.`,
    { italic: true, size: 9, color: C.grayTxt, wrap: true });
  ws.autoFilter = { from: "A2", to: "I2" };
}

// ---------------------------------------------------------------------------
// Assemblage
// ---------------------------------------------------------------------------
export function buildWorkbook(result: PipelineResult): ExcelJS.Workbook {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Lettrage Auto";
  wb.created = new Date();

  const txs = sortChrono(result.transactions);
  const byId = new Map<string, Transaction>();
  for (const t of txs) if (t.transactionId) byId.set(t.transactionId, t);
  const periodes = decouperParVirement(txs);
  const rate = result.vatRate ?? 0.2;

  buildTransactions(wb, txs, rate);
  buildVirements(wb, periodes);
  buildRapprochement(wb, periodes);
  buildRemboursements(wb, txs, byId);
  buildAnomalies(wb, txs);
  buildResume(wb, txs);
  buildCA(wb, txs, rate);
  buildLegende(wb);

  return wb;
}
