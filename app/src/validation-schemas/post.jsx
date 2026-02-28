import * as yup from "yup";

export const postSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
});
