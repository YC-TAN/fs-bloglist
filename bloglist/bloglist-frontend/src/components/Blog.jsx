import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";

import { useBlogs } from "../hooks/useBlogs";
import { useUser } from "../store/user";
import useField from "../hooks/useField";

const Blog = () => {
  const { id } = useParams();
  const { blog, isPending, like, remove, addComment } = useBlogs(id);
  const user = useUser();
  const comment = useField("text");
  const nav = useNavigate();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
  };

  const onLike = () => like(blog);

  const onDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      remove(blog);
      nav("/");
    }
  };

  const onComment = (e) => {
    e.preventDefault();
    addComment(id, {
      comment: comment.value,
    });
  };

  const showRemoveButton = user && user.username === blog.user?.username;

  if (isPending) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found!</p>;

  return (
    <div className="blog" style={blogStyle}>
      <h1>
        {blog.author}: {blog.title}
      </h1>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes} {user && <button onClick={onLike}>like</button>}
      </div>
      <div>Added by {blog.user?.name}</div>
      {showRemoveButton && <button onClick={onDelete}>remove</button>}
      <h2>comments</h2>
      <form onSubmit={onComment}>
        <div
          style={{
            display: "flex",
            gap: "5px",
          }}
        >
          <TextField label="comment" {...comment}></TextField>
          <Button type="submit" variant="contained">
            Add Comment
          </Button>
        </div>
      </form>

      {blog.comments && (
        <ul>
          {blog.comments.map((c, idx) => (
            <li key={`${c}-${idx}`}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Blog;
