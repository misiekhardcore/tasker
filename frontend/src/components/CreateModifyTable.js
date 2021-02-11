import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { AiFillFolder, AiOutlineCloseCircle } from "react-icons/ai";
import { ListContext } from "../context/list";
import { UPDATE_FOLDER } from "../queries";
import moment from "moment";

import "./CreateModify.scss";
import {
  Button,
  ButtonClose,
  Form,
  FormGroup,
  Input,
  Label,
} from "./styled";

import Errors from "./Errors";
import Editor from "./Editor";
import Loading from "./Loading";
import Group from "./Group";
import { errorHandler } from "../utils/helpers";

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

  //get folder info
  const { loading, error, data } = useQuery(getGroupInfo, {
    variables: { tableId: folder },
    onCompleted({ getTable }) {
      setState({
        name: getTable.name || "",
        description: getTable.description || "",
      });
      setDesc(getTable.description);
      setErrors({});
    },
    onError(err) {
      errorHandler(err, setErrors);
    },
  });

  //destructure query data
  const { id, name, group, parent, creator, createdAt } =
    data?.getTable || {};

  //update mutation
  const [update] = useMutation(UPDATE_FOLDER, {
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
  return data ? (
    <div className="table-details">
      <ButtonClose onClick={() => setFolder()}>
        <AiOutlineCloseCircle />
      </ButtonClose>
      <div className="folder__info">
        <div className="icon">
          <AiFillFolder className="icon" />
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
        {group && (
          <Group
            groupId={group.id}
            childGroup={group.id}
            parentGroup={parent?.group.id || creator.team.id}
          />
        )}

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
          <Errors errors={errors} />
          <Button type="submit" block>
            Save
          </Button>
        </Form>
      </div>
    </div>
  ) : null;
};

export default CreateModifyTable;
