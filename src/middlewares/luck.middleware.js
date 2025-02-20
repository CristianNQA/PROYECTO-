

export const midlewareDePrueba = (req, res, next) => {
    const numero_random = Math.random()//numero aleatorio entre 0 y 1
    if(numero_random > 0.5){
        //guardo en los headers de mi consulta un dato
        req.headers.suerte = 'el usuario tiene suerte'
        return next()
    } else {
        return res.sendStatus(500)
    }
}