const Table = require("../../models/Table");
const Task = require("../../models/Task");
const Comment = require("../../models/Comment");

async function deleteSubtables(id) {
  const tables = await Table.find({ parent: id });
  await deleteSubtasks(id);
  for (const table of tables) {
    await Table.deleteOne({ _id: table._id });
    await deleteSubtables(table._id);
  }
}

async function deleteSubtasks(id) {
  const tasks = await Task.find({ parent: id });
  for (const task of tasks) {
    await deleteSubcomments(task._id);
    await Task.deleteOne({ _id: task._id });
  }
}

async function deleteSubcomments(id) {
  await Comment.deleteMany({ parent: id });
}

module.exports = {
  deleteSubtables,
  deleteSubtasks,
  deleteSubcomments,
};
