import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
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
import { errorHandler } from "../utils/helpers";

function Login() {
  const context = useContext(AuthContext);

  const { user } = context;

  const [state, setState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const [login, { loading }] = useMutation(LOGIN, {
    update(cache, { data: { login } }) {
      //clear cache on login, to prevent new user from viewing
      //previous user data
      Object.keys(cache.data.data).forEach((key) => {
        cache.data.delete(key);
      });
      context.login(login);
    },
    onError(err) {
      errorHandler(err, setErrors);
    },
    variables: state,
  });

  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await login();
  }

  if (user) return <Redirect to="/" />;

  return (
    <>
      {loading && <Loading block />}
      <FormContainer>
        <Form onSubmit={handleSubmit}>
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
              className={
                errors?.password || errors?.general ? "error" : ""
              }
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
        <LinkStyled to="/register">
          You new here? Create an account!
        </LinkStyled>
      </FormContainer>
    </>
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
        team {
          id
        }
      }
      token
    }
  }
`;

export default Login;
