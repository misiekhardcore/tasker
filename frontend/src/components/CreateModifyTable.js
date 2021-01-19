import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GET_FOLDER, UPDATE_FOLDER } from "../queries";
import "./CreateModifyTable.scss";

const TableModify = ({ folder, setFolder }) => {
  const [table, setTable] = useState({});
  const [getTable, { data }] = useLazyQuery(GET_FOLDER, {
    variables: { tableId: folder },
    onCompleted() {
      setTable(data.getTable);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const { id, name, description, parent, creator } = table;
  const [state, setState] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});

  const [update, { data: data2 }] = useMutation(UPDATE_FOLDER, {
    variables: {
      tableId: id,
      name: state.name,
      description: state.description,
    },
    refetchQueries: [{ query: GET_FOLDER, variables: { tableId: folder } }],
  });

  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    getTable();
    setState({ name: name || "", description: description || "" });
  }, [folder, table, data2]);

  function handleSubmit(e) {
    e.preventDefault();
    update();
  }

  return (
    <>
      {table && (
        <div className="table-details">
          <button className="button--close" onClick={() => setFolder()}>
            <AiOutlineCloseCircle />
          </button>
          <div className="folder__info">
            <h1 className="folder__header">Update Folder</h1>
            <h2 className="folder__name">
              {"Name: "}
              {parent && (
                <>
                  {parent.name}
                  {" > "}
                </>
              )}
              <span>{name}</span>
            </h2>
            <p className="folder__description">
              Description: <span>{description || "empty"}</span>
            </p>
            <p className="folder__creator">
              Created by:{" "}
              <span>{(creator && creator.username) || "no creator"}</span>
            </p>

            <div className="form__container">
              <form onSubmit={handleSubmit}>
                <div className="form__group">
                  <label htmlFor="name" className="form__label">
                    Table name:
                  </label>
                  <input
                    value={state.name}
                    onChange={handleChange}
                    name="name"
                    type="text"
                    className={`form__input ${
                      errors.name || errors.general ? "error" : ""
                    }`}
                  />
                </div>
                <div className="form__group">
                  <label htmlFor="description" className="form__label">
                    Table descrition:
                  </label>
                  <textarea
                    style={{ resize: "none" }}
                    value={state.description}
                    onChange={handleChange}
                    name="description"
                    type="text"
                    className={`form__input ${
                      errors.description || errors.general ? "error" : ""
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="button button--primary button--block"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableModify;
