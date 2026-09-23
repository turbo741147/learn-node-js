import express from "express";
import { DEFAULT_BODY_LIMIT, DEFAULT_PORTS } from "./constants.js";
import { projectController } from "./controllers/projects.js";
import { taskController } from "./controllers/tasks.js";
import { asyncHandler, errorHandler } from "./middleware.js";
import { validator } from "./validationZod.js";

const app = express();

app.use(express.json({ limit: DEFAULT_BODY_LIMIT }));

app.get("/", (req, res) => {
  res.send("Hello World213213");
});



app.use((req, res) => {
  res.status(404).json({
    message: "Маршрут не найден",
    code: "route_not_found",
  });
});

app.use(errorHandler);

const port = process.env.PORT || DEFAULT_PORTS;

app.listen(port, (error?: Error) => {
  if (error) {
    console.error(`Failed to start server on port ${port}`);
    console.error(error.message);
    process.exit(1);
  }

  console.log(`Server is running on port ${port}`);
});
