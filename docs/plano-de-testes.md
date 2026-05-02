# Plano de Testes - UAI Store API

## 1. Objetivo

Definir a estrategia de testes da API backend da UAI Store, garantindo que os requisitos de autenticacao, autorizacao, produtos, estoque e historico de movimentacoes sejam validados de forma funcional, segura e consistente.

## 2. Escopo Dos Testes

Serao testados os seguintes modulos:

- Autenticacao JWT.
- Controle de permissao por perfil `ADMIN` e `CLIENTE`.
- Cadastro, consulta e atualizacao de produtos.
- Inativacao de produtos.
- Entrada e saida de estoque.
- Historico de movimentacoes.
- Validacoes de dados obrigatorios.
- Regras de consistencia e transacao.

Fora do escopo:

- Vendas.
- Relatorios.
- Dashboard.
- Frontend.
- Perfis de usuario customizados.
- Integracoes externas.

## 3. Itens De Teste

| Item | Descricao | Endpoints |
| --- | --- | --- |
| Autenticacao | Login e emissao de token JWT | `POST /auth/login` |
| Produtos | Cadastro, listagem, consulta e atualizacao | `POST /produtos`, `GET /produtos`, `GET /produtos/{id}`, `PUT /produtos/{id}` |
| Estoque | Entrada e saida via movimentacao | `POST /movimentacoes` |
| Historico | Consulta de movimentacoes | `GET /movimentacoes` |
| Seguranca | JWT valido, invalido, expirado e perfis | Todos exceto `/auth/login` e `/health` |

## 4. Tipos De Teste

### 4.1 Testes Funcionais

Validam se os endpoints cumprem as regras de negocio.

Exemplos:

- Produto nao pode ser cadastrado com preco menor ou igual a zero.
- Produto ativo nao pode ter nome duplicado.
- Saida de estoque nao pode exceder quantidade disponivel.
- CLIENTE nao pode cadastrar produto.

### 4.2 Testes De API

Validam status HTTP, contratos de request/response e mensagens de erro.

Exemplos:

- `POST /auth/login` retorna `200` com token em credenciais validas.
- `GET /produtos` retorna lista paginada.
- `POST /movimentacoes` retorna `201` ao registrar entrada.

### 4.3 Testes De Seguranca

Validam autenticacao e autorizacao.

Exemplos:

- Rota protegida sem token deve retornar `401`.
- Token invalido deve retornar `401`.
- Usuario `CLIENTE` tentando acessar rota de `ADMIN` deve retornar `403`.

### 4.4 Testes De Integridade De Dados

Validam consistencia de estoque e historico.

Exemplos:

- Estoque nao pode ficar negativo.
- Movimentacao deve gerar registro de historico.
- Historico nao deve possuir rota de alteracao ou exclusao.

### 4.5 Testes De Concorrencia

Validam operacoes simultaneas de estoque.

Exemplos:

- Duas saidas simultaneas nao podem resultar em estoque negativo.
- Apenas uma operacao deve confirmar quando o estoque disponivel nao for suficiente para ambas.

### 4.6 Testes Nao Funcionais

Validam aspectos de qualidade da API.

Exemplos:

- Tempo de resposta aceitavel para listagens paginadas.
- API nao deve expor senha ou hash de senha em respostas.
- Documentacao Swagger deve estar acessivel em `/docs`.

## 5. Ambiente De Teste

Ambiente local:

- Node.js.
- Express.
- PostgreSQL via Docker Compose.
- Prisma ORM.
- Jest.
- Supertest.

Banco de dados:

- Base local isolada para desenvolvimento.
- Base especifica para testes de integracao quando aplicavel.

## 6. Criterios De Entrada

Os testes podem iniciar quando:

- Dependencias instaladas com `npm install`.
- Prisma Client gerado com `npm run prisma:generate`.
- Banco PostgreSQL disponivel.
- Migrations aplicadas.
- Usuario ADMIN inicial criado via seed.
- Variaveis de ambiente configuradas.

## 7. Criterios De Saida

A etapa de testes sera considerada concluida quando:

- Todos os testes automatizados passarem.
- Regras criticas RN-017, RN-018 e RN-019 estiverem cobertas.
- Fluxos principais de produto e estoque forem validados.
- Nao houver defeitos criticos abertos.
- Swagger estiver coerente com a implementacao.

## 8. Estrategia De Automacao

Ferramentas:

- Jest para execucao dos testes.
- Supertest para chamadas HTTP.
- Mocks de repositorios em testes funcionais isolados.

Comando:

```bash
npm test
```

Cobertura automatizada atual:

- Health check.
- Login com sucesso.
- Login invalido.
- Rota protegida sem token.
- Cadastro de produto.
- Produto duplicado.
- Validacao de preco.
- Permissao de CLIENTE em produto.
- Listagem de produtos.
- Ocultacao de produto inativo para CLIENTE.
- Atualizacao de produto.
- Bloqueio de alteracao de ID.
- Entrada de estoque.
- Quantidade invalida em movimentacao.
- Saida maior que estoque.
- Produto inexistente em movimentacao.
- Permissao de CLIENTE em movimentacao.
- Listagem de historico.

## 9. Matriz De Riscos

| Risco | Impacto | Probabilidade | Mitigacao |
| --- | --- | --- | --- |
| Estoque negativo por concorrencia | Alto | Media | Transacao `Serializable` e lock no produto |
| Acesso indevido por perfil | Alto | Media | Testes de autorizacao e middleware centralizado |
| Token invalido aceito | Alto | Baixa | Testes de JWT invalido e expirado |
| Produto duplicado ativo | Medio | Media | Validacao antes do cadastro e atualizacao |
| Historico inconsistente | Alto | Media | Criacao de historico dentro da mesma transacao |
| Swagger divergente da API | Medio | Media | Revisao a cada alteracao de endpoint |

## 10. Regras De Negocio Cobertas

| Regra | Status |
| --- | --- |
| RN-001 Cadastro de Produto | Coberta parcialmente por testes automatizados |
| RN-002 Atualizacao de Produto | Coberta parcialmente por testes automatizados |
| RN-003 Inativacao de Produto | Pendente de caso especifico automatizado |
| RN-004 Listagem de Produtos | Coberta parcialmente por testes automatizados |
| RN-005 Busca de Produtos | Coberta parcialmente por testes automatizados |
| RN-006 Regra Geral de Estoque | Coberta parcialmente por implementacao e testes |
| RN-007 Entrada de Estoque | Coberta por teste automatizado |
| RN-008 Saida de Estoque | Coberta parcialmente por testes automatizados |
| RN-009 Registro de Movimentacao | Coberta parcialmente por testes automatizados |
| RN-010 Integridade do Historico | Coberta por ausencia de rotas de update/delete |
| RN-011 Cadastro de Usuario | Coberta via seed inicial, endpoint fora do escopo fechado |
| RN-012 Autenticacao | Coberta por testes automatizados |
| RN-013 Rotas Protegidas | Coberta parcialmente por testes automatizados |
| RN-014 Controle de Permissao | Coberta parcialmente por testes automatizados |
| RN-015 Consistencia de Dados | Coberta por transacao, pendente teste de integracao |
| RN-016 Concorrencia de Estoque | Implementada, pendente teste especifico |
| RN-017 Validacoes de Produto | Coberta parcialmente por testes automatizados |
| RN-018 Validacoes de Estoque | Coberta parcialmente por testes automatizados |
| RN-019 Validacoes de Seguranca | Coberta parcialmente por testes automatizados |

## 11. Defeitos E Evidencias

Defeitos encontrados durante a execucao devem registrar:

- ID do defeito.
- Titulo.
- Passos para reproduzir.
- Resultado esperado.
- Resultado obtido.
- Severidade.
- Evidencia.
- Status.

Exemplo:

| ID | Titulo | Severidade | Status |
| --- | --- | --- | --- |
| BUG-001 | Saida permite estoque negativo | Critica | Aberto |

## 12. Proximas Acoes De QA

- Manter Requisitos Funcionais e Nao Funcionais atualizados a cada mudanca de escopo.
- Manter Casos de Teste rastreados aos requisitos.
- Adicionar testes de token invalido e expirado.
- Adicionar teste especifico de inativacao.
- Adicionar teste de concorrencia real com banco PostgreSQL.
- Adicionar pipeline CI para executar `npm run test:all`.
