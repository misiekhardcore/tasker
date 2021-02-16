const Team = require("../../models/Team");
const User = require("../../models/User");
const authCheck = require("../utils/authCheck");
const { checkId } = require("../utils/validators");

module.exports = {
  Team: {
    creator: async function ({ creator }) {
      return await User.findById(creator);
    },
    users: async function ({ users }) {
      return User.find({ _id: { $in: users } });
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
