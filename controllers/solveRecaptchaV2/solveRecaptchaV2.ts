import { EventEmitter } from 'events';
import {
  submitRecaptchaV2SolveRequest,
  submitRecaptchaV2SolutionQuery,
  RecaptchaV2SolutionQueryError,
  CAPTCHA_SOLUTION_QUERY_ERRORS,
  RecaptchaV2SolutionQueryApiError,
  RecaptchaV2SolveRequestApiError
} from '../../services/2captcha';

const {
  CAPCHA_NOT_READY: CAPTCHA_SOLUTION_NOT_READY
} = CAPTCHA_SOLUTION_QUERY_ERRORS;

const CAPTCHA_SOLUTION_QUERY_ERROR = 'CAPTCHA_SOLUTION_QUERY_ERROR';
const CAPTCHA_SOLUTION_READY = 'CAPTCHA_SOLUTION_READY';
const CAPTCHA_REQUEST_ID_RETRIEVED = 'CAPTCHA_REQUEST_ID_RETRIEVED';

const FIRST_QUERY_WAIT_TIME = 15000; // ms
const SUBSEQUENT_QUERY_WAIT_TIME = 5000; // ms

const solveRecaptchaV2Events = new EventEmitter();

const solveRecaptchaV2 = (
  captchaApiKey: string,
  googleKey: string,
  pageUrl: string
) => {
  return new Promise((resolve: (value: string) => void, reject) => {
    const state = { solveRequestId: '' };

    const cleanupEventListeners = () => {
      solveRecaptchaV2Events.eventNames().forEach((eventName) => {
        solveRecaptchaV2Events.removeAllListeners(eventName);
      });
    };

    const makeQueryRequest = () => {
      const { solveRequestId } = state;
      submitRecaptchaV2SolutionQuery(captchaApiKey, solveRequestId)
        .then((captchaAnswerToken: string) =>
          solveRecaptchaV2Events.emit(
            CAPTCHA_SOLUTION_READY,
            captchaAnswerToken
          )
        )
        .catch((error) =>
          solveRecaptchaV2Events.emit(
            CAPTCHA_SOLUTION_QUERY_ERROR,
            error
          )
        );
    };

    const waitThenQuery = (waitTime: number) => () => {
      setTimeout(makeQueryRequest, waitTime);
    };

    const processQueryApiError = (
      error: RecaptchaV2SolutionQueryApiError
    ) => {
      const { message } = error;
      if (message === CAPTCHA_SOLUTION_NOT_READY) {
        solveRecaptchaV2Events.emit(CAPTCHA_SOLUTION_NOT_READY);
        return;
      }

      cleanupEventListeners();
      reject(error);
    };

    const handleCaptchaSolutionQueryErrorEvent = (
      error: RecaptchaV2SolutionQueryError
    ) => {
      const isApiError =
        error instanceof RecaptchaV2SolutionQueryApiError;

      if (isApiError) {
        return processQueryApiError(error);
      }

      cleanupEventListeners();
      return reject(error);
    };

    const onCaptchaSolutionReady = (answerToken: string) => {
      resolve(answerToken);
      cleanupEventListeners();
      return;
    };

    solveRecaptchaV2Events.on(
      CAPTCHA_SOLUTION_QUERY_ERROR,
      handleCaptchaSolutionQueryErrorEvent
    );
    solveRecaptchaV2Events.on(
      CAPTCHA_SOLUTION_NOT_READY,
      waitThenQuery(SUBSEQUENT_QUERY_WAIT_TIME)
    );
    solveRecaptchaV2Events.on(
      CAPTCHA_REQUEST_ID_RETRIEVED,
      waitThenQuery(FIRST_QUERY_WAIT_TIME)
    );
    solveRecaptchaV2Events.on(
      CAPTCHA_SOLUTION_READY,
      onCaptchaSolutionReady
    );

    const onCaptchaSolveRequestSuccess = (solveRequestId: string) => {
      state.solveRequestId = solveRequestId;
      solveRecaptchaV2Events.emit(CAPTCHA_REQUEST_ID_RETRIEVED);
      return;
    };

    const onSolveRequestError = (
      solveRequestError: RecaptchaV2SolveRequestApiError
    ) => {
      cleanupEventListeners();
      reject(solveRequestError);
      return;
    };

    submitRecaptchaV2SolveRequest(captchaApiKey, googleKey, pageUrl)
      .catch(onSolveRequestError)
      .then(onCaptchaSolveRequestSuccess);
  });
};

export default solveRecaptchaV2;
