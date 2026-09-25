import { Router } from 'express';
import { taskController } from '../controllers/tasks.js';
import { taskValidator } from '../validation/taskValidationZod.js';

export const tasksRouter = Router();

tasksRouter.patch('/:taskId', taskValidator.taskParams(), taskValidator.patchTask(), taskController.updateTask);
tasksRouter.delete('/:taskId', taskValidator.taskParams(), taskController.deleteTask);
