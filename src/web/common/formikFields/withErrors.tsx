import { FormikErrors, FormikProps } from 'formik'
import * as React from 'react'

export type FormPropsWithErrors<CustomProps, FormValues> = CustomProps & {
  customErrors: FormikErrors<FormValues>
}

/*
  This component makes possible passing validation errors to Formik component as prop ('customErrors').
  This is especially useful for displaying errors from server side validation.
  Important: you DON'T need this component to run only client-side validation. Use this component only if you want to display
  custom errors defined outside form component.
*/
const withErrors = <V, T extends FormikProps<V>>(WrappedComponent: React.ComponentType<T>) => {
  type FormikWithErrorsProps = T & { customErrors: FormikErrors<V> }
  return class FormWithErrors extends React.Component<FormikWithErrorsProps> {
    componentDidUpdate (prevProps: FormikWithErrorsProps) {
      const { customErrors } = this.props
      if (prevProps.customErrors !== customErrors) {
        // type casting needed in this case
        // https://github.com/Microsoft/TypeScript/pull/12253
        const errorFieldNames = Object.keys(customErrors) as Array<keyof V & string>
        errorFieldNames.forEach(fieldName => {
          this.props.setFieldTouched(fieldName, true, false)
        })
        this.props.setErrors({
          ...this.props.errors,
          ...customErrors
        })
      }
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }
}

export default withErrors
