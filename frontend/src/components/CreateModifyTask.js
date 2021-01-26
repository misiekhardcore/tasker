import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { AiFillSchedule, AiOutlineCloseCircle } from "react-icons/ai";
import { GET_TASK, UPDATE_TASK } from "../queries";
import moment from "moment";
import "./CreateModify.scss";
import Comments from "./Comments";
import {
  Button,
  ButtonClose,
  Form,
  FormGroup,
  Input,
  Label,
  Textarea,
} from "./styled";
import { ListContext } from "../context/list";
import Errors from "./Errors";

const CreateModifyTask = () => {
  const [task2, setTask2] = useState({});
  const { task, setTask } = useContext(ListContext);

  //get task info
  useQuery(GET_TASK, {
    variables: { taskId: task },
    onCompleted({ getTask }) {
      setTask2(getTask);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const { id, name, description, parent, creator, status, createdAt } = task2;
  const [state, setState] = useState({
    name: "",
    description: "",
    status: "New",
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
          <ButtonClose onClick={() => setTask()}>
            <AiOutlineCloseCircle />
          </ButtonClose>
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
              <span>{(creator && creator.username) || "no creator"}</span>
            </p>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name" className="form__label">
                  Table name:
                </Label>
                <Input
                  value={state.name}
                  onChange={handleChange}
                  name="name"
                  type="text"
                  className={errors.name || errors.general ? "error" : ""}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="description">Table descrition:</Label>
                <Textarea
                  style={{ resize: "none" }}
                  value={state.description}
                  onChange={handleChange}
                  name="description"
                  type="text"
                  className={
                    errors.description || errors.general ? "error" : ""
                  }
                />
              </FormGroup>
              <FormGroup>
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
              </FormGroup>
              <Errors errors={errors} />
              <Button type="submit" block>
                Save
              </Button>
            </Form>
          </div>
          {id && <Comments taskId={id} />}
        </div>
      )}
    </>
  );
};

export default CreateModifyTask;
