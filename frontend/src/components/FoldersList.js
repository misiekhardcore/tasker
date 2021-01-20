import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import {
  ADD_FOLDER,
  ADD_TASK,
  DELETE_FOLDER,
  DELETE_TASK,
  GET_FOLDERS,
  GET_TASKS,
} from "../queries";

const FoldersList = ({
  setData = () => {},
  parents = [],
  setBack = () => {},
  back = [],
  setFolder = () => {},
  setTask = () => {},
}) => {
  const back2 = [...back];
  const parents2 = [...parents];
  const parent = parents2[parents.length - 1] || undefined;
  const prev = parents2[parents.length - 2] || undefined;

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

  const [addTask] = useMutation(ADD_TASK, {
    variables: {
      name: taskName,
      parent,
    },
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
    parents2.push(id);
    back2.push(name);
    setFolder(id);
    setData(parents2);
    setBack(back2);
    setTask();
  }

  return (
    <ul className="list__items">
      {prev && (
        <li
          key="1"
          className="list__item"
          onClick={() => {
            parents2.pop();
            back2.pop();
            setData(parents2);
            setBack(back2);
          }}
        >
          <BiArrowBack />
          <p>{back[back.length - 1] || ""}</p>
        </li>
      )}
      <li className="list__item" key="2">
        <form
          className="list__form"
          onSubmit={(e) => {
            e.preventDefault();
            addFolder();
            setTableName("");
          }}
        >
          <input
            name="name"
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Add new table..."
          />
          <div className="button--add">
            <button type="submit">
              <IoMdAdd />
            </button>
          </div>
        </form>
      </li>
      {parent && (
        <li className="list__item" key="3">
          <form
            className="list__form"
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
              setTaskName("");
            }}
          >
            <input
              name="name"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Add new task..."
            />
            <div className="button--add">
              <button type="submit">
                <IoMdAdd />
              </button>
            </div>
          </form>
        </li>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="error-list">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
      {data &&
        data.getTables.map((table) => (
          <>
            <li
              className="list__item"
              data-tooltip={table.name}
              key={table.id}
            >
              <p
                onClick={() => {
                  handleParent(table.id, table.name);
                }}
              >
                {table.name}
              </p>
              <div className="buttons">
                <button
                  onClick={() => {
                    deleteFolder({
                      variables: { parent: table.id },
                    });
                    setData(parents2);
                    setBack(back2);
                    setFolder();
                  }}
                >
                  <AiFillDelete />
                </button>
              </div>
            </li>
          </>
        ))}
      {data2 &&
        data2.getTasks.map((task) => (
          <>
            <li
              className="list__item"
              data-tooltip={task.name}
              key={task.id}
              onClick={() => {
                setTask(task.id);
                setFolder();
              }}
            >
              <p>{task.name}</p>
              <div className="buttons">
                <button
                  onClick={() => {setTask();
                    deleteTask({
                      variables: { taskId: task.id },
                    });
                    
                  }}
                >
                  <AiFillDelete />
                </button>
              </div>
            </li>
          </>
        ))}
    </ul>
  );
};

export default FoldersList;
