import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Blog from "./Blog";

vi.mock('../hooks/useBlogs', () => ({
  useBlogs: vi.fn()
}))
vi.mock('../store/user', () => ({ useUser: vi.fn() }))

import { useBlogs } from '../hooks/useBlogs'
import { useUser } from '../store/user'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const renderWithProviders = (ui) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  )
}

let blog;

beforeEach(() => {
  blog = {
    title: "test title",
    url: "some url",
    author: "author",
    likes: 15,
    user: {
      username: "creator_user",
      name: "The Creator",
      id: "user_id_1",
    },
  };

  // give useBlogs a default return value for every test
  useBlogs.mockReturnValue({
    blog,
    isPending: false,
    like: vi.fn(),
    remove: vi.fn(),
    addComment: vi.fn(),
  })

  // default: no logged in user
  useUser.mockReturnValue(null)
});

test("renders blog", () => {
  renderWithProviders(<Blog />);

  const title = screen.getByText(blog.title, { exact: false });
  expect(title).toBeDefined();
  const author = screen.getByText(blog.author, { exact: false });
  expect(author).toBeDefined();
  const likes = screen.getByText("likes 15");
  expect(likes).toBeDefined();
  expect(screen.queryByRole("button", { name: /like/i })).toBeNull();
  expect(screen.queryByRole("button", { name: /remove/i })).toBeNull();
});

test("authenticated non-creator sees only the like button", () => {
  useUser.mockReturnValue({ username: "other_user", id: "user_id_2" })

  renderWithProviders(<Blog />);

  expect(screen.getByRole("button", { name: /like/i })).toBeDefined();
  expect(screen.queryByRole("button", { name: /remove/i })).toBeNull();
});

test("creator sees both like and remove buttons", () => {
  useUser.mockReturnValue({ username: "creator_user", id: "user_id_1" })

  renderWithProviders(<Blog />);

  expect(screen.getByRole("button", { name: /like/i })).toBeDefined();
  expect(screen.getByRole("button", { name: /remove/i })).toBeDefined();
});
