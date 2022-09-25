const uuId = require('uuid');

const Mutation = {
  createUser(parent, args, ctx, info) {
    const { users } = ctx.db;
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
    let { users, posts, comments } = ctx.db;
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
  updateUser(parent, args, ctx, info) {
    let { users } = ctx.db;
    const userExist = users.find(user => user.id === args.id);

    if (!userExist) {
      throw new Error('User not found.');
    }

    const updatedUser = {
      ...userExist,
      ...args.data,
    };

    users = users.map(user => {
      if (user.id === args.id) {
        return updatedUser;
      }

      return user;
    });

    return updatedUser;
  },
  createPost(parent, args, ctx, info) {
    const { users, posts } = ctx.db;
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
    let { posts, comments } = ctx.db;
    const postIndex = posts.findIndex(post => post.id === args.id);

    if (postIndex === -1) {
      throw new Error('The post does not exist.');
    }

    const deletedPost = posts.splice(postIndex, 1);

    comments = comments.filter(comment => comment.post !== args.id);

    return deletedPost[0];
  },
  updatePost(parent, args, ctx, info) {
    const { posts } = ctx.db;
    const postExist = posts.find(post => post.id === args.id);

    if (!postExist) {
      throw new Error('Post not found.');
    }

    const updatedPost = {
      ...postExist,
      ...args,
    };

    posts.map((post, i) => {
      if (post.id === args.id) {
        posts[i] = updatedPost;
      }
      return post;
    });

    return updatedPost;
  },
  createComment(parent, args, ctx, info) {
    const { users, posts, comments } = ctx.db;
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
    let { comments } = ctx.db;
    const commentExist = comments.find(comment => comment.id === args.id);

    if (!commentExist) {
      throw new Error('Comment does not exist.');
    }

    comments = comments.filter(comment => comment.id !== args.id);

    return commentExist;
  },
  updateComment(parent, args, ctx, info) {
    const { comments } = ctx.db;
    const commentExist = comments.find(comment => comment.id === args.id);

    if (!commentExist) {
      throw new Error('Comment not found');
    }

    const updatedComment = {
      ...commentExist,
      ...args,
    };

    comments.map((comment, i) => {
      if (comment.id === args.id) {
        comments[i] = updatedComment;
      }

      return comment;
    });

    return updatedComment;
  },
};

module.exports = Mutation;
