const { model, Schema } = require("mongoose");

const commentSchema = new Schema(
  {
    body: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Comment", commentSchema);
