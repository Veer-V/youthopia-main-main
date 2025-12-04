import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, itemSpringUp } from '../../utils/animations.ts';
import { phaseDetails, EventPhase } from '../../utils/eventCategorization.ts';
import { guidanceContent } from '../../data/guidance.ts';
import { FiChevronDown } from 'react-icons/fi';


const AccordionSection: React.FC<{
    phase: EventPhase;
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ phase, isExpanded, onToggle }) => {
    const { icon, color, name } = phaseDetails[phase];
    const content = guidanceContent[phase];

    return (
        <motion.div variants={itemSpringUp} className="border border-brand-passport-subtle/30 dark:border-gray-600/50 rounded-lg overflow-hidden">
            <button
                onClick={onToggle}
                className={`w-full flex justify-between items-center p-3 text-left transition-colors ${isExpanded ? 'bg-brand-passport-accent/20 dark:bg-brand-passport-accent/10' : 'bg-white/80 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                aria-expanded={isExpanded}
            >
                <div className="flex items-center gap-3">
                    <span className={color}>{icon}</span>
                    <span className="font-bold text-brand-passport-primary dark:text-gray-200">{name}</span>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <span className="text-brand-passport-primary dark:text-gray-300"><FiChevronDown /></span>
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="bg-white dark:bg-gray-800"
                    >
                        <div className="p-4 border-t border-brand-passport-subtle/20 dark:border-gray-700">
                            <h4 className="font-semibold text-brand-passport-primary/90 dark:text-gray-200 mb-2">{content.title}</h4>
                            {'isResource' in content ? (
                                <>
                                    <ul className="space-y-3 text-sm text-brand-passport-primary/80 dark:text-gray-400">
                                        {content.resources.map(res => (
                                            <li key={res.name}>
                                                <p className="font-bold dark:text-gray-300">{res.name}</p>
                                                {res.contact && <p className="font-mono">{res.contact}</p>}
                                                {res.links && res.links.map(link => (
                                                     <p key={link} className="text-blue-600 dark:text-blue-400 underline cursor-pointer">{link}</p>
                                                ))}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-4 text-xs text-red-600 dark:text-red-400 italic">{content.disclaimer}</p>
                                </>
                            ) : (
                                <ul className="list-disc list-inside space-y-2 text-sm text-brand-passport-primary/80 dark:text-gray-400">
                                    {content.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                                </ul>
                            )}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


const GuidancePage: React.FC = () => {
    const [expanded, setExpanded] = React.useState<EventPhase | false>('Awareness');
    const phases: EventPhase[] = ['Awareness', 'Engagement', 'Seeking Help'];

    return (
        <motion.div
            className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col min-h-[400px]"
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.h3 variants={itemSpringUp} className="text-xl md:text-2xl font-bold text-brand-passport-primary dark:text-gray-100 mb-2 border-b-2 border-brand-passport-subtle dark:border-gray-700 pb-2">Guidance & Resources</motion.h3>
            <motion.p variants={itemSpringUp} className="text-sm text-brand-passport-subtle dark:text-gray-400 mb-4">
                Helpful tips and resources to support you on your mental wellness journey.
            </motion.p>

            <motion.div
                className="space-y-3 overflow-y-auto pr-2 -mr-2"
                variants={staggerContainer(0.1)}
            >
                {phases.map(phase => (
                    <AccordionSection
                        key={phase}
                        phase={phase}
                        isExpanded={expanded === phase}
                        onToggle={() => setExpanded(expanded === phase ? false : phase)}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default GuidancePage;