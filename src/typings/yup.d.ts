declare module 'yup' {
  interface StringSchema<T extends string | null | undefined = string> extends Schema<T> {
    phone(): this;
    passwordConfirm(): this
  }

  interface NumberSchema<T extends string | null | undefined = number> extends Schema<T> {
    selectNumberId(): this;
  }
}

export default yup