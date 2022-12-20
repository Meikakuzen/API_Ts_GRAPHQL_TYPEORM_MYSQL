import {DataSource} from 'typeorm'

const myDataSource = new DataSource({
    type: 'mysql',
    username: 'root',
    password: 'root',
    port: 3306,
    host: 'localhost',
    database: 'fatzusers',
    entities: [],
    synchronize: true,
    ssl: false
})

myDataSource.initialize()
    .then(() => {
        console.log("Conectado a la DB")
    })
    .catch((err) => {
        console.error("Error durante la inicialización", err)
    })


