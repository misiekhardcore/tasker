import { gql, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import {
  ADD_FOLDER,
  ADD_TASK,
  GET_FOLDERS,
  GET_TASKS,
} from "../queries";
import { Button, Form, Input } from "./styled";
import { ListContext } from "../context/list";
import Errors from "./Errors";
import TasksList from "./TasksList";
import FoldersList from "./FoldersList";

const List = ({ subList }) => {
  const {
    back,
    column2,
    setColumn2,
    setBack,
  } = useContext(ListContext);

  let back2 = [...back];
  let parents2 = [...column2];
  const parent = subList
    ? parents2[column2.length - 1] || undefined
    : undefined;
  const prev = parents2[column2.length - 2] || undefined;

  const [tableName, setTableName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [errors, setErrors] = useState({});

  const [addFolder] = useMutation(ADD_FOLDER, {
    variables: {
      name: tableName,
      parent,
    },
    update(cache, { data: { createTable } }) {
      cache.modify({
        fields: {
          getTables(existingTables = []) {
            const newTableRef = cache.writeFragment({
              data: createTable,
              fragment: gql`
                fragment NewTable on Tables {
                  id
                  type
                }
              `,
            });
            return [...existingTables, newTableRef];
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

  const [addTask] = useMutation(ADD_TASK, {
    variables: {
      name: taskName,
      parent,
    },
    update() {},
    onCompleted() {
      setErrors({});
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    refetchQueries: [
      { query: GET_TASKS, variables: { parent } },
      { query: GET_FOLDERS, variables: { parent } },
    ],
  });


  function handleBack() {
    parents2.pop();
    back2.pop();
    setColumn2(parents2);
    setBack(back2);
  }

  function handleAddFolder(e) {
    e.preventDefault();
    addFolder();
    setTableName("");
  }

  function handleAddTask(e) {
    e.preventDefault();
    addTask();
    setTaskName("");
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
        <li className="list__item" key="2">
          <Form flex onSubmit={handleAddFolder}>
            <Input
              name="name"
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Add new table..."
            />
            <Button type="submit">
              <IoMdAdd />
            </Button>
          </Form>
        </li>
        {subList && parent && (
          <li className="list__item" key="3">
            <Form flex onSubmit={handleAddTask}>
              <Input
                name="name"
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Add new task..."
              />
              <Button type="submit">
                <IoMdAdd />
              </Button>
            </Form>
          </li>
        )}
        <Errors errors={errors} />
      </ul>
      <FoldersList parent={parent} />
      <TasksList parent={parent} />
    </>
  );
};

export default List;
