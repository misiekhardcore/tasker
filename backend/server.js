const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

//MongoDB
const MONGODB = process.env.MONGODB;

//GRAPHQL
const { PubSub } = require("apollo-server");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

//Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: "/subs",
  },
  context: ({ req }) => ({ req, pubsub }),
});

//Connect to database and start server
mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    return server.listen({ port: process.env.PORT || 5000 });
  })
  .then((res) => {
    console.log(`server running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
