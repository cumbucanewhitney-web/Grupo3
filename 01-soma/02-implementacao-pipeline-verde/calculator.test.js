const test = require("node:test");

const assert = require("node:assert/strict");

const {
  somar
} = require("./calculator");

test("somar 2 + 3 deve devolver 5", () => {
  assert.equal(somar(2, 3), 5);
});
