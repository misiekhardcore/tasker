import { useLazyQuery, gql } from "@apollo/client";
import React, { useEffect, useState } from "react";

const FoldersList = ({ folders, setData }) => {
  const [parent, setParent] = useState("");
  const [fetchedTables, setfetchedTables] = useState(false);
  const [fetchedTasks, setFetchedTasks] = useState(false);

  const [getFolder, { data: getTables }] = useLazyQuery(GET_FOLDERS, {
    onCompleted() {
      setfetchedTables(true);
    },
    variables: {
      parent,
    },
  });

  const [getTask, { data: getTasks }] = useLazyQuery(GET_TASKS, {
    onCompleted() {
      setFetchedTasks(true);
    },
    variables: {
      parent,
    },
  });

  useEffect(() => {
    if (fetchedTables && fetchedTasks && setData)
      setData({
        folders: getTables.getTables,
        tasks: getTasks.getTasks,
        ready: true,
      });
    setfetchedTables(false);
    setFetchedTasks(false);
  }, [fetchedTables, fetchedTasks]);

  return (
    <>
      {folders &&
        folders.map((folder) => (
          <li
            className="list__item"
            data-tooltip={folder.name}
            key={folder.id}
            onClick={() => {
              setParent(folder.id);
              getFolder();
              getTask();
              // setData({ folders: [...childFolders], tasks: [...tasks] });
            }}
          >
            <p>{folder.name}</p>
          </li>
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
