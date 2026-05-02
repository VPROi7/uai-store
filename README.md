# UAI Store API

Portfolio QA Engineer

API backend para controle de estoque da UAI Store: queijos e doces de leite importados de Minas Gerais.

## Stack

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT
- Zod
- Jest + Supertest
- Swagger/OpenAPI

## Escopo

Backend em desenvolvimento por etapas, com autenticacao, produtos, estoque, historico de movimentacoes e documentacao Swagger.

## Como executar

1. Copie `.env.example` para `.env`.
2. Suba o banco:

```bash
docker compose up -d
```

3. Instale as dependencias:

```bash
npm install
```

4. Gere o Prisma Client:

```bash
npm run prisma:generate
```

5. Rode as migrations:

```bash
npm run prisma:migrate
```

6. Crie o usuario ADMIN inicial:

```bash
npm run prisma:seed
```

Credenciais padrao em desenvolvimento:

```text
email: admin@uaistore.com
senha: admin123
```

7. Rode a API:

```bash
npm run dev
```

## Endpoints iniciais

- `GET /health`
- `POST /auth/login` implementado
- `POST /produtos` implementado para ADMIN
- `GET /produtos` implementado com filtros, ordenacao e paginacao
- `GET /produtos/:id` implementado
- `PUT /produtos/:id` implementado para ADMIN
- `POST /movimentacoes` implementado para ADMIN
- `GET /movimentacoes` implementado para ADMIN

As movimentacoes exigem `motivo`, alem de `produtoId`, `tipo` e `quantidade`.

## Autenticacao

Todos os endpoints, exceto `GET /health` e `POST /auth/login`, exigem o header:

```text
Authorization: Bearer <token>
```

## Documentacao

Com a API rodando, acesse:

```text
http://localhost:3000/docs
```

Para gerar o arquivo OpenAPI estatico:

```bash
npm run swagger:export
```

Arquivo gerado:

```text
docs/openapi.json
```

A documentacao OpenAPI inclui:

- autenticacao JWT;
- schemas de entrada e resposta;
- exemplos de entrada e saida de estoque;
- filtros, ordenacao e paginacao;
- respostas de erro esperadas.

## Qualidade

Entregaveis de QA:

- [Plano de Testes](docs/plano-de-testes.md)
- [Requisitos Funcionais](docs/requisitos-funcionais.md)
- [Requisitos Nao Funcionais](docs/requisitos-nao-funcionais.md)
- [Casos de Teste](docs/casos-de-teste.md)

Comandos de teste:

```bash
npm test
npm run test:mocha
npm run test:all
```

## CI/CD

O projeto possui pipeline no GitHub Actions em `.github/workflows/ci.yml`.

A pipeline executa em `push` e `pull_request` para a branch `main`:

- instala dependencias com `npm ci`;
- gera o Prisma Client;
- valida se `docs/openapi.json` esta sincronizado com o Swagger do codigo;
- executa testes Jest e Mocha/Chai/Supertest;
- roda `npm audit --audit-level=high`.
