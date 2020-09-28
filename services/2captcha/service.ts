import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  SOLVE_REQUEST_URL,
  CAPTCHA_SOLVE_REQUEST_ERRORS,
  CAPTCHA_SOLUTION_QUERY_ERRORS,
  SOLUTION_QUERY_URL
} from './constants';

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

const interpretRecaptchaV2ApiRequestError = (error: AxiosError) => {
  if (error.response) {
    const { status } = error.response;
    throw new RecaptchaV2ApiRequestNetworkError(`${status}`);
  }

  if (error.request) {
    throw new RecaptchaV2ApiRequestTimeoutError(error.message);
  }

  throw new RecaptchaV2ApiRequestSetupError(error.message);
};

const submitRecaptchaV2SolveRequest = (
  apiKey: string,
  googleKey: string,
  pageUrl: string
) => {
  const queryString =
    `key=${apiKey}&` +
    `googlekey=${googleKey}&` +
    `pageurl=${pageUrl}&` +
    `method=usercaptcha&` +
    `json=1`;

  const interpretResponse = (response: AxiosResponse) => {
    // 2Captcha's API pattern returns 200 status code whenever
    // it can successfully process a network request. That means
    // the response payload can contain either the solve request
    // key (success) or any one of their error codes within
    // CAPTCHA_SOLVE_REQUEST_ERRORS. This also means that errors
    // like 4xx/5xx status codes are handled separately (and
    // indicate that the API is not working at all)
    const { data } = response;
    const { status } = data;

    if (status === 0) {
      const errorType = data.request as keyof typeof CAPTCHA_SOLVE_REQUEST_ERRORS;
      const error = CAPTCHA_SOLVE_REQUEST_ERRORS[errorType];

      throw new RecaptchaV2SolveRequestApiError(error);
    }

    const solveRequestId = data.request;

    return solveRequestId;
  };

  const url = `${SOLVE_REQUEST_URL}?${queryString}`;
  return axios
    .get(url)
    .catch(interpretRecaptchaV2ApiRequestError)
    .then(interpretResponse);
};

const submitRecaptchaV2SolutionQuery = (
  apiKey: string,
  solveRequestId: string
) => {
  const queryString =
    `key=${apiKey}&` +
    `id=${solveRequestId}&` +
    `action=get&` +
    `json=1`;

  const interpretResponse = (response: AxiosResponse) => {
    const { data } = response;
    const { status } = data;

    if (status === 0) {
      const errorType = data.request as keyof typeof CAPTCHA_SOLUTION_QUERY_ERRORS;
      const error = CAPTCHA_SOLUTION_QUERY_ERRORS[errorType];

      throw new RecaptchaV2SolutionQueryApiError(error);
    }

    const answerToken = data.request;

    return answerToken;
  };

  const url = `${SOLUTION_QUERY_URL}?${queryString}`;
  return axios
    .get(url)
    .catch(interpretRecaptchaV2ApiRequestError)
    .then(interpretResponse);
};

export {
  submitRecaptchaV2SolveRequest,
  submitRecaptchaV2SolutionQuery,
  RecaptchaV2SolveRequestApiError,
  RecaptchaV2ApiRequestNetworkError,
  RecaptchaV2ApiRequestTimeoutError,
  RecaptchaV2ApiRequestSetupError,
  RecaptchaV2SolutionQueryApiError
};
