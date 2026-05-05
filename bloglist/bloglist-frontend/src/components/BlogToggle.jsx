import { useState } from "react";

const BlogToggle = ({ blog, addLike, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const onLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    addLike(updatedBlog);
  };

  const onDelete = () => {
    deleteBlog(blog);
  };

  const showRemoveButton =
    user?.username === blog.user?.username || user?.id === blog.user?.id;

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <span style={visible ? showWhenVisible : hideWhenVisible}>
          <button onClick={toggleVisibility}>
            {visible ? "hide" : "view"}
          </button>
        </span>
        <div className="content" style={showWhenVisible}>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={onLike}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {showRemoveButton && <button onClick={onDelete}>remove</button>}
        </div>
      </div>
    </div>
  );
};

export default BlogToggle;
