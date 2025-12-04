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
        <div className="relative md:flex min-h-screen bg-gray-100">
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-20 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
            {/* Sidebar */}
            <aside className={`w-64 bg-brand-dark-blue text-white flex flex-col fixed inset-y-0 left-0 z-30 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 text-2xl font-bold border-b border-gray-700 flex justify-between items-center">
                    <span>Youthopia Admin</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>
                <nav className="flex-grow p-4 overflow-y-auto">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-700 ${isActive ? 'bg-brand-teal text-gray-900' : 'text-white'
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
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center shrink-0 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none p-2 -ml-2 rounded-md hover:bg-gray-100"
                        aria-label="Open sidebar"
                    >
                        <FiMenu size={24} />
                    </button>
                    <div className="hidden md:block" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm md:text-base font-semibold text-gray-700 truncate max-w-[150px] md:max-w-none">
                            Welcome, {adminUser?.username}
                        </span>
                        <motion.button
                            onClick={handleLogout}
                            className="ml-2 md:ml-4 text-gray-600 hover:text-red-500 focus:outline-none p-2 rounded-full hover:bg-gray-100"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Logout"
                        >
                            <FiLogOut size={20} />
                        </motion.button>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
