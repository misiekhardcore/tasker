import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import Loading from "./Loading";
import { GET_GROUP, UPDATE_GROUP } from "../queries";
import styled from "styled-components";
import { Button } from "./styled";
import { AuthContext } from "../context/auth";

const GroupContainer = styled.div`
  border: 2px solid ${(props) => `#${props.avatar}`};
  border-radius: 4px;
  padding: 0.2rem;
  color: gray;
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

const Users = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
`;

const User = styled.div`
  padding: 0.2rem;
  justify-content: flex-start;

  span {
    content: "";
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
    background-color: ${(props) => `#${props.avatar}`};
  }
`;

const Group = ({ groupId }) => {
  const {
    user: { username: uname },
  } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [state, setState] = useState({});

  const { loading, error, data } = useQuery(GET_GROUP, {
    variables: { groupId },
    refetchQueries: [GET_GROUP],
    onCompleted({ getGroup }) {
      const { users } = getGroup || {};
      if (users) {
        let u = {};
        users.forEach((element) => {
          u[element.username] = { checked: true, id: element.id };
        });
        setState({ ...state, ...u });
      }
    },
  });

  const [updateGroup] = useMutation(UPDATE_GROUP);

  if (loading) return <Loading />;
  if (error) return <p>Error :( {JSON.stringify(error, null, 2)}</p>;

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.checked;

    setState({ ...state, [name]: { ...state[name], checked: value } });
  };

  const { getGroup } = data;
  const { users, avatar, creator } = getGroup || {};

  return (
    <>
      {getGroup ? (
        <GroupContainer avatar={avatar}>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const newUsers = Object.keys(state)
                .map((a) => state[a].checked && state[a].id)
                .filter((e) => e !== false);

              console.log(newUsers);

              updateGroup({
                variables: { groupId, users: newUsers },
              });
            }}
          >
            <Users>
              {users &&
                users.map((user) => {
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
                        <input
                          type="checkbox"
                          checked={state[username].checked}
                          name={username}
                          onChange={handleChange}
                        />
                      )}
                    </User>
                  );
                })}
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
