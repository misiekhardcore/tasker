const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    role: Number,
    key: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
