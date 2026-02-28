import "./style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { usePostHook } from "../../hooks/postHook";
import { authStore } from "../../store/auth";
import { commentSchema } from "../../validation-schemas/comment";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import Comments from "../../components/Comment";
import Post from "../../components/Posts/Post";
import Spinner from "../../components/ui/Spinner";

const post = () => {
  const { isLoggedIn, userId } = authStore((store) => store);
  const { getPost, deletePost, createComment, error, loading } = usePostHook();
  const [post, setPost] = useState({});
  const navigate = useNavigate();
  const params = useParams();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      description: "",
    },
    resolver: yupResolver(commentSchema),
  });

  const specificPost = async () => {
    try {
      const post = await getPost(params.postId);
      if (post) {
        setPost(post);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    specificPost();
  }, []);

  const removePost = async () => {
    if (post.creatorId && userId === post.creatorId._id) {
      const response = await deletePost(post._id);
      if (response.deleted) {
        navigate("/home");
      }
    } else {
      alert("delete only your post");
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isLoggedIn) {
        await createComment(data, post._id);
        specificPost();
      } else {
        alert("Connect first");
      }
    } catch (err) {
      console.log("Could not create comment");
    }
  };

  const removedComment = () => {};

  return (
    <>
      <div className="specificPost-container">
        {loading ? (
          <Spinner loading={loading}></Spinner>
        ) : error ? (
          <h1
            style={{
              margin: "0 auto",
              marginTop: "150px",
              textAlign: "center",
            }}
          >
            {error}
          </h1>
        ) : (
          <>
            {" "}
            <Post post={post} onClick={removePost}></Post>
            {!isLoggedIn && (
              <>
                <h1>Please connect first to comment</h1>
                <h1 style={{ fontWeight: "bold" }}>
                  <Link to="/login">Login</Link>
                </h1>
              </>
            )}
            <Comments comments={post.comments} />
          </>
        )}
        {!error && (
          <form className="create-comment" onSubmit={handleSubmit(onSubmit)}>
            <Textarea
              name="description"
              placeholder="Create a comment for this post"
              register={register}
            />
            <Button
              type="submit"
              label={loading ? "Loading " : "Comment"}
              onClick={onSubmit}
            />
          </form>
        )}
      </div>
    </>
  );
};

export default post;
