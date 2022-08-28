import { createServer } from 'graphql-yoga';

// Demo user data
const users = [
  {
    id: '123098',
    name: 'Vadim',
    email: 'pnevmat001@gmail.com',
    age: 36,
  },
  {
    id: 'fogk94',
    name: 'Sarah',
    email: 'sarah@gmail.com',
  },
  {
    id: '24kdd55',
    name: 'John',
    email: 'john@gmail.com',
    age: 16,
  },
];

// Demo posts data
const posts = [
  {
    id: '455753',
    title: 'Post title',
    body: 'Some post text',
    published: true,
    author: '123098',
  },
  {
    id: 'lhh98',
    title: 'Post title2',
    body: '',
    published: false,
    author: 'fogk94',
  },
  {
    id: '436lkjg98',
    title: '',
    body: 'Post description text3',
    published: false,
    author: '24kdd55',
  },
];

// Demo comments data
const comments = [
  {
    id: 'flgk03',
    text: 'Comment text1',
    author: '123098',
    post: '455753',
  },
  {
    id: '4-tgd',
    text: 'Comment text2',
    author: 'fogk94',
    post: 'lhh98',
  },
  {
    id: 'ff0349',
    text: 'Comment text3',
    author: '123098',
    post: '436lkjg98',
  },
  {
    id: '356gdf',
    text: 'Comment text4',
    author: '24kdd55',
    post: '455753',
  },
];

// Type definitions (schema)
const typeDefs = `
type Query {
	users(query: String): [User!]!
	posts(query: String): [Post!]!
	comments: [Comment!]!
	me: User!
	post: Post
}

type User {
	id: ID!
	name: String!
	email: String!
	age: Int
	posts: [Post!]!
	comments: [Comment!]!
}

type Post {
	id: ID!
	title: String!
	body: String!
	published: Boolean!
	author: User!
	comments: [Comment!]!
}

type Comment {
	id: ID!
	text: String!
	author: User!
	post: Post!
}
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter(user =>
        user.name.toLowerCase().includes(args.query.toLowerCase()),
      );
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter(post => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },
    comments() {
      return comments;
    },
    me() {
      return {
        id: '123098',
        name: 'Vadim',
        email: 'pnevmat001@gmail.com',
      };
    },
    post() {
      return {
        id: '455753',
        title: 'Post title',
        body: 'Some post text',
        published: false,
      };
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
    },
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
});

server.start(() => {
  console.log('The server is up!');
});
