import React from "react";
import styled from "styled-components";
import { darken } from "polished";

const ErrorList = styled.ul`
  display: block;
  padding: 0.5rem;
  padding-left: 2rem;
  margin: 1rem 0;
  border-radius: 0.5rem;
  color: #dd3131;
  font-size: 0.8rem;
  background-color: ${darken(0.05, "white")};
  list-style: disc;
`;

const ListItem = styled.li`
  display: list-item;
`;

const Errors = ({ errors }) => {
  if (Object.keys(errors).length > 0)
    return (
      <ErrorList>
        {Object.values(errors).map((error) => (
          <ListItem key={error}>{error}</ListItem>
        ))}
      </ErrorList>
    );
  else return null;
};

export default Errors;
