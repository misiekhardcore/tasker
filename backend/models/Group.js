const { model, Schema } = require("mongoose");

const groupSchema = new Schema(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    name: String,
    avatar: String,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Group", groupSchema);
