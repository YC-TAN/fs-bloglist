import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

vi.mock('../hooks/useBlogs', () => ({
  useBlogs: vi.fn()
}))

import { useBlogs } from '../hooks/useBlogs'

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

test("<BlogForm /> update parent state onSubmit", async () => {
  const addBlog = vi.fn()
  useBlogs.mockReturnValue({ addBlog })

  const user = userEvent.setup();

  renderWithProviders(<BlogForm />);
  const inputs = screen.getAllByRole("textbox");
  const sendButton = screen.getByText("create");

  await user.type(inputs[0], "testing a form...");
  await user.type(inputs[1], "testing a form...");
  await user.type(inputs[2], "testing a form...");
  await user.click(sendButton);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0].title).toBe("testing a form...");
});
