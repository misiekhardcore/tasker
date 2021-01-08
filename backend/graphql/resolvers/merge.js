const { TABLE_TITLE_EMPTY } = require("../../messages");
const User = require("../../models/User");
const Task = require("../../models/Task");

module.exports = {
  transformTable: (table) => {
    return {
      id: table._id,
      ...table._doc,
      creator: () => user(table._doc.creator),
      team: table._doc.team.map((t) => ({
        ...t._doc,
        user: () => user(t._doc.user),
      })),
      tasks: table._doc.tasks.map((t) => task(t._id)),
    };
  },
  transformTask: (task) => {
    return {
      id: task._id,
      ...task._doc,
      creator: () => user(task._doc.creator),
      comments: () => task._doc.comments.map((c) => comment(c._id)),
    };
  },
  transformComment: (comment) => {},
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return { ...user._doc, id: user._id };
  } catch (error) {
    throw new Error(error);
  }
};

const task = async (taskId) => {
  try {
    const task = await Task.findById(taskId);
    return { ...task._doc, id: task.id };
  } catch (error) {
    throw new Error(error);
  }
};

const comment = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);
    return { ...comment._doc, id: comment._id };
  } catch (error) {
    throw new Error(error);
  }
};
