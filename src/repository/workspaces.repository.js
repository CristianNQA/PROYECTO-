import pool from "../config/mysql.config.js"
import Workspace from "../models/Workspace.model.js"
import { ServerError } from "../utils/errors.util.js"


class WorkspaceRepository {

    /* 
    MONGO_DB

    async createWorkspace ({name, id}) { 
        return await Workspace.create({
        name,
        owner: id,
        members: [id]//determino que el creador del workspace sea miembro 
        })
    }

    async findWorkspaceById(workspace_id) {
        return await Workspace.findById(workspace_id)
    }

    async addMemberToWorkspace (workspace_id, user_id, user_invited_id){
        const workspace = this.findWorkspaceById(workspace_id)
        if(!workspace){
            throw new ServerError('workspace not found', 404)
        }
        if(workspace.owner.equals(user_id)){
            throw new ServerError('User is not the owner', 403)
        }
        if(workspace.members.includes(user_invited_id)){
            throw new ServerError('user already is a member', 400)
        }
        workspace.members.push(user_id)
        await workspace.save()

        return workspace
    }

    async getAllWorkspacesByMemberId (user_id){
        return await Workspace.find({members: user_id})
        .populate('members', 'username email')
        .populate('owner', 'username')
    }
    */
    async createWorkspace ({name, id}) { 
        const queryInsertWorkspace = `
        INSERT INTO workspaces(name, owner) 
        VALUES (?, ?)
        `
        const [result] = await pool.execute(
            queryInsertWorkspace,
            [name, id]
        )

        const queryInsertMember = `
        INSERT INTO workspace_members (workspace_id, user_id) 
        VALUES (?, ?)
        `
        await pool.execute(queryInsertMember, [result.insertId, id]) 

        return {_id: result.insertId, name, owner: id}
    }

    async findWorkspaceById(workspace_id) {
        const querySelectedWorkspace = `SELECT * FROM workspaces WHERE _id = ?`
        const [result] = await pool.execute(
            querySelectedWorkspace,
            [workspace_id]
        )
        return result[0] || null
    }

    async addMemberToWorkspace (workspace_id, user_id, user_invited_id){
        const workspace = this.findWorkspaceById(workspace_id)
        if(!workspace){
            throw new ServerError('workspace not found', 404)
        }
        if(workspace.owner !== user_id){
            throw new ServerError('User is not the owner', 403)
        }
        const queryExistingMember = `
            SELECT * FROM workspace_members
            WHERE workspace_id = ? AND user_id = ?
        `
        const [members_found] = await pool.execute(queryExistingMember, [workspace_id, user_invited_id])
        if(members_found.length > 0){
            throw new ServerError('user already is a member', 400)
        }
        const insertMemberQuery = `INSERT INTO workspace_members (workspace_id, user_id)
        VALUES (?, ?)
        `
        await pool.execute(insertMemberQuery, [workspace_id, user_invited_id])
        

        return workspace
    }

    async getAllWorkspacesByMemberId (user_id){
        const selectWorkspacesQuery = `
        SELECT 
            workspaces._id AS workspace_id,
            workspaces.name AS workspace_name,
            USERS.username AS owner_username,
            USERS.email AS owner_email
        FROM workspaces
        JOIN USERS ON workspaces.owner = USERS._id
        JOIN workspace_members ON workspace_members.workspace_id = workspaces._id
        WHERE workspace_members.user_id = ?
        `

        const [workspaces] = await pool.execute(selectWorkspacesQuery, [user_id])
        const workspacesAdapted = workspaces.map((workspace)=> {
            return {
                _id: workspace.workspace_id,
                name: workspace.workspace_name,
                owner: {
                    username: workspace.owner_username,
                    email: workspace.owner_email
                }

            }
        })
        return workspacesAdapted
    }

    async isUserMemberOfWorkspace (user_id, workspace_id){
        const query = `
            SELECT * 
            FROM workspace_members
            WHERE user_id = ? AND workspace_id = ?
        `
        const [result] = await pool.execute(query, [user_id, workspace_id])
        return Boolean(result.length)
    }
}

export default new WorkspaceRepository()