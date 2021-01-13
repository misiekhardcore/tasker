import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React, { useState } from "react";

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
    <div className="main__container">
      <div className="sidebar">
        {sidebar.data && (
          <ul>
            {sidebar.data.getTables.map((table) => (
              <li
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
      </div>
      <div className="column1">
        {folder && (
          <ul>
            {folder.getTables.map((table) => (
              <li
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
              <li key={task.id} onClick={() => {}}>
                {task.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
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
