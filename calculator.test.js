const test = require("node:test");

const assert = require("node:assert/strict");

const {
  somar,
  subtrair,
  multiplicar,
  dividir
} = require("./calculator");

test("somar 2 + 3 deve devolver 5", () => {
  assert.equal(somar(2, 3), 5);
});

test("subtrair 8 - 3 deve devolver 5", () => {
  assert.equal(subtrair(8, 3), 5);
});

test("multiplicar 4 por 3 deve devolver 12", () => {
  assert.equal(multiplicar(4, 3), 12);
});

test("dividir 10 por 2 deve devolver 5", () => {
  assert.equal(dividir(10, 2), 5);
});

test("dividir por zero deve produzir um erro", () => {
  assert.throws(
    () => dividir(10, 0),
    /Não é possível dividir por zero/
  );
});
