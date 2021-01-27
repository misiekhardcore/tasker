import React, { useContext } from "react";
import List from "../components/List";
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
          <List />
        </div>
        <div className="column2">
          {column2.length > 0 && <List subList />}
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
