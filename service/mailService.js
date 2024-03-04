import nodemailer from "nodemailer";
import "dotenv/config";

const { SENDER_ADDRESS, RECIPIENT_ADDRESS, EMAIL_CONFIG_PORT, EMAIL_CONFIG_USER, EMAIL_CONFIG_PASS } = process.env;

export async function sendEmailNotification(user, files) {
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
    subject: `Уведомление о загрузке файла пользователем ${user}`,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            h1 {
                font-size: 24px;
            }
            ul {
                font-size: 18px;
                list-style-type: none;
                padding: 0;
                margin: 0;
            }
            li {
                margin-bottom: 10px;
            }
            a {
                color: #007bff;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <h1>Пользователь ${user} загрузил файлы</h1>
        <p>Список файлов:</p>
        <ul>
        ${files
          .map((filePath) => {
            return `<li><a href="${filePath.replace("/mnt", "D:\\УРОиСОК")}">${filePath.replace(
              "/mnt",
              "D:\\УРОиСОК"
            )}</a></li>`;
          })
          .join("")}
        </ul>
    </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email notification sent");
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}
