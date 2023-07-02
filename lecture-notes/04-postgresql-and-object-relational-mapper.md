# 04: PostgreSQL and Object-Relational Mapper(ORM)

## PostgreSQL

**PostgreSQL** is a free relational database management system (RDBMS). It is a powerful, highly-extensible, and feature-rich database system. It is also known as **Postgres**.

### Getting Started

Click on the **New +** button then click on the **PostgreSQL** link.

![](<../resources (ignore)/img/04/render-1.PNG>)

Name your **web service**. I suggest using **id607001-your learner username**.

![](<../resources (ignore)/img/04/render-2.PNG>)

Leave the **Instance Type** as **Free**. Click on the **Create Database** button.

![](<../resources (ignore)/img/04/render-3.PNG>)

Click on the **Connect** button, then click on the **External Connection** tab. Copy the **External Database URL**.

![](<../resources (ignore)/img/04/render-4.PNG>)

## Object-Relational Mapper (ORM)

An **Object-Relational Mapper (ORM)** is a layer that sits between the database and the application. It maps the relational database to objects in the application. It allows developers to work with objects instead of tables and **SQL**.

### Getting Started

We are going to use **Prisma** as our **ORM**. **Prisma** is an open-source **ORM** for **Node.js** and **TypeScript**. It supports **PostgreSQL**, **MySQL**, **SQLite**, and **SQL Server**.

To get started, run the following command to install **Prisma**.

```bash
npm install @prisma/client
npm install prisma --save-dev
npx prisma init
```

What is the purpose of each command?

- `npm install @prisma/client`: Installs the **Prisma Client** module.
- `npm install prisma --save-dev`: Installs the **Prisma CLI** module. The `--save-dev` flag is used to save the module as a development dependency. A development dependency is a module that is only required during development. It is not required in production.
- `npx prisma init`: Initializes **Prisma** in the project. It creates a `.env` file and a `prisma` directory. 

What is the purpose of the `.env` file? Used to store environment variables. For example, database connection string.

What is the purpose of the `prisma` directory? Used to store **Prisma** configuration files. For example, `schema.prisma`. The `schema.prisma` file is used to define the database schema.

---


In the `schema.prisma` file, you will see the following code.

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

What is the purpose of the `generator` block? Used to specify the **Prisma Client** provider. The **Prisma Client** is used to interact with the database.

What is the purpose of the `datasource` block? Used to specify the database provider and connection string.

---

Rename the `.env` file to `.env.development`. In the `.env.development` file, you will see the following code.

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Replace the connection string with the following code.

```bash
DATABASE_URL="<Render PostgreSQL database connection string"
```

---

In the `schema.prisma` file, add the following model.

```javascript
model Institution {
  id         Int          @id @default(autoincrement())
  name       String
  region     String
  country    String
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}
```

What is the purpose of the `model` block? Used to define a database table.

What is the purpose of the `@id` attribute? Used to specify the primary key.

To migrate the database, run the following command.

```bash
npx prisma migrate dev
```

You will be prompted to enter a name for the migration. Do not enter anything and press the `Enter` key. You will find the new migration in the `prisma/migrations` directory. You are encouraged to read the migration file. You should see some **SQL** statements.

What is a migration? A migration is a file that contains the **SQL** statements to create, update, or delete database tables. It is used to keep the database schema in sync with the application.

---

