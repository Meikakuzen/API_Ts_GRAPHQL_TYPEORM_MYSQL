import {DataSource} from 'typeorm'
import { User } from './entities/user'

export const myDataSource = new DataSource({
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




