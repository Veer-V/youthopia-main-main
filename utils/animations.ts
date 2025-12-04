import type { Variants, Easing } from 'framer-motion';

export const sectionEase: Easing = [0.22, 1, 0.36, 1];

export const pageTransition: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeInOut' } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.2, ease: 'easeInOut' } }
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0.2): Variants => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren, delayChildren }
    }
});

export const itemSpringUp: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1, 
        transition: { type: "spring", stiffness: 200, damping: 25 } 
    }
};

export const stepVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
};