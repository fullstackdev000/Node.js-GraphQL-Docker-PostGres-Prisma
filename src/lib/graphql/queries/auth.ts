import gql from 'graphql-tag'

export const Me = gql`
  query Me {
    me {
      accountId
      firstName
      lastName
      role
      account {
        ... on Affiliate {
          id
          state
          country
          id
          brokerages {
            id
            companyName
            templateId
          }
          mediaExports {
            id
            height
            name
            resolution
            width
          }
          regions {
            id
            label
          }
          templateId
        }
        ... on Agent {
          id
          affiliate {
            state
            country
          }
          paymentMethods {
            id
            type
            card {
              brand
              expMonth
              expYear
              last4
            }
          }
        }

        ... on Photographer {
          id
          activatable
        }
      }
    }
  }
`

export const LogIn = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(data: {
      email: $email
      password: $password
    }) {
      id
      role
    }
  }
`

export const LogOut = gql`
  mutation LogOut($noargs: Boolean = true) {
    logOut(noargs: $noargs)
  }
`

export const CalendarMe = gql`
  query CalendarMe {
    me {
      accountId
      role
      account {
        ... on Affiliate {
          id
          calendarTime12h
          calendarFirstDay
          calendarEndTime
          calendarShowBusinessHours
          calendarShowWeather
          calendarStartTime
          regions {
            id
            label
          }
        }
      }
    }
  }
`

export const MeLogo = gql`
  query MeLogo {
    me {
      accountId
      account {
        ... on Affiliate {
          id
          profilePicture {
            id
            path
          }
        }
        ... on Agent {
          id
          affiliate {
            profilePicture {
              path
            }
          }
        }
      }
    }
  }
`
export const MeSupport = gql`
  query MeSupport {
    me {
      account {
        ... on Affiliate {
          id
        }
        ... on Agent {
          id
          affiliate {
            supportAgent
          }
        }
        ... on Photographer {
          id
          affiliate {
            supportPhotographer
          }
        }

        ... on Processor {
          id
          affiliate {
            supportProcessor
          }
        }
      }
    }
  }
`

export const RequestResetPassword = gql`
  mutation RequestResetPassword($data: RequestResetPasswordInput!) {
    requestResetPassword(data: $data) {
      email
    }
  }
`

export const SetPassword = gql`
  mutation SetPassword($data: ResetPasswordInput!) {
    resetPassword(data: $data)
  }
`

export const ChangePassword = gql`
  mutation ChangePassword($data: UpdatePasswordInput!) {
    updatePassword(data: $data)
  }
`
