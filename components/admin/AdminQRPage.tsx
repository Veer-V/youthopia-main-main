import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { FaQrcode } from 'react-icons/fa';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

// A simple, static SVG to represent a QR code
const MockQRCode: React.FC<{ value: string }> = ({ value }) => (
    <svg width="200" height="200" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="bg-white p-2 rounded-lg shadow-md">
        <path fill="#333" d="M0 0h50v50H0z"/>
        <path fill="#fff" d="M7 7h9v9H7zm27 0h9v9h-9zM7 34h9v9H7z"/>
        <path fill="#fff" d="M10 10h3v3h-3zm27 0h3v3h-3zM10 37h3v3h-3z"/>
        <text x="25" y="28" fontSize="2" fill="#fff" textAnchor="middle" fontFamily="monospace">{value.slice(-12)}</text>
    </svg>
);

type ValidationResult = {
    status: 'idle' | 'success' | 'error';
    message: string;
    data?: string;
}

const AdminQRPage: React.FC = () => {
    const { getMasterEvents } = useAuth();
    const [events] = useState(getMasterEvents());
    const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
    const [customData, setCustomData] = useState('');
    const [validationInput, setValidationInput] = useState('');
    const [validationResult, setValidationResult] = useState<ValidationResult>({ status: 'idle', message: '' });
    const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

    const generatedCode = useMemo(() => {
        if (!selectedEventId) return '';
        const base = `YOUTHOPIA-COMPLETE-${selectedEventId}`;
        if (customData.trim()) {
            return `${base}|DATA:${customData.trim()}`;
        }
        return base;
    }, [selectedEventId, customData]);
    
    const handleCopyCode = async () => {
        if (!generatedCode) return;
        try {
            await navigator.clipboard.writeText(generatedCode);
            setCopyStatus('copied');
        } catch {
            setCopyStatus('error');
        } finally {
            setTimeout(() => setCopyStatus('idle'), 2000);
        }
    };
    
    const handleValidation = () => {
        const parts = validationInput.split('|DATA:');
        const mainPart = parts[0];
        const customDataPayload = parts.length > 1 ? parts[1] : undefined;

        if (!mainPart.startsWith('YOUTHOPIA-COMPLETE-')) {
            setValidationResult({ status: 'error', message: 'Invalid code format.' });
            setTimeout(() => setValidationResult({ status: 'idle', message: '' }), 3000);
            return;
        }

        const eventId = mainPart.replace('YOUTHOPIA-COMPLETE-', '');
        const event = events.find(e => e.id === eventId);

        if (event) {
            setValidationResult({ 
                status: 'success', 
                message: `Valid for: ${event.name}`, 
                data: customDataPayload 
            });
            setSelectedEventId(event.id); // Sync dropdown
            setCustomData(''); // Clear custom data on successful validation
            setHighlightedEventId(event.id); // Trigger highlight
            setTimeout(() => setHighlightedEventId(null), 1500); // Remove highlight
        } else {
            setValidationResult({ status: 'error', message: 'Invalid event ID in code.' });
        }
        setTimeout(() => setValidationResult({ status: 'idle', message: '' }), 4000);
    };

    return (
        <motion.div
            className="p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">QR Code Tools</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Generator */}
                <motion.div 
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                    animate={highlightedEventId ? {
                        boxShadow: [
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)", // Default shadow
                            "0 0 15px 5px rgba(20, 184, 166, 0.6)", // Teal glow
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"  // Back to default
                        ]
                    } : {}}
                    transition={highlightedEventId ? { duration: 1.5, ease: "easeInOut" } : {}}
                >
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                       <span className="text-brand-teal"><FaQrcode /></span>
Event QR Code Generator
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Select Event</label>
                            <select
                                id="event-select"
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            >
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>{event.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                             <label htmlFor="custom-data" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Custom Data (Optional)</label>
                             <input
                                type="text"
                                id="custom-data"
                                placeholder="e.g., Student ID, Session No."
                                value={customData}
                                onChange={(e) => setCustomData(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                        </div>
                        {selectedEventId && (
                            <motion.div 
                                key={generatedCode}
                                className="text-center flex flex-col items-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <MockQRCode value={generatedCode} />
                                <p className="mt-2 text-xs text-gray-500 font-mono break-all">{generatedCode}</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Validator */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                     <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Code Validator</h2>
                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter a code from a student's device to manually validate their event completion.</p>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Enter validation code..."
                            value={validationInput}
                            onChange={(e) => setValidationInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleValidation();
                                }
                            }}
                            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                         <motion.button
                            onClick={handleValidation}
                            className="bg-brand-dark-blue text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Validate
                        </motion.button>
                     </div>
                     <div className="h-20 mt-4">
                        <AnimatePresence mode="wait">
                            {validationResult.status === 'success' && (
                                <motion.div 
                                    key="success"
                                    className="p-3 bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200 rounded-lg"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type: 'spring', stiffness: 300, damping: 15, delay: 0.1}}>
                                           <span className="text-brand-teal"><FiCheckCircle /></span>
                                        </motion.div>
                                        <div>
                                            <p className="font-semibold text-base md:text-lg">{validationResult.message}</p>
                                            {validationResult.data && (
                                                <p className="text-sm mt-1">
                                                    Custom Data: <span className="font-mono bg-green-200 dark:bg-green-900/50 px-1 rounded">{validationResult.data}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            {validationResult.status === 'error' && (
                                <motion.div 
                                    key="error"
                                    className="flex items-center gap-3 p-3 bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-200 rounded-lg"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <span className="text-brand-teal"><FiXCircle /></span>
                                    <p className="font-semibold text-base md:text-lg">{validationResult.message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                     </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminQRPage;
