import React from 'react';
import { Clock, MoreHorizontal, User, AlertCircle, Calendar, GitBranch, CheckSquare, Square } from 'lucide-react';
import type { TaskCard, Priority } from '../../types/kanban.types';

interface KanbanCardProps {
  task: TaskCard;
  projectName?: string;
  onDragStart: (e: React.DragEvent, task: TaskCard) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onClick: () => void;
}

const priorityConfig: Record<Priority, { color: string; icon: React.ReactNode }> = {
  LOW: { color: 'text-green-600', icon: <div className="rotate-180"><AlertCircle className="w-4 h-4" /></div> },
  MEDIUM: { color: 'text-yellow-600', icon: <AlertCircle className="w-4 h-4" /> },
  HIGH: { color: 'text-orange-600', icon: <AlertCircle className="w-4 h-4" /> },
  CRITICAL: { color: 'text-red-600', icon: <AlertCircle className="w-4 h-4" /> },
};

export default function KanbanCard({ task, projectName, onDragStart, onDragEnd, onClick }: KanbanCardProps) {
  const priority = task.priority || 'MEDIUM';
  const priorityInfo = priorityConfig[priority];

  const formatTaskId = (id: string) => {
    if (id.startsWith('task-')) return `DEV-${id.split('-')[1]}`;
    return `DEV-${id.substring(0, 4).toUpperCase()}`;
  };

  // Helper to format due date
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="group bg-white rounded-lg border border-gray-200 p-3 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 hover:border-blue-300 select-none"
    >
      {/* Header: Title + Menu */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 pr-2">
          {task.title}
        </h4>
        <button className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 flex-shrink-0">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Project Name Badge */}
        {projectName && (
          <span className="px-1.5 py-0.5 bg-orange-700 text-white text-[10px] font-bold uppercase rounded leading-tight tracking-wide">
            {projectName}
          </span>
        )}
        
        {/* Task Type Badge (assuming taskType usually maps to something like 'backend' in user's context, or just showing the type) */}
        {task.taskType && (
          <span className="px-1.5 py-0.5 bg-white border border-green-500 text-green-700 text-[10px] rounded leading-tight">
            {task.taskType.toLowerCase()}
          </span>
        )}

        {/* Due Date Badge */}
        {task.dueDate && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-red-500 text-red-700 text-[10px] rounded leading-tight">
            <AlertCircle className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      {/* Footer Row */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        {/* Left: Checkbox + ID */}
        <div className="flex items-center gap-2">
           {/* Visual checkbox */}
          <div className="text-blue-600">
             <CheckSquare className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-gray-500">
            {formatTaskId(task.taskId)}
          </span>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2">
          {/* Subtask / Hierarchy Icon */}
          <GitBranch className="w-4 h-4 text-gray-400" />
          
          {/* Priority Icon */}
          <div className={`${priorityInfo.color}`} title={`Priority: ${priority}`}>
            {priorityInfo.icon}
          </div>

          {/* Assignee Avatar */}
          {task.assigneeId ? (
             <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-semibold ring-2 ring-white">
               {/* Use dummy initials or fetch */}
               GP
             </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 ring-2 ring-white">
              <User className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
