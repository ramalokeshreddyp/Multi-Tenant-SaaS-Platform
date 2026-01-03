import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, LayoutDashboard, FolderKanban, Users, Building, 
  Menu, X, ChevronRight, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const role = user?.role || 'guest';
  const name = user?.fullName || 'Guest';
  const email = user?.email || '';
  const avatarInitial = name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['user', 'tenant_admin', 'super_admin'] },
    { path: '/projects', label: 'Projects', icon: FolderKanban, roles: ['user', 'tenant_admin', 'super_admin'] },
    { path: '/users', label: 'Users', icon: Users, roles: ['tenant_admin', 'super_admin'] },
    { path: '/tenants', label: 'Organizations', icon: Building, roles: ['super_admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const sidebarVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: -300, 
      opacity: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
  };

  const sidebarCollapsedVariants = {
    open: { width: 280 },
    closed: { width: 80 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <motion.aside
        initial="open"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarCollapsedVariants}
        className="hidden md:flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 text-white shadow-2xl relative z-30"
      >
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-gray-800"
        >
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {isSidebarOpen ? (
                <motion.div
                  key="logo-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl"
                  >
                    <Zap className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      SaaS Platform
                    </h1>
                    <p className="text-xs text-gray-400">Multi-tenant System</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-collapsed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mx-auto"
                >
                  <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
                    <Zap className="w-6 h-6" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <AnimatePresence>
            {filteredNavItems.map((item, i) => {
              const isActive = activePath === item.path;
              return (
                <motion.div
                  key={item.path}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-600/20 to-secondary-600/20 text-white border-l-4 border-primary-500'
                        : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500'
                        : 'bg-gray-800 group-hover:bg-gray-700'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && isSidebarOpen && (
                      <motion.div
                        layoutId="active-indicator"
                        className="ml-auto w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </nav>

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 border-t border-gray-800"
        >
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {avatarInitial}
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"
              />
            </motion.div>
            
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="font-semibold text-sm truncate">{name}</p>
                  <p className="text-xs text-gray-400 truncate">{email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full uppercase ${
                      role === 'super_admin' ? 'bg-purple-500/20 text-purple-300' :
                      role === 'tenant_admin' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {role.replace('_', ' ')}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ x: isSidebarOpen ? 5 : 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center w-full p-3 mt-3 rounded-xl transition-colors ${
              isLoggingOut
                ? 'bg-gray-800 text-gray-400'
                : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 hover:from-red-600/30 hover:to-pink-600/30 hover:text-white'
            }`}
          >
            <div className="p-2 rounded-lg bg-red-500/20 mr-3">
              <LogOut className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap font-medium"
                >
                  {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 text-white shadow-2xl z-50 md:hidden"
          >
            {/* Mobile Sidebar Content - Same as desktop but full */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">SaaS Platform</h1>
                    <p className="text-xs text-gray-400">Multi-tenant System</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4 space-y-2">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center p-3 rounded-xl ${
                    activePath === item.path
                      ? 'bg-gradient-to-r from-primary-600/20 to-secondary-600/20 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile User Profile */}
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                  {avatarInitial}
                </div>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-gray-400">{email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 rounded-xl hover:from-red-600/30 hover:to-pink-600/30"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-16 glass-card border-b border-white/10 dark:border-gray-700/50 flex items-center justify-between px-6"
        >
          {/* Left side - Mobile menu button and breadcrumb */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Dashboard</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {activePath.split('/')[1] || 'Overview'}
              </span>
            </div>
          </div>

          {/* Right side - Notifications and user profile */}
          <div className="flex items-center gap-4">
        
            {/* User Profile - Desktop */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role.replace('_', ' ')}</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                  {avatarInitial}
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                />
              </div>
            </motion.div>

            {/* User Profile - Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                {avatarInitial}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;