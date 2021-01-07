const { model, Schema } = require("mongoose");

const tableSchema = new Schema(
  {
    title: String,
    descrition: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
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
