import * as yup from "yup";

export const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

export const registerSchema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    bio: yup.string(),
    image: yup.string(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), undefined])
        .required("invalid password"),
});
