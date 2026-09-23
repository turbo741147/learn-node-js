import type { Pool } from 'pg';
import type { Project, Task } from '../types.js';
import type { ProjectRepository } from '../repositories/types.js';
import { projectFromRow, type ProjectRow } from './typesPg.js';

export class PgProjectRepo implements ProjectRepository {
    constructor(private pool: Pool) {}

    async create(project: Project) {
        const result = await this.pool.query<ProjectRow>(
            'insert into projects (id, name, description, created_at) values ($1, $2, $3, $4) returning *',
            [project.id, project.name, project.description, project.createdAt],
        );
        return projectFromRow(result.rows[0]);
    }

    // проект и первая задача одним коммитом
    async createWithFirstTask(project: Project, task: Task) {
        const client = await this.pool.connect();
        try {
            await client.query('begin');
            const saved = await client.query<ProjectRow>(
                'insert into projects (id, name, description, created_at) values ($1, $2, $3, $4) returning *',
                [project.id, project.name, project.description, project.createdAt],
            );
            await client.query(
                `insert into tasks (id, project_id, title, description, status, assignee_id, created_at, updated_at)
                 values ($1, $2, $3, $4, $5, $6, $7, $8)`,
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
            await client.query('commit');
            return projectFromRow(saved.rows[0]);
        } catch (err) {
            await client.query('rollback');
            throw err;
        } finally {
            client.release();
        }
    }

    async findAll() {
        const result = await this.pool.query<ProjectRow>(
            'select * from projects order by created_at',
        );
        return result.rows.map(projectFromRow);
    }

    async findById(id: string) {
        const result = await this.pool.query<ProjectRow>('select * from projects where id = $1', [id]);
        if (!result.rows[0]) return null;
        return projectFromRow(result.rows[0]);
    }
}
