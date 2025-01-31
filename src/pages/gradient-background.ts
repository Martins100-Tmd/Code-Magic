import {
  getNewColorButton,
  getAllInputElements,
  getRange,
  getOutput,
  getCopyCodeButton,
  getResultPage,
  getRemoveNewColorButton,
  getResetButton,
  getDegreeSpanElement,
  getGradientPreview,
  getTailwindButton,
} from '../lib/getElements';
import {
  copyCSSCodeToClipboard,
  showPopup,
  whatColorButtonShouldShow,
  addNewColorPicker,
  removeColorPicker,
  setGradientDegreeValue,
  createGradientPreview,
  getColorsValue,
  copyTailwindCodeToClipboard,
} from '../lib/packages';

type Values = {
  degree: string;
};

const attribute = 'gradient-background';

const getNewColorButtonElement = getNewColorButton(attribute);
const getRemoveColorButtonElement = getRemoveNewColorButton(attribute);

let gradientBackgroundInputs = getAllInputElements('gradient-background');

const getDegreeElement = getRange(attribute);
const resetButton = getResetButton(attribute);

function copyHandler() {
  const outputElement = getOutput(attribute);
  copyCSSCodeToClipboard(attribute, outputElement);
  showPopup(
    'Code Copied',
    'Code has been successfully copied to clipboard',
    'success'
  );
}

/**
 * sets the result to the output element
 *
 * @param attribute attribute name of the generator
 * @param values object that contains all values entered by users
 * @param outputElement output element to display result
 */
function getGradientBackgroundResult(
  attribute: string,
  values: Values,
  outputElement: HTMLElement
): void {
  outputElement.style.background = `linear-gradient(${
    values.degree
  }deg, ${getColorsValue(attribute).join(', ')})`;

  const getCodeButtonElement = getCopyCodeButton(attribute);
  getCodeButtonElement.addEventListener('click', copyHandler);
  const getTailwindCodeButtonElement = getTailwindButton(attribute);
  getTailwindCodeButtonElement.addEventListener('click', tailwindHandler);
}

export function gradientBackgroundGenerator(
  type: 'newResults' | 'oldResults' | null
) {
  if (type === null) return;

  const getOutputElement = getOutput(attribute);
  const resultPage = getResultPage();

  resultPage.style.display = 'flex';
  if (type === 'oldResults') return;

  const values: Values = {
    degree: getDegreeElement.value,
  };
  getGradientBackgroundResult(attribute, values, getOutputElement);
}

export function addGradientBackgroundListener() {
  whatColorButtonShouldShow(attribute);
  getNewColorButtonElement.addEventListener('click', () => {
    addNewColorPicker(attribute);
    addEventListenerToTheNewColorPicker();
  });

  getRemoveColorButtonElement.addEventListener('click', () => {
    removeColorPicker(attribute);
    addEventListenerToTheNewColorPicker();
  });

  inputEventListner();

  setGradientDegreeValue(getDegreeElement);
}

function addEventListenerToTheNewColorPicker() {
  gradientBackgroundInputs = getAllInputElements(attribute);
  inputEventListner();
  if (resetButton.classList.contains('reset-show')) return;
  resetButton.classList.add('reset-show');
}

function inputEventListner() {
  gradientBackgroundInputs.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      createGradientPreview(getDegreeElement, attribute);
    });
  });
}

// reset the values of all target fields
function resetValues() {
  const colorInput: HTMLInputElement[] = [...new Set([])];

  resetButton.addEventListener('click', () => {
    resetButton.classList.remove('reset-show');
    getDegreeSpanElement(attribute).innerHTML = 'deg';

    getGradientPreview(attribute).style.background = '';

    gradientBackgroundInputs.forEach((input) => {
      input.value = input.defaultValue;

      if (input.id.includes('color')) {
        colorInput.push(input);
      }
    });

    if (colorInput.length > 2) {
      for (let i = 2; i < colorInput.length; i++) {
        removeColorPicker(attribute);
      }
    }
  });
}

// get values from all targets to get notified when values change.

function getValues() {
  gradientBackgroundInputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (input.value === '') return;

      if (resetButton.classList.contains('reset-show')) return;
      resetButton.classList.add('reset-show');
    });
  });
}
resetValues();
getValues();

// Tailwind codecopy handler
function tailwindHandler() {
  copyTailwindCodeToClipboard(attribute);
  showPopup(
    'Tailwind Code Copied',
    'Code has been successfully copied to clipboard',
    'success'
  );
}
