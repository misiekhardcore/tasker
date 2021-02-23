import React, { useContext, useEffect, useState } from "react";
import { gql, useSubscription } from "@apollo/client";
import styled from "styled-components";
import { User } from "./styled";
import { IoIosClose } from "react-icons/io";
import { AuthContext } from "../context/auth";

const NotificationContainer = styled.ul`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: auto;
  height: auto;
  list-style: none;
`;

const Notification = styled.li`
  background-color: rgba(255, 255, 255, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }

  p {
    margin-left: 0.2rem;
    margin-right:0.5rem;
    color: ${(props) => props.theme.gray};

    b {
      color: ${(props) => props.theme.black};
    }
  }

  button {
    margin-left: auto;
    color: ${(props) => props.theme.white};
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 50%;
    background-color: ${(props) => props.theme.primary};
    cursor: pointer;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  & + li {
    margin-top: 0.5rem;
  }
`;

const SUB_TABLE = gql`
  subscription tableCreated {
    tableCreated {
      id
      name
      creator {
        id
        username
        avatar
      }
      parent {
        id
      }
    }
  }
`;

const SUB_TASK = gql`
  subscription taskCreated {
    taskCreated {
      id
      name
      creator {
        id
        username
        avatar
      }
      parent {
        id
        name
      }
    }
  }
`;

const Notifications = () => {
  //collect notifications in state
  const [state, setState] = useState([]);

  //get current user to prevent from displaying self-created notifications
  const {
    user: { username: uname },
  } = useContext(AuthContext);

  //get create notifications
  const { data: data1 } = useSubscription(SUB_TABLE);
  const { data: data2 } = useSubscription(SUB_TASK);

  function addNotification(data) {
    if (data) {
      const dataDestr = data[Object.keys(data)[0]];
      if (dataDestr?.creator?.username !== uname) {
        const type = dataDestr?.__typename === "Table" ? "folder" : "task";
        setState((state) => [...state, { ...dataDestr, type }]);
      }
    }
  }

  //add new notification on data change
  useEffect(() => {
    addNotification(data1);
  }, [data1]);

  useEffect(() => {
    addNotification(data2);
  }, [data2]);

  //remove selected notification
  const handleRemove = (id) => {
    var array = [...state]; // make a separate copy of the array
    setState(array.filter((x) => x.id !== id));
  };

  return (
    <NotificationContainer>
      {state &&
        state.map((line) => {
          const { id, creator, name, parent } = line || {};

          return (
            <Notification key={id}>
              <User avatar={creator?.avatar}>{creator?.username}</User>
              <p>
                created {line.type} <b>{name}</b> in{" "}
                <b>{parent?.name || "main"}</b>
              </p>
              <button type="button" onClick={() => handleRemove(id)}>
                <IoIosClose />
              </button>
            </Notification>
          );
        })}
    </NotificationContainer>
  );
};

export default Notifications;
