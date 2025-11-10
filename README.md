# API de Agendamento — Petshop

API RESTful desenvolvida para gerenciar **clientes, agendamentos e serviços** de um petshop.  
O sistema permite que usuários realizem agendamentos, e que administradores gerenciem clientes, horários e permissões.  

---

## Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **TypeScript**
- **Prisma ORM**
- **MongoDB**
- **JWT** para autenticação
- **Biome** para formatação e padronização do código

---

## Estrutura do Projeto

```bash
├── 📁 generated/
├── 📁 prisma/
│   └── 📄 schema.prisma
├── 📁 src/
│   ├── 📁 functions/
│   │   └── 📄 seed-super-admin.ts
│   ├── 📁 middlewares/
│   │   ├── 📄 admin.middleware.ts
│   │   └── 📄 user.middleware.ts
│   ├── 📁 routes/
│   │   ├── 📁 admin/
│   │   │   └── 📄 admin.routes.ts
│   │   ├── 📁 auth/
│   │   │   ├── 📄 auth.routes.ts
│   │   │   └── 📄 public.routes.ts
│   │   └── 📁 scheduling/
│   │       └── 📄 scheduling.routes.ts
│   ├── 📄 server.ts
│   └── 📄 types.express.d.ts
├── ⚙️ .gitignore
├── ⚙️ biome.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 prisma.config.ts
└── ⚙️ tsconfig.json

```
---

## Configuração e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [MongoDB](https://www.mongodb.com/)
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/SeuUsuario/NomeDoRepositorio.git

# Entre na pasta do projeto
cd NomeDoRepositorio

# Instale as dependências
npm install


 Configuração do Banco de Dados

Crie um arquivo .env na raiz do projeto.

Adicione sua conexão com o MongoDB:

DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco"
JWT_SECRET="sua_chave_secreta_aqui"

--------------------------------- 

Gere o cliente Prisma:

npx prisma generate

# Ambiente de desenvolvimento
npm run dev

-- Autenticação e Permissões

Usuários comuns: podem se cadastrar, autenticar e criar agendamentos.

Administradores: têm acesso a rotas protegidas para gerenciar usuários e agendamentos.

A autenticação é feita via JWT Token.
