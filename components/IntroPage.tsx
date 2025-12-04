

import * as React from 'react';
// FIX: Import the Variants type from framer-motion.
import { motion, type Variants } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

// FIX: Explicitly type the variants object with 'Variants'.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// FIX: Explicitly type the variants object with 'Variants' to resolve the TypeScript error.
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const backgroundShapes = Array.from({ length: 15 });

const IntroPage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="relative w-full h-screen flex items-center justify-center animated-gradient overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {backgroundShapes.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: 0,
          }}
          animate={{
            scale: Math.random() * 0.3 + 0.1,
            x: `calc(${Math.random() * 100}vw - 50%)`,
            y: `calc(${Math.random() * 100}vh - 50%)`,
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          style={{
            width: `${Math.random() * 150 + 50}px`,
            height: `${Math.random() * 150 + 50}px`,
          }}
        />
      ))}

      <div className="text-center text-white z-10 px-4">
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-display font-extrabold tracking-tight"
          style={{ textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
        >
          Welcome to Youthopia
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90"
          style={{ textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
        >
          A safe space for creativity, conversation, and mental well-being.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8">
          <motion.button
            onClick={onComplete}
            className="bg-brand-yellow text-brand-dark-blue font-bold py-3 px-8 rounded-full text-lg shadow-xl inline-flex items-center gap-2"
            whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Now <FiArrowRight />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IntroPage;
