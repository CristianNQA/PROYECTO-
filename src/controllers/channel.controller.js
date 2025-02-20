import Workspace from "../models/Workspace.model.js"
import Channel from "../models/Channel.model.js"
import Message from "../models/Message.model.js"
import ChannelRespository from "../repository/channel.respository.js"
import MessageRepository from "../repository/message.repository.js"

export const createChannelController = async(req, res) => {
    try{
        const {id} = req.user
        const {workspace_id} = req.params
        const {name} = req.body

        const channel_created = await ChannelRespository.createChannel(id, {name, workspace_id})

        const channels = await ChannelRespository.getAllChannelsByWorkspaceId(workspace_id)

        return res.json({
            status: 201,
            ok: true,
            message: 'Channel created successfully',
            data: {
                new_channel: channel_created,
                channels
            }
        })
    }
    catch (error) {
        console.error(error)
        return res.json({
            ok: false,
            status: 500,
            message: 'internal server error'
        })
    }
}


export const getChannelsListController = async (req, res) => {
    try{
        const {id} = req.user
        const {workspace_id} = req.params
        const {workspace_selected} = req
        
        const channels = await ChannelRespository.getAllChannelsByWorkspaceId(workspace_id)

        return res.json({
            ok: true,
            status: 200,
            message: 'Channels List',
            data: {
                channels
            }
        })
    }
    catch (error) {
        console.error(error)
        return res.json({
            ok: false,
            status: 500,
            message: 'internal server error'
        })
    }
}


export const sendMessageController = async (req, res) => {
    try{
        const {channel_id, workspace_id} = req.params
        const {content} = req.body
        const {id} = req.user

        const channel_selected = await ChannelRespository.getChannelById(channel_id)
        if(!channel_selected){
            return res.json({
                ok:false,
                message: 'channel not found',
                status: 404
            })
        }

        //si quiero hacer canales privados se chequea aca, por ahora no lo hago
        
        const new_message = await MessageRepository.createMessage({
            content, 
            sender_user_id: id, 
            channel_id
        })

        return res.json({
            ok: true,
            message: 'was sent succesfully',
            status: 201,
            data: {
                new_message
            }
        })
    }
    catch (error) {
        console.error(error)
        return res.json({
            ok: false,
            status: 500,
            message: 'internal server error'
        })
    }
}   


export const getMessageFromChannelController = async (req, res) => {
    try{
        const {channel_id, workspace_id} = req.params

        const channel_selected = await ChannelRespository.getChannelById(channel_id)
        if(!channel_selected){
            return res.json({
                ok:false,
                message: 'channel not found',
                status: 404
            })
        }

        const messages = await MessageRepository.getAllMessagesFromChannel(channel_id)
        
        return res.json({
            ok: true, 
            status: 200,
            message: 'Messages list',
            data:{
                messages
            }
        })
    }
    catch (error) {
        console.error(error)
        return res.json({
            ok: false,
            status: 500,
            message: 'internal server error'
        })
    }
}