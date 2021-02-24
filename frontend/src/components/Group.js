import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import { Button, User } from "./styled";
import { AuthContext } from "../context/auth";
import styled from "styled-components";
import Errors from "./Errors";
import { AiFillEdit, AiFillSave } from "react-icons/ai";
import { GET_GROUP, UPDATE_GROUP } from "../queries";

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

const UserLine = styled.div`
  display: flex;
  align-items: baseline;
  max-width:250px;
`;

const Checkbox = styled.label`
  width: 1rem;
  height: 1rem;
  float: right;
  position: relative;
  cursor: pointer;
  user-select: none;
  margin-left: auto;

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
    border-radius: 50%;
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

const Group = ({ groupId }) => {
  //get username from AuthContext, it's used to prevent user from
  //deleting himself from group
  const {
    user: { username: uname },
  } = useContext(AuthContext);

  //toggle group edit
  const [edit, setEdit] = useState(false);

  //containe state of checkboxes
  const [state, setState] = useState({});

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

  //get group
  const { loading, error, data } = useQuery(GET_GROUP, {
    variables: { groupId },
  });

  //update current group mutation
  const [update] = useMutation(UPDATE_GROUP);

  //when getGroup queries for parent and child are done, set initial checkboxes
  useEffect(() => {
    if (data) {
      //gets parent group's users and current group's users and sets which
      //checkbox is checked
      function mapUserToCheckbox(parentUsers = [], childUsers = []) {
        if (parentUsers && childUsers && mounted) {
          //empty object to hold checkboxes data
          let u = {};

          //first set for all usernames checkbox to false
          parentUsers.forEach((element) => {
            u[element.username] = { checked: false, id: element.id };
          });

          //override checkbox true for all users incurrent group
          childUsers.forEach((element) => {
            u[element.username] = { checked: true, id: element.id };
          });

          //set state with prepared data
          setState(u);
        }
      }

      mapUserToCheckbox(data.getGroup.parent.users, data.getGroup.users);
    }
  }, [data, mounted]);

  //handle loading and error
  if (loading) return <Loading />;
  if (error) {
    return <Errors errors={error} />;
  }

  //handle checkbox change
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.checked;

    setState({ ...state, [name]: { ...state[name], checked: value } });
  };

  //submit checkboxes and update group
  function handleSubmit(e) {
    e.preventDefault();

    const newUsers = Object.keys(state)
      .map((user) => state[user].checked && state[user].id)
      .filter((e) => e !== false);

    update({
      variables: { groupId, users: newUsers },
    });
  }

  //destructure current group info
  const { avatar, creator } = data?.getGroup || {};

  //get users from parent group
  const { users } = data?.getGroup?.parent || {};

  return (
    <>
      {data ? (
        <GroupContainer avatar={avatar}>
          <form onSubmit={handleSubmit}>
            <Users open={edit}>
              {users &&
                users.map((user) => {
                  const { id, username, avatar } = user;
                  const show =
                    edit &&
                    username !== creator?.username &&
                    username !== uname;
                  return (
                    <UserLine key={id}>
                      <User
                        
                        avatar={avatar}
                        disabled={!state[username]?.checked || false}
                        open={edit}
                      >
                        {username}{" "}
                      </User>

                      {show && (
                        <Checkbox htmlFor={username}>
                          <input
                            type="checkbox"
                            checked={state[username].checked}
                            name={username}
                            onChange={handleChange}
                          />
                          <span className="span"></span>
                        </Checkbox>
                      )}
                    </UserLine>
                  );
                })}
            </Users>
            {data?.getGroup?.creator?.username === uname && (
              <Button
                onClick={() => {
                  setEdit(!edit);
                }}
                type={edit ? "button" : "submit"}
              >
                {edit ? (
                  <AiFillSave data-tooltip="Save group members" />
                ) : (
                  <AiFillEdit data-tooltip="Edit group members" />
                )}
              </Button>
            )}
          </form>
        </GroupContainer>
      ) : null}
    </>
  );
};

export default Group;
