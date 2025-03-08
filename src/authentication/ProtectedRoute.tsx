import React, {FC, JSX} from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="text-white">Loading user info...</div>;
    }

    if (!user || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
