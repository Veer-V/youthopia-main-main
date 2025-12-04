import * as React from 'react';
import { FaBrain, FaUsers, FaHandsHelping } from 'react-icons/fa';

export type EventPhase = 'Awareness' | 'Engagement' | 'Seeking Help';

export const phaseDetails: Record<EventPhase, { name: string; icon: React.ReactNode; color: string }> = {
    'Awareness': {
        name: 'Awareness',
        icon: React.createElement(FaBrain),
        color: 'text-amber-500',
    },
    'Engagement': {
        name: 'Engagement',
        icon: React.createElement(FaUsers),
        color: 'text-blue-500',
    },
    'Seeking Help': {
        name: 'Seeking Help',
        icon: React.createElement(FaHandsHelping),
        color: 'text-teal-500',
    },
};

const eventPhaseMapping: Record<string, EventPhase> = {
    // Awareness
    'evt-03': 'Awareness', // Unmasking Emotions (Mono Act)
    'evt-05': 'Awareness', // Pigments of Psyche (Painting)
    'evt-06': 'Awareness', // Spell of Stock (Psyk Exchange)
    'evt-08': 'Awareness', // Dreamcraft Deck (Pitch Deck)
    'evt-14': 'Awareness', // Aurora Eloquence (Elocution)
    'evt-16': 'Awareness', // Inside Out (Creative Writing)
    'evt-18': 'Awareness', // Neuro Muse (Digital Art)
    'evt-19': 'Awareness', // Framestorm (Comic Flow)
    'evt-20': 'Awareness', // Stellar Spoof (Mimicry)

    // Engagement
    'evt-01': 'Engagement', // Prism Panel (Debate)
    'evt-02': 'Engagement', // Pulse Parade (Group Dance)
    'evt-04': 'Engagement', // Roots in Reverb (Folk Dance)
    'evt-07': 'Engagement', // Chords of Confluence (Singing)
    'evt-09': 'Engagement', // Motion Mirage (Mime)
    'evt-10': 'Engagement', // Scenezone (Skit)
    'evt-11': 'Engagement', // Clash of Cadence (Dance Battle)
    'evt-12': 'Engagement', // Shadows & Light (Classical Dance)
    'evt-13': 'Engagement', // Aurora Couture (Fashion Show)
    'evt-17': 'Engagement', // Cluescape (Treasure Hunt)

    // Seeking Help
    'evt-15': 'Seeking Help', // Note to Self (Solo Singing)
};

export const getEventPhase = (eventId: string): EventPhase => {
    return eventPhaseMapping[eventId] || 'Engagement'; // Default to Engagement if not mapped
};