import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
                ref: 'Channel',
                required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
    modifiedAt: {
        type: Date
    }
})

const Message = mongoose.model("Message", MessageSchema)

export default Message