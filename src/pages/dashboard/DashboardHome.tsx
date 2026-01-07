import {
  Clock,
  MoreVertical,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface DashboardHomeProps {
  onNavigateToProjects?: () => void;
}

export default function DashboardHome({ onNavigateToProjects }: DashboardHomeProps) {
  const recentProjects = [
    {
      name: 'Website Redesign',
      progress: 65,
      teamMembers: [
        { initials: 'SJ', color: 'bg-blue-500' },
        { initials: 'MC', color: 'bg-purple-500' },
        { initials: 'EW', color: 'bg-pink-500' },
      ],
      color: 'bg-blue-300',
      icon: '🌐',
    },
    {
      name: 'Mobile App Development',
      progress: 42,
      teamMembers: [
        { initials: 'JD', color: 'bg-green-500' },
        { initials: 'AS', color: 'bg-orange-500' },
        { initials: 'KL', color: 'bg-indigo-500' },
      ],
      color: 'bg-red-300',
      icon: '📱',
    },
    {
      name: 'Marketing Campaign Q3',
      progress: 20,
      teamMembers: [
        { initials: 'RT', color: 'bg-purple-500' },
        { initials: 'MK', color: 'bg-pink-500' },
        { initials: 'LN', color: 'bg-yellow-500' },
      ],
      color: 'bg-purple-300',
      icon: '📊',
    },
  ];

  const recentTasks = [
    {
      title: 'Design new landing page',
      project: 'Website Redesign',
      assignee: 'Sarah Johnson',
      priority: 'High',
      status: 'In Progress',
      priorityColor: 'text-red-600 bg-red-50',
    },
    {
      title: 'Implement user authentication',
      project: 'Mobile App',
      assignee: 'Mike Chen',
      priority: 'High',
      status: 'In Progress',
      priorityColor: 'text-red-600 bg-red-50',
    },
    {
      title: 'Create social media content',
      project: 'Marketing Campaign',
      assignee: 'Emma Wilson',
      priority: 'Medium',
      status: 'To Do',
      priorityColor: 'text-orange-600 bg-orange-50',
    },
    {
      title: 'Update documentation',
      project: 'Website Redesign',
      assignee: 'John Doe',
      priority: 'Low',
      status: 'To Do',
      priorityColor: 'text-blue-600 bg-blue-50',
    },
  ];

  const upcomingDeadlines = [
    { task: 'Homepage mockup review', date: 'Today', time: '2:00 PM', project: 'Website Redesign' },
    { task: 'Sprint planning meeting', date: 'Tomorrow', time: '10:00 AM', project: 'Mobile App' },
    { task: 'Client presentation', date: 'Jan 10', time: '3:00 PM', project: 'Marketing Campaign' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, John! 👋
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentProjects.map((project, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all hover:border-gray-300"
            >
              {/* Project Header - Colored Background */}
              <div className={`${project.color} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg">{project.icon}</span>
                  <h3 className="font-semibold text-black text-sm">
                    {project.name}
                  </h3>
                </div>
                <button className="p-1 hover:bg-white/20 rounded transition-colors">
                  <MoreVertical className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Card Body - White Background */}
              <div className="p-5">
                {/* Progress */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {project.progress}% Complete
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${project.color} h-2 rounded-full transition-all`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="flex items-center -space-x-2">
                  {project.teamMembers.map((member, idx) => (
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
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Deadlines</h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {deadline.task}
                  </h4>
                  <p className="text-xs text-gray-500 mb-1">{deadline.project}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium">{deadline.date}</span>
                    <span>•</span>
                    <span>{deadline.time}</span>
                  </div>
                </div>
              </div>
            ))}
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
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Project</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Assignee</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Priority</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-900">{task.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{task.project}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {task.assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-900">{task.assignee}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${task.priorityColor}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-blue-600 bg-blue-50">
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
