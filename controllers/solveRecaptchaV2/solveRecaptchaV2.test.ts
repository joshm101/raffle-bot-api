import solveRecaptchaV2 from './solveRecaptchaV2';

import {
  CAPTCHA_SOLUTION_QUERY_ERRORS,
  CAPTCHA_SOLVE_REQUEST_ERRORS
} from '../../services/2captcha';
import {
  RecaptchaV2SolutionQueryApiError,
  RecaptchaV2SolveRequestApiError
} from '../../services/2captcha/errors';

import * as captchaService from '../../services/2captcha/service';
jest.mock('../../services/2captcha/service');

const mockedSolveRequest = captchaService.submitRecaptchaV2SolveRequest as jest.MockedFunction<
  typeof captchaService.submitRecaptchaV2SolveRequest
>;

const mockedSolutionQuery = captchaService.submitRecaptchaV2SolutionQuery as jest.MockedFunction<
  typeof captchaService.submitRecaptchaV2SolutionQuery
>;

jest.useFakeTimers();

const MOCK_API_KEY = 'mock-api-key';
const MOCK_GKEY = 'mock-gkey';
const MOCK_CAPTCHA_URL = 'http://foo.com';
const MOCK_SOLVE_REQUEST_ID = 'mock-request-id';
const MOCK_ANSWER_TOKEN = 'mock-answer-token';

const SOLVE_REQUEST_ERRORS = Object.values(
  CAPTCHA_SOLVE_REQUEST_ERRORS
);
const SOLUTION_QUERY_ERRORS = Object.values(
  CAPTCHA_SOLUTION_QUERY_ERRORS
).filter(
  (error) => error !== CAPTCHA_SOLUTION_QUERY_ERRORS.CAPCHA_NOT_READY
);

describe('solveRecaptchaV2', () => {
  it('resolves with answer token', async () => {
    mockedSolveRequest.mockImplementationOnce(() =>
      Promise.resolve(MOCK_SOLVE_REQUEST_ID)
    );
    mockedSolutionQuery.mockImplementationOnce(() =>
      Promise.resolve(MOCK_ANSWER_TOKEN)
    );

    const solveRecaptchaV2Promise = solveRecaptchaV2(
      MOCK_API_KEY,
      MOCK_GKEY,
      MOCK_CAPTCHA_URL
    );

    await Promise.resolve(); // network request tick
    await Promise.resolve(); // timeout started tick
    jest.runAllTimers();
    return expect(solveRecaptchaV2Promise).resolves.toBe(
      MOCK_ANSWER_TOKEN
    );
  });

  it('resolves with answer token on subsequent query', async () => {
    const expectedQueryError = new RecaptchaV2SolutionQueryApiError(
      CAPTCHA_SOLUTION_QUERY_ERRORS.CAPCHA_NOT_READY
    );

    mockedSolveRequest.mockImplementationOnce(() =>
      Promise.resolve(MOCK_SOLVE_REQUEST_ID)
    );
    mockedSolutionQuery
      .mockImplementationOnce(() =>
        Promise.reject(expectedQueryError)
      )
      .mockImplementationOnce(() =>
        Promise.resolve(MOCK_ANSWER_TOKEN)
      );

    const solveRecaptchaV2Promise = solveRecaptchaV2(
      MOCK_API_KEY,
      MOCK_GKEY,
      MOCK_CAPTCHA_URL
    );

    await Promise.resolve(); // network request tick
    await Promise.resolve(); // first query timeout started tick
    jest.runAllTimers();
    await Promise.resolve(); // event emission tick
    await Promise.resolve(); // subsequent query timeout started tick
    jest.runAllTimers();
    await Promise.resolve(); // network request tick
    await Promise.resolve(); // event emission tick
    return expect(solveRecaptchaV2Promise).resolves.toEqual(
      MOCK_ANSWER_TOKEN
    );
  });

  it.each(SOLVE_REQUEST_ERRORS)(
    'rejects when initial solve request fails due to %s',
    (solveRequestError) => {
      const expectedError = new RecaptchaV2SolveRequestApiError(
        solveRequestError
      );
      mockedSolveRequest.mockImplementationOnce(() =>
        Promise.reject(expectedError)
      );

      const solveRecaptchaV2Promise = solveRecaptchaV2(
        MOCK_API_KEY,
        MOCK_GKEY,
        MOCK_CAPTCHA_URL
      );

      return expect(solveRecaptchaV2Promise).rejects.toEqual(
        expectedError
      );
    }
  );

  it.each(SOLUTION_QUERY_ERRORS)(
    'rejects when solution query fails due to %s',
    async (solveRequestError) => {
      const expectedError = new RecaptchaV2SolutionQueryApiError(
        solveRequestError
      );
      mockedSolveRequest.mockImplementationOnce(() =>
        Promise.resolve(MOCK_SOLVE_REQUEST_ID)
      );
      mockedSolutionQuery.mockImplementationOnce(() =>
        Promise.reject(expectedError)
      );

      const solveRecaptchaV2Promise = solveRecaptchaV2(
        MOCK_API_KEY,
        MOCK_GKEY,
        MOCK_CAPTCHA_URL
      );

      await Promise.resolve(); // network request tick
      await Promise.resolve(); // first query timeout started tick
      jest.runAllTimers();
      await Promise.resolve(); // event emission tick

      return expect(solveRecaptchaV2Promise).rejects.toEqual(
        expectedError
      );
    }
  );
});
