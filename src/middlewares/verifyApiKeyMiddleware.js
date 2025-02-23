import ENVIRONMENT from "../config/enviroment"

const verifyApiKeyMiddleware = (req, res, next) => {
    const api_key = request.headers['x-api-key']
    if(api_key !== ENVIRONMENT.API_KEY){
       response.json({
        ok: false,
        status: 401,
        message: 'Unauthorized'
       })
    } else {
        next()
    }
}

export default verifyApiKeyMiddleware