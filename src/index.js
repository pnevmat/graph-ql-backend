import { createServer } from 'graphql-yoga';
import { v4 as uuId } from 'uuid';

// Demo user data
let users = [
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
let posts = [
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
let comments = [
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

type Mutation {
	createUser(data: CreateUserInput!): User!
	deleteUser(id: ID!): User!
	createPost(data: CreatePostInput!): Post!
	deletePost(id: ID!): Post!
	createComment(data: CreateCommentInput!): Comment!
	deleteComment(id: ID!): Comment!
}

input CreateUserInput {
	name: String!,
	email: String!, 
	age: Int
}

input CreatePostInput {
	title: String!
	body: String!
	published: Boolean!
	author: ID!
}

input CreateCommentInput {
	text: String!
	author: ID!
	post: ID!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email is already exist.');
      }

      const user = {
        id: uuId(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User doas not exist.');
      }

      const deletedUser = users.splice(userIndex, 1);

      posts = posts.filter(post => {
        if (post.author === args.id) {
          comments = comments.filter(comment => comment.post !== post.id);
        }
        return post.author !== args.id;
      });

      comments = comments.filter(comment => comment.author !== args.id);

      return deletedUser[0];
    },
    createPost(parent, args, ctx, info) {
      const userIdExist = users.some(user => user.id === args.data.author);

      if (!userIdExist) {
        throw new Error('Author does not exist.');
      }

      const post = {
        id: uuId(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex(post => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('The post does not exist.');
      }

      const deletedPost = posts.splice(postIndex, 1);

      comments = comments.filter(comment => comment.post !== args.id);

      return deletedPost[0];
    },
    createComment(parent, args, ctx, info) {
      const userExist = users.some(user => user.id === args.data.author);
      const postExistAndPublished = posts.some(
        post => post.id === args.data.post && post.published,
      );

      if (!userExist) {
        throw new Error('Author does not exist.');
      }

      if (!postExistAndPublished) {
        throw new Error('Post does not exist.');
      }

      const comment = {
        id: uuId(),
        ...args.data,
      };

      comments.push(comment);

      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentExist = comments.find(comment => comment.id === args.id);

      if (!commentExist) {
        throw new Error('Comment does not exist.');
      }

      comments = comments.filter(comment => comment.id !== args.id);

      return commentExist;
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
