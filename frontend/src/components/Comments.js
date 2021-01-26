import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { ADD_COMMENT, DELETE_COMMENT, GET_COMMENTS } from "../queries";
import { MdComment } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import moment from "moment";

import "./Comments.scss";
import { Button, Form, Input } from "./styled";
import { AiFillDelete } from "react-icons/ai";
import { AuthContext } from "../context/auth";
import Errors from "./Errors";

const Comments = ({ taskId }) => {
  const { user } = useContext(AuthContext);

  const [toggle, setToggle] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [errors, setErrors] = useState({});

  const { data } = useQuery(GET_COMMENTS, {
    variables: { parent: taskId },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: {
      parent: taskId,
      body: commentBody,
    },
    onCompleted() {
      setErrors({});
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    refetchQueries: [{ query: GET_COMMENTS, variables: { parent: taskId } }],
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted() {
      setErrors({});
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    refetchQueries: [{ query: GET_COMMENTS, variables: { parent: taskId } }],
  });

  useEffect(() => {
    setToggle(false);
  }, [taskId]);

  function handleAddComment(e) {
    e.preventDefault();
    addComment();
    setToggle(true);
    setErrors({});
    setCommentBody("");
  }

  function handleDeleteComment(id) {
    deleteComment({
      variables: {
        commentId: id,
      },
    });
  }

  return (
    <div className="comments__container">
      <div className="comment__input">
        <Button
          disabled={!data}
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          <MdComment />
        </Button>
        <Form flex onSubmit={(e) => handleAddComment(e)}>
          <Input
            placeholder="Write a comment"
            type="text"
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
          <Button type="submit">
            <IoMdAdd />
          </Button>
        </Form>
        <Errors errors={errors} />
      </div>
      {data && data.getComments && toggle && (
        <ul className="list__items">
          {data.getComments.map(({ id, creator, createdAt, body }) => {
            return (
              <li key={id}>
                <div className="comments__container">
                  <div className="comment__creator">{creator.username}</div>
                  <div className="comment__date">
                    {moment(+createdAt).format("YYYY-MM-DD, dddd hh:mm")}
                  </div>
                  <div className="comment__body">{body}</div>
                </div>
                {user.username === creator.username && (
                  <Button onClick={() => handleDeleteComment(id)}>
                    <AiFillDelete />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Comments;
