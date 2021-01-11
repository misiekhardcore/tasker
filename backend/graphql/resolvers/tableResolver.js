const Table = require("../../models/Table");
const { TABLE_TITLE_EMPTY } = require("../../messages");

const authCheck = require("../utils/authCheck");
const { checkId } = require("../utils/validators");

const { UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    getTables: async (_, { parent }, context) => {
      //check if user sent auth token and it is valid
      const { id } = authCheck(context);
      if (parent) {
        checkId(parent);

        const table = await Table.find({
          parent,
        })
          .populate("creator")
          .populate("parent");

        return table;
      }

      return await Table.find({ parent: null })
        .populate("creator")
        .populate("parent");
    },
    getTable: async (_, { tableId }, context) => {
      //check if user sent auth token and it is valid
      authCheck(context);

      //check ids
      checkId(tableId);

      return await Table.findById(tableId).populate("shareWith");
    },
  },
  Mutation: {
    createTable: async (_, { parent, name, description }, context) => {
      //check if user sent auth token and it is valid
      const { id } = authCheck(context);

      //check id
      checkId(parent);

      //check name
      if (name.trim() === "") {
        errors.name = TABLE_TITLE_EMPTY;
        throw new UserInputError(TABLE_TITLE_EMPTY, errors);
      }

      //create new Table in database
      const table = await Table.create({
        name,
        description: description || "",
        creator: id,
        parent: parent || undefined,
      });

      //prepare data to send query
      return await Table.findById(table.id)
        .populate("creator")
        .populate("parent");
    },
    updateTable: async (
      _,
      { tableId, name, description, parent },
      context
    ) => {
      const { id } = authCheck(context);

      checkId(tableId);
      checkId(parent);

      if (name.trim() == "") {
        throw new UserInputError("Name can not be empty");
      }

      return await Table.findOneAndUpdate(
        {
          _id: tableId,
        },
        { $set: { name, description, parent } },
        { new: true, useFindAndModify: false }
      )
        .populate("creator")
        .populate("parent");
    },
    deleteTable: async (_, { tableId }, context) => {
      authCheck(context);
      await Table.deleteOne({ _id: tableId });
      await deleteSubtables(tableId);
      return true;
    },
  },
};

const deleteSubtables = async (id) => {
  await Table.deleteMany({ parent: id });
};
