import * as React from 'react';
import { animate } from 'framer-motion';

interface AnimatedCounterProps {
    to: number;
    className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ to, className }) => {
    const nodeRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const controls = animate(0, to, {
            duration: 1.2,
            ease: "easeOut",
            onUpdate(value) {
                node.textContent = Math.round(value).toLocaleString();
            }
        });

        return () => controls.stop();
    }, [to]);

    // Set initial text to 0 to prevent layout shifts
    return <span ref={nodeRef} className={className}>0</span>;
};

export default AnimatedCounter;