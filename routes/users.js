const { Joi, celebrate } = require('celebrate');

const usersRouter = require('express').Router();
const {
  getCurrentUser,
  editUserInfo,
} = require('../controllers/users');
const { getErrorText } = require('../configs/config');

usersRouter.get('/users/me', getCurrentUser);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .message(getErrorText('email')),
    name: Joi.string().required().min(2).max(30)
      .message(getErrorText('имя(name)')),
  }),
}), editUserInfo);

module.exports = usersRouter;
