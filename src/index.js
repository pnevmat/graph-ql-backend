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

async function server() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
      Post,
      User,
      Comment,
    },
    context: {
      db,
    },
    plugins: [newRelicApolloServerPlugin],
    formatError: err => {
      console.log(err);
      logger.error(err);
      return err;
    },
  });

  const app = express();

  // app.get('/', (req, res) => {
  //   // console.log('Request: ', req);
  //   // console.log('Request body: ', req.body);
  //   console.log('Response: ', res);
  //   return res;
  // });

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

// const server = new GraphQLServer({
//   schema: {
//     typeDefs,
//     resolvers: {
//       Query,
//       Mutation,
//       Post,
//       User,
//       Comment,
//     },
//     context: {
//       db,
//     },
//   },
// });

// server.start(() => {
//   console.log('The server is up!');
// });
