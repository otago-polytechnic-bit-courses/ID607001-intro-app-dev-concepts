# GigBoard - Practical Starter Code

**ID607001: Introductory Application Development Concepts**

This is the backend you are given at the start of the Practical. Some of it works. A good deal of it does not.

Create the folders below, paste in the files, then run the setup commands.

---

## Repository layout

```
gigboard/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── .env.example
│   ├── requests.http
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── db.js
│   │   └── seed.js
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── venue.js
│   │   └── gig.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── venue.js
│   │   └── gig.js
│   ├── repositories/
│   │   ├── venue.js
│   │   └── gig.js
│   └── middleware/
│       ├── jwtAuth.js
│       └── rbac.js
├── fault-report.md        <- you complete
├── presentation.md        <- you complete
└── README.md
```

---

## Part A - Files

### `backend/package.json`

```json
{
  "name": "gigboard-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon app.js",
    "start": "node app.js",
    "prisma:generate": "npx prisma generate",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:deploy": "npx prisma migrate deploy",
    "prisma:reset": "npx prisma migrate reset --force",
    "prisma:studio": "npx prisma studio",
    "prisma:seed": "node prisma/seed.js",
    "format:check": "prettier --check .",
    "format:fix": "prettier --write .",
    "lint:check": "eslint .",
    "lint:fix": "eslint --fix ."
  },
  "dependencies": {
    "@prisma/client": "^6.12.0",
    "bcryptjs": "^2.4.3",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "nodemon": "^3.0.1",
    "prettier": "^3.0.3",
    "prisma": "^6.12.0"
  }
}
```

### `backend/.env.example`

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
JWT_SECRET=change-this-to-a-long-random-string-in-production
JWT_LIFETIME=1h
```

### `backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  firstName    String
  lastName     String
  emailAddress String   @unique
  password     String
  role         String   @default("ATTENDEE")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Venue {
  id        String   @id @default(uuid())
  name      String
  suburb    String
  city      String
  capacity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  gigs      Gig[]
}

model Gig {
  id          String   @id @default(uuid())
  title       String
  artist      String
  date        DateTime
  ticketPrice Float
  venueId     String
  venue       Venue    @relation(fields: [venueId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### `backend/prisma/db.js`

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

### `backend/prisma/seed.js`

```javascript
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcryptjs.hash("password123", 10);

  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      emailAddress: "admin@gigboard.com",
      password,
      role: "ADMIN",
    },
  });

  await prisma.venue.create({
    data: {
      name: "The Vault",
      suburb: "Dunedin Central",
      city: "Dunedin",
      capacity: 300,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
```

### `backend/app.js`

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";
import authRoutes from "./routes/auth.js";
import venueRoutes from "./routes/venue.js";
import gigRoutes from "./routes/gig.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/gigs", gigRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
```

### `backend/controllers/auth.js`

```javascript
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/db.js";

const register = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { emailAddress } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with that email already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: { firstName, lastName, emailAddress, password: hashedPassword },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Account successfully created",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    const user = await prisma.user.findUnique({ where: { emailAddress } });
    if (!user) {
      return res.status(401).json({ message: "Email address not found" });
    }

    const passwordMatches = await bcryptjs.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export { register, login };
```

### `backend/routes/auth.js`

```javascript
import express from "express";
import { register, login } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
```

### `backend/controllers/venue.js`

```javascript
import venueRepository from "../repositories/venue.js";

const getVenues = async (req, res) => {
  try {
    const venues = await venueRepository.findAll();
    return res.status(200).json({ data: venues });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await venueRepository.findById(id);
    if (!venue) {
      return res.status(200).json({ message: `No venue with id: ${id} found` });
    }
    return res.status(200).json({ data: venue });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createVenue = async (req, res) => {
  try {
    const { name, suburb, city, capacity } = req.body;
    const venue = await venueRepository.create({
      name,
      suburb,
      city,
      capacity,
    });
    return res.status(201).json({
      message: "Venue successfully created",
      data: venue,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await venueRepository.findById(id);
    if (!venue) {
      return res.status(404).json({ message: `No venue with id: ${id} found` });
    }
    const { name, suburb, city, capacity } = req.body;
    const updated = await venueRepository.update(id, {
      name,
      suburb,
      city,
      capacity,
    });
    return res.status(200).json({
      message: `Venue with id: ${id} successfully updated`,
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await venueRepository.findById(id);
    if (!venue) {
      return res.status(404).json({ message: `No venue with id: ${id} found` });
    }
    await venueRepository.delete(id);
    return res.status(200).json({
      message: `Venue with id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export { getVenues, getVenue, createVenue, updateVenue, deleteVenue };
```

### `backend/repositories/venue.js`

```javascript
import prisma from "../prisma/db.js";

class VenueRepository {
  async findAll() {
    return await prisma.venue.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findById(id) {
    return await prisma.venue.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return await prisma.venue.create({ data });
  }

  async update(id, data) {
    return await prisma.venue.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.venue.delete({ where: { id } });
  }
}

export default new VenueRepository();
```

### `backend/routes/venue.js`

```javascript
import express from "express";
import {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../controllers/venue.js";
import jwtAuth from "../middleware/jwtAuth.js";
import rbac from "../middleware/rbac.js";

const router = express.Router();

router.get("/", getVenues);
router.get("/:id", getVenue);
router.post("/", jwtAuth, rbac(["SOME_RANDOM_PERSON_WHO_SHOULD_NOT_BE_ALLOWED_TO_CREATE_VENUES"]), createVenue);
router.put("/:id", jwtAuth, rbac(["ORGANISER"]), updateVenue);
router.delete("/:id", deleteVenue);

export default router;
```

### `backend/controllers/gig.js`

```javascript
import gigRepository from "../repositories/gig.js";

const getGigs = async (req, res) => {
  try {
    const gigs = await gigRepository.findAll();
    return res.status(200).json({ data: gigs });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getGig = async (req, res) => {
  try {
    const { id } = req.params;
    const gig = await gigRepository.findById(id);
    return res.status(200).json({ data: gig });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createGig = async (req, res) => {
  try {
    const gig = await gigRepository.create({
      title,
      artist,
      date,
      ticketPrice,
      venueId,
    });
    return res.status(201).json({
      message: "Gig successfully created",
      data: gig,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateGig = async (req, res) => {
  try {
    const { id } = req.params;
    const gig = await gigRepository.findById(id);
    if (!gig) {
      return res.status(404).json({ message: `No gig with id: ${id} found` });
    }
    const { title, artist, date, ticketPrice, venueId } = req.body;
    const updated = await gigRepository.update(id, {
      title,
      artist,
      date,
      ticketPrice,
      venueId,
    });
    return res.status(200).json({
      message: `Gig with id: ${id} successfully updated`,
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteGig = async (req, res) => {
  try {
    const { id } = req.params;
    const gig = await gigRepository.findById(id);
    if (!gig) {
      return res.status(404).json({ message: `No gig with id: ${id} found` });
    }
    await gigRepository.delete(id);
    return res.status(200).json({
      message: `Gig with id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export { getGigs, getGig, createGig, updateGig, deleteGig };
```

### `backend/repositories/gig.js`

```javascript
import prisma from "../prisma/db.js";

class GigRepository {
  async findAll() {
    return await prisma.gig.findMany({
      orderBy: { date: "asc" },
      include: { venue: { select: { id: true, name: true } } },
    });
  }

  async findById(id) {
    return await prisma.gig.findUnique({
      where: { id },
      include: { venue: { select: { id: true, name: true } } },
    });
  }

  async create(data) {
    return await prisma.gig.create({
      data: {
        title: data.title,
        artist: data.artist,
        date: new Date(data.date),
        ticketPrice: data.ticketPrice,
        venue: { connect: { id: data.venueId } },
      },
    });
  }

  async update(id, data) {
    return await prisma.gig.update({
      where: { id },
      data: {
        title: data.title,
        artist: data.artist,
        date: data.date ? new Date(data.date) : undefined,
        ticketPrice: data.ticketPrice,
        ...(data.venueId && { venue: { connect: { id: data.venueId } } }),
      },
    });
  }

  async delete(id) {
    return await prisma.gig.delete({ where: { id } });
  }
}

export default new GigRepository();
```

### `backend/routes/gig.js`

```javascript
import express from "express";
import {
  getGigs,
  getGig,
  createGig,
  updateGig,
  deleteGig,
} from "../controllers/gig.js";
import jwtAuth from "../middleware/jwtAuth.js";
import rbac from "../middleware/rbac.js";

const router = express.Router();

router.get("/", getGigs);
router.get("/:id", getGig);
router.post("/", jwtAuth, rbac(["ORGANISER", "ADMIN"]), createGig);
router.put("/:id", jwtAuth, rbac(["ADMIN"]), updateGig);
router.delete("/:id", jwtAuth, rbac(["ORGANISER", "ADMIN"]), deleteGig);

export default router;
```

### `backend/middleware/jwtAuth.js`

```javascript
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorised" });
  }
};

export default jwtAuth;
```

### `backend/middleware/rbac.js`

```javascript
const rbac = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export default rbac;
```

---

## Part B - `requests.http`

This file is the specification. Comments describe what each request **should** produce. Do not edit those comments.

```http
### --- AUTH ---

### Register a new user (expect 201)
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Organiser",
  "emailAddress": "jane@gigboard.com",
  "password": "password123"
}

###

### Register with duplicate email (expect 409)
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Organiser",
  "emailAddress": "jane@gigboard.com",
  "password": "password123"
}

###

### Login (expect 200 with token - copy token for requests below)
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "emailAddress": "jane@gigboard.com",
  "password": "password123"
}

###

### Login with wrong password (expect 401 - same message as wrong email)
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "emailAddress": "jane@gigboard.com",
  "password": "wrongpassword"
}

###

### --- VENUES ---

### Get all venues (expect 200 with data array)
GET http://localhost:3000/api/venues

###

### Get one venue - includes nested gigs array (expect 200 with data object containing gigs)
GET http://localhost:3000/api/venues/REPLACE_WITH_REAL_ID

###

### Get a venue that does not exist (expect 404 with message)
GET http://localhost:3000/api/venues/00000000-0000-0000-0000-000000000000

###

### Create a venue - requires ADMIN token (expect 201)
POST http://localhost:3000/api/venues
Content-Type: application/json
Authorization: Bearer REPLACE_WITH_ADMIN_TOKEN

{
  "name": "The Dunedin Sound",
  "suburb": "South Dunedin",
  "city": "Dunedin",
  "capacity": 150
}

###

### Create a venue without a token (expect 401)
POST http://localhost:3000/api/venues
Content-Type: application/json

{
  "name": "Unauthorised Venue",
  "suburb": "Anywhere",
  "city": "Dunedin",
  "capacity": 100
}

###

### Create a venue as ORGANISER (expect 403 - only ADMIN may manage venues)
POST http://localhost:3000/api/venues
Content-Type: application/json
Authorization: Bearer REPLACE_WITH_ORGANISER_TOKEN

{
  "name": "Organiser Venue",
  "suburb": "Anywhere",
  "city": "Dunedin",
  "capacity": 100
}

###

### Update a venue - requires ADMIN token (expect 200)
PUT http://localhost:3000/api/venues/REPLACE_WITH_REAL_ID
Content-Type: application/json
Authorization: Bearer REPLACE_WITH_ADMIN_TOKEN

{
  "name": "The Dunedin Sound (Updated)",
  "suburb": "South Dunedin",
  "city": "Dunedin",
  "capacity": 200
}

###

### Delete a venue - requires ADMIN token (expect 204 no body)
DELETE http://localhost:3000/api/venues/REPLACE_WITH_REAL_ID
Authorization: Bearer REPLACE_WITH_ADMIN_TOKEN

###

### Delete a venue without a token (expect 401)
DELETE http://localhost:3000/api/venues/REPLACE_WITH_REAL_ID

###

### Hit an unknown route (expect 404 JSON from catch-all, not HTML)
GET http://localhost:3000/api/nonexistent

###

### --- GIGS ---

### Get all gigs (expect 200 with data array, each gig includes venue name)
GET http://localhost:3000/api/gigs

###

### Get one gig (expect 200 with data object including venue)
GET http://localhost:3000/api/gigs/REPLACE_WITH_REAL_ID

###

### Get a gig that does not exist (expect 404 with message)
GET http://localhost:3000/api/gigs/00000000-0000-0000-0000-000000000000

###

### Create a gig - requires ORGANISER or ADMIN token (expect 201)
POST http://localhost:3000/api/gigs
Content-Type: application/json
Authorization: Bearer REPLACE_WITH_ORGANISER_TOKEN

{
  "title": "Summer Sounds",
  "artist": "The Chills",
  "date": "2025-02-14T20:00:00.000Z",
  "ticketPrice": 25.00,
  "venueId": "REPLACE_WITH_REAL_VENUE_ID"
}

###

### Create a gig without a token (expect 401)
POST http://localhost:3000/api/gigs
Content-Type: application/json

{
  "title": "Unauthorised Gig",
  "artist": "Nobody",
  "date": "2025-02-14T20:00:00.000Z",
  "ticketPrice": 0,
  "venueId": "REPLACE_WITH_REAL_VENUE_ID"
}

###

### Create a gig with a venueId that does not exist (expect 404 with message)
POST http://localhost:3000/api/gigs
Content-Type: application/json
Authorization: Bearer REPLACE_WITH_ORGANISER_TOKEN

{
  "title": "Ghost Gig",
  "artist": "Nobody",
  "date": "2025-02-14T20:00:00.000Z",
  "ticketPrice": 10,
  "venueId": "00000000-0000-0000-0000-000000000000"
}

###

### Update a gig - requires ORGANISER or ADMIN token (expect 200)
PUT http://localhost:3000/api/gigs/REPLACE_WITH_REAL_ID
Content-Type: application/json
Authorization: Bearer REPLACE_WITH_ORGANISER_TOKEN

{
  "title": "Summer Sounds (Sold Out)",
  "ticketPrice": 30.00
}

###

### Delete a gig - requires ORGANISER or ADMIN token (expect 204 no body)
DELETE http://localhost:3000/api/gigs/REPLACE_WITH_REAL_ID
Authorization: Bearer REPLACE_WITH_ORGANISER_TOKEN

###

### Delete a venue that has gigs - gigs should cascade-delete (expect 204)
DELETE http://localhost:3000/api/venues/REPLACE_WITH_VENUE_WITH_GIGS_ID
Authorization: Bearer REPLACE_WITH_ADMIN_TOKEN
```

---

## Part C - Student-facing files

### `README.md`

````markdown
# GigBoard

A community noticeboard for live music. Venues list their upcoming gigs; organisers manage the programme.

## Running the API

```bash
cd backend
npm install
cp .env.example .env          # fill in your values
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Endpoints

| Method | URL                  | Auth             | Notes         |
| ------ | -------------------- | ---------------- | ------------- |
| POST   | `/api/auth/register` | none             |               |
| POST   | `/api/auth/login`    | none             | Returns token |
| GET    | `/api/venues`        | none             |               |
| GET    | `/api/venues/:id`    | none             | Includes gigs |
| POST   | `/api/venues`        | ADMIN            |               |
| PUT    | `/api/venues/:id`    | ADMIN            |               |
| DELETE | `/api/venues/:id`    | ADMIN            |               |
| GET    | `/api/gigs`          | none             |               |
| GET    | `/api/gigs/:id`      | none             |               |
| POST   | `/api/gigs`          | ORGANISER, ADMIN |               |
| PUT    | `/api/gigs/:id`      | ORGANISER, ADMIN |               |
| DELETE | `/api/gigs/:id`      | ORGANISER, ADMIN |               |

## Permission matrix

| Action                           | ATTENDEE | ORGANISER | ADMIN |
| -------------------------------- | :------: | :-------: | :---: |
| Read venues and gigs             |    ✓     |     ✓     |   ✓   |
| Create / update / delete a gig   |          |     ✓     |   ✓   |
| Create / update / delete a venue |          |           |   ✓   |
````

### `fault-report.md`

```markdown
# Fault Report

Identify at least eight distinct faults. At least six must be faults you go on to fix.

| #   | Location | What is wrong | Correct behaviour | How found | Severity | Fixed? |
| --- | -------- | ------------- | ----------------- | --------- | -------- | ------ |
| 1   |          |               |                   |           |          |        |
| 2   |          |               |                   |           |          |        |
| 3   |          |               |                   |           |          |        |
| 4   |          |               |                   |           |          |        |
| 5   |          |               |                   |           |          |        |
| 6   |          |               |                   |           |          |        |
| 7   |          |               |                   |           |          |        |
| 8   |          |               |                   |           |          |        |
```

### `presentation.md`

```markdown
# Presentation

**Link:**

**Recorded with:**

**Length:**

Confirm this link opens from an account that is not yours.

## AI tool acknowledgement

If you used AI tools, record which tools and what you used them for here.
If you did not, say so.
```
