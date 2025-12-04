import * as React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import type { User } from '../data/events.ts';
import { FiAward, FiCheckSquare, FiStar } from 'react-icons/fi';
import { achievementsList } from '../data/achievements.ts';

const ShareableSummary: React.FC<{ user: User }> = ({ user }) => {

    const completedCount = user.events.filter(e => e.completed).length;
    const latestAchievement = user.achievements.length > 0
        ? achievementsList.find(a => a.id === user.achievements[user.achievements.length - 1])
        : null;

    return (
        <div className="bg-brand-dark-blue p-4 sm:p-6 rounded-lg text-white font-sans w-full max-w-sm mx-auto aspect-[9/16] flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-display text-brand-yellow text-center tracking-wider">YOUTHOPIA</h1>
            <p className="text-center text-[10px] sm:text-xs text-gray-300">My Mental Wellness Journey</p>

            <div className="my-4 sm:my-6 flex flex-col items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-brand-yellow overflow-hidden">
                    <img src={user.photo} alt={user.fullName} className="w-full h-full object-cover" />
                </div>
                <p className="mt-2 text-lg sm:text-xl font-bold">{user.fullName}</p>
                <p className="text-xs sm:text-sm text-gray-400">{user.class} - {user.stream}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                <div className="bg-brand-blue/50 p-2 sm:p-3 rounded-lg">
                    <span className="mx-auto text-xl sm:text-2xl text-brand-yellow"><FiAward /></span>
                    <p className="text-xl sm:text-2xl font-bold">{user.visaPoints}</p>
                    <p className="text-[10px] sm:text-xs">VISA Points</p>
                </div>
                <div className="bg-brand-blue/50 p-2 sm:p-3 rounded-lg">
                    <span className="mx-auto text-xl sm:text-2xl text-brand-yellow"><FiCheckSquare /></span>
                    <p className="text-xl sm:text-2xl font-bold">{completedCount}</p>
                    <p className="text-[10px] sm:text-xs">Events Completed</p>
                </div>
            </div>

            <div className="mt-4 bg-brand-blue/50 p-3 rounded-lg flex-grow flex flex-col justify-center items-center">
                 <p className="text-xs text-gray-300 mb-1">Latest Achievement</p>
                 {latestAchievement ? (
                    <>
                        <div className="text-2xl sm:text-3xl text-brand-yellow">{latestAchievement.icon}</div>
                        <p className="font-bold mt-1 text-sm sm:text-base">{latestAchievement.name}</p>
                    </>
                 ) : (
                    <>
                        <span className="text-2xl sm:text-3xl text-gray-500"><FiStar /></span>
                        <p className="font-semibold mt-1 text-gray-400 text-sm sm:text-base">Start your journey!</p>
                    </>
                 )}
            </div>

            <p className="text-center text-[10px] text-gray-500 mt-auto pt-4">
                #Youthopia #MentalWellness #BKBirlaCollege
            </p>
        </div>
    );
};

export default ShareableSummary;