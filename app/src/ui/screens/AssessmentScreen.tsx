import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, Brain, Heart, Eye } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { ASSESSMENT_QUESTIONS } from '@/data/questions';
import type { AssessmentAnswer } from '@/types/game';

export function AssessmentScreen() {
  const { addAnswer, assessmentAnswers, setScreen } = useGameStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = ASSESSMENT_QUESTIONS[currentQ];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progress = ((currentQ + (isComplete ? 1 : 0)) / totalQuestions) * 100;

  const existingAnswer = assessmentAnswers.find(a => a.questionId === question.id);

  const handleSelect = (optionIndex: number) => {
    const answer: AssessmentAnswer = {
      questionId: question.id,
      selectedOption: optionIndex,
      answerText: question.options[optionIndex].text,
    };

    addAnswer(answer);

    // Auto-advance after brief delay
    setTimeout(() => {
      if (currentQ < totalQuestions - 1) {
        setDirection(1);
        setCurrentQ(prev => prev + 1);
      } else {
        finishAssessment();
      }
    }, 500);
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setDirection(-1);
      setCurrentQ(prev => prev - 1);
    }
  };

  const finishAssessment = () => {
    setIsComplete(true);
    setTimeout(() => {
      setScreen('creation');
    }, 1500);
  };

  const getCategoryIcon = () => {
    const cat = question.category;
    if (cat.startsWith('mbti')) return <Brain className="w-5 h-5 text-purple-400" />;
    if (['empathy', 'honor', 'spirituality'].includes(cat)) return <Heart className="w-5 h-5 text-rose-400" />;
    return <Eye className="w-5 h-5 text-amber-400" />;
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          </motion.div>
          <h2 className="fantasy-title text-4xl text-amber-300 mb-4">Your Essence Revealed</h2>
          <p className="fantasy-text text-amber-200/60 text-lg">The threads of fate are being woven...</p>
          <motion.div
            className="mt-8 w-48 h-1 bg-amber-900/50 rounded-full mx-auto overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            {getCategoryIcon()}
            <span className="fantasy-heading text-sm text-amber-200/50 uppercase tracking-widest">
              The Oracle&apos;s Inquiry
            </span>
          </div>
          <h2 className="fantasy-heading text-2xl text-amber-100/80">
            Question {currentQ + 1} of {totalQuestions}
          </h2>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-amber-950/50 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="panel-fantasy p-6 md:p-8 mb-6">
              <h3 className="fantasy-text text-xl md:text-2xl text-amber-100/90 leading-relaxed mb-8">
                {question.text}
              </h3>

              <div className="flex flex-col gap-3">
                {question.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`option-card ${
                      existingAnswer?.selectedOption === idx ? 'selected' : ''
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span className="fantasy-text text-amber-100/80">{option.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={handleBack}
            className="flex items-center gap-2 text-amber-200/50 hover:text-amber-300 transition-colors disabled:opacity-30"
            disabled={currentQ === 0}
            whileHover={{ x: -3 }}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="fantasy-heading text-sm">Previous</span>
          </motion.button>

          <span className="fantasy-heading text-xs text-amber-200/30">
            {Math.round(progress)}% Complete
          </span>

          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </div>
    </div>
  );
}
