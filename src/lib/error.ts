class BaseError extends Error {
  constructor (message: string) {
    super(message)
    Object.setPrototypeOf(this, BaseError.prototype)
  }
}

export class UnreachableCaseError extends BaseError {
  // Exhaustive switch-case
  // http://ideasintosoftware.com/exhaustive-switch-in-typescript
  constructor (value: never) {
    super(`Unreachable case: ${value}`)
  }
}
