import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { ParticleBackground } from '@/ui/components/ParticleBackground';
import { TitleScreen } from '@/ui/screens/TitleScreen';
import { AssessmentScreen } from '@/ui/screens/AssessmentScreen';
import { AppearanceScreen } from '@/ui/screens/AppearanceScreen';
import { RevealScreen } from '@/ui/screens/RevealScreen';
import { ClassChoiceScreen } from '@/ui/screens/ClassChoiceScreen';
import { SummaryScreen } from '@/ui/screens/SummaryScreen';
import { SettingsScreen } from '@/ui/screens/SettingsScreen';
import { LoadGameScreen } from '@/ui/screens/LoadGameScreen';
import { ClassesScreen } from '@/ui/screens/ClassesScreen';
import { WorldMapScreen } from '@/ui/screens/WorldMapScreen';

function ScreenTransition({ children, duration }: { children: React.ReactNode; duration: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const currentScreen = useGameStore((state) => state.currentScreen);
  const settings = useGameStore((state) => state.settings);
  const transitionDuration = settings.textSpeed === 'Slow' ? 0.8 : settings.textSpeed === 'Fast' ? 0.2 : 0.5;

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.difficulty = settings.difficulty.toLowerCase();
    document.documentElement.dataset.textSpeed = settings.textSpeed.toLowerCase();
  }, [settings.difficulty, settings.textSpeed, settings.theme]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return (
          <ScreenTransition key="title" duration={transitionDuration}>
            <TitleScreen />
          </ScreenTransition>
        );
      case 'assessment':
        return (
          <ScreenTransition key="assessment" duration={transitionDuration}>
            <AssessmentScreen />
          </ScreenTransition>
        );
      case 'appearance':
        return (
          <ScreenTransition key="appearance" duration={transitionDuration}>
            <AppearanceScreen />
          </ScreenTransition>
        );
      case 'reveal':
        return (
          <ScreenTransition key="reveal" duration={transitionDuration}>
            <RevealScreen />
          </ScreenTransition>
        );
      case 'classChoice':
        return (
          <ScreenTransition key="classChoice" duration={transitionDuration}>
            <ClassChoiceScreen />
          </ScreenTransition>
        );
      case 'summary':
        return (
          <ScreenTransition key="summary" duration={transitionDuration}>
            <SummaryScreen />
          </ScreenTransition>
        );
      case 'settings':
        return (
          <ScreenTransition key="settings" duration={transitionDuration}>
            <SettingsScreen />
          </ScreenTransition>
        );
      case 'load':
        return (
          <ScreenTransition key="load" duration={transitionDuration}>
            <LoadGameScreen />
          </ScreenTransition>
        );
      case 'classes':
        return (
          <ScreenTransition key="classes" duration={transitionDuration}>
            <ClassesScreen />
          </ScreenTransition>
        );
      default:
        return (
          <ScreenTransition key="title" duration={transitionDuration}>
            <TitleScreen />
          </ScreenTransition>
        );
      case 'worldMap':
        return (
          <ScreenTransition key="worldMap" duration={transitionDuration}>
            <WorldMapScreen />
          </ScreenTransition>
        );
    }
  };

  return (
    <div className="app-shell min-h-screen text-stone-100 overflow-x-hidden">
      <ParticleBackground />
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  );
}

export default App;
