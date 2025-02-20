import express, { request, response } from "express"
import jwt from "jsonwebtoken";
import ENVIRONMENT from "../config/enviroment.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { midlewareDePrueba } from "../middlewares/luck.middleware.js";
const statusRoute = express.Router()

statusRoute.get('/ping', (request, response) => {
    response.json({
        status: 200,
        ok: true,
        message: 'Pong'
    })
})

//imaginemos que esta operacion solo la puede hacer alguien logueado
statusRoute.get('/protected/ping', midlewareDePrueba, authMiddleware,  (request, response) => {
    try{
        /* const access_token = request.headers.authorization.split(' ')[1];
        
        //aparte de verificar tambien transformamos el token en objeto nuevamente
        const user_info = jwt.verify(access_token, ENVIRONMENT.SECRET_KEY_JWT); //para verificar el token
        console.log(user_info);
        request.headers.user = user_info; */
        /* console.log(request.headers.user) */
        
        response.sendStatus(200)
    } catch(error) {
        console.error(error)
        response.json(
            {
                ok: false,
                status: 401,
                message: 'Unauthorized'
            }
        )
    }
})

/* statusRoute.get('/datos_bancarios', (request, response) => {
    try{

    } catch (error){

    }
}) */

export default statusRoute

