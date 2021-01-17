import { gql } from "@apollo/client";

export const GET_FOLDERS = gql`
  query getTables($parent: ID) {
    getTables(parent: $parent) {
      id
      name
      description
      creator {
        username
      }
      parent {
        id
      }
      updatedAt
    }
  }
`;

export const GET_TASKS = gql`
  query getTasks($parent: ID) {
    getTasks(parent: $parent) {
      id
      name
      description
      creator {
        username
      }
      parent {
        id
      }
      updatedAt
    }
  }
`;

export const ADD_FOLDER = gql`
  mutation createTable(
    $name: String!
    $description: String
    $parent: ID
  ) {
    createTable(
      name: $name
      description: $description
      parent: $parent
    ) {
      id
      name
      description
      creator {
        username
      }
      parent {
        id
      }
      updatedAt
    }
  }
`;

export const ADD_TASK = gql`
  mutation createTask($parent: ID!, $name: String!) {
    createTask(parent: $parent, name: $name) {
      id
      name
      description
      creator {
        username
      }
      parent {
        id
      }
      updatedAt
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation deleteTable($parent: ID!) {
    deleteTable(tableId: $parent)
  }
`;
