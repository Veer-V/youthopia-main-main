import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiUser, FiAward, FiGift, FiClock, FiShoppingBag } from 'react-icons/fi';

import { useAuth } from '../contexts/AuthContext';
import AchievementToast from './AchievementToast';
import NotificationToast from './NotificationToast';
import GuidedTour from './GuidedTour';
import OnboardingChecklist from './OnboardingChecklist';

// Passport Pages
import ProfilePage from './passport-pages/ProfilePage';
import VisaGridPage from './passport-pages/VisaGridPage';
import LeaderboardPage from './passport-pages/LeaderboardPage';
import VisaPointsPage from './passport-pages/VisaPointsPage';
import SchedulePage from './passport-pages/SchedulePage';
import RedeemPage from './passport-pages/RedeemPage';

type Page = 'Me' | 'Activities' | 'Leaderboard' | 'Points' | 'Schedule' | 'Redeem';

const pageComponents: Record<Page, React.FC<any>> = {
    Me: ProfilePage,
    Activities: VisaGridPage,
    Leaderboard: LeaderboardPage,
    Points: VisaPointsPage,
    Schedule: SchedulePage,
    Redeem: RedeemPage,
};

// Add page transition variants used by AnimatePresence
const pageVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '20%' : '-20%',
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? '20%' : '-20%',
        opacity: 0,
    }),
};

// Navigation items used to render the bottom nav and determine the active page
const navItems = [
    { id: 'Me', icon: FiUser, label: 'Me', tourId: 'summary' },
    { id: 'Activities', icon: FiGrid, label: 'Activities', tourId: 'visa' },
    { id: 'Leaderboard', icon: FiAward, label: 'Leaderboard', tourId: 'leaderboard' },
    { id: 'Points', icon: FiGift, label: 'Points', tourId: 'points' },
    { id: 'Schedule', icon: FiClock, label: 'Schedule' },
    { id: 'Redeem', icon: FiShoppingBag, label: 'Redeem' },
];

const ActivityVisaPage: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    const locationState = location.state as { highlightEventId?: string; targetPage?: string; } | undefined;

    // Default to 'profile' page, or 'visa' if an event is highlighted
    const initialPageIndex = locationState?.highlightEventId ? 1 : 0; // Index 1 is VISA
    const [pageIndex, setPageIndex] = React.useState(initialPageIndex);
    const [direction, setDirection] = React.useState(0);
    const [isTourOpen, setIsTourOpen] = React.useState(false);

    React.useEffect(() => {
        if (locationState?.targetPage) {
            const index = navItems.findIndex(item => item.id === locationState.targetPage);
            if (index !== -1 && index !== pageIndex) {
                changePage(index);
            }
        }
    }, [locationState?.targetPage]);

    React.useEffect(() => {
        if (locationState?.targetPage) {
            const index = navItems.findIndex(item => item.id === locationState.targetPage);
            if (index !== -1 && index !== pageIndex) {
                changePage(index);
            }
        }
    }, [locationState?.targetPage]);

    React.useEffect(() => {
        const hasSeenTour = localStorage.getItem('youthopia_hasSeenTour');
        if (!hasSeenTour) {
            // A small delay to allow the page to render before starting the tour
            const timer = setTimeout(() => setIsTourOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleCloseTour = () => {
        localStorage.setItem('youthopia_hasSeenTour', 'true');
        setIsTourOpen(false);
    };

    const changePage = (newIndex: number) => {
        if (newIndex === pageIndex) return;
        setDirection(newIndex > pageIndex ? 1 : -1);
        setPageIndex(newIndex);
    };

    const activePageId = navItems[pageIndex].id as Page;
    const CurrentPage = pageComponents[activePageId];

    return (
        <div className="bg-brand-bg dark:bg-brand-black min-h-[calc(100vh-80px)] sm:min-h-[calc(100dvh-80px)] py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center">
            <GuidedTour isOpen={isTourOpen} onClose={handleCloseTour} />
            <AchievementToast />
            <NotificationToast />
            <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col">
                <div
                    className="flex-grow flex bg-brand-passport-bg dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at top left, rgba(10, 42, 71, 0.1) 0%, transparent 30%),
                            radial-gradient(circle at bottom right, rgba(10, 42, 71, 0.1) 0%, transparent 30%)
                        `,
                    }}
                >
                    <main className="flex-grow w-full h-full relative">
                        {user && user.onboardingCompleted === false ? (
                            <OnboardingChecklist onNavigate={changePage} />
                        ) : (
                            <AnimatePresence initial={false} mode="wait" custom={direction}>
                                <motion.div
                                    key={pageIndex}
                                    custom={direction}
                                    variants={pageVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="w-full h-full absolute"
                                >
                                    <CurrentPage highlightEventId={locationState?.highlightEventId} />
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </main>
                </div>

                <nav className="mt-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
                    <ul className="flex justify-start items-center overflow-x-auto flex-nowrap passport-scrollbar pb-1 -mb-1 px-2 space-x-2">
                        {navItems.map((item, index) => (
                            <li key={item.id}>
                                <motion.button
                                    id={item.tourId ? `tour-step-${item.tourId}` : undefined}
                                    onClick={() => changePage(index)}
                                    className={`relative flex flex-col items-center justify-center w-20 h-20 min-w-[5rem] rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-blue ${pageIndex === index ? 'text-brand-blue dark:text-brand-light-blue' : 'text-gray-500 hover:text-brand-blue dark:hover:text-brand-light-blue'}`}
                                    aria-label={item.label}
                                    whileHover={{ y: -3, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                >
                                    <span className="w-8 h-8 mb-1 inline-flex items-center justify-center"><item.icon /></span>
                                    <span>{item.label}</span>
                                    {pageIndex === index && (
                                        <motion.div
                                            className="absolute inset-0 bg-brand-blue/10 dark:bg-brand-light-blue/20 rounded-full"
                                            layoutId="active-passport-tab"
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                </motion.button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default ActivityVisaPage;