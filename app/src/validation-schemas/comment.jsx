import * as yup from "yup";

export const commentSchema = yup.object().shape({
  description: yup.string().required(),
});
