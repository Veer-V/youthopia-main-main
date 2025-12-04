import * as React from 'react';
import { FiZap, FiEdit, FiUsers, FiAward, FiStar, FiSun, FiHeart, FiGift } from 'react-icons/fi';
import type { User } from './events.ts';
import type { Event } from './events.ts';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    isUnlocked: (user: User, events: Event[]) => boolean;
}

export const achievementsList: Achievement[] = [
    {
        id: 'first-step',
        name: 'First Step',
        description: 'Register for your first event.',
        icon: React.createElement(FiZap, { className: "h-6 w-6 text-yellow-400" }),
        isUnlocked: (user, events) => events.some(e => e.registered),
    },
    {
        id: 'event-explorer',
        name: 'Event Explorer',
        description: 'Complete 5 different events.',
        icon: React.createElement(FiStar, { className: "h-6 w-6 text-indigo-400" }),
        isUnlocked: (user, events) => events.filter(e => e.completed).length >= 5,
    },
    {
        id: 'committed-participant',
        name: 'Committed Participant',
        description: 'Complete 10 different events.',
        icon: React.createElement(FiAward, { className: "h-6 w-6 text-purple-400" }),
        isUnlocked: (user, events) => events.filter(e => e.completed).length >= 10,
    },
    {
        id: 'creative-soul',
        name: 'Creative Soul',
        description: 'Complete all creative arts events.',
        icon: React.createElement(FiEdit, { className: "h-6 w-6 text-pink-400" }),
        isUnlocked: (user, events) => {
            const creativeEventIds = ['evt-05', 'evt-16', 'evt-18', 'evt-19']; // Painting, Writing, Digital Art, Comic Flow
            return creativeEventIds.every(id => events.find(e => e.id === id)?.completed);
        },
    },
    {
        id: 'team-player',
        name: 'Team Player',
        description: 'Participate in all group events.',
        icon: React.createElement(FiUsers, { className: "h-6 w-6 text-green-400" }),
        isUnlocked: (user, events) => {
            const groupEventIds = ['evt-02', 'evt-04', 'evt-07', 'evt-10']; // Group Dance, Folk Dance, Group Singing, Skit
            return groupEventIds.every(id => events.find(e => e.id === id)?.completed);
        },
    },
    {
        id: 'points-hoarder',
        name: 'Points Hoarder',
        description: 'Accumulate 100 VISA Points.',
        icon: React.createElement(FiGift, { className: "h-6 w-6 text-red-400" }),
        isUnlocked: (user, events) => user.visaPoints >= 100,
    },
     {
        id: 'completionist',
        name: 'Completionist!',
        description: 'Complete all available events.',
        icon: React.createElement(FiSun, { className: "h-6 w-6 text-orange-400" }),
        isUnlocked: (user, events) => events.every(e => e.completed),
    },
     {
        id: 'feedback-fanatic',
        name: 'Feedback Fanatic',
        description: 'Provide feedback for 3 events.',
        icon: React.createElement(FiHeart, { className: "h-6 w-6 text-teal-400" }),
        isUnlocked: (user, events) => events.filter(e => e.feedback).length >= 3,
    },
];