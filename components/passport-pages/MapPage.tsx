import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import { eventsData } from '../../data/events.ts';
import SkeletonLoader from '../SkeletonLoader.tsx';

const tooltipVariants = {
    rest: { opacity: 0, y: 5, scale: 0.9, transition: { duration: 0.2 }, pointerEvents: 'none' },
    hover: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 }, pointerEvents: 'auto' },
};

const MapPageSkeleton: React.FC = () => (
    <motion.div
        className="w-full h-full bg-white p-4 md:p-6 rounded-lg shadow-inner flex flex-col overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <SkeletonLoader className="h-8 w-1/3 rounded-md mb-4" />
        <div className="flex-grow bg-gray-100 rounded-lg flex items-center justify-center p-2 overflow-hidden">
            <SkeletonLoader className="h-full w-full rounded-md" />
        </div>
    </motion.div>
);

const VenuePin: React.FC<{ x: number; y: number; name: string; }> = ({ x, y, name }) => {
    const venueEvents = eventsData.filter(event => event.location === name);
    
    return (
    <motion.g 
        transform={`translate(${x}, ${y})`}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="cursor-pointer"
    >
        <motion.circle 
            r="6" 
            fill="#FFC759" 
            stroke="#0A2A4E" 
            strokeWidth="2"
            variants={{
                rest: { scale: 1 },
                hover: { scale: 1.3 }
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        />
        <motion.g 
            className="pointer-events-none"
            variants={tooltipVariants}
            style={{ x: -60, y: -25 - (venueEvents.length * 12) }}
        >
            <rect x="0" y="0" width="120" height={20 + (venueEvents.length * 12)} rx="4" fill="#0A2A4E" />
            <text x="60" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">{name}</text>
            {venueEvents.map((event, index) => (
                 <text key={event.id} x="60" y={28 + (index * 12)} textAnchor="middle" fontSize="9" fill="#E1C16E">{event.name}</text>
            ))}
            <path d="M57 21 L60 25 L63 21" fill="#0A2A4E" transform={`translate(0, ${-21 + (20 + (venueEvents.length * 12))})`}/>
        </motion.g>
    </motion.g>
);
}


const MapPage: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500); // Simulate loading
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <MapPageSkeleton />;
    }

    return (
    <motion.div
        className="w-full h-full bg-white p-4 md:p-6 rounded-lg shadow-inner flex flex-col overflow-hidden min-h-[460px]"
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        animate="visible"
        exit="hidden"
    >
        <motion.h3 variants={itemSpringUp} className="text-xl md:text-2xl font-bold text-brand-passport-primary mb-4 border-b-2 border-brand-passport-subtle pb-2">Campus Map</motion.h3>
        <motion.div variants={itemSpringUp} className="flex-grow bg-gray-100 rounded-lg flex items-center justify-center p-2 overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 400 300" className="max-w-full max-h-full">
                {/* Background & Buildings */}
                <rect width="400" height="300" fill="#F3F4F6" />
                <rect x="20" y="50" width="120" height="200" fill="#A1B9C5" rx="5" />
                <text x="80" y="155" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="12">Main Building</text>
                
                <rect x="260" y="20" width="120" height="100" fill="#A1B9C5" rx="5" />
                <text x="320" y="75" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="12">Auditorium</text>

                <rect x="260" y="180" width="120" height="100" fill="#A1B9C5" rx="5" />
                <text x="320" y="235" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="12">Sports Complex</text>

                {/* Paths */}
                <path d="M145 150 H 255" stroke="#0A2A4E" strokeWidth="3" strokeDasharray="5,5" />
                <path d="M200 70 V 230" stroke="#0A2A4E" strokeWidth="3" strokeDasharray="5,5" />

                {/* Venue Pins */}
                <VenuePin x={150} y={40} name="Seminar Hall" />
                <VenuePin x={250} y={150} name="Quadrangle Stage" />
                <VenuePin x={100} y={260} name="Amphitheatre" />
                <VenuePin x={320} y={85} name="Main Auditorium" />
                <VenuePin x={50} y={80} name="Art Studio" />
                <VenuePin x={50} y={220} name="Library Wing" />
                 <VenuePin x={320} y={200} name="Digital Lab" />
            </svg>
        </motion.div>
    </motion.div>
    )
};

export default MapPage;