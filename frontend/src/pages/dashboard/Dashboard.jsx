import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Briefcase, CheckSquare, TrendingUp, AlertCircle, Users, Zap, PieChart } from 'lucide-react';
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalUsers: 0
  });
  const [tenantInfo, setTenantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Get Tenant Info
        if (user?.tenantId) {
          const tenantRes = await api.get(`/tenants/${user.tenantId}`);
          setTenantInfo(tenantRes.data.data);
        }

        const dashboardRes = await api.get('/dashboard');

        setStats({
          totalProjects: dashboardRes.data.totalProjects,
          activeTasks: dashboardRes.data.activeTasks,
          completedTasks: dashboardRes.data.completedTasks,
          totalUsers: dashboardRes.data.teamMembers
        });

        try {
          const activityRes = await api.get('/audit-logs?limit=5');
          setRecentActivities(activityRes.data.data || []);
        } catch (e) {
          console.warn("Audit logs not available");
        }


      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 skeleton"
            />
          ))}
        </div>
      </div>
    );
  }

  const maxProjects = tenantInfo?.max_projects || tenantInfo?.maxProjects || 1;
  const maxUsers = tenantInfo?.max_users || tenantInfo?.maxUsers || 1;
  const planName = tenantInfo?.subscription_plan || tenantInfo?.subscriptionPlan || 'Unknown';

  const projectUsage = Math.min((stats.totalProjects / maxProjects) * 100, 100);
  const userUsage = Math.min((stats.totalUsers / maxUsers) * 100, 100);

  const chartData = [
    { name: 'Active', value: stats.activeTasks, color: '#3b82f6' },
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
  ];

  const activityVariants = {
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
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back, {user?.fullName || user?.email}!
        </p>
      </motion.div>

      {/* Subscription Card */}
      {tenantInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-8 hover-lift"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Subscription Status</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-500 dark:text-gray-400 text-sm mr-2">Current Plan:</span>
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {planName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-full text-sm font-bold uppercase mt-4 md:mt-0 ${tenantInfo.status === 'active'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                }`}
            >
              {tenantInfo.status}
            </motion.span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Projects Used</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalProjects} <span className="text-gray-400">/</span> {maxProjects}
                </span>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${projectUsage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${projectUsage >= 100 ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Team Members</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalUsers} <span className="text-gray-400">/</span> {maxUsers}
                </span>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${userUsage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Briefcase className="w-6 h-6" />}
          label="Total Projects"
          value={stats.totalProjects}
          color="from-blue-500 to-cyan-500"
          delay={0.2}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Active Tasks"
          value={stats.activeTasks}
          color="from-yellow-500 to-orange-500"
          delay={0.3}
        />
        <StatCard
          icon={<CheckSquare className="w-6 h-6" />}
          label="Completed Tasks"
          value={stats.completedTasks}
          color="from-green-500 to-emerald-500"
          delay={0.4}
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Team Members"
          value={stats.totalUsers}
          color="from-purple-500 to-pink-500"
          delay={0.5}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Task Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={activityVariants}
                  className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mr-3 ${activity.action === 'login' ? 'bg-green-500' :
                      activity.action === 'create' ? 'bg-blue-500' :
                        activity.action === 'delete' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent activities</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white hover-lift`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
        {icon}
      </div>
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="opacity-50"
      >
        {icon}
      </motion.div>
    </div>
    <p className="text-sm font-medium opacity-90">{label}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </motion.div>
);

export default Dashboard;