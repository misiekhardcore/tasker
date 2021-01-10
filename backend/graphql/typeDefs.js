const { gql } = require("apollo-server");

module.exports = gql`
  scalar JSON

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
    parent: ID!
    shareWith: [JSON]
    createdAt: String!
    updatedAt: String!
  }

  type Team {
    id: ID!
    name: String!
  }

  type Task {
    id: ID!
    name: String!
    description: String
    creator: User!
    parent: ID!
    status: Int!
    comments: [Comment]!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    creator: User!
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
    shareWith: [ShareInput]
  }

  input TaskInput {
    tableId: ID!
    name: String!
    description: String
  }

  input ShareInput {
    kind: String
    item: ID
  }

  type Query {
    getTeam: Team
    getTables(parent: ID): [Table]!
    getTable(tableId: ID!): Table
    getTasks(parent: ID): [Task]!
    getTask(taskId: ID!): Task
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    register(registerInput: RegisterInput): AuthPayload!

    createTable(parent: ID!, name: String!): Table!
    updateTable(id: ID!, input: TableInput): Table!
    deleteTable(id: ID!): Boolean

    createTask(taskInput: TaskInput): Task
  }
`;
