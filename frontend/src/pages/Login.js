import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Errors from "../components/Errors";
import { Button, Form, FormGroup, Input, Label } from "../components/styled";
import { AuthContext } from "../context/auth";

function Login(props) {
  const context = useContext(AuthContext);

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
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: state,
  });

  return (
    <div className="container--center">
      <div className="form__container">
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
          <Button block primary type="submit">
            submit
          </Button>
        </Form>
        <Link className="form__link" to="/register">
          You new here? Create an account!
        </Link>
        <Errors errors={errors} />
      </div>
    </div>
  );
}

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

export default Login;
