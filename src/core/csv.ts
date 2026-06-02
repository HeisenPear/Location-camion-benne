import Papa from "papaparse";
import type { RawRow } from "./types";

export interface ParsedCsv {
  headers: string[];
  rows: RawRow[];
  delimiter: string;
}

/**
 * Parse un texte CSV en lignes objet (entete -> valeur).
 * Le separateur est auto-detecte si non fourni (PapaParse teste , ; \t |).
 */
export function parseCsvText(text: string, delimiter?: string): ParsedCsv {
  const result = Papa.parse<RawRow>(text, {
    header: true,
    skipEmptyLines: "greedy",
    delimiter: delimiter ?? "",
    transformHeader: (h) => h.trim(),
  });

  const headers = (result.meta.fields ?? []).map((h) => h.trim()).filter(Boolean);

  // On ecarte les lignes entierement vides (separateurs sans contenu).
  const rows = (result.data ?? []).filter((row) =>
    Object.values(row).some((v) => v != null && String(v).trim() !== "")
  );

  return {
    headers,
    rows,
    delimiter: result.meta.delimiter || delimiter || ",",
  };
}
