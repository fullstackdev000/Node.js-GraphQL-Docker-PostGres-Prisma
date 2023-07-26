import * as Yup from 'yup'

import { AgentValues } from '#veewme/web/common/formPanels/valuesInterfaces'

const AgentValidationSchema = Yup.object().shape<Partial<AgentValues>>({
  phone: Yup.string().phone(),
  phoneAlternate: Yup.string().phone(),
  phoneMobile: Yup.string().phone(),
  user: Yup.object().shape<AgentValues['user']>({
    email: Yup.string().email().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required()
  })
})

export default AgentValidationSchema
