import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import MenuBar from "../components/MenuBar";

const Main = () => {
  const [parentId, setParentId] = useState("");
  const [getFolder, { data: folder }] = useLazyQuery(GET_FOLDERS, {
    variables: {
      parent: parentId,
    },
  });

  const [getTasks, { data: tasks }] = useLazyQuery(GET_TASKS, {
    variables: {
      parent: parentId,
    },
  });

  const sidebar = useQuery(GET_FOLDERS);
  return (
    <>
      <MenuBar />
      <div className="main__container">
        <div className="sidebar">
          <ul>
            <li>
              <input type="text" />
              <button onClick={() => {}}>
                <IoMdAdd />
              </button>
            </li>
            {sidebar.data &&
              sidebar.data.getTables.map((table) => (
                <li
                  className="sidebar__folder"
                  data-tooltip={table.name}
                  key={table.id}
                  onClick={(e) => {
                    e.target.focus();
                    setParentId(table.id);
                    getFolder();
                    getTasks();
                  }}
                >
                  <p>{table.name}</p>
                </li>
              ))}
          </ul>
        </div>
        <div className="column1">
          {folder && (
            <ul>
              {folder.getTables.map((table) => (
                <li
                  data-tooltip={table.name}
                  key={table.id}
                  onClick={() => {
                    setParentId(table.id);
                    getFolder();
                    getTasks();
                  }}
                >
                  {table.name}
                </li>
              ))}
            </ul>
          )}
          {tasks && (
            <ul>
              {tasks.getTasks.map((task) => (
                <li
                  data-tooltip={task.name}
                  key={task.id}
                  onClick={() => {}}
                >
                  <p>{task.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="column2"></div>
      </div>
    </>
  );
};

const GET_FOLDERS = gql`
  query getTables($parent: ID) {
    getTables(parent: $parent) {
      id
      name
      description
      creator {
        username
      }
      parent {
        id
      }
      updatedAt
    }
  }
`;

const GET_TASKS = gql`
  query getTasks($parent: ID!) {
    getTasks(parent: $parent) {
      id
      name
      description
    }
  }
`;

export default Main;
