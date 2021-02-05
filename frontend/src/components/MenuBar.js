import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { ListContext } from "../context/list";
import styled from "styled-components";

const MenuContainer = styled.div`
  width: 100%;
  padding: 0.5rem 0.8rem;
  display: flex;
  align-items: center;
  background-color: #aaa;
  color: white;
  font-family: "Sofia", cursive;

  a {
    text-decoration: none;
  }
`;

const Logo = styled(Link)`
  font-family: inherit;
  font-style: italic;
  font-size: 2rem;
  color: white;

  &:hover {
    transform: scale(1.05) rotate(5deg);
  }
`;

const Nav = styled.nav`
  margin-left: auto;
  font-family: inherit;

  ul {
    font-family: inherit;
    display: flex;
    list-style: none;
    color: $white;
    font-size: 1.5rem;

    li {
      font-family: inherit;
      transition: all 0.2s ease-in-out;
      &:hover {
        cursor: pointer;
        transform: scale(1.05);
      }

      & + li {
        margin-left: 1rem;
      }
    }
  }
`;

const MenuBar = () => {
  const { logout, user } = useContext(AuthContext);
  const { setTask, setBack, setColumn2, setFolder } = useContext(ListContext);

  function handleLogout() {
    setBack([]);
    setColumn2([]);
    setFolder();
    setTask();
    logout();
  }

  return (
    <MenuContainer>
      <Logo to="/" onClick={() => window.location.reload()}>
        Tasker
      </Logo>
      <Nav>
        <ul>
          <li>{user.username}</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </Nav>
    </MenuContainer>
  );
};

export default MenuBar;
