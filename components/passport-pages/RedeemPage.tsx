import React from 'react';
import { motion } from 'framer-motion';
import { FiFilm, FiCoffee, FiHeart, FiTag, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RedeemOption {
    id: string;
    title: string;
    points: number;
    icon: React.ReactNode;
    color: string;
}

const REDEEM_OPTIONS: RedeemOption[] = [
    {
        id: 'cinema',
        title: 'Diary',
        points: 750,
        icon: <span className="w-12 h-12 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"><FiFilm /></span>,
        color: 'bg-red-100 text-red-600'
    },
    {
        id: 'coffee',
        title: 'Sipper',
        points: 550,
        icon: <span className="w-12 h-12 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"><FiCoffee /></span>,
        color: 'bg-amber-100 text-amber-600'
    },
    {
        id: 'charity',
        title: 'Keychain',
        points: 350,
        icon: <span className="w-12 h-12 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"><FiHeart /></span>,
        color: 'bg-rose-100 text-rose-600'
    },
    {
        id: 'discount',
        title: 'Badge',
        points: 150,
        icon: <span className="w-12 h-12 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"><FiTag /></span>,
        color: 'bg-yellow-100 text-yellow-600'
    }
];

const RedeemPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, addPoints } = useAuth(); // Assuming addPoints can handle negative values or we have a redeem function
    const [redeemingId, setRedeemingId] = React.useState<string | null>(null);

    const handleRedeem = async (option: RedeemOption) => {
        if (!user || user.visaPoints < option.points) return;

        setRedeemingId(option.id);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Deduct points (assuming addPoints handles negative for deduction, or we just mock it for now)
        // In a real app, we'd have a specific redeem function
        // addPoints(-option.points, `Redeemed: ${option.title}`); 

        setRedeemingId(null);
        alert(`Successfully redeemed ${option.title}!`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8 md:mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 shadow-sm backdrop-blur-sm transition-all mr-4 flex items-center justify-center"
                    >
                        <span className="w-6 h-6 flex items-center justify-center"><FiArrowLeft /></span>
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Redeem Your Points
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            You have <span className="font-bold text-indigo-600 dark:text-indigo-400">{user?.visaPoints || 0} Points</span> available
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {REDEEM_OPTIONS.map((option) => (
                        <motion.div
                            key={option.id}
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-indigo-100/50 dark:shadow-none flex flex-col items-center text-center border border-white/50 dark:border-gray-700 backdrop-blur-sm"
                        >
                            <div className={`w-24 h-24 rounded-2xl ${option.color} flex items-center justify-center mb-6 shadow-inner`}>
                                {option.icon}
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                                {option.title}
                            </h3>

                            <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">
                                {option.points} Points
                            </p>

                            <motion.button
                                onClick={() => handleRedeem(option)}
                                disabled={!user || user.visaPoints < option.points || redeemingId === option.id}
                                whileTap={{ scale: 0.95 }}
                                className={`w-full py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center
                  ${!user || user.visaPoints < option.points
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                        : 'bg-slate-800 hover:bg-slate-900 text-white shadow-lg hover:shadow-slate-800/30 dark:bg-indigo-600 dark:hover:bg-indigo-700'
                                    }
                `}
                            >
                                {redeemingId === option.id ? (
                                    <span className="animate-pulse">Processing...</span>
                                ) : (
                                    'REDEEM'
                                )}
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default RedeemPage;
