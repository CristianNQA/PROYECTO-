import User from '../models/User.model.js'
import Workspace from '../models/Workspace.model.js'
import WorkspaceRepository from '../repository/workspaces.repository.js'
import UserRespository from '../repository/user.repository.js'
import { ServerError } from '../utils/errors.util.js'


export const createWorkspaceController = async (req, res) => {
    try{
        const {name} = req.body
        const {id} = req.user
        const new_workspace = await WorkspaceRepository.createWorkspace(
            {
                name, 
                id
            }
        )

        res.json({
            ok:true,
            message: 'workspace created',
            status: 201,
            data: {
                new_workspace
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


export const inviteUserToWorkspaceController = async(req, res) => {
    try{
        const {id} = req.user
        const {workspace_id} = req.params
        const {email} = req.body

        
        const user_invited = await UserRespository.findUserByEmail(email)
        if(!user_invited){
            throw new ServerError('user not found', 404)
        }

        const workspace_modified = await WorkspaceRepository.addMemberToWorkspace(workspace_id, user_invited._id)

        return res.json(
            {
                status: 201,
                message: 'user invited successfully',
                data: {
                    workspace_selected: workspace_modified
                }
            }
        )
    }
    catch (error) {
        console.error(error)
        if(error.status){
            return res.json({
                ok: false,
                message: error.message,
                status: error.status
            })
        }
        return res.json({
            ok: false,
            status: 500,
            message: 'Internal server error'
        })
    }
}


export const getWorkspacesController = async (req, res) => {
    try{
        const {id} = req.user
        const workspaces = await WorkspaceRepository.getAllWorkspacesByMemberId(id)

        res.json({
            status: 200, 
            ok: true,
            data: {
                workspaces
            }
        })
    }
    catch (error) {
        console.error(error)
        return res.json({
            ok: false,
            status: 500,
            message: 'Internal server error'
        })
    }
}
