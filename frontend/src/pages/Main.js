import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import AddFolder from "../components/AddFolder";
import FoldersList from "../components/FoldersList";
import MenuBar from "../components/MenuBar";

const Main = () => {
  const [column1, setColumn1] = useState({});
  const { data: sidebar } = useQuery(GET_FOLDERS, {});

  const handleSetColumn1 = (data) => {
    setColumn1(data);
  };

  return (
    <>
      <MenuBar />
      <div className="main__container">
        <div className="sidebar">
          <ul>
            <li>
              <AddFolder />
            </li>
            {sidebar && (
              <FoldersList
                folders={sidebar.getTables}
                setData={handleSetColumn1}
              />
            )}
          </ul>
        </div>
        <div className="column1">
          {column1 && column1.ready && (
            <ul>
              <FoldersList folders={column1.folders} />
            </ul>
          )}
          {column1 && column1.tasks && (
            <ul>
              <FoldersList folders={column1.tasks} />
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

export default Main;
