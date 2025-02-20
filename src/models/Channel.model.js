import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    workspaces: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

const Channel = mongoose.model("Channel", ChannelSchema)

export default Channel