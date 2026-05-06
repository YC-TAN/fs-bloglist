import { Link } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";

const BlogList = () => {
  const { blogs, isPending } = useBlogs()
  
  if (isPending) return (<p>Loading ... </p>);
  if (!blogs) return null;
  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes);

  return (
    <>
      <h2>blogs</h2>
      <ul>
        {sortedBlogs.map((b) => (
          <li key={b.id} className="blog">
            <Link to={`/blogs/${b.id}`}>{b.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default BlogList;
