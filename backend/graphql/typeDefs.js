const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Table {
    id: ID!
    name: String!
    description: String
    creator: User!
    parent: Table
    createdAt: String!
    updatedAt: String!
  }

  type Task {
    id: ID!
    name: String!
    description: String
    creator: User!
    parent: Table
    status: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    creator: User!
    parent: ID!
    createdAt: String!
    updatedAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    key: String!
  }

  input TableInput {
    name: String!
    description: String
    parent: ID
  }

  type Query {
    getTables(parent: ID): [Table]!
    getTable(tableId: ID!): Table
    getTasks(parent: ID): [Task]!
    getTask(taskId: ID!): Task
    getComments(parent: ID!): [Comment]
    getComment(commentId: ID!): Comment
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    register(
      username: String!
      password: String!
      confirmPassword: String!
      email: String!
      key: String!
    ): AuthPayload!

    createTable(parent: ID, name: String!, description: String): Table
    updateTable(
      tableId: ID!
      name: String!
      description: String
      parent: ID!
    ): Table
    deleteTable(tableId: ID!): Boolean

    createTask(parent: ID!, name: String!, description: String): Task
    updateTask(
      taskId: ID!
      name: String!
      description: String
      parent: ID!
      status: Int!
    ): Task
    deleteTask(taskId: ID!): Boolean

    createComment(parent: ID!, body: String!): Comment
  }
`;
