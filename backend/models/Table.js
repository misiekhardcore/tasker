const { model, Schema } = require("mongoose");

const tableSchema = new Schema(
  {
    title: String,
    description: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    team: [
      {
        role: { type: Number },
        user: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Table", tableSchema);
