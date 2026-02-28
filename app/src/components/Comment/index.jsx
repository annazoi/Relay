import { Link } from "react-router-dom";
import "./style.css";
import { formatDate } from "../../utils/date";
import Button from "../ui/Button";
import { authStore } from "../../store/auth";
import { VscTrash } from "react-icons/vsc";

const Comments = ({ comments, onClick }) => {
  const { userId } = authStore((store) => store);
  return (
    <div className="comment-container">
      {comments?.map((comment, index) => {
        return (
          <div key={index} className="comment-content">
            <img
              className="photo-comment-content"
              src={comment.creatorId.image}
              alt=""
            />

            <div className="comment-description">
              <text>
                <Link to={`/profile/${comment.creatorId._id}`}>
                  {comment.creatorId.username}
                </Link>{" "}
                {comment.description}
                <h1 style={{ fontSize: "12px" }}>{formatDate(comment.date)}</h1>
              </text>
            </div>
            {comment.creatorId && userId === comment.creatorId._id && (
              <Button
                className="delete-comment"
                label={<VscTrash />}
                onClick={onClick}
              ></Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
