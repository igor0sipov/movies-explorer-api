const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const { errorText } = require('../configs/config');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  const { JWT_SECRET } = process.env;
  if (!token) {
    throw new UnauthorizedError(errorText.authorizationRequired);
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError(errorText.authorizationRequired);
  }

  req.user = payload;

  next();
};
