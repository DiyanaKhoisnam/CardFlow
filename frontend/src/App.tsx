import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { PageLoadingFallback } from './components/common/Skeleton';

// Public Auth Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ServerErrorPage } from './pages/ServerErrorPage';

// Lazy Loaded Profile Page
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);

// Lazy Loaded Customer Pages
const DashboardOverviewPage = lazy(() =>
  import('./pages/customer/DashboardOverviewPage').then((m) => ({ default: m.DashboardOverviewPage }))
);
const CardsPage = lazy(() =>
  import('./pages/customer/CardsPage').then((m) => ({ default: m.CardsPage }))
);
const TransactionsPage = lazy(() =>
  import('./pages/customer/TransactionsPage').then((m) => ({ default: m.TransactionsPage }))
);
const RewardsPage = lazy(() =>
  import('./pages/customer/RewardsPage').then((m) => ({ default: m.RewardsPage }))
);
const StatementsPage = lazy(() =>
  import('./pages/customer/StatementsPage').then((m) => ({ default: m.StatementsPage }))
);
const AnalyticsPage = lazy(() =>
  import('./pages/customer/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);

// Lazy Loaded Admin Pages
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminUsersPage = lazy(() =>
  import('./pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage }))
);
const AdminCardsPage = lazy(() =>
  import('./pages/admin/AdminCardsPage').then((m) => ({ default: m.AdminCardsPage }))
);
const AdminTransactionsPage = lazy(() =>
  import('./pages/admin/AdminTransactionsPage').then((m) => ({ default: m.AdminTransactionsPage }))
);
const AdminAnalyticsPage = lazy(() =>
  import('./pages/admin/AdminAnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage }))
);

export const App: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const getDefaultRedirect = () => {
    if (!isAuthenticated) return '/login';
    return user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
  };

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={getDefaultRedirect()} replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to={getDefaultRedirect()} replace /> : <RegisterPage />}
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/500" element={<ServerErrorPage />} />

        {/* Authenticated Application Shell (Sidebar + Header) */}
        <Route element={<AppLayout />}>
          {/* Common Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']} />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardOverviewPage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/statements" element={<StatementsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/cards" element={<AdminCardsPage />} />
            <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          </Route>
        </Route>

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
