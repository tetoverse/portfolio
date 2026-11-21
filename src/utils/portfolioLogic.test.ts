import test from 'node:test';
import assert from 'node:assert/strict';
import { PROJECTS_SEED, RESEARCH_ENGINES } from '../data/tetoverseData';
import {
  countProjectsForTech,
  filterProjects,
  mergeGitHubRepos,
  stepFocusIndex,
} from './portfolioLogic';

test('filterProjects filters by category and technology case-insensitively', () => {
  const audioOnly = filterProjects(PROJECTS_SEED, 'audio-web', null);
  assert.equal(audioOnly.length, 2);
  assert.ok(audioOnly.every((p) => p.category === 'audio-web'));

  const rustOnly = filterProjects(PROJECTS_SEED, 'all', 'rust');
  assert.equal(rustOnly.length, 1);
  assert.equal(rustOnly[0].id, 'Raser');

  const combined = filterProjects(PROJECTS_SEED, 'audio-web', 'Node.js');
  assert.equal(combined.length, 1);
  assert.equal(combined[0].id, 'RaserWeb');
});

test('mergeGitHubRepos updates star/fork counts while preserving curated copy', () => {
  const merged = mergeGitHubRepos(PROJECTS_SEED, [
    { name: 'hang-trace', stargazers_count: 42, forks_count: 7, pushed_at: '2026-11-20T12:00:00Z' },
    { name: 'Raser', stargazers_count: 19, forks_count: 5, pushed_at: '2026-11-20T18:32:52Z' },
  ]);

  const trace = merged.find((p) => p.id === 'hang-trace');
  const raser = merged.find((p) => p.id === 'Raser');
  assert.equal(trace?.stars, 42);
  assert.equal(trace?.forks, 7);
  assert.equal(raser?.stars, 19);
  assert.equal(raser?.liveUrl, 'https://app.raserapp.online');
});

test('stepFocusIndex wraps smoothly in both directions', () => {
  assert.equal(stepFocusIndex(0, -1, 5), 4);
  assert.equal(stepFocusIndex(4, 1, 5), 0);
  assert.equal(stepFocusIndex(2, 1, 5), 3);
  assert.equal(stepFocusIndex(0, 1, 0), -1);
});

test('countProjectsForTech counts matching stack technologies accurately and keeps math engines in Math Lab', () => {
  assert.equal(countProjectsForTech(PROJECTS_SEED, 'Rust'), 1);
  assert.equal(countProjectsForTech(PROJECTS_SEED, 'TypeScript'), 1);
  assert.equal(countProjectsForTech(PROJECTS_SEED, 'PostgreSQL'), 0);
  assert.equal(PROJECTS_SEED.length, 3);
  assert.equal(PROJECTS_SEED.some((p) => p.id === 'hyper-lll'), false);
  assert.equal(PROJECTS_SEED.some((p) => p.id === 'prime_hunter'), false);
  assert.equal(RESEARCH_ENGINES.some((e) => e.id === 'hyper-lll'), true);
  assert.equal(RESEARCH_ENGINES.some((e) => e.id === 'prime_hunter'), true);
});
