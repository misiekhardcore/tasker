module.exports = {
  Query: {
    getGroups: async (_, { userId }, context) => {},
    getGroup: async (_, { groupId }, context) => {},
  },
  Mutation: {
    createGroup: async (_, { users, parent }, context) => {},
    updateGroup: async (_, { users, groupId }, context) => {},
  },
};
