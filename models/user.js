const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { wrongEmail, wrongUserCredentials } = require('../configs/config');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: wrongEmail,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(wrongUserCredentials));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(wrongUserCredentials));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
