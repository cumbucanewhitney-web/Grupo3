const display = document.getElementById("display");
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const clearButton = document.querySelector('[data-action="clear"]');
const equalsButton = document.querySelector('[data-action="equals"]');

let currentValue = "0";
let firstValue = null;
let selectedOperation = null;
let replaceDisplay = false;

function updateDisplay(value = currentValue) {
  display.textContent = value;
}

function clearCalculator() {
  currentValue = "0";
  firstValue = null;
  selectedOperation = null;
  replaceDisplay = false;
  updateDisplay();
}

function appendNumber(number) {
  if (replaceDisplay) {
    currentValue = number === "." ? "0." : number;
    replaceDisplay = false;
  } else if (number === "." && currentValue.includes(".")) {
    return;
  } else if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  updateDisplay();
}

function calculate(a, b, operation) {
  switch (operation) {
    case "+":
      return somar(a, b);
    case "-":
      return subtrair(a, b);
    case "*":
      return multiplicar(a, b);
    default:
      throw new Error("Operação indisponível.");
  }
}

numberButtons.forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.dataset.number));
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    firstValue = Number(currentValue);
    selectedOperation = button.dataset.operation;
    replaceDisplay = true;
  });
});

equalsButton.addEventListener("click", () => {
  if (firstValue === null || selectedOperation === null) return;

  try {
    const result = calculate(firstValue, Number(currentValue), selectedOperation);
    currentValue = String(result);
    updateDisplay();
    firstValue = null;
    selectedOperation = null;
    replaceDisplay = true;
  } catch (error) {
    updateDisplay(error.message);
    firstValue = null;
    selectedOperation = null;
    currentValue = "0";
    replaceDisplay = true;
  }
});

clearButton.addEventListener("click", clearCalculator);
updateDisplay();
