const { model, Schema } = require("mongoose");

const taskSchema = new Schema(
  {
    name: String,
    description: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    parent: { type: Schema.Types.ObjectId, ref: "Table" },
    status: String,
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },

  {
    timestamps: true,
  }
);

module.exports = model("Task", taskSchema);
