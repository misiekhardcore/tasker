const { model, Schema } = require("mongoose");

const groupSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    avatar: String,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Group", groupSchema);
