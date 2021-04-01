require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./configs/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const index = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { dbName } = require('./configs/config');

const { PORT = 3001, DB_NAME, NODE_ENV } = process.env;

const app = express();

app.use(cors());

app.use(cookieParser());

mongoose.connect(`mongodb://localhost:27017/${NODE_ENV === 'production' ? DB_NAME : dbName}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(index);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
