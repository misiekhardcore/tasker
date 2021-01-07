const Table = require("../../models/Table");
const {
  TABLE_NOT_FOUND,
  AUTHORIZATION_ERROR,
  TABLE_TITLE_EXISTS,
} = require("../../messages");
const authCheck = require("../utils/authCheck");
const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server");
const Mongoose = require("mongoose");

module.exports = {
  Query: {
    getTables: async (_, args, context) => {
      //check if user sent auth token and it is valid
      const { user, errors, valid } = authCheck(context);

      if (!valid) {
        throw new AuthenticationError(AUTHORIZATION_ERROR, errors);
      }

      const tables = await Table.find().sort({
        createdAt: -1,
      });

      if (!tables) {
        errors.general = TABLE_NOT_FOUND;
        throw new Error(TABLE_NOT_FOUND, errors);
      }

      console.log(tables);
      const tables2 = tables.map(async (table) => {
        await table
          .populate("creator")
          .populate("team.user")
          .execPopulate();
        table.creator.token = "";
        return table;
      });

      return tables2;
    },
    getTable: async (_, { tableId }, context) => {
      //check if user sent auth token and it is valid
      const { user, errors, valid } = authCheck(context);

      if (!valid) {
        throw new AuthenticationError(AUTHORIZATION_ERROR, errors);
      }

      const table = await Table.findById(tableId);

      if (!table) {
        errors.general = TABLE_NOT_FOUND;
        throw new Error(TABLE_NOT_FOUND, errors);
      }

      await table
        .populate("creator")
        .populate("team.user")
        .execPopulate();
      table.creator.token = "";

      return table;
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
      const sameTable = Table.find({ creator: user.id, title });
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
      await table
        .populate("creator")
        .populate("team.user")
        .execPopulate();
      table.creator.token = "";
      return table;
    },
  },
};
