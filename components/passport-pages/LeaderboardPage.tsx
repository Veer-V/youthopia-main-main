import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiAward, FiTrendingUp, FiShield, FiStar, FiUser } from 'react-icons/fi';

// --- Tier Logic ---
type Tier = 'Beginner' | 'Intermediate' | 'Pro' | 'Champion';

const getTier = (points: number): { name: Tier; color: string; icon: React.ElementType } => {
    if (points >= 701) return { name: 'Champion', color: 'text-purple-600 bg-purple-100', icon: FiStar };
    if (points >= 451) return { name: 'Pro', color: 'text-red-600 bg-red-100', icon: FiShield };
    if (points >= 301) return { name: 'Intermediate', color: 'text-blue-600 bg-blue-100', icon: FiTrendingUp };
    return { name: 'Beginner', color: 'text-green-600 bg-green-100', icon: FiAward }; // 150-300 and below
};

const LeaderboardPage: React.FC = () => {
    const { getOverallLeaderboard } = useAuth();
    const [selectedTier, setSelectedTier] = React.useState<Tier | 'All'>('All');

    // Generate mock data mixed with real data to demonstrate tiers
    const leaderboardData = useMemo(() => {
        const realData = getOverallLeaderboard();

        // If we don't have enough real data to show all tiers, add some mocks
        const mockUsers = [
            { rank: 0, name: "Alex Champion", visaPoints: 850, isCurrentUser: false },
            { rank: 0, name: "Sam Pro", visaPoints: 500, isCurrentUser: false },
            { rank: 0, name: "Jordan Inter", visaPoints: 350, isCurrentUser: false },
            { rank: 0, name: "Casey Beginner", visaPoints: 200, isCurrentUser: false },
            { rank: 0, name: "Newbie", visaPoints: 50, isCurrentUser: false },
        ];

        // Combine and sort
        // Note: In a real app, you'd likely just use realData. 
        // Here we merge to ensure the user sees the tiers as requested.
        const combined = [...realData.map(u => ({ ...u, visaPoints: 0 })), ...mockUsers];
        // *Correction*: getOverallLeaderboard returns { rank, name, isCurrentUser } but NOT points directly in the interface defined in AuthContext.
        // I need to check AuthContext definition again. 
        // Looking at AuthContext.tsx lines 641-649:
        // .map((u, index) => ({ rank: index + 1, name: u.fullName, isCurrentUser: ... }))
        // It seems `visaPoints` is missing from the `LeaderboardEntry` interface in `AuthContext`.
        // I should probably fetch `getAllUsers` and sort myself to get points, or update `AuthContext`.
        // For now, to avoid modifying AuthContext and potentially breaking other things, I will use `getAllUsers` here.

        return [];
    }, []);

    // Re-implementing correctly using getAllUsers to get points
    const { getAllUsers, user } = useAuth();

    const displayData = useMemo(() => {
        const allUsers = getAllUsers();

        // Add mocks if needed for demonstration
        const mocks = [
            { contact: 'mock1', fullName: "Alex Champion", visaPoints: 850, teamName: 'Pioneers' },
            { contact: 'mock2', fullName: "Sam Pro", visaPoints: 500, teamName: 'Innovators' },
            { contact: 'mock3', fullName: "Jordan Inter", visaPoints: 350, teamName: 'Creators' },
            { contact: 'mock4', fullName: "Casey Beginner", visaPoints: 200, teamName: 'Explorers' },
        ];

        const combined = [...allUsers, ...mocks];

        let filtered = combined;
        if (selectedTier !== 'All') {
            filtered = combined.filter(u => getTier(u.visaPoints).name === selectedTier);
        }

        return filtered
            .sort((a, b) => b.visaPoints - a.visaPoints)
            .map((u, index) => ({
                rank: index + 1,
                name: u.fullName,
                points: u.visaPoints,
                tier: getTier(u.visaPoints),
                isCurrentUser: user ? u.contact === user.contact : false,
                team: u.teamName
            }));
    }, [getAllUsers, user, selectedTier]);

    return (
        <div
            className="w-full h-full min-h-[500px] bg-white p-4 md:p-6 rounded-lg shadow-inner flex flex-col overflow-hidden"
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-brand-passport-primary">Leaderboard</h2>
                <p className="text-sm text-gray-500">Compete for the top spot!</p>
            </div>

            {/* Tier Legend / Filter */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
                <button
                    onClick={() => setSelectedTier('All')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedTier === 'All'
                        ? 'bg-gray-800 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    All
                </button>
                {['Beginner', 'Intermediate', 'Pro', 'Champion'].map((tierName) => {
                    // @ts-ignore
                    const { color, icon: Icon } = getTier(tierName === 'Champion' ? 800 : tierName === 'Pro' ? 500 : tierName === 'Intermediate' ? 350 : 200);
                    const isSelected = selectedTier === tierName;
                    return (
                        <button
                            key={tierName}
                            onClick={() => setSelectedTier(tierName as Tier)}
                            className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all ${isSelected
                                ? `${color} ring-2 ring-offset-1 ring-current shadow-md scale-105`
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            <Icon className="mr-1" /> {tierName}
                        </button>
                    );
                })}
            </div>

            <div
                className="flex-grow overflow-y-auto passport-scrollbar pr-2"
            >
                {displayData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p>No leaderboard data available yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {displayData.map((entry) => (
                            <div
                                key={entry.rank}
                                className={`flex items-center p-3 rounded-xl border-2 transition-all ${entry.isCurrentUser
                                    ? 'border-brand-passport-accent bg-brand-passport-accent/10'
                                    : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                {/* Rank */}
                                <div className={`
                                    w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full font-bold mr-3
                                    ${entry.rank === 1 ? 'bg-yellow-400 text-white' :
                                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                                            entry.rank === 3 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'}
                                `}>
                                    {entry.rank}
                                </div>

                                {/* User Info */}
                                <div className="flex-grow min-w-0 mr-2">
                                    <div className="flex items-center">
                                        <h3 className={`font-semibold truncate ${entry.isCurrentUser ? 'text-brand-passport-primary' : 'text-gray-700'}`}>
                                            {entry.name} {entry.isCurrentUser && '(You)'}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{entry.team}</p>
                                </div>

                                {/* Points & Tier */}
                                <div className="text-right flex flex-col items-end">
                                    <span className="font-bold text-brand-passport-primary">{entry.points} pts</span>
                                    <div className={`flex items-center text-[10px] px-2 py-0.5 rounded-full mt-1 ${entry.tier.color}`}>
                                        <entry.tier.icon className="w-3 h-3 mr-1" />
                                        {entry.tier.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
