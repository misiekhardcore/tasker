const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

//messages
const {
  USER_NOT_FOUND,
  USERNAME_ALREADY_EXISTS,
  EMAIL_ALREADY_EXISTS,
  REGISTER_KEY_NOT_VALID,
} = require("../../messages");

//avatars
const avatarColors = [
  "D81B60",
  "F06292",
  "F48FB1",
  "FFB74D",
  "FF9800",
  "F57C00",
  "00897B",
  "4DB6AC",
  "80CBC4",
  "80DEEA",
  "4DD0E1",
  "00ACC1",
  "9FA8DA",
  "7986CB",
  "3949AB",
  "8E24AA",
  "BA68C8",
  "CE93D8",
];

//random picker
function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

//checkers
const {
  validateRegisterInput,
  validateLoginInput,
  checkPassword,
  checkUser,
  checkId,
} = require("../utils/validators");

//get User model
const User = require("../../models/User");
const Team = require("../../models/Team");
const Table = require("../../models/Table");

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
    { expiresIn: "8h" }
  );
}

const errors = {};

module.exports = {
  Mutation: {
    login: async (_, { email, password }) => {
      //validate inputs
      validateLoginInput(email, password);

      //find user
      const user = await checkUser({ email }, "email", USER_NOT_FOUND);

      //check password
      await checkPassword(password, user.password);

      //everything is ok, generate token
      const token = generateToken(user);

      return {
        user,
        token,
      };
    },

    register: async (
      _,
      { username, email, password, confirmPassword, key }
    ) => {
      //validate inputs
      validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
        key
      );

      const matchLicence = await bcrypt.compare(username + email, key);
      if (!matchLicence) {
        //check key
        const keyCheck = await User.find({ key });
        if (!keyCheck) {
          errors.key = REGISTER_KEY_NOT_VALID;
          throw new UserInputError(REGISTER_KEY_NOT_VALID, errors);
        }
      }

      //check if username is not already taken
      await checkUser(
        { username },
        "username",
        USERNAME_ALREADY_EXISTS,
        false
      );

      //check if email is not already taken
      await checkUser({ email }, "email", EMAIL_ALREADY_EXISTS, false);

      //common data
      const common = {
        username,
        email,
        password: await bcrypt.hash(password, 2),
        avatar: randomChoice(avatarColors),
        key,
      };

      let user;

      //create User
      user = await User.create({
        ...common,
        role: matchLicence ? "Admin" : "User",
      });

      //generate token
      const token = generateToken(user);

      return {
        user,
        token,
      };
    },
  },
};
