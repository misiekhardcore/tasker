const Table = require("../../models/Table");
const {
  TABLE_TITLE_EMPTY,
  TABLE_TITLE_EXISTS,
} = require("../../messages");

const authCheck = require("../utils/authCheck");
const { checkId, checkUser } = require("../utils/validators");

var ObjectId = require("mongoose").Types.ObjectId;
const User = require("../../models/User");
const Group = require("../../models/Group");

const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server");

module.exports = {
  Query: {
    getTables: async (_, { parent }, context) => {
      //check if user sent auth token and it is valid
      const { id } = authCheck(context);
      if (parent) {
        checkId(parent);

        return await Table.find({ parent });
      } else {
        const user = await checkUser({ _id: id });
        const groups = await Group.find({ users: ObjectId(id) }, "_id");

        const ids = groups
          .map((g) => g.id)
          .concat(
            ["External User", "Collaborator"].includes(user.role)
              ? [ObjectId(id)]
              : [ObjectId(id), user.team]
          );
        return await Table.find({ "shareWith.item": ids })
          .populate("shareWith")
          .populate("creator");
      }
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
    createTable: async (_, { parent, name }, context) => {
      //check if user sent auth token and it is valid
      const { id } = authCheck(context);

      //check name
      if (name.trim() === "") {
        errors.nema = TABLE_TITLE_EMPTY;
        throw new UserInputError(TABLE_TITLE_EMPTY, errors);
      }

      //check if user doenst have table with same name
      const sameTable = await Table.findOne({
        $and: [{ creator: id }, { name }],
      });

      if (sameTable) {
        errors.name = TABLE_TITLE_EXISTS;
        throw new UserInputError(TABLE_TITLE_EXISTS, errors);
      }

      //create new Table in database
      const table = await Table.create({
        name,
        parent: parent || undefined,
        creator: id,
        shareWith: parent
          ? []
          : [
              {
                kind: "Team",
                item: (await User.findById(id)).team,
              },
            ],
      });

      //prepare data to send query
      return await Table.findById(table.id)
        .populate("shareWith.item")
        .populate("creator");
    },
    updateTable: async (_, { id, input }, context) => {
      authCheck(context);
      return await Table.findOneAndUpdate(
        {
          _id: id,
        },
        { $set: input },
        { new: true }
      )
        .populate("shareWith")
        .populate("creator");
    },
    deleteTable: async (_, { id }, context) => {
      authCheck(context);
      await Table.deleteOne({ _id: id });
      await deleteSubtables(id);
      delete true;
    },
  },
};

const deleteSubtables = async (id) => {
  await Table.deleteMany({ parent: id });
};
