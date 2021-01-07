const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

//MongoDB
const MONGODB = process.env.MONGODB;

//GRAPHQL
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

//Apollo server

const server = new ApolloServer({
  typeDefs,
  resolvers,
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
