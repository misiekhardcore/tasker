const Team = require("../../models/Team");
const User = require("../../models/User");
const authCheck = require("../utils/authCheck");

module.exports = {
  Query: {
    getTeam: async (_, args, context) => {
      //check auth
      const { id } = authCheck(context);
      const user = await User.findById(id);
      return await Team.findById(user.team);
    },
  },
};
