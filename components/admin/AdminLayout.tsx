import * as React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiUsers, FiCalendar, FiMessageSquare, FiLogOut, FiMenu, FiX, FiBarChart2, FiAward, FiShoppingBag } from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext.tsx';

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
    { name: 'Users', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Events', path: '/admin/activities', icon: <FiCalendar /> },
    { name: 'Feedback', path: '/admin/feedback', icon: <FiMessageSquare /> },
    { name: 'QR Tools', path: '/admin/qr', icon: <FaQrcode /> },
    { name: 'Reports', path: '/admin/reports', icon: <FiBarChart2 /> },
    { name: 'Master Control', path: '/admin/master-control', icon: <FiAward /> },
    { name: 'Redemptions', path: '/admin/redemptions', icon: <FiShoppingBag /> },
];

const AdminLayout: React.FC = () => {
    const { adminUser, adminLogout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        adminLogout();
        navigate('/auth');
    };

    return (
        <div className="relative md:flex min-h-screen bg-brand-bg dark:bg-brand-black overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
            </div>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
            {/* Sidebar */}
            <aside className={`w-64 glass-dark text-white flex flex-col fixed inset-y-0 left-0 z-30 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-white/10 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 text-2xl font-bold border-b border-white/10 flex justify-between items-center bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-yellow-200">
                    <span>Youthopia Admin</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>
                <nav className="flex-grow p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {navItems.map(item => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${isActive ? 'bg-brand-yellow text-brand-dark-blue font-bold shadow-lg' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                        }`
                                    }
                                >
                                    {item.icon}
                                    <span className="ml-3">{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10">
                <header className="glass border-b border-white/20 shadow-sm p-4 flex justify-between items-center shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden text-brand-dark-blue hover:text-brand-blue focus:outline-none p-2 -ml-2 rounded-md hover:bg-white/50"
                        aria-label="Open sidebar"
                    >
                        <FiMenu size={24} />
                    </button>
                    <div className="hidden md:block" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm md:text-base font-semibold text-brand-dark-blue truncate max-w-[150px] md:max-w-none">
                            Welcome, {adminUser?.username}
                        </span>
                        <motion.button
                            onClick={handleLogout}
                            className="ml-2 md:ml-4 text-gray-500 hover:text-red-500 focus:outline-none p-2 rounded-full hover:bg-red-50 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Logout"
                        >
                            <FiLogOut size={20} />
                        </motion.button>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
