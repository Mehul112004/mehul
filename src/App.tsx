
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
  const deactivateLimelight = useLimelightStore((state) => state.deactivateLimelight);

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
