import type { Request, Response } from 'express';
import type { CreateProjectInput, ProjectParams } from '../utils/common/typeProject.js';
import { projectService } from '../services/projects.js';

export class ProjectController {
    async createProject(req: Request, res: Response) {
        const body = res.locals.input as CreateProjectInput;
        const project = await projectService.create(body);
        res.status(201).json(project);
    }

    async listProjects(_req: Request, res: Response) {
        res.json(await projectService.getAll());
    }

    async getProject(_req: Request, res: Response) {
        const { projectId } = res.locals.params as ProjectParams;
        const project = await projectService.getById(projectId);
        res.json(project);
    }
}

export const projectController = new ProjectController();
