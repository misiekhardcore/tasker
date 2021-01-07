const { model, Schema } = require("mongoose");

const taskSchema = new Schema(
  {
    title: String,
    descrition: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: Number,
    comments: [{
      type: Schema.Types.ObjectId,
      ref: "Comment",
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Task", taskSchema);
