import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Blog from "./Blog";

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
});

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test("renders blog", () => {
  renderWithRouter(<Blog blog={blog} user={null} />);

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
  const nonCreator = { username: "other_user", id: "user_id_2" };

  renderWithRouter(<Blog blog={blog} user={nonCreator} />);

  expect(screen.getByRole("button", { name: /like/i })).toBeDefined();
  expect(screen.queryByRole("button", { name: /remove/i })).toBeNull();
});

test("creator sees both like and remove buttons", () => {
  const creator = { username: "creator_user", id: "user_id_1" };

  renderWithRouter(<Blog blog={blog} user={creator} />);

  expect(screen.getByRole("button", { name: /like/i })).toBeDefined();
  expect(screen.getByRole("button", { name: /remove/i })).toBeDefined();
});
