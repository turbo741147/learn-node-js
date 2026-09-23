import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { AppError, statusFor } from './errors.js';

export function asyncHandler(fn: RequestHandler): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        res.status(statusFor(err.code)).json({ message: err.message, code: err.code });
        return;
    }

    if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
        res.status(400).json({ message: 'Невалидный JSON', code: 'validation_error' });
        return;
    }

    console.error(err);
    res.status(500).json({ message: 'Внутренняя ошибка сервера', code: 'internal_error' });
}
