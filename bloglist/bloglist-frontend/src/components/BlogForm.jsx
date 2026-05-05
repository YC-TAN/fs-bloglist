import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useBlogs } from '../hooks/useBlogs'
import useField from "../hooks/useField";

const BlogForm = () => {
  const { addBlog } = useBlogs()
  const nav = useNavigate();
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const handleSubmit = async (e) => {
    e.preventDefault();
    addBlog({
        title: title.value,
        author: author.value,
        url: url.value
    });
    nav("/");
    e.target.reset();
  };

  return (
    <div>
      <h1>Create a New Blog</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="title "
            {...title}
          />
        </div>
        <div>
          <TextField
            label="author "
            {...author}
          />
        </div>

        <div>
          <TextField
            label="url "
            {...url}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
