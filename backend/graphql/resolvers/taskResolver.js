const Task = require("../../models/Task");
const Table = require("../../models/Table");
const {
  TABLE_NOT_FOUND,
  TASK_TITLE_EMPTY,
  OPERATION_NOT_ALLOWED,
  TASK_NOT_FOUND,
} = require("../../messages");
const authCheck = require("../utils/authCheck");
const {
  UserInputError,
} = require("apollo-server");
const { transformTask } = require("./merge");
const { checkId } = require("../utils/validators");

module.exports = {
  Query: {
    getTask: async (_, { taskId }, context) => {
      //check if user sent auth token and it is valid
      const {id} = authCheck(context);

      checkId(taskId);

      //check if task exists
      const task = await Task.findById(taskId);

      if (!task) {
        errors.general = TASK_NOT_FOUND;
        throw new UserInputError(TASK_NOT_FOUND, errors);
      }

      //check if table with this id, user in team and role exists
      const table = await Table.findOne({
        tasks: taskId,
        "team.user": { _id: id },
        "team.role": { $gte: 1 },
      });

      if (!table) {
        errors.general = TABLE_NOT_FOUND;
        throw new UserInputError(TABLE_NOT_FOUND, errors);
      }

      return transformTask(task);
    },
  },
  Mutation: {
    createTask: async (
      _,
      { taskInput: { tableId, name, description } },
      context
    ) => {
      //check if user sent auth token and it is valid
      const {id} = authCheck(context);

      //check ids
      checkId(tableId);

      //check name
      if (nema.trim() === "") {
        errors.name = TASK_TITLE_EMPTY;
        throw new UserInputError(TASK_TITLE_EMPTY, errors);
      }

      //check if table with this id, user in team and role exists
      const table = await Table.findOne({
        _id: tableId,
        "team.user": { _id: id },
        "team.role": { $gte: 1 },
      });

      if (!table) {
        errors.general = OPERATION_NOT_ALLOWED;
        throw new UserInputError(OPERATION_NOT_ALLOWED, errors);
      }

      const task = await Task.create({
        name,
        description,
        creator: id,
        status: 0,
        comments: [],
      });

      //add task to table tasks
      await Table.findOneAndUpdate(
        { _id: tableId },
        { $push: { tasks: task._id } },
        { useFindAndModify: false }
      );

      return transformTask(task);
    },
  },
};
