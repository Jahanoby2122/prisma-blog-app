import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER!,
    pass: process.env.APP_PASSWORD!,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.APP_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "active",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: '"prisma Blog" <prismablog@gmail.com>',
          to: user.email,
          subject: "Verify your email",
          html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background:#4f46e5; padding:30px;">
              <h1 style="color:#ffffff; margin:0;">
                Prisma Blog
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px; color:#333;">
              <h2 style="margin-top:0;">Verify Your Email</h2>

              <p style="font-size:16px;">
                Hi ${user.name || "User"},
              </p>

              <p style="font-size:16px; line-height:1.6;">
                Thank you for registering. Please confirm your email by clicking the button below.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}" 
                   style="background:#4f46e5; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#666;">
                If the button doesn’t work, copy this link:
              </p>

              <p style="font-size:14px; word-break:break-all;">
                ${verificationUrl}
              </p>

              <p style="font-size:13px; color:#999; margin-top:30px;">
                If you did not create this account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f9fafb; padding:20px; font-size:12px; color:#999;">
              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    },
  },
  // GOOGLE LOGIN
   baseURL: process.env.BETTER_AUTH_URL, 
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});