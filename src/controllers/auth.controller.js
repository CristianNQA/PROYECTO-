import filesystem from 'fs';
import jwt from "jsonwebtoken";
import ENVIRONMENT from '../config/enviroment.js';
import User from '../models/User.model.js';
import { request } from 'http';
import { sendMail } from '../utils/mail.util.js';
import { response } from 'express';
import bcrypt from 'bcrypt'
import Workspace from '../models/Workspace.model.js';
import UserRepository from '../repository/user.repository.js';



//let objeto = {nombre: "pepe"}
//el token sirve para pasar objetos a string y q esten firmados
//solo el backend sabe la clave en este caso: mi_secret
//const token = jwt.sign(objeto, ENVIRONMENT.SECRET_KEY_JWT)
/* console.log(token) */
//jwt.verify(token, ENVIRONMENT.SECRET_KEY_JWT)
/* try {
    // Firmar el token
    const token = jwt.sign(objeto, ENVIRONMENT.SECRET_KEY_JWT); // Añade expiresIn para seguridad

    console.log("Token generado:", token);

    // Verificar el token
    const decoded = jwt.verify(token, ENVIRONMENT.SECRET_KEY_JWT);

    console.log("Token decodificado:", decoded);
} 
catch (error) {
    console.error("Error con JWT:", error.message);
}  */

const QUERY = {
    VERIFICATION_TOKEN: 'verification_token'
} 

//crear usuario
/* const crearUsuario = async ({username, email, password, verificationToken}) => {
    const nuevo_usuario =new User({
        username,
        email,
        password,
        verificationToken,
        modifiedAt: null
    })
    return nuevo_usuario.save(); // Devuelve el resultado de la operación 
}

//buscar por email
const buscarPorEmail = async (email) => {
    const userFound = await User.findOne({email: email})
    return userFound
} */

export const registerController = async (request, response) => {
    try {
        const { username, email, password } = request.body;
        const user_found = await UserRepository.findUserByEmail(email)
        
        if (user_found) {
            return response.json({
                ok: false,
                status: 400,
                message: 'Usuario con este email ya existe',
            });
        }

        const verificationToken = jwt.sign({email}, ENVIRONMENT.SECRET_KEY_JWT, {
            expiresIn: '1d',
        });

        await sendMail({
            to: email,
            subject: 'Valida tu mail',
            html: `
                <h1>Debes validar tu mail</h1>
                <p>Da click en el enlace de verificacion</p>
                <a href='http://localhost:${ENVIRONMENT.PORT}/api/auth/verify-email?${QUERY.VERIFICATION_TOKEN}=${verificationToken}'>Verificar Email</a>
            `,
        });
        const password_hash = await bcrypt.hash(password, 10)
        const newUser = await UserRepository.createUser({username, email, password: password_hash, verificationToken})
        response.json({
            ok: true,
            status: 201,
            message: 'Usuario registrado exitosamente',
            data: newUser,
        });

    } catch (error) {
        console.error(error);
        response.json({
            ok: false,
            status: 500,
            message: 'Error al registrar',
        });
    }
};

export const verifyEmailController = async (request, response) => {
    try {
        const {[QUERY.VERIFICATION_TOKEN]: verification_token} = request.query
        
        if (!verification_token) {
            return response.redirect(`${ENVIRONMENT.URL_FRONTED}/error?error=REQUEST_EMAIL_VERIFY_TOKEN`)
            
            /* res.send(
                `
                    <h1>Usuario no encontrado</h1>
                    <p>Status: 400</p>
                `
            ) */
        }

        const payload = jwt.verify(verification_token, ENVIRONMENT.SECRET_KEY_JWT)
        const user_to_verify = await UserRepository.findUserByEmail(payload.email)

        if (!user_to_verify) {
            return response.redirect(`${ENVIRONMENT.URL_FRONTED}/error?error=REQUEST_EMAIL_VERIFY_TOKEN`)
        }
        if (user_to_verify.verificationToken !== verification_token) {
            return response.redirect(`${ENVIRONMENT.URL_FRONTED}/error?error=RESEND_VERIFY_TOKEN`)
        }

        await UserRepository.verifyUser(user_to_verify._id)
        return response.redirect(`${ENVIRONMENT.URL_FRONTED}/login?verified=true`)

    } catch (error) {
        console.log(error)
        response.json({
            status: 500,
            message: 'internal server error',
            ok: false
        })
    }
};


/* export const loginController = async (request, response) => {
    try {
        const { email, password } = request.body;

        // Leer la información del archivo JSON de manera asíncrona
        const data = await filesystem.promises.readFile('./data/users.json', { encoding: 'utf-8' });
        const users_info = JSON.parse(data);

        // Validación del email
        const user = users_info.users.find(user => user.email === email);
        if (!user) {
            return response.status(404).json({
                ok: false,
                status: 404,
                message: 'El email no está registrado'
            });
        }

        // Validación de la contraseña
        if (user.password !== password) {
            return response.status(401).json({
                ok: false,
                status: 401,
                message: 'La contraseña es incorrecta'
            });
        }

        //para transformarlo en un token
        const user_info = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        const access_token = jwt.sign(user_info, ENVIRONMENT.SECRET_KEY_JWT)

        // Responder con éxito
        response.status(200).json({
            ok: true,
            status: 200,
            message: 'Inicio de sesión exitoso',
            data: {
                user_info: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                access_token
            }
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            ok: false,
            status: 500,
            message: 'Error del servidor'
        });
    }
}; */
export const loginController = async (request, response) => {
    try {
        const { email, password } = request.body;
        const errors = {
            email: null,
            password: null,
        };

        if (!email || !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email))) {
            errors.email = "You must enter a valid value for email";
        }

        if (!password) {
            errors.password = "You must enter a password";
        }

        let hayErrores = false;
        for (let error in errors) {
            if (errors[error]) {
                hayErrores = true;
            }
        }

        if (hayErrores) {
            return response.json({
                message: "Errors exist!",
                ok: false,
                status: 400, //bad request
                errors: errors,
            });
        }

        const user_found = await UserRepository.findUserByEmail(email)

        if (!user_found) {
            return response.json({
                ok: false,
                status: 404,
                message: "there is no user with this email",
            });
        }
        const is_same_password = await bcrypt.compare(password, user_found.password)
        if (!is_same_password) {
            return response.json({
                ok: false,
                status: 400,
                message: 'wrong password'
            })
        }

        //transformar el user a un token
        const user_info = {
            id: user_found._id,
            name: user_found.username,
            email: user_found.email
        }

        const access_token = jwt.sign(user_info, ENVIRONMENT.SECRET_KEY_JWT)

        return response.json({
            ok: true,
            status: 200,
            message: 'Logged In',
            data: {
                user_info: {
                    id: user_found._id,
                    name: user_found.username,
                    email: user_found.email
                },
                access_token: access_token
            }
        })
    } 
    catch (error) {
        console.error(error)
        return response.json({
            ok: false,
            status: 500,
            message: 'Error al loguearse'
        })
    }
}

export const forgotPasswordController = async (req,res) => {
    try{
        const {email} = req.body
        const user_found = await UserRepository.findUserByEmail(email)
        if(!user_found){
            return res.json({
                ok: false,
                status: 404,
                message: 'user not found'
            })
        }
        else{
            const reset_token = jwt.sign({email}, ENVIRONMENT.SECRET_KEY_JWT, {expiresIn: '1d'})
            const reset_url = `${ENVIRONMENT.URL_FRONTED}/reset-password?reset_token=${reset_token}`
            await sendMail({
                to: email,
                subject: 'Restablecer contraseña',
                html: `
                    <h1>Restablecer contraseña</h1>
                    <p>Haz click en el enlace de abajo para restablecer tu contraseña</p>
                    <a href='${reset_url}'>restablecer contraseña</a>
                `
            })
            return res.json({
                ok: true,
            status: 200,
            message: 'Email sent'
            })
        }
    }
    catch (error) {
        console.error(error)
        return response.json({
            ok: false,
            status: 500,
            message: 'Error al loguearse'
        })
    }
}

export const resetPasswordController = async (req, res) => {
    try{
        const {reset_token} = req.query
        const {password} = req.body

        const {email} = jwt.verify(reset_token, ENVIRONMENT.SECRET_KEY_JWT)
        const user_found = await UserRepository.findUserByEmail(email)
        const password_hash = await bcrypt.hash(password, 10)
        user_found.password = password_hash
        await user_found.save()
        return res.json({
            ok: true,
            status: 200,
            message: 'password changed'
        })
    }
    catch (error) {
        console.error(error)
        return response.json({
            ok: false,
            status: 500,
            message: 'Error al loguearse'
        })
    }
}

