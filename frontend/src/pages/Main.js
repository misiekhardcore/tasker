import React, { useEffect, useState } from "react";
import FoldersList from "../components/FoldersList";
import MenuBar from "../components/MenuBar";

const Main = () => {
  const [column2, setColumn2] = useState([]);
  const [back, setBack] = useState([])
  console.log(column2)

  return (
    <>
      <MenuBar />
      <div className="main__container">
        <div className="column1">
          <FoldersList setData={setColumn2}/>
        </div>
        <div className="column2">
          {column2.length>0 && (
            <FoldersList parents={column2} setData={setColumn2} back={back} setBack={setBack}/>
          )}
        </div>
        <div className="column3"></div>
      </div>
    </>
  );
};

export default Main;
