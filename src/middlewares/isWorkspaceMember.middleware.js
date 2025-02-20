import Workspace from "../models/Workspace.model.js"
import WorkspacesRepository from "../repository/workspaces.repository.js"


const isWorkspaceMemberMiddleware = async (req, res, next) => {
    try{
        const {id} =req.user
        const {workspace_id} = req.params
        const workspace_selected = await WorkspacesRepository.findWorkspaceById(workspace_id)
        if(!workspace_selected){
            return res.json({
                status: 404,
                ok: false,
                message: "Workspace not found"
            })
        }
        if(!WorkspacesRepository.isUserMemberOfWorkspace(id, workspace_id)){
            return res.json({
                status: 403,
                ok: false,
                message: "You are not a member of this workspace"
            })
        }
        req.workspace_selected = workspace_selected
        return next()
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

export default isWorkspaceMemberMiddleware