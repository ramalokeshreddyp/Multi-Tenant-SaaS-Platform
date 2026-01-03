import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Folder, Trash2, MoreVertical, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { toast } from 'react-hot-toast';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [hoveredProject, setHoveredProject] = useState(null);

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        const projects = res.data.data || [];
        setProjects(projects);
        setFilteredProjects(projects);
      } catch (error) {
        console.error("Failed to fetch projects", error);
        toast.error('Failed to load projects');
      }
    };
    fetchProjects();
  }, []);

  // Filter projects
  useEffect(() => {
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  // Create Project
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/projects', newProject);
      const createdProject = res.data.data;
      setProjects([createdProject, ...projects]);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  // Delete Project
  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project? All tasks will be deleted.")) return;

    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your organization's projects and tasks
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Input
            label=""
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 md:w-64"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="whitespace-nowrap"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-3 text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <Folder className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try a different search term' : 'Create your first project to get started'}
              </p>
            </motion.div>
          ) : (
            filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                layout
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="glass-card rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
              >
                {/* Background gradient on hover */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: hoveredProject === project.id ? 0.1 : 0,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500"
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl"
                      >
                        <Folder className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        project.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {project.status || 'Active'}
                      </span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleDelete(e, project.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary-600 transition-colors">
                    {project.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(project.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {project.task_count > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.task_count} tasks</span>
                        </div>
                      )}
                    </div>
                    
                    <motion.div
                      animate={{ x: hoveredProject === project.id ? 5 : 0 }}
                      className="text-primary-600 dark:text-primary-400"
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Create Project Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Project"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <Input 
            label="Project Name" 
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
            required
            placeholder="e.g. Website Launch 2024"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea 
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors focus:outline-none"
              rows="4"
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Describe what this project is about..."
            />
          </div>
          
          <div className="pt-2">
            <Button type="submit" disabled={loading} size="lg">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectList;