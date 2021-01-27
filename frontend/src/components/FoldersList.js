import { useMutation, useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { AiFillDelete, AiFillFolder } from "react-icons/ai";
import { DELETE_FOLDER, GET_FOLDERS } from "../queries";
import { Button, ListItem, UnorderedList } from "./styled";
import { ListContext } from "../context/list";

const FoldersList = ({ parent }) => {
  const {
    back,
    column2,
    setColumn2,
    setTask,
    setFolder,
    setBack,
  } = useContext(ListContext);

  const { loading, error, data } = useQuery(GET_FOLDERS, {
    variables: {
      parent,
    },
  });

  const [deleteFolder] = useMutation(DELETE_FOLDER, {
    onCompleted() {},
    onError(err) {
      throw new Error(err);
    },
    refetchQueries: [{ query: GET_FOLDERS, variables: { parent } }],
  });

  function handleParent(nextId, backName) {
    if (parent) {
      setColumn2(column2.push(nextId));
      setBack(back.push(backName));
    } else {
      setColumn2([nextId]);
      setBack([backName]);
    }
    setFolder(nextId);
    setTask();
  }

  function handleDeleteFolder(id) {
    deleteFolder({
      variables: { parent: id },
    });
    setFolder();
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {JSON.stringify(error, null, 2)}</p>;

  const { getTables } = data;

  return (
    <UnorderedList>
      {getTables.map((table) => (
        <ListItem table data-tooltip={table.name} key={table.id}>
          <AiFillFolder />
          <p
            onClick={() => {
              handleParent(table.id, table.name);
            }}
          >
            {table.name}
          </p>
          <Button
            transparent
            onClick={() => handleDeleteFolder(table.id)}
          >
            <AiFillDelete />
          </Button>
        </ListItem>
      ))}
    </UnorderedList>
  );
};

export default FoldersList;
