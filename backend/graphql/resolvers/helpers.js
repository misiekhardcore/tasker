const Table = require("../../models/Table");
const Task = require("../../models/Task");
const Comment = require("../../models/Comment");
const Group = require("../../models/Group");

async function deleteSubtables(id) {
  const tables = await Table.find({ parent: id });
  await deleteSubtasks(id);
  for (const table of tables) {
    await deleteSubgroup(table.group);
    await deleteSubtables(table._id);
    await Table.deleteOne({ _id: table._id });
  }
}

async function deleteSubtasks(id) {
  const tasks = await Task.find({ parent: id });
  for (const task of tasks) {
    await deleteSubcomments(task._id);
    await deleteSubgroup(task.group);
    await Task.deleteOne({ _id: task._id });
  }
}

async function deleteSubcomments(id) {
  await Comment.deleteMany({ parent: id });
}

async function deleteSubgroup(id) {
  await Group.deleteOne({ _id: id });
}

async function getGroups(userId) {
  const groups = await Group.find({ users: userId });
  return groups.map((group) => group._id);
}

module.exports = {
  deleteSubtables,
  deleteSubtasks,
  deleteSubcomments,
  deleteSubgroup,
  getGroups,
};
