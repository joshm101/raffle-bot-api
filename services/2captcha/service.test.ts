import axios, { AxiosResponse, AxiosError } from 'axios';

import {
  submitRecaptchaV2SolveRequest,
  RecaptchaV2SolveRequestApiError,
  RecaptchaV2SolveRequestNetworkError,
  RecaptchaV2SolveRequestTimeoutError,
  RecaptchaV2SolveRequestSetupError
} from './service';
import { CAPTCHA_SOLVE_REQUEST_ERRORS } from './constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const POSSIBLE_API_ERRORS = Object.keys(CAPTCHA_SOLVE_REQUEST_ERRORS);

describe('submitRecaptchaV2SolveRequest', () => {
  const mockApiKey = 'abc123';
  const mockGoogleKey = '123abc';
  const mockPageUrl = 'https://google.com';

  it.each(POSSIBLE_API_ERRORS)(
    'rejects to custom API error on %s response',
    (possibleApiError) => {
      const mockErrorResponse: AxiosResponse = {
        status: 200,
        data: {
          status: 0,
          request: possibleApiError,
          error_text: `Supplementary error text for ${possibleApiError}`
        },
        statusText: '',
        headers: {},
        config: {}
      };

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
    ).rejects.toBeInstanceOf(RecaptchaV2SolveRequestNetworkError);
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
    ).rejects.toBeInstanceOf(RecaptchaV2SolveRequestTimeoutError);
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
    ).rejects.toBeInstanceOf(RecaptchaV2SolveRequestSetupError);
  });

  it('resolves to the captcha solution request key on success', () => {
    const expectedValue = 'mocked_request_key';
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
