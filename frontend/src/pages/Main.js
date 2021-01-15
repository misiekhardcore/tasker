import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import FoldersList from "../components/FoldersList";
import MenuBar from "../components/MenuBar";

const Main = () => {
  const { data: column1 } = useQuery(GET_FOLDERS, {});
  const [column2, setColumn1] = useState({});

  return (
    <>
      <MenuBar />
      <div className="main__container">
        <div className="column1">
          {column1 && <FoldersList setData={setColumn1} />}
        </div>
        <div className="column2">
          {column2 && column2.parent && <FoldersList parent={column2.parent} />}
        </div>
        <div className="column3"></div>
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
