import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Event } from '../../data/events.ts';
import { FiClock, FiMapPin } from 'react-icons/fi';

type Filter = 'all' | 'day1' | 'day2' | 'mine';

const SchedulePage: React.FC = () => {
    const { events: allEvents, user } = useAuth();
    const [filter, setFilter] = useState<Filter>('all');
    
    const userRegisteredEventIds = useMemo(() => {
        if (!user) return new Set();
        return new Set(user.events.filter(e => e.registered).map(e => e.id));
    }, [user]);

    const filteredEvents = useMemo(() => {
        let sorted = [...allEvents].sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;

            const timeA = a.time.toUpperCase();
            const timeB = b.time.toUpperCase();
            if (timeA === "ALL DAY") return -1;
            if (timeB === "ALL DAY") return 1;

            const getMinutes = (time: string) => {
                const parts = time.match(/(\d+):(\d+)\s*(AM|PM)/);
                if (!parts) return 0;
                let hours = parseInt(parts[1], 10);
                const minutes = parseInt(parts[2], 10);
                const period = parts[3];

                if (period === 'PM' && hours !== 12) {
                    hours += 12;
                }
                if (period === 'AM' && hours === 12) {
                    hours = 0;
                }
                return hours * 60 + minutes;
            };

            return getMinutes(timeA) - getMinutes(timeB);
        });

        if (filter === 'day1') {
            return sorted.filter(e => e.date === 'Sat, Nov 23');
        }
        if (filter === 'day2') {
            return sorted.filter(e => e.date === 'Sun, Nov 24');
        }
        if (filter === 'mine') {
            return sorted.filter(e => userRegisteredEventIds.has(e.id));
        }
        return sorted;
    }, [allEvents, filter, userRegisteredEventIds]);

    const FilterButton: React.FC<{ value: Filter; label: string }> = ({ value, label }) => (
        <motion.button
            type="button"
            onClick={() => setFilter(value)}
            className={`relative w-full py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-[0.7rem] sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-passport-primary ${filter === value ? 'text-brand-passport-primary' : 'text-brand-passport-subtle hover:text-brand-passport-primary'}`}
            whileTap={{ scale: 0.95 }}
        >
            {label}
            {filter === value && (
                <motion.div
                    layoutId="schedule-filter-highlight"
                    className="absolute inset-0 bg-brand-passport-accent/30 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}
        </motion.button>
    );

    return (
        <motion.div
            className="w-full h-full bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-inner flex flex-col min-h-[400px]"
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.h3
                variants={itemSpringUp}
                className="text-xl md:text-2xl font-bold text-brand-passport-primary dark:text-gray-100 mb-3 border-b-2 border-brand-passport-subtle dark:border-gray-700 pb-2"
            >
                Event Schedule
            </motion.h3>

            {/* Filter pills */}
            <motion.div
                variants={itemSpringUp}
                className="grid grid-cols-4 gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-full p-1 mb-3 sm:mb-4 z-10"
            >
                <FilterButton value="all" label="All" />
                <FilterButton value="day1" label="Day 1" />
                <FilterButton value="day2" label="Day 2" />
                <FilterButton value="mine" label="My Schedule" />
            </motion.div>

            {/* List */}
            <motion.div 
                className="overflow-y-auto flex-grow pr-2 -mr-2 space-y-3"
                variants={staggerContainer(0.05)}
            >
                {filteredEvents.length === 0 && (
                    <motion.div
                        key="empty"
                        variants={itemSpringUp}
                        className="flex flex-col items-center justify-center text-center py-8 px-4 bg-brand-bg/40 dark:bg-gray-700/40 rounded-lg"
                    >
                        <p className="text-sm font-semibold text-brand-passport-primary dark:text-gray-100 mb-1">
                            No events to show.
                        </p>
                        <p className="text-xs text-brand-passport-subtle dark:text-gray-400">
                            Try switching the filter or check back later for updates.
                        </p>
                    </motion.div>
                )}

                {filteredEvents.map((event: Event) => (
                    <motion.div
                        key={event.id}
                        variants={itemSpringUp}
                        className="bg-brand-bg/60 dark:bg-gray-700/40 p-3 sm:p-4 rounded-lg border border-brand-passport-subtle/40 dark:border-gray-700/60 shadow-sm"
                    >
                        <p className="font-semibold text-sm sm:text-base text-brand-passport-primary dark:text-gray-200">
                            {event.name}
                        </p>
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-[0.7rem] sm:text-xs text-brand-passport-primary/80 dark:text-gray-300">
                            <span className="inline-flex items-center gap-1.5">
                                <FiClock size={12} />
                                <span>{event.date}, {event.time}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <FiMapPin size={12} />
                                <span>{event.location}</span>
                            </span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default SchedulePage;