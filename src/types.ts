import type { TaskStatus } from './constants.js';

export type Project = {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
};

export type Task = {
    id: string;
    projectId: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    assigneeId: string | null;
    createdAt: string;
    updatedAt: string;
};

export type TaskFilter = {
    status?: TaskStatus;
    assigneeId?: string;
};

export type CreateProjectInput = {
    name: string;
    description?: string;
    task?: {
        title: string;
        description?: string;
        assigneeId?: string;
        status?: TaskStatus;
    };
};

export type CreateTaskInput = {
    title: string;
    description?: string;
    assigneeId?: string;
    status?: TaskStatus;
};

export type UpdateTaskInput = {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    assigneeId?: string | null;
};
