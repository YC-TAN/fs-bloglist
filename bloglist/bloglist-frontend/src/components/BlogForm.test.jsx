import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: MemoryRouter });
};

test("<BlogForm /> update parent state onSubmit", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  renderWithRouter(<BlogForm createBlog={createBlog} />);
  const inputs = screen.getAllByRole("textbox");
  const sendButton = screen.getByText("create");

  await user.type(inputs[0], "testing a form...");
  await user.type(inputs[1], "testing a form...");
  await user.type(inputs[2], "testing a form...");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("testing a form...");
});
