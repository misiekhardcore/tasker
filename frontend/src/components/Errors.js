import React from "react";
import styled from "styled-components";

const ErrorList = styled.ul`
  display: block;
  padding: 0.5rem;
  padding-left: 2rem;
  margin: 1rem 0;
  border-radius: 4px;
  color: #dd3131;
  font-size: 0.8rem;
  background-color: #f9f9f9;
  list-style: disc;
`;

const ListItem = styled.li`
  display: list-item;
`;

const Errors = ({ errors }) => {
  if (errors && Object.keys(errors).length > 0)
    return (
      <ErrorList>
        {Object.values(errors).map((error, index) => (
          <ListItem key={index}>{error}</ListItem>
        ))}
      </ErrorList>
    );
  else return null;
};

export default Errors;
