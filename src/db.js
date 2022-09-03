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

const db = {
  users,
  posts,
  comments,
};

export default db;
