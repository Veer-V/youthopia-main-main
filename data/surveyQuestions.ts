export interface SurveyQuestion {
    id: string;
    text: string;
    type: 'single' | 'multi' | 'grid';
    options?: string[];
    gridRows?: string[]; // For grid type: the rows (e.g., Indian celebrities, Western celebrities)
    gridCols?: string[]; // For grid type: the columns (e.g., Never, Rarely...)
    category: string;
}

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
    // --- Social Media Usage ---
    {
        id: 'q1',
        category: 'Social Media Usage',
        text: 'On average, how many hours per day do you spend on social media?',
        type: 'single',
        options: ['Less than 1 hour', '1-2 hours', '3-4 hours', '5-6 hours', 'More than 6 hours']
    },
    {
        id: 'q2',
        category: 'Social Media Usage',
        text: 'How often do you compare yourself to others based on what you see on social media?',
        type: 'single',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
        id: 'q3',
        category: 'Social Media Usage',
        text: 'After spending time on social media, how do you typically feel about yourself?',
        type: 'single',
        options: ['Much more positive', 'Slightly more positive', 'No change', 'Slightly more negative', 'Much more negative']
    },
    {
        id: 'q4',
        category: 'Social Media Usage',
        text: 'In the past 6 months, has social media made you feel any of the following?',
        type: 'multi',
        options: [
            'More confident about myself',
            'Anxious about my appearance',
            'Left out or excluded',
            'Pressure to present a perfect image',
            'Inspired or motivated',
            'Inadequate compared to others',
            'Connected to friends/community',
            'None of the above'
        ]
    },

    // --- Rumination & Victim Identity ---
    {
        id: 'q5',
        category: 'Rumination & Victim Identity',
        text: 'How often do you find yourself replaying past negative experiences in your mind?',
        type: 'single',
        options: ['Never or rarely', 'Sometimes (1-2 times/week)', 'Often (3-5 times/week)', 'Very often (almost daily)', 'Constantly']
    },
    {
        id: 'q6',
        category: 'Rumination & Victim Identity',
        text: 'When you think about difficult situations from your past, do you:',
        type: 'single',
        options: [
            'Actively try to understand and move forward',
            'Think about them occasionally but don\'t dwell',
            'Find it difficult to stop thinking about them',
            'Feel stuck reliving the same thoughts',
            'Intentionally revisit them to process feelings'
        ]
    },
    {
        id: 'q7',
        category: 'Rumination & Victim Identity',
        text: 'Which statement best describes how you relate to your past negative experiences?',
        type: 'single',
        options: [
            'They are part of my history but don\'t define me',
            'I have learned from them and moved on',
            'I think about them regularly and they influence my identity',
            'They are central to understanding who I am',
            'I actively work to not let them define me'
        ]
    },
    {
        id: 'q8',
        category: 'Rumination & Victim Identity',
        text: 'In the past month, have you repeatedly thought about negative experiences affecting any of the following?',
        type: 'multi',
        options: [
            'Academic performance',
            'Relationships',
            'Mood/Emotional well-being',
            'Ability to trust',
            'Self-confidence',
            'Physical health',
            'Sense of control',
            'None of the above'
        ]
    },

    // --- Body Image ---
    {
        id: 'q9',
        category: 'Body Image',
        text: 'On average, how many hours per day do you spend viewing beauty/fashion/fitness content?',
        type: 'single',
        options: ['<30 mins', '30m-1hr', '1-2 hrs', '3-4 hrs', '>4 hrs']
    },
    {
        id: 'q10',
        category: 'Body Image',
        text: 'Which beauty standards do you feel most pressured by?',
        type: 'multi',
        options: [
            'Fair skin',
            'Slim body',
            'Western features',
            'Traditional Indian ideals',
            'Influencer aesthetics',
            'Perfect skin',
            'Specific measurements',
            'None'
        ]
    },
    {
        id: 'q11',
        category: 'Body Image',
        text: 'How often do you compare your appearance to:',
        type: 'grid',
        gridRows: ['Indian celebrities', 'Western celebrities', 'Friends/Peers'],
        gridCols: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
        id: 'q12',
        category: 'Body Image',
        text: 'In the past 6 months, has beauty content made you feel:',
        type: 'multi',
        options: [
            'Anxious about looks',
            'Motivated to improve',
            'Ashamed of body',
            'Pressure to use products',
            'Desire to edit photos',
            'Inadequate',
            'Inspired/Confident',
            'No impact'
        ]
    },

    // --- Toxic Relationships ---
    {
        id: 'q13',
        category: 'Toxic Relationships',
        text: 'How have toxic relationships affected your mental health?',
        type: 'multi',
        options: [
            'Anxiety',
            'Depression',
            'Low self-esteem',
            'Difficulty trusting',
            'PTSD symptoms',
            'Sleep issues',
            'Self-harm thoughts',
            'Eating disorders',
            'Substance use',
            'Physical symptoms',
            'Difficulty setting boundaries',
            'People-pleasing',
            'No impact'
        ]
    },
    {
        id: 'q14',
        category: 'Toxic Relationships',
        text: 'How would you rate your current self-esteem in the context of your toxic relationship experiences?',
        type: 'single',
        options: ['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent']
    },
    {
        id: 'q15',
        category: 'Toxic Relationships',
        text: 'What factors have made it harder to leave toxic relationships?',
        type: 'multi',
        options: [
            'Financial dependence',
            'Fear of retaliation',
            'Cultural expectations',
            'Family pressure',
            'Love/Hope for change',
            'Low self-worth',
            'Didn\'t recognize toxicity',
            'Lack of support',
            'Shared living/children',
            'Identity factors',
            'Mental health challenges',
            'Disability',
            'Immigration status',
            'Not applicable'
        ]
    }
];
