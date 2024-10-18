import * as Yup from "yup";
import { ContactFormDataProps } from "./types";

// Validation function
export async function validateContactFormData(
  data: ContactFormDataProps,
): Promise<Yup.ValidationError | null> {
  try {
    await contactFormSchema.validate(data, { abortEarly: false });
    return null; // No errors, return null
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return error; // Return the validation error
    }
    throw error; // Rethrow other types of errors
  }
}

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
