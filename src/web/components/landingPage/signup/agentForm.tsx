import { CreateSelfServiceAgentMutation, CreateSelfServiceAgentMutationVariables } from '#veewme/gen/graphqlTypes'
import { CreateSelfServiceAgent } from '#veewme/lib/graphql/queries'
import { SelfServiceAgentValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation } from '@apollo/react-hooks'
import { FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import Button from '../../../common/buttons/basicButton'
import {
  BasicInformation,
  ContactInformation,
  PersonalInformation,
  RightColumnContent
} from './formElements'
import { AccountForm, FormLeftColumn } from './styled'

interface CustomProps {
  onSubmit: (options: CreateSelfServiceAgentMutationVariables) => void
}

type AgentAccountProps = FormikProps<SelfServiceAgentValues> & CustomProps

const AgentAccountForm: React.FunctionComponent<AgentAccountProps> = props => {
  return (
    <AccountForm>
      <FormLeftColumn>
        <BasicInformation />
        <PersonalInformation />
        <ContactInformation />
        <Button type='submit' label='Sign Up' buttonTheme='info' full size='big' />
      </FormLeftColumn>
      <RightColumnContent />
    </AccountForm>
  )
}

const FormikAgent = withFormik<CustomProps, SelfServiceAgentValues>({
  handleSubmit: (values, { setSubmitting, props }) => {
    const { passwordConfirm, survey, ...user } = values
    props.onSubmit(user)
    setSubmitting(false)
  }
})(AgentAccountForm)

const CreateAgentForm: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const [createSelfServiceAgent, { loading }] = useMutation<CreateSelfServiceAgentMutation, CreateSelfServiceAgentMutationVariables>(
    CreateSelfServiceAgent,
    {
      onCompleted: result => {
        addToast(
          `Agent user ${result.createSelfServiceAgent.user.email} was created successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      },
      onError: error => {
        addToast(
          `Error ${error.message} while creating Agent's account`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const handleSubmit = (values: CreateSelfServiceAgentMutationVariables) => {
    createSelfServiceAgent({ variables: values }).catch(e => log.debug(e.message))
  }

  return (
    <>
      {loading && <DotSpinnerModal isOpen={loading} />}
      <FormikAgent onSubmit={handleSubmit} />
    </>
  )
}

export default CreateAgentForm
