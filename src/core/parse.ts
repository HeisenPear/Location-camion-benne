// Utilitaires de conversion : montants, dates, encodage.
// Tout est tolerant : un champ illisible vaut 0 (montant) ou null (date)
// plutot que de faire echouer tout le fichier.

export type Decimal = "," | ".";

/**
 * Detecte le separateur decimal d'un jeu de valeurs (analyse globale, plus
 * fiable que ligne par ligne). Repere le separateur suivi de 1-2 chiffres en
 * fin de nombre, puis compte les occurrences.
 */
export function detectDecimal(values: string[]): Decimal {
  let comma = 0;
  let dot = 0;
  for (const raw of values) {
    const m = String(raw).trim().match(/([.,])(\d{1,2})$/);
    if (m) {
      if (m[1] === ",") comma += 1;
      else dot += 1;
    }
  }
  if (comma === 0 && dot === 0) {
    for (const raw of values) {
      const s = String(raw);
      const hasComma = s.includes(",");
      const hasDot = s.includes(".");
      if (hasComma && !hasDot) comma += 1;
      else if (hasDot && !hasComma) dot += 1;
    }
  }
  return comma >= dot ? "," : ".";
}

/** Convertit un texte en nombre, en gerant les formats FR et EN. */
export function parseAmount(raw: string, decimal: Decimal): number {
  if (raw == null) return 0;
  let s = String(raw).trim();
  if (s === "" || s === "-") return 0;

  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1);
  }
  // Ne garde que chiffres, separateurs et signe moins.
  s = s.replace(/[^\d,.\-]/g, "");
  if (s.includes("-")) negative = true;
  s = s.replace(/-/g, "");
  if (s === "") return 0;

  if (decimal === ",") {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(/,/g, "");
  }

  const n = Number.parseFloat(s);
  if (Number.isNaN(n)) return 0;
  return negative ? -n : n;
}

export type DateOrder = "dmy" | "mdy" | "ymd";

/** Devine l'ordre jour/mois/annee a partir d'un echantillon de dates. */
export function detectDateOrder(values: string[]): DateOrder {
  let dmy = 0;
  let mdy = 0;
  let ymd = 0;
  for (const raw of values) {
    const m = String(raw).trim().match(/^(\d{1,4})[\/\-.](\d{1,2})[\/\-.](\d{1,4})/);
    if (!m) continue;
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (m[1].length === 4 || a > 31) ymd += 1;
    else if (a > 12) dmy += 1;
    else if (b > 12) mdy += 1;
  }
  if (ymd >= dmy && ymd >= mdy && ymd > 0) return "ymd";
  if (mdy > dmy) return "mdy";
  return "dmy"; // defaut europeen
}

/** Convertit un texte en Date selon l'ordre detecte (null si illisible). */
export function parseDate(raw: string, order: DateOrder): Date | null {
  if (!raw) return null;
  const s = String(raw).trim();
  const m = s.match(/^(\d{1,4})[\/\-.](\d{1,2})[\/\-.](\d{1,4})/);
  if (!m) {
    const fallback = new Date(s);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }
  let day: number;
  let month: number;
  let year: number;
  const p1 = Number(m[1]);
  const p2 = Number(m[2]);
  const p3 = Number(m[3]);

  if (order === "ymd") {
    year = p1;
    month = p2;
    day = p3;
  } else if (order === "mdy") {
    month = p1;
    day = p2;
    year = p3;
  } else {
    day = p1;
    month = p2;
    year = p3;
  }
  if (year < 100) year += year < 70 ? 2000 : 1900;

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

const MONTHS_FR = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre",
];

/** "2026-01" -> "Janvier 2026". */
export function monthLabel(key: string): string {
  const [year, month] = key.split("-");
  const idx = Number(month) - 1;
  if (idx < 0 || idx > 11) return key;
  return `${MONTHS_FR[idx]} ${year}`;
}

/** Cle de mois triable "YYYY-MM" a partir d'une Date. */
export function monthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Decode des octets de fichier en texte. Gere le BOM UTF-8 et bascule sur
 * Windows-1252 (Latin1) si le decodage UTF-8 produit des caracteres invalides
 * (cas frequent des vieux exports comptables).
 */
export function decodeBytes(bytes: Uint8Array): string {
  // BOM UTF-8
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder("utf-8").decode(bytes.subarray(3));
  }
  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  if (utf8.includes("�")) {
    try {
      return new TextDecoder("windows-1252").decode(bytes);
    } catch {
      return utf8;
    }
  }
  return utf8;
}
