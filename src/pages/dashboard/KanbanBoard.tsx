import { useState, useEffect } from 'react';
import { ChevronDown, RefreshCw, Layers, Plus } from 'lucide-react';
import CreateTaskModal from '../../components/kanban/CreateTaskModal';
import TaskDetailModal from '../../components/kanban/TaskDetailModal';
import { kanbanService } from '../../services/kanban.service';
import { projectService } from '../../services/project.service';
import type { KanbanBoard as KanbanBoardType, TaskCard, MoveTaskRequest } from '../../types/kanban.types';
import type { ProjectResponse } from '../../types/project.types';
import { useToast } from '../../components/common/ToastProvider';
import KanbanColumn from '../../components/kanban/KanbanColumn';

// Mock data for demonstration
const MOCK_BOARD: KanbanBoardType = {
  projectId: 'mock-project-1',
  columns: [
    {
      statusId: 'todo',
      name: 'To Do',
      tasks: [
        {
          taskId: 'task-1',
          title: 'Design new landing page',
          description: 'Create wireframes and mockups for the new landing page',
          statusId: 'todo',
          position: 0,
          priority: 'HIGH',
          taskType: 'USER_STORY',
          dueDate: '2026-01-15',
        },
        {
          taskId: 'task-2',
          title: 'Setup authentication system',
          description: 'Implement JWT-based authentication',
          statusId: 'todo',
          position: 1,
          priority: 'CRITICAL',
          taskType: 'USER_STORY',
          assigneeId: 'user-1',
        },
        {
          taskId: 'task-3',
          title: 'Write API documentation',
          statusId: 'todo',
          position: 2,
          priority: 'MEDIUM',
          taskType: 'USER_STORY',
        },
      ],
    },
    {
      statusId: 'in-progress',
      name: 'In Progress',
      tasks: [
        {
          taskId: 'task-4',
          title: 'Implement drag-and-drop feature',
          description: 'Add drag and drop functionality to Kanban board',
          statusId: 'in-progress',
          position: 0,
          priority: 'HIGH',
          taskType: 'USER_STORY',
          assigneeId: 'user-2',
          dueDate: '2026-01-12',
        },
        {
          taskId: 'task-5',
          title: 'Fix responsive layout issues',
          statusId: 'in-progress',
          position: 1,
          priority: 'MEDIUM',
          taskType: 'BUG',
          assigneeId: 'user-1',
        },
      ],
    },
    {
      statusId: 'review',
      name: 'In Review',
      tasks: [
        {
          taskId: 'task-6',
          title: 'Update user profile page',
          description: 'Add new fields and improve UI',
          statusId: 'review',
          position: 0,
          priority: 'MEDIUM',
          taskType: 'USER_STORY',
          assigneeId: 'user-3',
        },
      ],
    },
    {
      statusId: 'done',
      name: 'Done',
      tasks: [
        {
          taskId: 'task-7',
          title: 'Setup project repository',
          statusId: 'done',
          position: 0,
          priority: 'HIGH',
          taskType: 'USER_STORY',
        },
        {
          taskId: 'task-8',
          title: 'Configure CI/CD pipeline',
          description: 'Setup GitHub Actions for automated testing',
          statusId: 'done',
          position: 1,
          priority: 'MEDIUM',
          taskType: 'USER_STORY',
          assigneeId: 'user-2',
        },
      ],
    },
  ],
};

const MOCK_PROJECTS: ProjectResponse[] = [
  {
    id: 'mock-project-1',
    name: 'TaskFlow Development',
    projectKey: 'TFD',
    description: 'Main development project for TaskFlow application',
    type: 'SOFTWARE',
    ownerId: 'user-1',
    createdAt: '2026-01-01',
  },
  {
    id: 'mock-project-2',
    name: 'Marketing Campaign',
    projectKey: 'MKT',
    description: 'Q1 2026 marketing initiatives',
    type: 'MARKETING',
    ownerId: 'user-2',
    createdAt: '2026-01-05',
  },
];

export default function KanbanBoard() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
  const [board, setBoard] = useState<KanbanBoardType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<TaskCard | null>(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [activeStatusId, setActiveStatusId] = useState<string | undefined>(undefined);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [useMockData] = useState(false); // Set to false to use real backend API
  const { addToast } = useToast();

  // Fetch projects on mount
  useEffect(() => {
    if (!useMockData) {
      fetchProjects();
    }
  }, [useMockData]);

  // Fetch board when project is selected
  useEffect(() => {
    if (selectedProject && !useMockData) {
      fetchBoard(selectedProject.id);
    }
  }, [selectedProject, useMockData]);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to load projects' });
    }
  };

  const fetchBoard = async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await kanbanService.getKanbanBoard(projectId);
      
      // Filter out subtasks from the board view
      if (data && data.columns) {
        data.columns = data.columns.map(col => ({
          ...col,
          tasks: col.tasks.filter(t => t.taskType !== 'SUBTASK')
        }));
      }

      setBoard(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load Kanban board';
      setError(errorMessage);
      addToast({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, task: TaskCard) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatusId: string) => {
    e.preventDefault();
    
    if (!draggedTask || !board) return;

    // Don't do anything if dropped in the same column
    if (draggedTask.statusId === newStatusId) {
      setDraggedTask(null);
      return;
    }

    // Find the target column
    const targetColumn = board.columns.find(col => col.statusId === newStatusId);
    if (!targetColumn) return;

    // Calculate new position (add to end of column)
    const newPosition = targetColumn.tasks.length;

    // Optimistic UI update
    const updatedColumns = board.columns.map(column => {
      if (column.statusId === draggedTask.statusId) {
        // Remove from old column
        return {
          ...column,
          tasks: column.tasks.filter(t => t.taskId !== draggedTask.taskId),
        };
      } else if (column.statusId === newStatusId) {
        // Add to new column
        return {
          ...column,
          tasks: [...column.tasks, { ...draggedTask, statusId: newStatusId, position: newPosition }],
        };
      }
      return column;
    });

    setBoard({ ...board, columns: updatedColumns });
    setDraggedTask(null);

    // Show success message for mock data
    if (useMockData) {
      addToast({ type: 'success', message: 'Task moved successfully! (Demo mode)' });
      return;
    }

    // Call API to persist the change (only when not using mock data)
    try {
      const moveRequest: MoveTaskRequest = {
        statusId: newStatusId,
        position: newPosition,
      };
      await kanbanService.moveTask(draggedTask.taskId, moveRequest);
      addToast({ type: 'success', message: 'Task moved successfully!' });
    } catch (err: any) {
      // Revert on error
      setBoard(board);
      addToast({ type: 'error', message: err.message || 'Failed to move task' });
    }
  };

  const handleAddTask = (statusId: string) => {
    setActiveStatusId(statusId);
    setIsCreateTaskModalOpen(true);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailModalOpen(true);
  };

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Layers className="w-8 h-8 text-blue-600" />
            Kanban Board
          </h1>
          <p className="text-gray-600">Visualize and manage your project tasks</p>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center gap-3">
          {/* Create Task Button */}
          {selectedProject && (
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Create Task</span>
            </button>
          )}

          {/* Project Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-400 transition-colors shadow-sm"
            >
              <span className="font-medium text-gray-900">
                {selectedProject ? selectedProject.name : 'Select Project'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Content */}
            {showProjectDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setShowProjectDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                      selectedProject?.id === project.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-900'
                    }`}
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-gray-500">{project.projectKey}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading board...</p>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load board</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => selectedProject && fetchBoard(selectedProject.id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Kanban Board */}
      {!loading && !error && board && (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-sm border border-gray-200 p-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.statusId}
                column={column}
                projectName={selectedProject?.name}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onAddTask={handleAddTask}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State - No Project Selected */}
      {!loading && !error && !selectedProject && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Layers className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No project selected</h3>
          <p className="text-gray-600">Select a project to view its Kanban board</p>
        </div>
      )}
      {/* Create Task Modal */}
      {selectedProject && (
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onTaskCreated={() => fetchBoard(selectedProject.id)}
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          statuses={board ? board.columns.map((col, index) => ({
             id: col.statusId,
             name: col.name,
             position: index,
             projectId: selectedProject.id
          })) : []}
          existingTasks={board ? board.columns.flatMap(col => col.tasks) : []}
          initialStatusId={activeStatusId}
        />
      )}

      {/* Task Detail Modal */}
      {selectedProject && (
        <TaskDetailModal
          isOpen={isTaskDetailModalOpen}
          onClose={() => setIsTaskDetailModalOpen(false)}
          taskId={selectedTaskId}
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          statuses={board ? board.columns.map(col => ({ id: col.statusId, name: col.name })) : []}
        />
      )}
    </div>
  );
}
