import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/exceptions/errors.js';

export function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
    const fields: Record<string, string> = {};
    for (const issue of issues) {
        const key = issue.path.map(String).join('.') || 'body';
        if (fields[key] === undefined) fields[key] = issue.message;
    }
    return fields;
}

export function parseBody(schema: ZodType): RequestHandler {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            const fields = fieldErrors(parsed.error.issues);
            const message = Object.values(fields)[0] ?? 'Невалидное тело запроса';
            next(new AppError(message, 'validation_error', fields));
            return;
        }
        res.locals.input = parsed.data;
        next();
    };
}

export function parseQuery(schema: ZodType): RequestHandler {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.query);
        if (!parsed.success) {
            const fields = fieldErrors(parsed.error.issues);
            const message = Object.values(fields)[0] ?? 'Невалидные параметры запроса';
            next(new AppError(message, 'validation_error', fields));
            return;
        }
        res.locals.query = parsed.data;
        next();
    };
}

export function parseParams(schema: ZodType): RequestHandler {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.params);
        if (!parsed.success) {
            const fields = fieldErrors(parsed.error.issues);
            const message = Object.values(fields)[0] ?? 'Невалидные параметры пути';
            next(new AppError(message, 'validation_error', fields));
            return;
        }
        res.locals.params = parsed.data;
        next();
    };
}
