export const DEFAULT_TASK_STATUS = 'todo';
export const TASK_ID_PREFIX = 'task-';

export const TASK_STATUSES = ['todo', 'in_progress', 'done', 'blocked'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
