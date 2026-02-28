import "./style.css";
import { authStore } from "../../../store/auth";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import { formatDate } from "../../../utils/date";
import { VscTrash } from "react-icons/vsc";

const Post = ({ post, onClick }) => {
  const { userId } = authStore((store) => store);

  return (
    <div className="specificPost-content">
      <div className="post-base-md">
        <text
          style={{
            fontSize: "12px",
            color: "white",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "4px",
          }}
        >
          Your Story
        </text>
        <text className="post-title-base-md">{post.title}</text>
        <text>{post.description}</text>
      </div>
      {post.creatorId && userId === post.creatorId._id && (
        <Button
          style={{ fontSize: "20px" }}
          label={<VscTrash />}
          onClick={onClick}
        ></Button>
      )}
      <span>
        <h1
          style={{
            marginTop: "10px",
          }}
        >
          Story By:{" "}
          <Link to={`/profile/${post?.creatorId?._id}`}>
            {post?.creatorId?.username}
          </Link>
        </h1>
      </span>
      <text
        style={{
          fontSize: "12px",
          color: "var(--link-color)",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "4px",
        }}
      >
        Date: {formatDate(post?.date)}
      </text>
    </div>
  );
};

export default Post;
