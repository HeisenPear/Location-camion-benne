import "./style.css";
import { runPipeline } from "./core/pipeline";
import { PROFILES } from "./core/profiles";
import { decodeBytes } from "./core/parse";
import { type Field, type PipelineResult } from "./core/types";
import { statutOf } from "./core/statut";
import { STATUT_FILL } from "./excel/styles";
// ExcelJS est volumineux : on le charge a la demande (voir generate()).

// --- Acces aux elements ----------------------------------------------------
const $ = <T extends HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element introuvable: #${id}`);
  return el as T;
};

const dropEl = $("drop");
const fileInput = $<HTMLInputElement>("file");
const browseBtn = $<HTMLButtonElement>("browse");
const errorEl = $("error");
const configEl = $("config");
const resultsEl = $("results");
const fileNameEl = $<HTMLOutputElement>("fileName");
const profileSelect = $<HTMLSelectElement>("profile");
const delimiterSelect = $<HTMLSelectElement>("delimiter");
const vatInput = $<HTMLInputElement>("vat");
const statsEl = $("stats");
const mappingEl = $("mapping");
const previewTable = $<HTMLTableElement>("preview");
const previewCountEl = $("previewCount");
const generateBtn = $<HTMLButtonElement>("generate");
const statusEl = $("status");

// --- Etat ------------------------------------------------------------------
interface State {
  fileName: string;
  text: string | null;
  profileId: string;
  delimiter: string;
  result: PipelineResult | null;
}
const state: State = {
  fileName: "",
  text: null,
  profileId: "auto",
  delimiter: "",
  result: null,
};

const nf = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const FIELD_LABELS: Record<Field, string> = {
  date: "Date",
  time: "Heure",
  type: "Type / libellé",
  name: "Client / nom",
  email: "Email",
  currency: "Devise",
  gross: "Brut",
  fee: "Commission",
  net: "Net",
  balance: "Solde",
  debit: "Débit",
  credit: "Crédit",
  article: "Article",
  invoiceNumber: "N° facture",
  impact: "Sens",
  source: "Source",
  country: "Pays",
  transactionId: "N° transaction",
  referenceId: "Réf. associée",
  status: "État",
};

const argbToCss = (argb: string): string => `#${argb.slice(2)}`;
const fmtDate = (d: Date | null, raw = ""): string =>
  d ? d.toLocaleDateString("fr-FR") : raw;

// --- Initialisation des selecteurs -----------------------------------------
function populateProfiles(): void {
  profileSelect.innerHTML = "";
  const auto = document.createElement("option");
  auto.value = "auto";
  auto.textContent = "Auto-détection";
  profileSelect.appendChild(auto);
  for (const p of PROFILES) {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.label;
    profileSelect.appendChild(opt);
  }
  profileSelect.value = state.profileId;
}

// --- Erreurs ---------------------------------------------------------------
function showError(message: string): void {
  errorEl.textContent = message;
  errorEl.hidden = false;
}
function clearError(): void {
  errorEl.textContent = "";
  errorEl.hidden = true;
}

// --- Lecture du fichier -----------------------------------------------------
async function handleFile(file: File): Promise<void> {
  try {
    clearError();
    const bytes = new Uint8Array(await file.arrayBuffer());
    state.fileName = file.name;
    state.text = decodeBytes(bytes);
    fileNameEl.textContent = `${file.name} (${(file.size / 1024).toFixed(0)} Ko)`;
    populateProfiles();
    run();
  } catch (err) {
    showError(`Impossible de lire le fichier : ${(err as Error).message}`);
  }
}

// --- Traitement -------------------------------------------------------------
function run(): void {
  if (!state.text) return;
  try {
    clearError();
    const vatPct = Number.parseFloat(vatInput.value);
    const vatRate = Number.isFinite(vatPct) ? vatPct / 100 : 0.2;
    const result = runPipeline(state.text, {
      profileId: state.profileId,
      delimiter: state.delimiter || undefined,
      vatRate,
    });
    state.result = result;

    if (result.stats.txCount === 0) {
      showError(
        "Aucune opération exploitable n'a été trouvée. Vérifiez le séparateur ou la plateforme sélectionnée."
      );
    }

    configEl.hidden = false;
    resultsEl.hidden = false;
    renderStats(result);
    renderMapping(result);
    renderPreview(result);
    statusEl.textContent = "";
  } catch (err) {
    showError(`Erreur de traitement : ${(err as Error).message}`);
  }
}

// --- Rendu : statistiques ---------------------------------------------------
function chip(label: string, value: string): HTMLElement {
  const el = document.createElement("div");
  el.className = "chip";
  const l = document.createElement("span");
  l.className = "chip-label";
  l.textContent = label;
  const v = document.createElement("span");
  v.className = "chip-value";
  v.textContent = value;
  el.append(l, v);
  return el;
}

function renderStats(result: PipelineResult): void {
  statsEl.innerHTML = "";
  const s = result.stats;
  const d = result.dashboard;
  const euro = (n: number) => `${nf.format(n)} €`;
  statsEl.append(
    chip("Plateforme", result.profileLabel),
    chip("Mouvements", String(s.txCount)),
    chip("🟢 Paiements", String(d.nbPaiements)),
    chip("CA brut", euro(d.caBrut)),
    chip("Commissions", euro(d.commissions)),
    chip("Net encaissé", euro(d.netEncaisse)),
    chip(
      "Période",
      s.periodStart ? `${fmtDate(s.periodStart)} → ${fmtDate(s.periodEnd)}` : "—"
    )
  );
}

// --- Rendu : mapping des colonnes ------------------------------------------
function renderMapping(result: PipelineResult): void {
  mappingEl.innerHTML = "";
  const entries = Object.entries(result.mapping) as [Field, string][];
  for (const [field, header] of entries) {
    const item = document.createElement("div");
    item.className = "map-item";
    const f = document.createElement("span");
    f.className = "map-field";
    f.textContent = FIELD_LABELS[field] ?? field;
    const h = document.createElement("span");
    h.className = "map-header";
    h.textContent = header;
    item.append(f, h);
    mappingEl.appendChild(item);
  }
  for (const field of result.missingFields) {
    const item = document.createElement("div");
    item.className = "map-item missing";
    item.textContent = `⚠ ${FIELD_LABELS[field] ?? field} introuvable`;
    mappingEl.appendChild(item);
  }
}

// --- Rendu : apercu ---------------------------------------------------------
function renderPreview(result: PipelineResult): void {
  previewTable.innerHTML = "";
  const cols = ["Statut", "Date", "Client", "Type", "Brut", "Commission", "Net", "Lettrage"];
  const thead = document.createElement("thead");
  const htr = document.createElement("tr");
  for (const c of cols) {
    const th = document.createElement("th");
    th.textContent = c;
    htr.appendChild(th);
  }
  thead.appendChild(htr);
  previewTable.appendChild(thead);

  const tbody = document.createElement("tbody");
  const rows = result.transactions.slice(0, 20);
  for (const t of rows) {
    const tr = document.createElement("tr");
    const st = statutOf(t);
    const cells: [string, string?][] = [
      [`${st.emoji} ${st.label}`, argbToCss(STATUT_FILL[st.key])],
      [fmtDate(t.date, t.dateRaw)],
      [t.name],
      [t.type],
      [nf.format(t.gross), "num"],
      [nf.format(t.fee), "num"],
      [nf.format(t.net), "num"],
      [t.lettrage],
    ];
    cells.forEach(([text, extra], i) => {
      const td = document.createElement("td");
      td.textContent = text;
      if (i === 0 && extra) td.style.background = extra;
      if (extra === "num") td.className = "num";
      if (i === 7 && text) td.className = "lettrage";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
  previewTable.appendChild(tbody);
  previewCountEl.textContent = `(${rows.length} sur ${result.transactions.length})`;
}

// --- Generation Excel -------------------------------------------------------
async function generate(): Promise<void> {
  if (!state.result) return;
  try {
    generateBtn.disabled = true;
    statusEl.textContent = "Génération en cours…";
    const [{ buildWorkbook }, { buildFilename, downloadWorkbook }] = await Promise.all([
      import("./excel/workbook"),
      import("./excel/download"),
    ]);
    const wb = buildWorkbook(state.result);
    await downloadWorkbook(wb, buildFilename(state.fileName));
    statusEl.textContent = "✓ Fichier Excel téléchargé";
  } catch (err) {
    showError(`Échec de la génération : ${(err as Error).message}`);
    statusEl.textContent = "";
  } finally {
    generateBtn.disabled = false;
  }
}

// --- Evenements -------------------------------------------------------------
browseBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (file) void handleFile(file);
});

["dragenter", "dragover"].forEach((evt) =>
  dropEl.addEventListener(evt, (e) => {
    e.preventDefault();
    dropEl.classList.add("dragover");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropEl.addEventListener(evt, (e) => {
    e.preventDefault();
    if (evt === "dragleave" && e.target !== dropEl) return;
    dropEl.classList.remove("dragover");
  })
);
dropEl.addEventListener("drop", (e) => {
  const file = (e as DragEvent).dataTransfer?.files?.[0];
  if (file) void handleFile(file);
});
dropEl.addEventListener("click", (e) => {
  if (e.target === browseBtn) return;
  fileInput.click();
});

profileSelect.addEventListener("change", () => {
  state.profileId = profileSelect.value;
  run();
});
delimiterSelect.addEventListener("change", () => {
  state.delimiter = delimiterSelect.value;
  run();
});
vatInput.addEventListener("change", run);
generateBtn.addEventListener("click", () => void generate());

populateProfiles();
