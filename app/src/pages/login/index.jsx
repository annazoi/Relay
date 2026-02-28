import "./style.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { loginSchema } from "../../validation-schemas/auth";
import { useAuthHook } from "../../hooks/authHook";
import { useEffect } from "react";
import { authStore } from "../../store/auth";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { logIn, isLoggedIn } = authStore((store) => store);

  const { loginUser, loading, error, data } = useAuthHook();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
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
      loginUser(data);
    } catch (err) {
      console.log("Could not login");
    }
  };

  return (
    <div className="login-form">
      <h1 style={{ fontWeight: "bold", color: "var(--link-color)" }}>
        Sign In
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name="email"
          type="text"
          placeholder="Email"
          register={register}
          error={errors.email?.message}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          register={register}
          error={errors.password?.message}
        />
        {error && <p className="error-container">{error}</p>}

        <Button
          className="login-button"
          type="submit"
          label={loading ? "Loading" : "Sign In"}
        />
      </form>
      {!isLoggedIn && (
        <>
          <h1 style={{ marginBottom: "20px" }}>You don't have account;</h1>
          <h1>
            {" "}
            <Link to="/register">Register</Link>
          </h1>
        </>
      )}
    </div>
  );
};

export default Login;
