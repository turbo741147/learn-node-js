import { Router } from "express";
import { projectController } from "../controllers/projects.js";
import { taskController } from "../controllers/tasks.js";
import { projectValidator } from "../validation/projectValidationZod.js";
import { taskValidator } from "../validation/taskValidationZod.js";

export const projectsRouter = Router();

projectsRouter.post(
  "/",
  projectValidator.createProject(),
  projectController.createProject,
);

projectsRouter.get("/", projectController.listProjects);

projectsRouter.get(
  "/:projectId",
  projectValidator.projectParams(),
  projectController.getProject,
);

projectsRouter.post(
  "/:projectId/tasks",
  projectValidator.projectParams(),
  taskValidator.createTask(),
  taskController.createTask,
);

projectsRouter.get(
  "/:projectId/tasks",
  projectValidator.projectParams(),
  taskValidator.taskFilter(),
  taskController.listTasks,
);

projectsRouter.get(
  "/:projectId/summary",
  projectValidator.projectParams(),
  taskController.getTaskSummary,
);
