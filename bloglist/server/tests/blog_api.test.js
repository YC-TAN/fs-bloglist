const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { 
    blogsInDb, 
    initialBlogs, 
    createUserToken,
} = require('./test_helper')

const api = supertest(app)

describe('/api/blogs', () => {
    let user1;
    let user2;
    let token1;
    let token2;
    
    beforeEach(async () => {
        await Blog.deleteMany({})  
        await User.deleteMany({})
        const userOne = await createUserToken('user1', 'name1');
        const userTwo = await createUserToken('user2', 'name2');
        token1 = userOne.token
        user1 = userOne.savedUser
        token2 = userTwo.token
        user2 = userTwo.savedUser
        const blogs = await Blog.insertMany(initialBlogs(user1._id))
        user1.blogs = blogs.map(b => b._id)
        await user1.save()
    })

    describe('GET', () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
            })

            test('all blogs are returned', async () => {
            const response = await api.get('/api/blogs')
            const blogs = await blogsInDb()

            assert.strictEqual(response.body.length, blogs.length)
        })

        test('a specific blog is within the returned blogs', async () => {
            const blogs = await blogsInDb()
            const response = await api.get('/api/blogs')

            const titles = response.body.map((b) => b.title)
            assert(titles.includes(blogs[0].title))
        })

        test('a specific blog can be viewed', async () => {
            const blogs = await blogsInDb()
            const blogToView = blogs[0]
            
            const response = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.title, blogToView.title);
        })
    })

    describe('POST', () => {
        test('a valid blog can be added ', async () => {
            const blogsAtStart = await blogsInDb()
            const newBlog = {
                title: "new blog",
                author: "new author",
                url: "new url",
                likes: 0
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `Bearer ${token1}`)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

            const titles = blogsAtEnd.map(r => r.title)
            assert(titles.includes('new blog'))
        })

        test('blog without likes is default to 0', async () => {
            
            const newBlog = {
                title: "new blog 2",
                author: "new author 2",
                url: "new url 2",
            }

            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token1}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.likes, 0)
        })

        test('blog without title is not added', async () => {
            const blogsAtStart = await blogsInDb()
            const newBlog = {
                author: "some author",
                url: "some url"
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `Bearer ${token1}`)
                .expect(400)

            const blogsAtEnd = await blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })

        test('blog without url is not added', async () => {
            const newBlog = {
                author: "some author",
                title: "some title"
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `Bearer ${token1}`)
                .expect(400)
        })

        test('only logged in user can add blog', async () => {
            const newBlog = {
                author: "some author",
                url: "someurl",
                title: "some title"
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
        })

    })

    describe('DELETE', () => {
        test('a specific blog can be deleted', async () => {
            const blogsAtStart = await blogsInDb()
            const blogToDelete = blogsAtStart[0]
            
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token1}`)
                .expect(204)
            
            const blogsAtEnd = await blogsInDb()

            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
        })

        test('only creators can delete their own blogs', async () => {
            const blogsAtStart = await blogsInDb()
            const blogToDelete = blogsAtStart[0]
            
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token2}`)
                .expect(403)

            const blogsAtEnd = await blogsInDb()

            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
        })
    })
})

after(async () => {
  await mongoose.connection.close()
})