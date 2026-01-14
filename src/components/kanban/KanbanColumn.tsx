import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { KanbanColumn as KanbanColumnType, TaskCard } from '../../types/kanban.types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  projectName?: string;
  onDragStart: (e: React.DragEvent, task: TaskCard) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, statusId: string) => void;
  onAddTask: (statusId: string) => void;
  onTaskClick: (taskId: string) => void;
}

export default function KanbanColumn({
  column,
  projectName,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onAddTask,
  onTaskClick,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOver(e);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, column.statusId);
  };

  return (
    <div className="flex-shrink-0 w-80 bg-gray-50 rounded-xl p-4 border border-gray-200">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 text-lg">{column.name}</h3>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
            {column.tasks.length}
          </span>
        </div>
        <button
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors group"
          title="Add Task"
          onClick={() => onAddTask(column.statusId)}
        >
          <Plus className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto rounded-lg p-2 transition-all duration-200 ${
          isDragOver
            ? 'bg-blue-50 border-2 border-dashed border-blue-400'
            : 'bg-transparent'
        }`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 transparent',
        }}
      >
        {/* Tasks */}
        {column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <KanbanCard
              key={task.taskId}
              task={task}
              projectName={projectName}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={() => onTaskClick(task.taskId)}
            />
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg
              className="w-16 h-16 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm font-medium">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}
