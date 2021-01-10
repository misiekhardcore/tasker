const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { AUTHORIZATION_ERROR } = require("../../messages");

module.exports = (context) => {
  //get header from request context
  const authHeader = context.req.headers.authorization;
  

  const errors = {};

  if (!authHeader) {
    errors.authorization = AUTHORIZATION_ERROR;
    throw new AuthenticationError(AUTHORIZATION_ERROR, errors);
  }

  const token = authHeader.split("Bearer ")[1];
  
  if (!token) {
    errors.authorization = AUTHORIZATION_ERROR;
    throw new AuthenticationError(AUTHORIZATION_ERROR, errors);
  }

  const user = jwt.verify(token, JWT_SECRET);

  return user;
};
