const indexRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const users = require('./users');
const movies = require('./movies');
const NotFoundError = require('../errors/not-found-error');
const { createUser, login, signout } = require('../controllers/users');
const auth = require('../middlewares/auth.js');

indexRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(60),
    password: Joi.string().required().min(8).max(32),
  }),
}), login);

indexRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(60),
    password: Joi.string().required().min(8).max(32),
    name: Joi.string().min(2).max(32),
  }),
}), createUser);

indexRouter.use(auth);

indexRouter.use('/', users);
indexRouter.use('/', movies);

indexRouter.post('/signout', signout);

indexRouter.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = indexRouter;
