import React, { useState } from "react";
import { Input, Button, Form } from "./styled";
import styled from "styled-components";
import { ADD_TASK, GET_TASKS } from "../queries";
import { useMutation } from "@apollo/client";
import { IoMdAdd } from "react-icons/io";

const TaskAddContainer = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 0.5rem;
`;

const InputMod = styled(Input)`
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: none;
`;

const ButtonMod = styled(Button)`
  padding: 0;
  color: white;
  background-color: transparent;
  min-width: 30px;
  height: 30px;

  svg {
    padding: 0;
  }
`;

const TaskAdd = ({ setErrors, parent }) => {
  const [name, setName] = useState("");
  const [err, setErr] = useState({});

  const [addTask] = useMutation(ADD_TASK, {
    variables: {
      name: name,
      parent,
    },
    update(cache, { data: { createTask } }) {
      try {
        const { getTasks } = cache.readQuery({
          query: GET_TASKS,
          variables: { parent },
        });

        cache.writeQuery({
          query: GET_TASKS,
          data: { getTasks: [createTask, ...getTasks] },
          variables: { parent },
        });
      } catch (error) {
        throw error;
      }
    },
    onCompleted() {
      setErrors({});
      setErr({});
    },
    onError(err) {
      try {
        const error = err.graphQLErrors[0].extensions.exception.errors;
        setErrors(error);
        setErr(error);
      } catch (error) {
        throw err;
      }
    },
  });

  function handleAdd(e) {
    e.preventDefault();
    addTask();
    setName("");
  }

  return (
    <TaskAddContainer>
      <Form flex onSubmit={handleAdd}>
        <InputMod
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add new task..."
          className={err && err.name && "error"}
        />
        <ButtonMod type="submit">
          <IoMdAdd />
        </ButtonMod>
      </Form>
    </TaskAddContainer>
  );
};

export default TaskAdd;
