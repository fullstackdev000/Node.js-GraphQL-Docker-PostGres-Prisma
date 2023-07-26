import * as Yup from 'yup'

import { AffiliateSettings, EditAffiliateValues } from './types'

const AgentValidationSchema = Yup.object().shape<Partial<EditAffiliateValues>>({
  phone: Yup.string().phone(),
  phoneOffice: Yup.string().phone(),
  regions: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number(),
        label: Yup.string().required()
      })
    ),
  user: Yup.object().shape<EditAffiliateValues['user']>({
    email: Yup.string().email().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required()
  })
})

export const AffiliateSettingsValidationSchema = Yup.object().shape<Partial<AffiliateSettings>>({
  templateId: Yup.number().required()
})

export default AgentValidationSchema
