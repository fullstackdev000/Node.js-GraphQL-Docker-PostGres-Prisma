import * as Yup from 'yup'

import { Profile } from './types'

const ProfileValidationSchema = Yup.object().shape<Partial<Profile>>({
  phone: Yup.string().phone(),
  user: Yup.object().shape<Profile['user']>({
    email: Yup.string().email().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required()
  })
})

export default ProfileValidationSchema
