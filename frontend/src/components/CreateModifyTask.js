import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { AiFillSchedule } from "react-icons/ai";
import { UPDATE_TASK } from "../queries";
import moment from "moment";

import {
  Button,
  ButtonClose,
  Creator,
  Date,
  Form,
  FormGroup,
  Header,
  Icon,
  Input,
  Label,
  Option,
  Select,
  Title,
  User,
} from "./styled";
import { ListContext } from "../context/list";

import Comments from "./Comments";
import Errors from "./Errors";
import Editor from "./Editor";
import Loading from "./Loading";
import Group from "./Group";
import { errorHandler } from "../utils/helpers";

const Selector = ({ status, handleStatus }) => {
  return (
    <Select name="status" value={status} onChange={(e) => handleStatus(e)}>
      <Option value="New">New</Option>
      <Option value="In progress">In progress</Option>
      <Option value="Finished">Finished</Option>
    </Select>
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

  //is component mounted?
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    //is mounted
    setMounted(true);
    return () => {
      //is unmounted
      setMounted(false);
    };
  }, []);

  //get task info
  const { loading, error, data } = useQuery(getGroupInfo, {
    variables: { taskId: task },
    onCompleted({ getTask }) {
      if (mounted) {
        setState({
          name: getTask.name || "",
          description: getTask.description || "",
          status: getTask.status || "New",
        });
        setDesc(getTask.description);
        setErrors({});
      }
    },
    onError(err) {
      mounted && errorHandler(err, setErrors);
    },
  });

  //destructure query data
  const { id, name, group, parent, creator, createdAt } = data?.getTask || {};

  //update mutation
  const [update] = useMutation(UPDATE_TASK, {
    onCompleted() {
      mounted && setErrors({});
    },
    onError(err) {
      mounted && errorHandler(err, setErrors);
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

  return (
    data && (
      <div className="table-details">
        <ButtonClose onClick={() => setTask()} />
        <Header>
          <Icon>
            <AiFillSchedule />
          </Icon>
          <Title>
            {parent && <span>{parent.name}</span>}
            {name}
          </Title>
        </Header>
        <Date>
          {createdAt && moment(+createdAt).format("YYYY-MM-DD, dddd hh:mm")}
        </Date>

        <Creator>
          <span>Created by:</span>
          <User avatar={creator.avatar}>{creator.username}</User>
        </Creator>

        {group && <Group groupId={group.id} />}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Table name:</Label>
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
        {id && <Comments taskId={id} />}
      </div>
    )
  );
};

export default CreateModifyTask;
