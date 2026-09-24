import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EligibilityProvider } from './context/EligibilityContext';
import { Navbar, ProtectedRoute, AdminRoute } from './components';

import './index.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ScholarshipListPage from './pages/ScholarshipListPage';
import ScholarshipDetailPage from './pages/ScholarshipDetailPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import HelpPage from './pages/HelpPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import EligibilityLayout from './pages/eligibility/EligibilityLayout';
import Step1Personal from './pages/eligibility/Step1Personal';
import Step2Community from './pages/eligibility/Step2Community';
import Step3Academic from './pages/eligibility/Step3Academic';
import Step4Performance from './pages/eligibility/Step4Performance';
import Step5Financial from './pages/eligibility/Step5Financial';
import Step6Bank from './pages/eligibility/Step6Bank';
import EligibilityReview from './pages/eligibility/EligibilityReview';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminScholarshipsPage from './pages/admin/AdminScholarshipsPage';
import AdminScholarshipFormPage from './pages/admin/AdminScholarshipFormPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';

/**
 * AppFooter — Global footer shown on non-admin routes.
 */
const AppFooter = () => (
  <footer className="app-footer">
    <div className="app-container">
      <div className="footer-content">
        <span className="footer-brand">SCHOLARO</span>
        <ul className="footer-links" role="list">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/how-it-works">How It Works</Link></li>
          <li><Link to="/scholarships">Scholarships</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
          <li><Link to="/help">Help</Link></li>
        </ul>
        <p style={{ fontSize: 'var(--font-size-xs)', color: '#64748B', margin: 0 }}>
          &copy; {new Date().getFullYear()} SCHOLARO. Tamil Nadu Scholarship Finder.
        </p>
      </div>
    </div>
  </footer>
);

/**
 * AppContent — Inner shell that uses Router context (hooks require BrowserRouter above).
 */
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && (
        <Navbar
          isLoggedIn={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <main className="main-content" id="main-content" style={{ flex: 1 }}>
        <Routes>
          {/* ─── Public routes ─────────────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/scholarships" element={<ScholarshipListPage />} />
          <Route path="/scholarship/:id" element={<ScholarshipDetailPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* ─── Student protected routes ───────────────────────────────── */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* ─── Eligibility flow (6 steps + review) ───────────────────── */}
          <Route
            path="/eligibility"
            element={
              <ProtectedRoute>
                <EligibilityProvider>
                  <EligibilityLayout />
                </EligibilityProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="step-1" replace />} />
            <Route path="step-1" element={<Step1Personal />} />
            <Route path="step-2" element={<Step2Community />} />
            <Route path="step-3" element={<Step3Academic />} />
            <Route path="step-4" element={<Step4Performance />} />
            <Route path="step-5" element={<Step5Financial />} />
            <Route path="step-6" element={<Step6Bank />} />
            <Route path="review" element={<EligibilityReview />} />
          </Route>

          {/* ─── Admin routes ───────────────────────────────────────────── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/scholarships" element={<AdminRoute><AdminScholarshipsPage /></AdminRoute>} />
          <Route path="/admin/scholarships/create" element={<AdminRoute><AdminScholarshipFormPage /></AdminRoute>} />
          <Route path="/admin/scholarships/:id/edit" element={<AdminRoute><AdminScholarshipFormPage /></AdminRoute>} />
          <Route path="/admin/students" element={<AdminRoute><AdminStudentsPage /></AdminRoute>} />

          {/* ─── 404 ────────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <AppFooter />}
    </div>
  );
};

/**
 * App — Root component. BrowserRouter must wrap everything that uses Router hooks.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
