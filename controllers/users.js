const User = require('../models/users');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

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
      if (err.errors.name && err.errors.name.name === 'ValidatorError') {
        throw new BadRequestError(err.message);
      }
      if (err.errors.about && err.errors.about.name === 'ValidatorError') {
        throw new BadRequestError(err.message);
      }
    }).catch(next);
};
