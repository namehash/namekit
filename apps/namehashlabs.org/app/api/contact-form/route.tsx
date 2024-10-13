import {
  contactFormSchema,
  ContactFormDataProps,
} from "@namehash/internal/src/contact-form";
import { host } from "@/lib/shared/origin";
import { type NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const validationError = await validateFormData(formData);

    if (validationError) {
      // Handle the validation error

      return NextResponse.json(
        { error: validationError.errors },
        { status: 400 },
      );
    }

    const formattedData = buildSlackWebhookRequest(formData);

    // Send the data to slack
    const destinationResponse = await sendToSlackWebhook(formattedData);

    // Check if the response from the service is successful
    if (destinationResponse.ok) {
      return NextResponse.json(
        { error: "Form data sent successfully" },
        { status: 200 },
      );
    } else {
      // Handle any errors from the destination service
      return NextResponse.json(
        { error: "Error sending form data to the destination service" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 },
    );
  }
}

// Validation function
async function validateFormData(
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

async function sendToSlackWebhook(data: any) {
  const slackWebhookUrl = process.env.CONTACT_FORM_SUBMISSION_SLACK_WEBHOOK;

  // Check if the environment variable is defined
  if (!slackWebhookUrl) {
    throw new Error(
      "The FORM_SUBMISSION_SLACK_WEBHOOK environment variable is not defined.",
    );
  }

  return await fetch(slackWebhookUrl, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
    },
    body: JSON.stringify(data),
  });
}

const buildSlackWebhookRequest = (data: ContactFormDataProps) => {
  const nameDisplay = `*Name*: ${data.name}`;
  const emailDisplay = `*Email*: ${data.email}`;
  const telegramDisplay = `*Telegram*: ${data.telegram}`;
  const messageDisplay = `*Message*: ${data.message}`;
  const sourceDisplay = `:memo: New message from frontend: ${data.source} forwarded by backend: ${host}`;

  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: sourceDisplay,
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: nameDisplay,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: emailDisplay,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: telegramDisplay,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: messageDisplay,
        },
      },
    ],
  };
};
