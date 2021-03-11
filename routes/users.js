const { Joi, celebrate } = require('celebrate');

const usersRouter = require('express').Router();
const {
  getCurrentUser,
  editUserInfo,
} = require('../controllers/users');

usersRouter.get('/users/me', getCurrentUser);

usersRouter.patch('users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
  }),
}), editUserInfo);

module.exports = usersRouter;
