import { useState, useEffect } from 'react';
import {
  Clock,
  MoreVertical,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { projectService } from '../../services/project.service';
import { taskService } from '../../services/task.service';
import type { TaskApiResponse } from '../../services/task.service';
import type { ProjectResponse } from '../../types/project.types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface DashboardHomeProps {
  onNavigateToProjects?: () => void;
}

// User info cache to avoid redundant API calls
const userCache: Record<string, { name: string; avatar: string }> = {};

export default function DashboardHome({ onNavigateToProjects }: DashboardHomeProps) {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [allTasks, setAllTasks] = useState<TaskApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { name } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const resolveUser = async (userId: string) => {
    if (!userId) return null;
    if (userCache[userId]) return userCache[userId];

    try {
      const user = await taskService.getUserById(userId);
      if (user) {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
        const name = fullName || user.username || user.name || user.email || 'Unknown User';
        const avatar = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        const data = { name, avatar };
        userCache[userId] = data;
        return data;
      }
    } catch (error) {
      console.error(`Failed to fetch user info for ${userId}`, error);
    }
    return null;
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAllProjects(),
        taskService.getAllTasks()
      ]);

      // Sort projects by creation date (newest first) and take top 3
      const sortedProjects = projectsData.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 3);

      setProjects(sortedProjects);

      // Enrich tasks with assignee info
      const enrichedTasks = await Promise.all(tasksData.map(async (task) => {
        // If assignee name is missing but ID exists, resolve it
        if ((!task.assignee || !task.assignee.name || task.assignee.name === 'Unassigned') && task.assigneeId) {
          const resolved = await resolveUser(task.assigneeId);
          if (resolved) {
            return {
              ...task,
              assignee: { ...task.assignee, ...resolved }
            };
          }
        }
        return task;
      }));

      setAllTasks(enrichedTasks);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate consistent visual props for projects
  const getProjectVisuals = (index: number) => {
    const colors = ['bg-blue-300', 'bg-red-300', 'bg-purple-300', 'bg-green-300'];
    const icons = ['🌐', '📱', '📊', '🚀'];
    return {
      color: colors[index % colors.length],
      icon: icons[index % icons.length],
      // Mock progress and members for now as they aren't in the basic project API
      progress: Math.floor(Math.random() * 60) + 20,
      teamMembers: [
        { initials: 'JD', color: 'bg-blue-500' },
        { initials: 'TS', color: 'bg-purple-500' },
      ]
    };
  };

  // Task filtering logic
  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  const upcomingDeadlines = allTasks
    .filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= threeDaysFromNow;
    })
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  const recentTasks = [...allTasks]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-50 text-red-600';
      case 'medium':
        return 'bg-orange-50 text-orange-600';
      case 'low':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatus = (status: any) => {
    if (typeof status === 'string') return status;
    return status?.name || 'Todo';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Recent Projects - Horizontal Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
          <button
            onClick={onNavigateToProjects}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View All
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
            ))
          ) : projects.length === 0 ? (
            <div className="col-span-3 text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No projects found. Create one to get started!</p>
            </div>
          ) : (
            projects.map((project, index) => {
              const visuals = getProjectVisuals(index);
              return (
                <div
                  key={project.id || project.projectKey || index}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all hover:border-gray-300"
                >
                  <div className={`${visuals.color} p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-lg">{visuals.icon}</span>
                      <h3 className="font-semibold text-black text-sm truncate max-w-[150px]" title={project.name}>
                        {project.name}
                      </h3>
                    </div>
                    <button className="p-1 hover:bg-white/20 rounded transition-colors">
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-700 mb-2">
                        {visuals.progress}% Complete
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`${visuals.color} h-2 rounded-full transition-all`}
                          style={{ width: `${visuals.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center -space-x-2">
                      {visuals.teamMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white`}
                          title={member.initials}
                        >
                          {member.initials}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Deadlines</h2>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg"></div>)
            ) : upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines in the next 3 days.</p>
            ) : (
              upcomingDeadlines.map((task, index) => (
                <div
                  key={task.taskId || task.id || `deadline-${index}`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                      {task.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 mb-1 font-mono uppercase">{task.taskKey || task.key}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-medium">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'No date'}
                      </span>
                      <span>•</span>
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tasks - Compact View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Tasks</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Tasks
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Task</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Key</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Assignee</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Priority</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="border-b border-gray-50">
                      <td colSpan={5} className="py-4 px-6"><div className="h-4 bg-gray-50 animate-pulse rounded"></div></td>
                    </tr>
                  ))
                ) : recentTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500 text-sm">No tasks found.</td>
                  </tr>
                ) : (
                  recentTasks.map((task, index) => (
                    <tr
                      key={task.taskId || task.id || `recent-${index}`}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={getStatus(task.status) === 'Done'}
                            readOnly
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="font-medium text-gray-900 line-clamp-1">{task.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs font-mono text-gray-500">{task.taskKey || task.key || 'TASK-N/A'}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {task.assignee?.avatar ? (
                            <img src={task.assignee.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                              {task.assignee?.name?.split(' ').map(n => n[0]).join('') || '?'}
                            </div>
                          )}
                          <span className="text-sm text-gray-700 font-medium">{task.assignee?.name || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority || 'Low')}`}>
                          {task.priority || 'Low'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatus(task.status) === 'Done' ? 'text-green-600 bg-green-50' :
                          getStatus(task.status) === 'In Progress' ? 'text-blue-600 bg-blue-50' :
                            'text-gray-600 bg-gray-50'
                          }`}>
                          {getStatus(task.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
