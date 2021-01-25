import React, { useContext, useState } from "react";
import FoldersList from "../components/FoldersList";
import MenuBar from "../components/MenuBar";
import CreateModifyTable from "../components/CreateModifyTable";
import CreateModifyTask from "../components/CreateModifyTask";
import { ListContext } from "../context/list";

const Main = () => {
  const { column2, folder, task } = useContext(ListContext);

  return (
    <>
      <MenuBar />
      <div className="main__container">
        <div className="column1">
          <FoldersList />
        </div>
        <div className="column2">
          {column2.length > 0 && <FoldersList subList />}
        </div>
        <div className="column3">
          {folder && <CreateModifyTable />}
          {task && <CreateModifyTask />}
        </div>
      </div>
    </>
  );
};

export default Main;
