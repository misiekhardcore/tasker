const Team = require("../../models/Team");
const User = require("../../models/User");
const authCheck = require("../utils/authCheck");
const { checkId } = require("../utils/validators");

module.exports = {
  Team: {
    creator: async function (parent) {
      return await User.findById(parent.creator);
    },
    users: async function (parent) {
      return User.find({ _id: { $in: parent.users } });
    },
  },
  Query: {
    getTeam: async (_, { teamId }, context) => {
      const { id } = authCheck(context);

      checkId(teamId);

      return await Team.findById(teamId);
    },
  },
};
