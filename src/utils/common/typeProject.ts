import type { TaskStatus } from './constantsTask.js';

export type Project = {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
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

export type ProjectParams = {
    projectId: string;
};
