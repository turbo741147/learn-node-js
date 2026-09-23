import type { RequestHandler } from 'express';
import { z, type ZodType } from 'zod';
import { TASK_STATUSES } from './constants.js';
import { AppError } from './errors.js';

export class Validator {
    private text(message: string) {
        return z.string({ error: message }).trim().min(1, { error: message });
    }

    private taskFields() {
        return {
            title: this.text('Укажите название задачи'),
            description: z.string().trim().optional(),
            assigneeId: this.text('Укажите исполнителя').optional(),
            status: z.enum(TASK_STATUSES, { message: 'Недопустимый статус задачи' }).optional(),
        };
    }

    createProject(): RequestHandler {
        const schema = z.object({
            name: this.text('Укажите название проекта'),
            description: z.string().trim().optional(),
            task: z.object(this.taskFields()).optional(),
        });
        return this.body(schema);
    }

    createTask(): RequestHandler {
        return this.body(z.object(this.taskFields()));
    }

    patchTask(): RequestHandler {
        const schema = z
            .object({
                title: this.text('Укажите название задачи').optional(),
                description: z.string().trim().nullable().optional(),
                status: z.enum(TASK_STATUSES, { message: 'Недопустимый статус задачи' }).optional(),
                assigneeId: this.text('Укажите исполнителя').nullable().optional(),
            })
            .refine((value) => Object.keys(value).length > 0, {
                message: 'Нет полей для обновления',
            });
        return this.body(schema);
    }

    taskFilter(): RequestHandler {
        const schema = z.object({
            status: z.enum(TASK_STATUSES, { message: 'Недопустимый статус задачи' }).optional(),
            assigneeId: z.string().trim().min(1, 'Укажите исполнителя').optional(),
        });
        return this.query(schema);
    }

    private body(schema: ZodType): RequestHandler {
        return (req, res, next) => {
            const parsed = schema.safeParse(req.body);
            if (!parsed.success) {
                next(new AppError(parsed.error.issues[0]?.message ?? 'Невалидное тело запроса', 'validation_error'));
                return;
            }
            res.locals.input = parsed.data;
            next();
        };
    }

    private query(schema: ZodType): RequestHandler {
        return (req, res, next) => {
            const parsed = schema.safeParse(req.query);
            if (!parsed.success) {
                next(new AppError(parsed.error.issues[0]?.message ?? 'Невалидные параметры запроса', 'validation_error'));
                return;
            }
            res.locals.query = parsed.data;
            next();
        };
    }
}

export const validator = new Validator();
