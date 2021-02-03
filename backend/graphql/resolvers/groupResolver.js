const Group = require("../../models/Group");
const Table = require("../../models/Table");
const Team = require("../../models/Team");
const authCheck = require("../utils/authCheck");
const { randomChoice } = require("../utils/helpers");
const { checkId } = require("../utils/validators");

module.exports = {
  Query: {
    getGroups: async (_, { userId }, context) => {
      const { id } = authCheck(context);

      checkId(userId);

      return await Group.find({ users: userId })
        .populate("creator")
        .populate("users");
    },
    getGroup: async (_, { groupId }, context) => {
      const { id } = authCheck(context);

      checkId(groupId);

      return await Group.findById(groupId)
        .populate("creator")
        .populate("users");
    },
  },
  Mutation: {
    createGroup: async (_, { parent }, context) => {
      const { id, team } = authCheck(context);
      try {
        const { users } = parent
          ? await Group.findById((await Table.findById(parent)).group)
          : await Team.findById(team);

        const group = await Group.create({
          creator: id,
          avatar: randomChoice(),
          users,
        });

        return await Group.findById(group._id)
          .populate("users")
          .populate("creator");
      } catch (error) {
        console.log(error);
      }
    },
    updateGroup: async (_, { users, groupId }, context) => {
      const { id } = authCheck(context);

      checkId(groupId);

      return await Group.findOneAndUpdate(
        { _id: groupId },
        { $set: { users } },
        { new: true, useFindAndModify: false }
      );
    },
  },
};
