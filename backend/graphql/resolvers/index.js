const tableResolver = require("./tableResolver");
const taskResolver = require("./taskResolver");
const userResolver = require("./userResolver");

const { merge } = require("lodash");

module.exports = merge(userResolver, taskResolver, tableResolver);
