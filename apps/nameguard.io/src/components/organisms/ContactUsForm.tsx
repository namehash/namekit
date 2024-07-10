"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useEffect, useState } from "react";
import { CheckIcon, XCircleIcon } from "@heroicons/react/24/solid";
import cc from "classcat";

import * as Yup from "yup";
import { contactFormSchema } from "@/lib/schemas/contactFormSchema";
import { ContactFormDataProps } from "@/types/contactFormDataProps";

enum FormFields {
  Name = "name",
  Email = "email",
  Telegram = "telegram",
  Message = "message",
  Source = "source",
}

const validationErrorsInitialState = {
  [FormFields.Name]: "",
  [FormFields.Email]: "",
  [FormFields.Telegram]: "",
  [FormFields.Message]: "",
  [FormFields.Source]: "",
};

interface ValidationErrors {
  [key: string]: string;
}

interface ContactUsFormProps {
  title: string;
}

export const ContactUsForm = ({ title }: ContactUsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successfulFormSubmit, setSuccessfulFormSubmit] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    validationErrorsInitialState,
  );

  const submitForm = async (e: FormEvent) => {
    setErrorMessage("");
    e.preventDefault();
    setIsLoading(true);

    const formData: FormData = new FormData(e.target as HTMLFormElement);

    const data: ContactFormDataProps = {
      name: formData.get(FormFields.Name)?.toString().trim() || "",
      email: formData.get(FormFields.Email)?.toString().trim() || "",
      telegram: formData.get(FormFields.Telegram)?.toString().trim() || "",
      message: formData.get(FormFields.Message)?.toString().trim() || "",
      source: formData.get("source")?.toString().trim() || "",
    };

    try {
      // Validate form data against the schema
      await contactFormSchema.validate(data, { abortEarly: false });
      setValidationErrors(validationErrorsInitialState); // Reset validation errors on successful validation

      // Proceed with form submission if validation is successful
      await sendData(data);
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        const errors: ValidationErrors = {
          [FormFields.Name]: "",
          [FormFields.Email]: "",
          [FormFields.Telegram]: "",
          [FormFields.Message]: "",
        };

        for (const err of validationError.inner) {
          if (
            err.path &&
            Object.values(FormFields).includes(err.path as FormFields)
          ) {
            errors[err.path as FormFields] = err.message;
          }
        }

        setErrorMessage(
          "One or more fields have an error. Please check and try again.",
        );
        setValidationErrors(errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendData = async (data: ContactFormDataProps) => {
    const apiUrl =
      process.env.NEXT_PUBLIC_CONTACT_FORM_API_URL || "/api/contact-form";

    const fetchPromise = fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // 10 seconds timeout limit
    const timeoutLimit = 10000;

    const timeoutPromise = new Promise<Response>((resolve, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            "It seems your request is taking longer than usual. Please try again later.",
          ),
        );
      }, timeoutLimit);
    });

    try {
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new Error(
          "There was a server error trying to send a message. Please try again later.",
        );
      }

      setSuccessfulFormSubmit(true);
    } catch (error) {
      if (error instanceof TypeError) {
        // Likely a network error
        console.error("Network error: ", error);
        setErrorMessage(
          "Connection lost. Please check your connection and try again.",
        );
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    setValidationErrors({ ...validationErrors, [name]: "" });
    setErrorMessage("");
  };

  useEffect(() => {
    const sourceInput = document.getElementById("source") as HTMLInputElement;
    if (sourceInput) {
      sourceInput.value = window.location.href;
    }
  });

  return (
    <form onSubmit={submitForm} className="h-full w-full" noValidate>
      <div className="mx-auto lg:mr-0 gap-y-5 w-full h-full gap-5 flex flex-col relative">
        <div>
          <h3 className="text-2xl font-semibold">{title}</h3>
        </div>

        <div
          className={cc([
            "w-full h-full flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
            successfulFormSubmit ? "opacity-100" : "opacity-0 z-[-1]",
          ])}
        >
          <div className="p-3 bg-green-100 rounded-full mb-6">
            <CheckIcon className="text-green-400 w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">Your message was sent</p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            We have received your message and will get back to you soon.
          </p>
          <button
            onClick={() => {
              setSuccessfulFormSubmit(false);
            }}
            type="reset"
            className="mt-5 bg-black hover:bg-gray-800 transition-colors duration-200 px-4 py-2 rounded-md shadow-sm text-white text-sm font-medium"
          >
            Send another message
          </button>
        </div>

        <div
          className={cc([
            "transition-all duration-300",
            successfulFormSubmit ? "opacity-0 z-[-1]" : "opacity-100",
          ])}
        >
          <div
            className={`mx-auto lg:mr-0 gap-y-5 w-full h-full gap-5 flex flex-col relative`}
          >
            {errorMessage && (
              <span className="flex space-x-3 items-center p-4 rounded-md border border-red-100 bg-red-50">
                <div className="w-5">
                  <XCircleIcon className="text-red-400 h-5 w-5" />
                </div>

                <p className="text-red-800 font-medium text-sm">
                  {errorMessage}
                </p>
              </span>
            )}

            <div className="gap-1">
              <label
                htmlFor="name"
                className="block text-sm leading-5 font-medium text-gray-500"
              >
                Name
              </label>
              <div className="w-full">
                <input
                  id="name"
                  type="text"
                  disabled={isLoading}
                  name={FormFields.Name}
                  autoComplete="off"
                  onChange={handleInputChange}
                  className={cc([
                    "block w-full rounded-md px-3.5 py-2 text-gray-900 shadow-sm border border-gray-300 placeholder:text-gray-400 focus:border-gray-600 hover:border-gray-400 outline-none sm:text-sm sm:leading-6",
                    {
                      "border-red-300": validationErrors[FormFields.Name],
                    },
                  ])}
                />
              </div>

              {validationErrors[FormFields.Name] && (
                <span className="mt-2 text-sm font-normal text-red-600">
                  {validationErrors[FormFields.Name]}
                </span>
              )}
            </div>
            <div className="gap-1">
              <label
                htmlFor="email"
                className="block text-sm leading-5 font-medium text-gray-500"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                disabled={isLoading}
                onChange={handleInputChange}
                autoComplete="off"
                name={FormFields.Email}
                className={cc([
                  "block w-full rounded-md px-3.5 py-2 text-gray-900 shadow-sm border focus:border-gray-600 hover:border-gray-400 border-gray-300 placeholder:text-gray-400 outline-none sm:text-sm sm:leading-6",
                  {
                    "border-red-300": validationErrors[FormFields.Email],
                  },
                ])}
              />
              {validationErrors[FormFields.Email] && (
                <span className="mt-2 text-sm font-normal text-red-600">
                  {validationErrors[FormFields.Email]}
                </span>
              )}
            </div>
            <div className="gap-1">
              <label
                htmlFor="telegram"
                className="block text-sm leading-5 font-medium text-gray-500"
              >
                Telegram (optional)
              </label>
              <div className="relative">
                <span className="text-sm leading-5 font-medium text-gray-500 absolute left-2 top-2.5">
                  @
                </span>
                <input
                  type="text"
                  id="telegram"
                  autoComplete="off"
                  disabled={isLoading}
                  onChange={handleInputChange}
                  name={FormFields.Telegram}
                  className={cc([
                    "block w-full rounded-md pr-3.5 pl-6 py-2 text-gray-900 shadow-sm border border-gray-300 placeholder:text-gray-400 focus:border-gray-600 hover:border-gray-400 outline-none sm:text-sm sm:leading-6",
                    {
                      "border-red-300": validationErrors[FormFields.Telegram],
                    },
                  ])}
                />
                {validationErrors[FormFields.Telegram] && (
                  <span className="mt-2 text-sm font-normal text-red-600">
                    {validationErrors[FormFields.Telegram]}
                  </span>
                )}
              </div>
            </div>
            <div className="gap-1">
              <label
                htmlFor="message"
                className="block text-sm leading-5 font-medium text-gray-500"
              >
                Message
              </label>
              <textarea
                rows={4}
                id="message"
                disabled={isLoading}
                onChange={handleInputChange}
                defaultValue=""
                name={FormFields.Message}
                className={cc([
                  "block w-full rounded-md px-3.5 py-2 text-gray-900 shadow-sm border border-gray-300 placeholder:text-gray-400 focus:border-gray-600 hover:border-gray-400 outline-none sm:text-sm sm:leading-6",
                  {
                    "border-red-300": validationErrors[FormFields.Message],
                  },
                ])}
              />

              {validationErrors[FormFields.Message] && (
                <span className="mt-2 text-sm font-normal text-red-600">
                  {validationErrors[FormFields.Message]}
                </span>
              )}
            </div>
            <input type="hidden" id="source" name="source" value="" />
            <div className="flex h-full justify-end items-end">
              <button
                disabled={isLoading}
                type="submit"
                className={cc([
                  `rounded-lg px-4 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-gray-800 w-full lg:w-auto duration-300 transition-all bg-black`,
                  isLoading && "opacity-50",
                ])}
              >
                {isLoading ? "Sending..." : "Send message"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
