import { app } from "./app";
import { myDataSource } from "./db";


    myDataSource.initialize()
    .then(() => {
        console.log("Conectado a la DB")
    })
    .catch((err: any) => {
        console.error("Error durante la inicialización", err)
    })

    app.listen(3000, ()=>{
    console.log(`Servidor corriendo en puerto 3000`)
    })
