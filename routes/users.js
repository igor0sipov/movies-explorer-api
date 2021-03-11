const usersRouter = require('express').Router();
const {
  getCurrentUser,
  editUserInfo,
} = require('../controllers/users');

usersRouter.get('/users/me', getCurrentUser);

usersRouter.patch('users/me', editUserInfo);
