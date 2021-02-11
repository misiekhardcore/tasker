const Task = require("../../models/Task");
const { TASK_TITLE_EMPTY, TASK_DELETE_ERROR } = require("../../messages");

const authCheck = require("../utils/authCheck");
const { checkId } = require("../utils/validators");

const { UserInputError } = require("apollo-server");
const { deleteSubcomments, deleteSubgroup, getGroups } = require("./helpers");

const {
  Mutation: { createGroup },
} = require("./groupResolver");
const User = require("../../models/User");
const Table = require("../../models/Table");
const Group = require("../../models/Group");

const errors = {};

module.exports = {
  Task: {
    creator: async function (parent) {
      return await User.findById(parent.creator);
    },
    parent: async function (parent) {
      return await Table.findById(parent.parent);
    },
    comments: async function (parent) {
      return await Comment.find({ _id: { $in: parent.comments } });
    },
    group: async function (parent) {
      return await Group.findById(parent.group);
    },
  },
  Query: {
    getTasks: async (_, { parent }, context) => {
      const { id } = authCheck(context);

      checkId(parent);

      //get list of group IDs which you belong to
      const groups = await getGroups(id);

      return await Task.find({ parent, group: { $in: groups } });
    },
    getTask: async (_, { taskId }, context) => {
      //check if user sent auth token and it is valid
      const { id } = authCheck(context);

      checkId(taskId);

      //get list of group IDs which you belong to
      const groups = await getGroups(id);

      //check if task exists
      return await Task.findOne({ _id: taskId, group: { $in: groups } });
    },
  },
  Mutation: {
    createTask: async (_, { parent, name, description, status }, context) => {
      //check if user sent auth token and it is valid
      const { id } = authCheck(context);

      //check ids
      checkId(parent);

      //check name
      if (name.trim() === "") {
        errors.name = TASK_TITLE_EMPTY;
        throw new UserInputError(TASK_TITLE_EMPTY, errors);
      }
      try {
        //TODO: make separate function for this
        // const { users } = parent
        //   ? await Group.findById((await Table.findById(parent)).group)
        //   : await Team.findById(team);

        // const group = await Group.create({
        //   creator: id,
        //   avatar: randomChoice(),
        //   users,
        // });

        //probably this will work
        const group = await createGroup(_, { parent }, context);

        const task = await Task.create({
          name,
          description: description || "",
          creator: id,
          parent,
          status: status || "New",
          group: group._id,
          comments: [],
        });

        return await Task.findById(task._id);
      } catch (error) {
        console.log(error);
      }
    },
    updateTask: async (
      _,
      { taskId, name, description, parent, status },
      context
    ) => {
      const { id } = authCheck(context);

      checkId(taskId);
      checkId(parent);

      if (name.trim() == "") {
        errors.name = TASK_TITLE_EMPTY;
        throw new UserInputError(TASK_TITLE_EMPTY, { errors });
      }

      return await Task.findOneAndUpdate(
        {
          _id: taskId,
        },
        {
          $set: { name, description, status, parent },
        },
        { new: true, useFindAndModify: false }
      );
    },
    deleteTask: async (_, { taskId }, context) => {
      authCheck(context);

      try {
        const task = await Task.findById(taskId);
        deleteSubgroup(task.group);
        await Task.deleteOne({ _id: taskId });
        deleteSubcomments(taskId);
      } catch (error) {
        errors.general = TASK_DELETE_ERROR;
        throw new Error(TASK_DELETE_ERROR, { errors });
      }

      return true;
    },
  },
};
