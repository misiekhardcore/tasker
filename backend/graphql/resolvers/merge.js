const { TABLE_TITLE_EMPTY } = require("../../messages");
const User = require("../../models/User");

module.exports = {
  transformTable: (table) => {
    return {
      id: table._id,
      ...table._doc,
      creator: () => user(table._doc.creator),
      team: table._doc.team.map((t) => ({
        ...t._doc,
        user: user(t._doc.user),
      })),
    };
  },
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return { ...user._doc, id: user._id };
  } catch (error) {
    throw new Error(error);
  }
};
