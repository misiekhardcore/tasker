import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  ADD_FOLDER,
  ADD_TASK,
  GET_FOLDERS,
  GET_TASKS,
} from "../queries";

const FoldersList = ({ setData = () => {}, parent }) => {
  const [newParent, setNewParent] = useState("");
  const [tableName, setTableName] = useState("");
  const [taskName, setTaskName] = useState("");

  const [getFolder, { data }] = useLazyQuery(GET_FOLDERS, {
    variables: {
      parent,
    },
  });

  const [getTasks, { data: data2 }] = useLazyQuery(GET_TASKS, {
    variables: {
      parent,
    },
  });

  useEffect(() => {
    getFolder();
    getTasks();
  }, []);

  const [addFolder] = useMutation(ADD_FOLDER, {
    variables: {
      name: tableName,
      parent,
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
    refetchQueries: [
      { query: GET_TASKS, variables: { parent } },
      { query: GET_FOLDERS, variables: { parent } },
    ],
  });

  useEffect(() => {
    setData({ parent: newParent });
  }, [newParent]);

  return (
    <ul className="list__items">
      <li className="list__item">
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
          <button type="submit">
            <IoMdAdd />
          </button>
        </form>
      </li>
      {parent && (
        <li className="list__item">
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
            <button type="submit">
              <IoMdAdd />
            </button>
          </form>
        </li>
      )}
      {data &&
        data.getTables.map((folder) => (
          <>
            <li
              className="list__item"
              data-tooltip={folder.name}
              key={folder.id}
              onClick={() => {
                setNewParent(folder.id);
              }}
            >
              <p>{folder.name}</p>
            </li>
          </>
        ))}
      {data2 &&
        data2.getTasks.map((folder) => (
          <>
            <li
              className="list__item"
              data-tooltip={folder.name}
              key={folder.id}
              onClick={() => {
                setNewParent(folder.id);
              }}
            >
              <p>{folder.name}</p>
            </li>
          </>
        ))}
    </ul>
  );
};

export default FoldersList;
