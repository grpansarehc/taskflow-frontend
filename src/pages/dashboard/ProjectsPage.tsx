import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, MoreVertical, X } from 'lucide-react';
import { projectService } from '../../services/project.service';
import type { ProjectResponse, CreateProjectFormData } from '../../types/project.types';
import { useToast } from '../../components/common/ToastProvider';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();
  
  const [newProject, setNewProject] = useState<CreateProjectFormData>({
    name: '',
    key: '',
    description: '',
    type: 'SOFTWARE', // Default type
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load projects';
      setError(errorMessage);
      addToast({ type: 'error', message: errorMessage });
      
      // If unauthorized, redirect to login
      if (err.status === 401) {
        setTimeout(() => {
          // window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.projectKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Get current user ID from localStorage or sessionStorage
      const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      if (!userId) {
        addToast({ type: 'error', message: 'User not authenticated' });
        return;
      }

      const projectData = {
        name: newProject.name,
        projectKey: newProject.key,
        description: newProject.description || undefined,
        type: newProject.type,
        ownerId: userId,
      };

      const createdProject = await projectService.createProject(projectData);
      
      // Add new project to the list
      setProjects([createdProject, ...projects]);
      
      // Show success message
      addToast({ type: 'success', message: 'Project created successfully!' });
      
      // Reset form and close modal
      setShowCreateModal(false);
      setNewProject({ name: '', key: '', description: '', type: 'SOFTWARE' });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create project';
      addToast({ type: 'error', message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage and track all your projects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by name or key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load projects</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Projects Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Project</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Key</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {/* Project Name */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{project.name}</div>
                    </td>

                    {/* Project Key */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                        {project.projectKey}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {project.description || '-'}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{project.type}</span>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search query' : 'Create your first project to get started'}
          </p>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
              <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body - Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Column - Form */}
              <form onSubmit={handleCreateProject} className="p-12 mt-5 space-y-6">
                {/* Project Name */}
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    id="projectName"
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Project Key */}
                <div>
                  <label htmlFor="projectKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Key *
                  </label>
                  <input
                    id="projectKey"
                    type="text"
                    value={newProject.key}
                    onChange={(e) => setNewProject({ ...newProject, key: e.target.value.toUpperCase() })}
                    placeholder="e.g., PROJ"
                    maxLength={10}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none uppercase"
                    required
                    disabled={submitting}
                  />
                  <p className="mt-1 text-xs text-gray-500">Short identifier for your project (max 10 characters)</p>
                </div>

                {/* Project Type */}
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type *
                  </label>
                  <select
                    id="projectType"
                    value={newProject.type}
                    onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                    disabled={submitting}
                  >
                    <option value="SOFTWARE">Software</option>
                    <option value="BUSINESS">Business</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="DESIGN">Design</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Project Description */}
                <div>
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="projectDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Enter project description"
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                    disabled={submitting}
                  />
                  <p className="mt-1 text-xs text-gray-500">Brief description of the project (max 500 characters)</p>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>

              {/* Right Column - Image */}
              <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
                <img 
                  src="/images/project-creation.png"
                  alt="Project Creation Illustration"
                  className="w-full h-auto max-w-md object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
