import "./style.css";
import { useEffect, useState } from "react";
import { usePostHook } from "../../hooks/postHook";
import { useUserHook } from "../../hooks/userHook";
import Profile from "../../components/Profile";
import Posts from "../../components/Posts";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../validation-schemas/auth";
import { useParams } from "react-router-dom";
import ImagePicker from "../../components/ui/ImagePicker";
import Modal from "../../components/Modal";
import Form from "../../components/Form";

const profile = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const params = useParams();
  const { getUser, updateUser, userError, loading } = useUserHook();
  const { getPosts, error } = usePostHook();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    const getSpecificUser = async () => {
      try {
        const user = await getUser(params.creatorId);
        if (user) {
          setUser(user);
          let userData = {
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            image: user.image,
          };
          reset(userData);
        }
      } catch (err) {
        console.log(err, "Could not get User");
      }
    };
    const getAllPosts = async () => {
      const posts = await getPosts(params.creatorId);
      if (posts) {
        setPosts(posts);
      }
    };

    getSpecificUser();
    getAllPosts();
  }, []);

  const handlModal = () => {
    setOpenModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const updatedUser = await updateUser(params.creatorId, data);
      alert("User updated successfully");
    } catch (err) {
      console.log("could not update user", err);
    }
  };

  const handleImage = (image) => {
    setValue("image", image);
  };

  return (
    <>
      {loading ? (
        <Spinner></Spinner>
      ) : userError ? (
        <h1
          style={{
            margin: "0 auto",
            marginTop: "150px",
            textAlign: "center",
          }}>
          {userError}
        </h1>
      ) : (
        <>
          <div className="public-profile">
            <Profile user={user} onClick={handlModal}></Profile>
          </div>{" "}
          {error ? (
            <h1
              style={{
                margin: "0 auto",
                marginTop: "50px",
                textAlign: "center",
              }}>
              {error}
            </h1>
          ) : (
            <Posts posts={posts}></Posts>
          )}
        </>
      )}
      <div className="public-profile">
        <Modal
          isOpen={openModal}
          handlClose={setOpenModal}
          children={
            <form
              className="edit-profile-form"
              onSubmit={handleSubmit(onSubmit)}>
              <Form errors={errors} register={register}></Form>

              <ImagePicker
                value={getValues("image")}
                register={register}
                onChange={handleImage}
              />
              <div className="buttons-container">
                <Button
                  variant="danger"
                  label="Cancel"
                  onClick={() => {
                    {
                      setOpenModal(false);
                    }
                  }}></Button>

                <Button label={loading ? "loading" : "Save"} type="submit" />
              </div>
            </form>
          }></Modal>
      </div>
    </>
  );
};

export default profile;
