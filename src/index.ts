import { app } from "./app";


function main(){
    app.listen(3000, ()=>{
    console.log(`Servidor corriendo en puerto 3000`)
    })
}
main()