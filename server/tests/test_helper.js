const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.SECRET,
    { expiresIn: 60*60 }
  );
};

const createUserToken = async (username, name) => {
    const passwordHash = await bcrypt.hash('password123', 10)

    const user = new User({
        username: username,
        name: name,
        passwordHash
    })

    const savedUser = await user.save()
    const token = generateToken(user._id)
    return {savedUser, token}
}

const initialBlogs = (id) => [
  {
    title: "test blog",
    author: "author",
    url: "test url",
    likes: 100,
    user: id
  },
  {
    title: "test blog 2",
    author: "author2",
    url: "test url2",
    likes: 10,
    user: id
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: "nonexistence",
    author: "author2",
    url: "test url2",
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({}).populate('blogs')
  return users.map(user => user.toJSON())
}


module.exports = {
  createUserToken,
  initialBlogs, 
  nonExistingId, 
  blogsInDb, 
  usersInDb,
  generateToken,
}