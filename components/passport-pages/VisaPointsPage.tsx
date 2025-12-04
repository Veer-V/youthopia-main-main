import * as React from "react";
import {
  motion,
  animate,
  useMotionValue,
  Variants,
  AnimatePresence
} from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { SURVEY_QUESTIONS, SurveyQuestion } from '../../data/surveyQuestions';

// --- Types ---
interface PointTransaction {
  timestamp: number;
  reason: string;
  points: number;
}

interface User {
  visaPoints: number;
  spinsAvailable: number;
  pointsHistory: PointTransaction[];
}

interface PrizeSegment {
  points: number;
  color: string;
}

// --- Constants ---
const PRIZE_SEGMENTS: PrizeSegment[] = [
  { points: 10, color: "#6366f1" },  // Indigo
  { points: 20, color: "#8b5cf6" }, // Violet
  { points: 30, color: "#ec4899" },  // Pink
  { points: 40, color: "#f59e0b" }, // Amber
  { points: 10, color: "#6366f1" },  // Indigo
  { points: 20, color: "#10b981" }, // Emerald
  { points: 30, color: "#ec4899" },  // Pink
  { points: 40, color: "#ef4444" }, // Red
];
const SEGMENT_COUNT = PRIZE_SEGMENTS.length;
const SEGMENT_ANGLE_DEG = 360 / SEGMENT_COUNT;
const WHEEL_RADIUS = 90;

// --- Inline SVG Icons ---
const FiGift: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
  </svg>
);
const FiX: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const FiAward: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const AnimatedCounter: React.FC<{ to: number; className?: string }> = ({ to, className }) => {
  const count = useMotionValue(0);
  const rounded = useMotionValue(0);

  React.useEffect(() => {
    const animation = animate(count, to, { duration: 1 });
    const unsubscribe = count.on("change", (latest) => {
      rounded.set(Math.round(latest));
    });
    return () => {
      unsubscribe();
      animation.stop();
    };
  }, [to, count, rounded]);

  return <motion.span className={className}>{rounded}</motion.span>;
};

const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}></div>
);



// --- Animation Variants ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemSpringUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// --- Web Audio API Sound Helpers ---
let audioContext: AudioContext | null = null;
const getAudioContext = () => {
  if (typeof window !== 'undefined' && !audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const playTickSound = () => {
  const context = getAudioContext();
  if (!context) return;
  try {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    gain.gain.setValueAtTime(0.05, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.05);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.05);
  } catch (e) {
    console.error("Could not play sound:", e);
  }
};

const playWinSound = () => {
  const context = getAudioContext();
  if (!context) return;
  try {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
    oscillator.frequency.linearRampToValueAtTime(1046.50, context.currentTime + 0.2); // C6
    gain.gain.setValueAtTime(0.2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.4);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.4);
  } catch (e) {
    console.error("Could not play win sound:", e);
  }
}


// --- Helper Function for SVG Arc Path ---
const getSegmentPath = (index: number): string => {
  const startAngle = (SEGMENT_ANGLE_DEG * index - 90) * (Math.PI / 180);
  const endAngle = (SEGMENT_ANGLE_DEG * (index + 1) - 90) * (Math.PI / 180);
  const startX = 100 + WHEEL_RADIUS * Math.cos(startAngle);
  const startY = 100 + WHEEL_RADIUS * Math.sin(startAngle);
  const endX = 100 + WHEEL_RADIUS * Math.cos(endAngle);
  const endY = 100 + WHEEL_RADIUS * Math.sin(endAngle);
  return `M 100 100 L ${startX} ${startY} A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 0 1 ${endX} ${endY} Z`;
};


// --- Child Components ---

interface PrizeWheelProps {
  onSpinComplete: (prize: PrizeSegment) => void;
  user: User | null;
  useSpin: () => void;
  isSpinning: boolean;
  setIsSpinning: (isSpinning: boolean) => void;
}

const PrizeWheel: React.FC<PrizeWheelProps> = ({ onSpinComplete, user, useSpin, isSpinning, setIsSpinning }) => {
  const rotation = useMotionValue(0);
  const lastTickAngle = React.useRef(0);
  const wheelRef = React.useRef<HTMLDivElement>(null);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSpin();
    }
  };

  // Add touch support for mobile devices
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isSpinning) {
      handleSpin();
    }
  };

  const handleSpin = () => {
    if (!user || user.spinsAvailable <= 0 || isSpinning) return;
    setIsSpinning(true);
    useSpin();

    // Pre-determined sector configuration
    const PREDETERMINED_POINTS = 10;
    const predeterminedIndex = PRIZE_SEGMENTS.findIndex(s => s.points === PREDETERMINED_POINTS);
    const usePredetermined = true;

    const randomSpins = 5 + Math.random() * 5;
    const prizeIndex = usePredetermined && predeterminedIndex >= 0
      ? predeterminedIndex
      : Math.floor(Math.random() * SEGMENT_COUNT);
    const prize = PRIZE_SEGMENTS[prizeIndex];

    const currentRotation = rotation.get();
    const targetRotation = (randomSpins * 360) + (currentRotation - (currentRotation % 360)) - (prizeIndex * SEGMENT_ANGLE_DEG) - (SEGMENT_ANGLE_DEG / 2);

    animate(rotation, targetRotation, {
      type: "spring", stiffness: 25, damping: 20, mass: 1.5,
      onUpdate: (latest) => {
        const anglePerTick = SEGMENT_ANGLE_DEG / 2;
        if (Math.abs(latest - lastTickAngle.current) > anglePerTick) {
          playTickSound();
          lastTickAngle.current = latest;
        }
      },
      onComplete: () => {
        const finalAngle = ((rotation.get() % 360) + 360) % 360; // 0..360
        const adjusted = (360 - finalAngle) % 360; // align with top pointer
        const finalIndex = Math.floor(adjusted / SEGMENT_ANGLE_DEG) % SEGMENT_COUNT;
        const landedPrize = PRIZE_SEGMENTS[finalIndex];
        onSpinComplete(landedPrize);
        setIsSpinning(false);
      },
    });
  };

  if (!user) return null;

  return (
    <motion.div
      ref={wheelRef}
      variants={itemSpringUp}
      className="flex flex-col items-center justify-around bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 md:p-6 min-h-[400px] sm:min-h-[480px] w-full max-w-md mx-auto"
      role="region"
      aria-label="Prize wheel"
    >
      <div
        className="relative w-56 h-56 sm:w-60 sm:h-60 md:w-64 md:h-64 touch-none"
        role="img"
        aria-label="Spinning wheel with prize segments"
      >
        <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-10" style={{ filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.3))" }}>
          <svg width="30" height="42" viewBox="0 0 20 30"><polygon points="0,0 20,0 10,30" className="fill-yellow-400" /></svg>
        </div>

        <motion.svg viewBox="0 0 200 200" className="w-full h-full" style={{ rotate: rotation }}>
          <defs><filter id="shadow"><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="rgba(0,0,0,0.2)" /></filter></defs>
          <g filter="url(#shadow)">
            {PRIZE_SEGMENTS.map((segment, i) => {
              const midAngleDeg = SEGMENT_ANGLE_DEG * i + (SEGMENT_ANGLE_DEG / 2);
              const midAngleRad = (midAngleDeg - 90) * (Math.PI / 180);
              const textRadius = WHEEL_RADIUS * 0.65;
              const textX = 100 + textRadius * Math.cos(midAngleRad);
              const textY = 100 + textRadius * Math.sin(midAngleRad);
              return (
                <g key={i}>
                  <path d={getSegmentPath(i)} fill={segment.color} stroke="#00000020" strokeWidth="0.5" />
                  <text x={textX} y={textY} transform={`rotate(${midAngleDeg}, ${textX}, ${textY})`} fill="white" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}>{segment.points}</text>
                </g>
              );
            })}
          </g>
          <circle cx="100" cy="100" r="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" /><circle cx="100" cy="100" r="6" fill="#6366f1" />
        </motion.svg>
      </div>

      <div className="text-center">
        <motion.button
          onClick={handleSpin}
          onKeyDown={handleKeyDown}
          disabled={user.spinsAvailable <= 0 || isSpinning}
          className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold py-3 px-8 md:px-10 rounded-full text-base md:text-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all duration-300 enabled:hover:shadow-xl enabled:hover:shadow-indigo-500/40 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:from-gray-500 disabled:to-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          whileHover={user.spinsAvailable > 0 && !isSpinning ? { scale: 1.05, y: -3 } : {}}
          whileTap={user.spinsAvailable > 0 && !isSpinning ? { scale: 0.98 } : {}}
          aria-label={isSpinning ? "Spinning in progress" : "Spin the wheel"}
          aria-busy={isSpinning}
        >
          {isSpinning ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Spinning...
            </>
          ) : (
            <>
              <FiGift className="mr-2" />
              Spin the Wheel
            </>
          )}
        </motion.button>
        <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
          {user.spinsAvailable} spin{user.spinsAvailable !== 1 ? "s" : ""} available
        </p>
      </div>
    </motion.div>
  );
};

const PointsDisplay: React.FC<{ user: User | null }> = ({ user }) => {
  if (!user) return null;
  return (
    <div className="bg-gray-800 text-white p-5 rounded-lg mb-5 flex items-center justify-between shadow-lg shadow-black/20">
      <div>
        <p className="text-sm text-gray-300 uppercase tracking-wider">Current Balance</p>
        <div className="flex items-baseline gap-2">
          <AnimatedCounter to={user.visaPoints} className="text-4xl font-bold" />
          <span className="font-semibold text-gray-200">Points</span>
        </div>
      </div>
      <FiGift size={40} className="text-yellow-400 opacity-80" />
    </div>
  );
};

const TransactionHistory: React.FC<{ user: User | null }> = ({ user }) => {
  const reversedHistory = React.useMemo(() => user?.pointsHistory ? [...user.pointsHistory].reverse() : [], [user?.pointsHistory]);
  if (!user) return null;
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 px-1">Recent Activity</h4>
      <div className="overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-800/60 rounded-lg p-1 custom-scrollbar">
        <div className="p-3 space-y-1">
          {reversedHistory.length > 0 ? (
            reversedHistory.map((tx, i) => (
              <div key={`${tx.timestamp}-${i}`} className="flex justify-between items-center py-2.5 border-b border-gray-200 dark:border-gray-700/50 last:border-b-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">{tx.reason}</p>
                <p className={`font-bold text-sm ${tx.points > 0 ? "text-green-500" : "text-red-500"}`}>{tx.points > 0 ? "+" : ""}{tx.points}</p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-center text-sm text-gray-500 dark:text-gray-400 py-12">
              <p>No transactions yet. <br /> Spin the wheel to earn points!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answers: Record<string, any>) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedQuestions, setSelectedQuestions] = React.useState<SurveyQuestion[]>([]);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, any>>({});
  const [direction, setDirection] = React.useState(0);

  // Select 3 random questions when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const shuffled = [...SURVEY_QUESTIONS].sort(() => 0.5 - Math.random());
      setSelectedQuestions(shuffled.slice(0, 3));
      setCurrentStep(0);
      setAnswers({});
      setDirection(0);
    }
  }, [isOpen]);

  if (!isOpen || selectedQuestions.length === 0) return null;

  const currentQuestion = selectedQuestions[currentStep];
  const isLastQuestion = currentStep === selectedQuestions.length - 1;

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < selectedQuestions.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'multi') {
      return answer && answer.length > 0;
    }
    if (currentQuestion.type === 'grid') {
      return currentQuestion.gridRows?.every(row => answer && answer[row]);
    }
    return !!answer;
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 })
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Survey</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Question {currentStep + 1} of {selectedQuestions.length}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
              <span className="w-5 h-5 flex items-center justify-center"><FiCheck /></span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-100 dark:bg-gray-700 w-full">
            <motion.div
              className="h-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / selectedQuestions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium mb-3">
                  {currentQuestion.category}
                </span>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                  {currentQuestion.text}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.type === 'single' && currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(currentQuestion.id, option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${answers[currentQuestion.id] === option
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 text-gray-600 dark:text-gray-300'
                        }`}
                    >
                      <span className="font-medium">{option}</span>
                      {answers[currentQuestion.id] === option && <span className="w-5 h-5 flex items-center justify-center"><FiCheck /></span>}
                    </button>
                  ))}

                  {currentQuestion.type === 'multi' && currentQuestion.options?.map((option) => {
                    const isSelected = (answers[currentQuestion.id] || []).includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          const current = answers[currentQuestion.id] || [];
                          let next;
                          if (option === 'None' || option === 'None of the above' || option === 'No impact') {
                            next = isSelected ? [] : [option];
                          } else {
                            const withoutNone = current.filter((i: string) => !['None', 'None of the above', 'No impact'].includes(i));
                            next = isSelected ? withoutNone.filter((i: string) => i !== option) : [...withoutNone, option];
                          }
                          handleAnswer(currentQuestion.id, next);
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                          : 'border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 text-gray-600 dark:text-gray-300'
                          }`}
                      >
                        <span className="font-medium">{option}</span>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                          {isSelected && <div className="text-white"><FiCheck /></div>}
                        </div>
                      </button>
                    );
                  })}

                  {currentQuestion.type === 'grid' && (
                    <div className="space-y-6">
                      {currentQuestion.gridRows?.map((row) => (
                        <div key={row} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                          <p className="font-medium text-gray-800 dark:text-white mb-3">{row}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                            {currentQuestion.gridCols?.map((col) => {
                              const isSelected = answers[currentQuestion.id]?.[row] === col;
                              return (
                                <button
                                  key={col}
                                  onClick={() => {
                                    const current = answers[currentQuestion.id] || {};
                                    handleAnswer(currentQuestion.id, { ...current, [row]: col });
                                  }}
                                  className={`p-2 rounded-lg text-xs sm:text-sm border transition-all ${isSelected
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-400'
                                    }`}
                                >
                                  {col}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentStep === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <span className="mr-1 flex items-center"><FiChevronLeft /></span> Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-2 rounded-lg font-bold text-white transition-all transform active:scale-95 ${!canProceed()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'
                }`}
            >
              {isLastQuestion ? 'Submit & Claim' : 'Next'}
              {!isLastQuestion && <span className="ml-1 flex items-center"><FiChevronRight /></span>}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface PrizeModalProps {
  prize: PrizeSegment | null;
  onClose: () => void;
  onAnswerNow: () => void;
}
const PrizeModal: React.FC<PrizeModalProps> = ({ prize, onClose, onAnswerNow }) => {
  if (!prize) return null;
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-3">
            <FiAward className="text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Congratulations!</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">You landed on {prize.points} points.</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Answer a quick question to redeem your points.</p>
          <div className="mt-4 flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Close</button>
            <button onClick={onAnswerNow} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Answer now</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface Coupon {
  id: string;
  title: string;
  requiredPoints: number;
}
const COUPONS: Coupon[] = [
  { id: 'CPN-5', title: '5 Bonus Points Coupon', requiredPoints: 5 },
  { id: 'CPN-10', title: 'Youthopia Sticker Pack', requiredPoints: 10 },
  { id: 'CPN-20', title: 'Free Meal Voucher', requiredPoints: 20 },
];

interface CouponsSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizePoints: number;
  onClaim: (coupon: Coupon) => void;
}
const CouponsSelectionModal: React.FC<CouponsSelectionModalProps> = ({ isOpen, onClose, prizePoints, onClaim }) => {
  if (!isOpen) return null;
  const eligible = COUPONS.filter(c => c.requiredPoints <= prizePoints);
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">Select your Coupons</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">You won {prizePoints} points. Choose any eligible coupon below.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligible.length > 0 ? eligible.map(c => (
              <div key={c.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{c.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Requires {c.requiredPoints} points</p>
                <button onClick={() => onClaim(c)} className="mt-3 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Claim</button>
              </div>
            )) : (
              <p className="text-gray-700 dark:text-gray-300">No eligible coupons. Try winning more points!</p>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
const VisaPointsPageSkeleton: React.FC = () => (
  <div className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col flex-1">
    <SkeletonLoader className="h-8 w-1/3 rounded-md mb-4 animate-pulse" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1">
      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <SkeletonLoader className="w-64 h-64 rounded-full mb-6 animate-pulse" />
        <SkeletonLoader className="h-12 w-48 rounded-full mb-3 animate-pulse" />
        <SkeletonLoader className="h-4 w-24 rounded-md animate-pulse" />
      </div>
      <div className="flex flex-col">
        <SkeletonLoader className="h-[108px] w-full rounded-lg mb-5 animate-pulse" />
        <SkeletonLoader className="h-6 w-1/4 rounded-md mb-3 animate-pulse" />
        <SkeletonLoader className="w-full rounded-lg flex-1 animate-pulse" />
      </div>
    </div>
  </div>
);


// --- Main Page Component ---
// VisaPointsPage component
const VisaPointsPage: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [wonPrize, setWonPrize] = React.useState<PrizeSegment | null>(null);
  const [isQuizOpen, setIsQuizOpen] = React.useState(false);
  const [quizError, setQuizError] = React.useState<string | null>(null);
  const [showCoupons, setShowCoupons] = React.useState(false);

  // Move addPoints above any hooks that depend on it
  const { addPoints, useSpin, submitSurveyResponse } = useAuth();

  // Keep only one handleSpinComplete: do NOT award points here
  const handleSpinComplete = React.useCallback((prize: PrizeSegment) => {
    try {
      setWonPrize(prize);
      console.log(`Wheel stopped at ${prize.points} points`);
    } catch (error) {
      console.error('Error handling spin complete:', error);
    }
  }, []);

  const handleAnswerNow = React.useCallback(() => {
    setIsQuizOpen(true);
  }, []);

  const navigate = useNavigate();

  const handleQuizSubmit = React.useCallback((answers: Record<string, any>) => {
    if (!wonPrize) return;
    console.log('Survey submitted:', answers);

    // Submit survey response to AuthContext
    submitSurveyResponse(answers);

    setQuizError(null);
    setIsQuizOpen(false);
    // Award points
    addPoints(wonPrize.points, 'Spin Wheel Prize');
    // Redirect to Redeem page
    navigate('/dashboard', { state: { targetPage: 'Redeem' } });
  }, [wonPrize, addPoints, navigate, submitSurveyResponse]);

  const handleClaimCoupon = React.useCallback((coupon: { id: string; title: string; requiredPoints: number }) => {
    addPoints(0, `Coupon Claimed: ${coupon.title}`);
    setShowCoupons(false);
    setWonPrize(null);
    console.log(`Coupon claimed: ${coupon.title}`);
  }, [addPoints]);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 750));

        // Mock data - in a real app, this would be an API call
        const mockUser: User = {
          visaPoints: 140,
          spinsAvailable: 3,
          pointsHistory: [
            { timestamp: Date.now() - 10000, reason: "Spin Wheel Prize", points: 2 },
            { timestamp: Date.now() - 20000, reason: "Achievement: Points Hoarder", points: 25 },
            { timestamp: Date.now() - 30000, reason: "Spin Wheel Prize", points: 5 },
          ],
        };

        setUser(mockUser);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Failed to load points data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <VisaPointsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-500 dark:text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) return <div className="p-6 text-center text-gray-600 dark:text-gray-300">Could not load user data.</div>;

  return (
    <>
      <motion.div className="w-full bg-transparent p-4 md:p-6 flex flex-col" variants={staggerContainer} initial="hidden" animate="visible" exit="hidden">
        <motion.h3 variants={itemSpringUp} className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 shrink-0">
          Your VISA Points
        </motion.h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1">
          <PrizeWheel
            onSpinComplete={handleSpinComplete}
            user={user}
            useSpin={useSpin}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
          <motion.div variants={itemSpringUp} className="flex flex-col min-h-0">
            <PointsDisplay user={user} />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/redeem'}
              className="w-full py-4 mb-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 hover:shadow-pink-500/50 transition-all"
            >
              <FiGift className="w-6 h-6" />
              Redeem Points for Rewards
            </motion.button>



            <TransactionHistory user={user} />
          </motion.div>
        </div>
      </motion.div>

      {/* Prize modal with CTA to open quiz */}
      <PrizeModal
        prize={wonPrize}
        onClose={() => {
          setWonPrize(null);
          setIsSpinning(false);
        }}
        onAnswerNow={handleAnswerNow}
      />

      {/* Quiz modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSubmit={handleQuizSubmit}
      />

      {/* Coupons selection modal */}
      <CouponsSelectionModal
        isOpen={showCoupons}
        onClose={() => setShowCoupons(false)}
        prizePoints={wonPrize?.points ?? 0}
        onClaim={handleClaimCoupon}
      />
    </>
  );
};

export default VisaPointsPage;
