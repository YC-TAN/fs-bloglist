// import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import Blog from './Blog'

// let blog

// beforeEach(() => {
//   blog = {
//     title: 'test title',
//     url: 'some url',
//     author: 'author',
//     likes: 15,
//   }
// })

// test('renders blog', () => {
//   render(<Blog blog={blog} />)

//   const element = screen.getByText(blog.title, { exact: false })
//   expect(element).toBeDefined()
// })

// test('hides url and numbers of likes on first render', () => {
//   const { container } = render(<Blog blog={blog} />)

//   // Find the div by its class
//   const detailsDiv = container.querySelector('.content')
//   expect(detailsDiv).not.toBeVisible()
// })

// test('clicking view button shows likes and url', async () => {
//   render(<Blog blog={blog} />)

//   const user = userEvent.setup()
//   const button = screen.getByText('view')
//   await user.click(button)
//   const likeButton = screen.getByRole('button', { name: /like/i })
//   expect(likeButton).toBeDefined()
// })

// test('one click on like button calls event handler once', async () => {
//   const mockHandler = vi.fn()

//   render(<Blog blog={blog} addLike={mockHandler} />)

//   const user = userEvent.setup()
//   const button = screen.getByText('view')
//   await user.click(button)
//   const likeButton = screen.getByText('like')
//   await user.click(likeButton)
//   expect(mockHandler.mock.calls).toHaveLength(1)
//   await user.click(likeButton)
//   expect(mockHandler.mock.calls).toHaveLength(2)
// })
