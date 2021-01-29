import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { ADD_FOLDER } from "../queries";
import { Button, Form, Input } from "./styled";
import styled from "styled-components";

const FolderAddContainer = styled.div`
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

const FolderAdd = ({ setErrors = {}, parent = undefined }) => {
  const [name, setName] = useState("");
  const [err, setErr] = useState({});

  const [addFolder] = useMutation(ADD_FOLDER, {
    variables: {
      name: name,
      parent,
    },
    update(cache, { data: { createTable } }) {
      cache.modify({
        fields: {
          getTables(existingTables = []) {
            const newTableRef = cache.writeFragment({
              data: createTable,
              fragment: gql`
                fragment NewTable on Tables {
                  id
                  type
                }
              `,
            });
            return [...existingTables, newTableRef];
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

  function handleAddFolder(e) {
    e.preventDefault();
    addFolder();
    setName("");
  }

  return (
    <FolderAddContainer>
      <Form flex onSubmit={handleAddFolder}>
        <InputMod
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add new table..."
          className={err && err.name && "error"}
        />
        <ButtonMod type="submit">
          <IoMdAdd />
        </ButtonMod>
      </Form>
    </FolderAddContainer>
  );
};

export default FolderAdd;
