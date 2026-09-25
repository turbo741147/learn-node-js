import zod from 'zod';
import { TASK_STATUSES } from '../utils/common/constantsTask.js';
import { parseBody, parseParams, parseQuery } from './parse.js';
import { taskFields, text } from './taskFields.js';

const createTaskSchema = zod.object(taskFields);

const patchTaskSchema = zod
    .object({
        title: text('Укажите название задачи').optional(),
        description: zod.string().trim().nullable().optional(),
        status: zod.enum(TASK_STATUSES, { message: 'Недопустимый статус задачи' }).optional(),
        assigneeId: text('Укажите исполнителя').nullable().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
        message: 'Нет полей для обновления',
    });

const taskFilterSchema = zod.object({
    status: zod.enum(TASK_STATUSES, { message: 'Недопустимый статус задачи' }).optional(),
    assigneeId: zod.string().trim().min(1, 'Укажите исполнителя').optional(),
});

const taskParamsSchema = zod.object({
    taskId: text('Укажите id задачи'),
});

export class TaskValidator {
    createTask() {
        return parseBody(createTaskSchema);
    }

    patchTask() {
        return parseBody(patchTaskSchema);
    }

    taskFilter() {
        return parseQuery(taskFilterSchema);
    }

    taskParams() {
        return parseParams(taskParamsSchema);
    }
}

export const taskValidator = new TaskValidator();
