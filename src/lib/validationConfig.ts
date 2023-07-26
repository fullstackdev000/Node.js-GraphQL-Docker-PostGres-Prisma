import { isPossiblePhoneNumber } from 'react-phone-number-input'
import { addMethod, number, setLocale, string } from 'yup'

setLocale({
  mixed: {
    oneOf: params => {
      if (typeof params.value === 'boolean') {
        return 'Field must be checked'
      }
      return `Field must be of following values: ${params.values}`
    },
    required: 'This field is required'
  },
  string: {
    email: ' Incorrect email address'
  }
})

addMethod(string, 'phone', function () {
  return this.test({
    message: 'Phone number is not valid',
    name: 'phone',
    test: val => {
      if (val) {
        return val.length > 12 ? false : isPossiblePhoneNumber(val, 'US')
      } else {
        return true
      }

    }
  })
})

addMethod(string, 'passwordConfirm', function () {
  return this.test({
    message: 'Passwords must match',
    // tslint:disable-next-line
    test: function(value) {
      return this.parent.user.password === value
    }
  })
})

addMethod(number, 'selectNumberId', function () {
  return this.test({
    message: 'This field is required',
    test: val => val >= 0
  })
})
