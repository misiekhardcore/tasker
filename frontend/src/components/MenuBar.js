import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import "./MenuBar.scss";

const MenuBar = () => {
  const context = useContext(AuthContext);

  return (
    <div className="menu__container">
      <Link to='/' onClick={() => window.location.reload()}><h1 className="menu__logo">Tasker</h1></Link>
      <nav className="nav">
        <ul className="nav__links">
          <li className="nav__link" onClick={context.logout}>
            Logout
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MenuBar;
