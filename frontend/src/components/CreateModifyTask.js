import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GET_FOLDER, GET_TASK, UPDATE_FOLDER } from "../queries";
import moment from "moment";
import "./CreateModifyTable.scss";

const CreateModifyTask = ({ task = undefined, setTask = () => {} }) => {
  const [task2, setTask2] = useState({});

  //get task info
  const { data } = useQuery(GET_TASK, {
    variables: { taskId: task },
    onCompleted() {
      setTask2(data.getTask);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const { id, name, description, parent, creator, status, createdAt } = task2;
  const [state, setState] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});

  // const [update] = useMutation(UPDATE_TASK, {
  //   variables: {
  //     taskId: id,
  //     name: state.name,
  //     description: state.description,
  //     parent: parent && parent.id,
  //   },
  //   onCompleted({ updateTask }) {
  //     setTask(updateTask);
  //     setErrors({});
  //   },
  //   onError(err) {
  //     setErrors(err.graphQLErrors[0].extensions.exception.errors);
  //   },
  //   refetchQueries: [{ query: GET_TASK, variables: { taskId: task } }],
  // });

  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    setState({ name: name || "", description: description || "" });
  }, [name, description]);

  function handleSubmit(e) {
    e.preventDefault();
    // update();
  }

  return (
    <>
      {task && (
        <div className="table-details">
          <button className="button button--close" onClick={() => setTask()}>
            <AiOutlineCloseCircle />
          </button>
          <div className="folder__info">
            <h1 className="folder__header">Update Task</h1>
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
              Description:<span>{description || "empty"}</span>
            </p>
            <p className="folder__creator">
              Created by:
              <span>{(creator && creator.username) || "no creator"}</span>
            </p>
            <p className="folder__date">
              Created At:
              <span>
                {(createdAt &&
                  moment(+createdAt).format("YYYY-MM-DD, dddd hh:mm")) ||
                  ""}
              </span>
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
                {Object.keys(errors).length > 0 && (
                  <div className="error-list">
                    <ul className="list">
                      {Object.values(errors).map((value) => (
                        <li key={value}>{value}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button type="submit" className="button button--block">
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

export default CreateModifyTask;
