import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import youthopiaLogo from '../assets/youthopia-logo.png';

// --- Reusable SVG Icon Components ---

// --- MORE ACCURATE M POWER LOGO ---
const MPowerLogo = ({ color = '#0033A1' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
        {/* The open circle part (arc) */}
        <path d="M 95 55 A 45 45 0 1 1 5 55" stroke={color} strokeWidth="8" fill="none" />

        {/* Main 'M' shape - refined for accuracy */}
        <path d="M 22 75 L 38 40 L 50 55 L 62 40 L 78 75" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* The handshake icon - redrawn for more detail */}
        <g stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 2)">
            {/* Left hand */}
            <path d="M 48 35 L 35 22" />
            <path d="M 48 35 C 42 38, 40 38, 38 32" />
            {/* Right hand */}
            <path d="M 52 35 L 65 22" />
            <path d="M 52 35 C 58 38, 60 38, 62 32" />
        </g>
    </svg>
);


const PersonIcon = ({ color = '#0033A1' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} className="w-full h-full">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

const PaintbrushIcon = ({ color = '#E50081' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} className="w-full h-full">
        <path d="M14.16 2.53a1 1 0 00-1.41.05L5.71 10H4a1 1 0 00-1 1v4a1 1 0 001 1h1.71l-1.42 1.41a1 1 0 000 1.42A1 1 0 005 19h1.36l-1.1 1.1a1 1 0 001.42 1.42L18.09 9.9a1 1 0 00.05-1.41L14.16 2.53zM15 15.5c-1.12 1.12-2.88 1.12-4 0s-1.12-2.88 0-4c1.12-1.12 2.88-1.12 4 0s1.12 2.88 0 4z" />
        <path d="M20.71 2.29a1 1 0 00-1.42 0l-2.42 2.42a1 1 0 000 1.42 1 1 0 001.42 0l2.42-2.42a1 1 0 000-1.42z" />
    </svg>
);

const SpinningWheelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <g>
            <path d="M50 50 L50 5 A45 45 0 0 1 81.8 18.2 Z" fill="#E50081" stroke="#4a4a4a" strokeWidth="1.5" />
            <path d="M50 50 L81.8 18.2 A45 45 0 0 1 95 50 Z" fill="#FFC107" stroke="#4a4a4a" strokeWidth="1.5" />
            <path d="M50 50 L95 50 A45 45 0 0 1 81.8 81.8 Z" fill="#00AEEF" stroke="#4a4a4a" strokeWidth="1.5" />
            <path d="M50 50 L81.8 81.8 A45 45 0 0 1 50 95 Z" fill="#F26522" stroke="#4a4a4a" strokeWidth="1.5" />
            <path d="M50 50 L50 95 A45 45 0 0 1 18.2 81.8 Z" fill="#0033A1" stroke="#4a4a4a" strokeWidth="1.5" />
            <path d="M50 50 L18.2 81.8 A45 45 0 0 1 5 50 Z" fill="#E50081" stroke="#4a4a4a" strokeWidth="1.5" />
            <path d="M50 50 L5 50 A45 45 0 0 1 18.2 18.2 Z" fill="#FFC107" stroke="#4a4a4a" strokeWidth="1.5" />
            <path d="M50 50 L18.2 18.2 A45 45 0 0 1 50 5 Z" fill="#00AEEF" stroke="#4a4a4a" strokeWidth="1.5" />
        </g>
        <circle cx="50" cy="50" r="12" fill="white" stroke="#333" strokeWidth="2" />
        <circle cx="50" cy="50" r="6" fill="#333" />
    </svg>
);

const PointerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 20 L60 0 L40 0 Z" fill="#c0392b" stroke="#333" strokeWidth="1.5" />
    </svg>
);


const MicrophoneIcon = ({ color = '#F26522' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} className="w-full h-full">
        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
);

const GuitarIcon = ({ color = '#0033A1' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} className="w-full h-full">
        <path d="M12 0c-2.76 0-5 2.24-5 5v12c0 2.76 2.24 5 5 5s5-2.24 5-5V5c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v2h-6V5c0-1.66 1.34-3 3-3zm0 18c-1.66 0-3-1.34-3-3v-4h6v4c0 1.66-1.34 3-3 3zM4 5h2v12H4c-1.1 0-2 .9-2 2v2h20v-2c0-1.1-.9-2-2-2h-2V5h2c1.1 0 2-.9 2-2V1h-4v2c0 1.1-.9 2-2 2z" />
    </svg>
);

interface ConfettiParticleProps {
    color: string;
}

const ConfettiParticle: React.FC<ConfettiParticleProps> = ({ color }) => {
    const x = (Math.random() - 0.5) * window.innerWidth * 1.2;
    const y = (Math.random() - 0.5) * window.innerHeight * 1.2;
    const rotate = Math.random() * 360;
    const width = Math.random() * 10 + 5;
    const height = Math.random() * 10 + 5;
    const duration = Math.random() * 2 + 1.5;
    const isCircle = Math.random() > 0.5;

    return (
        <motion.div
            className="absolute"
            style={{ backgroundColor: color, width, height, borderRadius: isCircle ? '50%' : '3px' }}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
            animate={{
                opacity: 0,
                x,
                y,
                rotate: rotate + (Math.random() > 0.5 ? 180 : -180),
                scale: 0.2,
            }}
            transition={{ duration, ease: "easeOut" }}
        />
    );
};


const SplashScreen: React.FC = () => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(true), 4500);
        return () => clearTimeout(timer);
    }, []);

    const colors = {
        primaryBlue: '#0033A1', darkText: '#333333', youthopiaPink: '#E50081',
        youthopiaLightBlue: '#00AEEF', youthopiaOrange: '#F26522', taglineYellow: '#FFC107',
    };

    const youthopiaText = "YOUTHOPIA".split('');

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
    };

    const textLetterVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 300 } },
    };

    const mPowerContainerVariants: Variants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 12, stiffness: 100, delay: 1.2 } },
    };

    const youthopiaLetterVariants: Variants = {
        hidden: (i) => ({ opacity: 0, x: (i - 4.5) * 40, y: 80, rotate: (i - 4.5) * 10 }),
        visible: (i) => ({ opacity: 1, x: 0, y: 0, rotate: 0, transition: { type: 'spring', damping: 12, stiffness: 100, delay: 1.8 + i * 0.1 } }),
    };

    const wheelLetterVariants: Variants = {
        hidden: { opacity: 0, y: 100, scale: 0.3 },
        visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 12, stiffness: 80, delay: 1.8 + i * 0.1 } }),
    };

    const iconVariants: Variants = {
        hidden: { opacity: 0, scale: 0.5, y: 50 },
        visible: (delay) => ({ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 8, stiffness: 150, delay: delay + 2.8 } }),
    };

    const taglineBoxVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { delay: 3.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    };

    // New variant for the main content block's floating animation
    const floatingVariants: Variants = {
        float: {
            y: [0, -10, 0],
            transition: {
                duration: 5,
                ease: 'easeInOut',
                repeat: Infinity,
            },
        },
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-screen w-full bg-slate-50 text-gray-800 font-sans p-4 overflow-hidden">
            <motion.div className="absolute inset-0 z-0" animate={{ background: ["radial-gradient(circle at 10% 20%, #e0f7fa 0%, #ffffff 90%)", "radial-gradient(circle at 80% 90%, #fffde7 0%, #ffffff 90%)", "radial-gradient(circle at 50% 50%, #fce4ec 0%, #ffffff 90%)", "radial-gradient(circle at 10% 20%, #e0f7fa 0%, #ffffff 90%)",], }} transition={{ duration: 20, ease: "linear", repeat: Infinity, }} />

            <motion.div
                className="relative flex flex-col items-center justify-center w-full max-w-lg md:max-w-4xl text-center z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {showConfetti && (Object.values(colors).flatMap(color => Array.from({ length: 10 }).map((_, i) => <ConfettiParticle key={`${color}-${i}`} color={color} />)))}
                </AnimatePresence>

                <motion.h3
                    className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 tracking-wide uppercase"
                    style={{ color: colors.darkText }}
                    variants={textLetterVariants}
                >
                    WELCOME TO
                </motion.h3>

                {/* Main content block with floating animation */}
                <motion.div className="flex flex-col items-center" variants={floatingVariants} animate="float">
                    <motion.div
                        className="flex flex-col items-center justify-center mb-6 sm:mb-8 md:mb-10"
                        variants={mPowerContainerVariants}
                    >
                        <img
                            src={youthopiaLogo}
                            alt="Youthopia Event Logo"
                            className="w-full max-w-xs sm:max-w-md md:max-w-lg drop-shadow-lg"
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default function App() {
    return <SplashScreen />;
}

