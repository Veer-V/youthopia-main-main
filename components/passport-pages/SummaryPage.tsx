import * as React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import { FiGrid, FiCheckSquare, FiAward, FiGift, FiChevronRight, FiHelpCircle, FiArrowRight } from 'react-icons/fi';
import { Event } from '../../data/events.ts';
import { getEventPhase, phaseDetails, EventPhase } from '../../utils/eventCategorization.ts';
import { guidanceContent } from '../../data/guidance.ts';
import AnimatedCounter from '../AnimatedCounter.tsx';
import SkeletonLoader from '../SkeletonLoader.tsx';
import Modal from '../Modal.tsx';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string; }> = ({ icon, label, value, color }) => (
    <div className={`p-4 rounded-lg flex items-center gap-4 ${color} `}>
        <div className="text-3xl text-white">{icon}</div>
        <div>
            {typeof value === 'number' ? (
                <AnimatedCounter to={value} className="text-2xl font-bold text-white " />
            ) : (
                <p className="text-2xl font-bold text-white">{value}</p>
            )}
            <p className="text-sm text-white/80">{label}</p>
        </div>
    </div>
);

const PhaseProgress: React.FC<{
    phase: EventPhase;
    completed: number;
    total: number;
    onHelpClick: () => void;
}> = ({ phase, completed, total, onHelpClick }) => {
    const { name, icon, color } = phaseDetails[phase];
    const progress = total > 0 ? (completed / total) * 100 : 0;

    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
                <span className={color}>{icon}</span>
                <span className="font-bold text-brand-passport-primary dark:text-gray-200">{name}</span>
                <button onClick={onHelpClick} className="ml-1 text-gray-400 hover:text-brand-blue" aria-label={`Get help for ${name} phase`}>
                    <FiHelpCircle size={14} />
                </button>
                <span className="ml-auto text-sm font-semibold text-brand-passport-subtle dark:text-gray-400">{completed}/{total}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <motion.div
                    className="bg-brand-passport-accent h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
};

const RecommendationWidget: React.FC<{ events: Event[] }> = ({ events }) => {
    const navigate = useNavigate();
    
    const recommendation = React.useMemo(() => {
        const completedPhases = { 'Awareness': 0, 'Engagement': 0, 'Seeking Help': 0 };
        const unregisteredEventsByPhase: Record<EventPhase, Event[]> = { 'Awareness': [], 'Engagement': [], 'Seeking Help': [] };
        
        events.forEach(event => {
            const phase = getEventPhase(event.id);
            if (event.completed) {
                completedPhases[phase]++;
            } else if (!event.registered) {
                unregisteredEventsByPhase[phase].push(event);
            }
        });

        if (unregisteredEventsByPhase['Engagement'].length > 0 && completedPhases['Awareness'] > 0) {
            return unregisteredEventsByPhase['Engagement'][0];
        }
        if (unregisteredEventsByPhase['Seeking Help'].length > 0 && completedPhases['Engagement'] > 0) {
            return unregisteredEventsByPhase['Seeking Help'][0];
        }
        if (unregisteredEventsByPhase['Awareness'].length > 0) {
            return unregisteredEventsByPhase['Awareness'][0];
        }
        const anyUnregistered = Object.values(unregisteredEventsByPhase).flat();
        return anyUnregistered.length > 0 ? anyUnregistered[0] : null;
    }, [events]);

    if (!recommendation) return null;

    return (
        <div className="bg-brand-blue/5 dark:bg-brand-blue/10 p-3 rounded-lg mt-4">
             <h4 className="font-bold text-brand-passport-primary dark:text-gray-200 text-sm mb-2">Recommended Next Step</h4>
             <div className="bg-white dark:bg-gray-700/50 p-3 rounded-lg flex items-center justify-between gap-2">
                <div>
                    <p className="font-semibold text-brand-dark-blue dark:text-gray-100">{recommendation.name}</p>
                    <p className="text-xs text-brand-blue dark:text-gray-400">{phaseDetails[getEventPhase(recommendation.id)].name} Phase Activity</p>
                </div>
                <motion.button
                    onClick={() => navigate(`/activity/${recommendation.id}`)}
                    className="bg-brand-teal text-white font-bold p-2 rounded-full shadow-lg hover:bg-teal-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FiArrowRight />
                </motion.button>
             </div>
        </div>
    )
};


const SummaryPage: React.FC<{ changePage: (index: number) => void }> = ({ changePage }) => {
    const { user, events, getCurrentUserRank } = useAuth();
    const [stats, setStats] = React.useState<any>(null);
    const [modalContent, setModalContent] = React.useState<{ phase: EventPhase } | null>(null);

    React.useEffect(() => {
        if (!user) return;
        
        const timer = setTimeout(() => { // Simulate data aggregation
            const registeredEvents = events.filter(e => e.registered).length;
            const completedEvents = events.filter(e => e.completed).length;
            const userRank = getCurrentUserRank();
            
            const phaseCounts = events.reduce((acc, event) => {
                const phase = getEventPhase(event.id);
                acc[phase].total++;
                if (event.completed) {
                    acc[phase].completed++;
                }
                return acc;
            }, {
                'Awareness': { total: 0, completed: 0 },
                'Engagement': { total: 0, completed: 0 },
                'Seeking Help': { total: 0, completed: 0 },
            } as Record<EventPhase, { total: number, completed: number }>);

            setStats({
                registered: registeredEvents,
                completed: completedEvents,
                points: user.visaPoints,
                rank: userRank,
                phaseCounts,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [user, events, getCurrentUserRank]);

    const handleHelpClick = (phase: EventPhase) => {
        setModalContent({ phase });
    };

    if (!user) return null;

    return (
        <>
        <motion.div
            className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col overflow-y-auto min-h-[400px]"
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.h3 variants={itemSpringUp} className="text-xl md:text-2xl font-bold text-brand-passport-primary dark:text-gray-100 mb-4 border-b-2 border-brand-passport-subtle dark:border-gray-700 pb-2">Activity Passport Dashboard</motion.h3>
            
            {!stats ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} className="h-[88px] w-full rounded-lg" />)}
                 </div>
            ) : (
                <motion.div variants={staggerContainer(0.08)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <motion.div variants={itemSpringUp}><StatCard icon={<FiGrid />} label="Activities Registered" value={stats.registered} color="bg-blue-500" /></motion.div>
                    <motion.div variants={itemSpringUp}><StatCard icon={<FiCheckSquare />} label="Activities Completed" value={stats.completed} color="bg-green-500" /></motion.div>
                    <motion.div variants={itemSpringUp}><StatCard icon={<FiGift />} label="VISA Points" value={stats.points} color="bg-amber-500" /></motion.div>
                    <motion.div variants={itemSpringUp}><StatCard icon={<FiAward />} label="Overall Rank" value={stats.rank ? `#${stats.rank}` : 'N/A'} color="bg-purple-500" /></motion.div>
                </motion.div>
            )}


            <motion.div variants={itemSpringUp}>
                <RecommendationWidget events={events} />
            </motion.div>
            
            <motion.div variants={itemSpringUp} className="mt-auto pt-4">
                 <motion.button
                    onClick={() => changePage(3)} // Index 3 is 'Ranks' in navItems
                    className="w-full bg-brand-dark-blue text-white font-bold py-3 px-6 rounded-lg text-md flex items-center justify-center gap-2 shadow-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-dark-blue"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span>View Full Leaderboard</span>
                    <FiChevronRight />
                </motion.button>
            </motion.div>
        </motion.div>
        <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
             {modalContent && (() => {
                const content = guidanceContent[modalContent.phase];
                return (
                    <div>
                        <h3 className="text-xl font-bold text-brand-dark-blue dark:text-gray-100 mb-3">{content.title}</h3>
                        {'isResource' in content ? (
                            <>
                                <ul className="space-y-3 text-sm text-brand-blue dark:text-gray-300">
                                    {content.resources.map(res => (
                                        <li key={res.name}>
                                            <p className="font-bold text-brand-dark-blue dark:text-gray-200">{res.name}</p>
                                            {res.contact && <p className="font-mono">{res.contact}</p>}
                                            {res.links && res.links.map(link => (
                                                    <p key={link} className="text-blue-600 dark:text-blue-400 underline cursor-pointer">{link}</p>
                                            ))}
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-4 text-xs text-red-600 dark:text-red-400 italic">{content.disclaimer}</p>
                            </>
                        ) : (
                            <ul className="list-disc list-inside space-y-2 text-sm text-brand-blue dark:text-gray-300">
                                {content.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                            </ul>
                        )}
                    </div>
                );
            })()}
        </Modal>
        </>
    );
};

export default SummaryPage;