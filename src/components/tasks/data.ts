
export interface Task {
    id: string;
    key: string;
    title: string;
    assignee: {
        name: string;
        avatar: string;
        id?: string;
    };
    reporter: {
        name: string;
        avatar: string;
    };
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'To Do' | 'In Progress' | 'Done';
    resolution?: string;
    created: string;
    updated: string;
    dueDate: string;
}

export const tasks: Task[] = [
    {
        id: '1',
        key: 'DEV-43',
        title: 'Implement authentication flow',
        assignee: {
            name: 'Alex Johnson',
            avatar: 'https://i.pravatar.cc/150?u=alex',
        },
        reporter: {
            name: 'Sarah Chen',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
        },
        priority: 'High',
        status: 'In Progress',
        created: '2023-10-15',
        updated: '2023-10-18',
        dueDate: '2023-10-25',
    },
    {
        id: '2',
        key: 'DEV-44',
        title: 'Fix navigation bar responsiveness',
        assignee: {
            name: 'Mike Smith',
            avatar: 'https://i.pravatar.cc/150?u=mike',
        },
        reporter: {
            name: 'Sarah Chen',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
        },
        priority: 'Medium',
        status: 'To Do',
        created: '2023-10-16',
        updated: '2023-10-16',
        dueDate: '2023-10-30',
    },
    {
        id: '3',
        key: 'DEV-45',
        title: 'Database schema migration for users',
        assignee: {
            name: 'Lisa Wong',
            avatar: 'https://i.pravatar.cc/150?u=lisa',
        },
        reporter: {
            name: 'Alex Johnson',
            avatar: 'https://i.pravatar.cc/150?u=alex',
        },
        priority: 'High',
        status: 'Done',
        resolution: 'Fixed',
        created: '2023-10-12',
        updated: '2023-10-14',
        dueDate: '2023-10-20',
    },
    {
        id: '4',
        key: 'DEV-46',
        title: 'Update documentation for API endpoints',
        assignee: {
            name: 'David Lee',
            avatar: 'https://i.pravatar.cc/150?u=david',
        },
        reporter: {
            name: 'Lisa Wong',
            avatar: 'https://i.pravatar.cc/150?u=lisa',
        },
        priority: 'Low',
        status: 'To Do',
        created: '2023-10-17',
        updated: '2023-10-17',
        dueDate: '2023-11-05',
    },
    {
        id: '5',
        key: 'DEV-47',
        title: 'Integrate payment gateway (Stripe)',
        assignee: {
            name: 'Sarah Chen',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
        },
        reporter: {
            name: 'Mike Smith',
            avatar: 'https://i.pravatar.cc/150?u=mike',
        },
        priority: 'High',
        status: 'In Progress',
        created: '2023-10-18',
        updated: '2023-10-19',
        dueDate: '2023-10-28',
    },
    {
        id: '6',
        key: 'DEV-48',
        title: 'Optimize image loading performance',
        assignee: {
            name: 'Alex Johnson',
            avatar: 'https://i.pravatar.cc/150?u=alex',
        },
        reporter: {
            name: 'David Lee',
            avatar: 'https://i.pravatar.cc/150?u=david',
        },
        priority: 'Medium',
        status: 'To Do',
        created: '2023-10-19',
        updated: '2023-10-19',
        dueDate: '2023-11-01',
    },
    {
        id: '7',
        key: 'DEV-49',
        title: 'Refactor user profile component',
        assignee: {
            name: 'Lisa Wong',
            avatar: 'https://i.pravatar.cc/150?u=lisa',
        },
        reporter: {
            name: 'Sarah Chen',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
        },
        priority: 'Low',
        status: 'Done',
        resolution: 'Done',
        created: '2023-10-10',
        updated: '2023-10-13',
        dueDate: '2023-10-15',
    },
];
