import { randomUUID } from 'node:crypto';
import { DEFAULT_TASK_STATUS } from '../constants.js';
import { pool } from '../db.js';
import type { CreateTaskInput, TaskFilter, UpdateTaskInput } from '../types.js';
import { AppError } from '../errors.js';
import { PgProjectRepo } from '../pg/projects.js';
import { PgTaskRepo } from '../pg/tasks.js';
import type { ProjectRepository, TaskRepository } from '../repositories/types.js';

const projectsRepo: ProjectRepository = new PgProjectRepo(pool);
const tasksRepo: TaskRepository = new PgTaskRepo(pool);

export class TaskService {
    async create(projectId: string, input: CreateTaskInput) {
        const project = await projectsRepo.findById(projectId);
        if (!project) throw new AppError('Проект не найден', 'project_not_found');

        const now = new Date().toISOString();
        return tasksRepo.create({
            id: 'task-' + randomUUID(),
            projectId,
            title: input.title,
            description: input.description ?? null,
            status: input.status ?? DEFAULT_TASK_STATUS,
            assigneeId: input.assigneeId ?? null,
            createdAt: now,
            updatedAt: now,
        });
    }

    async listByProject(projectId: string, filter: TaskFilter) {
        const project = await projectsRepo.findById(projectId);
        if (!project) throw new AppError('Проект не найден', 'project_not_found');
        return tasksRepo.findByProjectId(projectId, filter);
    }

    async update(taskId: string, input: UpdateTaskInput) {
        const task = await tasksRepo.findById(taskId);
        if (!task) throw new AppError('Задача не найдена', 'task_not_found');

        task.title = input.title ?? task.title;
        if (input.description !== undefined) task.description = input.description;
        if (input.status) task.status = input.status;
        if (input.assigneeId !== undefined) task.assigneeId = input.assigneeId;
        task.updatedAt = new Date().toISOString();

        return tasksRepo.update(task);
    }

    async remove(taskId: string) {
        const ok = await tasksRepo.delete(taskId);
        if (!ok) throw new AppError('Задача не найдена', 'task_not_found');
    }

    async getSummary(projectId: string) {
        const project = await projectsRepo.findById(projectId);
        if (!project) throw new AppError('Проект не найден', 'project_not_found');
        return tasksRepo.getSummary(projectId);
    }
}

export const taskService = new TaskService();
