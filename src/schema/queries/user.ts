
import { GraphQLList } from "graphql";
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