class RecaptchaV2SolveRequestApiError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'RecaptchaV2SolveRequestApiError';
  }
}

class RecaptchaV2ApiRequestNetworkError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'RecaptchaV2ApiRequestNetworkError';
  }
}

class RecaptchaV2ApiRequestTimeoutError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = 'RecaptchaV2ApiRequestTimeoutError';
  }
}

class RecaptchaV2ApiRequestSetupError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'RecaptchaV2ApiRequestSetupError';
  }
}

class RecaptchaV2SolutionQueryApiError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'RecaptchaV2SolutionQueryApiError';
  }
}

type RecaptchaV2SolutionQueryError =
  | RecaptchaV2ApiRequestNetworkError
  | RecaptchaV2ApiRequestSetupError
  | RecaptchaV2ApiRequestTimeoutError
  | RecaptchaV2SolutionQueryApiError;

export {
  RecaptchaV2SolveRequestApiError,
  RecaptchaV2ApiRequestNetworkError,
  RecaptchaV2ApiRequestTimeoutError,
  RecaptchaV2ApiRequestSetupError,
  RecaptchaV2SolutionQueryApiError,
  RecaptchaV2SolutionQueryError
};
