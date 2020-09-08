// shared types

class GetUserError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'GetUserError';
  }
}

export { GetUserError };
