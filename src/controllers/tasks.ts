import type { Request, Response } from 'express';
import type { ProjectParams } from '../utils/common/typeProject.js';
import type { CreateTaskInput, TaskFilter, TaskParams, UpdateTaskInput } from '../utils/common/typesTask.js';
import { taskService } from '../services/tasks.js';

export class TaskController {
    async createTask(_req: Request, res: Response) {
        const { projectId } = res.locals.params as ProjectParams;
        const body = res.locals.input as CreateTaskInput;
        const task = await taskService.create(projectId, body);
        res.status(201).json(task);
    }

    async listTasks(_req: Request, res: Response) {
        const { projectId } = res.locals.params as ProjectParams;
        const filter = (res.locals.query ?? {}) as TaskFilter;
        const tasks = await taskService.listByProject(projectId, filter);
        res.json(tasks);
    }

    async updateTask(_req: Request, res: Response) {
        const { taskId } = res.locals.params as TaskParams;
        const body = res.locals.input as UpdateTaskInput;
        const task = await taskService.update(taskId, body);
        res.json(task);
    }

    async deleteTask(_req: Request, res: Response) {
        const { taskId } = res.locals.params as TaskParams;
        await taskService.remove(taskId);
        res.status(204).send();
    }

    async getTaskSummary(_req: Request, res: Response) {
        const { projectId } = res.locals.params as ProjectParams;
        const summary = await taskService.getSummary(projectId);
        res.json(summary);
    }
}

export const taskController = new TaskController();
