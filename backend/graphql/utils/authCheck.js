const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { AUTHORIZATION_ERROR } = require("../../messages");

module.exports = (context) => {
  //get header from request context
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const errors = {};
    let user = null;
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        user = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        errors.authorization = AUTHORIZATION_ERROR;
      }
      return {
        user: user ? user : null,
        errors,
        valid: !Object.keys(errors).length,
      };
    }
  }
};
