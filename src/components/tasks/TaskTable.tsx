
import { useState } from 'react';
import {
    MoreHorizontal,
    ArrowUp,
    ArrowDown,
    Minus,
    Calendar,
    ChevronDown,
    ChevronsUpDown
} from 'lucide-react';
import type { Task } from './data';


interface TaskTableProps {
    tasks: Task[];
    onViewTask?: (taskId: string) => void;
    onAddComment?: (taskId: string) => void;
}

const PriorityIcon = ({ priority }: { priority: Task['priority'] }) => {
    switch (priority) {
        case 'High':
            return <ArrowUp className="w-4 h-4 text-red-500" />;
        case 'Critical':
            return <ArrowUp className="w-4 h-4 text-red-700 font-bold" />;
        case 'Medium':
            return <Minus className="w-4 h-4 text-orange-500 transform rotate-90" />;
        case 'Low':
            return <ArrowDown className="w-4 h-4 text-green-500" />;
        default:
            return null;
    }
};

const StatusBadge = ({ status }: { status: Task['status'] }) => {
    const styles = {
        'To Do': 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
        'In Progress': 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        'Done': 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
    };

    return (
        <button className={`group inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${styles[status]} uppercase tracking-wide transition-colors`}>
            {status}
            <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
};

export default function TaskTable({ tasks, onViewTask, onAddComment }: TaskTableProps) {
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleSelectAll = () => {
        if (selectedTasks.size === tasks.length) {
            setSelectedTasks(new Set());
        } else {
            setSelectedTasks(new Set(tasks.map(t => t.id)));
        }
    };

    const toggleSelectTask = (id: string) => {
        const newSelected = new Set(selectedTasks);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedTasks(newSelected);
    };

    const visibleSortIcon = <ChevronsUpDown className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        <tr>
                            <th className="p-4 w-10">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    checked={selectedTasks.size === tasks.length && tasks.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-4 py-3 min-w-[100px] cursor-pointer hover:bg-gray-100 group transition-colors">
                                <div className="flex items-center gap-1">
                                    Key
                                    {visibleSortIcon}
                                </div>
                            </th>
                            <th className="px-4 py-3 min-w-[300px] cursor-pointer hover:bg-gray-100 group transition-colors">
                                <div className="flex items-center gap-1">
                                    Summary
                                    {visibleSortIcon}
                                </div>
                            </th>
                            <th className="px-4 py-3 min-w-[150px] cursor-pointer hover:bg-gray-100 group transition-colors">
                                <div className="flex items-center gap-1">
                                    Assignee
                                    {visibleSortIcon}
                                </div>
                            </th>
                            <th className="px-4 py-3 min-w-[150px] cursor-pointer hover:bg-gray-100 group transition-colors">
                                <div className="flex items-center gap-1">
                                    Reporter
                                    {visibleSortIcon}
                                </div>
                            </th>
                            <th className="px-4 py-3 min-w-[100px] cursor-pointer hover:bg-gray-100 group transition-colors">
                                <div className="flex items-center gap-1">
                                    Priority
                                    {visibleSortIcon}
                                </div>
                            </th>
                            <th className="px-4 py-3 min-w-[120px] cursor-pointer hover:bg-gray-100 group transition-colors">
                                <div className="flex items-center gap-1">
                                    Status
                                    {visibleSortIcon}
                                </div>
                            </th>
                            <th className="px-4 py-3 min-w-[100px] cursor-pointer hover:bg-gray-100 group transition-colors">
                                <div className="flex items-center gap-1">
                                    Resolution
                                    {visibleSortIcon}
                                </div>
                            </th>
                            <th className="px-4 py-3 min-w-[120px] cursor-pointer hover:bg-gray-100 group transition-colors">
                                <div className="flex items-center gap-1">
                                    Created
                                    {visibleSortIcon}
                                </div>
                            </th>
                            <th className="px-4 py-3 min-w-[120px] cursor-pointer hover:bg-gray-100 group transition-colors">
                                <div className="flex items-center gap-1">
                                    Updated
                                    {visibleSortIcon}
                                </div>
                            </th>
                            <th className="px-4 py-3 min-w-[120px] cursor-pointer hover:bg-gray-100 group transition-colors">
                                <div className="flex items-center gap-1">
                                    Due Date
                                    {visibleSortIcon}
                                </div>
                            </th>
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tasks.map((task) => (
                            <tr
                                key={task.id}
                                className={`group hover:bg-gray-50 transition-colors ${selectedTasks.has(task.id) ? 'bg-blue-50/30' : ''}`}
                                onClick={() => { }}
                            >
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        checked={selectedTasks.has(task.id)}
                                        onChange={() => toggleSelectTask(task.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>
                                <td className="px-4 py-3 align-middle font-medium">
                                    <a href="#" className="text-blue-600 hover:underline hover:text-blue-800">
                                        {task.key}
                                    </a>
                                </td>
                                <td className="px-4 py-3 align-middle text-gray-900 font-medium">
                                    {task.title}
                                </td>
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center gap-2">
                                        <img src={task.assignee.avatar} alt="" className="w-6 h-6 rounded-full bg-gray-200" />
                                        <span className="text-sm text-gray-700 truncate max-w-[120px]">{task.assignee.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center gap-2">
                                        <img src={task.reporter.avatar} alt="" className="w-6 h-6 rounded-full bg-gray-200" />
                                        <span className="text-sm text-gray-700 truncate max-w-[120px]">{task.reporter.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex items-center gap-2" title={task.priority}>
                                        <PriorityIcon priority={task.priority} />
                                        <span className="text-sm text-gray-600">{task.priority}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 align-middle">
                                    <StatusBadge status={task.status} />
                                </td>
                                <td className="px-4 py-3 align-middle text-gray-500 text-sm">
                                    {task.resolution || '-'}
                                </td>
                                <td className="px-4 py-3 align-middle text-gray-500 text-sm whitespace-nowrap">
                                    {task.created}
                                </td>
                                <td className="px-4 py-3 align-middle text-gray-500 text-sm whitespace-nowrap">
                                    {task.updated}
                                </td>
                                <td className="px-4 py-3 align-middle text-gray-500 text-sm whitespace-nowrap">
                                    {task.dueDate && (
                                        <div className={`flex items-center gap-1.5 ${new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'text-red-600 font-medium' : ''}`}>
                                            {new Date(task.dueDate) < new Date() && task.status !== 'Done' && <Calendar className="w-3.5 h-3.5" />}
                                            {task.dueDate}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 align-middle text-right">
                                    <div className="relative">
                                        <button
                                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Toggle dropdown for this specific task
                                                if (activeDropdown === task.id) {
                                                    setActiveDropdown(null);
                                                } else {
                                                    setActiveDropdown(task.id);
                                                }
                                            }}
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>

                                        {activeDropdown === task.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-20"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveDropdown(null);
                                                    }}
                                                />
                                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-30 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onViewTask?.(task.id);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        View Task
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onAddComment?.(task.id);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        Add Comment
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{tasks.length}</span> of <span className="font-medium text-gray-900">{tasks.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
