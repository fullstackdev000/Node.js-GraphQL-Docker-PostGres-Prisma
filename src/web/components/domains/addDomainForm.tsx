import {
  CheckDomainExistsQuery as CheckDomainExistsQueryResponse,
  CheckDomainExistsQueryVariables
} from '#veewme/gen/graphqlTypes'
import { CheckDomainExists } from '#veewme/lib/graphql/queries'
import { useLazyQuery } from '@apollo/react-hooks'

import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import InputField from '#veewme/web/common/formikFields/inputField'
import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import RadioField from '#veewme/web/common/formikFields/radioInputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import * as Yup from 'yup'
import { Domain, TopDomain } from './'

const RadioHolder = styled.div`
  display: flex;
`

const NewDomainInput = styled.div`
  display: flex;
`
const InputLeft = styled.div`
  height: calc(100% -1px);
  width: 60px;
  padding: 0 8px;
  line-height: 28px;
  background: ${props => props.theme.colors.BACKGROUND};
`

const StyledSelect = styled(SelectField)`
  margin-left: -10px;

  > div > div {
    background: ${props => props.theme.colors.BACKGROUND};
    border-radius: 0 5px 5px 0;
    border-color: ${props => props.theme.colors.BORDER} !important;
  }
`

const ButtonHolder = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;

  button {
    width: 145px;
  }
`

const Hint = styled.p`
  margin: 20px 0;
  font-size: 14px;
  color: ${props => props.theme.colors.LABEL_TEXT};

`

const NewDomain = styled.div`
  max-width: 670px;
`

const StyledInput = styled(InputField)`
  width: 300px;
  flex: 1 1 auto;

  & > div {
    border-color: ${props => props.theme.colors.BORDER} !important;
  }
`

const ConfigTable = styled.table`
  font-size: 13px;
  table-layout: fixed;

  th,
  td {
    padding: 10px;
  }

  th {
    font-weight: 500;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.BORDER};
    white-space: nowrap;
  }

  tr {
    padding: 5px 2px;
  }
`

interface CustomProps {
  topDomains: TopDomain[]
  onSubmit: (values: Omit<Domain, 'id'>) => void
  domainAdded?: boolean
}

export interface FormValues {
  name: string
  topDomain: string
  existingUrl: string
  existing: 'yes' | 'no' // can't be boolean in this case because Formik RadioButton doesn't support boolean values
}

type AddDomainFormProps = FormikProps<FormValues> & CustomProps

export const PurchaseDomainPanel: React.FunctionComponent<{
  topDomains: TopDomain[]
  values: FormValues
  handleSubmit: () => void
}> = props => {
  const { addToast } = useToasts()
  // disable submit btn only if user has checked availability and it failed
  // if user hasn't checked it verification will be done during submit request so Submit button have to be enabled by default
  const [disabled, setDisabled] = React.useState(true)

  // moving query hook to parent container would add unnecessary complexity
  // https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
  const [ checkDomain, { data: domainExists, loading: checking, error } ] = useLazyQuery<CheckDomainExistsQueryResponse, CheckDomainExistsQueryVariables>(
    CheckDomainExists
  )

  const checkAvailability = () => {
    const url = `${props.values.name}.${props.values.topDomain}`
    checkDomain({
      variables: {
        url
      }
    })
  }

  React.useEffect(() => setDisabled(false), [props.values])
  // Calling addToast inside lazyQuery onCompleted/onError apollo methods causes infinite loop
  // https://github.com/apollographql/react-apollo/issues/3505
  React.useEffect(() => {
    if (error === undefined) {
      return
    }
    addToast(error.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  }, [error])

  React.useEffect(() => {
    if (domainExists === undefined) {
      return
    }
    const exists = domainExists.checkDomainExist && domainExists.checkDomainExist.exists
    if (exists) {
      addToast('Domain already exists.', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
      setDisabled(true)
    } else {
      addToast('Congratulations. Domain is available.', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 })
      setDisabled(false)
    }
  }, [domainExists])

  const topLevelDomainOptions = React.useMemo(() =>
    props.topDomains.map(d => {
      // TODO add locale handling
      const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: d.currency }).format(d.price)

      return {
        label: `.${d.name} (${formattedPrice}/year)`,
        value: d.name
      }
    }), [props.topDomains])

  return (
    <NewDomain>
      <Hint>
        Use the below form to purchase and register custom domain for your listing.
      </Hint>
      <NewDomainInput>
        <Field
          name={nameof<FormValues>('name')}
          component={StyledInput}
          leftComponent={<InputLeft>http://</InputLeft>}
          compactMode={false}
        />
        <Field
          name={nameof<FormValues>('topDomain')}
          component={StyledSelect}
          placeholder='Select domain'
          options={topLevelDomainOptions}
        />
      </NewDomainInput>
      <ButtonHolder>
        <Button
          buttonTheme='info'
          full
          type='button'
          label={checking ? 'Please wait...' : `Check availability`}
          disabled={!props.values.name}
          onClick={checkAvailability}
        />
      </ButtonHolder>
      <ButtonHolder>
        <Button
          buttonTheme='action'
          full
          type='submit'
          label='Purchase'
          onClick={props.handleSubmit}
          disabled={disabled}
        />
      </ButtonHolder>
    </NewDomain>
  )
}

const AddExistingDomainPanel: React.FunctionComponent<FormikProps<FormValues> & {
  domainAdded?: boolean
  handleSubmit: () => void
}> = props => {
  const SuccessInfo = (
    <>
      <Hint>
        Please note that we are unable to automatically configure your DNS settings.
        You will need to login to your registrar and set the DNS settings for your domain  as follows.
      </Hint>
      <ConfigTable>
        <tbody>
          <tr>
            <th>Host/Alias</th>
            <th>Record Type</th>
            <th>Value/Answer/Destination</th>
          </tr>
          <tr>
            <td>www</td>
            <td>CNAME</td>
            <td>dc.82321.1422022143.us.east.1.elb.amazonaws.com</td>
          </tr>
          <tr>
            <td>@</td>
            <td>A</td>
            <td>54.225.191.90</td>
          </tr>
        </tbody>
      </ConfigTable>
    </>
  )

  return (
    <NewDomain>
      <Hint>
        Add a domain name that you have already purchased from a registrar.
      </Hint>
      <NewDomainInput>
        <Field
          name={nameof<FormValues>('existingUrl')}
          component={StyledInput}
          leftComponent={<InputLeft>http://</InputLeft>}
          compactMode={false}
        />
      </NewDomainInput>
      <ButtonHolder>
        <Button
          buttonTheme='action'
          full
          type='submit'
          onClick={props.handleSubmit}
          label='Add Domain'
        />
      </ButtonHolder>
      {props.domainAdded && SuccessInfo}
    </NewDomain>
  )
}

export const AddDomainView: React.FunctionComponent<AddDomainFormProps> = ({
  topDomains,
  ...props
}) => {
  const panelToShow = props.values.existing === 'yes' ?
    <AddExistingDomainPanel {...props} domainAdded={props.domainAdded} handleSubmit={props.handleSubmit} /> :
    <PurchaseDomainPanel topDomains={topDomains} values={props.values} handleSubmit={props.handleSubmit} />
  return (
    <>
      <Form>
        <Panel id='details' heading='Domain Details'>
          <RadioHolder>
            <Field
              name={nameof<FormValues>('existing')}
              value='no'
              component={RadioField}
              label='Purchase domain'
              size='s'
            />
            <Field
              name={nameof<FormValues>('existing')}
              value='yes'
              component={RadioField}
              label='Add existing domain'
              size='s'
            />
          </RadioHolder>
          {panelToShow}
        </Panel>
      </Form>
      <NavigationWarning touched={props.touched} />
    </>
  )
}

const FormSchema = Yup.object().shape<Partial<FormValues>>({
  existingUrl: Yup.string().when('existing', {
    is: 'yes',
    then: Yup.string().required()
  }),
  name: Yup.string().when('existing', {
    is: 'no',
    then: Yup.string().required()
  })
})

const defaultData: FormValues = {
  existing: 'no',
  existingUrl: '',
  name: '',
  topDomain: 'com'
}

const AddDomainForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props, resetForm }) => {
    const valuesToSent = values.existing === 'no' ? {
      existing: false,
      url: `${values.name}.${values.topDomain}`
    } : {
      existing: true,
      url: values.existingUrl
    }
    props.onSubmit(valuesToSent)
    setSubmitting(false)
    resetForm({
      ...defaultData,
      existing: values.existing
    })
  },
  mapPropsToValues: () => defaultData,
  validationSchema: FormSchema
})(AddDomainView)

export default AddDomainForm
