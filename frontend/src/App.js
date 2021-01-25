import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";
import AuthRoute from "./utils/AuthRoute";
import "./App.scss";
import { ListProvider } from "./context/list";

function App() {
  return (
    <AuthProvider>
      <ListProvider>
        <Router>
          <AuthRoute exact path="/" component={Main} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Router>
      </ListProvider>
    </AuthProvider>
  );
}

export default App;
