import zod from 'zod';
import { parseBody, parseParams } from './parse.js';
import { taskFields, text } from './taskFields.js';

const createProjectSchema = zod.object({
    name: text('Укажите название проекта'),
    description: zod.string().trim().optional(),
    task: zod.object(taskFields).optional(),
});

const projectParamsSchema = zod.object({
    projectId: text('Укажите id проекта'),
});

export class ProjectValidator {
    createProject() {
        return parseBody(createProjectSchema);
    }

    projectParams() {
        return parseParams(projectParamsSchema);
    }
}

export const projectValidator = new ProjectValidator();
