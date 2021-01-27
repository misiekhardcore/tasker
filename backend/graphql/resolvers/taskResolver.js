const Task = require("../../models/Task");
const { TASK_TITLE_EMPTY, TASK_DELETE_ERROR } = require("../../messages");

const authCheck = require("../utils/authCheck");
const { checkId } = require("../utils/validators");

const { UserInputError } = require("apollo-server");
const { deleteSubcomments } = require("./helpers");

const errors = {};

module.exports = {
  Query: {
    getTasks: async (_, { parent }, context) => {
      const { id } = authCheck(context);

      checkId(parent);

      const tasks = await Task.find({ parent })
        .populate("creator")
        .populate("parent");

      return tasks;
    },
    getTask: async (_, { taskId }, context) => {
      //check if user sent auth token and it is valid
      const { id } = authCheck(context);

      checkId(taskId);

      //check if task exists
      const task = await Task.findById(taskId)
        .populate("creator")
        .populate("parent")
        .populate("comments");

      return task;
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

      const task = await Task.create({
        name,
        description: description || "",
        creator: id,
        parent,
        status: status || "New",
        comments: [],
      });

      return await Task.findById(task._id)
        .populate("creator")
        .populate("parent");
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
      )
        .populate("creator")
        .populate("parent");
    },
    deleteTask: async (_, { taskId }, context) => {
      authCheck(context);

      try {
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
