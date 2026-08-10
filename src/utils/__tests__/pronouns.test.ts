import { pronounsFor, conjugate, toPronounChoice, capitalizeFirst, DEFAULT_PRONOUNS } from '../pronouns';

describe('pronounsFor', () => {
  test('defaults to they/them when nothing is declared', () => {
    expect(pronounsFor(undefined)).toBe(DEFAULT_PRONOUNS);
    expect(pronounsFor(null)).toBe(DEFAULT_PRONOUNS);
    expect(pronounsFor('')).toBe(DEFAULT_PRONOUNS);
  });

  test('falls back to they/them for an unrecognised value rather than throwing', () => {
    expect(pronounsFor('xe')).toBe(DEFAULT_PRONOUNS);
  });

  test.each([
    ['she', 'she', 'her', 'her', 'hers'],
    ['he', 'he', 'him', 'his', 'his'],
    ['they', 'they', 'them', 'their', 'theirs'],
  ])('resolves %s', (choice, subject, object, possessive, possessivePronoun) => {
    const pn = pronounsFor(choice);
    expect([pn.subject, pn.object, pn.possessive, pn.possessivePronoun])
      .toEqual([subject, object, possessive, possessivePronoun]);
  });

  test.each(['She/her', 'SHE', ' she ', 'she/hers'])('accepts the stored form %s', input => {
    expect(pronounsFor(input).possessive).toBe('her');
  });
});

describe('toPronounChoice', () => {
  test('normalizes accepted values', () => {
    expect(toPronounChoice('She/her')).toBe('she');
    expect(toPronounChoice('THEY')).toBe('they');
  });

  test('rejects anything else', () => {
    expect(toPronounChoice('Professor')).toBeNull();
    expect(toPronounChoice('')).toBeNull();
  });
});

describe('conjugate', () => {
  test('leaves the plural form alone for they', () => {
    const they = pronounsFor('they');
    expect(conjugate('have', they)).toBe('have');
    expect(conjugate('receive', they)).toBe('receive');
  });

  test('agrees singular pronouns', () => {
    const she = pronounsFor('she');
    expect(conjugate('have', she)).toBe('has');
    expect(conjugate('receive', she)).toBe('receives');
    expect(conjugate('publish', she)).toBe('publishes');
    expect(conjugate('study', she)).toBe('studies');
    expect(conjugate('be', she)).toBe('is');
  });
});

describe('capitalizeFirst', () => {
  test('capitalizes a sentence-opening pronoun', () => {
    expect(capitalizeFirst('their')).toBe('Their');
    expect(capitalizeFirst('her')).toBe('Her');
  });
});
