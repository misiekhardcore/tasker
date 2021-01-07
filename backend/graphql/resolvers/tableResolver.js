const Table = require("../../models/Table");
const { TABLE_NOT_FOUND, AUTHORIZATION_ERROR } = require("../../messages");
const authCheck = require("../utils/authCheck");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Table: {},
  Query: {
    getTables: async () => {
      const errors = {};
      try {
        const tables = Table.find().sort({ createdAt: -1 });
        return tables;
      } catch (error) {
        errors.general = TABLE_NOT_FOUND;
        throw new Error(TABLE_NOT_FOUND, errors);
      }
    },
    getTable: async (_, { tableId }) => {
      const errors = {};
      try {
        const tables = Table.find({ _id: tableId }).sort({ createdAt: -1 });
        return tables;
      } catch (error) {
        errors.general = TABLE_NOT_FOUND;
        throw new Error(TABLE_NOT_FOUND, errors);
      }
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
      console.log(team[0].id);
      // newRole= new Role({
      //   user: team.id
      // })

      newTable = new Table({
        title,
        description,
        creator: user.id,
        team: [],
        tasks: [],
      });
    },
  },
};
