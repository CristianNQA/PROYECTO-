import pool from "../config/mysql.config.js"
import User from "../models/User.model.js"

class UserRepository {
    /* MONGO_DB
    
    async createUser (username, email, password, verificationToken){
        const nuevo_usuario =new User({
            username,
            email,
            password,
            verificationToken,
            modifiedAt: null
        })
        return await nuevo_usuario.save()

    async findUserByEmail(email){
        return await User.findOne({email: email})
    }

    async findById(id){
        return await User.findById(id)
    }

    async verifyUser(user_id){
        const user = await this.findById(user_id)
        user.verified = true
        user.save()
    }
    } */
    
    //MYSQL 
    async createUser ({username, email, password, verificationToken}){
        const queryString = `
        INSERT INTO USERS (username, email, password, verificationToken) VALUES (?, ?, ?, ?)
        `
        //pool.execute devuelve un array[result,fields]
        //result es la respuesta de la consulta
        //fields es un array de objetos con los campos de la tabla
        const [result] = await pool.execute(
            queryString,
            [username, email, password, verificationToken]//solo se pasa si hay signos de preguntas en queryString
        )
        return {
            _id: result.insertId,
            username,
            email
        }
    }
    
    async findUserByEmail(email){
        const queryStr = `SELECT * FROM USERS WHERE email = ?`
        const [result] = await pool.execute(queryStr, [email])
        return result[0] || null
    }

    async findById(id){
        const queryStr = `SELECT * FROM USERS WHERE id = ?`
        const [result] = await pool.execute(queryStr, [id])
        return result[0] || null
    }

    async verifyUser(user_id){
        const queryStr = `
        UPDATE USERS
        SET verified = 1
        WHERE _id = ?
        `
        const [result] = await pool.execute(queryStr, [user_id])
    }
}

export default new UserRepository()