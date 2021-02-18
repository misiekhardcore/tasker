import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";
import AuthRoute from "./utils/AuthRoute";
import "./App.scss";
import { ListProvider } from "./context/list";
import { ThemeProvider } from "styled-components";
import { rgb } from "polished";

const theme = {
  primary: rgb(167, 162, 162),
  error: rgb(255, 34, 34),
  warning: rgb(221, 221, 0),
  success: rgb(0, 204, 0),
  active: rgb(85, 85, 225),
  white: rgb(253, 246, 246),
  black: rgb(22, 22, 27),
  gray: rgb(119, 119, 136),
  disabled: rgb(204, 204, 187),
};

function App() {
  return (
    <AuthProvider>
      <ListProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <AuthRoute exact path="/" component={Main} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Router>
        </ThemeProvider>
      </ListProvider>
    </AuthProvider>
  );
}

export default App;
