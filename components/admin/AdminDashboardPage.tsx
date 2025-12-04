import * as React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCalendar, FiCheckSquare, FiGift } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import type { DashboardStats } from '../../data/events';
import { staggerContainer, itemSpringUp } from '../../utils/animations';
import SkeletonLoader from '../SkeletonLoader';

const SkeletonStatCard: React.FC = () => (
    <div className="glass dark:glass-dark p-4 rounded-xl shadow-md flex items-center border border-white/20 dark:border-gray-700/30">
        <SkeletonLoader className="h-12 w-12 rounded-lg mr-4" />
        <div className="flex-1">
            <SkeletonLoader className="h-4 w-2/3 rounded-md mb-2" />
            <SkeletonLoader className="h-8 w-1/2 rounded-md" />
        </div>
    </div>
);

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
    iconColor: string;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, iconColor, onClick }) => (
    <motion.div
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`glass dark:glass-dark p-4 rounded-xl shadow-md flex items-center cursor-pointer border border-white/20 dark:border-gray-700/30 ${onClick ? 'hover:shadow-lg hover:bg-white/40 dark:hover:bg-gray-800/40' : ''}`}
    >
        <div className={`p-3 rounded-lg ${color} ${iconColor} mr-4 shadow-sm`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{title}</p>
            <h3 className="text-xl font-bold text-brand-dark-blue dark:text-white">{value}</h3>
        </div>
    </motion.div>
);

type StatConfig = StatCardProps & { id: string; targetPath: string };

const AdminDashboardPage: React.FC = () => {
    const { getDashboardStats } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = React.useState<DashboardStats | null>(null);

    React.useEffect(() => {
        // Simulate fetch
        const timer = setTimeout(() => setStats(getDashboardStats()), 500);
        return () => clearTimeout(timer);
    }, [getDashboardStats]);

    const statConfigs: StatConfig[] = React.useMemo(() => {
        if (!stats) return [];
        return [
            {
                id: 'totalUsers',
                icon: <span className="h-6 w-6 md:h-8 md:w-8 inline-flex items-center justify-center"><FiUsers /></span>,
                title: 'Total Students',
                value: stats.totalUsers,
                color: 'bg-blue-100 dark:bg-blue-900/30',
                iconColor: 'text-blue-600 dark:text-blue-300',
                targetPath: '/admin/users',
            },
            {
                id: 'totalEvents',
                icon: <span className="h-6 w-6 md:h-8 md:w-8 inline-flex items-center justify-center"><FiCalendar /></span>,
                title: 'Total Events',
                value: stats.totalEvents,
                color: 'bg-green-100 dark:bg-green-900/30',
                iconColor: 'text-green-600 dark:text-green-300',
                targetPath: '/admin/activities',
            },
            {
                id: 'totalCompletedEvents',
                icon: <span className="h-6 w-6 md:h-8 md:w-8 inline-flex items-center justify-center"><FiCheckSquare /></span>,
                title: 'Events Completed',
                value: stats.totalCompletedEvents,
                color: 'bg-teal-100 dark:bg-teal-900/30',
                iconColor: 'text-teal-600 dark:text-teal-300',
                targetPath: '/admin/activities',
            },
            {
                id: 'totalPointsAwarded',
                icon: <span className="h-6 w-6 md:h-8 md:w-8 inline-flex items-center justify-center"><FiGift /></span>,
                title: 'Total Points Awarded',
                value: stats.totalPointsAwarded,
                color: 'bg-yellow-100 dark:bg-yellow-900/30',
                iconColor: 'text-yellow-600 dark:text-yellow-300',
                targetPath: '/admin/reports',
            },
        ];
    }, [stats]);

    return (
        <motion.div
            className="p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-dark-blue dark:text-white">Dashboard Overview</h1>
                {stats && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        Summary of participant and event activity
                    </p>
                )}
            </div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                variants={staggerContainer(0.1)}
                initial="hidden"
                animate="visible"
            >
                {!stats ? (
                    <>
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                    </>
                ) : (
                    <>
                        {statConfigs.map(cfg => (
                            <StatCard
                                key={cfg.id}
                                icon={cfg.icon}
                                title={cfg.title}
                                value={cfg.value}
                                color={cfg.color}
                                iconColor={cfg.iconColor}
                                onClick={() => navigate(cfg.targetPath)}
                            />
                        ))}
                    </>
                )}
            </motion.div>

            {/* Wellness Quote Section */}
            <motion.div
                className="mt-8 glass dark:glass-dark p-6 rounded-xl border border-white/20 dark:border-gray-700/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="text-xl font-bold text-brand-dark-blue dark:text-white mb-2">Daily Inspiration</h2>
                <p className="text-gray-600 dark:text-gray-300 italic">
                    "The only way to do great work is to love what you do." - Steve Jobs
                </p>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboardPage;