const Table = require("../../models/Table");
const {
  TABLE_NOT_FOUND,
  AUTHORIZATION_ERROR,
  TABLE_TITLE_EXISTS,
  NOT_VALID_ID,
} = require("../../messages");
const authCheck = require("../utils/authCheck");
const { AuthenticationError, UserInputError } = require("apollo-server");
const { transformTable } = require("./merge");
var ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  Query: {
    getTables: async (_, args, context) => {
      //check if user sent auth token and it is valid
      const { user, errors, valid } = authCheck(context);

      if (!valid) {
        throw new AuthenticationError(AUTHORIZATION_ERROR, errors);
      }

      //get all tables where user is in team and where
      //he can at least read and sort it
      const tables = await Table.find({
        "team.user": { _id: user.id },
        "team.role": { $gte: 1 },
      }).sort({
        createdAt: -1,
      });

      //check if there are any
      if (!tables) {
        errors.general = TABLE_NOT_FOUND;
        throw new Error(TABLE_NOT_FOUND, errors);
      }

      //prepare and return data
      return tables.map(async (table) => {
        return transformTable(table);
      });
    },
    getTable: async (_, { tableId }, context) => {
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

      //check if table exists, user is in team and have
      //permissions to at least read
      const table = await Table.findOne({
        _id: tableId,
        "team.user": { _id: user.id },
        "team.role": { $gte: 1 },
      });

      if (!table) {
        errors.general = TABLE_NOT_FOUND;
        throw new Error(TABLE_NOT_FOUND, errors);
      }

      return transformTable(table);
    },
  },
  Mutation: {
    createTable: async (
      _,
      { tableInput: { title, description, team } },
      context
    ) => {
      //check if user sent auth token and it is valid
      const { user, errors, valid } = authCheck(context);

      if (!valid) {
        throw new AuthenticationError(AUTHORIZATION_ERROR, errors);
      }

      //check title
      if (title.trim() === "") {
        errors.title = TABLE_TITLE_EMPTY;
        throw new UserInputError(TABLE_TITLE_EMPTY, errors);
      }

      //check if user doenst have table with same title
      const sameTable = await Table.findOne({
        $and: [{ creator: user.id }, { title: title }],
      });

      if (sameTable) {
        errors.title = TABLE_TITLE_EXISTS;
        throw new UserInputError(TABLE_TITLE_EXISTS, errors);
      }

      //create new Table in database
      const newTable = new Table({
        title,
        description,
        creator: user.id,
        team,
        tasks: [],
      });

      //prepare data to send query
      const table = await newTable.save();
      return transformTable(table);
    },
  },
};
