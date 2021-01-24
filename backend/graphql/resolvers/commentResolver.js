const Comment = require("../../models/Comment");
const Task = require("../../models/Task");
const authCheck = require("../utils/authCheck");
const { checkId } = require("../utils/validators");

const { COMMENT_BODY_EMPTY } = require("../../messages");

const errors = {};

module.exports = {
  Query: {
    getComments: async (_, { parent }, context) => {
      const { id } = authCheck(context);

      checkId(parent);

      return await Comment.find({ parent }).populate("creator");
    },
    getComment: async (_, { commentId }, context) => {
      const { id } = authCheck(context);

      checkId(commentId);

      return await Comment.findById(commentId).populate("creator");
    },
  },
  Mutation: {
    createComment: async (_, { parent, body }, context) => {
      const { id } = authCheck(context);

      checkId(parent);

      if (body.trim() == "") {
        errors = COMMENT_BODY_EMPTY;
        throw new UserInputError(COMMENT_BODY_EMPTY, {
          errors,
        });
      }

      const comment = await Comment.create({
        body,
        creator: id,
        parent,
      });

      return await Comment.findById(comment.id).populate("creator");
    },
  },
};
