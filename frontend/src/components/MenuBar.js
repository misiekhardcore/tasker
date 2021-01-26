import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { ListContext } from "../context/list";
import "./MenuBar.scss";

const MenuBar = () => {
  const { logout } = useContext(AuthContext);
  const { setTask, setBack, setColumn2, setFolder } = useContext(ListContext);

  function handleLogout() {
    setBack([]);
    setColumn2([]);
    setFolder();
    setTask();
    logout();
  }

  return (
    <div className="menu__container">
      <Link to="/" onClick={() => window.location.reload()}>
        <h1 className="menu__logo">Tasker</h1>
      </Link>
      <nav className="nav">
        <ul className="nav__links">
          <li className="nav__link" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MenuBar;
