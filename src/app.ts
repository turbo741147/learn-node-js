import express from 'express';
import { DEFAULT_BODY_LIMIT } from './utils/common/constants.js';
import { errorHandler } from './utils/exceptions/errorHandler.js';
import { projectsRouter } from './routes/projects.js';
import { tasksRouter } from './routes/tasks.js';

const app = express();

app.use(express.json({ limit: DEFAULT_BODY_LIMIT }));
app.use('/projects', projectsRouter);
app.use('/tasks', tasksRouter);

app.use((_req, res) => {
    res.status(404).json({
        message: 'Маршрут не найден',
        code: 'route_not_found',
    });
});

app.use(errorHandler);

export { app };
