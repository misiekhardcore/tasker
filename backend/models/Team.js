const { model, Schema } = require("mongoose");

const teamSchema = new Schema(
  {
    name: String,
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    avatar: String,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = model("Team", teamSchema);
