import {
    Search,
    Save,
    Users,
    LayoutList,
    LayoutGrid,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';

interface TasksHeaderProps {
    viewMode: 'list' | 'grid';
    setViewMode: (mode: 'list' | 'grid') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterAssignee: string;
    setFilterAssignee: (assignee: string) => void;
    filterDate: string; // ISO Date string yyyy-mm-dd
    setFilterDate: (date: string) => void;
    activeQuickFilter: 'all' | 'my-issues' | 'overdue';
    setActiveQuickFilter: (filter: 'all' | 'my-issues' | 'overdue') => void;
}

export default function TasksHeader({
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    filterAssignee,
    setFilterAssignee,
    filterDate,
    setFilterDate,
    activeQuickFilter,
    setActiveQuickFilter
}: TasksHeaderProps) {
    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between item-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">All Issues</h1>

                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>

                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 shadow-sm"
                    />
                </div>

                {/* Filter by Assignee */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Filter by Assignee..."
                        value={filterAssignee}
                        onChange={(e) => setFilterAssignee(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm w-40"
                    />
                </div>

                {/* Filter by Date */}
                <div className="relative">
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    />
                </div>

                {/* Filter Button (Visual only for now or additional filters) */}
                {/* <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          <Filter className="w-4 h-4 text-gray-500" />
          <span>Filter</span>
        </button> */}

                <div className="h-6 w-px bg-gray-300 mx-1"></div>

                {/* Group By */}
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>Group By</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                <div className="h-6 w-px bg-gray-300 mx-1"></div>

                {/* Quick Filters */}
                <button
                    onClick={() => setActiveQuickFilter(activeQuickFilter === 'my-issues' ? 'all' : 'my-issues')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeQuickFilter === 'my-issues' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    My Issues
                </button>
                <button
                    onClick={() => setActiveQuickFilter(activeQuickFilter === 'overdue' ? 'all' : 'overdue')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeQuickFilter === 'overdue' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Overdue
                </button>

                <div className="flex-1"></div>

                {/* Export / Share could go here */}
                <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" />
                    <span>Save View</span>
                </button>

            </div>
        </div>
    );
}
