
import { GraphQLID, GraphQLList } from "graphql";
import { User } from "../../entities/user";
import { UserType } from "../typesDef/User";


export const GET_ALL_USERS ={
    type: GraphQLList(UserType),
    async resolve(){

        const result = await User.find()
        console.log(result)

        return result
    } 
}

export const GET_USER={
    type: UserType,
    args:{
        id: {type: GraphQLID}
    },
    async resolve(_:any, args:any){
        const user = await User.findOneBy({id:args.id})

        return user
    }
}