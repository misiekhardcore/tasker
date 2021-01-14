import { useLazyQuery, gql } from "@apollo/client";
import React, { useEffect, useState } from "react";

const FoldersList = ({
  folders = [],
  setData = () => {},
  getData = [],
}) => {
  const [parent, setParent] = useState("");
  const [tables, setTables] = useState({});
  const [tasks, setTasks] = useState({});

  const [getFolder, { data }] = useLazyQuery(GET_FOLDERS, {
    onCompleted() {
      const { getTables } = data;
      setTables({ folders: getTables });
    },
    variables: {
      parent,
    },
  });

  const [getTask, { data: data2 }] = useLazyQuery(GET_TASKS, {
    onCompleted() {
      const { getTasks } = data2;
      setTasks({ tasks: getTasks });
    },
    variables: {
      parent,
    },
  });

  useEffect(() => {
    setData({ folders: tables.folders, tasks: tasks.tasks, parent });
  }, [tables, tasks]);

  return (
    <>
      {folders &&
        folders.map((folder) => (
          <>
            <li
              className="list__item"
              data-tooltip={folder.name}
              key={folder.id}
              onClick={() => {
                setParent(folder.id);
                getFolder();
                getTask();
              }}
            >
              <p>{folder.name}</p>
            </li>
          </>
        ))}
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

export default FoldersList;
