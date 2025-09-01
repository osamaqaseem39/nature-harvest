import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Brands from './pages/Brands';
import Flavors from './pages/Flavors';
import Sizes from './pages/Sizes';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Departments from './pages/Departments';
import Skills from './pages/Skills';
import CareerAnalytics from './pages/CareerAnalytics';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="brands" element={<Brands />} />
              <Route path="flavors" element={<Flavors />} />
              <Route path="sizes" element={<Sizes />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="applications" element={<Applications />} />
              <Route path="departments" element={<Departments />} />
              <Route path="skills" element={<Skills />} />
              <Route path="career-analytics" element={<CareerAnalytics />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
