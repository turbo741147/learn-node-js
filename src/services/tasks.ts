import { randomUUID } from 'node:crypto';
import { DEFAULT_TASK_STATUS, TASK_STATUSES, type TaskStatus } from '../constants.js';
import { pool } from '../db.js';
import type { CreateTaskInput, Task, TaskFilter, UpdateTaskInput } from '../types.js';
import { AppError } from '../errors.js';
import { projectService } from './projects.js';

type TaskRow = {
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    assignee_id: string | null;
    created_at: Date | string;
    updated_at: Date | string;
};

function iso(value: Date | string) {
    if (value instanceof Date) return value.toISOString();
    return new Date(value).toISOString();
}

function taskFromRow(row: TaskRow): Task {
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

export class TaskService {
    async create(projectId: string, input: CreateTaskInput) {
        await projectService.getById(projectId);

        const now = new Date().toISOString();
        const result = await pool.query<TaskRow>(
            `insert into tasks (id, project_id, title, description, status, assignee_id, created_at, updated_at)
             values ($1, $2, $3, $4, $5, $6, $7, $8)
             returning *`,
            [
                'task-' + randomUUID(),
                projectId,
                input.title,
                input.description ?? null,
                input.status ?? DEFAULT_TASK_STATUS,
                input.assigneeId ?? null,
                now,
                now,
            ],
        );
        return taskFromRow(result.rows[0]);
    }

    async listByProject(projectId: string, filter: TaskFilter) {
        await projectService.getById(projectId);
        const result = await pool.query<TaskRow>(
            `select tasks.*
             from tasks
             join projects on projects.id = tasks.project_id
             where tasks.project_id = $1
               and ($2::text is null or tasks.status = $2)
               and ($3::text is null or tasks.assignee_id = $3)
             order by tasks.created_at`,
            [projectId, filter.status ?? null, filter.assigneeId ?? null],
        );
        return result.rows.map(taskFromRow);
    }

    async update(taskId: string, input: UpdateTaskInput) {
        const current = await pool.query<TaskRow>('select * from tasks where id = $1', [taskId]);

        const task = current.rows[0] ? taskFromRow(current.rows[0]) : null;
        if (!task) throw new AppError('Задача не найдена', 'task_not_found');

        task.title = input.title ?? task.title;
        if (input.description !== undefined) task.description = input.description;
        if (input.status) task.status = input.status;
        if (input.assigneeId !== undefined) task.assigneeId = input.assigneeId;
        task.updatedAt = new Date().toISOString();
        const result = await pool.query<TaskRow>(
            `update tasks
             set title = $2, description = $3, status = $4, assignee_id = $5, updated_at = $6
             where id = $1
             returning *`,
            [task.id, task.title, task.description, task.status, task.assigneeId, task.updatedAt],
        );
        return taskFromRow(result.rows[0]);
    }

    async remove(taskId: string) {
        const result = await pool.query('delete from tasks where id = $1', [taskId]);
        if ((result.rowCount ?? 0) === 0) throw new AppError('Задача не найдена', 'task_not_found');
    }

    async getSummary(projectId: string) {
        await projectService.getById(projectId);
        const result = await pool.query<{ status: TaskStatus; count: string }>(
            `select status, count(*) as count
             from tasks
             where project_id = $1
             group by status`,
            [projectId],
        );

        const counts = {} as Record<TaskStatus, number>;
        for (const status of TASK_STATUSES) counts[status] = 0;
        for (const row of result.rows) counts[row.status] = Number(row.count);
        return counts;
    }
}

export const taskService = new TaskService();
