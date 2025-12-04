import * as React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
    return (
        <motion.div
            className={`bg-gray-200 dark:bg-gray-700 ${className}`}
            style={style}
            animate={{
                opacity: [0.6, 1, 0.6],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
};

export default SkeletonLoader;