import * as Yup from 'yup'

import { BrokerFormValues } from '#veewme/web/common/formPanels/valuesInterfaces'

const BrokerSchemaValidation = Yup.object().shape<Partial<BrokerFormValues>>({
  companyName: Yup.string().required(),
  emailOffice: Yup.string().email().required(),
  phone: Yup.string().phone()
})

export default BrokerSchemaValidation
