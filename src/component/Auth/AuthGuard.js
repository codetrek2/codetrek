import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children, redirectPath = '/' }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (!currentUser) {
    return <Navigate to={redirectPath} />; 
  }

  return children; 
};

export default AuthGuard;
