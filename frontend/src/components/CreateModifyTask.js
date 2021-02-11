import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { AiFillSchedule, AiOutlineCloseCircle } from "react-icons/ai";
import { GET_TASK, UPDATE_TASK } from "../queries";
import moment from "moment";
import "./CreateModify.scss";
import Comments from "./Comments";
import { Button, ButtonClose, Form, FormGroup, Input, Label } from "./styled";
import { ListContext } from "../context/list";
import Errors from "./Errors";
import Editor from "./Editor";
import Loading from "./Loading";
import Group from "./Group";

const CreateModifyTask = () => {
  const [task2, setTask2] = useState({});
  const { task, setTask } = useContext(ListContext);
  const [errors, setErrors] = useState({});
  const [desc, setDesc] = useState("");
  const [state, setState] = useState({
    name: "",
    description: "",
    status: "New",
  });

  //get task info
  const { loading, error } = useQuery(GET_TASK, {
    variables: { taskId: task },
    onCompleted({ getTask }) {
      setTask2(getTask);
      setDesc(getTask.description);
      setErrors({});
    },
    onError(err) {
      const errors = err.graphQLErrors[0]?.extensions?.exception?.errors;
      setErrors(errors || err);
    },
  });

  const {
    id,
    name,
    description,
    parent,
    group,
    creator,
    status,
    createdAt,
  } = task2;

  const [update] = useMutation(UPDATE_TASK, {
    variables: {
      taskId: id,
      name: state.name,
      description: desc,
      parent: parent && parent.id,
      status: state.status,
    },
    onCompleted({ updateTask }) {
      setTask2(updateTask);
      setDesc(updateTask.description);
      setErrors({});
    },
    onError(err) {
      const errors = err.graphQLErrors[0]?.extensions?.exception?.errors;
      setErrors(errors || err);
    },
  });

  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    let mounted = true;
    if (mounted)
      setState({
        name: name || "",
        description: description || "",
        status: status || "New",
      });

    return () => (mounted = false);
  }, [name, description, status]);

  function handleSubmit(e) {
    e.preventDefault();
    update();
  }

  if (loading) return <Loading />;
  if (error) return <p>Error :( {JSON.stringify(error, null, 2)}</p>;

  return (
    <div className="table-details">
      <ButtonClose onClick={() => setTask()}>
        <AiOutlineCloseCircle />
      </ButtonClose>
      <div className="folder__info">
        <div className="icon">
          <AiFillSchedule className="icon" />
        </div>

        <span className="folder__date">
          {(createdAt && moment(+createdAt).format("YYYY-MM-DD, dddd hh:mm")) ||
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

        {group && <Group groupId={group.id} />}

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
            <Editor data={desc} state={setDesc} />
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
              <option style={{ backgroundColor: "red" }} value="New"></option>
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
  );
};

export default CreateModifyTask;
