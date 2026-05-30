
import { useState } from 'react';
import styles from './Projects.module.css';
import { useLimelightStore, getHighlightStyle } from '../store/useLimelightStore';
import { ProjectModal } from './ProjectModal';
import portfolioData from '../data/portfolio.json';

interface Project {
  id: string;
  version: string;
  iconName: string;
  title: string;
  description: string;
  tags: string[];
}

const PROJECTS_DATA: Project[] = [
  {
    id: 'c_helper',
    version: 'v1.2.0',
    iconName: 'candlestick_chart',
    title: 'C_Helper: Crypto Intelligence',
    description: 'Crypto signal intelligence platform featuring a gate-based strategy engine, SMC zone detection, real-time WebSocket scanning, and local LLM confirmation.',
    tags: ['PYTHON', 'FLASK', 'TIMESCALEDB', 'REACT', 'LLM']
  },
  {
    id: 'mayax',
    version: 'v2.1.0',
    iconName: 'imagesmode',
    title: 'MayaX: AI Interior Design',
    description: 'AI-driven interior design mobile app with Stable Diffusion style transfer and on-device Llama 3.2 1B prompt refinement via ExecuTorch.',
    tags: ['REACT NATIVE', 'EXPO', 'SUPABASE', 'PYTORCH']
  },
  {
    id: 'blockex',
    version: 'v1.0.5',
    iconName: 'extension',
    title: 'Blockex: Safari Extension',
    description: 'Native Safari browser extension for iOS and macOS blocking specific sites and hiding YouTube Shorts dynamically using MutationObserver.',
    tags: ['SWIFT', 'JAVASCRIPT', 'UIKIT', 'MANIFEST_V3']
  },
  {
    id: 'peer_focus',
    version: 'v1.1.2',
    iconName: 'timer',
    title: 'Peer Focus: Co-Working Rooms',
    description: 'Collaborative study rooms with synchronized Pomodoro timers, goal tracking, a raw Canvas analog timer, and dual-backend abstraction.',
    tags: ['REACT', 'TYPESCRIPT', 'SUPABASE', 'FIREBASE', 'CANVAS']
  },
  {
    id: 'wallulu',
    version: 'v1.0.1',
    iconName: 'wallpaper',
    title: 'Wallulu: Wallpaper Browser',
    description: 'Wallpaper discovery app with a responsive masonry layout, advanced bottom-sheet filtering, and debounced API searching.',
    tags: ['REACT NATIVE', 'EXPO', 'FLASH-LIST', 'PIXABAY']
  }
];

export function Projects() {
  const highlightedProjectIds = useLimelightStore((state) => state.highlightedProjectIds);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const handleCardClick = (project: Project) => {
    const matchedNode = portfolioData.nodes.find(
      (node) => node.id === `proj_${project.id}`
    );
    
    const details = {
      id: project.id,
      version: project.version,
      iconName: project.iconName,
      title: project.title,
      description: project.description,
      longDescription: matchedNode?.drawerDetails?.description || project.description,
      tags: project.tags,
      role: matchedNode?.drawerDetails?.role || 'Sole Developer',
      timeline: matchedNode?.drawerDetails?.timeline || '2026',
      status: 'DEPLOYED_STABLE',
      live: matchedNode?.drawerDetails?.live || null,
      github: matchedNode?.drawerDetails?.github || null,
    };
    
    setSelectedProject(details);
  };

  return (
    <section className={styles.section} id="projects">
      <div className={styles.header}>
        <div>
          <span className={styles.label}>01 // SELECTED_WORKS</span>
          <h2 className={styles.title}>PROJECT_SHOWCASE</h2>
        </div>
        <div className={styles.totalItems}>Total: 05 Items</div>
      </div>
      
      <div className={styles.grid}>
        {PROJECTS_DATA.map((project, idx) => {
          const isHighlighted = highlightedProjectIds.includes(project.id);
          const highlightIndex = highlightedProjectIds.indexOf(project.id);
          return (
            <div 
              key={idx} 
              id={project.id}
              className={`${styles.card} ${isHighlighted ? 'project-highlight-active' : ''}`}
              style={isHighlighted ? getHighlightStyle(project.id, highlightIndex, highlightedProjectIds.length) : undefined}
              onClick={() => handleCardClick(project)}
            >
              {isHighlighted && (
                <div className="source-tag">
                  SOURCE_REF: DONNA_v1.0.2
                </div>
              )}

              <div className={styles.cardHeader}>
                <span className={styles.version}>{project.version}</span>
                <span className={`material-symbols-outlined ${styles.icon}`}>
                  {project.iconName}
                </span>
              </div>
              
              <div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>
                  {project.id === 'c_helper' ? (
                    <>
                      Crypto signal platform identifying trade setups using technical analysis with a{' '}
                      <span className={`highlight-target ${isHighlighted ? 'text-mark' : ''}`}>
                        gate-based strategy engine
                      </span>{' '}
                      and local{' '}
                      <span className={`highlight-target ${isHighlighted ? 'text-mark' : ''}`}>
                        LLM confirmation
                      </span>{' '}
                      via WebSocket scanning.
                    </>
                  ) : (
                    project.description
                  )}
                </p>
                
                <div className={styles.techTags}>
                  {project.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ProjectModal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </section>
  );
}
