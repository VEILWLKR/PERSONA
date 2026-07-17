import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { ParticleBackground } from '@/ui/components/ParticleBackground';
import { TitleScreen } from '@/ui/screens/TitleScreen';
import { AssessmentScreen } from '@/ui/screens/AssessmentScreen';
import { CreationScreen } from '@/ui/screens/CreationScreen';
import { RevealScreen } from '@/ui/screens/RevealScreen';
import { SummaryScreen } from '@/ui/screens/SummaryScreen';
import { SettingsScreen } from '@/ui/screens/SettingsScreen';
import { LoadGameScreen } from '@/ui/screens/LoadGameScreen';

function ScreenTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const currentScreen = useGameStore((state) => state.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return (
          <ScreenTransition key="title">
            <TitleScreen />
          </ScreenTransition>
        );
      case 'assessment':
        return (
          <ScreenTransition key="assessment">
            <AssessmentScreen />
          </ScreenTransition>
        );
      case 'creation':
        return (
          <ScreenTransition key="creation">
            <CreationScreen />
          </ScreenTransition>
        );
      case 'reveal':
        return (
          <ScreenTransition key="reveal">
            <RevealScreen />
          </ScreenTransition>
        );
      case 'summary':
        return (
          <ScreenTransition key="summary">
            <SummaryScreen />
          </ScreenTransition>
        );
      case 'settings':
        return (
          <ScreenTransition key="settings">
            <SettingsScreen />
          </ScreenTransition>
        );
      case 'load':
        return (
          <ScreenTransition key="load">
            <LoadGameScreen />
          </ScreenTransition>
        );
      default:
        return (
          <ScreenTransition key="title">
            <TitleScreen />
          </ScreenTransition>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#090f17] text-stone-100 overflow-x-hidden">
      <ParticleBackground />
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  );
}

export default App;
