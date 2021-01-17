import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import {
  ADD_FOLDER,
  ADD_TASK,
  DELETE_FOLDER,
  GET_FOLDERS,
  GET_TASKS,
} from "../queries";

const FoldersList = ({
  setData = () => {},
  parents = [],
  setBack = () => {},
  back = [],
}) => {
  const back2 = [...back];
  const parents2 = [...parents];
  const parent = parents2[parents.length - 1] || undefined;
  const prev = parents2[parents.length - 2] || undefined;

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

  const [deleteFolder] = useMutation(DELETE_FOLDER, {
    refetchQueries: [
      { query: GET_TASKS, variables: { parent } },
      { query: GET_FOLDERS, variables: { parent } },
    ],
  });

  function handleParent(id, name) {
    parents2.push(id);
    back2.push(name);
    setData(parents2);
    setBack(back2);
  }

  return (
    <ul className="list__items">
      {prev && (
        <li
          className="list__item"
          onClick={() => {
            parents2.pop();
            back2.pop();
            setData(parents2);
            setBack(back2);
          }}
        >
          <BiArrowBack />
          <parent>{back[back.length - 1] || ""}</parent>
        </li>
      )}
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
          <div className="buttons">
            <button type="submit">
              <IoMdAdd />
            </button>
          </div>
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
            <div className="buttons">
              <button type="submit">
                <IoMdAdd />
              </button>
            </div>
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
                handleParent(folder.id, folder.name);
              }}
            >
              <p>{folder.name}</p>
              <div className="buttons">
                <button
                  onClick={() => {
                    console.log("asdasdasdasd");
                  }}
                >
                  <AiFillEdit />
                </button>
                <button
                  onClick={() => {
                    deleteFolder({
                      variables: { parent: folder.id },
                    });
                    setData({ parent: null });
                  }}
                >
                  <AiFillDelete />
                </button>
              </div>
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
                setData({ parent: folder.id });
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
