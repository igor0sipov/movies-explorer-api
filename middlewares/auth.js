const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  const { JWT_SECRET } = process.env;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
