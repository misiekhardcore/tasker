const { model, Schema } = require("mongoose");

const tableSchema = new Schema(
  {
    name: String,
    description: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    parent: { type: Schema.Types.ObjectId, ref: "Table" },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Table", tableSchema);
