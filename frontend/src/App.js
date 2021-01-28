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

const theme={
  primary: "#ee5d8d"
}

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
