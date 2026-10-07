function somar(a, b) {
  return a + b;
}

function subtrair(a, b) {
  return a - b;
}

function multiplicar(a, b) {
  return a * b;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    somar,
    subtrair,
    multiplicar
  };
}
