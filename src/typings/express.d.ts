declare namespace Express {
  export interface Application {
    // XXX: Expose private method
    // https://stackoverflow.com/a/48790319/846957
    handle(req: Request, res: Response): void
  }
}
