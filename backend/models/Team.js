const { Schema } = require("mongoose");
const Table = require("./Table");

module.exports = Table.discriminator("Team", new Schema({}), {
  timestamps: true,
});
