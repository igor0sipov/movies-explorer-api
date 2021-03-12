const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).then((currentUser) => {
    res.send(currentUser);
  }).catch(() => {
    throw new NotFoundError('Нет пользователя с таким id');
  }).catch(next);
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
    }).catch((err) => {
      if (err.errors.email && err.errors.email.name === 'ValidatorError') {
        throw new BadRequestError(err.message);
      }
      if (err.errors.name && err.errors.name.name === 'ValidatorError') {
        throw new BadRequestError(err.message);
      }
    }).catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10).then((hashedPassword) => {
    User.init();
    return hashedPassword;
  }).then((hashedPassword) => User.create(
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
        email: user[0].email, name: user[0].name,
      }).catch((err) => {
        if (err.message.startsWith('E11000')) {
          throw new ConflictError('Пользователь с таким email уже существует');
        }
        if (err.errors.name && err.errors.name.name === 'ValidatorError') {
          throw new BadRequestError(err.message);
        }
      });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  const STUDENT_JWT_SECRET = '908f8f3afc1d8d6933041c9134ca019993aaee7ab6685648abce113cd738731f';
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production'
          ? JWT_SECRET
          : STUDENT_JWT_SECRET,
        { expiresIn: '7d' },
      );

      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Успешно!' })
        .end();
    })
    .catch((err) => {
      throw new UnauthorizedError(err.message);
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
