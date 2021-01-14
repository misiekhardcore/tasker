import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const AddFolder = ({ id }) => {
  const [name, setName] = useState("");
  const parentId = id || "";

  const [addFolder] = useMutation(ADD_FOLDER, {
    
    update(cache, { data: { createTable } }) {
      cache.modify({
        fields: {
          getTables(existing = []) {
            const newTable = cache.writeFragment({
              data: createTable,
              fragment: gql`
                fragment NewTable on getTables {
                  id
                  name
                  description
                }
              `,
            });
            return [...existing, newTable];
          },
        },
      });
    },
    variables: {
      name,
      parent: parentId,
    },
  });

  return (
    <>
      <input
        name="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={() => {
          addFolder();
          setName("");
        }}
      >
        <IoMdAdd />
      </button>
    </>
  );
};

const ADD_FOLDER = gql`
  mutation createTable($name: String!, $description: String, $parent: ID) {
    createTable(name: $name, description: $description, parent: $parent) {
      id
      name
      description
    }
  }
`;

export default AddFolder;
