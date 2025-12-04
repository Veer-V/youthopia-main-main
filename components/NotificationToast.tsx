import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.tsx';
import { FiX, FiCheckCircle, FiInfo } from 'react-icons/fi';

const NotificationToast: React.FC = () => {
    const { lastNotification, clearLastNotification } = useAuth();
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        if (lastNotification) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                // Allow time for exit animation before clearing
                setTimeout(clearLastNotification, 300);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [lastNotification, clearLastNotification]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(clearLastNotification, 300);
    };
    
    const iconMap = {
        success: <span className="h-6 w-6 text-green-500 inline-flex items-center justify-center"><FiCheckCircle /></span>,
        info: <span className="h-6 w-6 text-blue-500 inline-flex items-center justify-center"><FiInfo /></span>,
        error: <span className="h-6 w-6 text-red-500 inline-flex items-center justify-center"><FiX /></span>,
    };

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
            <AnimatePresence>
                {isVisible && lastNotification && (
                    <motion.div
                        layout
                        className="relative w-full max-w-md bg-white dark:bg-gray-700 text-brand-dark-blue dark:text-gray-100 p-4 rounded-lg shadow-2xl flex items-start gap-3 pointer-events-auto"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50, transition: { duration: 0.3 } }}
                    >
                        <div className="flex-shrink-0 mt-0.5">{iconMap[lastNotification.type]}</div>
                        <div className="flex-grow">
                            <p className="font-bold">{lastNotification.message}</p>
                        </div>
                        <button 
                            onClick={handleClose} 
                            className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                            aria-label="Close notification"
                        >
                            <FiX size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationToast;
