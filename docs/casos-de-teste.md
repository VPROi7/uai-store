# Casos De Teste - UAI Store API

## CT-001 - Login Com Sucesso

Requisito: RF-001.

Pre-condicao:

- Usuario cadastrado com email e senha validos.

Passos:

1. Enviar `POST /auth/login`.
2. Informar email valido.
3. Informar senha valida.

Resultado esperado:

- API retorna `200`.
- Resposta contem `token`.
- Resposta contem dados do usuario sem senha/hash.

## CT-002 - Login Com Credenciais Invalidas

Requisito: RF-001.

Passos:

1. Enviar `POST /auth/login`.
2. Informar email inexistente ou senha invalida.

Resultado esperado:

- API retorna `401`.
- Resposta informa credenciais invalidas.

## CT-003 - Acesso Sem Token

Requisito: RF-010.

Passos:

1. Enviar `GET /produtos` sem header `Authorization`.

Resultado esperado:

- API retorna `401`.
- Resposta informa token nao informado.

## CT-004 - Cadastro De Produto Com Sucesso

Requisito: RF-002.

Pre-condicao:

- Usuario autenticado como `ADMIN`.
- Nao existe produto ativo com o mesmo nome.

Passos:

1. Enviar `POST /produtos`.
2. Informar nome, categoria, preco, quantidade inicial e estoque minimo validos.

Resultado esperado:

- API retorna `201`.
- Produto e criado com status `ATIVO`.

## CT-005 - Cadastro De Produto Com Preco Zero

Requisito: RF-002.

Passos:

1. Enviar `POST /produtos`.
2. Informar `price` igual a zero.

Resultado esperado:

- API retorna `400`.
- Produto nao e cadastrado.

## CT-006 - Cadastro De Produto Duplicado Ativo

Requisito: RF-002.

Pre-condicao:

- Ja existe produto `ATIVO` com o mesmo nome.

Passos:

1. Enviar `POST /produtos` com nome duplicado.

Resultado esperado:

- API retorna `409`.
- Produto nao e cadastrado.

## CT-007 - Cliente Tentando Cadastrar Produto

Requisito: RF-010.

Pre-condicao:

- Usuario autenticado como `CLIENTE`.

Passos:

1. Enviar `POST /produtos`.

Resultado esperado:

- API retorna `403`.

## CT-008 - Listagem De Produtos Ativos Para Cliente

Requisito: RF-003.

Pre-condicao:

- Usuario autenticado como `CLIENTE`.

Passos:

1. Enviar `GET /produtos`.

Resultado esperado:

- API retorna `200`.
- Lista contem apenas produtos `ATIVO`.

## CT-009 - Atualizacao De Produto Com Sucesso

Requisito: RF-005.

Pre-condicao:

- Usuario autenticado como `ADMIN`.
- Produto existente.

Passos:

1. Enviar `PUT /produtos/{id}`.
2. Informar campos validos para atualizacao.

Resultado esperado:

- API retorna `200`.
- Produto e atualizado.
- Historico interno e registrado.

## CT-010 - Tentativa De Alterar ID Do Produto

Requisito: RF-005.

Passos:

1. Enviar `PUT /produtos/{id}`.
2. Incluir campo `id` no body.

Resultado esperado:

- API retorna `400`.
- Produto nao e atualizado.

## CT-011 - Entrada De Estoque Com Sucesso

Requisito: RF-007.

Pre-condicao:

- Usuario autenticado como `ADMIN`.
- Produto existente e ativo.

Passos:

1. Enviar `POST /movimentacoes`.
2. Informar `tipo` igual a `ENTRADA`.
3. Informar quantidade maior que zero.
4. Informar motivo.

Resultado esperado:

- API retorna `201`.
- Estoque e incrementado.
- Historico de movimentacao e criado.

## CT-012 - Saida Maior Que Estoque

Requisito: RF-008.

Pre-condicao:

- Usuario autenticado como `ADMIN`.
- Produto existente.
- Estoque menor que a quantidade solicitada.

Passos:

1. Enviar `POST /movimentacoes`.
2. Informar `tipo` igual a `SAIDA`.
3. Informar quantidade maior que o estoque.

Resultado esperado:

- API retorna `400`.
- Estoque nao e alterado.
- Historico nao registra movimentacao invalida.

## CT-013 - Movimentacao Com Quantidade Zero

Requisito: RF-007, RF-008.

Passos:

1. Enviar `POST /movimentacoes`.
2. Informar quantidade igual a zero.

Resultado esperado:

- API retorna `400`.

## CT-014 - Cliente Tentando Movimentar Estoque

Requisito: RF-010.

Pre-condicao:

- Usuario autenticado como `CLIENTE`.

Passos:

1. Enviar `POST /movimentacoes`.

Resultado esperado:

- API retorna `403`.

## CT-015 - Consulta De Historico Com Filtros

Requisito: RF-009.

Pre-condicao:

- Usuario autenticado como `ADMIN`.
- Existem movimentacoes registradas.

Passos:

1. Enviar `GET /movimentacoes`.
2. Informar filtros opcionais `produtoId`, `tipo`, `dataInicio` e `dataFim`.

Resultado esperado:

- API retorna `200`.
- Lista respeita os filtros informados.

## CT-016 - Concorrencia Em Saida De Estoque

Requisito: RF-008.

Pre-condicao:

- Produto com estoque limitado.
- Duas requisicoes de saida simultaneas.

Passos:

1. Enviar duas saidas simultaneas para o mesmo produto.

Resultado esperado:

- Apenas operacoes que respeitam o estoque sao confirmadas.
- Estoque final nunca fica negativo.

## CT-017 - Swagger Disponivel

Requisito: RNF-006.

Passos:

1. Subir a API.
2. Acessar `/docs`.

Resultado esperado:

- Swagger UI e carregado.

## CT-018 - Arquivo OpenAPI Estatico

Requisito: RNF-006.

Passos:

1. Executar `npm run swagger:export`.
2. Verificar `docs/openapi.json`.

Resultado esperado:

- Arquivo e gerado com versao `openapi: 3.0.3`.
