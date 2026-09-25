export class AppError extends Error {
    readonly code: string;
    readonly fields?: Record<string, string>;

    constructor(message: string, code: string, fields?: Record<string, string>) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.fields = fields;
    }
}

const STATUS_BY_CODE: Record<string, number> = {
    project_not_found: 404,
    task_not_found: 404,
    validation_error: 400,
};

export function statusFor(code: string): number {
    return STATUS_BY_CODE[code] ?? 500;
}
