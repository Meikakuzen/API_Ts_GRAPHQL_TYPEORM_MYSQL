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
        return 'user created'
    } 
}