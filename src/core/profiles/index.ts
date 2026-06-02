import type { Profile } from "./profile";
import { paypalProfile } from "./paypal";
import { genericProfile } from "./generic";

export type { Profile, ColumnMap } from "./profile";

/**
 * Registre des plateformes supportees. Pour en ajouter une, creer un fichier
 * `xxx.ts` exportant un `Profile`, puis l'ajouter ici.
 */
export const PROFILES: Profile[] = [paypalProfile, genericProfile];

export const DEFAULT_PROFILE = genericProfile;

export function getProfile(id: string): Profile | undefined {
  return PROFILES.find((p) => p.id === id);
}

export interface DetectionResult {
  profile: Profile;
  score: number;
}

/**
 * Choisit le profil le plus adapte aux entetes du CSV.
 * Retourne le meilleur score ; en cas d'egalite a 0, le profil generique.
 */
export function detectProfile(headers: string[]): DetectionResult {
  let best: DetectionResult = { profile: DEFAULT_PROFILE, score: 0 };
  for (const profile of PROFILES) {
    const score = profile.match(headers);
    if (score > best.score) best = { profile, score };
  }
  return best;
}
