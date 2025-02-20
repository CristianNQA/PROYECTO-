import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/TM_PWA_LUN_MIE_ENERO')
.then(() => {
    console.log('conexion con mongoDB exitosa') //onResolved
})
.catch((error) => {
    console.error('MongoDB conection error:', error)
})
//para saber donde esta la direccion de arriba. Ir a mongoCompass que es la app descargada en una clase anterior
//lo primero es una direccion lo segundo una base de datos
//connect: devuelve una promesa y es asincronica
//dos formas de manejar asincronia: async await. 
//  .then: onResolved / .catch: onRejected

export default mongoose




























