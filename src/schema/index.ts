import {GraphQLSchema, GraphQLObjectType} from 'graphql'
import { GREETING } from './queries/greeting'
import { CREATE_USER } from './mutations/User'
import { GET_ALL_USERS } from './queries/user'

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields:{
        greeting: GREETING, 
        getAllUsers: GET_ALL_USERS
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