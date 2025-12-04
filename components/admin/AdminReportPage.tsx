import * as React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import type { ReportStats } from '../../data/events';
import { FiUsers, FiCheckSquare, FiGift, FiZap, FiCalendar } from 'react-icons/fi';
import { staggerContainer, itemSpringUp } from '../../utils/animations';
import SkeletonLoader from '../SkeletonLoader';

type DateRange = '7d' | '30d' | 'all';

const SkeletonStatCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center">
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
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, iconColor }) => (
    <motion.div
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center"
    >
        <div className={`p-3 rounded-lg ${color} ${iconColor} mr-4`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{value}</h3>
        </div>
    </motion.div>
);

interface FilterButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onClick }) => (
    <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        className={`relative py-1.5 px-4 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-blue ${isActive ? 'text-brand-dark-blue dark:text-gray-100' : 'text-gray-500 hover:text-brand-dark-blue dark:hover:text-gray-300'}`}
    >
        {isActive && (
            <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
        <span className="relative z-10">{label}</span>
    </motion.button>
);

const SimpleBarChart: React.FC<{ data: { label: string; value: number }[]; barColor: string }> = ({ data, barColor }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="flex items-end justify-between h-[300px] gap-2 pt-4">
            {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group">
                    <div className="relative w-full flex items-end justify-center h-full">
                        <div
                            className="w-full max-w-[30px] rounded-t-md transition-all duration-500 ease-out group-hover:opacity-80"
                            style={{ height: `${(d.value / maxValue) * 100}%`, backgroundColor: barColor }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {d.value}
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate w-full text-center">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

const AdminReportPage: React.FC = () => {
    const { getStatsForDateRange } = useAuth();
    const [dateRange, setDateRange] = React.useState<DateRange>('7d');
    const [stats, setStats] = React.useState<ReportStats | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const endDate = new Date();
        const startDate = new Date();

        if (dateRange === '7d') {
            startDate.setDate(endDate.getDate() - 6);
        } else if (dateRange === '30d') {
            startDate.setDate(endDate.getDate() - 29);
        } else { // 'all'
            startDate.setTime(0); // The beginning of time
        }

        const timer = setTimeout(() => {
            setStats(getStatsForDateRange(startDate, endDate));
            setIsLoading(false);
        }, 500); // Simulate fetch delay

        return () => clearTimeout(timer);
    }, [dateRange, getStatsForDateRange]);

    return (
        <motion.div
            className="p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Statistical Reports</h1>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                    <FilterButton label="Last 7 Days" isActive={dateRange === '7d'} onClick={() => setDateRange('7d')} />
                    <FilterButton label="Last 30 Days" isActive={dateRange === '30d'} onClick={() => setDateRange('30d')} />
                    <FilterButton label="All Time" isActive={dateRange === 'all'} onClick={() => setDateRange('all')} />
                </div>
            </div>

            <motion.div
                key={`stats-${dateRange}`}
                variants={staggerContainer(0.1)}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8"
            >
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
                ) : stats && (
                    <>
                        <StatCard icon={<span className="h-8 w-8 inline-flex items-center justify-center"><FiUsers /></span>} title="New Students" value={stats.newUsers} color="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-300" />
                        <StatCard icon={<span className="h-8 w-8 inline-flex items-center justify-center"><FiCheckSquare /></span>} title="Events Completed" value={stats.eventsCompleted} color="bg-green-100 dark:bg-green-900/30" iconColor="text-green-600 dark:text-green-300" />
                        <StatCard icon={<span className="h-8 w-8 inline-flex items-center justify-center"><FiGift /></span>} title="Points Awarded" value={stats.pointsAwarded} color="bg-yellow-100 dark:bg-yellow-900/30" iconColor="text-yellow-600 dark:text-yellow-300" />
                        <StatCard icon={<span className="h-8 w-8 inline-flex items-center justify-center"><FiZap /></span>} title="Daily Check-ins" value={stats.dailyCheckIns} color="bg-teal-100 dark:bg-teal-900/30" iconColor="text-teal-600 dark:text-teal-300" />
                    </>
                )}
            </motion.div>

            <motion.div
                key={`charts-${dateRange}`}
                variants={staggerContainer(0.15)}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                <motion.div variants={itemSpringUp} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">User Growth</h2>
                    {isLoading ? <SkeletonLoader className="w-full h-[300px] rounded-md" /> : stats && <SimpleBarChart data={stats.userGrowthData} barColor="#205295" />}
                </motion.div>
                <motion.div variants={itemSpringUp} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Event Completions</h2>
                    {isLoading ? <SkeletonLoader className="w-full h-[300px] rounded-md" /> : stats && <SimpleBarChart data={stats.eventCompletionData} barColor="#14B8A6" />}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default AdminReportPage;
