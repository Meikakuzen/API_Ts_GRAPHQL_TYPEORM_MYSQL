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
   // mutation:{}
})