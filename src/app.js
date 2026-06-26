const express = require('express');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const { sendSuccess } = require('./utils/apiResponse');
const env = require('./config/env');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    return sendSuccess(res, { environment: env.nodeEnv }, 'Backend API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
