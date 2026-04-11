import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.log("🔴 Resend api key is not available");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ sendTo, subject, html }) => {
  if (!sendTo || !subject || !html) {
    throw new Error("🔴 Missing email parameters ");
  }
  try {
    const { data, error } = await resend.emails.send({
      from: "Campus Mart <onboarding@resend.dev>",
      to: sendTo,
      subject: subject,
      html: html,
    });

    if (error) {
      return console.error({ error });
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};
export default sendEmail;
