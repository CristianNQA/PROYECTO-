import ENVIRONMENT from "../config/enviroment.js";
import transporter from "../config/mail.config.js";

export const sendMail = async ({to, subject, html}) => {
    try{
        const data = await transporter.sendMail(
            { 
                from: ENVIRONMENT.EMAIL_USERNAME,
                to,
                subject,
                html
            } 
        )
        return data
    }
    catch (error){
        console.error(' al enviar mail:', error)
    }
}