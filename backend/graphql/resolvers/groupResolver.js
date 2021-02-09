const Group = require("../../models/Group");
const Table = require("../../models/Table");
const Team = require("../../models/Team");
const User = require("../../models/User");
const authCheck = require("../utils/authCheck");
const { randomChoice } = require("../utils/helpers");
const { checkId } = require("../utils/validators");

module.exports = {
  Group: {
    creator: async function (parent) {
      return await User.findById(parent.creator);
    },
    parent: async function (parent) {
      return parent.group ? await Group.findById(parent.group) : null;
    },
    users: async function (parent) {
      return User.find({ _id: { $in: parent.users } });
    },
  },
  Query: {
    getGroups: async (_, { userId }, context) => {
      const { id } = authCheck(context);

      checkId(userId);

      return await Group.find({ users: userId });
    },
    getGroup: async (_, { groupId }, context) => {
      const { id } = authCheck(context);

      checkId(groupId);

      return await Group.findById(groupId);
    },
  },
  Mutation: {
    createGroup: async (_, { parent }, context) => {
      const { id, team } = authCheck(context);
      try {
        const { users, _id } = parent
          ? await Group.findById((await Table.findById(parent)).group)
          : await Team.findById(team);

        const group = await Group.create({
          creator: id,
          avatar: randomChoice(),
          parent: _id,
          users,
        });

        return await Group.findById(group._id);
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
