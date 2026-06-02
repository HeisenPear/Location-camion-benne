import type { Category, Field } from "../types";

/**
 * Pour chaque champ normalise, la liste des entetes possibles dans le CSV.
 * Le premier entete trouve (insensible a la casse/aux accents) est retenu.
 */
export type ColumnMap = Partial<Record<Field, string[]>>;

/**
 * Un profil decrit comment lire une plateforme donnee (PayPal, banque, ...).
 * Ajouter une plateforme = ajouter un nouveau profil dans ce dossier.
 */
export interface Profile {
  id: string;
  label: string;
  description: string;
  /** Separateur attendu ("," ";" "\t"), sinon detection automatique. */
  delimiter?: string;
  /** Symbole decimal du fichier. "auto" = detection ligne par ligne. */
  decimal: "," | "." | "auto";
  /** Ordre des composantes de date attendu, sinon detection automatique. */
  dateOrder?: "dmy" | "mdy" | "ymd" | "auto";
  columns: ColumnMap;
  /** Score 0..1 : a quel point ce profil correspond aux entetes fournies. */
  match(headers: string[]): number;
  /** Traduit un libelle d'operation + montants vers une categorie. */
  categorize(type: string, gross: number, net: number): Category;
}

/** Minuscule + suppression des accents + espaces normalises. */
export function norm(value: string): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Vrai si le libelle (normalise) contient l'un des mots-cles. */
export function includesAny(haystack: string, needles: string[]): boolean {
  const h = norm(haystack);
  return needles.some((n) => h.includes(norm(n)));
}

/**
 * Calcule un score de correspondance : proportion des entetes-cles du profil
 * effectivement presentes dans le fichier.
 */
export function scoreHeaders(headers: string[], keywords: string[][]): number {
  const normalized = headers.map(norm);
  let found = 0;
  for (const group of keywords) {
    if (group.some((k) => normalized.includes(norm(k)))) found += 1;
  }
  return keywords.length === 0 ? 0 : found / keywords.length;
}
