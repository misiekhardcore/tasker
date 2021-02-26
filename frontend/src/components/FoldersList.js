import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { AiFillDelete, AiFillFolder } from "react-icons/ai";
import {
  DELETE_FOLDER,
  GET_COMMENTS,
  GET_FOLDER,
  GET_FOLDERS,
  GET_GROUP,
  GET_TASK,
  GET_TASKS,
  SUB_TABLE_ADD,
} from "../queries";
import { Button, ListItem, UnorderedList } from "./styled";
import { ListContext } from "../context/list";
import Loading from "./Loading";
import Errors from "./Errors";
import { AuthContext } from "../context/auth";

const FoldersList = ({ parent }) => {
  const {
    user: { username: uname, role },
  } = useContext(AuthContext);

  const { back, column2, setColumn2, setTask, setFolder, setBack } = useContext(
    ListContext
  );

  //is component mounted?
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    //is mounted
    setMounted(true);
    return () => {
      //is unmounted
      setMounted(false);
    };
  }, []);

  const { loading, error, data, subscribeToMore } = useQuery(GET_FOLDERS, {
    variables: {
      parent,
    },
  });

  const stm = () =>
    subscribeToMore({
      document: SUB_TABLE_ADD,
      variables: { parent },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;

        const newTable = subscriptionData.data.tableCreated;
        const exists = prev.getTables.find(({ id }) => id === newTable.id);
        console.log({ prev, newTable });
        if (exists) return prev;

        return Object.assign({}, prev, {
          getTables: [...prev.getTables, newTable],
        });
      },
    });

  useEffect(() => {
    stm();
  });

  const [deleteFolder] = useMutation(DELETE_FOLDER, {
    onError(err) {
      mounted && console.log(err);
    },
  });

  function handleParent(nextId, backName) {
    if (parent) {
      setColumn2([...column2, nextId]);
      setBack([...back, backName]);
    } else {
      setColumn2([nextId]);
      setBack([backName]);
    }
    setFolder(nextId);
    setTask();
  }

  function handleDeleteSubfolders(cache, id) {
    const a = cache.readQuery({
      query: GET_FOLDERS,
      variables: { parent: id },
    });

    if (a) {
      handleDeleteSubtasks(cache, id);

      const { getTables } = a;

      getTables.forEach(function (x) {
        cache.writeQuery({
          query: GET_FOLDER,
          data: { getTable: null },
          variables: { tableId: x.id },
        });
        cache.writeQuery({
          query: GET_GROUP,
          data: { getGroup: null },
          variables: { groupId: x.group.id },
        });
        handleDeleteSubfolders(cache, x.id);
      });
    }
    cache.writeQuery({
      query: GET_FOLDERS,
      data: {
        getTables: [],
      },
      variables: { parent: id },
    });
  }

  function handleDeleteSubtasks(cache, id) {
    const a = cache.readQuery({
      query: GET_TASKS,
      variables: { parent: id },
    });

    if (a) {
      const { getTasks } = a;

      getTasks.forEach(function (x) {
        cache.writeQuery({
          query: GET_TASK,
          data: { getTask: null },
          variables: { taskId: x.id },
        });
        cache.writeQuery({
          query: GET_GROUP,
          data: { getGroup: null },
          variables: { groupId: x.group.id },
        });
        cache.writeQuery({
          query: GET_COMMENTS,
          data: { getComments: [] },
          variables: { parent: x.id },
        });
      });

      cache.writeQuery({
        query: GET_TASKS,
        data: { getTasks: null },
        variables: { parent: id },
      });
    }
  }

  function handleDeleteFolder(id, name = "") {
    const promt = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!promt) return;
    deleteFolder({
      variables: { parent: id },
      update(cache) {
        try {
          handleDeleteSubfolders(cache, id);
          const { getTables } = cache.readQuery({
            query: GET_FOLDERS,
            variables: { parent },
          });

          const { getTable } =
            cache.readQuery({
              query: GET_FOLDER,
              variables: { tableId: id },
            }) || {};
          cache.writeQuery({
            query: GET_FOLDER,
            data: {
              getTable: null,
            },
            variables: {
              tableId: id,
            },
          });

          if (getTable)
            cache.writeQuery({
              query: GET_GROUP,
              data: { getGroup: null },
              variables: { groupId: getTable.group.id },
            });

          cache.writeQuery({
            query: GET_FOLDERS,
            data: {
              getTables: getTables.filter((table) => table.id !== id),
            },
            variables: { parent },
          });
        } catch (e) {
          console.log(e);
        }
      },
    });
    setFolder();
    if (!parent) {
      setColumn2([]);
      setBack([]);
    }
  }

  if (loading) return <Loading />;
  if (error) return <Errors errors={error} />;

  const { getTables } = data;

  return (
    <UnorderedList>
      {getTables &&
        getTables.map((table) => (
          <ListItem table data-tooltip={table.name} key={table.id}>
            <AiFillFolder />
            <p
              onClick={() => {
                handleParent(table.id, table.name);
              }}
            >
              {table.name}
            </p>
            {(table.creator.username === uname || role === "Admin") && (
              <Button
                transparent
                onClick={() => handleDeleteFolder(table.id, table.name)}
              >
                <AiFillDelete />
              </Button>
            )}
          </ListItem>
        ))}
    </UnorderedList>
  );
};

export default FoldersList;
