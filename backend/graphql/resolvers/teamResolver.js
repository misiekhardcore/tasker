const Team = require("../../models/Team");
const User = require("../../models/User");
const authCheck = require("../utils/authCheck");
const { checkId } = require("../utils/validators");

module.exports = {
  Query: {
    getTeam: async (_, { teamId }, context) => {
      const { id } = authCheck(context);

      checkId(teamId);

      return await Team.findById(teamId)
        .populate("users")
        .populate("creator")
        .populate("parent");
    },
  },
};
