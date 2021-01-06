const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    role: [Int!]!
  }
  type Table {
    id: ID!
    title: String!
    description: String
    creator: User!
    tasks: [Task]!
    createdAt: String!
    updatedAt: String!
  }

  type Task {
    id: ID!
    creator: User!
    title: String!
    description: String
    status: Int!
    comments: [Comment!]
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    creator: User!
    body: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getTables: [Table]!
    getTable(tableId: ID!): Table!
    getTask(taskId: ID!): Task!
  }

  input RegisterInput{
    username:String!
    password: String!
    confirmPassword: String!
    email: String!
    key: String!
  }

  type Mutation {
    login(username: String!, password: String!): User!
    register(registerInput: RegisterInput):User!
  }
`;
