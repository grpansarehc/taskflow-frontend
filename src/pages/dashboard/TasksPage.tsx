import { useState, useEffect } from 'react';
import TasksHeader from '../../components/tasks/TasksHeader';
import TaskTable from '../../components/tasks/TaskTable';
import TaskDetailModal from '../../components/kanban/TaskDetailModal';
import { taskService } from '../../services/task.service';
import type { TaskApiResponse } from '../../services/task.service';
import type { Task } from '../../components/tasks/data';
import { useToast } from '../../components/common/ToastProvider';

export default function TasksPage() {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Modal State
    const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [activeProjectId, _setActiveProjectId] = useState<string>('mock-project-1'); // Default/Mock for now

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAssignee, setFilterAssignee] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'my-issues' | 'overdue'>('all');

    // Get logged in user ID
    const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await taskService.getAllTasks();
                const tasksWithDetails = await Promise.all(
                    data.map(async (t: TaskApiResponse) => {
                        const priorityValue = t.priority ? (t.priority.charAt(0).toUpperCase() + t.priority.slice(1).toLowerCase()) : 'Medium';
                        const priority = (['Low', 'Medium', 'High', 'Critical'].includes(priorityValue) ? priorityValue : 'Medium') as Task['priority'];

                        // Handle Assignee fetching using assigneeId 
                        let assigneeName = t.assigneeName || t.assignee?.name || 'Unassigned';
                        let assigneeAvatar = t.assigneeAvatar || t.assignee?.avatar;

                        if (t.assigneeId && (!assigneeName || assigneeName === 'Unassigned')) {
                            const user = await taskService.getUserById(t.assigneeId);
                            if (user) {
                                // Construct name from first/last if available, else username/email
                                const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
                                assigneeName = fullName || user.username || user.name || user.email || 'Unknown';
                            }
                        }

                        if (!assigneeAvatar) {
                            assigneeAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(assigneeName)}&background=random`;
                        }

                        const reporterName = t.reporterName || t.reporter?.name || 'Unknown';
                        const reporterAvatar = t.reporterAvatar || t.reporter?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reporterName)}&background=random`;

                        return {
                            id: t.id || t.taskId || '',
                            key: t.key || t.taskKey || `DEV-${(t.id || t.taskId || '').substring(0, 4).toUpperCase()}`,
                            title: t.title,
                            // Store assigneeId for filtering
                            assignee: {
                                name: assigneeName,
                                avatar: assigneeAvatar,
                                id: t.assigneeId
                            },
                            reporter: {
                                name: reporterName,
                                avatar: reporterAvatar
                            },
                            priority: priority,
                            status: getStatusLabel(t.statusId || (typeof t.status === 'string' ? t.status : t.status?.name) || t.statusName),
                            resolution: t.resolution,
                            created: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '',
                            updated: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : '',
                            // Use raw date string if available, or format to YYYY-MM-DD for consistency in filtering
                            dueDate: t.dueDate ? t.dueDate.split('T')[0] : ''
                        };
                    })
                );
                setTasks(tasksWithDetails);
            } catch (error) {
                console.error("Failed to fetch tasks", error);
                addToast({ message: "Failed to load tasks", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [addToast]);

    // Helper to map status ID/Name to Task Status
    const getStatusLabel = (status: string | undefined): Task['status'] => {
        if (!status) return 'To Do';

        // Normalize: lowercase, remove special chars
        const normalized = status.toString().toLowerCase().trim().replace(/[\s_-]+/g, '');

        if (['done', 'completed', 'resolved', 'closed', 'finished'].includes(normalized)) return 'Done';
        if (['inprogress', 'inreview', 'doing', 'ongoing', 'working', 'review'].includes(normalized)) return 'In Progress';

        return 'To Do';
    };

    // Filtering Logic
    const filteredTasks = tasks.filter(task => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.key.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesAssignee = filterAssignee
            ? task.assignee.name.toLowerCase().includes(filterAssignee.toLowerCase())
            : true;

        const matchesDate = filterDate
            ? task.dueDate === filterDate
            : true;

        let matchesQuickFilter = true;
        if (activeQuickFilter === 'my-issues') {
            // Filter by assigneeId matching currentUserId
            matchesQuickFilter = task.assignee.id === currentUserId;
        } else if (activeQuickFilter === 'overdue') {
            // Overdue: Due date exists, is before today, and task is not Done
            if (!task.dueDate) {
                matchesQuickFilter = false;
            } else {
                const today = new Date();
                const dueDate = new Date(task.dueDate);
                // Reset time for comparison
                today.setHours(0, 0, 0, 0);
                dueDate.setHours(0, 0, 0, 0);

                matchesQuickFilter = dueDate < today && task.status !== 'Done';
            }
        }

        return matchesSearch && matchesAssignee && matchesDate && matchesQuickFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full">
            <TasksHeader
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterAssignee={filterAssignee}
                setFilterAssignee={setFilterAssignee}
                filterDate={filterDate}
                setFilterDate={setFilterDate}
                activeQuickFilter={activeQuickFilter}
                setActiveQuickFilter={setActiveQuickFilter}
            />
            <div className="flex-1 min-h-0">
                {viewMode === 'list' ? (
                    <div className="h-full flex flex-col">
                        <TaskTable
                            tasks={filteredTasks}
                            onViewTask={(taskId) => {
                                setSelectedTaskId(taskId);
                                setIsTaskDetailModalOpen(true);
                            }}
                            onAddComment={(taskId) => {
                                // For now, just open the same modal
                                setSelectedTaskId(taskId);
                                setIsTaskDetailModalOpen(true);
                            }}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto h-full pb-6 pr-2">
                        {filteredTasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer relative"
                                onClick={() => {
                                    setSelectedTaskId(task.id);
                                    setIsTaskDetailModalOpen(true);
                                }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-mono text-gray-400 group-hover:text-blue-600 transition-colors uppercase">{task.key}</span>
                                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                        task.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {task.priority}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-4 line-clamp-2 leading-snug">{task.title}</h3>

                                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img src={task.assignee.avatar} className="w-6 h-6 rounded-full ring-2 ring-white" alt={task.assignee.name} />
                                        <span className="text-xs text-gray-600 font-medium">{task.assignee.name.split(' ')[0]}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${task.status === 'Done' ? 'bg-green-50 text-green-700 border border-green-200' :
                                        task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                            'bg-gray-100 text-gray-700 border border-gray-200'
                                        }`}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Task Detail Modal */}
            {activeProjectId && (
                <TaskDetailModal
                    isOpen={isTaskDetailModalOpen}
                    onClose={() => setIsTaskDetailModalOpen(false)}
                    taskId={selectedTaskId}
                    projectId={activeProjectId}
                    projectName="Project" // Todo: Fetch actual name
                    statuses={[{ id: 'todo', name: 'To Do' }, { id: 'in-progress', name: 'In Progress' }, { id: 'done', name: 'Done' }]} // Todo: Fetch actual statuses
                />
            )}
        </div>
    );
}
