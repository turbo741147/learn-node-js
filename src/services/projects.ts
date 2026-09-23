import { DEFAULT_TASK_STATUS } from '../constants.js';
import { pool } from '../db.js';
import type { CreateProjectInput, Project, Task } from '../types.js';
import { AppError } from '../errors.js';
import { PgProjectRepo } from '../pg/projects.js';
import type { ProjectRepository } from '../repositories/types.js';

const projectsRepo: ProjectRepository = new PgProjectRepo(pool);

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
            return projectsRepo.create(project);
        }

        const task: Task = {
            id: 'task-' + input.task?.title,
            projectId: project.id,
            title: input.task.title,
            description: input.task.description ?? null,
            status: input.task.status ?? DEFAULT_TASK_STATUS,
            assigneeId: input.task.assigneeId ?? null,
            createdAt: now,
            updatedAt: now,
        };

        return projectsRepo.createWithFirstTask(project, task);
    }

    async getAll() {
        const projects = await projectsRepo.findAll();
        if(!projects) throw new AppError('Проекты не найдены', 'projects_not_found');
        return projects;
    }

    async getById(projectId: string) {
        const project = await projectsRepo.findById(projectId);
        if (!project) throw new AppError('Проект не найден', 'project_not_found');
        return project;
    }
}

export const projectService = new ProjectService();
