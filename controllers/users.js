const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const {
  userNotFound,
  sameUser,
  authorizationFailed,
  devJwtSecret,
} = require('../configs/config');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((currentUser) => {
      res.send(currentUser);
    })
    .catch(() => {
      throw new NotFoundError(userNotFound);
    })
    .catch(next);
};

module.exports.editUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((me) => {
      res.send(me);
    })
    .catch((err) => {
      if (err.errors.email && err.errors.email.name === 'ValidatorError') {
        throw new BadRequestError(err.message);
      }
      if (err.errors.name && err.errors.name.name === 'ValidatorError') {
        throw new BadRequestError(err.message);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      User.init();
      return hashedPassword;
    })
    .then((hashedPassword) => User.create(
      [
        {
          email,
          password: hashedPassword,
          name,
        },
      ],
      { runValidators: true },
    ))
    .then((user) => {
      res.send({
        email: user[0].email,
        name: user[0].name,
        _id: user[0]._id,
      });
    })
    .catch((err) => {
      if (err.message.startsWith('E11000')) {
        throw new ConflictError(sameUser);
      }
      if (err.errors.name && err.errors.name.name === 'ValidatorError') {
        throw new BadRequestError(err.message);
      }
    })
    .catch(next);
};

// Для указания опции валидации email при создании пользователь объект пользователя обернут в массив
// src: https://mongoosejs.com/docs/api.html#model_Model.create;

// User.init() добавлено для корректного срабатывания unique
// src: https://luxiyalu.com/mongoose-unique-not-working/;
// без этого пользователи добавлялись без проверки уникальности email

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : devJwtSecret,
        { expiresIn: '7d' },
      );

      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({
          email: user.email,
          name: user.name,
          _id: user._id,
        })
        .end();
    })
    .catch(() => {
      throw new UnauthorizedError(authorizationFailed);
    })
    .catch(next);
};

module.exports.signout = (req, res) => {
  try {
    res.clearCookie('token');
  } catch (error) {
    throw new BadRequestError(error);
  }
  return res.send({ message: 'Успешно!' });
};
