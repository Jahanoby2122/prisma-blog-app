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
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "active",
                required: false
            }

        }

    },
    emailAndPassword: { 
    enabled: true, 
    autoSignIn: false,
    requireEmailVerification: true
  }, 
 emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      console.log("Send verification email to:", user.email);
      const info = await transporter.sendMail({
    from: '"prisma Blog" <prismablog@gmail.com>',
    to: "kmeraz059@gmail.com", // list of receivers
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
    html: "<b>Hello world?</b>", // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
    },
  },
});