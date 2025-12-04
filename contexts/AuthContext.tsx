import * as React from 'react';
import { achievementsList, Achievement } from '../data/achievements';
import {
    getInitialEvents,
    Event,
    PointTransaction,
    User,
    AdminUser,
    LeaderboardEntry,
    TeamLeaderboardEntry,
    FeedbackEntry,
    DashboardStats,
    ReportStats,
    AppNotification,
    SurveyResponse
} from '../data/events';


// --- TYPE DEFINITIONS ---

export interface RedemptionRecord {
    id: string;
    userId: string;
    userName: string;
    userClass: string;
    itemName: string;
    points: number;
    timestamp: number;
}

export interface AuthContextType {
    user: User | null;
    adminUser: AdminUser | null;
    events: Event[]; // The events specific to the logged-in user
    lastEarnedAchievements: Achievement[];
    lastNotification: AppNotification | null;
    login: (contact: string, pass: string) => void;
    logout: () => void;
    register: (details: Omit<User, 'visaPoints' | 'spinsAvailable' | 'achievements' | 'active' | 'events' | 'pointsHistory' | 'teamName' | 'password' | 'dailyStreak' | 'lastCheckInTimestamp' | 'registrationTimestamp'> & { password?: string }) => void;
    checkUserExists: (contact: string) => boolean;
    resetPassword: (contact: string, newPass: string) => void;
    adminLogin: (contact: string, pass: string) => void;
    adminLogout: () => void;
    registerForEvent: (eventId: string) => void;
    completeEvent: (eventId: string) => void;
    submitFeedback: (eventId: string, feedback: string) => void;
    addPoints: (points: number, reason: string) => void;
    useSpin: () => void;
    performDailyCheckIn: () => void;
    completeOnboarding: () => void;
    clearLastEarnedAchievements: () => void;
    clearLastNotification: () => void;
    // Admin functions
    getMasterEvents: () => Event[];
    getDashboardStats: () => DashboardStats;
    getStatsForDateRange: (startDate: Date, endDate: Date) => ReportStats;
    getAllUsers: () => User[];
    updateUserStatus: (contact: string, active: boolean) => void;
    updateUserDetails: (contact: string, details: Partial<Pick<User, 'fullName' | 'schoolName' | 'class' | 'stream' | 'visaPoints'>>) => void;
    getAllFeedback: () => FeedbackEntry[];
    submitSurveyResponse: (answers: Record<string, any>) => void;
    getAllSurveyResponses: () => { user: User, response: SurveyResponse }[];
    getLeaderboardForEvent: (eventId: string) => LeaderboardEntry[];
    getOverallLeaderboard: () => LeaderboardEntry[];
    getTeamLeaderboard: () => TeamLeaderboardEntry[];
    getCurrentUserRank: () => number | null;
    adminCompleteEventForUser: (contact: string, eventId: string, points: number) => void;
    redeemPoints: (points: number, itemName: string) => boolean;
    getAllRedemptions: () => RedemptionRecord[];
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'youthopia_users';
const CURRENT_USER_KEY = 'youthopia_currentUserContact';
const CURRENT_ADMIN_KEY = 'youthopia_currentAdmin';


/**
 * Ensures a user's event list is perfectly synchronized with the master event list.
 * This function prevents data inconsistencies and is the definitive fix for the "empty dashboard" issue.
 * @param user The user object to synchronize.
 * @returns The user object with a fully synchronized event list.
 */
const syncUserWithMasterEvents = (user: User): User => {
    const masterEvents = getInitialEvents();
    const userEventsMap = new Map((user.events || []).map(e => [e.id, e]));

    const syncedEvents = masterEvents.map(masterEvent => {
        const userEventProgress = userEventsMap.get(masterEvent.id);
        return {
            ...masterEvent,
            registered: userEventProgress?.registered || false,
            completed: userEventProgress?.completed || false,
            completedAt: userEventProgress?.completedAt,
            feedback: userEventProgress?.feedback,
        };
    });

    user.events = syncedEvents;
    return user;
};


const getStoredUsers = (): User[] => {
    try {
        const storedUsers = localStorage.getItem(USERS_KEY);
        return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage:", error);
        return [];
    }
};

// This function runs once when the module loads, ensuring localStorage is correct before React renders.
const initializeAndSyncLocalStorage = () => {
    let allUsers: User[];
    try {
        const storedUsers = localStorage.getItem(USERS_KEY);
        // If parsing fails, the catch block will handle it.
        allUsers = storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
        console.error("Critical error parsing users from localStorage. Resetting data.", error);
        // When the user database is corrupted, we must also clear the current user session.
        // This prevents a state where the app thinks a user is logged in, but their data is gone.
        localStorage.removeItem(CURRENT_USER_KEY);
        allUsers = []; // Start with a fresh user list
    }

    const studentContact = '9321549715';
    const studentPassword = 'Aditya@2025';
    const studentIndex = allUsers.findIndex(u => u.contact === studentContact);
    let needsUpdate = false;

    if (studentIndex > -1) {
        const studentUser = allUsers[studentIndex];
        // Ensure password is correct
        if (studentUser.password !== studentPassword) {
            studentUser.password = studentPassword;
            needsUpdate = true;
        }
        // Sync events if they are missing or out of date
        const masterEventsCount = getInitialEvents().length;
        if (!studentUser.events || studentUser.events.length !== masterEventsCount) {
            allUsers[studentIndex] = syncUserWithMasterEvents(studentUser);
            needsUpdate = true;
        }
        // Initialize daily check-in fields if they don't exist
        if (studentUser.dailyStreak === undefined) {
            studentUser.dailyStreak = 0;
            needsUpdate = true;
        }
        if (studentUser.lastCheckInTimestamp === undefined) {
            studentUser.lastCheckInTimestamp = 0;
            needsUpdate = true;
        }
        if (studentUser.registrationTimestamp === undefined) {
            studentUser.registrationTimestamp = Date.now() - 15 * 24 * 60 * 60 * 1000; // 15 days ago
            needsUpdate = true;
        }
        if (studentUser.onboardingCompleted === undefined) {
            studentUser.onboardingCompleted = true; // Existing users are assumed to have completed onboarding
            needsUpdate = true;
        }

    } else {
        // Create the test user if they don't exist
        const newStudent: User = {
            fullName: 'Aditya',
            schoolName: 'B.K. Birla College of Arts, Science & Commerce',
            contact: studentContact,
            class: 'FYBSc',
            stream: 'IT',
            password: studentPassword,
            photo: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjH0HROhnA6PA9FytxxHcIgDhvepimtZG9qQ&s`,
            visaPoints: 0,
            spinsAvailable: 0,
            achievements: [],
            active: true,
            events: getInitialEvents(),
            pointsHistory: [],
            teamName: 'Pioneers',
            dailyStreak: 0,
            lastCheckInTimestamp: 0,
            registrationTimestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
            onboardingCompleted: false,
        };
        allUsers.push(newStudent);
        needsUpdate = true;
    }

    // Seed additional mock students if total is below 25
    if (allUsers.length < 25) {
        const toAdd = 25 - allUsers.length;
        const teams = ['Innovators', 'Creators', 'Explorers', 'Pioneers'];
        for (let i = 0; i < toAdd; i++) {
            const seq = i + 1;
            const contact = `9000000${(100 + i).toString()}`; // 9000000100, 9000000101, ...
            if (allUsers.some(u => u.contact === contact)) continue;
            const newUser: User = {
                fullName: `Student ${seq.toString().padStart(2, '0')}`,
                schoolName: 'B.K. Birla College of Arts, Science & Commerce',
                contact,
                class: ['FYBSc', 'SYBSc', 'TYBCom', 'FYBA'][seq % 4],
                stream: ['IT', 'CS', 'Accounts', 'Arts'][seq % 4],
                password: 'password123',
                photo: `https://i.pravatar.cc/150?u=${contact}`,
                visaPoints: 0,
                spinsAvailable: 0,
                achievements: [],
                active: true,
                events: getInitialEvents(),
                pointsHistory: [],
                teamName: teams[seq % teams.length],
                dailyStreak: 0,
                lastCheckInTimestamp: 0,
                registrationTimestamp: Date.now() - (seq * 24 * 60 * 60 * 1000),
                onboardingCompleted: false,
            };
            allUsers.push(newUser);
        }
        needsUpdate = true;
    }

    if (needsUpdate) {
        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
        } catch (error) {
            console.error("Failed to save users to localStorage:", error);
        }
    }
};

// Run the initialization logic immediately when the app loads.
initializeAndSyncLocalStorage();

const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = React.useState<User[]>(getStoredUsers);

    const [user, setUser] = React.useState<User | null>(() => {
        const allUsers = getStoredUsers();
        const currentUserContact = localStorage.getItem(CURRENT_USER_KEY);
        if (currentUserContact) {
            const foundUser = allUsers.find(u => u.contact === currentUserContact);
            if (foundUser) {
                // This sync on initial load remains as a redundant safety measure.
                return syncUserWithMasterEvents(foundUser);
            }
        }
        return null;
    });

    const [adminUser, setAdminUser] = React.useState<AdminUser | null>(() => {
        const currentAdmin = localStorage.getItem(CURRENT_ADMIN_KEY);
        return currentAdmin ? { username: currentAdmin } : null;
    });

    const [lastEarnedAchievements, setLastEarnedAchievements] = React.useState<Achievement[]>([]);
    const [lastNotification, setLastNotification] = React.useState<AppNotification | null>(null);

    const updateUserStateAndStorage = React.useCallback((updatedUser: User) => {
        setUser(updatedUser);
        setUsers(prevUsers => {
            const newUsers = prevUsers.map(u => u.contact === updatedUser.contact ? updatedUser : u);
            localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
            return newUsers;
        });
    }, []);

    const checkAndAwardAchievements = React.useCallback((updatedUser: User) => {
        const newlyEarned: Achievement[] = [];
        achievementsList.forEach(achievement => {
            if (!updatedUser.achievements.includes(achievement.id) && achievement.isUnlocked(updatedUser, updatedUser.events)) {
                updatedUser.achievements.push(achievement.id);
                const bonus = 25;
                updatedUser.visaPoints += bonus;
                updatedUser.pointsHistory.push({
                    points: bonus,
                    reason: `Achievement: ${achievement.name}`,
                    timestamp: Date.now(),
                });
                newlyEarned.push(achievement);
            }
        });
        if (newlyEarned.length > 0) {
            setLastEarnedAchievements(prev => [...prev, ...newlyEarned]);
        }
    }, []);


    const login = React.useCallback((contact: string, pass: string) => {
        const allUsers = getStoredUsers();
        const userToLogin = allUsers.find(u => u.contact === contact);
        if (userToLogin) {
            if (!userToLogin.active) {
                throw new Error("Your account has been deactivated. Please contact an administrator.");
            }
            // Validate password
            if (userToLogin.password && userToLogin.password !== pass) {
                throw new Error('Invalid password.');
            }
            const syncedUser = syncUserWithMasterEvents(userToLogin);
            setUser(syncedUser);
            localStorage.setItem(CURRENT_USER_KEY, contact);
        } else {
            throw new Error('No account found with this contact number.');
        }
    }, []);

    const logout = React.useCallback(() => {
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    }, []);

    const register = React.useCallback((details: Omit<User, 'visaPoints' | 'spinsAvailable' | 'achievements' | 'active' | 'events' | 'pointsHistory' | 'teamName' | 'password' | 'dailyStreak' | 'lastCheckInTimestamp' | 'registrationTimestamp'> & { password?: string }) => {
        const allUsers = getStoredUsers();
        if (allUsers.some(u => u.contact === details.contact)) {
            throw new Error('An account with this contact number already exists.');
        }
        const newUser: User = {
            ...details,
            visaPoints: 0, // Points start at 0 until onboarding is complete
            spinsAvailable: 0,
            achievements: [],
            active: true,
            events: getInitialEvents(),
            pointsHistory: [], // No initial history
            teamName: ['Innovators', 'Creators', 'Explorers', 'Pioneers'][Math.floor(Math.random() * 4)],
            dailyStreak: 0,
            lastCheckInTimestamp: 0,
            registrationTimestamp: Date.now(),
            onboardingCompleted: false,
        };
        const updatedUsers = [...allUsers, newUser];
        setUsers(updatedUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        setUser(newUser);
        localStorage.setItem(CURRENT_USER_KEY, newUser.contact);
    }, []);

    const checkUserExists = React.useCallback((contact: string) => getStoredUsers().some(u => u.contact === contact), []);

    const resetPassword = React.useCallback((contact: string, newPass: string) => {
        const allUsers = getStoredUsers();
        const userIndex = allUsers.findIndex(u => u.contact === contact);
        if (userIndex === -1) {
            throw new Error("User not found.");
        }
        allUsers[userIndex].password = newPass;
        setUsers(allUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
    }, []);

    const adminLogin = React.useCallback((contact: string, pass: string) => {
        if (contact === '9321549715' && pass === 'admin') {
            const adminData = { username: 'Admin' };
            setAdminUser(adminData);
            localStorage.setItem(CURRENT_ADMIN_KEY, adminData.username);
        } else {
            throw new Error('Invalid admin credentials.');
        }
    }, []);

    const adminLogout = React.useCallback(() => {
        setAdminUser(null);
        localStorage.removeItem(CURRENT_ADMIN_KEY);
    }, []);

    const registerForEvent = React.useCallback((eventId: string) => {
        if (!user) return;
        const updatedUser = { ...user };
        const event = updatedUser.events.find(e => e.id === eventId);
        if (event && !event.registered) {
            event.registered = true;
            // Points are no longer awarded on registration
            checkAndAwardAchievements(updatedUser);
            updateUserStateAndStorage(updatedUser);
            setLastNotification({ message: `Successfully Registered!`, type: 'success' });
        }
    }, [user, checkAndAwardAchievements, updateUserStateAndStorage]);

    const completeEvent = React.useCallback((eventId: string) => {
        if (!user) return;
        if (!user.onboardingCompleted) {
            setLastNotification({ message: "Complete onboarding tasks to earn points!", type: 'info' });
            return;
        }
        const updatedUser = { ...user };
        const event = updatedUser.events.find(e => e.id === eventId);
        if (event && !event.completed) {
            event.completed = true;
            event.completedAt = Date.now();

            const bonusPoints = 5;
            const totalPoints = event.points + bonusPoints;
            updatedUser.visaPoints += totalPoints;
            updatedUser.pointsHistory.push({ points: totalPoints, reason: `Completed: ${event.name} (+${bonusPoints} Bonus)`, timestamp: Date.now() });

            // Count completed events *after* this one to check for spin award
            const completedCount = updatedUser.events.filter(e => e.completed).length;

            let notificationMessage = `Event Completed! +${totalPoints} Points`;

            // Award one spin for every five completed events
            if (completedCount > 0 && completedCount % 5 === 0) {
                updatedUser.spinsAvailable += 1;
                notificationMessage += ` & you earned a Spin!`;
            }

            checkAndAwardAchievements(updatedUser);
            updateUserStateAndStorage(updatedUser);
            setLastNotification({ message: notificationMessage, type: 'success' });
        }
    }, [user, checkAndAwardAchievements, updateUserStateAndStorage]);

    const submitFeedback = React.useCallback((eventId: string, feedback: string) => {
        if (!user) return;
        const updatedUser = { ...user };
        const event = updatedUser.events.find(e => e.id === eventId);
        if (event) {
            event.feedback = feedback;
            checkAndAwardAchievements(updatedUser);
            updateUserStateAndStorage(updatedUser);
            setLastNotification({ message: `Thank you for your feedback on ${event.name}!`, type: 'info' });
        }
    }, [user, checkAndAwardAchievements, updateUserStateAndStorage]);

    const addPoints = React.useCallback((points: number, reason: string) => {
        if (!user) return;
        if (!user.onboardingCompleted) return;
        const updatedUser = { ...user };
        updatedUser.visaPoints += points;
        updatedUser.pointsHistory.push({ points, reason, timestamp: Date.now() });
        checkAndAwardAchievements(updatedUser);
        updateUserStateAndStorage(updatedUser);
    }, [user, checkAndAwardAchievements, updateUserStateAndStorage]);

    const useSpin = React.useCallback(() => {
        if (!user || user.spinsAvailable <= 0) return;
        if (!user.onboardingCompleted) {
            setLastNotification({ message: "Complete onboarding tasks to use spins!", type: 'info' });
            return;
        }
        const updatedUser = { ...user, spinsAvailable: user.spinsAvailable - 1 };
        updateUserStateAndStorage(updatedUser);
    }, [user, updateUserStateAndStorage]);

    const performDailyCheckIn = React.useCallback(() => {
        if (!user) return;
        if (!user.onboardingCompleted) {
            setLastNotification({ message: "Complete onboarding tasks to check in!", type: 'info' });
            return;
        }

        const now = new Date();
        const lastCheckInDate = new Date(user.lastCheckInTimestamp);

        if (user.lastCheckInTimestamp > 0 && isSameDay(now, lastCheckInDate)) {
            setLastNotification({ message: `You've already checked in today!`, type: 'info' });
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);

        const continuesStreak = user.lastCheckInTimestamp > 0 && isSameDay(lastCheckInDate, yesterday);
        const newStreak = continuesStreak ? user.dailyStreak + 1 : 1;
        const pointsAwarded = 2;

        const updatedUser = { ...user };
        updatedUser.visaPoints += pointsAwarded;
        updatedUser.pointsHistory.push({ points: pointsAwarded, reason: `Daily Check-in Streak: Day ${newStreak}`, timestamp: Date.now() });
        updatedUser.dailyStreak = newStreak;
        updatedUser.lastCheckInTimestamp = Date.now();

        checkAndAwardAchievements(updatedUser);
        updateUserStateAndStorage(updatedUser);
        setLastNotification({ message: `Checked in! +${pointsAwarded} Points. Streak: ${newStreak} days!`, type: 'success' });

    }, [user, checkAndAwardAchievements, updateUserStateAndStorage]);

    const completeOnboarding = React.useCallback(() => {
        if (!user || user.onboardingCompleted) return;

        const updatedUser = { ...user };
        updatedUser.onboardingCompleted = true;

        // Award Welcome Bonus
        const bonus = 5;
        updatedUser.visaPoints += bonus;
        updatedUser.pointsHistory.push({ points: bonus, reason: 'Welcome Bonus! (Onboarding Complete)', timestamp: Date.now() });

        updateUserStateAndStorage(updatedUser);
        setLastNotification({ message: `Onboarding Complete! +${bonus} Points`, type: 'success' });
    }, [user, updateUserStateAndStorage]);

    const clearLastEarnedAchievements = React.useCallback(() => {
        setLastEarnedAchievements([]);
    }, []);

    const clearLastNotification = React.useCallback(() => {
        setLastNotification(null);
    }, []);

    // Admin Getters
    const getMasterEvents = React.useCallback(() => getInitialEvents(), []);

    const getDashboardStats = React.useCallback((): DashboardStats => {
        const allUsers = getStoredUsers().map(syncUserWithMasterEvents); // Ensure users have latest events
        const totalCompletedEvents = allUsers.reduce((acc, u) => acc + u.events.filter(e => e.completed).length, 0);
        const totalPointsAwarded = allUsers.reduce((acc, u) => acc + u.visaPoints, 0);
        return {
            totalUsers: allUsers.length,
            totalEvents: getInitialEvents().length,
            totalCompletedEvents,
            totalPointsAwarded,
        };
    }, []);

    const getStatsForDateRange = React.useCallback((startDate: Date, endDate: Date): ReportStats => {
        const allUsers = getStoredUsers().map(syncUserWithMasterEvents);
        const start = startDate.getTime();
        const end = endDate.getTime();

        let newUsers = 0;
        let eventsCompleted = 0;
        let pointsAwarded = 0;
        let dailyCheckIns = 0;

        const userGrowthMap: Record<string, number> = {};
        const eventCompletionMap: Record<string, number> = {};

        allUsers.forEach(u => {
            // New Users
            if (u.registrationTimestamp >= start && u.registrationTimestamp <= end) {
                newUsers++;
                const dateKey = new Date(u.registrationTimestamp).toISOString().split('T')[0];
                userGrowthMap[dateKey] = (userGrowthMap[dateKey] || 0) + 1;
            }

            // Events Completed
            u.events.forEach(e => {
                if (e.completed && e.completedAt && e.completedAt >= start && e.completedAt <= end) {
                    eventsCompleted++;
                    const dateKey = new Date(e.completedAt).toISOString().split('T')[0];
                    eventCompletionMap[dateKey] = (eventCompletionMap[dateKey] || 0) + 1;
                }
            });

            // Points Awarded & Daily Check-ins
            u.pointsHistory.forEach(p => {
                if (p.timestamp >= start && p.timestamp <= end) {
                    pointsAwarded += p.points;
                    if (p.reason.startsWith('Daily Check-in')) {
                        dailyCheckIns++;
                    }
                }
            });
        });

        const formatDateLabel = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const fillDateGaps = (dataMap: Record<string, number>) => {
            const result: { label: string, value: number }[] = [];
            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const dateKey = currentDate.toISOString().split('T')[0];
                result.push({
                    label: formatDateLabel(currentDate),
                    value: dataMap[dateKey] || 0
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return result;
        };


        return {
            newUsers,
            eventsCompleted,
            pointsAwarded,
            dailyCheckIns,
            userGrowthData: fillDateGaps(userGrowthMap),
            eventCompletionData: fillDateGaps(eventCompletionMap),
        };
    }, []);

    const getAllUsers = React.useCallback(() => getStoredUsers().map(syncUserWithMasterEvents), []);

    const updateUserStatus = React.useCallback((contact: string, active: boolean) => {
        const allUsers = getStoredUsers();
        const updatedUsers = allUsers.map(u => u.contact === contact ? { ...u, active } : u);
        setUsers(updatedUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    }, []);

    const updateUserDetails = React.useCallback((contact: string, details: Partial<Pick<User, 'fullName' | 'schoolName' | 'class' | 'stream' | 'visaPoints'>>) => {
        const allUsers = getStoredUsers();
        const updatedUsers = allUsers.map(u => (u.contact === contact ? { ...u, ...details } : u));
        setUsers(updatedUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        if (user?.contact === contact) {
            setUser(prev => (prev ? { ...prev, ...details } : null));
        }
    }, [user]);

    const getAllFeedback = React.useCallback((): FeedbackEntry[] => {
        const allFeedback: FeedbackEntry[] = [];
        getStoredUsers().map(syncUserWithMasterEvents).forEach(u => {
            u.events.forEach(e => {
                if (e.feedback) {
                    allFeedback.push({
                        eventId: e.id,
                        eventName: e.name,
                        userName: u.fullName,
                        userContact: u.contact,
                        feedback: e.feedback,
                    });
                }
            });
        });
        return allFeedback;
    }, []);

    const getLeaderboardForEvent = React.useCallback((eventId: string): LeaderboardEntry[] => {
        const completedParticipants = getStoredUsers().map(syncUserWithMasterEvents)
            .map(u => ({ user: u, event: u.events.find(e => e.id === eventId) }))
            .filter(item => item.event && item.event.completed && item.event.completedAt)
            .sort((a, b) => a.event!.completedAt! - b.event!.completedAt!);

        return completedParticipants.map((item, index) => ({
            rank: index + 1,
            name: item.user.fullName,
            isCurrentUser: user ? item.user.contact === user.contact : false,
        }));
    }, [user]);

    const getOverallLeaderboard = React.useCallback((): LeaderboardEntry[] => {
        return [...getStoredUsers()]
            .sort((a, b) => b.visaPoints - a.visaPoints)
            .map((u, index) => ({
                rank: index + 1,
                name: u.fullName,
                isCurrentUser: user ? u.contact === user.contact : false,
            }));
    }, [user]);

    const getTeamLeaderboard = React.useCallback((): TeamLeaderboardEntry[] => {
        const teams = getStoredUsers().reduce<Record<string, { points: number, memberCount: number }>>((acc, u) => {
            if (!acc[u.teamName]) {
                acc[u.teamName] = { points: 0, memberCount: 0 };
            }
            acc[u.teamName].points += u.visaPoints;
            acc[u.teamName].memberCount += 1;
            return acc;
        }, {});

        return Object.entries(teams)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.points - a.points)
            .map((team, index) => ({ ...team, rank: index + 1 }));
    }, []);


    const getCurrentUserRank = React.useCallback((): number | null => {
        if (!user) return null;
        const leaderboard = getOverallLeaderboard();
        const userEntry = leaderboard.find(entry => entry.isCurrentUser);
        return userEntry ? userEntry.rank : null;
    }, [user, getOverallLeaderboard]);

    const adminCompleteEventForUser = React.useCallback((contact: string, eventId: string, points: number) => {
        const allUsers = getStoredUsers();
        const userIndex = allUsers.findIndex(u => u.contact === contact);

        if (userIndex === -1) return;

        const updatedUser = { ...allUsers[userIndex] };
        updatedUser.events = updatedUser.events || []; // Ensure events array exists

        // Sync with master events first to ensure event exists
        const masterEvents = getInitialEvents();
        const eventIndex = updatedUser.events.findIndex(e => e.id === eventId);

        if (eventIndex === -1) {
            // If event not found in user's list, try to find in master and add it
            const masterEvent = masterEvents.find(e => e.id === eventId);
            if (masterEvent) {
                updatedUser.events.push({ ...masterEvent, completed: true, completedAt: Date.now() });
            } else {
                return; // Event doesn't exist at all
            }
        } else {
            updatedUser.events[eventIndex].completed = true;
            updatedUser.events[eventIndex].completedAt = Date.now();
        }

        updatedUser.visaPoints += points;
        updatedUser.pointsHistory.push({
            points,
            reason: `Event Completed (Admin Awarded): ${masterEvents.find(e => e.id === eventId)?.name || eventId}`,
            timestamp: Date.now()
        });

        allUsers[userIndex] = updatedUser;
        setUsers(allUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));

        // Update current user if it's the one being modified (unlikely for admin action but good practice)
        if (user?.contact === contact) {
            setUser(updatedUser);
        }
    }, [user]);

    const redeemPoints = React.useCallback((points: number, itemName: string): boolean => {
        if (!user) return false;
        if (user.visaPoints < points) {
            setLastNotification({ message: `Insufficient points to redeem ${itemName}.`, type: 'error' });
            return false;
        }

        const updatedUser = { ...user };
        updatedUser.visaPoints -= points;
        updatedUser.pointsHistory.push({
            points: -points,
            reason: `Redeemed: ${itemName}`,
            timestamp: Date.now()
        });

        updateUserStateAndStorage(updatedUser);
        setLastNotification({ message: `Successfully redeemed ${itemName}!`, type: 'success' });
        return true;
    }, [user, updateUserStateAndStorage]);

    const submitSurveyResponse = React.useCallback((answers: Record<string, any>) => {
        if (!user) return;
        const updatedUser = { ...user };
        const newResponse: SurveyResponse = {
            id: `resp-${Date.now()}`,
            timestamp: Date.now(),
            answers
        };
        updatedUser.surveyResponses = [...(updatedUser.surveyResponses || []), newResponse];
        updateUserStateAndStorage(updatedUser);
        setLastNotification({ message: 'Survey submitted successfully!', type: 'success' });
    }, [user, updateUserStateAndStorage]);

    const getAllSurveyResponses = React.useCallback(() => {
        const allResponses: { user: User, response: SurveyResponse }[] = [];
        getStoredUsers().forEach(u => {
            if (u.surveyResponses) {
                u.surveyResponses.forEach(r => {
                    allResponses.push({ user: u, response: r });
                });
            }
        });
        return allResponses.sort((a, b) => b.response.timestamp - a.response.timestamp);
    }, []);

    const getAllRedemptions = React.useCallback((): RedemptionRecord[] => {
        const allRedemptions: RedemptionRecord[] = [];
        getStoredUsers().forEach(u => {
            u.pointsHistory.forEach((p, index) => {
                if (p.reason.startsWith('Redeemed: ')) {
                    allRedemptions.push({
                        id: `${u.contact}-${p.timestamp}-${index}`,
                        userId: u.contact,
                        userName: u.fullName,
                        userClass: u.class,
                        itemName: p.reason.replace('Redeemed: ', ''),
                        points: Math.abs(p.points),
                        timestamp: p.timestamp,
                    });
                }
            });
        });
        return allRedemptions.sort((a, b) => b.timestamp - a.timestamp);
    }, []);


    const value: AuthContextType = React.useMemo(() => ({
        user,
        adminUser,
        events: user ? user.events : [],
        lastEarnedAchievements,
        lastNotification,
        login,
        logout,
        register,
        checkUserExists,
        resetPassword,
        adminLogin,
        adminLogout,
        registerForEvent,
        completeEvent,
        submitFeedback,
        addPoints,
        useSpin,
        performDailyCheckIn,
        completeOnboarding,
        clearLastEarnedAchievements,
        clearLastNotification,
        getMasterEvents,
        getDashboardStats,
        getStatsForDateRange,
        getAllUsers,
        updateUserStatus,
        updateUserDetails,
        getAllFeedback,
        getLeaderboardForEvent,
        getOverallLeaderboard,
        getTeamLeaderboard,
        getCurrentUserRank,
        adminCompleteEventForUser,
        redeemPoints,
        getAllRedemptions,
        submitSurveyResponse,
        getAllSurveyResponses,
    }), [
        user, adminUser, lastEarnedAchievements, lastNotification, login, logout, register,
        checkUserExists, resetPassword, adminLogin, adminLogout, registerForEvent,
        completeEvent, submitFeedback, addPoints, useSpin, performDailyCheckIn, completeOnboarding, clearLastEarnedAchievements,
        clearLastNotification, getMasterEvents, getDashboardStats, getStatsForDateRange, getAllUsers,
        updateUserStatus, updateUserDetails, getAllFeedback, getLeaderboardForEvent, getOverallLeaderboard,
        getTeamLeaderboard, getCurrentUserRank, adminCompleteEventForUser, redeemPoints, getAllRedemptions
    ]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};