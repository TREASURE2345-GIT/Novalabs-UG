import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';

// Pages
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import PhysicalTitrationLab from './pages/PhysicalTitrationLab';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import PartnerDashboard from './pages/PartnerDashboard';
import SuspendedPage from './pages/SuspendedPage';
import BiologyLabPage from './pages/labs/BiologyLabPage';
import ChemistryLabPage from './pages/labs/ChemistryLabPage';
import PhysicsLabPage from './pages/labs/PhysicsLabPage';
import AgricultureLabPage from './pages/labs/AgricultureLabPage';
import ExperimentPage from './pages/experiments/ExperimentPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import PricingPage from './pages/PricingPage';
import SubscriptionCallback from './pages/SubscriptionCallback';
import { ADMIN_ROLES, DASHBOARD_ROLES, LAB_ROLES } from './lib/rbac';

// Components
import PrivateRoute from './components/auth/PrivateRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import AIAssistant from './components/ai/AIAssistant';

// Initialize React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
    },
  },
});

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AIAssistantHost />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/physical-lab" element={<PhysicalTitrationLab />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/subscription/callback" element={<SubscriptionCallback />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/suspended" element={<SuspendedPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} role={user?.role} allowedRoles={DASHBOARD_ROLES}>
                <Layout>
                  {user?.role === 'student' && <StudentDashboard />}
                  {user?.role === 'teacher' && <TeacherDashboard />}
                  {user?.role === 'admin' && <AdminDashboard />}
                  {user?.role === 'partner' && <PartnerDashboard />}
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES} permission="user.manage">
                <Layout>
                  <AdminUsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Lab Routes */}
          <Route
            path="/labs/biology"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} role={user?.role} allowedRoles={LAB_ROLES}>
                <Layout>
                  <BiologyLabPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/labs/chemistry"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} role={user?.role} allowedRoles={LAB_ROLES}>
                <Layout>
                  <ChemistryLabPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/labs/physics"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} role={user?.role} allowedRoles={LAB_ROLES}>
                <Layout>
                  <PhysicsLabPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/labs/agriculture"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} role={user?.role} allowedRoles={LAB_ROLES}>
                <Layout>
                  <AgricultureLabPage />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Experiment Routes */}
          <Route
            path="/experiments/:slug"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} role={user?.role} allowedRoles={LAB_ROLES}>
                <Layout>
                  <ExperimentPage />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

function AIAssistantHost() {
  const location = useLocation();

  if (location.pathname === '/demo') {
    return null;
  }

  return <AIAssistant />;
}

export default App;
