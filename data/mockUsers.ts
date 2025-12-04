/**
 * NOTE: This file is for demonstration and testing purposes.
 * The live application state is managed through AuthContext and localStorage.
 * The User interface is defined in contexts/AuthContext.tsx.
 */

export const mockUsers = [
  {
    fullName: 'Priya Sharma',
    contact: '9876543210',
    class: 'SYBSc',
    stream: 'IT',
    password: 'password123',
    photo: 'https://i.pravatar.cc/150?u=9876543210',
    visaPoints: 75,
    spinsAvailable: 2,
    achievements: ['first-step', 'event-explorer'],
    active: true,
    events: [], // In a real scenario, this would be populated with user-specific event progress
    pointsHistory: [
      { points: 5, reason: 'Welcome Bonus!', timestamp: Date.now() },
      { points: 5, reason: 'Registered for Prism Panel (Debate)', timestamp: Date.now() },
      { points: 25, reason: 'Completed: Prism Panel (Debate) (+5 Bonus)', timestamp: Date.now() },
    ],
    teamName: 'Innovators',
  },
  {
    fullName: 'Rohan Verma',
    contact: '9876543211',
    class: 'TYBCom',
    stream: 'Accounts',
    password: 'password123',
    photo: 'https://i.pravatar.cc/150?u=9876543211',
    visaPoints: 40,
    spinsAvailable: 0,
    achievements: ['first-step'],
    active: true,
    events: [],
    pointsHistory: [
      { points: 5, reason: 'Welcome Bonus!', timestamp: Date.now() },
      { points: 10, reason: 'Spin Wheel Prize', timestamp: Date.now() },
    ],
    teamName: 'Creators',
  },
  {
    fullName: 'Anjali Singh',
    contact: '9876543212',
    class: 'FYBSc',
    stream: 'CS',
    password: 'password123',
    photo: 'https://i.pravatar.cc/150?u=9876543212',
    visaPoints: 120,
    spinsAvailable: 5,
    achievements: ['first-step', 'event-explorer', 'points-hoarder'],
    active: false, // Example of an inactive user
    events: [],
    pointsHistory: [
      { points: 5, reason: 'Welcome Bonus!', timestamp: Date.now() },
      { points: 25, reason: 'Achievement: Event Explorer', timestamp: Date.now() },
      { points: 25, reason: 'Achievement: Points Hoarder', timestamp: Date.now() },
    ],
    teamName: 'Pioneers',
  },
];
