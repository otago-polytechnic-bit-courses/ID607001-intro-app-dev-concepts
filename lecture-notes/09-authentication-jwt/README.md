# Instructions

In **Git Bash**, run the following commands:

```bash
cd 09-authentication-jwt
npm install
touch .env
```

In `.env`, add the following environment variables:

```
DATABASE_URL=The PostgreSQL connection string
JWT_SECRET=HellWorld123
JWT_LIFETIME=1hr
```

**Note:** Remember to add your **PostgreSQL** connection string. You can find this on **Render**.

In **Git Bash**, run the following commands:

```bash
npx prisma generate
npx primsa migrate dev
npm run dev
```

You are ready to test your **auth** endpoints on **Postman**.

Refer to the screenshots in the following lecture notes - <https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-24/lecture-notes/09-authentication-jwt-jsdoc-and-postman-documentation-generation.md>
