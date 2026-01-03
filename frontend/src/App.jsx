import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectList from './pages/projects/ProjectList';
import UserList from './pages/users/UserList';
import TenantList from './pages/tenants/TenantList';
import ProjectDetails from './pages/projects/ProjectDetails';

// Page transition animations
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/10"
        >
          <Routes location={location}>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - All inside DashboardLayout */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/tenants" element={<TenantList />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
            </Route>

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 Page with animation */}
            <Route 
              path="*" 
              element={
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center min-h-screen"
                >
                  <div className="text-center">
                    <motion.h1 
                      initial={{ y: -50 }}
                      animate={{ y: 0 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="text-9xl font-bold gradient-text mb-4"
                    >
                      404
                    </motion.h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                      Page not found
                    </p>
                  </div>
                </motion.div>
              } 
            />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;