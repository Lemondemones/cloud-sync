import nodemailer from "nodemailer";
import "dotenv/config";

const { SENDER_ADDRESS, RECIPIENT_ADDRESS, EMAIL_CONFIG_PORT, EMAIL_CONFIG_USER, EMAIL_CONFIG_PASS } = process.env;

export async function sendEmailNotification(filePath) {
  const emailConf = {
    host: "smtp.yandex.ru",
    port: EMAIL_CONFIG_PORT,
    secure: true,
    auth: {
      user: EMAIL_CONFIG_USER,
      pass: EMAIL_CONFIG_PASS,
    },
  };
  const transporter = nodemailer.createTransport(emailConf);

  const mailOptions = {
    from: SENDER_ADDRESS,
    to: RECIPIENT_ADDRESS,
    subject: "New File Uploaded",
    text: `A new file has been uploaded: ${filePath}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email notification sent");
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}