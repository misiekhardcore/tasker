import React, { useContext, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { ListContext } from "../context/list";
import Errors from "./Errors";
import TasksList from "./TasksList";
import FoldersList from "./FoldersList";
import FolderAdd from "./FolderAdd";
import TaskAdd from "./TaskAdd";
import styled from "styled-components";

const BackButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.3rem 0.5rem;
  border: none;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    background-color: lightgray;
    transform: scale(1.05);
  }

  p {
    flex-grow: 1;
    margin-left: 0.5rem;
    text-align: left;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const List = ({ subList }) => {
  const { back, column2, setColumn2, setBack } = useContext(
    ListContext
  );

  let back2 = [...back];
  let parents2 = [...column2];
  const parent = subList
    ? parents2[column2.length - 1] || undefined
    : undefined;
  const prev = parents2[column2.length - 2] || undefined;

  const [errors, setErrors] = useState({});

  function handleBack() {
    parents2.pop();
    back2.pop();
    setColumn2(parents2);
    setBack(back2);
  }

  return (
    <>
      {subList && prev && (
        <BackButton key="1" className="list__item" onClick={handleBack}>
          <BiArrowBack />
          <p>{back[back.length - 1] || ""}</p>
        </BackButton>
      )}
      <FolderAdd parent={parent} setErrors={setErrors} />
      {subList && parent && (
        <TaskAdd parent={parent} setErrors={setErrors} />
      )}
      <Errors errors={errors} />
      <FoldersList parent={parent} />
      <TasksList parent={parent} />
    </>
  );
};

export default List;
