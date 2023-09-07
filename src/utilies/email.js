import { createTransport } from "nodemailer";

export const sendeMail = async ({ from, to, subject, html, attachments }) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  // send mail with defined transport object
  return await transporter.sendMail({
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
    attachments,
  });
};
