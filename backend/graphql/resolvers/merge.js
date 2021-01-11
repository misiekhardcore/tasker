const User = require("../../models/User");
const Task = require("../../models/Task");

module.exports = {
  transformTask: (task) => {
    return {
      id: task._id,
      ...task._doc,
      creator: () => user(task._doc.creator),
      comments: () => task._doc.comments.map((c) => comment(c._id)),
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
