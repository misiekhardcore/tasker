import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import FoldersList from "../components/FoldersList";
import MenuBar from "../components/MenuBar";
import { GET_FOLDERS } from "../queries";

const Main = () => {
  const [column2, setColumn2] = useState({});

  return (
    <>
      <MenuBar />
      <div className="main__container">
        <div className="column1">
          <FoldersList setData={setColumn2} />
        </div>
        <div className="column2">
          {column2 && column2.parent && <FoldersList parent={column2.parent} />}
        </div>
        <div className="column3"></div>
      </div>
    </>
  );
};

export default Main;
