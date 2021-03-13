require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const index = require('./routes/index');

const { PORT = 3000, DB_NAME, NODE_ENV } = process.env;

const app = express();

app.use(cookieParser());

mongoose.connect(`mongodb://localhost:27017/${NODE_ENV === 'production' ? DB_NAME : 'favfilmsdb'}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());

app.use(requestLogger);

app.use(index);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
