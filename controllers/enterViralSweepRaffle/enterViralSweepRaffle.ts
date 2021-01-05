import puppeteer from 'puppeteer';

import { solveRecaptchaV2 } from '../solveRecaptchaV2';
import { Profile } from '../../models';
import fillInputFields, { TextInputsData } from './fillInputFields';

interface EnterViralSweepRaffleArgs {
  profile: Profile;
  email: string;
  formUrl: string;
  captchaApiKey: string;
  shoeSize: number;
}

const enterViralSweepRaffle = async (
  raffleArgs: EnterViralSweepRaffleArgs
) => {
  const {
    profile,
    email,
    formUrl,
    captchaApiKey,
    shoeSize
  } = raffleArgs;

  const browser = puppeteer.launch({ headless: false });
  const page = await (await browser).newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });
  });

  await page.goto(formUrl, { waitUntil: 'networkidle0' });

  const { generalInfo, shippingInfo } = profile;
  const { firstName, lastName } = generalInfo;
  const { streetAddress, city, province, postalCode } = shippingInfo;
  const textInputData = {
    firstName,
    lastName,
    streetAddress,
    city,
    province,
    postalCode,
    email,
    shoeSize
  };

  await page.evaluate(fillInputFields, textInputData);

  const captchaDivContainer = await page.$('[data-tep="captcha"]');
  const formContainsCaptcha = Boolean(captchaDivContainer);

  if (formContainsCaptcha) {
    const getSiteKeyAttribute = (element: Element) =>
      element.getAttribute('data-sitekey');
    const googleSiteKey = (await page.$eval(
      '.g-recaptcha',
      getSiteKeyAttribute
    )) as string;

    const processCaptchaAnswerToken = async (answerToken: string) => {
      const setCaptchaSolution = (answerToken: string) => {
        const captchaSolutionInput = document.querySelector(
          'textarea#g-recaptcha-response'
        ) as HTMLElement;
        const captchaWrapper = document.querySelector(
          '.captcha_wrapper'
        );
        captchaSolutionInput!.innerHTML = answerToken;
        captchaSolutionInput!.style.display = 'block';
        captchaWrapper?.classList.add('valid');
      };

      await page.evaluate(setCaptchaSolution, answerToken);
      await page.click('a.submit');
    };

    return solveRecaptchaV2(
      captchaApiKey,
      googleSiteKey,
      formUrl
    ).then(processCaptchaAnswerToken);
  }

  await page.click('a.submit');
};

export default enterViralSweepRaffle;
export { EnterViralSweepRaffleArgs };
