import { gql } from "@apollo/client";

export const GET_FOLDERS = gql`
  query getTables($parent: ID) {
    getTables(parent: $parent) {
      id
      name
      parent {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_FOLDER = gql`
  query getTable($tableId: ID!) {
    getTable(tableId: $tableId) {
      id
      name
      description
      creator {
        username
        role
        avatar
      }
      parent {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FOLDER = gql`
  mutation updateTable(
    $tableId: ID!
    $name: String!
    $description: String
    $parent: ID
  ) {
    updateTable(
      tableId: $tableId
      name: $name
      description: $description
      parent: $parent
    ) {
      id
      name
      description
      creator {
        username
        avatar
      }
      parent {
        id
        name
      }
      createdAt
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
        avatar
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
        avatar
      }
      parent {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASK = gql`
  query getTask($taskId: ID!) {
    getTask(taskId: $taskId) {
      id
      name
      description
      creator {
        username
        avatar
      }
      parent {
        id
        name
      }
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask(
    $taskId: ID!
    $name: String!
    $description: String
    $parent: ID
    $status: String
  ) {
    updateTask(
      taskId: $taskId
      name: $name
      description: $description
      parent: $parent
      status: $status
    ) {
      id
      name
      description
      creator {
        username
        id
        avatar
      }
      parent {
        id
        name
      }
      status
      updatedAt
      createdAt
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
        avatar
      }
      parent {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation deleteTable($parent: ID!) {
    deleteTable(tableId: $parent)
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId)
  }
`;

export const GET_COMMENTS = gql`
  query getComments($parent: ID!) {
    getComments(parent: $parent) {
      id
      body
      creator {
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation createComment($parent: ID!, $body: String!) {
    createComment(parent: $parent, body: $body) {
      id
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;
