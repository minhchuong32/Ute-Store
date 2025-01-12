import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.RESEND_API) {
    console.log("Vui lòng cung cấp chuỗi kết nối Resend");
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "UteStore <onboarding@resend.dev>",
            to: sendTo,
            subject: subject,
            html: html,
        });
        if (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
};

export default sendEmail;