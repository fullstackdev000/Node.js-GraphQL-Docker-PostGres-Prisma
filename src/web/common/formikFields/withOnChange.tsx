import { FormikProps } from 'formik'
import * as React from 'react'

/*
  This module includes HoC and hook that make it easier to trigger custom actions when any Formik value has changed.
  TODO: add more logic (optimization like debounce etc.) when filter forms are integrated with backend
*/

type onChange<V> = (val: V) => void

export type FormPropsWithOnChange<CustomProps, FormValues> = CustomProps & {
  onChange: onChange<FormValues>
}

export const useOnChange = <V extends {}>(values: V, onChangeCallback: onChange<V>) => {
  React.useEffect(() => {
    onChangeCallback(values)
  }, [values])
}

const withOnChange = <T extends FormikProps<V>, V>(WrappedComponent: React.ComponentType<T>) => {
  type FiltersProps = T & {
    onChange: onChange<V>
  }
  return class FormWithOnChange extends React.Component<FiltersProps> {
    componentDidUpdate (prevProps: T) {
      if (prevProps.values !== this.props.values) {
        this.props.onChange(this.props.values)
      }
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }
}

export default withOnChange
