import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().required(),

  password: yup.string().required(),
});

export const registerSchema = yup.object().shape({
  name: yup.string().required(),
  surname: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null])
    .required("invalid password"),
});
