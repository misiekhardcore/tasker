const { model, Schema } = require("mongoose");

const groupSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    avatar: String,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    parent: { type: Schema.Types.ObjectId, refPath: "Parent" },
    Parent: { type: String, enum: ["Table", "Task"] },
  },

  {
    timestamps: true,
  }
);

module.exports = model("Group", groupSchema);
