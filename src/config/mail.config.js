import nodemailer from "nodemailer";
import ENVIRONMENT from "./enviroment.js";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: ENVIRONMENT.EMAIL_USERNAME,
        pass: ENVIRONMENT.EMAIL_PASSWORD
    }
})

export default transporter