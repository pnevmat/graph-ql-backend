const Query = {
  users(parent, args, ctx, info) {
    const { users } = ctx.db;
    if (!args.query) {
      return users;
    }

    return users.filter(user =>
      user.name.toLowerCase().includes(args.query.toLowerCase()),
    );
  },
  posts(parent, args, ctx, info) {
    const { posts } = ctx.db;
    console.log('Posts: ', posts);
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
  comments(parent, args, ctx, info) {
    const { comments } = ctx.db;
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
};

module.exports = Query;
