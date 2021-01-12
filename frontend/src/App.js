import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import Login from "./pages/Login";
import Main from "./pages/Main";
import AuthRoute from "./utils/AuthRoute";
import "./App.scss";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthRoute exact path="/" component={Main} />
        <Route exact path="/login" component={Login} />
      </Router>
    </AuthProvider>
  );
}

export default App;
