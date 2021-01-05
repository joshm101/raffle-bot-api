import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

import fillInputFields, { TextInputsData } from './fillInputFields';

describe('fillInputFields', () => {
  beforeEach(() => {
    const html = fs
      .readFileSync(path.resolve(__dirname, './mockRaffleForm.html'))
      .toString();
    const dom = new JSDOM(html);
    global.document = dom.window.document;
  });

  const inputData: TextInputsData = {
    firstName: 'Kanye',
    lastName: 'West',
    email: 'kanye@whitehouse.gov',
    streetAddress: '1600 Pennsylvania Ave',
    city: 'Washington',
    province: 'District of Columbia',
    postalCode: '20500',
    shoeSize: 10
  };

  it('fills in entrant data', () => {
    const emailInput = document.querySelector(
      '[name="email"]'
    ) as HTMLInputElement;
    const addressInput = document.querySelector(
      '[name="address"]'
    ) as HTMLInputElement;
    const cityInput = document.querySelector(
      '[name="city"]'
    ) as HTMLInputElement;
    const stateInput = document.querySelector(
      '[name="state"]'
    ) as HTMLInputElement;
    const dropdowns = Array.from(
      document.querySelectorAll('.dropdown')
    );
    const sizeDropdown = dropdowns.find((dropdown) => {
      const label = dropdown.querySelector('label');
      return label!.innerHTML.includes('Size');
    });
    const sizeSelectInput = sizeDropdown!.querySelector(
      'select'
    ) as HTMLSelectElement;

    fillInputFields(inputData);

    expect(emailInput.value).toBe(inputData.email);
    expect(addressInput.value).toBe(inputData.streetAddress);
    expect(cityInput.value).toBe(inputData.city);
    expect(stateInput.value).toBe(inputData.province);
    expect(sizeSelectInput.value).toBe(inputData.shoeSize.toString());
  });

  it('it checks required checkboxes', () => {
    const checkboxes = Array.from(
      document.querySelectorAll('input[type="checkbox"]')
    ) as HTMLInputElement[];

    const checkboxIsRequired = (checkbox: HTMLInputElement) =>
      checkbox.classList.contains('is_required');
    const requiredCheckboxes = checkboxes.filter(checkboxIsRequired);

    fillInputFields(inputData);

    requiredCheckboxes.forEach((checkbox) => {
      expect(checkbox.checked).toBe(true);
    });
  });

  it('selects correct radio option for trivia question check', () => {
    const radios = Array.from(
      document.querySelectorAll('input[type="radio"]')
    ) as HTMLInputElement[];

    const correctRadio = radios.find(
      (radio) => radio.value === radio.getAttribute('data-req-val')
    );

    fillInputFields(inputData);

    expect(correctRadio!.checked).toBe(true);
  });
});
