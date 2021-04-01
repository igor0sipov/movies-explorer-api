const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const { authorizationRequired, devJwtSecret } = require('../configs/config');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  const { JWT_SECRET, NODE_ENV } = process.env;
  if (!token) {
    throw new UnauthorizedError(authorizationRequired);
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devJwtSecret);
  } catch (error) {
    throw new UnauthorizedError(authorizationRequired);
  }

  req.user = payload;

  next();
};
