import { useCallback, useEffect, useMemo, useState } from 'react';
import { AsciiBackdropCanvas } from './components/AsciiBackdropCanvas';
import { EditorialWorksSection } from './components/EditorialWorksSection';
import { ProjectCinemaModal } from './components/ProjectCinemaModal';
import { ResearchAsciiLab } from './components/ResearchAsciiLab';
import { CraftAboutSection } from './components/CraftAboutSection';
import { ContactSection } from './components/ContactSection';
import HalftoneFlowHero from './components/ui/halftone-flow-hero';
import BeamWordmarkFooter from './components/ui/beam-wordmark-footer';
import {
  CHAPTERS,
  COPY,
  PROFILE_SEED,
  PROJECTS_SEED,
  type ProjectCategory,
  type ProjectItem,
} from './data/tetoverseData';
import { getSectionSceneState } from './utils/asciiMath';
import {
  filterProjects,
  mergeGitHubRepos,
  stepFocusIndex,
  type GitHubRepoPayload,
} from './utils/portfolioLogic';

const SECTION_IDS = CHAPTERS.map((c) => c.id);

function measureSectionPosition(): number {
  if (window.scrollY <= 4) return 0;

  const triggerOffset = window.innerHeight * 0.38;
  const stops: number[] = [];

  for (let i = 0; i < SECTION_IDS.length; i++) {
    const el = document.getElementById(SECTION_IDS[i]);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    stops.push(i === 0 ? 0 : Math.max(1, top - triggerOffset));
  }

  if (stops.length < 2) return 0;

  const y = window.scrollY;
  for (let i = 0; i < stops.length - 1; i++) {
    const start = stops[i];
    const end = Math.max(start + 1, stops[i + 1]);
    if (y < end) {
      return i + (y - start) / (end - start);
    }
  }

  return stops.length - 1;
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionPosition, setSectionPosition] = useState(0);
  const [projects, setProjects] = useState<ProjectItem[]>(PROJECTS_SEED);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  // Quiet background GitHub star refresh on initial mount (graceful fallback to seed data)
  useEffect(() => {
    let active = true;
    fetch('https://api.github.com/users/tetoverse/repos?sort=updated&per_page=30', {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((res) => (res.ok ? (res.json() as Promise<GitHubRepoPayload[]>) : null))
      .then((data) => {
        if (active && data) {
          setProjects((prev) => mergeGitHubRepos(prev, data));
        }
      })
      .catch(() => {
        // Seed data remains active
      });
    return () => {
      active = false;
    };
  }, []);

  // Automatic section-aware scroll tracking driving the background ASCII morph
  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      ticking = false;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      setScrollProgress(progress);
      setSectionPosition(measureSectionPosition());
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const filteredProjects = useMemo(
    () => filterProjects(projects, activeCategory, null),
    [projects, activeCategory]
  );

  const selectedIndex = useMemo(() => {
    if (!selectedProjectId) return -1;
    const inFiltered = filteredProjects.findIndex((p) => p.id === selectedProjectId);
    if (inFiltered !== -1) return inFiltered;
    return projects.findIndex((p) => p.id === selectedProjectId);
  }, [selectedProjectId, filteredProjects, projects]);

  const modalPool = useMemo(() => {
    if (
      selectedProjectId &&
      filteredProjects.some((p) => p.id === selectedProjectId)
    ) {
      return filteredProjects;
    }
    return projects;
  }, [selectedProjectId, filteredProjects, projects]);

  const selectedProject =
    selectedIndex >= 0 && selectedIndex < modalPool.length
      ? modalPool[selectedIndex]
      : null;

  const handleStepModal = useCallback(
    (delta: number) => {
      if (!selectedProjectId || modalPool.length <= 1) return;
      const curIdx = modalPool.findIndex((p) => p.id === selectedProjectId);
      const nextIdx = stepFocusIndex(curIdx === -1 ? 0 : curIdx, delta, modalPool.length);
      if (nextIdx >= 0) {
        setSelectedProjectId(modalPool[nextIdx].id);
      }
    },
    [selectedProjectId, modalPool]
  );

  const handleCopyDiscord = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_SEED.discordHandle);
    } catch {
      // Fallback for non-clipboard contexts
    }
    setCopiedDiscord(true);
    window.setTimeout(() => setCopiedDiscord(false), 2200);
  }, []);

  const handleStepInside = useCallback(() => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const sceneState = getSectionSceneState(sectionPosition);
  const activeChapterIndex =
    sceneState.blend > 0.5 ? sceneState.secondaryScene : sceneState.primaryScene;

  const heroRecede = Math.min(1, Math.max(0, sectionPosition * 1.15));
  const heroScale = 1 - heroRecede * 0.035;
  const heroTranslateY = heroRecede * -18;
  const heroOpacity = Math.max(0.28, 1 - heroRecede * 0.72);

  return (
    <div
      data-scroll-scene={String(activeChapterIndex)}
      className="relative min-h-screen bg-[#090709] text-[#F5F5F7]"
    >
      {/* Fixed section-aware scroll-morphing procedural ASCII backdrop */}
      <AsciiBackdropCanvas
        sectionPosition={sectionPosition}
        scrollProgress={scrollProgress}
      />

      {/* Whisper-thin scroll progress hairline along top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px] origin-left bg-gradient-to-r from-[#E11D48] via-[#FB7185] to-[#FDA4AF]"
        style={{ transform: `scaleX(${scrollProgress.toFixed(4)})` }}
      />

      {/* Subtle right-edge Chapter Rail */}
      <nav
        aria-label="Page sections"
        className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 2xl:flex"
      >
        {CHAPTERS.map((chapter) => {
          const isActive = activeChapterIndex === chapter.scene;
          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-current={isActive ? 'true' : undefined}
              className="group flex items-center gap-2.5 py-0.5 text-xs transition-colors"
            >
              <span
                className={`font-mono text-[11px] transition-all duration-200 ${
                  isActive
                    ? 'translate-x-0 text-[#FDA4AF] opacity-100'
                    : 'translate-x-1 text-zinc-500 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                }`}
              >
                {chapter.label}
              </span>
              <span
                aria-hidden="true"
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'h-5 w-[3px] bg-[#FDA4AF]'
                    : 'h-2.5 w-[2px] bg-white/25 group-hover:bg-white/60'
                }`}
              />
            </a>
          );
        })}
      </nav>

      <main id="top" className="relative z-10">
        {/* CHAPTER 01: Halftone Flow Shader Hero */}
        <div
          style={{
            transform: `translate3d(0, ${heroTranslateY.toFixed(1)}px, 0) scale(${heroScale.toFixed(4)})`,
            opacity: heroOpacity.toFixed(3),
          }}
          className="will-change-transform"
        >
          <HalftoneFlowHero
            badge=""
            title={'Systems, audio,\n*and number theory.*'}
            description={COPY.hero.lead}
            prompts={[]}
            showInput={false}
            ctaLabel={COPY.hero.primaryCta}
            onSubmit={handleStepInside}
            proof=""
            avatars={[]}
            palette="crimson"
            dotSize={7}
            height="100svh"
            className="min-h-[640px]"
          />
        </div>

        {/* CHAPTER 02: Personal About & What I Build */}
        <CraftAboutSection
          copiedDiscord={copiedDiscord}
          onCopyDiscord={handleCopyDiscord}
        />

        {/* CHAPTER 03: Full-Width Cinematic Project Strips */}
        <EditorialWorksSection
          projects={filteredProjects}
          totalCount={projects.length}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onResetFilters={() => setActiveCategory('all')}
          onInspectProject={(item) => setSelectedProjectId(item.id)}
        />

        {/* CHAPTER 04: Single-Stage Unboxed Computational Math Lab */}
        <ResearchAsciiLab />

        {/* CHAPTER 05: Editorial Contact Directory */}
        <ContactSection
          copiedDiscord={copiedDiscord}
          onCopyDiscord={handleCopyDiscord}
        />

        {/* Interactive Diagonal Beam Wordmark Footer */}
        <BeamWordmarkFooter
          brand={PROFILE_SEED.handle}
          wordmark={PROFILE_SEED.handle}
          showTop={false}
          background="#090709"
          ink="#F5F5F7"
          muted="#A1A1AA"
          accent="#E11D48"
          wordTop="#7A1C38"
          wordFoot="#12080D"
          fontSans='"Outfit", "Inter", system-ui, sans-serif'
          wordWeight={700}
          cut={0.1}
        />
      </main>

      {/* Fullscreen Cinema Project Detail Modal */}
      <ProjectCinemaModal
        project={selectedProject}
        totalCount={modalPool.length}
        currentIndex={selectedIndex}
        onClose={() => setSelectedProjectId(null)}
        onStep={handleStepModal}
      />
    </div>
  );
}
