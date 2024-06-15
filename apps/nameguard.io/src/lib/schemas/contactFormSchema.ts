import * as Yup from "yup";

export const contactFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  telegram: Yup.string()
    .matches(/^$|^[A-Za-z0-9_]+$/, "Invalid Telegram username")
    .optional(),
  message: Yup.string().required("Message is required"),
});
