import type { Pool } from 'pg';
import type { Task, TaskFilter } from '../types.js';
import type { TaskRepository } from '../repositories/types.js';
import { taskFromRow, type TaskRow } from './typesPg.js';

export class PgTaskRepo implements TaskRepository {
    constructor(private pool: Pool) {}

    async create(task: Task) {
        const result = await this.pool.query<TaskRow>(
            `insert into tasks (id, project_id, title, description, status, assignee_id, created_at, updated_at)
             values ($1, $2, $3, $4, $5, $6, $7, $8)
             returning *`,
            [
                task.id,
                task.projectId,
                task.title,
                task.description,
                task.status,
                task.assigneeId,
                task.createdAt,
                task.updatedAt,
            ],
        );
        return taskFromRow(result.rows[0]);
    }

    async findByProjectId(projectId: string, filter: TaskFilter) {
        const result = await this.pool.query<TaskRow>(
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

    async findById(id: string) {
        const result = await this.pool.query<TaskRow>('select * from tasks where id = $1', [id]);
        if (!result.rows[0]) return null;
        return taskFromRow(result.rows[0]);
    }

    async update(task: Task) {
        const result = await this.pool.query<TaskRow>(
            `update tasks
             set title = $2, description = $3, status = $4, assignee_id = $5, updated_at = $6
             where id = $1
             returning *`,
            [task.id, task.title, task.description, task.status, task.assigneeId, task.updatedAt],
        );
        return taskFromRow(result.rows[0]);
    }

    async delete(id: string) {
        const result = await this.pool.query('delete from tasks where id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
