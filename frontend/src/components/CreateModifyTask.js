import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { AiFillSchedule, AiOutlineCloseCircle } from "react-icons/ai";
import { UPDATE_TASK } from "../queries";
import moment from "moment";

import "./CreateModify.scss";
import { Button, ButtonClose, Form, FormGroup, Input, Label } from "./styled";
import { ListContext } from "../context/list";

import Comments from "./Comments";
import Errors from "./Errors";
import Editor from "./Editor";
import Loading from "./Loading";
import Group from "./Group";
import { errorHandler } from "../utils/helpers";

const Selector = ({ status, handleStatus }) => {
  return (
    <>
      <select
        name="status"
        value={status}
        onChange={(e) => handleStatus(e)}
        style={{
          backgroundColor:
            status === "New"
              ? "red"
              : status === "In progress"
              ? "yellow"
              : "green",
        }}
      >
        <option style={{ backgroundColor: "red" }} value="New">
          New
        </option>
        <option style={{ backgroundColor: "yellow" }} value="In progress">
          In progress
        </option>
        <option style={{ backgroundColor: "green" }} value="Finished">
          Finished
        </option>
      </select>
    </>
  );
};

const getGroupInfo = gql`
  query getGroup($taskId: ID!) {
    getTask(taskId: $taskId) {
      id
      name
      description
      status
      group {
        id
      }
      creator {
        id
        username
        role
        avatar
        team {
          id
        }
      }
      parent {
        id
        name
        group {
          id
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const CreateModifyTask = () => {
  //get current folder
  const { task, setTask } = useContext(ListContext);

  //error handling
  const [errors, setErrors] = useState({});

  //state for markdown editor
  const [desc, setDesc] = useState("");

  //state for inputs
  const [state, setState] = useState({
    name: "",
    description: "",
    status: "New",
  });

  //get task info
  const { loading, error, data } = useQuery(getGroupInfo, {
    variables: { taskId: task },
    onCompleted({ getTask }) {
      setState({
        name: getTask.name || "",
        description: getTask.description || "",
        status: getTask.status || "New",
      });
      setDesc(getTask.description);
      setErrors({});
    },
    onError(err) {
      errorHandler(err, setErrors);
    },
  });

  //destructure query data
  const { id, name, group, parent, creator, createdAt } = data?.getTask || {};

  //update mutation
  const [update] = useMutation(UPDATE_TASK, {
    onCompleted() {
      setErrors({});
    },
    onError(err) {
      errorHandler(err, setErrors);
    },
  });

  //handle input fields change
  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  //handle submit form which updates table info
  function handleSubmit(e) {
    e.preventDefault();
    update({
      variables: {
        taskId: id,
        name: state.name,
        description: desc,
        parent: parent?.id,
        status: state.status,
      },
    });
  }

  //loading and errors
  if (loading) return <Loading />;
  if (error) return <Errors errors={errors} />;

  return data ? (
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
              className={errors?.name || errors?.general ? "error" : ""}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">Table descrition:</Label>
            <Editor data={desc} state={setDesc} />
          </FormGroup>
          <FormGroup>
            <Selector status={state.status} handleStatus={handleChange} />
          </FormGroup>
          <Errors errors={errors} />
          <Button type="submit" block>
            Save
          </Button>
        </Form>
      </div>
      {id && <Comments taskId={id} />}
    </div>
  ) : null;
};

export default CreateModifyTask;
