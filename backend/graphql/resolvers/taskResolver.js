const Task = require("../../models/Task");
const Table = require("../../models/Table");
const {
  TABLE_NOT_FOUND,
  TASK_TITLE_EMPTY,
  OERATION_NOT_ALLOWED,
  TASK_NOT_FOUND,
  NOT_VALID_ID,
  AUTHORIZATION_ERROR,
} = require("../../messages");
const authCheck = require("../utils/authCheck");
const { AuthenticationError, UserInputError } = require("apollo-server");
const { transformTask } = require("./merge");
var ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  Query: {
    getTask: async (_, { taskId, tableId }, context) => {
      //check if user sent auth token and it is valid
      const { user, errors, valid } = authCheck(context);

      if (!valid) {
        throw new AuthenticationError(AUTHORIZATION_ERROR, errors);
      }

      //check ids
      if (!ObjectId.isValid(taskId) || !ObjectId.isValid(tableId)) {
        errors.general = NOT_VALID_ID;
        throw new UserInputError(NOT_VALID_ID, errors);
      }

      //check if task exists
      const task = await Task.findById(taskId);

      if (!task) {
        errors.general = TASK_NOT_FOUND;
        throw new UserInputError(TASK_NOT_FOUND, errors);
      }

      //check if table exists
      const table = await Table.findById(tableId);
      console.log(table);
      if (!table) {
        errors.general = TABLE_NOT_FOUND;
        throw new UserInputError(TABLE_NOT_FOUND, errors);
      }

      //check permissions
      const permCheck = table._doc.team.filter((t) => {
        return t.user.id === user.id && t.role > 1;
      });

      if (!permCheck) {
        errors.authorization = OERATION_NOT_ALLOWED;
        throw new AuthenticationError(OERATION_NOT_ALLOWED, errors);
      }

      return transformTask(task);
    },
  },
  Mutation: {
    createTask: async (
      _,
      { taskInput: { tableId, title, description } },
      context
    ) => {
      //check if user sent auth token and it is valid
      const { user, errors, valid } = authCheck(context);

      if (!valid) {
        throw new AuthenticationError(AUTHORIZATION_ERROR, errors);
      }

      //check ids
      if (!ObjectId.isValid(tableId)) {
        errors.general = NOT_VALID_ID;
        throw new UserInputError(NOT_VALID_ID, errors);
      }

      //check title
      if (title.trim() === "") {
        errors.title = TASK_TITLE_EMPTY;
        throw new UserInputError(TASK_TITLE_EMPTY, errors);
      }

      //check if table exists
      const table = await Table.findById(tableId);

      if (!table) {
        errors.general = TABLE_NOT_FOUND;
        throw new UserInputError(TABLE_NOT_FOUND, errors);
      }

      //check permissions
      const permCheck = table._doc.team.filter((t) => {
        return t.user.id === user.id && t.role > 1;
      });

      if (!permCheck) {
        errors.authorization = OERATION_NOT_ALLOWED;
        throw new AuthenticationError(OERATION_NOT_ALLOWED, errors);
      }

      const newTask = new Task({
        title,
        description,
        creator: user.id,
        status: 0,
        comments: [],
      });

      const task = await newTask.save();

      //add task to table tasks
      await Table.findOneAndUpdate(
        { _id: tableId },
        { $push: { tasks: task._id } }
      );

      return transformTask(task);
    },
  },
};
