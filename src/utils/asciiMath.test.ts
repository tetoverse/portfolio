import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASCII_CHARSETS,
  evaluateBlendedField,
  evaluateResearchField,
  evaluateSceneField,
  generateProjectAsciiPoster,
  getScrollSceneState,
  getSectionSceneState,
  sampleGlyph,
  type BackdropSceneId,
} from './asciiMath';

test('sampleGlyph clamps out-of-range intensities cleanly', () => {
  assert.equal(sampleGlyph(-0.5, 'classic'), ASCII_CHARSETS.classic[0]);
  assert.equal(sampleGlyph(1.5, 'classic'), ASCII_CHARSETS.classic[ASCII_CHARSETS.classic.length - 1]);
  assert.equal(sampleGlyph(0, 'blocks'), ASCII_CHARSETS.blocks[0]);
  assert.equal(sampleGlyph(1, 'math'), ASCII_CHARSETS.math[ASCII_CHARSETS.math.length - 1]);
});

test('getSectionSceneState transitions smoothly across all 5 chapters', () => {
  const hero = getSectionSceneState(0);
  assert.equal(hero.primaryScene, 0);
  assert.equal(hero.blend, 0);

  const mid = getSectionSceneState(1.5);
  assert.equal(mid.primaryScene, 1);
  assert.equal(mid.secondaryScene, 2);
  assert.ok(mid.blend > 0 && mid.blend < 1);

  const contact = getSectionSceneState(4);
  assert.equal(contact.primaryScene, 4);
  assert.equal(contact.blend, 0);
});

test('evaluateSceneField, evaluateBlendedField, and evaluateResearchField return finite normalized values', () => {
  const scenes: BackdropSceneId[] = [0, 1, 2, 3, 4];
  for (const scene of scenes) {
    const val = evaluateSceneField(scene, 0.25, -0.3, 1.5, 0.1, -0.1);
    assert.ok(Number.isFinite(val));
    assert.ok(val >= 0 && val <= 1);
  }

  for (const mode of [1, 2, 3] as const) {
    const val = evaluateResearchField(mode, -0.2, 0.35, 2.2);
    assert.ok(Number.isFinite(val));
    assert.ok(val >= 0 && val <= 1);
  }

  const blended = evaluateBlendedField(getScrollSceneState(0.62), 0.1, 0.2, 2.0);
  assert.ok(blended >= 0 && blended <= 1);
});

test('generateProjectAsciiPoster produces exact grid dimensions for every poster kind', () => {
  const kinds = [
    'lattice',
    'waveform',
    'trace',
    'relay',
    'sieve',
    'lemniscate',
    'primes',
    'native',
    'dns',
  ] as const;

  for (const kind of kinds) {
    const lines = generateProjectAsciiPoster(kind, 32, 10, 0.5);
    assert.equal(lines.length, 10);
    for (const line of lines) {
      assert.equal(line.length, 32);
    }
  }
});
