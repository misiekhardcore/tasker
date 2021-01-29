import React, { useContext, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { ListContext } from "../context/list";
import Errors from "./Errors";
import TasksList from "./TasksList";
import FoldersList from "./FoldersList";
import FolderAdd from "./FolderAdd";
import TaskAdd from "./TaskAdd";

const List = ({ subList }) => {
  const { back, column2, setColumn2, setBack } = useContext(ListContext);

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
      <ul className="list__items">
        {subList && prev && (
          <li key="1" className="list__item" onClick={handleBack}>
            <BiArrowBack />
            <p>{back[back.length - 1] || ""}</p>
          </li>
        )}
        <FolderAdd parent={parent} setErrors={setErrors} />
        {subList && parent && <TaskAdd parent={parent} setErrors={setErrors} />}
        <Errors errors={errors} />
      </ul>
      <FoldersList parent={parent} />
      <TasksList parent={parent} />
    </>
  );
};

export default List;
