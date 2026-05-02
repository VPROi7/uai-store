# Requisitos Nao Funcionais - UAI Store API

## RNF-001 - Seguranca

O sistema deve proteger rotas privadas com JWT e senha armazenada com hash criptografico.

Critérios:

- Senha nao deve ser retornada em respostas.
- Hash de senha nao deve ser retornado em respostas.
- Token invalido ou expirado deve ser rejeitado.

## RNF-002 - Consistencia

O sistema deve manter consistencia nas operacoes de estoque.

Critérios:

- Entrada e saida de estoque devem ocorrer em transacao.
- Falha em movimentacao nao deve persistir alteracao parcial.
- Operacoes simultaneas nao podem gerar estoque negativo.

## RNF-003 - Auditabilidade

O sistema deve manter historico das movimentacoes e das alteracoes relevantes de produto.

Critérios:

- Movimentacoes devem registrar usuario, produto, tipo, quantidade, motivo e data/hora.
- Historico de movimentacoes nao deve possuir update/delete.
- Atualizacao e inativacao de produto devem registrar historico interno.

## RNF-004 - Manutenibilidade

O codigo deve ser organizado em camadas.

Critérios:

- Controllers devem receber requisicoes e responder HTTP.
- Services devem concentrar regras de negocio.
- Repositories devem concentrar acesso a dados.
- Validations devem concentrar validacoes de entrada.

## RNF-005 - Testabilidade

O sistema deve permitir testes automatizados de API e regras principais.

Critérios:

- Deve possuir testes automatizados basicos.
- Deve permitir mocks de repositories.
- Deve possuir plano e casos de teste documentados.

## RNF-006 - Documentacao

O sistema deve possuir documentacao OpenAPI.

Critérios:

- Swagger deve estar acessivel em `/docs`.
- Arquivo estatico deve existir em `docs/openapi.json`.
- Documentacao deve conter schemas, exemplos e respostas de erro.

## RNF-007 - Portabilidade

O ambiente local deve ser reproduzivel.

Critérios:

- PostgreSQL deve subir por Docker Compose.
- Variaveis devem possuir exemplo em `.env.example`.
- Execucao deve estar documentada no README.

## RNF-008 - Qualidade De Resposta

As respostas de erro devem ser padronizadas.

Critérios:

- Erros devem retornar campo `message`.
- Erros de validacao devem retornar `400`.
- Erros de autenticacao devem retornar `401`.
- Erros de autorizacao devem retornar `403`.
