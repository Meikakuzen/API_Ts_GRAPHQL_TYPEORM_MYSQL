import {GraphQLSchema, GraphQLObjectType} from 'graphql'
import { GREETING } from './queries/greeting'
import { CREATE_USER, DELETE_USER } from './mutations/User'
import { GET_ALL_USERS, GET_USER } from './queries/user'

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields:{
        greeting: GREETING, 
        getAllUsers: GET_ALL_USERS,
        getUser: GET_USER
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields:{ 
        createUser: CREATE_USER,
        deleteUser: DELETE_USER
    
    } 
})


export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})