import { gql, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import Errors from "../components/Errors";
import Loading from "../components/Loading";
import {
  Button,
  Form,
  FormContainer,
  FormGroup,
  Input,
  Label,
  LinkStyled,
} from "../components/styled";
import { AuthContext } from "../context/auth";

const Register = (props) => {
  const context = useContext(AuthContext);

  const { user } = context;

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
    update(cache, { data: { register } }) {
      //clear cache on login, to prevent new user from viewing
      //previous user data
      Object.keys(cache.data.data).forEach((key) => {
        cache.data.delete(key);
      });
      context.login(register);
    },
    onError(err) {
      if (err.graphQLErrors[0].extensions.exception.errors) {
        setErrors(err.graphQLErrors[0].extensions.exception.errors);
      } else {
        setErrors({ err: err.message });
        throw err;
      }
    },
    variables: state,
  });

  if (user) return <Redirect to="/" />;

  return (
    <>
      {loading && <Loading block />}
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <FormGroup>
            <Label htmlFor="email">Email:</Label>
            <Input
              name="email"
              type="email"
              className={errors.email || errors.general ? "error" : ""}
              placeholder="Enter your email..."
              value={state.email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="username">Username:</Label>
            <Input
              name="username"
              type="text"
              className={errors.username || errors.general ? "error" : ""}
              placeholder="Enter your username..."
              value={state.username}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password:</Label>
            <Input
              name="password"
              type="password"
              className={errors.password || errors.general ? "error" : ""}
              placeholder="Enter your password..."
              value={state.password}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm password:</Label>
            <Input
              name="confirmPassword"
              type="password"
              className={
                errors.confirmPassword || errors.general ? "error" : ""
              }
              placeholder="Confirm password..."
              value={state.confirmPassword}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="key">Key:</Label>
            <Input
              name="key"
              type="text"
              className={errors.key || errors.general ? "error" : ""}
              placeholder="Enter your licence/key..."
              value={state.key}
              onChange={handleChange}
            />
          </FormGroup>
          <Errors errors={errors} />
          <Button primary block type="submit">
            submit
          </Button>
        </Form>
        <LinkStyled to="/login">You have an account? Sign in!</LinkStyled>
      </FormContainer>
    </>
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
        email
        role
        avatar
        team {
          id
        }
      }
      token
    }
  }
`;

export default Register;
