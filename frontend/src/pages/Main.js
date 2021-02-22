import React, { useContext } from "react";
import List from "../components/List";
import MenuBar from "../components/MenuBar";
import CreateModifyTable from "../components/CreateModifyTable";
import CreateModifyTask from "../components/CreateModifyTask";
import { ListContext } from "../context/list";
import Notifications from "../components/Notifications";

const Main = () => {
  const { column2, folder, task } = useContext(ListContext);

  return (
    <>
      <MenuBar />
      <main className="main__container">
        <section className="column1">
          <List />
        </section>
        <section className="column2">
          {column2.length > 0 && <List subList />}
        </section>
        <section className="column3">
          {folder && <CreateModifyTable />}
          {task && <CreateModifyTask />}
        </section>
        <Notifications />
      </main>
    </>
  );
};

export default Main;
