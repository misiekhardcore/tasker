import { useMutation, useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { AiFillDelete, AiFillSchedule } from "react-icons/ai";
import { DELETE_TASK, GET_TASKS } from "../queries";
import { Button, ListItem, UnorderedList } from "./styled";
import { ListContext } from "../context/list";
import Loading from "./Loading";
import Errors from "./Errors";

const TasksList = ({ parent }) => {
  const { setTask, setFolder } = useContext(ListContext);

  const { loading, error, data } = useQuery(GET_TASKS, {
    variables: {
      parent,
    },
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache) {
      cache.modify({
        fields: {
          getTasks(existingTasks = [], { DELETE }) {
            return DELETE;
          },
          getTask(existingTask = [], { DELETE }) {
            return DELETE;
          },
          getGroup(existingGroup = [], { DELETE }) {
            return DELETE;
          },
          getComments(existingComments = [], { DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onError(err) {
      throw new Error(err);
    },
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

  if (loading) return <Loading />;
  if (error) return <Errors errors={error} />;

  const { getTasks } = data;

  return (
    <UnorderedList>
      {getTasks &&
        getTasks.map((task) => (
          <ListItem status={task.status} data-tooltip={task.name} key={task.id}>
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
