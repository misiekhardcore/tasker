import React, { useState } from "react";
import FoldersList from "../components/FoldersList";
import MenuBar from "../components/MenuBar";
import CreateModifyTable from "../components/CreateModifyTable";
import CreateModifyTask from "../components/CreateModifyTask";

const Main = () => {
  //current tables ids
  const [column2, setColumn2] = useState([]);
  //prev tables list
  const [back, setBack] = useState([]);
  //folder id for folder details
  const [folder, setFolder] = useState();
  //task if for task details
  const [task, setTask] = useState();

  return (
    <>
      <MenuBar />
      <div className="main__container">
        <div className="column1">
          <FoldersList
            setData={setColumn2}
            setFolder={setFolder}
            setTask={setTask}
          />
        </div>
        <div className="column2">
          {column2.length > 0 && (
            <FoldersList
              parents={column2}
              setData={setColumn2}
              back={back}
              setBack={setBack}
              setFolder={setFolder}
              setTask={setTask}
            />
          )}
        </div>
        <div className="column3">
          {folder && (
            <CreateModifyTable folder={folder} setFolder={setFolder} />
          )}
          {task && <CreateModifyTask task={task} setTask={setTask} />}
        </div>
      </div>
    </>
  );
};

export default Main;
