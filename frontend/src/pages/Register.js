import { gql, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

const Register = (props) => {
  const context = useContext(AuthContext);

  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    key: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    register();
  }

  const [register, { loading }] = useMutation(REGISTER, {
    update(_, { data: { register } }) {
      context.login(register);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: state,
  });

  return (
    <div className="container--center">
      <div className="form__container">
        <form
          onSubmit={handleSubmit}
          className={loading ? "loading" : ""}
        >
          <h1>Register</h1>
          <div className="form__group">
            <label htmlFor="email" className="form__label">
              Email:
            </label>
            <input
              name="email"
              type="email"
              className={`form__input ${
                errors.email || errors.general ? "error" : ""
              }`}
              placeholder="Enter your email..."
              value={state.email}
              onChange={handleChange}
            />
          </div>
          <div className="form__group">
            <label htmlFor="username" className="form__label">
              Username:
            </label>
            <input
              name="username"
              type="text"
              className={`form__input ${
                errors.username || errors.general ? "error" : ""
              }`}
              placeholder="Enter your username..."
              value={state.username}
              onChange={handleChange}
            />
          </div>
          <div className="form__group">
            <label htmlFor="password" className="form__label">
              Password:
            </label>
            <input
              name="password"
              type="password"
              className={`form__input ${
                errors.password || errors.general ? "error" : ""
              }`}
              placeholder="Enter your password..."
              value={state.password}
              onChange={handleChange}
            />
          </div>
          <div className="form__group">
            <label htmlFor="confirmPassword" className="form__label">
              Confirm password:
            </label>
            <input
              name="confirmPassword"
              type="password"
              className={`form__input ${
                errors.confirmPassword || errors.general ? "error" : ""
              }`}
              placeholder="Confirm password..."
              value={state.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="form__group">
            <label htmlFor="key" className="form__label">
              Key:
            </label>
            <input
              name="key"
              type="text"
              className={`form__input ${
                errors.key || errors.general ? "error" : ""
              }`}
              placeholder="Enter your licence/key..."
              value={state.key}
              onChange={handleChange}
            />
          </div>
          <button
            className="button button--primary button--block"
            type="submit"
          >
            submit
          </button>
        </form>
        <Link className="form__link" to="/login">
          You have an account? Sign in!
        </Link>
        {Object.keys(errors).length > 0 && (
          <div className="error-list">
            <ul className="list">
              {Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const REGISTER = gql`
  mutation register(
    $username: String!
    $password: String!
    $confirmPassword: String!
    $email: String!
    $key: String!
  ) {
    register(
      username: $username
      password: $password
      confirmPassword: $confirmPassword
      email: $email
      key: $key
    ) {
      user {
        id
        username
        role
        createdAt
        updatedAt
        email
      }
      token
    }
  }
`;

export default Register;
