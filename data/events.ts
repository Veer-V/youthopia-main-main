export interface PointTransaction {
    points: number;
    reason: string;
    timestamp: number;
}

export interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    points: number;
    participants: number | string;
    prizes: {
        first: string;
        second: string;
        third: string;
    };
    registered?: boolean;
    completed?: boolean;
    completedAt?: number;
    feedback?: string;
    flyerUrl?: string;
    category?: 'M-Power' | 'Intercollegiate' | 'Other' | 'Engagement';
}

export interface SurveyResponse {
    id: string;
    timestamp: number;
    answers: Record<string, any>;
}

export interface User {
    fullName: string;
    schoolName: string;
    contact: string;
    class: string;
    stream: string;
    password?: string;
    photo: string;
    visaPoints: number;
    spinsAvailable: number;
    achievements: string[];
    active: boolean;
    events: Event[];
    pointsHistory: PointTransaction[];
    surveyResponses?: SurveyResponse[];
    teamName: string;
    dailyStreak: number;
    lastCheckInTimestamp: number;
    registrationTimestamp: number;
    onboardingCompleted?: boolean;
}

export interface AdminUser {
    username: string;
}

export interface LeaderboardEntry {
    rank: number;
    name: string;
    isCurrentUser: boolean;
}

export interface TeamLeaderboardEntry {
    rank: number;
    name: string;
    points: number;
    memberCount: number;
}


export interface FeedbackEntry {
    eventId: string;
    eventName: string;
    userName: string;
    userContact: string;
    feedback: string;
}

export interface DashboardStats {
    totalUsers: number;
    totalEvents: number;
    totalCompletedEvents: number;
    totalPointsAwarded: number;
}

export interface ReportStats {
    newUsers: number;
    eventsCompleted: number;
    pointsAwarded: number;
    dailyCheckIns: number;
    userGrowthData: { label: string; value: number }[];
    eventCompletionData: { label: string; value: number }[];
}


export interface AppNotification {
    message: string;
    type: 'success' | 'info' | 'error';
}

export const eventsData: Event[] = [
    // --- Intercollegiate Events (20) ---
    {
        id: 'evt-ic-01',
        name: 'Prism Panel (Debate)',
        description: 'Engage in a stimulating debate on mental health topics, sharpening your critical thinking skills.',
        date: 'Sat, Nov 23',
        time: '10:00 AM',
        location: 'Seminar Hall',
        points: 20,
        participants: 20,
        prizes: { first: '7k', second: '5k', third: '3k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-02',
        name: 'Pulse Parade (Group Dance)',
        description: 'Collaborate with your peers to create and perform a dance routine that expresses a story or emotion.',
        date: 'Sat, Nov 23',
        time: '12:00 PM',
        location: 'Quadrangle Stage',
        points: 25,
        participants: 20,
        prizes: { first: '15k', second: '10k', third: '7k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-03',
        name: 'Unmasking Emotions (Mono Act)',
        description: 'A solo performance event where you can explore and portray a range of human emotions.',
        date: 'Sat, Nov 23',
        time: '2:00 PM',
        location: 'Amphitheatre',
        points: 15,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-04',
        name: 'Roots in Reverb (Folk Dance)',
        description: 'Showcase the rich cultural heritage through folk dance. A vibrant and energetic event.',
        date: 'Sat, Nov 23',
        time: '4:00 PM',
        location: 'Quadrangle Stage',
        points: 20,
        participants: 20,
        prizes: { first: '20k', second: '15k', third: '10k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-05',
        name: 'Pigments of Psyche (Painting)',
        description: 'Express your inner world on canvas in this therapeutic and creative session.',
        date: 'Sat, Nov 23',
        time: 'ALL DAY',
        location: 'Art Studio',
        points: 10,
        participants: 20,
        prizes: { first: '3k', second: '2k', third: '1k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-06',
        name: 'Spell of Stock (Stock Exchange)',
        description: 'Test your financial acumen in this exciting stock exchange simulation.',
        date: 'Sun, Nov 24',
        time: '10:00 AM',
        location: 'Computer Lab',
        points: 20,
        participants: 30,
        prizes: { first: '5k', second: '3k', third: '2k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-07',
        name: 'Chords of Confluence (Singing)',
        description: 'Harmonize your voice in this group singing competition.',
        date: 'Sun, Nov 24',
        time: '11:00 AM',
        location: 'Music Room',
        points: 15,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-08',
        name: 'Dreamcraft Deck (Pitch Deck)',
        description: 'Pitch your innovative startup ideas to a panel of judges.',
        date: 'Sun, Nov 24',
        time: '2:00 PM',
        location: 'Seminar Hall 2',
        points: 25,
        participants: 15,
        prizes: { first: '10k', second: '5k', third: '3k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-09',
        name: 'Motion Mirage (Mime)',
        description: 'Tell a compelling story without words using the art of mime.',
        date: 'Sun, Nov 24',
        time: '3:00 PM',
        location: 'Amphitheatre',
        points: 15,
        participants: 10,
        prizes: { first: '5k', second: '3k', third: '2k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-10',
        name: 'Scenezone (Skit)',
        description: 'Perform a short skit that entertains and delivers a message.',
        date: 'Sun, Nov 24',
        time: '4:00 PM',
        location: 'Auditorium',
        points: 20,
        participants: 15,
        prizes: { first: '7k', second: '5k', third: '3k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-11',
        name: 'Clash of Cadence (Dance Battle)',
        description: 'Face off against other dancers in an intense dance battle.',
        date: 'Sun, Nov 24',
        time: '5:00 PM',
        location: 'Quadrangle Stage',
        points: 20,
        participants: 20,
        prizes: { first: '7k', second: '5k', third: '3k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-12',
        name: 'Shadows & Light (Classical Dance)',
        description: 'Showcase the grace and tradition of classical dance forms.',
        date: 'Sun, Nov 24',
        time: '6:00 PM',
        location: 'Main Stage',
        points: 20,
        participants: 15,
        prizes: { first: '10k', second: '7k', third: '5k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-13',
        name: 'Aurora Couture (Fashion Show)',
        description: 'Walk the ramp and showcase your style and creativity.',
        date: 'Sun, Nov 24',
        time: '7:00 PM',
        location: 'Main Stage',
        points: 25,
        participants: 20,
        prizes: { first: '15k', second: '10k', third: '5k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-14',
        name: 'Aurora Eloquence (Elocution)',
        description: 'Demonstrate your public speaking skills on a given topic.',
        date: 'Sun, Nov 24',
        time: '10:00 AM',
        location: 'Classroom 101',
        points: 15,
        participants: 20,
        prizes: { first: '3k', second: '2k', third: '1k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-15',
        name: 'Note to Self (Solo Singing)',
        description: 'Captivate the audience with your solo vocal performance.',
        date: 'Sun, Nov 24',
        time: '12:00 PM',
        location: 'Music Room',
        points: 15,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-16',
        name: 'Inkside Out (Creative Writing)',
        description: 'Unleash your imagination and write a creative piece.',
        date: 'Sun, Nov 24',
        time: '1:00 PM',
        location: 'Library',
        points: 15,
        participants: 30,
        prizes: { first: '3k', second: '2k', third: '1k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-17',
        name: 'Cluescape (Treasure Hunt)',
        description: 'Solve clues and navigate the campus to find the hidden treasure.',
        date: 'Sun, Nov 24',
        time: '11:00 AM',
        location: 'Campus Wide',
        points: 15,
        participants: 50,
        prizes: { first: '5k', second: '3k', third: '2k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-18',
        name: 'Neuro Muse (Digital Art)',
        description: 'Create stunning digital artwork using modern tools.',
        date: 'Sun, Nov 24',
        time: '2:00 PM',
        location: 'Computer Lab',
        points: 15,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-19',
        name: 'Framestorm (Comic Flow)',
        description: 'Create a comic strip that tells a humorous or impactful story.',
        date: 'Sun, Nov 24',
        time: '3:00 PM',
        location: 'Art Room',
        points: 15,
        participants: 20,
        prizes: { first: '3k', second: '2k', third: '1k' },
        category: 'Intercollegiate'
    },
    {
        id: 'evt-ic-20',
        name: 'Stellar Spoof (Mimicry)',
        description: 'Entertain the crowd with your best impressions and mimicry.',
        date: 'Sun, Nov 24',
        time: '4:00 PM',
        location: 'Seminar Hall',
        points: 15,
        participants: 15,
        prizes: { first: '3k', second: '2k', third: '1k' },
        category: 'Intercollegiate'
    },

    // --- M-Power Events (17) ---
    {
        id: 'evt-mp-01',
        name: 'Gratitude Wall',
        description: 'Express your gratitude and spread positivity by adding to our community wall.',
        date: 'Sat, Nov 23',
        time: 'ALL DAY',
        location: 'Main Corridor',
        points: 10,
        participants: 'Open',
        prizes: { first: 'Gift Hamper', second: 'Voucher', third: 'Certificate' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-02',
        name: 'Mental Health Quiz',
        description: 'Test your knowledge about mental health and wellness in this interactive quiz.',
        date: 'Sat, Nov 23',
        time: '10:00 AM',
        location: 'Seminar Hall 1',
        points: 15,
        participants: 50,
        prizes: { first: '2k', second: '1k', third: '500' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-03',
        name: 'Memory Word Recall',
        description: 'Challenge your memory and cognitive skills in this fun word recall game.',
        date: 'Sat, Nov 23',
        time: '11:00 AM',
        location: 'Classroom 101',
        points: 15,
        participants: 30,
        prizes: { first: '1.5k', second: '1k', third: '500' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-04',
        name: 'Thinking Outside the Box',
        description: 'Solve creative puzzles and riddles that require lateral thinking.',
        date: 'Sat, Nov 23',
        time: '12:00 PM',
        location: 'Innovation Lab',
        points: 20,
        participants: 30,
        prizes: { first: '2k', second: '1.5k', third: '1k' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-05',
        name: 'Movie Screening',
        description: 'Relax and enjoy a screening of a thought-provoking movie related to mental health.',
        date: 'Sat, Nov 23',
        time: '2:00 PM',
        location: 'Auditorium',
        points: 10,
        participants: 100,
        prizes: { first: '-', second: '-', third: '-' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-06',
        name: 'Wall Painting',
        description: 'Collaborate to create a beautiful mural that represents hope and resilience.',
        date: 'Sat, Nov 23',
        time: 'ALL DAY',
        location: 'Campus Wall',
        points: 25,
        participants: 20,
        prizes: { first: '5k', second: '3k', third: '2k' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-07',
        name: 'Mental Health Score Check',
        description: 'Take a quick assessment to understand your current mental well-being.',
        date: 'Sat, Nov 23',
        time: 'ALL DAY',
        location: 'Wellness Booth',
        points: 10,
        participants: 'Open',
        prizes: { first: '-', second: '-', third: '-' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-08',
        name: 'Spin the Wheel',
        description: 'Spin the wheel to win exciting prizes and learn quick wellness tips.',
        date: 'Sat, Nov 23',
        time: 'ALL DAY',
        location: 'Central Plaza',
        points: 5,
        participants: 'Open',
        prizes: { first: 'Surprise Gift', second: 'Merch', third: 'Sticker' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-09',
        name: 'Stroop Effect',
        description: 'Experience the Stroop effect and learn about cognitive processing speed.',
        date: 'Sat, Nov 23',
        time: '1:00 PM',
        location: 'Psychology Lab',
        points: 15,
        participants: 40,
        prizes: { first: '1k', second: '750', third: '500' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-10',
        name: "Trash the Can'ts",
        description: 'Write down your self-doubts and physically trash them in this symbolic activity.',
        date: 'Sat, Nov 23',
        time: 'ALL DAY',
        location: 'Courtyard',
        points: 10,
        participants: 'Open',
        prizes: { first: '-', second: '-', third: '-' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-11',
        name: 'Six Thinking Hats',
        description: 'Learn to look at problems from different perspectives using De Bono\'s method.',
        date: 'Sat, Nov 23',
        time: '3:00 PM',
        location: 'Seminar Hall 2',
        points: 20,
        participants: 25,
        prizes: { first: '2k', second: '1.5k', third: '1k' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-12',
        name: 'Know Your Community (KYC)',
        description: 'An interactive session to understand personality types and human behavior.',
        date: 'Sat, Nov 23',
        time: '4:00 PM',
        location: 'Classroom 102',
        points: 15,
        participants: 30,
        prizes: { first: '1.5k', second: '1k', third: '500' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-13',
        name: 'Joy of Journaling',
        description: 'Discover the therapeutic benefits of journaling and decorate your own journal.',
        date: 'Sat, Nov 23',
        time: '11:00 AM',
        location: 'Art Room',
        points: 20,
        participants: 20,
        prizes: { first: 'Premium Journal', second: 'Pen Set', third: 'Stationery' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-14',
        name: 'Art Therapy / Mind Mania',
        description: 'Express yourself through art and engage in mind-stimulating games.',
        date: 'Sat, Nov 23',
        time: '1:00 PM',
        location: 'Art Studio',
        points: 20,
        participants: 25,
        prizes: { first: 'Art Kit', second: 'Sketchbook', third: 'Paints' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-15',
        name: 'Dance Therapy',
        description: 'Move your body and release stress in this guided dance therapy session.',
        date: 'Sat, Nov 23',
        time: '5:00 PM',
        location: 'Dance Studio',
        points: 20,
        participants: 30,
        prizes: { first: '-', second: '-', third: '-' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-16',
        name: 'Well-Being Kit',
        description: 'Assemble your own personalized well-being kit with essential self-care items.',
        date: 'Sat, Nov 23',
        time: 'ALL DAY',
        location: 'Wellness Booth',
        points: 15,
        participants: 50,
        prizes: { first: '-', second: '-', third: '-' },
        category: 'M-Power'
    },
    {
        id: 'evt-mp-17',
        name: 'Seeking Help',
        description: 'Learn about available mental health resources and how to seek help when needed.',
        date: 'Sat, Nov 23',
        time: 'ALL DAY',
        location: 'Info Desk',
        points: 10,
        participants: 'Open',
        prizes: { first: '-', second: '-', third: '-' },
        category: 'M-Power'
    }
];

export const getInitialEvents = (): Event[] => {
    return eventsData;
};

