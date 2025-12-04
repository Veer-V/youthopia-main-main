import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useFocusTrap } from '../hooks/useFocusTrap.ts';

interface TourStep {
    target: string; // CSS selector for the element to highlight
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
    {
        target: '#tour-step-summary',
        title: 'Welcome to Your Dashboard!',
        content: 'This is your summary page. Get a quick overview of your progress, stats, and recommended next steps.',
        position: 'top',
    },
    {
        target: '#tour-step-profile',
        title: 'Your Profile',
        content: 'View your personal details, unlocked achievements, and share your progress with friends from this page.',
        position: 'top',
    },
    {
        target: '#tour-step-visa',
        title: 'Your Activity VISA',
        content: "This is the heart of your passport. Register for events, track your progress, and see all your completed event stamps here.",
        position: 'top',
    },
    {
        target: '#tour-step-points',
        title: 'Spin & Win Points',
        content: 'Complete events to earn spins. Use them here on the prize wheel to win bonus VISA points!',
        position: 'top',
    },
    {
        target: '#tour-step-leaderboard',
        title: 'Community Ranks',
        content: 'Check out the leaderboards here! See your overall rank and how your team is performing against others.',
        position: 'top',
    },
];

const GuidedTour: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [styles, setStyles] = React.useState({
        highlight: { x: 0, y: 0, width: 0, height: 0, opacity: 0 },
        popover: { top: 0, left: 0, opacity: 0 }
    });

    const modalRef = React.useRef<HTMLDivElement>(null);
    useFocusTrap(modalRef, isOpen);

    const step = tourSteps[currentStep];

    React.useLayoutEffect(() => {
        if (!isOpen || !step) {
            setStyles(prev => ({ ...prev, highlight: { ...prev.highlight, opacity: 0 } }));
            return;
        };

        const targetElement = document.querySelector(step.target);
        if (!targetElement) return;

        const targetRect = targetElement.getBoundingClientRect();
        
        // Calculate popover position
        const popoverWidth = 320; // Corresponds to w-80
        const popoverHeight = modalRef.current?.offsetHeight || 180;
        const gap = 15;
        let top, left;

        switch (step.position) {
            case 'top':
                top = targetRect.top - popoverHeight - gap;
                left = targetRect.left + targetRect.width / 2 - popoverWidth / 2;
                if (top < gap) { // Fallback to bottom if not enough space
                    top = targetRect.bottom + gap;
                }
                break;
            default: // bottom
                top = targetRect.bottom + gap;
                left = targetRect.left + targetRect.width / 2 - popoverWidth / 2;
                 if (top + popoverHeight > window.innerHeight - gap) { // Fallback to top
                    top = targetRect.top - popoverHeight - gap;
                }
        }
        
        // Clamp to viewport
        if (left < gap) left = gap;
        if (left + popoverWidth > window.innerWidth - gap) left = window.innerWidth - popoverWidth - gap;

        setStyles({
            highlight: {
                x: targetRect.left - 4,
                y: targetRect.top - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 8,
                opacity: 1,
            },
            popover: { top, left, opacity: 1 }
        });

    }, [currentStep, isOpen, step]);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, tourSteps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
    const isLastStep = currentStep === tourSteps.length - 1;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-[150]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <div className="fixed inset-0 z-[151] pointer-events-none">
                        <svg width="100%" height="100%">
                            <defs>
                                <mask id="tour-mask">
                                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                    <motion.rect
                                        x={styles.highlight.x}
                                        y={styles.highlight.y}
                                        width={styles.highlight.width || 0}
                                        height={styles.highlight.height || 0}
                                        rx="12"
                                        fill="black"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            x: styles.highlight.x,
                                            y: styles.highlight.y,
                                            opacity: styles.highlight.opacity,
                                        }}
                                        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                                    />
                                </mask>
                            </defs>
                            <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#tour-mask)" />
                        </svg>
                    </div>

                     <motion.div
                        ref={modalRef}
                        className="fixed z-[152] bg-brand-dark-blue text-white rounded-lg shadow-2xl p-6 w-80"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ ...styles.popover, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, type: 'spring', stiffness: 250, damping: 25 }}
                        role="dialog"
                        aria-modal="true"
                    >
                        <h3 className="text-lg font-bold text-brand-yellow">{step?.title}</h3>
                        <p className="mt-2 text-sm text-gray-300">{step?.content}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-gray-400">{currentStep + 1} / {tourSteps.length}</span>
                            <div className="flex gap-2">
                                {currentStep > 0 && <button onClick={prevStep} className="p-2 hover:bg-white/10 rounded-full"><FiChevronLeft /></button>}
                                <button onClick={isLastStep ? onClose : nextStep} className={`font-bold py-1 px-4 rounded-full ${isLastStep ? 'bg-brand-teal' : 'bg-brand-yellow text-brand-dark-blue'}`}>
                                    {isLastStep ? 'Finish' : 'Next'}
                                </button>
                            </div>
                        </div>
                         <button onClick={onClose} className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full"><FiX /></button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GuidedTour;