// https://github.com/apollographql/graphql-tag/issues/59

declare module '*.graphql' {
  import { DocumentNode } from 'graphql'
  const value: DocumentNode
  export = value
}
