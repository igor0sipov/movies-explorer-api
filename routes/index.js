const indexRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const users = require('./users');
const movies = require('./movies');
const NotFoundError = require('../errors/not-found-error');
const { createUser, login, signout } = require('../controllers/users');
const auth = require('../middlewares/auth.js');
const { resourceNotFound, getErrorText } = require('../configs/config');

indexRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(60)
      .message(getErrorText('email')),
    password: Joi.string().required().min(8).max(32)
      .message(getErrorText('пароль(password)')),
  }),
}), login);

indexRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(60)
      .message(getErrorText('email')),
    password: Joi.string().required().min(8).max(32)
      .message(getErrorText('пароль(password)')),
    name: Joi.string().min(2).max(32).message(getErrorText('имя(name)')),
  }),
}), createUser);

indexRouter.post('/signout', signout);

indexRouter.use(auth);

indexRouter.use('/', users);
indexRouter.use('/', movies);

indexRouter.use('*', () => {
  throw new NotFoundError(resourceNotFound);
});

module.exports = indexRouter;
