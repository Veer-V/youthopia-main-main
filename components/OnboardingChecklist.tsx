import * as React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiUser, FiCalendar, FiAward } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext.tsx';

const MotionButton: React.FC<{ children: React.ReactNode, onClick?: () => void, disabled?: boolean, className?: string }> = ({ children, onClick, disabled, className }) => (
    <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={`py-3 px-6 rounded-full font-bold text-white bg-brand-blue hover:bg-blue-600 transition-colors ${className}`}
    >
        {children}
    </motion.button>
);

interface OnboardingChecklistProps {
    onNavigate: (pageIndex: number) => void;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ onNavigate }) => {
    const { completeOnboarding } = useAuth();
    const [tasks, setTasks] = React.useState([
        { id: 'welcome', label: 'Welcome to Youthopia!', icon: FiAward, completed: false, action: () => { } },
        { id: 'profile', label: 'Visit your Profile', icon: FiUser, completed: false, action: () => onNavigate(0) }, // Index 0 is 'Me'
        { id: 'schedule', label: 'Check the Schedule', icon: FiCalendar, completed: false, action: () => onNavigate(4) }, // Index 4 is 'Schedule'
    ]);

    const handleTaskClick = (taskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                if (!t.completed) {
                    t.action();
                    return { ...t, completed: true };
                }
            }
            return t;
        }));
    };

    const allCompleted = tasks.every(t => t.completed);

    const handleCompleteOnboarding = () => {
        if (allCompleted) {
            completeOnboarding();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold text-brand-dark-blue dark:text-white mb-2">Let's Get Started!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Complete these simple steps to unlock your dashboard and earn your first 5 points.</p>

                <div className="space-y-4 mb-8">
                    {tasks.map((task, index) => (
                        <motion.button
                            key={task.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTaskClick(task.id)}
                            className={`w-full flex items-center p-4 rounded-xl border-2 transition-colors ${task.completed
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-brand-blue'
                                }`}
                        >
                            <div className={`p-2 rounded-full mr-4 ${task.completed ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                }`}>
                                {task.completed ? <FiCheckCircle size={20} /> : <task.icon size={20} />}
                            </div>
                            <span className={`font-medium ${task.completed ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-200'
                                }`}>
                                {task.label}
                            </span>
                        </motion.button>
                    ))}
                </div>

                <MotionButton
                    onClick={handleCompleteOnboarding}
                    disabled={!allCompleted}
                    className={`w-full ${!allCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {allCompleted ? 'Claim 5 Points & Start!' : 'Complete Tasks to Unlock'}
                </MotionButton>
            </motion.div>
        </div>
    );
};

export default OnboardingChecklist;
