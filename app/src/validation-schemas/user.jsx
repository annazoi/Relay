import * as yup from "yup";

export const userSchema = yup.object().shape({
  name: yup.string().required(),
  surname: yup.string().required(),
  username: yup.string().required(),
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null])
    .required("invalid password"),
});
