import express from "express";
import ENVIRONMENT from "./config/enviroment.js";
import mongoose from "./config/mongoDB.config.js";
import User from './models/User.model.js';
import { registerController, verifyEmailController } from "./controllers/auth.controller.js";
import cors from 'cors'
import channelRouter from "./routes/channel.routes.js";

const app = express()
const PORT = ENVIRONMENT.PORT 

//cross origin resource sharing. En los middlewares es muy importante el orden 
app.use(cors({
    origin: ENVIRONMENT.URL_FRONTED
})
) 
app.use(express.json())//es un middleware a nivel de aplicacion
app.use(express.urlencoded({ extended: true }));

import statusRoute from "./routes/status.route.js";
app.use('/api/status', statusRoute)//delegamos el flujo de consultas a /api/status al enrutador de status

import authRouter from './routes/auth.routes.js'
import workspaceRouter from "./routes/workspace.route.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
app.use('/api/auth', authRouter);    

app.use('/api/workspace', workspaceRouter) 

app.use('/api/channel', channelRouter)

//devuelve info del usuario
app.get('/api/profile', authMiddleware ,async (req, res) => {})

app.listen(PORT, () => {
    console.log(`el servidor se ejecuta en puerto: ${PORT}`)
})



//LOGIN 
//recibe un body q es un objeto con solamente el email y password
//verificar si exisye dicho usuario
//si la app falla por error x debe llegar a postman un server error
//verificar q la contraseña sea correcta
//si todo esta bien debe responder con la informacion del usuario {ok: true, status: 200, message: 'logged in', data: {user_info: { id, name, email}}}

//asi funciona el envio de mail con parametros
/* sendMail({
    to: 'nahuelallegranzi@gmail.com', 
    subject: 'prueba',
    html: `<h1>Prueba envio de mail</h1>` 
})  */
