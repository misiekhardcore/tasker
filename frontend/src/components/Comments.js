import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { ADD_COMMENT, GET_COMMENTS } from "../queries";
import { MdComment } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import moment from "moment";

import "./Comments.scss";

const Comments = ({ taskId }) => {
  const [toggle, setToggle] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [comments, setComments] = useState();
  const [errors, setErrors] = useState({});

  const { data } = useQuery(GET_COMMENTS, {
    variables: { parent: taskId },
    onCompleted() {
      setComments(data.getComments);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: {
      parent: taskId,
      body: commentBody,
    },
    onCompleted({ createComment }) {
      setErrors({});
      setCommentBody("");
      console.log(createComment);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    refetchQueries: [
      { query: GET_COMMENTS, variables: { parent: taskId } },
    ],
  });

  return (
    <div className="comments__container">
      <div className="comment__input">
        <form
          className="list__form"
          onSubmit={(e) => {
            e.preventDefault();
            addComment();
          }}
        >
          <input
            className="form__input"
            placeholder="Write a comment"
            type="text"
            value={commentBody}
            onChange={(e) => {
              setCommentBody(e.target.value);
            }}
          />
          <button className="button--add" type="submit">
            <IoMdAdd />
          </button>
        </form>
        <button
          className="button"
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          <MdComment />
        </button>
      </div>
      {comments && comments.length > 0 && (
        <>
          <ul className="list__items">
            {toggle && (
              <>
                {comments.map((comment) => {
                  return (
                    <li key={comment.id}>
                      <div className="comment">
                        <div className="comment__creator">
                          {comment.creator.username}
                        </div>
                        <div className="comment__date">
                          {moment(+comment.createdAt).format(
                            "YYYY-MM-DD, dddd hh:mm"
                          )}
                        </div>
                        <div className="comment__body">
                          {comment.body}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default Comments;
