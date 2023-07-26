import { forwardTo } from 'graphql-binding'
import { ResolversRequired } from '../graphqlServer'

export const developer: ResolversRequired['Query']['developer'] = forwardTo('prismaBinding')
export const developers: ResolversRequired['Query']['developers'] = forwardTo('prismaBinding')
