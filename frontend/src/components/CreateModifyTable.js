import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { ListContext } from "../context/list";
import { UPDATE_FOLDER } from "../queries";
import moment from "moment";

import {
  Button,
  ButtonClose,
  Form,
  FormGroup,
  Input,
  Label,
  User,
  Icon,
  Title,
  Date,
  Creator,
  Header,
} from "./styled";

import Errors from "./Errors";
import Editor from "./Editor";
import Loading from "./Loading";
import Group from "./Group";
import { errorHandler } from "../utils/helpers";
import { AiFillFolder } from "react-icons/ai";
import { AuthContext } from "../context/auth";

const getGroupInfo = gql`
  query getGroup($tableId: ID!) {
    getTable(tableId: $tableId) {
      id
      name
      description
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

const CreateModifyTable = () => {
  //get logged user data
  const {
    user: { username: uname },
  } = useContext(AuthContext);

  //get current folder
  const { folder, setFolder } = useContext(ListContext);

  //error handling
  const [errors, setErrors] = useState({});

  //state for markdown editor
  const [desc, setDesc] = useState("");

  //state for inputs
  const [state, setState] = useState({
    name: "",
    description: "",
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

  //get folder info
  const { loading, error, data } = useQuery(getGroupInfo, {
    variables: { tableId: folder },
    onCompleted({ getTable }) {
      if (mounted) {
        setState({
          name: getTable.name || "",
          description: getTable.description || "",
        });
        setDesc(getTable.description);
        setErrors({});
      }
    },
    onError(err) {
      mounted && errorHandler(err, setErrors);
    },
  });

  //destructure query data
  const { id, name, group, parent, creator, createdAt } = data?.getTable || {};
  const isCreator = creator?.username === uname;

  //update mutation
  const [update] = useMutation(UPDATE_FOLDER, {
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
        tableId: id,
        name: state.name,
        description: desc,
        parent: parent?.id || undefined,
      },
    });
  }

  //loading and errors
  if (loading) return <Loading />;
  if (error) return <Errors errors={errors} />;

  //if data from query is present render content otherwise return null
  return (
    data && (
      <div className="table-details">
        <ButtonClose onClick={() => setFolder()} />
        <Header>
          <Icon>
            <AiFillFolder />
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
              disabled={!isCreator}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">Table descrition:</Label>
            <Editor data={desc} state={setDesc} disabled={!isCreator} />
          </FormGroup>
          <Errors errors={errors} />
          {isCreator && (
            <Button type="submit" block>
              Save
            </Button>
          )}
        </Form>
      </div>
    )
  );
};

export default CreateModifyTable;
