import express, { request, response } from "express";
import filesystem from "fs";

const loginRouter = express.Router();

/* loginRouter.post('/login', async (request, response) => {
    try{
        const {email, password} = request.body

        //traemos la informacion del json
        const users_info = JSON.parse(await filesystem.promises.readFile(
            './data/users.json', 
            {encoding: 'utf-8'}
        ));

        //validacion de datos 
        //EMAIL
        const emailExists = users_info.users.find(user => user.email === email);
        if (!emailExists) {
            return response.json({
                ok: false,
                status: 404,
                message: 'El email no está registrado'
            });
        }
        //PASSWORD
        const passwordCorrecta = users_info.users.find(user => user.password === password);
        if(!passwordCorrecta){
            return response.json(
                {
                    ok: false,
                    status: 404,
                    message: 'el email seleccionado ya esta en uso'
                }
            )
        }

        response.json(
            {
                ok: true, 
                status: 200, 
                message: 'logged in', 
                data:{
                    user_info: 
                        { 
                            id,
                            name,
                            email
                        }
                }
            }
        )
    }catch(error) {
        console.error(error);
        response.json(
            {
                ok: false,
                status: 500,
                message: 'Server error'
            }
        )
    }
}) */
    
//codigo corregido
    loginRouter.post('/login', async (request, response) => {
        try {
            const { email, password } = request.body;
    
            // Leer la información del archivo JSON
            const usersData = await filesystem.promises.readFile('./data/users.json', 'utf-8');
            const users_info = JSON.parse(usersData);

    
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
                    }
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
    }); 
    

export default loginRouter