import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { AiFillSchedule, AiOutlineCloseCircle } from "react-icons/ai";
import { GET_TASK, UPDATE_TASK } from "../queries";
import moment from "moment";
import "./CreateModify.scss";
import Comments from "./Comments";

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

  const {
    id,
    name,
    description,
    parent,
    creator,
    status,
    createdAt,
  } = task2;
  const [state, setState] = useState({
    name: "",
    description: "",
    status: 1,
  });
  const [errors, setErrors] = useState({});

  const [update] = useMutation(UPDATE_TASK, {
    variables: {
      taskId: id,
      name: state.name,
      description: state.description,
      parent: parent && parent.id,
      status: state.status,
    },
    onCompleted({ updateTask }) {
      setTask2(updateTask);
      setErrors({});
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    refetchQueries: [{ query: GET_TASK, variables: { taskId: id } }],
  });

  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    setState({
      name: name || "",
      description: description || "",
      status: status || "New",
    });
  }, [name, description, status]);

  function handleSubmit(e) {
    e.preventDefault();
    update();
  }

  return (
    <>
      {task2 && (
        <div className="table-details">
          <button
            className="button button--close"
            onClick={() => setTask()}
          >
            <AiOutlineCloseCircle />
          </button>
          <div className="folder__info">
            <div className="icon">
              <AiFillSchedule className="icon" />
            </div>

            <span className="folder__date">
              {(createdAt &&
                moment(+createdAt).format("YYYY-MM-DD, dddd hh:mm")) ||
                ""}
            </span>
            <h2 className="folder__name">
              {parent && (
                <>
                  {parent.name}
                  {" > "}
                </>
              )}
              <span>{name}</span>
            </h2>
            <p className="folder__creator">
              Created by:
              <span
                className="avatar"
                style={{
                  backgroundColor: `#${creator && creator.avatar}`,
                }}
              ></span>
              <span>
                {(creator && creator.username) || "no creator"}
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
                      errors.description || errors.general
                        ? "error"
                        : ""
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
                <div className="form__group">
                  <select
                    name="status"
                    value={state.status}
                    onChange={handleChange}
                    style={{
                      backgroundColor:
                        state.status === "New"
                          ? "red"
                          : state.status === "In progress"
                          ? "yellow"
                          : "green",
                    }}
                  >
                    <option
                      style={{ backgroundColor: "red" }}
                      value="New"
                    ></option>
                    <option
                      style={{ backgroundColor: "yellow" }}
                      value="In progress"
                    ></option>
                    <option
                      style={{ backgroundColor: "green" }}
                      value="Finished"
                    ></option>
                  </select>
                  {status}
                </div>
                <button type="submit" className="button button--block">
                  Save
                </button>
              </form>
            </div>
            {id && <Comments taskId={id} />}
          </div>
        </div>
      )}
    </>
  );
};

export default CreateModifyTask;
