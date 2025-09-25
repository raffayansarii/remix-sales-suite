import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for token or user profile in localStorage
    const token = localStorage.getItem('token'); // Change 'token' to your key if needed
    // Or, for user profile: const user = localStorage.getItem('user');
    setIsAuthenticated(!!token); // or !!user
    setLoading(false);
  }, []);

  if (loading) return null; // or a loading spinner
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
