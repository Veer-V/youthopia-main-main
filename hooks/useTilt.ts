import * as React from 'react';
import { useMotionValue, useTransform, animate, type MotionValue } from 'framer-motion';
import { useGesture } from '@use-gesture/react';

export const useTilt = (ref: React.RefObject<HTMLElement>): {
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
} => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-150, 150], [15, -15]);
    const rotateY = useTransform(x, [-150, 150], [-15, 15]);

    useGesture(
        {
            onMove: ({ xy: [px, py] }) => {
                if (!ref.current) return;
                const rect = ref.current.getBoundingClientRect();
                x.set(px - rect.left - rect.width / 2);
                y.set(py - rect.top - rect.height / 2);
            },
            onHover: ({ hovering }) => {
                if (!hovering) {
                    animate(x, 0, { type: 'spring', stiffness: 350, damping: 30 });
                    animate(y, 0, { type: 'spring', stiffness: 350, damping: 30 });
                }
            },
        },
        {
            target: ref,
            eventOptions: { passive: false },
        }
    );

    return { rotateX, rotateY };
};