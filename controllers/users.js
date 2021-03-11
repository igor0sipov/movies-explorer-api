const User = require('../models/users');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).then((currentUser) => {
    res.send(currentUser);
  }).catch(() => {
    throw new NotFoundError('Нет пользователя с таким id');
  }).catch(next);
};
