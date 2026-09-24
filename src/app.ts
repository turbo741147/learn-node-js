import express from "express";
import { DEFAULT_BODY_LIMIT } from "./constants.js";
import { projectController } from "./controllers/projects.js";
import { taskController } from "./controllers/tasks.js";
import { asyncHandler, errorHandler } from "./middleware.js";
import { validator } from "./validationZod.js";

const app = express();

app.use(express.json({ limit: DEFAULT_BODY_LIMIT }));



app.post("/projects", validator.createProject(), asyncHandler(projectController.createProject));
app.get("/projects", asyncHandler(projectController.listProjects));
app.get("/projects/:projectId", asyncHandler(projectController.getProject));

app.post("/projects/:projectId/tasks", validator.createTask(), asyncHandler(taskController.createTask));
app.get("/projects/:projectId/tasks", validator.taskFilter(), asyncHandler(taskController.listTasks));

app.get("/projects/:projectId/summary", asyncHandler(taskController.getTaskSummary));

app.patch("/tasks/:taskId", validator.patchTask(), asyncHandler(taskController.updateTask));
app.delete("/tasks/:taskId", asyncHandler(taskController.deleteTask));


app.use((req, res) => {
  res.status(404).json({
    message: "Маршрут не найден",
    code: "route_not_found",
  });
});

app.use(errorHandler);

export { app };
