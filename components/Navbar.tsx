import * as React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants, type SVGMotionProps } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.tsx';
// import ThemeToggle from './ThemeToggle.tsx';
import { useFocusTrap } from '../hooks/useFocusTrap.ts';
import youthopiaLogo from '../assets/youthopia-logo.png';

// A custom motion component for the animated hamburger icon paths
const Path = (props: SVGMotionProps<SVGPathElement>) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="currentColor"
        strokeLinecap="round"
        {...props}
    />
);

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useFocusTrap(menuRef, isOpen);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const buttonVariants: Variants = {
        hover: {
            scale: 1.05,
            transition: { type: 'spring', stiffness: 400, damping: 10 },
        },
        tap: { scale: 0.95 },
    };

    const mobileMenuVariants: Variants = {
        hidden: { x: '100%' },
        visible: {
            x: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
        },
        exit: {
            x: '100%',
            transition: { duration: 0.3, ease: 'easeInOut' }
        }
    };

    return (
        <motion.nav
            className="glass sticky top-0 z-50 border-b border-white/20"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <NavLink
                            to="/"
                            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-sm"
                        >
                            <img
                                src={youthopiaLogo}
                                alt="Youthopia Logo"
                                className="h-10 w-auto sm:h-12 md:h-14 object-contain"
                            />
                        </NavLink>
                    </motion.div>
                    <div className="hidden md:flex items-center space-x-8">
                        {user && (
                            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
                                <div className="relative">
                                    <NavLink to="/dashboard" className="text-brand-dark-blue font-medium text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-sm py-2 group">
                                        Dashboard
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-0.5 bg-brand-yellow"
                                            initial={{ width: 0 }}
                                            animate={{ width: location.pathname === '/dashboard' ? '100%' : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <div className="absolute bottom-0 left-0 h-0.5 bg-brand-yellow w-0 group-hover:w-full transition-all duration-300" />
                                    </NavLink>
                                </div>
                            </motion.div>
                        )}
                        <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                            {user ? (
                                <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition-colors duration-300 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark-blue focus-visible:ring-white">
                                    Logout
                                </button>
                            ) : (
                                <NavLink to="/auth" className="bg-brand-yellow text-brand-dark-blue font-bold py-2 px-6 rounded-full hover:bg-yellow-300 transition-colors duration-300 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark-blue focus-visible:ring-brand-yellow">
                                    Join Now
                                </NavLink>
                            )}
                        </motion.div>
                    </div>
                    <div className="flex items-center md:hidden">
                        <motion.button
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative z-50 flex h-12 w-12 justify-center items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                            animate={isOpen ? "open" : "closed"}
                            initial={false}
                        >
                            <svg width="23" height="23" viewBox="0 0 23 23">
                                <Path
                                    variants={{
                                        closed: { d: "M 2 2.5 L 20 2.5" },
                                        open: { d: "M 3 16.5 L 17 2.5" }
                                    }}
                                />
                                <Path
                                    d="M 2 9.5 L 20 9.5"
                                    variants={{
                                        closed: { opacity: 1 },
                                        open: { opacity: 0 }
                                    }}
                                    transition={{ duration: 0.1 }}
                                />
                                <Path
                                    variants={{
                                        closed: { d: "M 2 16.5 L 20 16.5" },
                                        open: { d: "M 3 2.5 L 17 16.5" }
                                    }}
                                />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            ref={menuRef}
                            className="fixed top-0 right-0 h-full w-2/3 max-w-xs glass-dark shadow-2xl md:hidden z-40 flex flex-col border-l border-white/10"
                            variants={mobileMenuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="mobile-menu-title"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-700 h-20">
                                <NavLink
                                    to="/"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-sm"
                                >
                                    <img
                                        src={youthopiaLogo}
                                        alt="Youthopia Logo"
                                        className="h-9 w-auto object-contain"
                                    />
                                </NavLink>
                                <h2 id="mobile-menu-title" className="text-xl font-bold text-white ml-3">Menu</h2>
                            </div>
                            <div className="flex flex-col items-center justify-start flex-grow p-8 space-y-8 overflow-y-auto">
                                {user && (
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="text-white font-bold text-2xl">
                                            Dashboard
                                        </NavLink>
                                    </motion.div>
                                )}
                                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                                    {user ? (
                                        <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-3 px-8 rounded-full shadow-md text-lg">
                                            Logout
                                        </button>
                                    ) : (
                                        <NavLink to="/auth" onClick={() => setIsOpen(false)} className="bg-brand-yellow text-brand-dark-blue font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors duration-300 shadow-md text-lg">
                                            Join Now
                                        </NavLink>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;