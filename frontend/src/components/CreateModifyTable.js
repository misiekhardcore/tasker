import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { AiFillFolder, AiOutlineCloseCircle } from "react-icons/ai";
import { GET_FOLDER, UPDATE_FOLDER } from "../queries";
import moment from "moment";
import "./CreateModify.scss";
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

const CreateModifyTable = () => {
  const [table, setTable] = useState({});
  const { folder, setFolder } = useContext(ListContext);

  //get folder info
  useQuery(GET_FOLDER, {
    variables: { tableId: folder },
    onCompleted({ getTable }) {
      setTable(getTable);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const { id, name, description, parent, creator, createdAt } = table;
  const [state, setState] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const [update] = useMutation(UPDATE_FOLDER, {
    variables: {
      tableId: id,
      name: state.name,
      description: state.description,
      parent: (parent && parent.id) || undefined,
    },
    onCompleted({ updateTable }) {
      setTable(updateTable);
      setErrors({});
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    refetchQueries: [{ query: GET_FOLDER, variables: { tableId: id } }],
  });

  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    setState({ name: name || "", description: description || "" });
  }, [name, description]);

  function handleSubmit(e) {
    e.preventDefault();
    update();
  }

  return (
    <>
      {table && (
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
            <h2>
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
              <Errors errors={errors} />
              <Button type="submit" block>
                Save
              </Button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateModifyTable;
