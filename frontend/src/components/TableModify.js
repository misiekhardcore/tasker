import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_FOLDER } from "../queries";

const TableModify = ({ folder, setFolder }) => {
  const [table, setTable] = useState({});
  const [getTable, { data }] = useLazyQuery(GET_FOLDER, {
    variables: { tableId: folder },
    onCompleted() {
      setTable(data.getTable);
    },
  });

  useEffect(() => {
    getTable();
  }, [folder]);

  const { name, description, parent, creator } = table;
  return (
    <>
      {table && (
        <div>
          <button onClick={() => setFolder()}>X</button>
          <p>{name}</p>
          <p>{description || "nie ma"}</p>
          <p>{(parent && parent.name) || "root folder"}</p>
          <p>{(creator && creator.username) || "nie ma"}</p>
        </div>
      )}
    </>
  );
};

export default TableModify;
