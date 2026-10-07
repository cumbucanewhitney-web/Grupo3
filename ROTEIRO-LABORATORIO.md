# Roteiro de Laboratório Prático — Integração Contínua com Git e GitHub Actions

**Projecto:** Calculadora incremental  
**Duração sugerida:** 30–60 minutos  
**Tecnologias:** HTML, CSS, JavaScript, Node.js, Git, GitHub e GitHub Actions  
**Âmbito:** Integração Contínua (CI), testes unitários e build  
**Fora do âmbito:** Deploy, GitHub Pages, ambientes de produção e release automatizada

---

# 1. Introdução, Objetivos e Pré-requisitos

## 1.1. Contexto do laboratório

Neste laboratório, cada grupo desenvolverá uma calculadora de forma incremental. A calculadora evoluirá pelas operações de **soma**, **subtração**, **multiplicação** e **divisão**, incluindo o tratamento do erro de **divisão por zero**.

O foco não é apenas escrever o código: o objectivo principal é observar como uma pipeline de **Integração Contínua (CI)** valida automaticamente cada alteração. O GitHub Actions executará dois tipos de verificação:

1. **Testes Unitários** — executados com `npm test`.
2. **Build** — prepara os ficheiros da aplicação e guarda um artefacto da execução.

> **Importante:** este laboratório termina no build. Não será configurado qualquer mecanismo de deploy.

## 1.2. Objetivos de aprendizagem

No final da sessão, o estudante deverá ser capaz de:

- explicar o papel da **Integração Contínua** num fluxo de desenvolvimento colaborativo;
- utilizar Git e GitHub com **Issues, branches, commits e Pull Requests**;
- aplicar uma abordagem **test-first**, criando o teste antes da implementação;
- interpretar o ciclo **pipeline vermelho → pipeline verde**;
- compreender a estrutura básica de um workflow YAML do **GitHub Actions**;
- configurar eventos `push` e `pull_request`;
- automatizar a execução de **testes unitários**;
- automatizar um **build** e guardar o resultado como artefacto;
- interpretar logs de falha e sucesso no separador **Actions**;
- utilizar **status checks** para impedir a integração de código com CI falhada;
- colaborar através de revisão de código antes do merge para a `main`.

## 1.3. Pré-requisitos obrigatórios antes da aula

Cada estudante deve ter:

- uma conta activa no **GitHub**;
- **Git** instalado e configurado;
- **Node.js 22** ou versão compatível instalado;
- acesso a um terminal: PowerShell, Terminal, Bash ou equivalente;
- conhecimentos básicos de `git add`, `git commit`, `git push` e `git pull`;
- conhecimentos básicos de JavaScript;
- acesso ao repositório GitHub do grupo.

Confirmar localmente:

```bash
git --version
node --version
npm --version
```

Configurar a identidade Git, caso ainda não esteja definida:

```bash
git config --global user.name "Nome do Estudante"
git config --global user.email "email@exemplo.com"
```

## 1.4. Organização sugerida da sessão

- **10–15 min:** preparação do repositório, estrutura inicial e primeira execução da CI;
- **15–30 min:** desenvolvimento incremental das operações;
- **5–15 min:** Pull Requests, revisão, leitura de logs e validação dos checks.

O professor pode distribuir as funcionalidades entre os membros do grupo, mas cada incremento deve respeitar o mesmo fluxo operacional.

---

# 2. Fase 1: Configuração do Repositório e Pipeline Inicial (CI)

## 2.1. Criar o repositório no GitHub

Um integrante do grupo deverá criar um novo repositório no GitHub, por exemplo:

```text
calculadora-github-actions-ci
```

Sugestão de configuração:

- visibilidade definida pelo professor;
- branch principal: `main`;
- sem adicionar ficheiros desnecessários se o projecto será enviado a partir do computador local.

Depois, clonar o repositório:

```bash
git clone URL_DO_REPOSITORIO
cd calculadora-github-actions-ci
```

Caso o projecto seja iniciado localmente:

```bash
git init -b main
git remote add origin URL_DO_REPOSITORIO
```

## 2.2. Proteger a branch `main`

No GitHub, abrir o repositório e aceder a:

**Settings → Branches → Branch protection rules**

Criar uma regra para:

```text
main
```

Activar, no mínimo:

- **Require a pull request before merging**;
- **Require status checks to pass before merging**;
- seleccionar os checks **Testes Unitários** e **Build** assim que estes aparecerem após a primeira execução do workflow.

Recomendado para o laboratório:

- exigir pelo menos uma aprovação antes do merge, quando a configuração do repositório permitir;
- impedir pushes directos para `main`;
- não permitir bypass das regras pelos estudantes.

> Os nomes dos status checks são obtidos a partir dos nomes dos jobs no workflow. Primeiro execute a CI pelo menos uma vez; depois volte à regra de protecção para seleccionar os checks.

## 2.3. Criar a estrutura inicial do projecto

Criar a seguinte estrutura:

```text
calculadora-github-actions-ci/
├── .github/
│   └── workflows/
│       └── ci.yaml
├── index.html
├── style.css
├── app.js
├── calculator.js
├── calculator.test.js
└── package.json
```

O `package.json` pode começar assim:

```json
{
  "name": "calculadora-github-actions-ci",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "node --test"
  }
}
```

No início, `calculator.js` pode conter apenas a estrutura de exportação:

```javascript
// As operações serão implementadas incrementalmente.

if (typeof module !== "undefined" && module.exports) {
  module.exports = {};
}
```

E `calculator.test.js` pode começar sem testes:

```javascript
// Os testes serão adicionados antes de cada implementação.
```

Antes de enviar o código, testar localmente:

```bash
npm test
```

## 2.4. Criar o pipeline no GitHub Actions

Criar exactamente o ficheiro:

```text
.github/workflows/ci.yaml
```

Conteúdo completo e comentado:

```yaml
name: CI - Testes e Build

# Em qualquer push, incluindo feature branches, a CI é executada.
# Isto permite observar o pipeline vermelho antes de abrir o Pull Request.
# Para Pull Requests, a validação é feita quando o destino é a main.
on:
  push:
  pull_request:
    branches:
      - main

# O workflow apenas precisa de ler o conteúdo do repositório.
permissions:
  contents: read

jobs:
  tests:
    name: Testes Unitários
    runs-on: ubuntu-latest

    steps:
      # Faz checkout do commit que disparou o workflow.
      - name: Obter código do repositório
        uses: actions/checkout@v4

      # Instala/configura o Node.js no runner do GitHub Actions.
      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      # Executa os testes definidos no package.json.
      - name: Executar testes unitários
        run: npm test

  build:
    name: Build
    runs-on: ubuntu-latest

    # O build só começa se os testes terminarem com sucesso.
    needs: tests

    steps:
      - name: Obter código do repositório
        uses: actions/checkout@v4

      # Neste projecto estático, o build consiste em preparar
      # os ficheiros que constituem a aplicação.
      - name: Preparar artefacto do site
        run: |
          mkdir -p dist
          cp index.html style.css app.js calculator.js dist/
          test -s dist/index.html
          echo "Build concluído com sucesso."

      # Guarda dist/ como artefacto da execução da CI.
      - name: Guardar artefacto do build
        uses: actions/upload-artifact@v4
        with:
          name: calculadora-${{ github.sha }}
          path: dist/
          retention-days: 7
```

### Nota importante sobre o evento `push`

Neste roteiro, `push` é propositadamente executado em **qualquer branch**. Isto é necessário porque o estudante deve fazer push da feature branch e observar o **pipeline vermelho antes de abrir o Pull Request**.

O evento `pull_request`, por sua vez, está limitado a Pull Requests cujo destino é `main`.

Se fosse usada esta configuração:

```yaml
on:
  push:
    branches:
      - main
```

os pushes para uma feature branch não executariam a CI antes da criação do Pull Request, contrariando o exercício test-first deste laboratório.

## 2.5. Primeiro commit da configuração

Adicionar os ficheiros e criar o commit inicial:

```bash
git add .
git commit -m "Configurar projecto e pipeline de CI"
git push -u origin main
```

No GitHub, abrir:

**Actions → CI - Testes e Build**

Resultado esperado:

```text
Testes Unitários  ✓
Build             ✓
```

No job **Build**, confirmar também que foi criado um artefacto com os ficheiros da pasta `dist/`.

> O workflow não contém qualquer job de deploy.

---

# 3. Fase 2: Metodologia de Desenvolvimento Incremental (Colaboração)

## 3.1. Regra obrigatória para cada funcionalidade

As quatro funcionalidades — **Soma, Subtração, Multiplicação e Divisão** — devem seguir exactamente o mesmo ciclo:

1. criar uma **Issue**;
2. actualizar a `main` local e criar uma **Branch** própria;
3. criar o **1.º commit com o teste**, sem implementação, fazendo o pipeline ficar vermelho;
4. criar o **2.º commit com a implementação**, tornando o pipeline verde;
5. abrir um **Pull Request** para `main` e associar a Issue;
6. pedir revisão a outro colega;
7. efectuar o merge apenas depois da aprovação e de todos os checks estarem verdes.

## 3.2. Passo 1 — Criar uma Issue

No separador **Issues**, criar uma tarefa para a funcionalidade.

Exemplos:

```text
Adicionar operação de soma
Adicionar operação de subtração
Adicionar operação de multiplicação
Adicionar divisão e tratar divisor zero
```

A Issue deve indicar, pelo menos:

- funcionalidade a implementar;
- resultado esperado;
- estudante responsável.

## 3.3. Passo 2 — Criar uma branch a partir da `main` actualizada

Antes de criar a branch:

```bash
git checkout main
git pull origin main
```

Criar a branch da funcionalidade:

```bash
git checkout -b 1-adicionar-soma
```

Para as restantes funcionalidades, por exemplo:

```bash
git checkout -b 2-adicionar-subtracao
git checkout -b 3-adicionar-multiplicacao
git checkout -b 4-adicionar-divisao
```

> Cada branch deve nascer da versão mais recente da `main`.

## 3.4. Passo 3 — 1.º commit: teste primeiro → pipeline vermelho

O primeiro commit da funcionalidade deve alterar **o teste**, não a implementação.

### Soma

Adicionar a `calculator.test.js`:

```javascript
const test = require("node:test");
const assert = require("node:assert/strict");

const { somar } = require("./calculator");

test("somar 2 + 3 deve devolver 5", () => {
  assert.equal(somar(2, 3), 5);
});
```

Sem implementar `somar`, criar commit e push:

```bash
git add calculator.test.js
git commit -m "Adicionar teste de soma"
git push -u origin 1-adicionar-soma
```

No GitHub:

**Actions → CI - Testes e Build → execução mais recente**

Resultado esperado:

```text
Testes Unitários  ✗
Build             não executado / bloqueado pela dependência
```

A falha é intencional. O objectivo é comprovar que a CI detecta código incompleto.

### Subtração

Teste a adicionar antes da implementação:

```javascript
test("subtrair 8 - 3 deve devolver 5", () => {
  assert.equal(subtrair(8, 3), 5);
});
```

### Multiplicação

```javascript
test("multiplicar 4 por 3 deve devolver 12", () => {
  assert.equal(multiplicar(4, 3), 12);
});
```

### Divisão e tratamento de erro

```javascript
test("dividir 10 por 2 deve devolver 5", () => {
  assert.equal(dividir(10, 2), 5);
});

test("dividir por zero deve produzir um erro", () => {
  assert.throws(
    () => dividir(10, 0),
    /Não é possível dividir por zero/
  );
});
```

Em cada funcionalidade, fazer commit e push antes de escrever a função:

```bash
git add .
git commit -m "Adicionar teste da funcionalidade"
git push
```

## 3.5. Passo 4 — 2.º commit: implementar → pipeline verde

Depois de observar a falha, implementar apenas o necessário para fazer o teste passar.

### Soma

```javascript
function somar(a, b) {
  return a + b;
}
```

### Subtração

```javascript
function subtrair(a, b) {
  return a - b;
}
```

### Multiplicação

```javascript
function multiplicar(a, b) {
  return a * b;
}
```

### Divisão com tratamento de divisor zero

```javascript
function dividir(a, b) {
  if (b === 0) {
    throw new Error("Não é possível dividir por zero.");
  }

  return a / b;
}
```

Actualizar também o `module.exports` à medida que as funções forem acrescentadas. Exemplo final:

```javascript
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    somar,
    subtrair,
    multiplicar,
    dividir
  };
}
```

Executar primeiro localmente:

```bash
npm test
```

Depois criar o segundo commit:

```bash
git add .
git commit -m "Implementar soma"
git push
```

Para as outras funções, utilizar mensagens equivalentes, por exemplo:

```bash
git commit -m "Implementar subtração"
git commit -m "Implementar multiplicação"
git commit -m "Implementar divisão e validação por zero"
```

Voltar ao separador **Actions**.

Resultado esperado:

```text
Testes Unitários  ✓
Build             ✓
```

O job **Build** só é iniciado depois de **Testes Unitários** terminar com sucesso, porque o workflow contém:

```yaml
needs: tests
```

## 3.6. Passo 5 — Abrir o Pull Request

Depois do pipeline verde:

1. abrir **Pull requests → New pull request**;
2. definir a base como `main`;
3. seleccionar a feature branch;
4. escrever um resumo claro;
5. indicar como a alteração foi validada;
6. associar a Issue na descrição.

Exemplo de descrição:

```text
## Alterações
- adiciona a operação de soma;
- adiciona teste unitário correspondente;
- CI validada com testes e build.

Closes #1
```

A expressão:

```text
Closes #1
```

faz com que o GitHub encerre a Issue associada quando o Pull Request for integrado na branch principal.

## 3.7. Passo 6 — Revisão por outro colega e merge

Um colega diferente do autor deve:

1. abrir o Pull Request;
2. aceder a **Files changed**;
3. confirmar que existe teste para a nova funcionalidade;
4. rever a implementação;
5. consultar os **Checks**;
6. aprovar através de **Review changes → Approve**.

O merge só deve ser realizado quando:

```text
Revisão do colega       ✓
Testes Unitários        ✓
Build                   ✓
Sem conflitos           ✓
```

Depois do merge, todos os membros devem actualizar a branch principal local:

```bash
git checkout main
git pull origin main
```

Só então começa a funcionalidade seguinte.

---

# 4. Fase 3: Monitorização e Colaboração no GitHub Actions

## 4.1. Monitorizar execuções no separador Actions

Sempre que ocorre um `push`, o GitHub cria uma nova execução do workflow.

Para acompanhar:

1. abrir o repositório;
2. seleccionar **Actions**;
3. abrir o workflow **CI - Testes e Build**;
4. seleccionar a execução correspondente ao commit;
5. abrir o job desejado.

Os dois jobs principais são:

```text
Testes Unitários
Build
```

### Estados mais comuns

- **verde / success** — job concluído com sucesso;
- **vermelho / failure** — algum comando terminou com erro;
- **cinzento / skipped** — job não foi executado, normalmente porque uma dependência falhou;
- **amarelo / in progress** — execução ainda em curso.

## 4.2. Interpretar os logs do pipeline vermelho

No primeiro commit de uma funcionalidade, a falha é esperada.

Exemplo conceptual de erro:

```text
TypeError: somar is not a function
```

ou:

```text
TypeError: subtrair is not a function
```

Para interpretar:

1. abrir o job **Testes Unitários**;
2. expandir o passo **Executar testes unitários**;
3. localizar a primeira mensagem de erro relevante;
4. identificar qual teste falhou;
5. confirmar que a causa corresponde à função ainda não implementada.

Neste momento, **não se deve apagar ou alterar o teste apenas para tornar a CI verde**. O passo correcto é implementar a funcionalidade no segundo commit.

## 4.3. Confirmar o pipeline verde

Depois da implementação, a nova execução deve apresentar:

```text
Testes Unitários  ✓
Build             ✓
```

No job **Testes Unitários**, confirmar que `npm test` terminou com código de saída `0`.

No job **Build**, confirmar:

- criação da pasta `dist/`;
- existência de `dist/index.html`;
- conclusão do passo **Guardar artefacto do build**.

Na página da execução do workflow, o artefacto deverá aparecer associado à execução.

Este artefacto é apenas o resultado do build. **Não é publicado nem enviado para produção.**

## 4.4. Checks dentro do Pull Request

Quando um Pull Request tem como destino `main`, o mesmo workflow é executado pelo evento:

```yaml
pull_request:
  branches:
    - main
```

Dentro do Pull Request, o GitHub apresenta os resultados das verificações na área de **Checks**.

O estudante deve observar os estados de:

```text
Testes Unitários
Build
```

Com a protecção da `main` configurada para exigir status checks, o botão de merge fica bloqueado enquanto existir uma verificação obrigatória com falha ou ainda em execução.

Fluxo esperado:

```text
Push com teste sem implementação
        ↓
Testes Unitários falham
        ↓
Aluno interpreta o log
        ↓
Implementação no segundo commit
        ↓
Testes Unitários passam
        ↓
Build executa e passa
        ↓
Pull Request apresenta checks verdes
        ↓
Colega revê e aprova
        ↓
Merge para main
```

## 4.5. Problemas frequentes

| Problema | Causa provável | Acção recomendada |
|---|---|---|
| Workflow não aparece | ficheiro fora de `.github/workflows/` ou YAML inválido | confirmar o caminho `.github/workflows/ci.yaml` |
| Teste falha no 1.º commit | função ainda não implementada | comportamento esperado; analisar o log e implementar no 2.º commit |
| Build não executa | job de testes falhou | corrigir a implementação/testes; `build` depende de `tests` |
| Pull Request não pode ser integrado | check falhado, revisão em falta ou conflito | corrigir o problema e aguardar novos checks |
| Status check não aparece na Branch Protection | workflow ainda não executou com esse nome | executar a CI uma vez e voltar às definições da regra |
| Branch está desactualizada | outros colegas integraram alterações na `main` | actualizar a branch antes de concluir o PR |

Para actualizar uma feature branch com a `main` mais recente:

```bash
git checkout main
git pull origin main
git checkout NOME_DA_BRANCH
git merge main
```

Resolver eventuais conflitos, testar novamente e fazer push.

## 4.6. Checklist final do laboratório

Antes de considerar a actividade concluída, o grupo deve confirmar:

- [ ] repositório criado no GitHub;
- [ ] `main` protegida contra integração sem Pull Request e sem checks verdes;
- [ ] `.github/workflows/ci.yaml` presente;
- [ ] nenhum `.gitlab-ci.yml` presente;
- [ ] nenhuma configuração de deploy presente;
- [ ] job **Testes Unitários** executa `npm test`;
- [ ] job **Build** gera `dist/` e guarda um artefacto;
- [ ] uma Issue foi criada para cada funcionalidade;
- [ ] cada branch foi criada a partir da `main` actualizada;
- [ ] pipeline vermelho observado depois do commit de teste;
- [ ] pipeline verde observado depois da implementação;
- [ ] Pull Requests associados às Issues com `Closes #N`;
- [ ] revisão realizada por outro colega;
- [ ] merge realizado apenas com os checks verdes;
- [ ] soma, subtração, multiplicação e divisão funcionam;
- [ ] divisão por zero produz erro controlado;
- [ ] versão final continua limitada a **CI: testes + build**, sem deploy.

---

**Resultado esperado da sessão:** a turma termina com um repositório GitHub colaborativo no qual todas as alterações são verificadas automaticamente por testes unitários e build antes de serem integradas na `main`.
