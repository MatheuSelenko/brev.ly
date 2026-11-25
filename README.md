# brev.ly

Encurtador de URLs desenvolvido como desafio prático da pós-graduação, composto por uma API em Node.js e uma aplicação em React.

## Principais funcionalidades

- Criar links encurtados, com validação de formato e duplicidade
- Listar todos os links cadastrados
- Redirecionar da URL encurtada para a original, contabilizando seus acessos
- Deletar links
- Exportação de relatório CSV dos links para o Cloudflare R2

## Tecnologias

**Back-end (`server`)**: Node.js, TypeScript, Fastify, Drizzle ORM, PostgreSQL, Zod, Cloudflare R2 e Docker

**Front-end (`web`)**: React, Vite, TypeScript, Tailwind CSS, React Query, React Hook Form, Zod, e React Router

## Pré-requisitos
- [Node.js](https://nodejs.org) 22 ou superior
- [pnpm](https://pnpm.io) 10 ou superior
- [Docker](https://www.docker.com)
- Conta na [Cloudflare](https://www.cloudflare.com) com um bucket R2 de acesso público (usado na exportação do CSV)

## Como rodar

### 1. Back-end

```bash
cd server
cp .env.example .env
```

Abra o `.env` e preencha as variáveis do Cloudflare (`CLOUDFLARE_*`). As demais já vêm configuradas para o ambiente local.

```bash
pnpm install
docker compose up -d   # sobe o PostgreSQL
pnpm db:migrate        # cria as tabelas
pnpm dev               # API em http://localhost:3333
```

> Se a porta `5432` já estiver em uso por outro PostgreSQL na sua máquina, pare-o antes de subir o container.

### 2. Front-end

Em outro terminal, a partir da raiz do projeto:

```bash
cd web
cp .env.example .env
pnpm install
pnpm dev               # aplicação em http://localhost:5173
```

### Rodando a API com Docker

Com o banco já rodando (`docker compose up -d`):

```bash
cd server
docker build -t brevly-server .
docker run --rm --init -p 3333:3333 --env-file .env \
  -e DATABASE_URL=postgresql://docker:docker@host.docker.internal:5432/brevly \
  brevly-server
```

A `DATABASE_URL` é sobrescrita porque, dentro do container, `localhost` aponta para o próprio container. O endereço `host.docker.internal` aponta para a máquina onde o PostgreSQL está rodando.

## Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/links` | Cria um link |
| `GET` | `/links` | Lista todos os links |
| `GET` | `/links/:shortUrl` | Obtém o link pela URL encurtada |