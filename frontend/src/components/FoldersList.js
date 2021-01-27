import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import { AiFillDelete, AiFillFolder, AiFillSchedule } from "react-icons/ai";
import {
  ADD_FOLDER,
  ADD_TASK,
  DELETE_FOLDER,
  DELETE_TASK,
  GET_FOLDERS,
  GET_TASKS,
} from "../queries";
import { Button, Form, Input } from "./styled";
import { ListContext } from "../context/list";
import Errors from "./Errors";

const FoldersList = ({ subList }) => {
  const { back, column2, setColumn2, setTask, setFolder, setBack } = useContext(
    ListContext
  );

  let back2 = [...back];
  let parents2 = [...column2];
  const parent = subList
    ? parents2[column2.length - 1] || undefined
    : undefined;
  const prev = parents2[column2.length - 2] || undefined;

  const [tableName, setTableName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [errors, setErrors] = useState({});

  const { data } = useQuery(GET_FOLDERS, {
    variables: {
      parent,
    },
  });

  const { data: data2 } = useQuery(GET_TASKS, {
    variables: {
      parent,
    },
  });

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

  const [deleteFolder] = useMutation(DELETE_FOLDER, {
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

  const [deleteTask] = useMutation(DELETE_TASK, {
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

  function handleParent(id, name) {
    if (subList) {
      parents2.push(id);
      back2.push(name);
    } else {
      parents2 = [id];
      back2 = [name];
    }
    setColumn2(parents2);
    setBack(back2);
    setFolder(id);
    setTask();
  }

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

  function handleDeleteFolder(id) {
    deleteFolder({
      variables: { parent: id },
    });
    setColumn2(parents2);
    setBack(back2);
    setFolder();
  }

  function handleAddTask(e) {
    e.preventDefault();
    addTask();
    setTaskName("");
  }

  function handleDeleteTask(id) {
    deleteTask({
      variables: { taskId: id },
    });
    setTask();
  }

  return (
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
      {data &&
        data.getTables.map((table) => (
          <li
            className="list__item table"
            data-tooltip={table.name}
            key={table.id}
          >
            <AiFillFolder />
            <p
              onClick={() => {
                handleParent(table.id, table.name);
              }}
            >
              {table.name}
            </p>
            <Button onClick={() => handleDeleteFolder(table.id)}>
              <AiFillDelete />
            </Button>
          </li>
        ))}
      {data2 &&
        data2.getTasks.map((task) => (
          <li
            className="list__item task"
            data-tooltip={task.name}
            key={task.id}
          >
            <AiFillSchedule />
            <p
              onClick={() => {
                setTask(task.id);
                setFolder();
              }}
            >
              {task.name}
            </p>
            <Button onClick={() => handleDeleteTask(task.id)}>
              <AiFillDelete />
            </Button>
          </li>
        ))}
    </ul>
  );
};

export default FoldersList;
