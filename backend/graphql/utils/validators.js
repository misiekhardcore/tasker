const {
  USERNAME_INPUT_EMPTY,
  PASSWORD_INPUT_EMPTY,
  PASSWORD_INPUT_NOTMATCH,
  EMAIL_INPUT_EMPTY,
  EMAIL_INPUT_INVALID,
} = require("../../messages");

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

  return {
    errors,
    valid: !Object.keys(errors).length,
  };
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

  return {
    errors,
    valid: !Object.keys(errors).lenght,
  };
};
