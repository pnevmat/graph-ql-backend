import { createServer } from 'graphql-yoga';
import typeDefs from './schema';
import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Comment from './resolvers/Comment';

const server = createServer({
  schema: {
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
  },
});

server.start(() => {
  console.log('The server is up!');
});
