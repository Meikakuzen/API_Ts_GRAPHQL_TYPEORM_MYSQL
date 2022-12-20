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