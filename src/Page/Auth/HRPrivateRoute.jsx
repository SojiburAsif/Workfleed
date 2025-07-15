import React from 'react';
import UseAuth from '../../Hooks/UseAuth';
import useUserRole from '../../Hooks/UseUserRole';
import { Navigate, useLocation } from 'react-router';
import Loading from '../Shared/Loading';

const HRRoute = ({ children }) => {
  const { user, loading } = UseAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <Loading />;
  }

  if (!user || role?.toLowerCase() !== 'hr') {
    return <Navigate to="/forbiden" state={{ from: location }} replace />;
  }

  return children;
};

export default HRRoute;
