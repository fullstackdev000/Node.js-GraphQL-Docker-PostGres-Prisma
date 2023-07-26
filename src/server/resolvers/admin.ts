import { forwardTo } from 'graphql-binding'
import { ResolversRequired } from '../graphqlServer'

export const admin: ResolversRequired['Query']['admin'] = forwardTo('prismaBinding')
export const admins: ResolversRequired['Query']['admins'] = forwardTo('prismaBinding')
