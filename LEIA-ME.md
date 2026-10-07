# Calculadora — ficheiros por etapa (GitHub Actions)

Cada pasta é um snapshot completo do projecto num momento do laboratório.

1. Comece com `00-configuracao-inicial` para criar a estrutura e validar a CI.
2. Para cada funcionalidade (`01-soma`, `02-subtracao`, `03-multiplicacao`, `04-divisao`), copie primeiro o snapshot `01-...pipeline-vermelho`, faça commit/push e observe a falha em **Actions**.
3. Depois copie `02-implementacao-pipeline-verde`, faça novo commit/push e confirme os dois checks verdes.
4. Abra o **Pull Request** para `main`, associe a Issue com `Closes #N`, peça revisão a outro colega e faça merge apenas com os checks aprovados.
5. `05-versao-final-ci` representa o estado final integrado, ainda **sem deploy**.

## Workflow

Todos os snapshots usam apenas:

- `.github/workflows/ci.yaml`
- job **Testes Unitários** (`npm test`)
- job **Build** (gera `dist/` e faz upload do artefacto)

Não existem ficheiros `.gitlab-ci.yml`, workflows de deploy ou configuração de GitHub Pages.
