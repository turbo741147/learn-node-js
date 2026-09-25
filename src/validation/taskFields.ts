import zod from 'zod';
import { TASK_STATUSES } from '../utils/common/constantsTask.js';

export function text(message: string) {
    return zod.string({ error: message }).trim().min(1, { error: message });
}

export const taskFields = {
    title: text('Укажите название задачи'),
    description: zod.string().trim().optional(),
    assigneeId: text('Укажите исполнителя').optional(),
    status: zod.enum(TASK_STATUSES, { message: 'Недопустимый статус задачи' }).optional(),
};
