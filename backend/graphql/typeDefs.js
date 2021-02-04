const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    avatar: String!
    team: ID!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Team {
    id: ID!
    name: String!
    creator: User!
    users: [User]!
  }

  type Group {
    id: ID!
    creator: User!
    avatar: String!
    users: [User]!
  }

  type Table {
    id: ID!
    name: String!
    description: String
    creator: User!
    parent: Table
    group: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Task {
    id: ID!
    name: String!
    description: String
    creator: User!
    parent: Table
    status: String!
    comments: [Comment]!
    group: ID
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

    getTeam(teamId: ID!): Team
    getGroups(userId: ID): Group
    getGroup(groupId: ID): Group
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
      parent: ID
    ): Table
    deleteTable(tableId: ID!): Boolean

    createTask(
      parent: ID!
      name: String!
      description: String
      status: String
    ): Task
    updateTask(
      taskId: ID!
      name: String!
      description: String
      parent: ID
      status: String
    ): Task
    deleteTask(taskId: ID!): Boolean

    createComment(parent: ID!, body: String!): Comment
    deleteComment(commentId: ID!): Boolean

    createGroup(users: [ID!]!): Group
    updateGroup(groupId: ID!, users: [ID!]!): Group
  }
`;
