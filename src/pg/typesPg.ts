import type { TaskStatus } from '../constants.js';
import type { Project, Task } from '../types.js';

function iso(value: Date | string) {
    if (value instanceof Date) return value.toISOString();
    return new Date(value).toISOString();
}

export type ProjectRow = {
    id: string;
    name: string;
    description: string | null;
    created_at: Date | string;
};

export type TaskRow = {
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    assignee_id: string | null;
    created_at: Date | string;
    updated_at: Date | string;
};

export function projectFromRow(row: ProjectRow): Project {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        createdAt: iso(row.created_at),
    };
}

export function taskFromRow(row: TaskRow): Task {
    return {
        id: row.id,
        projectId: row.project_id,
        title: row.title,
        description: row.description,
        status: row.status,
        assigneeId: row.assignee_id,
        createdAt: iso(row.created_at),
        updatedAt: iso(row.updated_at),
    };
}
