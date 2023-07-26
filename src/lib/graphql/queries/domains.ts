import gql from 'graphql-tag'

export const CheckWhiteLabel = gql`
  mutation CheckWhiteLabel($id: Int!, $cname: String!) {
    checkWhiteLabel(data: {
      id: $id
      cname: $cname
    })
  }
`

export const Domains = gql`
  query Domains {
    domains {
      id
      existing
      url
    }
  }
`

export const TopLevelDomains = gql`
  query topLevelDomains {
    getTopLevelDomainsPrice {
      topLevelDomain
      price
      currency
    }
  }
`

export const DeleteDomain = gql`
  mutation deleteDomain(
    $id: Int!
  ) {
    deleteDomain(where: {
      id: $id
    }) {
      id
    }
  }
`

export const CreateDomain = gql`
  mutation createDomain(
    $url: String!
    $existing: Boolean!
  ) {
    createDomain(data: {
      url: $url
      existing: $existing
    }) {
      id
    }
  }
`

export const CheckDomainExists = gql`
  query CheckDomainExists(
    $url: String!
  ) {
    checkDomainExist(where: {
      url: $url
    }) {
      exists
      price
    }
  }
`
