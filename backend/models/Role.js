const { model, Schema } = require("mongoose");

const roleSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    role: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Role", roleSchema);
