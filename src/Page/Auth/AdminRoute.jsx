import React from 'react';
import UseAuth from '../../Hooks/UseAuth';
import useUserRole from '../../Hooks/UseUserRole';
import Loading from '../Shared/Loading';
import { Navigate, useLocation } from 'react-router';

const AdminRoute = ({ children }) => {
  const { user, loading } = UseAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <Loading />;
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/forbiden" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
