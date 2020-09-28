import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  SOLVE_REQUEST_URL,
  CAPTCHA_SOLVE_REQUEST_ERRORS
} from './constants';

class RecaptchaV2SolveRequestApiError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'RecaptchaV2SolveRequestApiError';
  }
}

class RecaptchaV2SolveRequestNetworkError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'RecaptchaV2SolveRequestNetworkError';
  }
}

class RecaptchaV2SolveRequestTimeoutError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = 'RecaptchaV2SolveRequestTimeoutError';
  }
}

class RecaptchaV2SolveRequestSetupError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'RecaptchaV2SolveRequestSetupError';
  }
}

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
      const request = data.request as keyof typeof CAPTCHA_SOLVE_REQUEST_ERRORS;
      const error = CAPTCHA_SOLVE_REQUEST_ERRORS[request];

      throw new RecaptchaV2SolveRequestApiError(error);
    }

    const solveRequestKey = data.request;

    return solveRequestKey;
  };

  const interpretRequestError = (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      throw new RecaptchaV2SolveRequestNetworkError(`${status}`);
    }

    if (error.request) {
      throw new RecaptchaV2SolveRequestTimeoutError(error.message);
    }

    throw new RecaptchaV2SolveRequestSetupError(error.message);
  };

  const url = `${SOLVE_REQUEST_URL}?${queryString}`;
  return axios
    .get(url)
    .catch(interpretRequestError)
    .then(interpretResponse);
};

export {
  submitRecaptchaV2SolveRequest,
  RecaptchaV2SolveRequestApiError,
  RecaptchaV2SolveRequestNetworkError,
  RecaptchaV2SolveRequestTimeoutError,
  RecaptchaV2SolveRequestSetupError
};
