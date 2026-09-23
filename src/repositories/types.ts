import type { Project, Task, TaskFilter } from '../types.js';

export interface ProjectRepository {
    create(project: Project): Promise<Project>;
    createWithFirstTask(project: Project, task: Task): Promise<Project>;
    findAll(): Promise<Project[]>;
    findById(id: string): Promise<Project | null>;
}

export interface TaskRepository {
    create(task: Task): Promise<Task>;
    findByProjectId(projectId: string, filter: TaskFilter): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
    update(task: Task): Promise<Task>;
    delete(id: string): Promise<boolean>;
}
