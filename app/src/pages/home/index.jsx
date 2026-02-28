import Button from "../../components/ui/Button";
import "./style.css";
import { useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import { usePostHook } from "../../hooks/postHook";
import { useEffect, useState } from "react";
import { postSchema } from "../../validation-schemas/post";
import { yupResolver } from "@hookform/resolvers/yup";
import Textarea from "../../components/ui/Textarea";
import { authStore } from "../../store/auth";
import Posts from "../../components/Posts";
import Search from "../../components/Search";
import Spinner from "../../components/ui/Spinner";
import { Link } from "react-router-dom";
const Home = () => {
  const { isLoggedIn } = authStore((store) => store);

  const { createPost, getPosts, loading, error } = usePostHook();

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: yupResolver(postSchema),
  });

  const getAllPosts = async () => {
    try {
      const posts = await getPosts();
      if (posts) {
        setPosts(posts);
        setFilteredPosts(posts);
      }
    } catch (err) {
      return {
        message: "Could not get Posts",
        data: null,
      };
    }
  };

  const handleFilterChange = (event) => {
    setFilteredPosts(
      posts.filter((post) => {
        return post.title.includes(event.target.value);
      })
    );
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (isLoggedIn) {
        const res = await createPost(data);
        if (res.message === "OK") {
          getAllPosts();
        }
      } else return alert("connect first");
    } catch (err) {
      alert("Could not create post. Please try later");
    }
  };
  return (
    <>
      <form className="create-post-form" onSubmit={handleSubmit(onSubmit)}>
        <h1 style={{ fontWeight: "bold", color: "var(--link-color)" }}>
          Start a forum with a new post
        </h1>
        <Input
          name="title"
          type="text"
          placeholder="Title"
          register={register}
        />
        <Textarea
          name="description"
          type="text"
          placeholder="Share a Thought"
          register={register}
        />
        <Button
          className="create-post-button"
          type="submit"
          label={loading && posts.length > 0 ? "Loading" : "Post"}
        />
        {!isLoggedIn && (
          <>
            <h1>You don't have account;</h1>
            <h1>
              {" "}
              <Link to="/register">Register</Link>
            </h1>
          </>
        )}
      </form>

      <Search onChange={handleFilterChange}></Search>
      {loading ? (
        <Spinner loading={loading}></Spinner>
      ) : error ? (
        <h1
          style={{
            margin: "0 auto",
            marginTop: "50px",
            marginBottom: "100px",
            textAlign: "center",
          }}
        >
          {error}
        </h1>
      ) : (
        <Posts posts={filteredPosts} to={"/posts"} />
      )}
    </>
  );
};

export default Home;
