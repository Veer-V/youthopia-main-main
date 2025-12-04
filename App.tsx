import * as React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import SplashScreen from './components/SplashScreen.tsx';
import ScrollToTopButton from './components/ScrollToTopButton.tsx';
import DomeGallery from './components/DomeGallery.tsx';

const HomePage = React.lazy(() => import('./components/HomePage.tsx'));
const AuthPage = React.lazy(() => import('./components/AuthPage.tsx'));
const TestimonialsPage = React.lazy(() => import('./components/TestimonialsPage.tsx'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute.tsx'));
const AdminProtectedRoute = React.lazy(() => import('./components/AdminProtectedRoute.tsx'));
const ActivityVisaPage = React.lazy(() => import('./components/ActivityVisaPage.tsx'));
const EventDetailPage = React.lazy(() => import('./components/EventDetailPage.tsx'));
const FeedbackPage = React.lazy(() => import('./components/FeedbackPage.tsx'));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout.tsx'));
const AdminDashboardPage = React.lazy(() => import('./components/admin/AdminDashboardPage.tsx'));
const AdminUserManagementPage = React.lazy(() => import('./components/admin/AdminUserManagementPage.tsx'));
const AdminEventManagementPage = React.lazy(() => import('./components/admin/AdminEventManagementPage.tsx'));
const AdminFeedbackPage = React.lazy(() => import('./components/admin/AdminFeedbackPage.tsx'));
const AdminQRPage = React.lazy(() => import('./components/admin/AdminQRPage.tsx'));
const AdminReportPage = React.lazy(() => import('./components/admin/AdminReportPage.tsx'));
const AdminMasterControlPage = React.lazy(() => import('./components/admin/AdminMasterControlPage.tsx'));
const AdminRedemptionPage = React.lazy(() => import('./components/admin/AdminRedemptionPage.tsx'));
const SpinWheelPage = React.lazy(() => import('./components/SpinWheelPage.tsx'));

const App: React.FC = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 4500);
        return () => clearTimeout(timer);
    }, []);


    const isAdminRoute = location.pathname.startsWith('/admin');
    const isAuthRoute = location.pathname === '/auth';

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div key="splash" exit={{ opacity: 0 }}>
                    <SplashScreen />
                </motion.div>
            ) : (
                <motion.div
                    key="main-app"
                    className="flex flex-col min-h-screen bg-brand-bg dark:bg-brand-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {!isAdminRoute && <Navbar />}
                    <main className="flex-grow">
                        <React.Suspense fallback={null}>
                            <AnimatePresence mode="wait">
                                <Routes location={location}>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/auth" element={<AuthPage />} />
                                    <Route path="/testimonials" element={<TestimonialsPage />} />
                                    <Route path="/gallery" element={<DomeGallery />} />

                                    {/* Protected Student Routes */}
                                    <Route element={<ProtectedRoute />}>
                                        <Route path="/dashboard" element={<ActivityVisaPage />} />
                                        <Route path="/activity/:eventId" element={<EventDetailPage />} />
                                        <Route path="/feedback/:eventId" element={<FeedbackPage />} />
                                    </Route>

                                    {/* Admin Routes */}
                                    <Route path="/admin" element={<AdminProtectedRoute />}>
                                        <Route element={<AdminLayout />}>
                                            <Route index element={<Navigate to="dashboard" replace />} />
                                            <Route path="dashboard" element={<AdminDashboardPage />} />
                                            <Route path="users" element={<AdminUserManagementPage />} />
                                            <Route path="activities" element={<AdminEventManagementPage />} />
                                            <Route path="feedback" element={<AdminFeedbackPage />} />
                                            <Route path="feedback" element={<AdminFeedbackPage />} />
                                            <Route path="qr" element={<AdminQRPage />} />
                                            <Route path="reports" element={<AdminReportPage />} />
                                            <Route path="master-control" element={<AdminMasterControlPage />} />
                                            <Route path="redemptions" element={<AdminRedemptionPage />} />
                                        </Route>
                                    </Route>

                                    {/* Spin & Win Route */}
                                    <Route path="/spin-win" element={<SpinWheelPage />} />

                                </Routes>
                            </AnimatePresence>
                        </React.Suspense>
                    </main>
                    {!isAdminRoute && !isAuthRoute && <Footer />}
                    <ScrollToTopButton />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default App;