import { gql, useMutation } from "@apollo/client";
import "./App.css";

function App() {
  const [login, { error, loading, data }] = useMutation(LOGIN);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error :(</p>;

  return (
    <>
      {loading && <p>loading</p>}
      {error && <p>error</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button
        onClick={() =>
          login({
            variables: {
              email: "misiek@misiek.com",
              password: "misiek",
            },
          })
        }
      >
        login
      </button>
    </>
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

export default App;
