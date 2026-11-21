import type { ProjectCategory, ProjectItem } from '../data/tetoverseData';

export interface GitHubRepoPayload {
  name: string;
  stargazers_count?: number;
  forks_count?: number;
  language?: string | null;
  pushed_at?: string;
}

export function filterProjects(
  projects: ProjectItem[],
  category: ProjectCategory,
  activeTech: string | null
): ProjectItem[] {
  return projects.filter((project) => {
    const matchesCategory = category === 'all' || project.category === category;
    if (!matchesCategory) return false;
    if (!activeTech) return true;
    const target = activeTech.toLowerCase();
    return project.techStack.some((t) => t.toLowerCase() === target);
  });
}

export function mergeGitHubRepos(
  seedProjects: ProjectItem[],
  remoteRepos: GitHubRepoPayload[]
): ProjectItem[] {
  if (!Array.isArray(remoteRepos) || remoteRepos.length === 0) {
    return seedProjects;
  }

  const byName = new Map<string, GitHubRepoPayload>();
  for (const repo of remoteRepos) {
    if (repo && typeof repo.name === 'string') {
      byName.set(repo.name.toLowerCase(), repo);
    }
  }

  return seedProjects.map((project) => {
    const match = byName.get(project.repoName.toLowerCase());
    if (!match) return project;

    const year = match.pushed_at ? match.pushed_at.slice(0, 4) : project.year;
    return {
      ...project,
      stars: typeof match.stargazers_count === 'number' ? match.stargazers_count : project.stars,
      forks: typeof match.forks_count === 'number' ? match.forks_count : project.forks,
      year,
    };
  });
}

export function stepFocusIndex(current: number, delta: number, length: number): number {
  if (length <= 0) return -1;
  return ((current + delta) % length + length) % length;
}

export function countProjectsForTech(projects: ProjectItem[], tech: string): number {
  const target = tech.toLowerCase();
  return projects.filter((p) => p.techStack.some((item) => item.toLowerCase() === target)).length;
}
