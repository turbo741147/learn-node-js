export const DEFAULT_PORTS = 3000;
export const DEFAULT_BODY_LIMIT = '1mb';
export const DEFAULT_TASK_STATUS = 'todo';

export const TASK_STATUSES = ['todo', 'in_progress', 'done', 'blocked'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
