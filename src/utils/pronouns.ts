/**
 * Pronouns for the generated narrative.
 *
 * Profiles are built from public bibliographic data, which never states a
 * researcher's pronouns — so the default is and stays the neutral they/them for
 * everyone. Guessing from a first name would misgender people. A researcher who
 * tells us their pronouns (a verified correction, never an inference) gets them
 * used instead, which is what several have asked for.
 */

export type PronounChoice = 'they' | 'she' | 'he';

export interface PronounSet {
  /** "they" / "she" / "he" */
  subject: string;
  /** "them" / "her" / "him" */
  object: string;
  /** "their" / "her" / "his" */
  possessive: string;
  /** "theirs" / "hers" / "his" */
  possessivePronoun: string;
  /** Whether the subject form takes a plural verb ("they have" vs "she has"). */
  pluralVerb: boolean;
}

const SETS: Record<PronounChoice, PronounSet> = {
  they: { subject: 'they', object: 'them', possessive: 'their', possessivePronoun: 'theirs', pluralVerb: true },
  she: { subject: 'she', object: 'her', possessive: 'her', possessivePronoun: 'hers', pluralVerb: false },
  he: { subject: 'he', object: 'him', possessive: 'his', possessivePronoun: 'his', pluralVerb: false },
};

export const DEFAULT_PRONOUNS: PronounSet = SETS.they;

/** Parse a stored pronoun choice. Anything unrecognised falls back to they/them
 *  rather than throwing — a bad value must never break a profile. */
export function pronounsFor(choice?: string | null): PronounSet {
  if (!choice) return DEFAULT_PRONOUNS;
  const key = choice.trim().toLowerCase().split(/[\s/]+/)[0];
  return SETS[key as PronounChoice] ?? DEFAULT_PRONOUNS;
}

/** Whether a string is a pronoun choice we can apply. */
export function isPronounChoice(value: string): value is PronounChoice {
  const key = value.trim().toLowerCase().split(/[\s/]+/)[0];
  return key === 'they' || key === 'she' || key === 'he';
}

/** Normalize a stored value ("She/her", "SHE") to its canonical key. */
export function toPronounChoice(value: string): PronounChoice | null {
  const key = value.trim().toLowerCase().split(/[\s/]+/)[0];
  return key === 'they' || key === 'she' || key === 'he' ? key : null;
}

// Third-person singular forms for the handful of verbs the narrative puts
// directly after a pronoun. Regular verbs just take "s"; these don't.
const IRREGULAR: Record<string, string> = {
  have: 'has',
  be: 'is',
  do: 'does',
  go: 'goes',
};

/**
 * Agree a base (plural) verb with the pronoun: "they have" but "she has",
 * "they receive" but "he receives".
 */
export function conjugate(base: string, pronouns: PronounSet): string {
  if (pronouns.pluralVerb) return base;
  if (IRREGULAR[base]) return IRREGULAR[base];
  if (/(s|sh|ch|x|z|o)$/.test(base)) return `${base}es`;
  if (/[^aeiou]y$/.test(base)) return `${base.slice(0, -1)}ies`;
  return `${base}s`;
}

/** Capitalize the first letter, for a pronoun that opens a sentence. */
export function capitalizeFirst(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
