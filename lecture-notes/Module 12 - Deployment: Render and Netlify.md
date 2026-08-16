# Module 12 - Deployment: Render and Netlify

## Before We Start

```bash
git checkout -b m12-deployment
./check.sh
```

Everything in this module assumes your application already works locally. Deployment does not fix a broken application - it takes whatever you have and makes it reachable from the internet, bugs included.

Before you start, confirm all of the following:

```bash
cd backend && npm run dev     # starts without errors
cd frontend && npm run dev    # starts without errors
```

- You can register, log in, and create a record through the UI
- `npm run prisma:seed` succeeds against a fresh database
- Your work is committed and pushed to GitHub

That last point is not optional. Both platforms deploy **from your GitHub repository**, not from your laptop. Anything you have not pushed does not exist as far as they are concerned.

---

## 1. What Deployment Changes

Locally, a lot of things are true that stop being true in production.

| Locally                                            | In production                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| The database is a Docker container on your machine | The database is a managed service somewhere else entirely         |
| Both servers are on `localhost`, different ports   | Two different domains, over HTTPS                                 |
| `.env` sits on disk                                | Environment variables are set in the hosting platform's dashboard |
| `npm run dev` restarts on save                     | The platform builds once, then runs the built output              |
| Any error is visible in your terminal              | Errors are in a log you have to go and read                       |
| CORS is wide open and nothing complains            | The browser enforces it strictly                                  |

The most common cause of "it works locally but not deployed" is a value that was hard-coded to `localhost` somewhere. The second most common is an environment variable you set locally months ago and forgot was needed.

### Development and production dependencies

Production installs skip `devDependencies`. Anything your application needs **at runtime** must be in `dependencies`.

This catches people out with Prisma. `prisma` (the CLI, used for migrations) is a dev dependency; `@prisma/client` (used by your running code) is a runtime dependency. Check your `backend/package.json` now:

```json
{
  "dependencies": {
    "@prisma/client": "^6.0.0",
    "bcryptjs": "^3.0.0",
    "compression": "^1.7.0",
    "cors": "^2.8.0",
    "express": "^5.0.0",
    "express-rate-limit": "^7.0.0",
    "joi": "^17.0.0",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "nodemon": "^3.0.0",
    "prettier": "^3.0.0",
    "prisma": "^6.0.0"
  }
}
```

If something is in the wrong list, move it now. A missing runtime dependency produces a crash on startup that reads as a mysterious platform problem when it is really a one-line fix.

---

## 2. Preparing the Backend for Production

Three changes, all in `backend/`.

### A start script

`nodemon` is a development tool. Production runs your application once and expects it to stay up:

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

### A Node version

Platforms guess at your Node version unless you tell them. Guessing wrong produces errors about syntax that works perfectly on your machine:

```json
"engines": {
  "node": ">=20.0.0"
}
```

### CORS that means something

Since Module 02 your API has used `app.use(cors())`, which allows requests from **any** origin. That was fine when the only thing calling your API was your own machine. In production it means anyone can build a site that calls your API from their users' browsers.

Restrict it to your frontend:

```javascript
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
```

You do not know your Netlify URL yet. Leave `FRONTEND_URL` unset for now and come back to it in section 8 - the fallback keeps local development working in the meantime.

### The environment variables you will need

Add these to `backend/.env.example` so the list is documented, even though the real values only exist on Render:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
JWT_SECRET=change-this-to-a-long-random-string-in-production
JWT_LIFETIME=1h
FRONTEND_URL=http://localhost:5173
```

Commit and push before continuing.

---

## 3. Creating the Database on Render

Sign up at [render.com](https://render.com) with your GitHub account. No credit card is required for the free tier.

From the dashboard, create a new **PostgreSQL** instance. Give it a name, choose a region close to your users - Singapore or Oregon are the usual choices from New Zealand - and select the free instance type.

Once it finishes provisioning, open the **Connect** panel. You will see two connection strings:

| Connection string | When to use it                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------ |
| **Internal**      | From another Render service in the same region - faster, and never leaves Render's network |
| **External**      | From anywhere else, including your laptop and Prisma Studio                                |

Your API will use the internal URL. You will use the external one when you need to inspect the database yourself.

> **Read this before you go further.** Render's free PostgreSQL instances **expire 30 days after creation**, with a short grace period before the data is deleted, and each account may have one at a time. Your project runs for a full semester. This means your production database **will** disappear before the end of the course, probably at an inconvenient moment.
>
> This is survivable, and the way you survive it is the thing this module is really teaching: your migrations and your seed script must be able to rebuild the database from nothing. If recreating your database is a disaster rather than an inconvenience, that is a finding about your project, not about Render.
>
> Free tier terms change. Check Render's current documentation rather than trusting this table, including whether the expiry period is still what it says here.

---

## 4. Deploying the API to Render

From the dashboard, create a new **Web Service** and connect your GitHub repository. Render will ask for permission to access it.

Configure it as follows:

| Setting               | Value                                                             |
| --------------------- | ----------------------------------------------------------------- |
| **Root Directory**    | `backend`                                                         |
| **Runtime**           | Node                                                              |
| **Build Command**     | `npm install && npx prisma generate && npx prisma migrate deploy` |
| **Start Command**     | `npm start`                                                       |
| **Health Check Path** | `/api/health`                                                     |
| **Instance Type**     | Free                                                              |

**Root Directory** matters. Your repository has `backend/` and `frontend/` side by side; without this, Render looks for a `package.json` in the repository root and fails immediately.

**The build command** does three things in order: install dependencies, generate the Prisma Client for the platform's environment, then apply any migrations that have not yet run against the production database.

`prisma migrate deploy` is not `prisma migrate dev`. The `dev` command is interactive, can prompt you, and will happily reset your database. `deploy` applies existing migrations and nothing else. **Never run `migrate dev` against production.**

**The health check path** is the endpoint you wrote in Module 02. Render calls it periodically; if it stops responding, Render knows the service is unhealthy. This is what that endpoint was for.

### Environment variables

Add these under the service's Environment settings:

| Key            | Value                                             |
| -------------- | ------------------------------------------------- |
| `NODE_ENV`     | `production`                                      |
| `DATABASE_URL` | The **internal** connection string from section 3 |
| `JWT_SECRET`   | A new, long, random string                        |
| `JWT_LIFETIME` | `1h`                                              |

Do **not** reuse your development `JWT_SECRET`. It has been sitting in a file on your laptop for weeks. Generate a fresh one:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Render sets `PORT` itself. Your code has read `process.env.PORT` since Module 02, so there is nothing to do - this is the payoff for writing it that way rather than hard-coding `3000`.

Deploy. Watch the log; the first build takes a few minutes. When it finishes you get a URL like `https://your-api.onrender.com`.

Test it:

```http
GET https://your-api.onrender.com/api/health
```

> **Free services sleep.** After about 15 minutes without traffic, Render spins a free web service down. The next request wakes it, which takes roughly 30 to 60 seconds. Your first request after a quiet period will feel broken and is not. Mention this to anyone you demonstrate to, and account for it in Module 11's loading states - a spinner that gives up after five seconds is worse than no spinner at all here.

---

## 5. Migrations and Seeding in Production

Your build command already runs migrations, so the schema is in place. The database is empty.

Seeding production is a decision, not a routine. Look at your seed script:

```javascript
await prisma.department.deleteMany();
await prisma.institution.deleteMany();
```

Those two lines are entirely reasonable in development and catastrophic in production. Run that against a live database and you have deleted real data belonging to real users.

Two safe approaches:

**Guard the destructive part:**

```javascript
if (process.env.NODE_ENV !== "production") {
  await prisma.department.deleteMany();
  await prisma.institution.deleteMany();
}
```

**Or use `upsert`,** which creates a record if it does not exist and leaves it alone if it does. Your admin user from Module 06 already works this way, which is why that script is safe to run repeatedly.

To seed production once, use Render's **Shell** tab on the service:

```bash
npx prisma db seed
```

Do this deliberately, once, and know exactly what the script will do before you press enter.

### Inspecting the production database

Point Prisma Studio at the **external** connection string:

```bash
DATABASE_URL="your-external-connection-string" npx prisma studio
```

Treat this as read-mostly. It is a direct connection to live data with no undo.

---

## 6. Preparing the Frontend for Netlify

Your SvelteKit application is not a folder of static files. It has `load` functions and form actions that run on a server, and something has to run them. Netlify runs them as **serverless functions** - small pieces of code that start when a request arrives and stop when it finishes.

An **adapter** converts your built application into the shape a given platform expects.

```bash
cd frontend
npm install -D @sveltejs/adapter-netlify
```

Update `frontend/svelte.config.js`:

```javascript
import adapter from "@sveltejs/adapter-netlify";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
};

export default config;
```

If your config currently imports `@sveltejs/adapter-auto`, replace it. `adapter-auto` detects the platform at build time and works, but naming the adapter explicitly means your local builds behave the same way your deployed ones do, which is one fewer difference to reason about when something goes wrong.

Check that it builds before you deploy anything:

```bash
npm run build
```

A build that fails locally will fail on Netlify too, and the error is much easier to read in your own terminal.

---

## 7. Deploying the Frontend to Netlify

Sign up at [netlify.com](https://netlify.com) with your GitHub account, then add a new site from Git and select your repository.

| Setting               | Value            |
| --------------------- | ---------------- |
| **Base directory**    | `frontend`       |
| **Build command**     | `npm run build`  |
| **Publish directory** | `frontend/build` |

Netlify usually detects SvelteKit and fills these in. Check them anyway, particularly the base directory - the same two-project repository problem applies here.

### Environment variables

Under Site configuration → Environment variables, add:

| Key            | Value                                                 |
| -------------- | ----------------------------------------------------- |
| `API_BASE_URL` | Your Render URL, e.g. `https://your-api.onrender.com` |
| `JWT_SECRET`   | **The same value you set on Render**                  |

`API_BASE_URL` is read through `$env/dynamic/private`, exactly as it has been since Module 03. Because it is private, it never reaches the browser - your `load` functions call the API from the server side.

`JWT_SECRET` has to match Render's because your SvelteKit server verifies the token in `requireAuth` (Module 07) using the same secret the API signed it with. Two different secrets means every login appears to succeed and every protected page bounces you straight back to the login screen, with no error anywhere. It is a miserable bug to find and a thirty-second one to prevent.

No trailing slash on the URL. `https://your-api.onrender.com/` produces request URLs with a double slash, and some routes will 404 while others work.

Deploy. You get a URL like `https://your-app.netlify.app`.

---

## 8. Connecting the Two

The two halves are live but not yet properly introduced.

### Finish the CORS configuration

Go back to Render and add one more environment variable to your API service:

| Key            | Value                          |
| -------------- | ------------------------------ |
| `FRONTEND_URL` | `https://your-app.netlify.app` |

Render redeploys automatically. Your API now accepts browser requests from your frontend and rejects them from anywhere else.

### Secure cookies

Your login action sets the token cookie (Module 07). In production that cookie travels over the public internet, so it needs tightening:

```javascript
cookies.set("token", data.token, {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60,
});
```

`secure: true` tells the browser to send the cookie only over HTTPS. It is conditional because `localhost` is served over HTTP, and a `secure` cookie is silently dropped there - which would break your development login while looking like nothing happened at all.

`httpOnly` and `sameSite` you already set in Module 07 for reasons that have not changed.

---

## 9. Testing the Deployed Application

Working locally proves very little about production. Test the deployed application as a user would, in a browser you are not already logged into:

1. Open the Netlify URL in a private window
2. Register a new account
3. Log in
4. Create a record, edit it, delete it
5. Log out, then try to visit a protected page directly by URL
6. Log in as each role and confirm the UI differs
7. Filter and paginate a list, then reload the page and confirm the state survived

Then check the parts that only exist in production:

- Open DevTools → Network. Are requests going to your Render URL over HTTPS?
- Application → Cookies. Is the token cookie marked `HttpOnly` and `Secure`?
- Leave it fifteen minutes, then load a page. How does your application behave during a cold start?
- Deliberately break something - change `API_BASE_URL` to a wrong value and reload. Does the user see your error state, or a stack trace?

### Reading the logs

When something fails in production, the terminal you have relied on all semester is not there. Both platforms keep logs:

- **Render** - the Logs tab on your service, showing build output and everything your API writes to the console
- **Netlify** - Deploys for build output, and Functions for what happens at request time

Get into the habit of opening the logs **before** guessing. A deployment failure almost always names its cause in the last twenty lines of the build output.

---

## 10. Continuous Deployment and Rollback

Both platforms now watch your repository. Push to `main` and both rebuild automatically.

This is a genuine convenience and a genuine hazard. Broken code on `main` is live within minutes, in front of anyone using your application.

Work the way you have all semester: branch, build, test locally, merge only when it works. The habit mattered before; now it has an audience.

### Rolling back

Both platforms keep previous deployments. On Render, redeploy an earlier commit from the Deploys tab; on Netlify, publish a previous deploy from the Deploys list. Both take seconds.

Rolling back does **not** undo a migration. If your bad deployment added a column, rolling back the code leaves the column there, and if it dropped one, the data is gone. Code is reversible in one click; schema changes are not. This is the single most useful thing to understand about deploying an application with a database behind it.

---

## Exercises

#### Task 1 - Deploy everything above

Get both halves live and talking to each other. You are finished when a person who has never seen your application can open the Netlify URL on their own device, register, log in, and create a record.

Ask someone to actually do this. You cannot test the "works on a machine that is not yours" case on your own machine.

Commit the configuration changes as you make them:

```bash
git commit -m "chore: add start script and node engine for deployment"
git commit -m "chore: restrict cors to the frontend origin"
git commit -m "chore: add netlify adapter"
```

#### Task 2 - Record your deployment in the documentation

Add a **Deployment** section to your `README.md` covering:

- both live URLs;
- every environment variable each platform needs, and what it is for, with no real values;
- the build and start commands for each;
- how to run migrations against production; and
- how to roll back a bad deployment.

Write it for someone who has your repository and neither of your platform accounts. Then check it by reading it back as if you were that person.

#### Task 3 - Break CORS on purpose

Change `FRONTEND_URL` on Render to a different address and reload your site.

What does the user see? What appears in the browser console, and what appears in Render's logs? The asymmetry is the lesson: the browser blocked the response, so your API believes it handled the request perfectly. Fix it, then write two sentences on where a CORS failure shows up and where it does not.

#### Task 4 - Break the shared secret

Change `JWT_SECRET` on Netlify so it no longer matches Render's. Log in.

Describe exactly what happens from the user's point of view. Now explain why nothing in either set of logs makes the cause obvious. Restore it.

#### Task 5 - Measure a cold start

Leave your API alone for twenty minutes, then load a page and time it with the Network tab.

Now look at your Module 11 loading states with that number in mind. Does your UI communicate "still working" for a full minute, or does it look broken after three seconds? Improve whichever pages handle it worst.

#### Task 6 - Deploy a bug, then roll back

On a branch, introduce a small visible bug - a wrong label, a broken link. Merge it and let it deploy. Confirm it is live, then roll back.

Time it from noticing to fixed. Then answer: what would you have done differently if this were a database migration rather than a text change?

#### Task 7 - Audit your production configuration

Work through this checklist against your live deployment and fix what fails:

- No secret appears anywhere in your Git history (`git log -p | grep -i secret`)
- `JWT_SECRET` in production differs from the one in your local `.env`
- The token cookie is `HttpOnly` and `Secure` in the deployed application
- CORS names your frontend origin specifically, not `*`
- Rate limiting is active in production
- An unknown route returns your JSON `404`, not an HTML error page
- Your API returns no stack traces to the client when something fails

The last one catches most people. Trigger a `500` in production and read what the browser receives.

#### Task 8 - Add a staging environment

Create a second Render service and a second Netlify site, both deploying from a `staging` branch, with their own database and their own secrets.

Merge to `staging` first, check it, then merge to `main`. What does this cost you in setup and upkeep, and at what point in a project's life does it start being worth it?

#### Task 9 - Survive losing the database

Your free Render database expires. Practise the recovery before it happens to you: delete it deliberately, create a new one, update `DATABASE_URL`, redeploy, and get the application working again.

Time it, then write down every manual step. Anything you had to remember rather than run is a gap in your automation.

#### Task 10 - Deploy on every pull request

Netlify builds a preview deployment for pull requests. Turn it on, open a PR, and review the preview URL rather than the diff.

Then consider the harder half: your API has no equivalent, so the preview frontend still talks to production. What could go wrong, and how would you avoid it?

#### Task 11 - Deploy your project

On the `project` branch, deploy your own application end to end:

- PostgreSQL and your API on Render
- Your frontend on Netlify
- Production secrets generated fresh, never committed
- CORS restricted to your own frontend
- A **Deployment** section in your `README.md`, complete enough for someone else to redeploy from scratch

```bash
git checkout project
git commit -m "chore: configure application for deployment"
```

Then tag a release and confirm the deployed application matches it.

Deploy early and deploy often. A first deployment attempted the week before submission reliably uncovers three problems that each take a day, and your Project is assessed on a working deployed application as well as one that runs locally.
