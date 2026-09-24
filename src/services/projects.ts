import { DEFAULT_TASK_STATUS } from '../constants.js';
import { pool } from '../db.js';
import type { CreateProjectInput, Project, Task } from '../types.js';
import { AppError } from '../errors.js';

type ProjectRow = {
    id: string;
    name: string;
    description: string | null;
    created_at: Date | string;
};

function iso(value: Date | string) {
    if (value instanceof Date) return value.toISOString();
    return new Date(value).toISOString();
}

function projectFromRow(row: ProjectRow): Project {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        createdAt: iso(row.created_at),
    };
}

export class ProjectService {
    async create(input: CreateProjectInput): Promise<Project> {
        const now = new Date().toISOString();
        const project: Project = {
            id: 'project-' + input.name,
            name: input.name,
            description: input.description ?? null,
            createdAt: now,
        };

        if (!input.task) {
            const result = await pool.query<ProjectRow>(
                'insert into projects (id, name, description, created_at) values ($1, $2, $3, $4) returning *',
                [project.id, project.name, project.description, project.createdAt],
            );
            return projectFromRow(result.rows[0]);
        }

        const task: Task = {
            id: 'task-' + input.task.title,
            projectId: project.id,
            title: input.task.title,
            description: input.task.description ?? null,
            status: input.task.status ?? DEFAULT_TASK_STATUS,
            assigneeId: input.task.assigneeId ?? null,
            createdAt: now,
            updatedAt: now,
        };

        return this.createWithFirstTask(project, task);
    }

    async createWithFirstTask(project: Project, task: Task) {
        const client = await pool.connect();
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

    async getAll() {
        const result = await pool.query<ProjectRow>('select * from projects order by created_at');
        const projects = result.rows.map(projectFromRow);
        if (!projects) throw new AppError('Проекты не найдены', 'projects_not_found');
        return projects;
    }

    async getById(projectId: string) {
        const result = await pool.query<ProjectRow>('select * from projects where id = $1', [projectId]);
        const project = result.rows[0] ? projectFromRow(result.rows[0]) : null;
        if (!project) throw new AppError('Проект не найден', 'project_not_found');
        return project;
    }
}

export const projectService = new ProjectService();
