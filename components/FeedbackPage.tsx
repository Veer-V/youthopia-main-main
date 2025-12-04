import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Event } from '../data/events.ts';
import { pageTransition } from '../utils/animations.ts';

const emojis = [
    { emoji: '😞', label: 'Disappointed' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '🙂', label: 'Satisfied' },
    { emoji: '😄', label: 'Happy' },
    { emoji: '🤩', label: 'Excellent' },
];

const Spinner = ({ className = "h-6 w-6 text-brand-dark-blue" }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const FeedbackPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { events, submitFeedback } = useAuth();
    const [event, setEvent] = React.useState<Event | null>(null);
    const [selectedEmoji, setSelectedEmoji] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        const currentEvent = events.find(e => e.id === eventId);
        if (currentEvent) {
            setEvent(currentEvent);
            if (currentEvent.feedback) {
                navigate('/dashboard', { replace: true });
            }
        } else {
            navigate('/dashboard', { replace: true });
        }
    }, [eventId, events, navigate]);

    const handleSubmit = () => {
        if (!eventId || !selectedEmoji || !event) return;
        setIsSubmitting(true);
        // Find the emoji character corresponding to the selected label
        const feedbackValue = emojis.find(e => e.label === selectedEmoji)?.emoji || selectedEmoji;

        setTimeout(() => {
            submitFeedback(eventId, feedbackValue);
            navigate('/dashboard', { replace: true });
        }, 1000);
    };
    
    if (!event) {
        return (
            <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
                <Spinner className="h-10 w-10 text-brand-blue" />
            </div>
        );
    }

    return (
        <motion.div
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-160px)]"
        >
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark-blue dark:text-gray-100">Share Your Feedback</h1>
                <p className="text-md sm:text-lg text-brand-blue dark:text-gray-300 mt-2">How was your experience with</p>
                <p className="text-xl sm:text-2xl font-semibold text-brand-dark-blue dark:text-gray-100 mt-1 mb-8">{event.name}?</p>

                <div className="flex justify-center items-end gap-2 sm:gap-4 md:gap-6 mb-10">
                    {emojis.map(({ emoji, label }) => (
                        <motion.div
                            key={label}
                            onClick={() => setSelectedEmoji(label)}
                            className={`relative flex flex-col items-center gap-2 rounded-full p-2 focus:outline-none transition-all duration-200 cursor-pointer ${selectedEmoji !== label ? 'opacity-60 hover:opacity-100' : ''}`}
                            whileHover={{ scale: selectedEmoji === label ? 1 : 1.1, y: selectedEmoji === label ? 0 : -5 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{ scale: selectedEmoji === label ? 1.2 : 1 }}
                            aria-pressed={selectedEmoji === label}
                            aria-label={`Feedback: ${label}`}
                        >
                             {selectedEmoji === label && (
                                <motion.div
                                    layoutId="emoji-highlight"
                                    className="absolute inset-x-0 -bottom-2 h-1 bg-brand-yellow rounded-full"
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                />
                            )}
                            <span className="text-4xl md:text-6xl drop-shadow-sm">{emoji}</span>
                            <span className={`text-xs md:text-sm font-semibold transition-colors ${selectedEmoji === label ? 'text-brand-dark-blue' : 'text-gray-500'}`}>{label}</span>
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    onClick={handleSubmit}
                    disabled={!selectedEmoji || isSubmitting}
                    className="w-full max-w-xs mx-auto bg-brand-yellow text-brand-dark-blue font-bold py-3 px-8 rounded-full text-lg flex items-center justify-center hover:bg-yellow-300 transition-colors duration-200 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    whileHover={!selectedEmoji || isSubmitting ? {} : { scale: 1.05 }}
                    whileTap={!selectedEmoji || isSubmitting ? {} : { scale: 0.95 }}
                >
                    {isSubmitting ? <Spinner /> : 'Submit Feedback'}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default FeedbackPage;