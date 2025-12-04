import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { SURVEY_QUESTIONS, SurveyQuestion } from '../data/surveyQuestions';

interface SurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (answers: Record<string, any>) => void;
    pointsToClaim: number;
}

const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose, onComplete, pointsToClaim }) => {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [answers, setAnswers] = React.useState<Record<string, any>>({});
    const [direction, setDirection] = React.useState(0);

    const currentQuestion = SURVEY_QUESTIONS[currentStep];
    const isLastQuestion = currentStep === SURVEY_QUESTIONS.length - 1;

    const handleAnswer = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentStep < SURVEY_QUESTIONS.length - 1) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete(answers);
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
            // Check if all rows have an answer
            return currentQuestion.gridRows?.every(row => answer && answer[row]);
        }
        return !!answer;
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -50 : 50,
            opacity: 0
        })
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-brand-primary/5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                            Claim your {pointsToClaim} Points!
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Question {currentStep + 1} of {SURVEY_QUESTIONS.length}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <span className="w-5 h-5 flex items-center justify-center text-gray-500"><FiX /></span>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100 dark:bg-gray-700 w-full">
                    <motion.div
                        className="h-full bg-brand-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / SURVEY_QUESTIONS.length) * 100}%` }}
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
                            <span className="inline-block px-3 py-1 rounded-full bg-brand-secondary/10 text-brand-secondary text-xs font-medium mb-3">
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
                                            ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                                            : 'border-gray-100 dark:border-gray-700 hover:border-brand-primary/50 dark:hover:border-brand-primary/50 text-gray-600 dark:text-gray-300'
                                            }`}
                                    >
                                        <span className="font-medium">{option}</span>
                                        {answers[currentQuestion.id] === option && (
                                            <span className="w-5 h-5 flex items-center justify-center"><FiCheck /></span>
                                        )}
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
                                                    // If selecting "None", clear others. If deselecting, just remove.
                                                    next = isSelected ? [] : [option];
                                                } else {
                                                    // If selecting normal option, remove "None" if present
                                                    const withoutNone = current.filter((i: string) => !['None', 'None of the above', 'No impact'].includes(i));
                                                    next = isSelected
                                                        ? withoutNone.filter((i: string) => i !== option)
                                                        : [...withoutNone, option];
                                                }
                                                handleAnswer(currentQuestion.id, next);
                                            }}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${isSelected
                                                ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                                                : 'border-gray-100 dark:border-gray-700 hover:border-brand-primary/50 text-gray-600 dark:text-gray-300'
                                                }`}
                                        >
                                            <span className="font-medium">{option}</span>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'}`}>
                                                {isSelected && <span className="w-3 h-3 flex items-center justify-center text-white"><FiCheck /></span>}
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
                                                                className={`p-2 rounded-lg text-sm border transition-all ${isSelected
                                                                    ? 'bg-brand-primary text-white border-brand-primary'
                                                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand-primary'
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
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentStep === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        <span className="mr-1 flex items-center justify-center"><FiChevronLeft /></span> Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className={`flex items-center px-6 py-2 rounded-lg font-bold text-white transition-all transform active:scale-95 ${!canProceed()
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-brand-primary hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/30'
                            }`}
                    >
                        {isLastQuestion ? 'Submit & Claim' : 'Next'}
                        {!isLastQuestion && <span className="ml-1 flex items-center justify-center"><FiChevronRight /></span>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SurveyModal;
