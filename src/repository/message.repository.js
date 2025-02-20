import pool from "../config/mysql.config.js"
import Message from "../models/Message.model.js"

class MessageRepository {
    /* MONGO DB
    async createMessage ({content, sender_user_id, channel_id}){
        return await Message.create({
            content,
            sender: sender_user_id,
            channel: channel_id
        })
    }

    async getAllMessagesFromChannel (channel_id){
        return await Message.find({channel:channel_id})
        .populate('sender', 'username')
    }
     */
    async createMessage ({content, sender_user_id, channel_id}){
        const query = `
        INSERT INTO messages(content, sender, channel)
        VALUES(?,?,?)
        `
        const [result] = await pool.execute(query, [content, sender_user_id, channel_id])
        return {
            _id: result.insertId,
            content,
            channel: channel_id
        }
    }

    async getAllMessagesFromChannel (channel_id){
        const query = `
        SELECT 
        messages._id,
        messages.content,
        messages.createdAt,
        USERS.username AS sender_username
        FROM messages 
        JOIN USERS ON messages.sender = USERS._id
        WHERE messages.channel = ?
        ORDER BY messages.createdAt ASC
        `
        const [messages] = await pool.execute(query, [channel_id])
        const messagesAdapted = messages.map(message=> {
            return {
            _id: message._id,
            content: message.content,
            createdAt: message.createdAt,
            sender: {
                username: message.sender_username
            }
            }
        })
        return messagesAdapted
    }
}

export default new MessageRepository()