const Table = require("../../models/Table");
const { TABLE_TITLE_EMPTY, TABLE_DELETE_ERROR } = require("../../messages");

const authCheck = require("../utils/authCheck");
const { checkId } = require("../utils/validators");

const { UserInputError } = require("apollo-server");
const { deleteSubtables, deleteSubgroup } = require("./helpers");

const {
  Mutation: { createGroup },
} = require("./groupResolver");
const User = require("../../models/User");
const Group = require("../../models/Group");

const errors = {};

module.exports = {
  Table: {
    creator: async function (parent) {
      return await User.findById(parent.creator._id);
    },
    parent: async function (parent) {
      return parent.parent ? await Table.findById(parent.parent) : null;
    },
    group: async function (parent) {
      return await Group.findById(parent.group);
    },
  },
  Query: {
    getTables: async (_, { parent }, context) => {
      //check if user sent auth token and it is valid
      const { id } = authCheck(context);
      if (parent) {
        checkId(parent);

        const table = await Table.find({
          parent,
        });

        return table;
      }

      return await Table.find({ parent: null });
    },
    getTable: async (_, { tableId }, context) => {
      //check if user sent auth token and it is valid
      const { id } = authCheck(context);

      //check ids
      checkId(tableId);

      return await Table.findById(tableId);
    },
  },
  Mutation: {
    createTable: async (_, { parent, name, description }, context) => {
      //check if user sent auth token and it is valid
      const { id, team } = authCheck(context);

      //check id
      checkId(parent);

      //check name
      if (name.trim() === "") {
        errors.name = TABLE_TITLE_EMPTY;
        throw new UserInputError(TABLE_TITLE_EMPTY, { errors });
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

        //create new Table in database
        const table = await Table.create({
          name,
          description: description || "",
          creator: id,
          parent: parent || undefined,
          group: group._id,
        });
        return await Table.findById(table.id);
      } catch (error) {
        console.log(error);
      }

      //prepare data to send query
    },
    updateTable: async (_, { tableId, name, description, parent }, context) => {
      const { id } = authCheck(context);

      checkId(tableId);
      checkId(parent);

      if (name.trim() == "") {
        errors.name = TABLE_TITLE_EMPTY;
        throw new UserInputError(TABLE_TITLE_EMPTY, { errors });
      }

      return await Table.findOneAndUpdate(
        {
          _id: tableId,
        },
        { $set: { name, description, parent } },
        { new: true, useFindAndModify: false }
      );
    },
    deleteTable: async (_, { tableId }, context) => {
      authCheck(context);
      try {
        await deleteSubtables(tableId);
        const table = await Table.findById(tableId);
        await deleteSubgroup(table.group);
        await Table.deleteOne({ _id: tableId });
      } catch (error) {
        errors.general = TABLE_DELETE_ERROR;
        throw new Error(TABLE_DELETE_ERROR, { errors });
      }

      return true;
    },
  },
};
