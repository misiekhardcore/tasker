const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server");

const {
  USERNAME_INPUT_EMPTY,
  PASSWORD_INPUT_EMPTY,
  PASSWORD_INPUT_NOTMATCH,
  USER_WRONG_CREDENTIALS,
  EMAIL_INPUT_EMPTY,
  EMAIL_INPUT_INVALID,
} = require("../../messages");

const bcrypt = require("bcrypt");
const User = require("../../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword,
  key
) => {
  //collect errors
  const errors = {};

  //username empty
  if (username.trim() === "") {
    errors.username = USERNAME_INPUT_EMPTY;
  }

  //email empty
  if (email.trim() === "") {
    errors.email = EMAIL_INPUT_EMPTY;
  }
  //email is emailish
  else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = EMAIL_INPUT_INVALID;
    }
  }

  //password empty
  if (password === "") {
    errors.password = PASSWORD_INPUT_EMPTY;
  }

  //passwords match
  else if (password !== confirmPassword) {
    errors.confirmPassword = PASSWORD_INPUT_NOTMATCH;
  }

  if (Object.keys(errors).length > 0) {
    throw new UserInputError(USER_VALIDATION_ERROR, errors);
  }

  return;
};

module.exports.validateLoginInput = (username, password) => {
  //collect errors
  const errors = {};

  //username empty
  if (username.trim() === "") {
    errors.username = USERNAME_INPUT_EMPTY;
  }

  //password empty
  if (password === "") {
    errors.password = PASSWORD_INPUT_EMPTY;
  }

  if (Object.keys(errors).length > 0) {
    throw new UserInputError(USER_VALIDATION_ERROR, errors);
  }

  return;
};

module.exports.checkPassword = async (password, hash) => {
  //collect errors
  const errors = {};

  //check password
  const check = await bcrypt.compare(password, hash);
  if (!check) {
    errors.general = USER_WRONG_CREDENTIALS;
    throw new UserInputError(USER_WRONG_CREDENTIALS, errors);
  }
  return;
};

module.exports.checkUser = async (
  searchObject,
  errorType,
  errorMessage,
  exists = true
) => {
  //collect errors
  const errors = {};

  //check user
  const user = await User.findOne(searchObject);
  const state = user ? true : false;
  if (state != exists) {
    errors[errorType] = errorMessage;
    throw new UserInputError(errorMessage, errors);
  }

  return user;
};

module.exports.checkId = (id) => {
  const errors = {};

  if (!ObjectId.isValid(tableId)) {
    errors.general = NOT_VALID_ID;
    throw new UserInputError(NOT_VALID_ID, errors);
  }
};
