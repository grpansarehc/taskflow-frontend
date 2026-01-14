import React, { useState, useEffect } from 'react';
import { X, Share2, MoreHorizontal, Link as LinkIcon, Calendar, Clock, Lock, GitBranch, GitCommit, ChevronRight, CheckSquare, Plus } from 'lucide-react';
import Modal from '../common/Modal';
import { taskService } from '../../services/task.service';
import type { TaskCard } from '../../types/kanban.types';
import { useToast } from '../common/ToastProvider';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  projectId: string;
  projectName: string;
  statuses: { id: string; name: string }[];
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  taskId,
  projectId,
  projectName,
  statuses,
}) => {
  const { addToast } = useToast();
  const [task, setTask] = useState<TaskCard | null>(null);
  const [subtasks, setSubtasks] = useState<TaskCard[]>([]);
  const [loading, setLoading] = useState(false);

  const formatTaskId = (id: string | null | undefined) => {
      if (!id) return '';
      if (id.startsWith('task-')) return `DEV-${id.split('-')[1]}`;
      return `DEV-${id.substring(0, 4).toUpperCase()}`;
  };

  const getStatusName = (statusId: string) => {
      const status = statuses.find(s => s.id === statusId);
      return status ? status.name : 'Unknown';
  };

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails(taskId);
    } else {
      setTask(null);
    }
  }, [isOpen, taskId]);

  const fetchTaskDetails = async (id: string) => {
    setLoading(true);
    try {
      const [taskData, subtasksData] = await Promise.all([
        taskService.getTaskById(id),
        taskService.getSubtasks(id)
      ]);
      setTask(taskData);
      setSubtasks(subtasksData);
    } catch (error) {
      console.error('Failed to fetch task details', error);
      addToast({ message: 'Failed to load task details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
             {/* Breadcrumbs */}
            <span className="font-medium hover:underline cursor-pointer">{projectName}</span>
            <span className="text-gray-300">/</span>
            <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                {task?.taskType === 'USER_STORY' ? <div className="p-0.5 bg-green-100 rounded text-green-700 font-bold text-[10px]">US</div> : <div className="w-4 h-4 rounded bg-red-100" />}
                <span>{formatTaskId(task?.taskId)}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-100">
                <Lock className="w-4 h-4" />
             </button>
             <button className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-100 flex items-center gap-1 text-sm bg-gray-50">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
             </button>
             <button className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-100">
                <MoreHorizontal className="w-4 h-4" />
             </button>
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-100 ml-2">
                <X className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Modal Content */}
        {loading ? (
             <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             </div>
        ) : task ? (
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Column: Main Content */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-300">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">{task.title}</h1>
                    
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                             <h3 className="text-sm font-semibold text-gray-900">Description</h3>
                        </div>
                        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {task.description || "No description provided."}
                        </div>
                    </div>

                    <div className="mb-8">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                Subtasks
                            </h3>
                            <div className="flex items-center gap-2">
                                <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Static Subtask Progress Bar (Hidden for now as requested) */}
                        
                        {/* Static Subtask List Table (Mock for layout) */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                             <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                 <div className="flex-1">Work</div>
                                 <div className="w-20 text-center">Priority</div>
                                 <div className="w-20 text-center">Assignee</div>
                                 <div className="w-24 text-center">Status</div>
                             </div>
                             
                             <div className="divide-y divide-gray-100">
                                 {subtasks.length > 0 ? (
                                     subtasks.map((subtask) => (
                                         <div key={subtask.taskId} className="px-4 py-3 flex items-center hover:bg-gray-50 text-sm">
                                             <div className="flex-1 flex items-center gap-2">
                                                 <div className="w-4 h-4 border-2 border-blue-500 rounded-sm flex items-center justify-center">
                                                     <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                                                 </div>
                                                 <span className="text-gray-400 font-mono text-xs">
                                                     {formatTaskId(subtask.taskId)}
                                                 </span>
                                                 <span className="text-gray-700 truncate">{subtask.title}</span>
                                             </div>
                                             <div className="w-20 text-center flex justify-center">
                                                 <div 
                                                    className={`w-4 h-0.5 rounded-full ${
                                                        subtask.priority === 'HIGH' || subtask.priority === 'CRITICAL' ? 'bg-red-500' :
                                                        subtask.priority === 'LOW' ? 'bg-green-500' : 'bg-orange-400'
                                                    }`} 
                                                    title={subtask.priority} 
                                                 />
                                             </div>
                                              <div className="w-20 flex justify-center">
                                                  {subtask.assigneeId ? (
                                                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                                                          GP
                                                      </div>
                                                  ) : (
                                                      <span className="text-gray-400 text-xs">-</span>
                                                  )}
                                              </div>
                                             <div className="w-24 flex justify-center">
                                                 <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium uppercase truncate max-w-full">
                                                    {getStatusName(subtask.statusId)}
                                                 </span>
                                             </div>
                                         </div>
                                     ))
                                 ) : (
                                     <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                         No subtasks found
                                     </div>
                                 )}
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="w-full md:w-[350px] bg-gray-50 border-l border-gray-200 overflow-y-auto p-6 scrollbar-thin">
                    
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Status</label>
                        <div className="relative">
                            <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                <span className="text-sm font-semibold text-gray-700 uppercase">{getStatusName(task.statusId)}</span>
                                <ChevronRight className="w-4 h-4 rotate-90 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6 border-t border-gray-200 pt-6">
                         {/* Details Group */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Details</h3>
                            
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-500">Assignee</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">GP</div>
                                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">Ganesh Pansare</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-500">Labels</label>
                                <span className="text-sm text-gray-400">None</span>
                            </div>

                             <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-500">Parent</label>
                                <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded border border-gray-200 w-fit">
                                     <div className="w-3 h-3 bg-purple-500 rounded-sm" />
                                     <span className="text-xs font-medium text-gray-700">
                                        {formatTaskId(task.parentTaskId)} Parent
                                     </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-500">Due date</label>
                                <span className="text-sm text-gray-700">{task.dueDate || 'None'}</span>
                            </div>

                            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-500">Start date</label>
                                <span className="text-sm text-gray-700">{task.startDate || 'None'}</span>
                            </div>
                        </div>
                        
                         {/* Development Section (Static) */}
                        <div className="space-y-3 border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Development</h3>
                            
                            <div className="flex items-center gap-2 text-sm text-blue-600 hover:underline cursor-pointer">
                                <GitBranch className="w-4 h-4" />
                                <span>Create branch</span>
                            </div>
                             <div className="flex items-center gap-2 text-sm text-blue-600 hover:underline cursor-pointer">
                                <GitCommit className="w-4 h-4" />
                                <span>Create commit</span>
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-200">
                             <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                                <label className="text-sm text-gray-500">Reporter</label>
                                <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">GP</div>
                                    <span className="text-sm text-gray-700">Ganesh Pansare</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 text-xs text-gray-400 flex flex-col gap-1">
                             <p>Created {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Just now'}</p>
                             <p>Updated {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'Just now'}</p>
                        </div>
                    </div>
                </div>

            </div>
        ) : (
             <div className="flex-1 flex items-center justify-center text-gray-500">
                 Task not found
             </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal;
