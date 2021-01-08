const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

//messages
const {
  USER_VALIDATION_ERROR,
  USER_NOT_FOUND,
  USER_WRONG_CREDENTIALS,
  USERNAME_ALREADY_EXISTS,
  EMAIL_ALREADY_EXISTS,
  REGISTER_KEY_NOT_VALID,
} = require("../../messages");

//input checkers
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../utils/validators");

//get User model
const User = require("../../models/User");

//JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

//token generator
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    login: async (_, { username, password }) => {
      //validate inputs
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError(USER_VALIDATION_ERROR, errors);
      }

      //find user
      const user = await User.findOne({ username });

      if (!user) {
        errors.username = USER_NOT_FOUND;
        throw new UserInputError(USER_NOT_FOUND, errors);
      }

      //check password
      const matchPasswords = await bcrypt.compare(password, user.password);

      if (!matchPasswords) {
        errors.general = USER_WRONG_CREDENTIALS;
        throw new UserInputError(USER_WRONG_CREDENTIALS, errors);
      }

      //everything is ok, generate token
      const token = generateToken(user);

      return {
        user: { ...user, id: user._id },
        token,
      };
    },
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword, key } }
    ) => {
      //valisate inputs
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
        key
      );

      if (!valid) {
        throw new UserInputError(USER_VALIDATION_ERROR, errors);
      }

      //check key
      let matchLicence = false;
      const keyCheck = await User.findOne({ key });

      if (!keyCheck) {
        matchLicence = await bcrypt.compare(username + email, key);
        if (!matchLicence) {
          errors.key = REGISTER_KEY_NOT_VALID;
          throw new UserInputError(REGISTER_KEY_NOT_VALID, errors);
        }
      }

      //check if username is not already taken
      let user = await User.findOne({ username });

      if (user) {
        errors.username = USERNAME_ALREADY_EXISTS;
        throw new UserInputError(USERNAME_ALREADY_EXISTS, errors);
      }

      //check if email is not already taken
      user = await User.findOne({ email });

      if (user) {
        errors.email = EMAIL_ALREADY_EXISTS;
        throw new UserInputError(EMAIL_ALREADY_EXISTS, errors);
      }

      //hash password
      password = await bcrypt.hash(password, 12);

      //create new User
      const newUser = new User({
        username,
        email,
        password,
        role: matchLicence ? 1 : 0,
        key,
      });

      //save user
      user = await newUser.save();

      //generate token
      const token = generateToken(user);

      return {
        user: { ...user._doc, id: user._id },
        token,
      };
    },
  },
};
