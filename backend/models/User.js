const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    avatar: String,
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    role: String,
    key: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
