import "./style.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/ui/Button";
import { registerSchema } from "../../validation-schemas/auth";
import { useAuthHook } from "../../hooks/authHook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImagePicker from "../../components/ui/ImagePicker";
import Form from "../../components/Form";
import { authStore } from "../../store/auth";

const Register = () => {
  const { logIn } = authStore((store) => store);
  const { registerUser, loading, error, data } = useAuthHook();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      password: "",
      confirmPassword: "",
      image: "",
    },
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    if (!data) return;
    if (data.token) {
      logIn({
        token: data.token,
        userId: data.userId,
      });
      navigate("/home");
    }
  }, [data]);

  const onSubmit = (data) => {
    try {
      registerUser(data);
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleImage = (image) => {
    setValue("image", image);
  };

  // const handleTest = (e) => {
  //   console.log(e.target.name,e.target.vak=lue);
  // };

  return (
    <div className="register-form">
      <h1 style={{ fontWeight: "bold", color: "var(--link-color)" }}>
        Register
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <input placeholder="test" name="test" onChange={handleTest} />
          <input placeholder="test2" name="test2" onChange={handleTest} /> */}
        <Form errors={errors} register={register}></Form>
        <ImagePicker onChange={handleImage} />
        <p>Select Avatar</p>

        {error && (
          <h1
            style={{
              marginTop: "10px",
            }}
          >
            {error}
          </h1>
        )}

        <Button
          type="submit"
          label={loading ? "Loanding" : "Sign Up"}
          style={{ marginTop: "10px" }}
        />
      </form>
    </div>
  );
};

export default Register;
