import gql from 'graphql-tag'

export const CreateSelfServiceAgent = gql`
  mutation CreateSelfServiceAgent(
    $phone: String!
    $user: UserSignupInput!
    $website: String
  ) {
    createSelfServiceAgent(data: {
      phone: $phone
      user: $user
      website: $website
    }) {
      id
      user {
        email
      }
    }
  }
`
