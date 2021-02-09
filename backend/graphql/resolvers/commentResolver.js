const Comment = require("../../models/Comment");
const authCheck = require("../utils/authCheck");
const { checkId } = require("../utils/validators");

const { COMMENT_BODY_EMPTY, COMMENT_DELETE_ERROR } = require("../../messages");
const { UserInputError } = require("apollo-server");
const User = require("../../models/User");
const Task = require("../../models/Task");

const errors = {};

module.exports = {
  Comment: {
    creator: async function (parent) {
      return await User.findById(parent.creator);
    },
    parent: async function (parent) {
      return await Task.findById(parent.parent);
    },
  },
  Query: {
    getComments: async (_, { parent }, context) => {
      const { id } = authCheck(context);

      checkId(parent);

      return await Comment.find({ parent });
    },
    getComment: async (_, { commentId }, context) => {
      const { id } = authCheck(context);

      checkId(commentId);

      return await Comment.findById(commentId);
    },
  },
  Mutation: {
    createComment: async (_, { parent, body }, context) => {
      const { id } = authCheck(context);

      checkId(parent);

      if (body.trim() == "") {
        errors.body = COMMENT_BODY_EMPTY;
        throw new UserInputError(COMMENT_BODY_EMPTY, {
          errors,
        });
      }

      const comment = await Comment.create({
        body,
        creator: id,
        parent,
      });

      return await Comment.findById(comment.id);
    },
    deleteComment: async (_, { commentId }, context) => {
      authCheck(context);

      checkId(commentId);

      try {
        await Comment.deleteOne({ _id: commentId });
      } catch (error) {
        errors.general = COMMENT_DELETE_ERROR;
        throw new Error(COMMENT_DELETE_ERROR, { errors });
      }

      return true;
    },
  },
};
