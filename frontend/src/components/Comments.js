import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { ADD_COMMENT, DELETE_COMMENT, GET_COMMENTS } from "../queries";
import { MdComment } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import moment from "moment";

import { Button, Form, Input } from "./styled";
import { AiFillDelete } from "react-icons/ai";
import { AuthContext } from "../context/auth";
import styled from "styled-components";
import Errors from "./Errors";
import Loading from "./Loading";

const CommentsContainer = styled.div`
  width: 100%;
`;

const CommentsList = styled.ul`
  list-style: none;
`;

const Comment = styled.li`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
`;
const Body = styled.div`
  display: flex;

  p {
    flex-grow: 1;
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
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: {
      parent: taskId,
      body: commentBody,
    },
    update(cache, { data: { createComment } }) {
      cache.modify({
        fields: {
          getComments(existingComments = []) {
            const newCommentRef = cache.writeFragment({
              data: createComment,
              fragment: gql`
                fragment NewComment on Comments {
                  id
                  type
                }
              `,
            });
            return [...existingComments, newCommentRef];
          },
        },
      });
    },
    onCompleted() {
      setErrors({});
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted() {
      setErrors({});
    },
    update(cache) {
      cache.modify({
        fields: {
          getComments(existingComments = [], { DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    refetchQueries: [
      { query: GET_COMMENTS, variables: { parent: taskId } },
    ],
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

  if (loading) return <Loading />;
  if (error) return <p>Error :( {JSON.stringify(error, null, 2)}</p>;

  return (
    <CommentsContainer>
      <div className="comment__input">
        <Form flex onSubmit={(e) => handleAddComment(e)}>
          <Button
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
          <Button type="submit">
            <IoMdAdd />
          </Button>
        </Form>
      </div>
      <Errors errors={errors} />
      {data && data.getComments && toggle && (
        <CommentsList>
          {data.getComments.map(({ id, creator, createdAt, body }) => {
            return (
              <Comment key={id}>
                <Header>
                  <h3 className="comment__creator">
                    {creator.username}
                    <span className="comment__date">
                      {moment(+createdAt).format(
                        "YYYY-MM-DD, dddd hh:mm"
                      )}
                    </span>
                  </h3>
                </Header>

                <Body>
                  <p>{body}</p>

                  {(user.username === creator.username ||
                    user.role === "Admin") && (
                    <Button onClick={() => handleDeleteComment(id)}>
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
