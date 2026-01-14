import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Settings, 
  Bell,
  Search,
  Plus,
  ChevronDown,
  LogOut,
  User,
  Trello,
} from 'lucide-react';
import DashboardHome from './DashboardHome.tsx';
import ProjectsPage from './ProjectsPage.tsx';
import KanbanBoard from './KanbanBoard.tsx';
import CreateTaskModal from '../../components/kanban/CreateTaskModal';
import authService from '../../services/auth.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type MenuItem = 'dashboard' | 'projects' | 'kanban' | 'tasks' | 'team' | 'settings';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuItem>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { name,email } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      // No token found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      // Call backend signout API and clear storage
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always redirect to login and replace history to prevent back navigation
      navigate('/login', { replace: true });
    }
  };

  
  const menuItems = [
    { id: 'dashboard' as MenuItem, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects' as MenuItem, icon: FolderKanban, label: 'Projects' },
    { id: 'kanban' as MenuItem, icon: Trello, label: 'Kanban Board' },
    { id: 'tasks' as MenuItem, icon: CheckSquare, label: 'Tasks' },
  
    { id: 'settings' as MenuItem, icon: Settings, label: 'Settings' },
  ];

  // Fetch projects for global create modal
  const [projects, setProjects] = useState<any[]>([]);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await import('../../services/project.service').then(m => m.projectService.getAllProjects());
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects for global modal", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm h-screen sticky top-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${sidebarCollapsed ? 'rotate-90' : '-rotate-90'}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                JD
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{name}</div>
                    <div className="text-xs text-gray-500 truncate">{email}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </>
              )}
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button 
                  onClick={() => {
                    setShowLogoutModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, tasks, or team members..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Create Button */}
            <button 
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeMenu === 'dashboard' && <DashboardHome onNavigateToProjects={() => setActiveMenu('projects')} />}
          {activeMenu === 'projects' && <ProjectsPage />}
          {activeMenu === 'kanban' && <KanbanBoard />}
          {activeMenu === 'tasks' && (
            <div className="text-center py-20">
              <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tasks</h2>
              <p className="text-gray-600">Tasks view coming soon...</p>
            </div>
          )}
          {/* {activeMenu === 'team' && (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Team</h2>
              <p className="text-gray-600">Team view coming soon...</p>
            </div>
          )} */}
          {activeMenu === 'settings' && (
            <div className="text-center py-20">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600">Settings view coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Global Create Task Modal */}
      <CreateTaskModal
         isOpen={isCreateTaskModalOpen}
         onClose={() => setIsCreateTaskModalOpen(false)}
         onTaskCreated={() => {
             setIsCreateTaskModalOpen(false);
             // Optionally trigger a refresh if we could
         }}
         projects={projects}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Confirm Logout</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? Any unsaved changes will be lost.
            </p>
            
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
