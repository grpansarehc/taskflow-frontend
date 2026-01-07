import { useState } from 'react';
import { Search, Plus, Calendar, MoreVertical, X } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  key: string;
  progress: number;
  teamMembers: { initials: string; color: string }[];
  color: string;
  icon: string;
  description: string;
  dueDate: string;
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    key: '',
    description: '',
  });

  // Mock projects data
  const allProjects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      key: 'WR',
      progress: 65,
      teamMembers: [
        { initials: 'SJ', color: 'bg-blue-500' },
        { initials: 'MC', color: 'bg-purple-500' },
        { initials: 'EW', color: 'bg-pink-500' },
      ],
      color: 'bg-blue-300',
      icon: '🌐',
      description: 'Complete redesign of company website',
      dueDate: 'Jan 15, 2026',
    },
    {
      id: '2',
      name: 'Mobile App Development',
      key: 'MAD',
      progress: 42,
      teamMembers: [
        { initials: 'JD', color: 'bg-green-500' },
        { initials: 'AS', color: 'bg-orange-500' },
        { initials: 'KL', color: 'bg-indigo-500' },
      ],
      color: 'bg-red-300',
      icon: '📱',
      description: 'iOS and Android mobile application',
      dueDate: 'Feb 20, 2026',
    },
    {
      id: '3',
      name: 'Marketing Campaign Q3',
      key: 'MCQ3',
      progress: 20,
      teamMembers: [
        { initials: 'RT', color: 'bg-purple-500' },
        { initials: 'MK', color: 'bg-pink-500' },
        { initials: 'LN', color: 'bg-yellow-500' },
      ],
      color: 'bg-purple-300',
      icon: '📊',
      description: 'Q3 marketing initiatives and campaigns',
      dueDate: 'Jan 30, 2026',
    },
    {
      id: '4',
      name: 'API Integration',
      key: 'API',
      progress: 80,
      teamMembers: [
        { initials: 'AB', color: 'bg-cyan-500' },
        { initials: 'CD', color: 'bg-teal-500' },
      ],
      color: 'bg-cyan-300',
      icon: '🔌',
      description: 'Third-party API integrations',
      dueDate: 'Jan 10, 2026',
    },
    {
      id: '5',
      name: 'Database Migration',
      key: 'DBM',
      progress: 55,
      teamMembers: [
        { initials: 'EF', color: 'bg-amber-500' },
        { initials: 'GH', color: 'bg-lime-500' },
        { initials: 'IJ', color: 'bg-emerald-500' },
      ],
      color: 'bg-amber-300',
      icon: '💾',
      description: 'Migrate to new database infrastructure',
      dueDate: 'Feb 5, 2026',
    },
    {
      id: '6',
      name: 'Security Audit',
      key: 'SEC',
      progress: 30,
      teamMembers: [
        { initials: 'KL', color: 'bg-red-500' },
        { initials: 'MN', color: 'bg-rose-500' },
      ],
      color: 'bg-rose-300',
      icon: '🔒',
      description: 'Comprehensive security assessment',
      dueDate: 'Jan 25, 2026',
    },
  ];

  const filteredProjects = allProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create project
    console.log('Creating project:', newProject);
    setShowCreateModal(false);
    setNewProject({ name: '', key: '', description: '' });
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

      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Project</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Key</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Description</th>

                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {/* Project Name with Icon */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${project.color} rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0`}>
                        {project.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{project.name}</div>
                      </div>
                    </div>
                  </td>

                  {/* Project Key */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                      {project.key}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{project.description}</p>
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

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">Try adjusting your search query</p>
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
                  />
                  <p className="mt-1 text-xs text-gray-500">Short identifier for your project (max 10 characters)</p>
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">Brief description of the project</p>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                  >
                    Create Project
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
