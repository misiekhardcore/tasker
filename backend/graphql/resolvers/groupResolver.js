const Group = require("../../models/Group");
const Table = require("../../models/Table");
const Team = require("../../models/Team");
const authCheck = require("../utils/authCheck");
const { randomChoice } = require("../utils/helpers");

module.exports = {
  Query: {
    getGroups: async (_, { userId }, context) => {},
    getGroup: async (_, { groupId }, context) => {},
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
    updateGroup: async (_, { users, groupId }, context) => {},
  },
};
