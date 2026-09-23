import type { RequestHandler } from 'express';
import zod, { type ZodType } from 'zod';
import { TASK_STATUSES } from './constants.js';
import { AppError } from './errors.js';

export class Validator {
    private text(message: string) {
        return zod.string({ error: message }).trim().min(1, { error: message });
    }

    private taskFields() {
        return {
            title: this.text('Укажите название задачи'),
            description: zod.string().trim().optional(),
            assigneeId: this.text('Укажите исполнителя').optional(),
            status:     zod.enum(TASK_STATUSES, { message: 'Недопустимый статус задачи' }).optional(),
        };
    }

    createProject(): RequestHandler {
        const schema = zod.object({
            name: this.text('Укажите название проекта'),
            description: zod.string().trim().optional(),
            task: zod.object(this.taskFields()).optional(),
        });
        return this.body(schema);
    }

    createTask(): RequestHandler {
        return this.body(zod.object(this.taskFields()));
    }

    patchTask(): RequestHandler {
        const schema = zod
            .object({
                title: this.text('Укажите название задачи').optional(),
                description: zod.string().trim().nullable().optional(),
                status: zod.enum(TASK_STATUSES, { message: 'Недопустимый статус задачи' }).optional(),
                assigneeId: this.text('Укажите исполнителя').nullable().optional(),
            })
            .refine((value) => Object.keys(value).length > 0, {
                message: 'Нет полей для обновления',
            });
        return this.body(schema);
    }

    taskFilter(): RequestHandler {
        const schema = zod.object({
            status: zod.enum(TASK_STATUSES, { message: 'Недопустимый статус задачи' }).optional(),
            assigneeId: zod.string().trim().min(1, 'Укажите исполнителя').optional(),
        });
        return this.query(schema);
    }

    private fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
        const fields: Record<string, string> = {};
        for (const issue of issues) {
            const key = issue.path.map(String).join('.') || 'body';
            if (fields[key] === undefined) fields[key] = issue.message;
        }
        return fields;
    }

    private body(schema: ZodType): RequestHandler {
        return (req, res, next) => {
            const parsed = schema.safeParse(req.body);
            if (!parsed.success) {
                const fields = this.fieldErrors(parsed.error.issues);
                const message = fields.name ?? Object.values(fields)[0] ?? 'Невалидное тело запроса';
                next(new AppError(message, 'validation_error', fields));
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
                const fields = this.fieldErrors(parsed.error.issues);
                const message = Object.values(fields)[0] ?? 'Невалидные параметры запроса';
                next(new AppError(message, 'validation_error', fields));
                return;
            }
            res.locals.query = parsed.data;
            next();
        };
    }
}

export const validator = new Validator();
