import type { Request, Response } from 'express';
import type { CreateProjectInput } from '../types.js';
import { projectService } from '../services/projects.js';

export class ProjectController {
    async createProject(req: Request, res: Response) {
        const body = res.locals.input as CreateProjectInput;
        const project = await projectService.create(body);
        res.status(201).json(project);
    }

    async listProjects(req: Request, res: Response) {
        res.json(await projectService.getAll());
    }

    async getProject(req: Request, res: Response) {
        console.log(req.params);
        const project = await projectService.getById(String(req.params.projectId));
        res.json(project);
    }
}

export const projectController = new ProjectController();
