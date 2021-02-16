import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { ADD_COMMENT, DELETE_COMMENT, GET_COMMENTS } from "../queries";
import { MdComment } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import moment from "moment";

import { Button, Form, Input, User } from "./styled";
import { AiFillDelete } from "react-icons/ai";
import { AuthContext } from "../context/auth";
import styled from "styled-components";
import Errors from "./Errors";
import Loading from "./Loading";
import { errorHandler } from "../utils/helpers";

const CommentsContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  background-color: #999;
  padding: 0.2rem;
`;

const CommentsList = styled.ul`
  list-style: none;
`;

const Comment = styled.li`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: #bbb;

  &:nth-child(even) {
    background-color: #aaa;
  }

  &:first-of-type {
    margin-top: 1rem;
    border-radius: 4px 4px 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 4px 4px;
  }

  &:first-of-type:last-of-type {
    border-radius: 4px;
  }

  & + & {
    border-top: solid 2px #aaa;
  }
  button {
    padding: 0;
  }
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: baseline;

  h3 {
    font-size: 0.85rem;
    font-weight: normal;
  }

  span {
    font-size: 0.7rem;
    color: #444;
  }
`;
const Body = styled.div`
  display: flex;
  align-items: center;

  p {
    flex-grow: 1;
    padding: 0.5rem;
    border-radius: 4px;
    background-color: white;
    margin-right: 0.5rem;
  }
`;

const Comments = ({ taskId }) => {
  const { user } = useContext(AuthContext);

  const [toggle, setToggle] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [errors, setErrors] = useState({});

  const { loading, error, data } = useQuery(GET_COMMENTS, {
    variables: { parent: taskId },
    onError(err) {
      errorHandler(err, setErrors);
    },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: {
      parent: taskId,
      body: commentBody,
    },
    update(cache, { data: { createComment } }) {
      try {
        const { getComments } = cache.readQuery({
          query: GET_COMMENTS,
          variables: { parent: taskId },
        });

        cache.writeQuery({
          query: GET_COMMENTS,
          data: {
            getComments: [createComment, ...getComments],
          },
          variables: { parent: taskId },
        });
      } catch (error) {
        throw error;
      }
    },
    onCompleted() {
      setErrors({});
    },
    onError(err) {
      errorHandler(err, setErrors);
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted() {
      setErrors({});
    },
    update(cache) {
      cache.modify({
        fields: {
          getComments(_, { DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onError(err) {
      errorHandler(err, setErrors);
    },
  });

  // useEffect(() => {
  //   setToggle(false);
  // }, [taskId]);

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

  if (loading) return <Loading />;
  if (error) return <Errors errors={errors} />;

  return (
    <CommentsContainer>
      <Form flex onSubmit={(e) => handleAddComment(e)}>
        <Button
          transparent
          type="button"
          disabled={!data}
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          <MdComment />
        </Button>
        <Input
          placeholder="Write a comment"
          type="text"
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          className={errors && errors.body && "error"}
        />
        <Button transparent type="submit">
          <IoMdAdd />
        </Button>
      </Form>
      <Errors errors={errors} />
      {data && data.getComments && toggle && (
        <CommentsList>
          {data.getComments.map(({ id, creator, createdAt, body }) => {
            return (
              <Comment key={id}>
                <Header>
                  <User avatar={creator.avatar}>
                    <span></span>
                    {creator.username}
                  </User>
                  <span className="comment__date">
                    {moment(+createdAt).format("YYYY-MM-DD, dddd hh:mm")}
                  </span>
                </Header>

                <Body>
                  <p>{body}</p>

                  {(user.username === creator.username ||
                    user.role === "Admin") && (
                    <Button transparent onClick={() => handleDeleteComment(id)}>
                      <AiFillDelete />
                    </Button>
                  )}
                </Body>
              </Comment>
            );
          })}
        </CommentsList>
      )}
    </CommentsContainer>
  );
};

export default Comments;
