import type { TaskStatus } from './constantsTask.js';

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

export type TaskParams = {
    taskId: string;
};
