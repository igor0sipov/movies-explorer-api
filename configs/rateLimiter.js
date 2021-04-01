const rateLimit = require('express-rate-limit');

const minutes = 5;
module.exports = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 100,
  message: {
    message: `Слишком много запросов с текущего IP, попробуйте через ${minutes} минут`,
  },
});
