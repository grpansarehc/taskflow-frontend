import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../common/ToastProvider';
import { projectService } from '../../services/project.service';
import type { ProjectMemberResponse } from '../../services/project.service';
import type { ProjectResponse } from '../../types/project.types';
import { taskService } from '../../services/task.service';
import { kanbanService } from '../../services/kanban.service';
import type { CreateTaskRequest, WorkflowStatus, TaskCard } from '../../types/kanban.types';
import './CreateTaskModal.css';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  projectId?: string; // Made optional
  projectName?: string; // Made optional
  statuses?: WorkflowStatus[]; // Made optional
  existingTasks?: TaskCard[]; // Made optional
  initialStatusId?: string;
  projects?: ProjectResponse[]; // New prop for global mode
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
  projectId: propProjectId,
  projectName: propProjectName,
  statuses: propStatuses,
  existingTasks: propExistingTasks,
  initialStatusId,
  projects = [],
}) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<ProjectMemberResponse[]>([]);
  
  // Internal state for fetching data in global mode
  const [fetchedStatuses, setFetchedStatuses] = useState<WorkflowStatus[]>([]);
  const [fetchedTasks, setFetchedTasks] = useState<TaskCard[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Derived values (use props if available, otherwise use fetched data)
  const currentProjectId = propProjectId || selectedProjectId;
  const currentStatuses = propStatuses || fetchedStatuses;
  const currentExistingTasks = propExistingTasks || fetchedTasks;
  const currentProjectName = propProjectName || projects.find(p => p.id === currentProjectId)?.name || '';

  const [formData, setFormData] = useState<Partial<CreateTaskRequest>>({
    title: '',
    description: '',
    taskType: 'USER_STORY',
    priority: 'MEDIUM',
    statusId: '',
    projectId: currentProjectId,
  });
  
  // Filter options for parent tasks based on selected task type
  const getParentTaskOptions = () => {
    switch (formData.taskType) {
      case 'USER_STORY':
        // User Stories can only have Epics as parents
        return currentExistingTasks.filter(task => task.taskType === 'EPIC');
      case 'SUBTASK':
        // Subtasks can only have User Stories as parents
        return currentExistingTasks.filter(task => task.taskType === 'USER_STORY');
      case 'EPIC':
        // Epics cannot have parents
        return [];
      default:
        // Bugs can optionally have parents (usually User Stories or Epics), or independent
        return currentExistingTasks.filter(task => task.taskType === 'EPIC' || task.taskType === 'USER_STORY');
    }
  };

  const parentOptions = getParentTaskOptions();

  // Fetch Board Data when project changes (if not provided via props)
  useEffect(() => {
    if (isOpen && currentProjectId && !propStatuses) {
        const fetchBoardData = async () => {
            try {
                const board = await kanbanService.getKanbanBoard(currentProjectId);
                const extractedStatuses = board.columns.map((col, index) => ({
                    id: col.statusId,
                    name: col.name,
                    position: index,
                    projectId: currentProjectId
                }));
                const extractedTasks = board.columns.flatMap(col => col.tasks);
                
                setFetchedStatuses(extractedStatuses);
                setFetchedTasks(extractedTasks);
                
                // Default status
                if (!formData.statusId) {
                   setFormData(prev => ({ ...prev, statusId: extractedStatuses[0]?.id || '' }));
                }
            } catch (error) {
                console.error("Failed to fetch board data", error);
            }
        };
        fetchBoardData();
    }
  }, [isOpen, currentProjectId, propStatuses]);

  useEffect(() => {
    if (isOpen) {
        if (propProjectId) {
             // If props provided, sync them
            setFormData(prev => ({ 
                ...prev, 
                projectId: propProjectId, 
                statusId: initialStatusId || propStatuses?.[0]?.id || '' 
            }));
        } else if (!selectedProjectId && projects.length > 0) {
            // Default to first project if no selection
             setSelectedProjectId(projects[0].id);
        }
    }
  }, [isOpen, propProjectId, initialStatusId, propStatuses, projects]);

  // Fetch members when project ID is available
  useEffect(() => {
    if (isOpen && currentProjectId) {
        fetchMembers(currentProjectId);
    }
  }, [isOpen, currentProjectId]);

  const fetchMembers = async (id: string) => {
    try {
      const data = await projectService.getProjectMembers(id);
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members', error);
      addToast({ message: 'Failed to load project members', type: 'error' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.statusId || !formData.projectId) {
        addToast({ message: 'Please fill in all required fields', type: 'error' });
        return;
    }

    setLoading(true);
    try {
      await taskService.createTask(formData as CreateTaskRequest);
      addToast({ message: 'Task created successfully', type: 'success' });
      onTaskCreated();
      onClose();
    } catch (error: any) {
      addToast({ message: error.message || 'Failed to create task', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="create-task-form">
        <div className="form-group">
          <label htmlFor="project">Project</label>
          {propProjectId ? (
             // Locked View
            <input
                type="text"
                id="project"
                value={currentProjectName}
                disabled
                className="bg-gray-100 cursor-not-allowed"
            />
          ) : (
             // Selectable View
             <select
                 id="projectId"
                 name="projectId"
                 value={selectedProjectId}
                 onChange={(e) => {
                     setSelectedProjectId(e.target.value);
                     setFormData(prev => ({ ...prev, projectId: e.target.value, statusId: '' }));
                 }}
                 required
             >
                 {projects.map(p => (
                     <option key={p.id} value={p.id}>{p.name}</option>
                 ))}
             </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Task description"
            rows={4}
          />
        </div>

        <div className="form-row">
            <div className="form-group">
            <label htmlFor="taskType">Type *</label>
            <select
                id="taskType"
                name="taskType"
                value={formData.taskType}
                onChange={handleChange}
                required
            >
                <option value="USER_STORY">User Story</option>
                <option value="EPIC">Epic</option>
                <option value="BUG">Bug</option>
                <option value="SUBTASK">Subtask</option>
            </select>
            </div>

            <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
            >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
            </select>
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
            <label htmlFor="parentTaskId">Parent Task</label>
            <select
                id="parentTaskId"
                name="parentTaskId"
                value={formData.parentTaskId || ''}
                onChange={handleChange}
                disabled={formData.taskType === 'EPIC'}
                className={formData.taskType === 'EPIC' ? 'bg-gray-100 cursor-not-allowed' : ''}
            >
                <option value="">{formData.taskType === 'EPIC' ? 'Not Applicable' : 'No Parent'}</option>
                {parentOptions.map(task => (
                    <option key={task.taskId} value={task.taskId}>
                        {task.title}
                    </option>
                ))}
            </select>
            {formData.taskType === 'USER_STORY' && parentOptions.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                    No Epics found. Create an Epic first.
                </p>
            )}
            </div>

            <div className="form-group">
            <label htmlFor="statusId">Status *</label>
            <select
                id="statusId"
                name="statusId"
                value={formData.statusId}
                onChange={handleChange}
                required
            >
                {currentStatuses.map(status => (
                    <option key={status.id} value={status.id}>
                        {status.name}
                    </option>
                ))}
            </select>
            </div>

            <div className="form-group">
            <label htmlFor="assigneeId">Assignee</label>
            <select
                id="assigneeId"
                name="assigneeId"
                value={formData.assigneeId || ''}
                onChange={handleChange}
            >
                <option value="">Unassigned</option>
                {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                    {member.name || member.email || member.userId}
                </option>
                ))}
            </select>
            </div>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate || ''}
            onChange={handleChange}
          />
        </div>

        <div className="modal-footer-buttons">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
