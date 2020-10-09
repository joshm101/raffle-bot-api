import axios, { AxiosResponse, AxiosError } from 'axios';

import {
  submitRecaptchaV2SolveRequest,
  submitRecaptchaV2SolutionQuery
} from './service';
import {
  RecaptchaV2SolveRequestApiError,
  RecaptchaV2ApiRequestNetworkError,
  RecaptchaV2ApiRequestTimeoutError,
  RecaptchaV2ApiRequestSetupError,
  RecaptchaV2SolutionQueryApiError
} from './errors';
import {
  CAPTCHA_SOLVE_REQUEST_ERRORS,
  CAPTCHA_SOLUTION_QUERY_ERRORS
} from './constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const POSSIBLE_SOLVE_REQUEST_API_ERRORS = Object.keys(
  CAPTCHA_SOLVE_REQUEST_ERRORS
);
const POSSIBLE_SOLUTION_QUERY_API_ERRORS = Object.keys(
  CAPTCHA_SOLUTION_QUERY_ERRORS
);

const mockApiKey = 'abc123';
const mockGoogleKey = '123abc';
const mockPageUrl = 'https://google.com';

const buildMockApiErrorResponse = (error: string): AxiosResponse => {
  return {
    status: 200,
    data: {
      status: 0,
      request: error,
      error_text: `Supplementary error text for ${error}`
    },
    statusText: '',
    headers: {},
    config: {}
  };
};

describe('submitRecaptchaV2SolveRequest', () => {
  it.each(POSSIBLE_SOLVE_REQUEST_API_ERRORS)(
    'rejects to custom API error on %s response',
    (possibleSolveRequestApiError) => {
      const mockErrorResponse = buildMockApiErrorResponse(
        possibleSolveRequestApiError
      );

      const mockedImplementation = () =>
        Promise.resolve(mockErrorResponse);

      mockedAxios.get.mockImplementationOnce(mockedImplementation);

      return expect(
        submitRecaptchaV2SolveRequest(
          mockApiKey,
          mockGoogleKey,
          mockPageUrl
        )
      ).rejects.toBeInstanceOf(RecaptchaV2SolveRequestApiError);
    }
  );

  it('rejects to custom network error on network response error', () => {
    const mockErrorResponse: AxiosResponse = {
      status: 500,
      data: '',
      statusText: '',
      headers: {},
      config: {}
    };

    const mockError: Partial<AxiosError> = {
      response: mockErrorResponse
    };

    mockedAxios.get.mockImplementationOnce(() =>
      Promise.reject(mockError)
    );

    return expect(
      submitRecaptchaV2SolveRequest(
        mockApiKey,
        mockGoogleKey,
        mockPageUrl
      )
    ).rejects.toBeInstanceOf(RecaptchaV2ApiRequestNetworkError);
  });

  it('rejects to custom timeout error on no response error', () => {
    const mockRequestObject = {};

    const mockError: Partial<AxiosError> = {
      request: mockRequestObject,
      message: 'Timeout error'
    };

    mockedAxios.get.mockImplementationOnce(() =>
      Promise.reject(mockError)
    );

    return expect(
      submitRecaptchaV2SolveRequest(
        mockApiKey,
        mockGoogleKey,
        mockPageUrl
      )
    ).rejects.toBeInstanceOf(RecaptchaV2ApiRequestTimeoutError);
  });

  it('rejects to custom request setup error on setup error', () => {
    const mockError: Partial<AxiosError> = {};

    mockedAxios.get.mockImplementationOnce(() =>
      Promise.reject(mockError)
    );

    return expect(
      submitRecaptchaV2SolveRequest(
        mockApiKey,
        mockGoogleKey,
        mockPageUrl
      )
    ).rejects.toBeInstanceOf(RecaptchaV2ApiRequestSetupError);
  });

  it('resolves to the captcha solution request ID on success', () => {
    const expectedValue = 'mocked_request_id';
    const mockResponse: Partial<AxiosResponse> = {
      data: {
        status: 1,
        request: expectedValue
      }
    };

    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve(mockResponse)
    );

    return expect(
      submitRecaptchaV2SolveRequest(
        mockApiKey,
        mockGoogleKey,
        mockPageUrl
      )
    ).resolves.toEqual(expectedValue);
  });
});

describe('submitRecaptchaV2SolutionQuery', () => {
  const mockSolveRequestId = '54840666081';

  it.each(POSSIBLE_SOLUTION_QUERY_API_ERRORS)(
    'rejects to custom API error on %s response',
    (possibleSolutionQueryApiError) => {
      const mockErrorResponse = buildMockApiErrorResponse(
        possibleSolutionQueryApiError
      );

      const mockedImplementation = () =>
        Promise.resolve(mockErrorResponse);

      mockedAxios.get.mockImplementationOnce(mockedImplementation);

      return expect(
        submitRecaptchaV2SolutionQuery(mockApiKey, mockSolveRequestId)
      ).rejects.toBeInstanceOf(RecaptchaV2SolutionQueryApiError);
    }
  );

  it('rejects to custom network error on network response error', () => {
    const mockErrorResponse: AxiosResponse = {
      status: 500,
      data: '',
      statusText: '',
      headers: {},
      config: {}
    };

    const mockError: Partial<AxiosError> = {
      response: mockErrorResponse
    };

    mockedAxios.get.mockImplementationOnce(() =>
      Promise.reject(mockError)
    );

    return expect(
      submitRecaptchaV2SolutionQuery(mockApiKey, mockSolveRequestId)
    ).rejects.toBeInstanceOf(RecaptchaV2ApiRequestNetworkError);
  });

  it('rejects to custom timeout error on no response error', () => {
    const mockRequestObject = {};

    const mockError: Partial<AxiosError> = {
      request: mockRequestObject,
      message: 'Timeout error'
    };

    mockedAxios.get.mockImplementationOnce(() =>
      Promise.reject(mockError)
    );

    return expect(
      submitRecaptchaV2SolutionQuery(mockApiKey, mockSolveRequestId)
    ).rejects.toBeInstanceOf(RecaptchaV2ApiRequestTimeoutError);
  });

  it('rejects to custom request setup error on setup error', () => {
    const mockError: Partial<AxiosError> = {};

    mockedAxios.get.mockImplementationOnce(() =>
      Promise.reject(mockError)
    );

    return expect(
      submitRecaptchaV2SolutionQuery(mockApiKey, mockSolveRequestId)
    ).rejects.toBeInstanceOf(RecaptchaV2ApiRequestSetupError);
  });

  it('resolves to the captcha answer token on success', () => {
    const expectedValue = 'mocked_answer_token';
    const mockResponse: Partial<AxiosResponse> = {
      data: {
        status: 1,
        request: expectedValue
      }
    };

    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve(mockResponse)
    );

    return expect(
      submitRecaptchaV2SolutionQuery(mockApiKey, mockSolveRequestId)
    ).resolves.toEqual(expectedValue);
  });
});
