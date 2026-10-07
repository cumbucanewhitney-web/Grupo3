const test = require("node:test");

const assert = require("node:assert/strict");

const {
  somar,
  subtrair
} = require("./calculator");

test("somar 2 + 3 deve devolver 5", () => {
  assert.equal(somar(2, 3), 5);
});

test("subtrair 8 - 3 deve devolver 5", () => {
  assert.equal(subtrair(8, 3), 5);
});
