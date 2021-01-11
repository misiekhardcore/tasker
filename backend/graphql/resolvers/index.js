const tableResolver = require("./tableResolver");
const taskResolver = require("./taskResolver");
const userResolver = require("./userResolver");
const teamResolver = require("./teamResolver");
const commentResolver = require("./commentResolver");

const { merge } = require("lodash");

module.exports = merge(
  userResolver,
  taskResolver,
  tableResolver,
  teamResolver,
  commentResolver
);
