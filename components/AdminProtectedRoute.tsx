
import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const AdminProtectedRoute: React.FC = () => {
    const { adminUser } = useAuth();
    return adminUser ? <Outlet /> : <Navigate to="/auth?mode=admin" replace />;
};

export default AdminProtectedRoute;
