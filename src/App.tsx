
import { useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { TechStack } from './components/TechStack';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';
import { useLimelightStore } from './store/useLimelightStore';
import styles from './App.module.css';

function App() {
  const isLimelightActive = useLimelightStore((state) => state.isLimelightActive);
  const isChatbotOpen = useLimelightStore((state) => state.isChatbotOpen);
  const isProjectDetailsOpen = useLimelightStore((state) => state.isProjectDetailsOpen);
  const deactivateLimelight = useLimelightStore((state) => state.deactivateLimelight);
  const prevIsLimelightActive = useRef(isLimelightActive);

  useEffect(() => {
    if (isLimelightActive) {
      document.body.classList.add('limelight-active');
    } else {
      document.body.classList.remove('limelight-active');
    }
  }, [isLimelightActive]);

  useEffect(() => {
    if (isChatbotOpen) {
      document.body.classList.add('chatbot-open');
    } else {
      document.body.classList.remove('chatbot-open');
    }
  }, [isChatbotOpen]);

  useEffect(() => {
    if (isProjectDetailsOpen) {
      document.body.classList.add('project-details-open');
    } else {
      document.body.classList.remove('project-details-open');
    }
  }, [isProjectDetailsOpen]);

  useEffect(() => {
    // Parse pathname
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1]?.toLowerCase();

    // Parse query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const queryId = (
      searchParams.get('project') ||
      searchParams.get('id') ||
      searchParams.get('highlight') ||
      searchParams.get('limelight')
    )?.toLowerCase();

    const target = lastSegment || queryId;
    console.log('[Limelight Debug] Mount checking URL:', { pathname: window.location.pathname, lastSegment, queryId, target });

    const urlToLimelightId: Record<string, string> = {
      // Projects
      c_helper: 'c_helper',
      crypto: 'c_helper',
      crypto_platform: 'c_helper',
      
      mayax: 'mayax',
      interior: 'mayax',
      design: 'mayax',
      
      blockex: 'blockex',
      safari: 'blockex',
      extension: 'blockex',
      
      peer_focus: 'peer_focus',
      peerfocus: 'peer_focus',
      coworking: 'peer_focus',
      
      wallulu: 'wallulu',
      wallpaper: 'wallulu',
      
      // Experience / Education
      exp_gohappy: 'exp_gohappy',
      gohappy: 'exp_gohappy',
      gohappyclub: 'exp_gohappy',
      
      exp_drupsc: 'exp_drupsc',
      drupsc: 'exp_drupsc',
      
      edu_skit: 'edu_skit',
      skit: 'edu_skit',
      education: 'edu_skit'
    };

    if (target && urlToLimelightId[target]) {
      const targetId = urlToLimelightId[target];
      console.log('[Limelight Debug] Matching target ID found:', targetId);
      // Delay slightly to ensure components are mounted and IDs are present in DOM
      const timer = setTimeout(() => {
        console.log('[Limelight Debug] Activating limelight for:', targetId);
        useLimelightStore.getState().activateLimelight(targetId);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      console.log('[Limelight Debug] No matching target ID found in URL.');
    }
  }, []);

  useEffect(() => {
    // Only clean up the URL when transitioning from active to inactive
    if (prevIsLimelightActive.current && !isLimelightActive) {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1]?.toLowerCase();
      
      const searchParams = new URLSearchParams(window.location.search);

      const urlToLimelightId: Record<string, string> = {
        c_helper: 'c_helper', crypto: 'c_helper', crypto_platform: 'c_helper',
        mayax: 'mayax', interior: 'mayax', design: 'mayax',
        blockex: 'blockex', safari: 'blockex', extension: 'blockex',
        peer_focus: 'peer_focus', peerfocus: 'peer_focus', coworking: 'peer_focus',
        wallulu: 'wallulu', wallpaper: 'wallulu',
        exp_gohappy: 'exp_gohappy', gohappy: 'exp_gohappy', gohappyclub: 'exp_gohappy',
        exp_drupsc: 'exp_drupsc', drupsc: 'exp_drupsc',
        edu_skit: 'edu_skit', skit: 'edu_skit', education: 'edu_skit'
      };

      let changed = false;
      let newPathname = window.location.pathname;
      let newSearch = window.location.search;

      if (lastSegment && urlToLimelightId[lastSegment]) {
        pathSegments.pop();
        newPathname = '/' + pathSegments.join('/') + (pathSegments.length > 0 || window.location.pathname.endsWith('/') ? '/' : '');
        changed = true;
      }

      const paramsToRemove = ['project', 'id', 'highlight', 'limelight'];
      paramsToRemove.forEach(param => {
        if (searchParams.has(param)) {
          searchParams.delete(param);
          changed = true;
        }
      });
      newSearch = searchParams.toString();
      if (newSearch) {
        newSearch = '?' + newSearch;
      }

      if (changed) {
        console.log('[Limelight Debug] Cleaning up URL to:', newPathname + newSearch);
        const newUrl = newPathname + newSearch + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      }
    }
    prevIsLimelightActive.current = isLimelightActive;
  }, [isLimelightActive]);


  return (
    <>
      <div 
        className={`limelight-backdrop ${isLimelightActive ? 'limelight-backdrop-active' : ''}`}
        id="limelight-overlay"
        onClick={deactivateLimelight}
      />
      <Header />
      <main className={styles.main}>
        <Hero />
        <Projects />
        <Experience />
        <TechStack />
      </main>
      <Footer />
      <AIAssistant />
    </>
  );
}

export default App;
