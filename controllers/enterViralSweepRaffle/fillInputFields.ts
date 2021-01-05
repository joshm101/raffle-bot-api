interface TextInputsData {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  province: string;
  shoeSize: number;
}

const fillInputFields = (textInputData: TextInputsData) => {
  const fillTextInputs = (data: TextInputsData) => {
    const {
      firstName,
      lastName,
      email,
      streetAddress,
      city,
      province,
      postalCode
    } = data;

    const firstNameInputElement = document.getElementsByName(
      'first_name'
    )[0] as HTMLInputElement;
    const lastNameInputElement = document.getElementsByName(
      'last_name'
    )[0] as HTMLInputElement;
    const emailInputElement = document.getElementsByName(
      'email'
    )[0] as HTMLInputElement;
    const addressInputElement = document.getElementsByName(
      'address'
    )[0] as HTMLInputElement;
    const cityInputElement = document.getElementsByName(
      'city'
    )[0] as HTMLInputElement;
    const stateSelectElement = document.getElementsByName(
      'state'
    )[0] as HTMLSelectElement;
    const postalCodeInputElement = document.getElementsByName(
      'zip'
    )[0] as HTMLInputElement;

    emailInputElement!.value = email;

    if (firstNameInputElement) {
      firstNameInputElement.value = firstName;
    }
    if (lastNameInputElement) {
      lastNameInputElement.value = lastName;
    }

    if (addressInputElement) {
      addressInputElement.value = streetAddress;
    }

    if (cityInputElement) {
      cityInputElement.value = city;
    }

    if (stateSelectElement) {
      stateSelectElement.value = province;
    }

    if (postalCodeInputElement) {
      postalCodeInputElement.value = postalCode;
    }
  };

  const fillRadioFormElements = () => {
    const radioFormElements = document.querySelectorAll('div.radio');

    const selectCorrectRadioOption = (
      radioInputElementCluster: Element
    ) => {
      const matchesRequiredAttributeValue = (
        radioInputElement: HTMLInputElement
      ) => {
        const value = radioInputElement.getAttribute('value');
        const requiredValue = radioInputElement.getAttribute(
          'data-req-val'
        );

        return value === requiredValue;
      };

      const radioInputElements = Array.from(
        radioInputElementCluster.querySelectorAll(
          'input[type="radio"]'
        )
      ) as HTMLInputElement[];

      const correctOption = radioInputElements.find(
        matchesRequiredAttributeValue
      );

      correctOption?.click();
    };

    Array.from(radioFormElements).forEach(selectCorrectRadioOption);
  };

  const fillRequiredCheckboxes = () => {
    const checkboxes = Array.from(
      document.querySelectorAll('input[type="checkbox"]')
    ) as HTMLInputElement[];

    const checkboxIsRequired = (checkbox: HTMLInputElement) =>
      checkbox.classList.contains('is_required');
    const requiredCheckboxes = checkboxes.filter(checkboxIsRequired);

    const checkCheckbox = (checkbox: HTMLInputElement) => {
      checkbox.checked = true;
    };
    requiredCheckboxes.forEach(checkCheckbox);
  };

  const getDropdownClusters = () =>
    Array.from(document.querySelectorAll('div.dropdown'));

  const fillStyleDropdown = () => {
    const dropdownClusters = getDropdownClusters();

    const dropdownClusterHasStyleLabel = (
      dropdownCluster: Element
    ) => {
      const label = dropdownCluster.querySelector('label');
      return label!.innerHTML.includes('Style');
    };
    const styleDropdownCluster = dropdownClusters.find(
      dropdownClusterHasStyleLabel
    );

    // there may not always be a style dropdown
    if (styleDropdownCluster) {
      const selectElement = styleDropdownCluster.querySelector(
        'select'
      );

      const requiredSelectValue = selectElement?.getAttribute(
        'data-req-val'
      );
      selectElement!.value = `${requiredSelectValue}`;
    }
  };

  const fillSizeDropdown = (size: number) => {
    const dropdownClusters = getDropdownClusters();

    const dropdownClusterHasSizeLabel = (
      dropdownCluster: Element
    ) => {
      const label = dropdownCluster.querySelector('label');
      return label!.innerHTML.includes('Size');
    };
    const sizeDropdownCluster = dropdownClusters.find(
      dropdownClusterHasSizeLabel
    );

    // there should always be a size dropdown
    const selectElement = sizeDropdownCluster?.querySelector(
      'select'
    );
    selectElement!.value = size.toString();
  };

  const { shoeSize } = textInputData;

  fillTextInputs(textInputData);
  fillStyleDropdown();
  fillSizeDropdown(shoeSize);
  fillRadioFormElements();
  fillRequiredCheckboxes();
};

export default fillInputFields;
export { TextInputsData };
