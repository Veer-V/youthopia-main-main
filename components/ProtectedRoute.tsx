import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const ProtectedRoute: React.FC = () => {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;