import * as React from 'react';

export const useFocusTrap = (ref: React.RefObject<HTMLElement>, isOpen: boolean) => {
    React.useEffect(() => {
        if (!isOpen || !ref.current) return;

        // FIX: Specify HTMLElement as the generic type for querySelectorAll.
        // This ensures that the elements returned have a .focus() method, resolving the TypeScript error.
        const focusableElements = Array.from(
            ref.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
            )
        );

        if (focusableElements.length === 0) return;

        const firstElement: HTMLElement = focusableElements[0] as HTMLElement;
        const lastElement: HTMLElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        // Defer to next frame and guard focus to avoid runtime/TS issues
        requestAnimationFrame(() => {
            if (firstElement && typeof (firstElement as any).focus === 'function') {
                try {
                    firstElement.focus({ preventScroll: true });
                } catch {
                    firstElement.focus();
                }
            }
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                // if only one focusable element, do nothing
                if (focusableElements.length === 1) {
                    event.preventDefault();
                    return;
                }

                if (event.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        if (typeof (lastElement as any).focus === 'function') {
                            try { (lastElement as any).focus({ preventScroll: true }); } catch { (lastElement as any).focus(); }
                        }
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        if (typeof (firstElement as any).focus === 'function') {
                            try { (firstElement as any).focus({ preventScroll: true }); } catch { (firstElement as any).focus(); }
                        }
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, ref]);
};