import "./style.css";
import { Link } from "react-router-dom";

const Posts = ({ posts }) => {
  return (
    <div className="post-container">
      {posts.map((post, index) => {
        return (
          <Link key={index} className="post-content" to={`/post/${post._id}`}>
            {post.title}
            <text
              style={{
                color: "white",
                letterSpacing: "3px",
                marginTop: "10px",
                textTransform: "uppercase",
              }}
            >
              {" "}
              Your Story
            </text>
          </Link>
        );
      })}
    </div>
  );
};

export default Posts;
