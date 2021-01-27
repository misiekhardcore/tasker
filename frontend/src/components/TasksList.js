import { useMutation, useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { AiFillDelete, AiFillSchedule } from "react-icons/ai";
import { DELETE_TASK, GET_TASKS } from "../queries";
import { Button, ListItem, UnorderedList } from "./styled";
import { ListContext } from "../context/list";

const TasksList = ({ parent }) => {
  const { setTask, setFolder } = useContext(ListContext);

  const { loading, error, data } = useQuery(GET_TASKS, {
    variables: {
      parent,
    },
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    onError(err) {
      throw new Error(err);
    },
    refetchQueries: [{ query: GET_TASKS, variables: { parent } }],
  });

  function handleSetTask(id) {
    setTask(id);
    setFolder();
  }

  function handleDeleteTask(id) {
    deleteTask({
      variables: { taskId: id },
    });
    setTask();
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {JSON.stringify(error, null, 2)}</p>;

  const { getTasks } = data;

  return (
    <UnorderedList>
      {getTasks.map((task) => (
        <ListItem task data-tooltip={task.name} key={task.id}>
          <AiFillSchedule />
          <p onClick={() => handleSetTask(task.id)}>{task.name}</p>
          <Button transparent onClick={() => handleDeleteTask(task.id)}>
            <AiFillDelete />
          </Button>
        </ListItem>
      ))}
    </UnorderedList>
  );
};

export default TasksList;
