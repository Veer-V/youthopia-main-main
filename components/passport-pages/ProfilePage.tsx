import * as React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import { FiUser, FiAward, FiBookmark, FiPhone, FiShare2 } from 'react-icons/fi';
import { FaGraduationCap, FaStream } from 'react-icons/fa';
import { achievementsList } from '../../data/achievements.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import Modal from '../Modal.tsx';
import ShareableSummary from '../ShareableSummary.tsx';
import SkeletonLoader from '../SkeletonLoader.tsx';

const ProfilePageSkeleton: React.FC = () => (
    <motion.div
        id="tour-step-profile"
        className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <div className="flex justify-between items-center mb-4 border-b-2 border-brand-passport-subtle/30 dark:border-gray-700/50 pb-2">
            <SkeletonLoader className="h-8 w-1/3 rounded-md" />
            <SkeletonLoader className="h-8 w-20 rounded-full" />
        </div>

        <div className="flex gap-4 items-start mb-4">
            <SkeletonLoader className="w-24 h-32 rounded-sm" />
            <div className="flex-grow space-y-3">
                <SkeletonLoader className="h-10 w-full rounded-md" />
                <SkeletonLoader className="h-10 w-full rounded-md" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 mb-4">
            <SkeletonLoader className="h-10 w-full rounded-md" />
            <SkeletonLoader className="h-10 w-full rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-x-4">
            <SkeletonLoader className="h-10 w-full rounded-md" />
            <SkeletonLoader className="h-10 w-full rounded-md" />
        </div>

        <div className="flex-grow" />

        <div className="text-center space-y-1 mt-4">
            <SkeletonLoader className="h-3 w-1/2 mx-auto rounded-sm" />
            <SkeletonLoader className="h-3 w-3/4 mx-auto rounded-sm" />
            <SkeletonLoader className="h-3 w-3/4 mx-auto rounded-sm" />
        </div>
    </motion.div>
);

const DataRow: React.FC<{ label: string; value: string; icon: React.ReactNode; action?: React.ReactNode }> = ({ label, value, icon, action }) => (
    <div className="border-b border-brand-passport-subtle/30 dark:border-gray-600/50 py-2 last:border-b-0">
        <div className="flex items-center gap-2 text-[0.7rem] sm:text-xs text-brand-passport-subtle dark:text-gray-400 font-semibold uppercase tracking-wide mb-1">
            <span className="inline-flex h-4 w-4 items-center justify-center text-brand-passport-primary/80 dark:text-gray-300">
                {icon}
            </span>
            <span>{label}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
            <p className="text-base sm:text-lg font-mono text-brand-passport-primary dark:text-gray-200 tracking-wide break-all">
                {value}
            </p>
            {action && (
                <div className="flex-shrink-0 self-start sm:self-auto">
                    {action}
                </div>
            )}
        </div>
    </div>
);


const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [copiedField, setCopiedField] = React.useState<string | null>(null);

    const handleCopy = (text: string, field: string) => {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedField(field);
                setTimeout(() => setCopiedField(null), 1500);
            }).catch(() => {
                setCopiedField(null);
            });
        }
    };

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500); // Simulate loading
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <ProfilePageSkeleton />;
    }

    if (!user) {
        return null;
    }

    const unlockedAchievements = achievementsList.filter(ach => user.achievements.includes(ach.id));

    const passportName = user.fullName.toUpperCase().replace(/\s/g, '<').padEnd(30, '<');
    const passportId = `ID${user.contact}`.padEnd(30, '<');


    return (
        <>
            <motion.div
                id="tour-step-profile"
                className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col"
                variants={staggerContainer(0.1, 0.2)}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                {/* Header */}
                <motion.div
                    variants={itemSpringUp}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 border-b-2 border-brand-passport-subtle/60 dark:border-gray-700 pb-3"
                >
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-brand-passport-primary dark:text-gray-100">
                            Personal Information
                        </h3>
                        <p className="text-xs text-brand-passport-subtle dark:text-gray-400 mt-1">
                            This is your Youthopia identity used across all activities.
                        </p>
                    </div>
                    <motion.button
                        onClick={() => setIsShareModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-brand-teal text-white text-xs font-bold py-2 px-4 rounded-full shadow-md hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-teal"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiShare2 />
                        Share
                    </motion.button>
                </motion.div>

                {/* Photo + primary details */}
                <motion.div
                    variants={itemSpringUp}
                    className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-4 items-start mb-4"
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-brand-passport-subtle/80 dark:border-gray-600 overflow-hidden shadow-sm">
                            <img
                                src={user.photo || `https://i.pravatar.cc/150?u=${user.contact}`}
                                alt="Student photo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-[0.7rem] text-brand-passport-subtle dark:text-gray-400 uppercase tracking-wide">
                            Passport Photo
                        </p>
                    </div>
                    <div className="flex-grow rounded-xl bg-white/70 dark:bg-gray-800/60 border border-brand-passport-subtle/40 dark:border-gray-700/60 shadow-sm px-3 sm:px-4 py-2">
                        <DataRow label="Full Name" value={user.fullName} icon={<FiUser />} />
                        <DataRow label="School / college" value={user.schoolName} icon={<FaGraduationCap />} />
                        <DataRow
                            label="Contact No."
                            value={user.contact}
                            icon={<FiPhone />}
                            action={(
                                <button
                                    onClick={() => handleCopy(user.contact, 'contact')}
                                    className="text-[0.7rem] sm:text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-brand-passport-primary dark:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-dark-blue"
                                    aria-label="Copy contact number"
                                    title="Copy contact number"
                                >
                                    {copiedField === 'contact' ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        />
                    </div>
                </motion.div>

                {/* Academic + stats */}
                <motion.div
                    variants={itemSpringUp}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                >
                    <div className="rounded-xl bg-white/70 dark:bg-gray-800/60 border border-brand-passport-subtle/40 dark:border-gray-700/60 shadow-sm px-3 sm:px-4 py-2">
                        <DataRow label="Class" value={user.class} icon={<FaGraduationCap />} />
                        <DataRow label="Stream" value={user.stream} icon={<FaStream />} />
                    </div>
                    <div className="rounded-xl bg-white/70 dark:bg-gray-800/60 border border-brand-passport-subtle/40 dark:border-gray-700/60 shadow-sm px-3 sm:px-4 py-2">
                        <DataRow label="VISA Points" value={String(user.visaPoints)} icon={<FiAward />} />
                        <DataRow label="Achievements" value={`${unlockedAchievements.length}/${achievementsList.length}`} icon={<FiBookmark />} />
                    </div>
                </motion.div>

                <div className="flex-grow" />

                {/* Passport footer */}
                <motion.div
                    variants={itemSpringUp}
                    className="text-center text-[0.7rem] sm:text-xs text-brand-passport-subtle/80 dark:text-gray-500 font-mono mt-4 pt-3 border-t border-brand-passport-subtle/40 dark:border-gray-700/60"
                >
                    <p>REPUBLIC OF YOUTHOPIA</p>
                    <p>P&lt;YTH&lt;{passportName}</p>
                    <p>{passportId}</p>
                </motion.div>
            </motion.div>
            <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}>
                <ShareableSummary user={user} />
                <div className="mt-4 p-2 bg-blue-50 dark:bg-gray-700 rounded-md text-center">
                    <p className="text-sm text-brand-blue dark:text-gray-300 font-semibold">Right-click or long-press the image to save and share your journey!</p>
                </div>
            </Modal>
        </>
    );
};

export default ProfilePage;