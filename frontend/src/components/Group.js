import { useQuery } from "@apollo/client";
import React from "react";
import Loading from "./Loading";
import { GET_GROUP } from "../queries";
import styled from "styled-components";
import { Button } from "./styled";

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
  const { loading, error, data } = useQuery(GET_GROUP, {
    variables: { groupId },
  });
  if (loading) return <Loading />;
  if (error) return <p>Error :( {JSON.stringify(error, null, 2)}</p>;

  const { getGroup = undefined } = data;
  const { users, avatar } = getGroup || {};
  return (
    <GroupContainer avatar={avatar}>
      <Users>
        {users &&
          users.map((user) => {
            return (
              <User avatar={user.avatar}>
                <span></span>
                {user.username}
              </User>
            );
          })}
      </Users>
      <Button>a</Button>
    </GroupContainer>
  );
};

export default Group;
