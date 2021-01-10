const { model, Schema } = require("mongoose");

const tableSchema = new Schema(
  {
    name: String,
    description: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    shareWith: [
      {
        kind: String,
        item: {
          type: Schema.Types.ObjectId,
          refPath: "shareWith.kind",
        },
      },
    ],
    parent: { type: Schema.Types.ObjectId, ref: "Table" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Table", tableSchema);
