import * as React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SurveyModal from './SurveyModal';
import confetti from 'canvas-confetti';
import { FiAlertCircle } from 'react-icons/fi';

const SEGMENTS = [
    { value: 25, color: '#EF4444' }, // Red
    { value: 5, color: '#3B82F6' },  // Blue
    { value: 10, color: '#8B5CF6' }, // Purple
    { value: 2, color: '#EC4899' },  // Pink
    { value: 20, color: '#F59E0B' }, // Orange
    { value: 5, color: '#6366F1' },  // Indigo/Blue
    { value: 15, color: '#10B981' }, // Green
    { value: 2, color: '#F472B6' },  // Light Pink
];

const SpinWheelPage: React.FC = () => {
    const { user, useSpin, addPoints } = useAuth();
    const [isSpinning, setIsSpinning] = React.useState(false);
    const [showSurvey, setShowSurvey] = React.useState(false);
    const [prize, setPrize] = React.useState(0);
    const controls = useAnimation();
    const wheelRef = React.useRef<HTMLDivElement>(null);

    const handleSpin = async () => {
        if (isSpinning || !user || user.spinsAvailable <= 0) return;

        useSpin(); // Deduct spin immediately
        setIsSpinning(true);

        // Calculate random rotation
        // We want to land on a random segment.
        // Each segment is 45 degrees.
        // To land on index i, we need to rotate to: 360 * spins + (360 - (i * 45 + 22.5))
        // Let's just pick a random total degree.
        const randomDegree = Math.floor(Math.random() * 360);
        const totalRotation = 360 * 5 + randomDegree; // 5 full spins + random

        await controls.start({
            rotate: totalRotation,
            transition: { duration: 4, ease: "circOut" }
        });

        // Calculate prize
        // The pointer is at the top (0 degrees).
        // The wheel rotates clockwise.
        // The segment at the top is determined by: (360 - (finalRotation % 360)) % 360
        const normalizedRotation = totalRotation % 360;
        const pointerAngle = (360 - normalizedRotation) % 360;
        const segmentIndex = Math.floor(pointerAngle / 45);
        const wonSegment = SEGMENTS[segmentIndex];

        setPrize(wonSegment.value);

        // Small delay before showing modal
        setTimeout(() => {
            setIsSpinning(false);
            setShowSurvey(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }, 500);
    };

    const handleSurveyComplete = (answers: Record<string, any>) => {
        // Here you would typically send the answers to a backend
        console.log('Survey Answers:', answers);

        addPoints(prize, 'Spin & Win Reward');
        setShowSurvey(false);

        // Show success confetti
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500']
        });
    };

    return (
        <div className="min-h-screen bg-brand-bg dark:bg-brand-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="z-10 text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary mb-2">
                    Spin & Win!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Spin the wheel to win points for your Visa Passport.
                </p>
                {user && (
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
                        <span className="font-bold text-brand-primary mr-2">{user.spinsAvailable}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Spins Available</span>
                    </div>
                )}
            </div>

            <div className="relative w-80 h-80 md:w-96 md:h-96">
                {/* Pointer */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-8 h-12">
                    <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[32px] border-t-yellow-400 drop-shadow-lg" />
                </div>

                {/* Wheel Container */}
                <motion.div
                    className="w-full h-full rounded-full shadow-2xl border-4 border-white dark:border-gray-700 relative overflow-hidden"
                    animate={controls}
                    style={{ rotate: 0 }}
                >
                    {/* Segments */}
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {SEGMENTS.map((segment, i) => {
                            // Calculate path for 45 degree slice
                            // A slice from angle A to B
                            const startAngle = i * 45;
                            const endAngle = (i + 1) * 45;

                            // Convert to radians
                            const startRad = (startAngle * Math.PI) / 180;
                            const endRad = (endAngle * Math.PI) / 180;

                            // Calculate coordinates
                            const x1 = 50 + 50 * Math.cos(startRad);
                            const y1 = 50 + 50 * Math.sin(startRad);
                            const x2 = 50 + 50 * Math.cos(endRad);
                            const y2 = 50 + 50 * Math.sin(endRad);

                            // SVG Path command
                            const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                            // Text position (midpoint)
                            const midAngle = startAngle + 22.5;
                            const midRad = (midAngle * Math.PI) / 180;
                            const tx = 50 + 32 * Math.cos(midRad);
                            const ty = 50 + 32 * Math.sin(midRad);

                            return (
                                <g key={i}>
                                    <path d={d} fill={segment.color} stroke="white" strokeWidth="0.5" />
                                    <text
                                        x={tx}
                                        y={ty}
                                        fill="white"
                                        fontSize="8"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                                    >
                                        {segment.value}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Center Hub */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-inner flex items-center justify-center z-10">
                        <div className="w-8 h-8 bg-brand-primary rounded-full border-4 border-white shadow-sm" />
                    </div>
                </motion.div>
            </div>

            <div className="mt-12">
                <button
                    onClick={handleSpin}
                    disabled={isSpinning || !user || user.spinsAvailable <= 0}
                    className={`px-12 py-4 rounded-full text-xl font-bold text-white shadow-xl transition-all transform active:scale-95 ${isSpinning || !user || user.spinsAvailable <= 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-2xl hover:-translate-y-1'
                        }`}
                >
                    {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                </button>
                {user && user.spinsAvailable <= 0 && (
                    <p className="mt-4 text-red-500 flex items-center justify-center">
                        <span className="mr-2"><FiAlertCircle /></span>
                        No spins left! Complete more events to earn spins.
                    </p>
                )}
            </div>

            <SurveyModal
                isOpen={showSurvey}
                onClose={() => setShowSurvey(false)} // Optional: warn user they will lose prize?
                onComplete={handleSurveyComplete}
                pointsToClaim={prize}
            />
        </div>
    );
};

export default SpinWheelPage;
