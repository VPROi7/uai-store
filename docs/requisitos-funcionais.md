# Requisitos Funcionais - UAI Store API

## RF-001 - Autenticar Usuario

O sistema deve permitir login por email e senha no endpoint `POST /auth/login`.

Regras relacionadas: RN-012, RN-013, RN-019.

Critérios de aceite:

- Deve retornar JWT para credenciais validas.
- Deve rejeitar email ou senha invalidos.
- O token deve conter ID do usuario e perfil.
- O token deve possuir expiracao.

## RF-002 - Cadastrar Produto

O sistema deve permitir que usuarios `ADMIN` cadastrem produtos no endpoint `POST /produtos`.

Regras relacionadas: RN-001, RN-017.

Critérios de aceite:

- Nome, categoria, preco, quantidade inicial e estoque minimo sao obrigatorios.
- Nome deve ter no minimo 3 caracteres.
- Preco deve ser maior que zero.
- Quantidade inicial e estoque minimo devem ser maiores ou iguais a zero.
- Produto deve iniciar com status `ATIVO`.
- Nao deve existir produto `ATIVO` com o mesmo nome.

## RF-003 - Listar Produtos

O sistema deve listar produtos no endpoint `GET /produtos`.

Regras relacionadas: RN-004, RN-005.

Critérios de aceite:

- Usuario `CLIENTE` deve visualizar apenas produtos `ATIVO`.
- Usuario `ADMIN` pode filtrar produtos `ATIVO` ou `INATIVO`.
- Deve suportar paginacao.
- Deve permitir busca parcial por nome.
- Deve permitir filtro por categoria.
- Deve permitir ordenacao por nome ou preco.

## RF-004 - Consultar Produto Por ID

O sistema deve permitir consulta de produto por ID no endpoint `GET /produtos/{id}`.

Regras relacionadas: RN-004.

Critérios de aceite:

- Produto existente deve ser retornado.
- Produto inexistente deve retornar erro.
- Produto `INATIVO` nao deve ser retornado para usuario `CLIENTE`.

## RF-005 - Atualizar Produto

O sistema deve permitir que usuarios `ADMIN` atualizem produtos no endpoint `PUT /produtos/{id}`.

Regras relacionadas: RN-002, RN-003, RN-017.

Critérios de aceite:

- Apenas `ADMIN` pode atualizar.
- ID do produto nao pode ser alterado.
- Nome nao pode ser vazio.
- Preco deve continuar maior que zero.
- Produto `INATIVO` pode ser atualizado.
- Atualizacao deve registrar historico interno.

## RF-006 - Inativar Produto

O sistema deve permitir que usuarios `ADMIN` inativem produtos por meio do endpoint `PUT /produtos/{id}`.

Regras relacionadas: RN-003.

Critérios de aceite:

- Produto inativado nao deve aparecer para `CLIENTE`.
- A acao deve ser registrada no historico interno.
- Produto inativo nao deve receber movimentacao de estoque.

## RF-007 - Registrar Entrada De Estoque

O sistema deve permitir entrada de estoque no endpoint `POST /movimentacoes`.

Regras relacionadas: RN-006, RN-007, RN-009, RN-015.

Critérios de aceite:

- Apenas `ADMIN` pode registrar entrada.
- Quantidade deve ser maior que zero.
- Produto deve existir.
- Motivo deve ser informado.
- Estoque deve ser incrementado.
- Movimentacao deve ser registrada no historico.

## RF-008 - Registrar Saida De Estoque

O sistema deve permitir saida de estoque no endpoint `POST /movimentacoes`.

Regras relacionadas: RN-006, RN-008, RN-009, RN-015, RN-016, RN-018.

Critérios de aceite:

- Apenas `ADMIN` pode registrar saida.
- Quantidade deve ser maior que zero.
- Produto deve existir.
- Motivo deve ser informado.
- Saida nao pode exceder estoque disponivel.
- Estoque deve ser decrementado.
- Movimentacao deve ser registrada no historico.

## RF-009 - Consultar Historico De Movimentacoes

O sistema deve permitir consulta do historico no endpoint `GET /movimentacoes`.

Regras relacionadas: RN-009, RN-010.

Critérios de aceite:

- Apenas `ADMIN` pode consultar.
- Deve permitir filtro por produto.
- Deve permitir filtro por periodo.
- Deve permitir filtro por tipo de movimentacao.
- Historico nao deve ter rotas de alteracao ou exclusao.

## RF-010 - Controlar Acesso A Rotas Protegidas

O sistema deve proteger todos os endpoints exceto `/health` e `/auth/login`.

Regras relacionadas: RN-013, RN-014, RN-019.

Critérios de aceite:

- Requisicao sem token deve retornar erro.
- Token invalido deve retornar erro.
- Token expirado deve retornar erro.
- Perfil inadequado deve retornar erro.
