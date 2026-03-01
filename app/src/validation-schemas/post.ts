import * as yup from "yup";

export const postSchema = yup.object().shape({
  description: yup.string(),
});
