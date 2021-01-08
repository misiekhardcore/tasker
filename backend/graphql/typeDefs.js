const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    role: Int!
  }

  type UserPayload {
    user: User!
    token: String!
  }

  type Table {
    id: ID!
    title: String!
    description: String
    creator: User!
    team: [Role!]!
    tasks: [Task]!
    createdAt: String!
    updatedAt: String!
  }

  type Role {
    user: User!
    role: Int!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    creator: User!
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

  type Query {
    getTables: [Table]!
    getTable(tableId: ID!): Table!
    getTask(taskId: ID!): Task!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    key: String!
  }

  input TableInput {
    title: String!
    description: String
    team: [RoleInput]
  }

  input RoleInput {
    user: ID!
    role: Int!
  }

  input TaskInput {
    tableId: ID!
    title: String!
    description: String
  }

  type Mutation {
    login(username: String!, password: String!): UserPayload!
    register(registerInput: RegisterInput): User!
    createTable(tableInput: TableInput): Table!
    createTask(taskInput: TaskInput): Task!
  }
`;
