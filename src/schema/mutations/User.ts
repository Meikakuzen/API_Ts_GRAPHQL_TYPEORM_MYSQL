import { GraphQLString } from "graphql";
import { User } from "../../entities/user";
import { UserType } from "../typesDef/User";
import bcrypt from 'bcryptjs'


export const CREATE_USER={
    type: UserType,
    args:{
        name: {type: GraphQLString},
        username: {type: GraphQLString},
        password: {type: GraphQLString}
    },
    async resolve(_: any, args: any){
        const {name, username, password} = args;

        const passwordHash= await bcrypt.hash(password,10)

        const result = await User.insert({
            name: name,
            username: username,
            password: passwordHash
        })

        console.log(result)
        return {...args, id: result.identifiers[0].id}
    } 
}
