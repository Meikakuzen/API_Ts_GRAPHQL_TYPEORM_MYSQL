# CRUD TYPESCRIPT GRAPHQL SQL TYPEORM

## SETUP

- Typescript está configurado globalmente. El script "dev" con ts-node-dev apunta a index.ts

> npm i express express-graphql graphql mysql typeorm cors bcryptjs

> npm i -D ts-node-dev dotenv @types/express  @types/bcryptjs @types/cors @types/node


- Paso el package.json

~~~json
{
  "name": "apigraphqltypescript",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "tsc": "tsc",
    "start": "node build/index.js"
    
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.15",
    "@types/node": "^18.11.17",
    "dotenv": "^16.0.3",
    "ts-node-dev": "^2.0.0",
    "typescript": "^4.9.4"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-graphql": "^0.12.0",
    "graphql": "^15.8.0",
    "mysql": "^2.18.1",
    "typeorm": "^0.3.11"
  }
}
~~~

- Para el archivo de configuración de typescript (tsconfig)

> npx tsc --init

- en rootDir: "./src"
- en outDir: "./build"

- ts-node-dev ya está configurado en npm run dev
------

## Server y GraphQL

- Configuro servidor básico en src/index.ts

~~~js
import express from 'express'

const app = express()

const PORT = 3000

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
~~~

- Importo graphqlHTTP de express-graphql. Esta función retorna una interfaz gráfica
- En el objeto de configuración  de esta función necesita un Schema, definir que cosas yo puedo consultar en mi API.
- El schema es como definir las url y qué ejecutar cuando se visite esas url
- Entonces, creo una carpeta src/schema/index.ts
- Importo algunas funciones de graphql
    - GrapQLSchema necesita dos cosas
        - Querys: consultas sin alterar datos (lo que serían GET)
        - Mutations : consultas que alteren datos (lo que serían POST, PUT, DELETE)
    - El schema necesita un rootQuery, una primera consulta
        - Para ello importo GraphQLObjectType
            - Le añado un nombre
            - Los fields es cómo decirle: estas funciones son las que puedes consultar
                - Tengo que indicarle que tipo de dato es
~~~js
import {GraphQLSchema, GraphQLObjectType} from 'graphql'


const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields:{
        greeting: //tengo que indicarle la función y qué tipo de dato es
    }
})


export const schema= new GraphQLSchema({
    query: {}, //falta el rootQuery para que no de error
    mutation:{}
})
~~~

- Para resolver esto, creo la carpeta dentro de schema/queries/greeting.ts
- Creo el objeto GREETING
    - Este objeto le va a decir a GraphQL qué nombre va a tener, que argumentos puede recibir y qué va a devolver
    - Uso el tipo string de graphQL
    - En el resolve devuelvo un hello world 

    NOTA: detallarlo así sirve para la documentación y para que devuelva el autocompletado

~~~js
import { GraphQLString } from "graphql"

export const GREETING = {
    type: GraphQLString,
    resolve: ()=> "HELLO WORLD"
}
~~~

- Ahora puedo importar GREETING en schema/index.ts y pasarle el RootQuery a query
- Las mutation no son necesarias por ahora

~~~js
import {GraphQLSchema, GraphQLObjectType} from 'graphql'
import { GREETING } from './queries/greeting'

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields:{
        greeting: GREETING
    }
})


export const schema = new GraphQLSchema({
    query: RootQuery, //falta el rootQuery para que no de error
   // mutation:{}  //Las mutation no son necesarias por ahora
})
~~~

- Ahora ya tengo el schema, puedo ir a src/index.ts y usarlo 

~~~js
import express from 'express'
import {graphqlHTTP} from 'express-graphql'
import { schema } from './schema'

const app = express()

const PORT = 3000

app.use('/graphql', graphqlHTTP({
    graphiql: true, 
    schema
}))

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
~~~

- Ahora si voy a la ruta tengo la interfaz gráfica

> http://localhost:3000/graphql

- Si hago esta consulta me devuelve HELLO WORLD

~~~graphql
query{
  greeting
}
~~~

-----

## Conexión a MYSQL

- Utilizando solo el paquete mysql instalado me conectaría a SQL mediante 'CREATE DATABASE .... SELECT * FROM....)
- El paquete TypeORM permite hacer consultas sin necesidad de escribir código SQL
- Creo el archivo src/db.ts
- Importo de typeorm su método para poder conectarme (DataSource)
- Relleno los campos con el tipo de base de datos, mi username, password
- Inicializo la nueva instancia de DataSource, me devuelve una promesa
- Ahora yo puedo usar myDataSource junto a .manager con las entities
- Falta crear la base de datos en MySQL desde la consola
- Creo la database fatzusers desde MySQL Workbench 
- Añado las entities. Sirven para definir qué tablas se crearán y con qué campos
- synchronize en true reviusa si existen tablas definidas en entities y si existen las creará por mi
- Coloco ssl en false porque es una base de datos local y no voya usar protocolo seguro

~~~js
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
~~~
------
## NOTA: Ejemplos de uso de DataSource (createConnection deprecated)
------
- Un ejemplo de uso de DataSource. Se puede usar el await sin el async

~~~js
import { DataSource } from "typeorm"
import { User } from "./entity/User"

const myDataSource = new DataSource(/*...*/)
const user = await myDataSource.manager.findOneBy(User, {
    id: 1,
})
user.name = "Umed"
await myDataSource.manager.save(user)
~~~

- Otro ejemplo de un GET con decoradores:

~~~js
import { AppDataSource } from "./app-data-source"
import { User } from "../entity/User"

export class UserController {
    @Get("/users")
    getAll() {
        return AppDataSource.manager.find(User)
    }
}
~~~
------

- Hago un cambio en app.ts. Exporto app y lo pongo a escuchar en otro archivo llamado index.ts

- app.ts:
~~~js
import express from 'express'
import {graphqlHTTP} from 'express-graphql'
import { schema } from './schema'

const app = express()

app.use('/graphql', graphqlHTTP({
    graphiql: true, 
    schema
}))


export {app}
~~~

- src/index.ts

~~~js
import { app } from "./app";


app.listen(3000, ()=>{
    console.log(`Servidor corriendo en puerto 3000`)
})
~~~

- Puedo colocarlo dentro de una función main
- Podría colocarlo en un try y un catch para debuguear si hubiera algún error, pero como no está la conexión a la DB no es necesario

~~~js
import { app } from "./app";


function main(){
    app.listen(3000, ()=>{
    console.log(`Servidor corriendo en puerto 3000`)
    })
}
main()
~~~

## NOTA: La conexión a la DB a través de DataSource puede dar un error típico
## 'ER_NOT_SUPPORTED_AUTH_MODE'

- Como es una Db recién creada, no me está permitiendo conectar a travñés de usuario y password
- Debo activar la configuración entrando en la DB para activarlo
- Del usuario root, se puede autenticar a través del método mysql_native_password con la contraseña root

> ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'root'; 

- Para que vuelva a cargar los permisos

> flush privileges;

----

## USER ENTITY

- Creo la carpeta /src/entities/user.ts
- Para definir la tabla se necesitan decoradores
- Configuro el tsconfig para poder usar decoradores

> "experimentalDecorators": true,                
> "emitDecoratorMetadata": true

- Configuro la entidad user
- Voy a hacer que una clase llamada User herede de Entity

~~~js
import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from 'typeorm'


@Entity()
export class User extends BaseEntity{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @Column()
    username: string

    @Column()
    password: string

}

~~~

- Para que las propiedades no me den error cambio el tsconfig

> "strictPropertyInitialization": false, 

- Voy a db.ts y le paso la entity

~~~js
const myDataSource = new DataSource({
    type: 'mysql',
    username: 'root',
    password: 'root',
    port: 3306,
    host: 'localhost',
    database: 'fatzusers',
    entities: [User],
    synchronize: true,
    ssl: false
})
~~~
----

# Create User Mutation

- en el /schema/index.ts, donde definí el RootQuery, también necesito un RootMutation

~~~js
import {GraphQLSchema, GraphQLObjectType} from 'graphql'
import { GREETING } from './queries/greeting'

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields:{
        greeting: GREETING
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields:{
        createUser   //hace falta crear esta mutación     
    } 
})


export const schema = new GraphQLSchema({
    query: RootQuery, 
    mutation: Mutation
})
~~~

- Creo una carpeta lalmada mutations en /schema/mutations/User.ts
- Es habitual llamar el archivo igual que la entidad

~~~js
import { GraphQLString } from "graphql";


export const CREATE_USER={
    type: GraphQLString,
    resolve(){
        return 'user_created'
    } 
}
~~~

- Coloco el CREATE_USER en el schema/index.ts

~~~ts
import {GraphQLSchema, GraphQLObjectType} from 'graphql'
import { GREETING } from './queries/greeting'
import { CREATE_USER } from './mutations/User'

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields:{
        greeting: GREETING
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields:{ 
        createUser: CREATE_USER  
    } 
})


export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
~~~

- Para poder pillar las propiedades del POST debo indicarle que CREATE_USER recibirá args ( argumentos )
- resolve tiene dos parámetros, el primero es parent, el segundo es args

~~~js
import { GraphQLString } from "graphql";


export const CREATE_USER={
    type: GraphQLString,
    args:{
        name: {type: GraphQLString},
        username: {type: GraphQLString},
        password: {type: GraphQLString}
    },
    resolve(_: any, args: any){
        console.log(args)
        return {'user_created'}
    } 
}
~~~

- Si ahora hago una consulta y pongo

~~~graphql
mutation{
    createUser(name: "Joan", username: "Zoo", password: "123")
}
~~~

- Me devuelve el user created como respuesta y los argumentos por consola
- Entonces, con estos datos ya puedo guardar en la DB
