import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCheckCircle, FiAward, FiUser, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Event, User } from '../../data/events.ts';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';

const AdminMasterControlPage: React.FC = () => {
    const { getMasterEvents, getAllUsers, adminCompleteEventForUser } = useAuth();
    const [events, setEvents] = React.useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [users, setUsers] = React.useState<User[]>([]);
    const [notification, setNotification] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

    React.useEffect(() => {
        setEvents(getMasterEvents());
        setUsers(getAllUsers());
    }, [getMasterEvents, getAllUsers]);

    const filteredEvents = React.useMemo(() => {
        return events.filter(event =>
            event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [events, searchQuery]);

    const getEnrolledUsers = (eventId: string) => {
        return users.filter(user =>
            user.events.some(e => e.id === eventId && e.registered)
        );
    };

    const handleAwardPoints = (userContact: string, eventId: string, points: number) => {
        adminCompleteEventForUser(userContact, eventId, points);
        setUsers(getAllUsers()); // Refresh users to show updated status
        setNotification({ message: `Points awarded successfully!`, type: 'success' });
        setTimeout(() => setNotification(null), 3000);
    };

    const isEventCompletedByUser = (user: User, eventId: string) => {
        return user.events.find(e => e.id === eventId)?.completed;
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Master Control</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage event completions and award points</p>
                </div>

                {!selectedEvent && (
                    <div className="relative w-full md:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiSearch /></span>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                        />
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    >
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {!selectedEvent ? (
                    <motion.div
                        key="event-list"
                        variants={staggerContainer(0.05)}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {filteredEvents.map(event => (
                            <motion.div
                                key={event.id}
                                variants={itemSpringUp}
                                onClick={() => setSelectedEvent(event)}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-brand-blue group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-lg bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                        <FiCalendar size={24} />
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                        {event.points} Pts
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-brand-blue transition-colors">
                                    {event.name}
                                </h3>
                                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="shrink-0"><FiClock /></span>
                                        <span>{event.date} • {event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="shrink-0"><FiMapPin /></span>
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="shrink-0"><FiUser /></span>
                                        <span>{getEnrolledUsers(event.id).length} Enrolled</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="event-detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="text-sm text-brand-blue hover:underline mb-2 flex items-center gap-1"
                                >
                                    ← Back to Events
                                </button>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{selectedEvent.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedEvent.date} • {selectedEvent.location}
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <div className="text-2xl font-bold text-brand-blue">{selectedEvent.points}</div>
                                <div className="text-xs text-gray-500 uppercase font-medium">Points per completion</div>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FiUser /> Enrolled Students ({getEnrolledUsers(selectedEvent.id).length})
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                                            <th className="py-3 px-4 font-medium">Student Name</th>
                                            <th className="py-3 px-4 font-medium">Class / Stream</th>
                                            <th className="py-3 px-4 font-medium">Contact</th>
                                            <th className="py-3 px-4 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {getEnrolledUsers(selectedEvent.id).map(user => {
                                            const isCompleted = isEventCompletedByUser(user, selectedEvent.id);
                                            return (
                                                <tr key={user.contact} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                                                        {user.fullName}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                                        {user.class} - {user.stream}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                                        {user.contact}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        {isCompleted ? (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                                                <FiCheckCircle size={14} /> Completed
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAwardPoints(user.contact, selectedEvent.id, selectedEvent.points)}
                                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                                                            >
                                                                <FiAward size={16} /> Award {selectedEvent.points} Pts
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {getEnrolledUsers(selectedEvent.id).length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400 italic">
                                                    No students currently enrolled in this event.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminMasterControlPage;
