import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import Errors from "../components/Errors";
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

function Login(props) {
  const context = useContext(AuthContext);

  const { user } = context;

  if (user) {
    props.history.push("/");
  }

  const [state, setState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    login();
  }

  const [login, { loading }] = useMutation(LOGIN, {
    update(_, { data: { login } }) {
      context.login(login);
      props.history.push("/");
    },
    onError(err) {
      try {
        setErrors(err.graphQLErrors[0].extensions.exception.errors);
      } catch (e) {
        setErrors({ err: err.message, e: e.message });
      }
    },
    variables: state,
  });

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit} className={loading ? "loading" : ""}>
        <h1>Login</h1>
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
        <Errors errors={errors} />
        <Button block primary type="submit">
          submit
        </Button>
      </Form>
      <LinkStyled to="/register">You new here? Create an account!</LinkStyled>
    </FormContainer>
  );
}

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        username
        email
        role
        avatar
        team
      }
      token
    }
  }
`;

export default Login;
