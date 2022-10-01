const { ApolloServer } = require('apollo-server-express');
const newRelicApolloServerPlugin = require('@newrelic/apollo-server-plugin');
const { importSchema } = require('graphql-import');
const winston = require('winston');
const express = require('express');
const db = require('./db');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Post = require('./resolvers/Post');
const User = require('./resolvers/User');
const Comment = require('./resolvers/Comment');
const Subscription = require('./resolvers/Subscription');
const { PubSub } = require('graphql-subscriptions');

const typeDefs = importSchema('./src/schema.graphql');
const serverPort = 4000;
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {},
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const pubsub = new PubSub();

async function server() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
      Subscription,
      Post,
      User,
      Comment,
    },
    context: {
      db,
      pubsub,
    },
    plugins: [newRelicApolloServerPlugin],
    formatError: err => {
      console.log(err);
      logger.error(err);
      return err;
    },
  });

  const app = express();

  const cors = {
    // TODO: Restric API for specific hosts only after final release
    origin: '*',
    credentials: true,
  };

  await server.start();

  server.applyMiddleware({ app, cors });

  app.listen(serverPort, () =>
    logger.info(`App listening on port ${serverPort}!`),
  );
}
server();
