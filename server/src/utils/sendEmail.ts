import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const missing = ["EMAIL_HOST", "EMAIL_USER", "EMAIL_PASS", "EMAIL_FROM"]
    .filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Email delivery is not configured: ${missing.join(", ")}`);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SkillTrack" <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

