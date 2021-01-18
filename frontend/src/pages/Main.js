import React, { useState } from "react";
import FoldersList from "../components/FoldersList";
import MenuBar from "../components/MenuBar";
import TableModify from "../components/TableModify";

const Main = () => {
  const [column2, setColumn2] = useState([]);
  const [back, setBack] = useState([]);
  const [folder, setFolder] = useState();

  return (
    <>
      <MenuBar />
      <div className="main__container">
        <div className="column1">
          <FoldersList setData={setColumn2} setFolder={setFolder} />
        </div>
        <div className="column2">
          {column2.length > 0 && (
            <FoldersList
              parents={column2}
              setData={setColumn2}
              back={back}
              setBack={setBack}
              setFolder={setFolder}
            />
          )}
        </div>
        <div className="column3">
          {folder && <TableModify folder={folder} setFolder={setFolder} />}
        </div>
      </div>
    </>
  );
};

export default Main;
