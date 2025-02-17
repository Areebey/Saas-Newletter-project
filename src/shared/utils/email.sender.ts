// "use server";
// import * as AWS from "aws-sdk";
// import * as nodemailer from "nodemailer";

// interface Props {
//   userEmail: string[];
//   subject: string;
//   content: string;
// }

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_KEY_ID,
//   // process.env.AWS_SDK_LOAD_CONFIG = "1",
//   region: "us-east-1",
// });

// AWS.config.getCredentials(function (error) {
//   if (error) {
//     console.log(error.stack);
//   }
// });

// const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// // const adminMail = "support@becodemy.com";
// const adminMail = "areebrafiq999@gmail.com";

// // Create a transporter of nodemailer
// const transporter = nodemailer.createTransport({
//   SES: ses,
// });

// export const sendEmail = async ({ userEmail, subject, content }: Props) => {
//   try {
//     const response = await transporter.sendMail({
//       from: adminMail,
//       to: userEmail,
//       subject: subject,
//       html: content,
//     });

//     return response;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

"use server";

import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";

interface Props {
  userEmail: string[];
  subject: string;
  content: string;
}

// Initialize AWS SES Client
const sesClient = new SESClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Admin Email (Must be verified in AWS SES)
const adminMail = "areebrafiq999@gmail.com";

// Create Nodemailer Transporter
const transporter = nodemailer.createTransport({
  SES: { ses: sesClient, aws: { SendRawEmailCommand } },
});

export const sendEmail = async ({ userEmail, subject, content }: Props) => {
  try {
    const response = await transporter.sendMail({
      from: adminMail,
      to: userEmail.join(","), // Convert array to comma-separated string
      subject: subject,
      html: content,
    });

    console.log("✅ Email Sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
};
