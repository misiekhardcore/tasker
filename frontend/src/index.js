import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.scss";

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  split,
} from "@apollo/client";

import { WebSocketLink } from "@apollo/client/link/ws";

import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";

const storedToken = localStorage.getItem("jwtToken");
const token = storedToken ? `Bearer ${storedToken}` : "";

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

const urlBase = "tasker-task.herokuapp.com";

const link = createHttpLink({
  uri: `https://${urlBase}`,
  credentials: "same-origin",
});

const wsLink = new WebSocketLink({
  uri: `wss://${urlBase}/subs`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: token,
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(link)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Group: {
        fields: {
          users: {
            merge(_, i) {
              return i;
            },
          },
        },
      },
      Query: {
        fields: {
          getTables: {
            merge(_, i) {
              return i;
            },
          },
        },
        getTasks: {
          merge(_, i) {
            return i;
          },
        },
      },
    },
  }),
  connectToDevTools: true,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
