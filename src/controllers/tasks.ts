import type { Request, Response } from 'express';
import type { CreateTaskInput, TaskFilter, UpdateTaskInput } from '../types.js';
import { taskService } from '../services/tasks.js';

export class TaskController {
    async createTask(req: Request, res: Response) {
        const body = res.locals.input as CreateTaskInput;
        const task = await taskService.create(String(req.params.projectId), body);
        res.status(201).json(task);
    }

    async listTasks(req: Request, res: Response) {
        const filter = (res.locals.query ?? {}) as TaskFilter;
        const tasks = await taskService.listByProject(String(req.params.projectId), filter);
        res.json(tasks);
    }

    async updateTask(req: Request, res: Response) {
        const body = res.locals.input as UpdateTaskInput;
        const task = await taskService.update(String(req.params.taskId), body);
        res.json(task);
    }

    async deleteTask(req: Request, res: Response) {
        await taskService.remove(String(req.params.taskId));
        res.status(204).send();
    }
}

export const taskController = new TaskController();
