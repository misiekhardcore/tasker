import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { AiFillDelete, AiFillSchedule } from "react-icons/ai";
import {
  DELETE_TASK,
  GET_GROUP,
  GET_TASK,
  GET_TASKS,
  SUB_TASK_ADD,
} from "../queries";
import { Button, ListItem, UnorderedList } from "./styled";
import { ListContext } from "../context/list";
import Loading from "./Loading";
import Errors from "./Errors";
import { AuthContext } from "../context/auth";

const TasksList = ({ parent }) => {
  const {
    user: { username: uname, role },
  } = useContext(AuthContext);

  const { setTask, setFolder } = useContext(ListContext);

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

  const { loading, error, data, subscribeToMore } = useQuery(GET_TASKS, {
    variables: {
      parent,
    },
  });

  const stm = subscribeToMore({
    document: SUB_TASK_ADD,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData) return prev;

      const newTask = subscriptionData.data.taskCreated;
      const exists = prev.getTasks.find(({ id }) => id === newTask.id);
      console.log({ prev, newTask });
      if (exists) return prev;

      return Object.assign({}, prev, {
        getTasks: [...prev.getTasks, newTask],
      });
    },
  });
  
  useEffect(() => {
    stm();
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache) {
      mounted &&
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

  function handleDeleteTask(id, name = "") {
    const prompt = window.confirm(`Are you sure you want to delete ${name}`);
    if (!prompt) return;
    deleteTask({
      variables: { taskId: id },
      update(cache) {
        try {
          const { getTask } =
            cache.readQuery({
              query: GET_TASK,
              variables: { taskId: id },
            }) || {};
          cache.writeQuery({
            query: GET_TASK,
            data: { getTask: null },
            variables: {
              taskId: id,
            },
          });

          if (getTask)
            cache.writeQuery({
              query: GET_GROUP,
              data: { getGroup: null },
              variables: { groupId: getTask.group.id },
            });
        } catch (e) {
          console.log(e);
        }
      },
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
            {(task.creator.username === uname || role === "Admin") && (
              <Button
                transparent
                onClick={() => handleDeleteTask(task.id, task.name)}
              >
                <AiFillDelete />
              </Button>
            )}
          </ListItem>
        ))}
    </UnorderedList>
  );
};

export default TasksList;
