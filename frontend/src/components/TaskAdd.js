import React, { useState } from "react";
import { Input, Button, Form } from "./styled";
import styled from "styled-components";
import { ADD_TASK } from "../queries";
import { gql, useMutation } from "@apollo/client";
import { IoMdAdd } from "react-icons/io";

const TaskAddContainer = styled.div`
  padding: 0 0.5rem;
  width: 100%;
  display: flex;
  margin-bottom: 0.5rem;
`;

const InputMod = styled(Input)`
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
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
      cache.modify({
        fields: {
          getTasks(existingTasks = []) {
            const newTaskRef = cache.writeFragment({
              data: createTask,
              fragment: gql`
                fragment NewTask on Tasks {
                  id
                  type
                }
              `,
            });
            return [...existingTasks, newTaskRef];
          },
        },
      });
    },
    onCompleted() {
      setErrors({});
      setErr({});
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
      setErr(err.graphQLErrors[0].extensions.exception.errors);
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
