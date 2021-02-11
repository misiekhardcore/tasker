import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import Loading from "./Loading";
import { GET_GROUP, UPDATE_GROUP } from "../queries";
import { Button } from "./styled";
import { AuthContext } from "../context/auth";
import styled from "styled-components";
import Errors from "./Errors";

const GroupContainer = styled.div`
  border: 2px solid ${(props) => `#${props.avatar}`};
  border-radius: 4px;
  padding: 0.2rem;
  color: gray;

  margin: 0.5rem 0;

  form {
    width: 100%;
    display: flex;
    align-items: center;
  }
`;

const Users = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.open ? "column" : "row")};
  flex-grow: 1;
  flex-wrap: wrap;
`;

const User = styled.div`
  padding: 0.2rem;
  justify-content: flex-start;
  align-items: baseline;

  span {
    content: "";
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
    background-color: ${(props) => `#${props.avatar}`};
  }
`;

const Checkbox = styled.label`
  width: 1rem;
  height: 1rem;
  float: right;
  position: relative;
  cursor: pointer;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #c00000;
  }

  &:hover input ~ span {
    background-color: #940000;
  }

  & input:checked ~ span {
    background-color: #005f00;
  }

  &:hover input:checked ~ span {
    background-color: #003f00;
  }

  span:after {
    content: "";
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  & input:checked ~ span:after {
    display: block;
  }
`;

const Group = ({ groupId, parentGroup, childGroup }) => {
  const {
    user: { username: uname },
  } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [state, setState] = useState([]);
  const [users2, setUsers2] = useState([]);

  function mapUserToCheckbox(parentUsers, childUsers) {
    if (parentUsers) {
      let u = {};
      parentUsers.forEach((element) => {
        u[element.username] = { checked: true, id: element.id };
      });
      setState(u);
      setUsers2(parentUsers);
    }
  }

  const {
    loading: loadingParent,
    error: errorParrent,
    data: dataParent,
  } = useQuery(GET_GROUP, {
    variables: { groupId: parentGroup },
  });

  const {
    loading: loadingChild,
    error: errorChild,
    data: dataChild,
  } = useQuery(GET_GROUP, {
    variables: { groupId: childGroup },
    onCompleted({ getGroup }) {
      const { users } = getGroup || {};
      mapUserToCheckbox(users);
    },
  });

  const [update] = useMutation(UPDATE_GROUP, {
    onCompleted({ updateGroup }) {
      const { users } = updateGroup;
      console.log(users);
      mapUserToCheckbox(users);
    },
  });

  if (loadingParent || loadingChild) return <Loading />;
  if (errorParrent || errorChild) {
    console.log(errorParrent || errorChild);
    return <Errors />;
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.checked;

    setState({ ...state, [name]: { ...state[name], checked: value } });
  };

  function handleSubmit(e) {
    e.preventDefault();

    const newUsers = Object.keys(state)
      .map((user) => state[user].checked && state[user].id)
      .filter((e) => e !== false);

    update({
      variables: { groupId, users: newUsers },
    });
  }

  const { getGroup } = dataChild;
  const { avatar, creator } = getGroup || {};

  return (
    <>
      {getGroup ? (
        <GroupContainer avatar={avatar}>
          <form onSubmit={handleSubmit}>
            <Users open={edit}>
              {users2 && (
                <>
                  <h3>Group:</h3>
                  {users2.map((user) => {
                    const { id, username, avatar } = user;
                    const show =
                      edit &&
                      username !== creator.username &&
                      username !== uname;
                    return (
                      <User key={id} avatar={avatar}>
                        <span></span>
                        {username}
                        {show && (
                          <>
                            <Checkbox htmlFor={username}>
                              <input
                                type="checkbox"
                                checked={state[username].checked}
                                name={username}
                                onChange={handleChange}
                              />
                              <span className="span"></span>
                            </Checkbox>
                          </>
                        )}
                      </User>
                    );
                  })}
                </>
              )}
            </Users>
            <Button
              onClick={() => {
                setEdit(!edit);
              }}
              type={edit ? "button" : "submit"}
            >
              {edit ? "save" : "edit"}
            </Button>
          </form>
        </GroupContainer>
      ) : null}
    </>
  );
};

export default Group;
