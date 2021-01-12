import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
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
    console.log(state);
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
        <form
          onSubmit={handleSubmit}
          className={loading ? "loading" : ""}
        >
          <h1>Login</h1>
          <div className="form__group">
            <label htmlFor="email" className="form__label">
              Email:
            </label>
            <input
              name="email"
              type="text"
              className="form__input"
              placeholder="Enter your email..."
              value={state.email}
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
              className="form__input"
              placeholder="Enter your password..."
              value={state.password}
              onChange={handleChange}
            />
          </div>
          <button className="button button--block" type="submit">
            submit
          </button>
        </form>
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
