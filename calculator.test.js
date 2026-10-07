// Os testes serão adicionados antes de cada implementação (test-first).
// Este ficheiro será preenchido incrementalmente durante o laboratório.
const test = require("node:test");
const assert = require("node:assert/strict");
const { somar } = require("./calculator");
test("somar 2 + 3 deve devolver 5", () => {
assert.equal(somar(2, 3), 5);
});


function somar(a, b) {
return a + b;
}
