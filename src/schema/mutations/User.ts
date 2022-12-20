import { GraphQLString } from "graphql";
import { User } from "../../entities/user";
import { UserType } from "../typesDef/User";


export const CREATE_USER={
    type: UserType,
    args:{
        name: {type: GraphQLString},
        username: {type: GraphQLString},
        password: {type: GraphQLString}
    },
    async resolve(_: any, args: any){
        const {name, username, password} = args;

        const result = await User.insert({
            name: name,
            username: username,
            password: password
        })

        console.log(result)
        return {...args, id: result.identifiers[0].id}
    } 
}
