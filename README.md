# API da Igreja Católica

Backend para o site católico de evangelização e formação espiritual.

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- RSS Parser
- Node Cron

## Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd igrejanode
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
- Crie um banco de dados PostgreSQL
- Copie o arquivo `.env.example` para `.env`
- Atualize a URL do banco de dados no arquivo `.env`

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. Inicie o servidor:
```bash
npm start
```

## Estrutura do Projeto

```
src/
  ├── modules/
  │   ├── noticias/
  │   │   ├── noticias.controller.js
  │   │   ├── noticias.service.js
  │   │   └── noticias.routes.js
  │   └── wallpapers/
  │       ├── wallpapers.controller.js
  │       ├── wallpapers.service.js
  │       └── wallpapers.routes.js
  ├── cron/
  │   └── noticias.js
  └── index.js
prisma/
  └── schema.prisma
```

## Endpoints

### Notícias
- GET `/api/noticias` - Retorna todas as notícias

### Wallpapers
- GET `/api/wallpapers` - Retorna todos os wallpapers
- GET `/api/wallpapers/categorias` - Retorna lista de categorias disponíveis
- GET `/api/wallpapers/tags` - Retorna lista de tags sugeridas
- POST `/api/wallpapers` - Cria um novo wallpaper (protegido)

## Funcionalidades

- Busca automática de notícias via RSS feed
- Atualização diária das notícias às 6h
- Galeria de wallpapers religiosos
- Categorização e tags para wallpapers
- Armazenamento em banco de dados PostgreSQL
- API RESTful 