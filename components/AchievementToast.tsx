import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.tsx';
import { FiX } from 'react-icons/fi';

const AchievementToast: React.FC = () => {
    const { lastEarnedAchievements, clearLastEarnedAchievements } = useAuth();
    const [visibleAchievements, setVisibleAchievements] = React.useState(lastEarnedAchievements);

    React.useEffect(() => {
        setVisibleAchievements(lastEarnedAchievements);
    }, [lastEarnedAchievements]);

    React.useEffect(() => {
        if (visibleAchievements.length > 0) {
            const timer = setTimeout(() => {
                // When all toasts have timed out, clear them from the context
                clearLastEarnedAchievements();
            }, 5000 + visibleAchievements.length * 500); // Base time + stagger
            return () => clearTimeout(timer);
        }
    }, [visibleAchievements, clearLastEarnedAchievements]);

    const removeAchievement = (id: string) => {
        setVisibleAchievements(prev => prev.filter(ach => ach.id !== id));
    };

    return (
        <div
            className="fixed top-24 right-4 sm:right-5 z-[100] space-y-3 pointer-events-none w-full sm:w-auto max-h-[calc(100vh-7rem)] overflow-y-auto"
            role="status"
            aria-live="polite"
        >
            <AnimatePresence>
                {visibleAchievements.map((achievement, index) => (
                    <motion.div
                        key={achievement.id}
                        layout
                        className="relative w-full max-w-sm bg-brand-dark-blue text-white p-4 rounded-lg shadow-2xl flex items-start gap-3 pointer-events-auto"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: index * 0.2 } }}
                        exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
                    >
                        <div className="flex-shrink-0 mt-1">{achievement.icon}</div>
                        <div className="flex-grow">
                            <p className="font-bold text-brand-yellow">Achievement Unlocked!</p>
                            <p className="text-sm font-semibold">{achievement.name}</p>
                            <p className="text-xs text-gray-300 mt-1">{achievement.description}</p>
                        </div>
                        <button
                            onClick={() => removeAchievement(achievement.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
                            aria-label="Close notification"
                        >
                            <FiX size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default AchievementToast;
