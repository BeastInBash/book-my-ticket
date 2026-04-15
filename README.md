# 🎬 Book My Ticket — Seat Booking System

A full-stack seat booking application built with **Node.js, Express, PostgreSQL (NeonDB), and Sessions**.
It supports authentication, seat booking with concurrency control, and user-specific booking history.

---

# 🚀 Tech Stack

* **Backend:** Express.js
* **Database:** PostgreSQL (NeonDB)
* **Session Store:** connect-pg-simple
* **Validation:** Joi
* **Frontend:** Vanilla JS + TailwindCSS
* **Deployment:** Vercel (Frontend)

---

# 📦 Project Structure

```
src/
 ├── common/
 │   ├── database/
 │   ├── middleware/
 │   └── utils/
 │
 ├── modules/
 │   ├── auth/
 │   │   ├── auth.controller.js
 │   │   ├── auth.service.js
 │   │   ├── auth.route.js
 │   │   ├── auth.middleware.js
 │   │   └── auth.queries.js
 │   │
 │   └── booking/
 │       ├── booking.controller.js
 │       ├── booking.service.js
 │       └── booking.routes.js
 │
 ├── index.html
 ├── login.html
 ├── register.html
 └── index.mjs
```

---

# ⚙️ Environment Setup

> If using neon or other cloud based db provider

Create a `.env` file:

```env


DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_SECRET=your_secret
PORT=8080
```

---

# If want to use docker 
## 🐳 Docker Setup (PostgreSQL)

This project supports running PostgreSQL locally using Docker for easy setup and consistency across environments.

🚀 Prerequisites
Install Docker
Install Docker Compose

Check installation:

docker --version
docker-compose --version

## ▶️ Start PostgreSQL
docker-compose up -d

👉 This will start PostgreSQL on:

localhost:5432

---
# 🗄️ Database Setup

### Create Seats Table

```sql
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    isbooked INT DEFAULT 0 CHECK (isbooked IN (0,1)),
    user_id INT
);
```

---

### Seed Initial Data

```sql
TRUNCATE TABLE seats RESTART IDENTITY;

INSERT INTO seats (name, isbooked)
SELECT '', 0
FROM generate_series(1, 100);
```

---

# 🔐 Session Configuration

Sessions are stored in PostgreSQL using `connect-pg-simple`.

```js
const PgStore = pgSession(session);

app.use(
    session({
        store: new PgStore({
            pool: pool,
            tableName: "session",
            createTableIfMissing: true
        }),
        name: "sid",
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);
```

---

# 🔑 Authentication Flow

1. User logs in via `/api/v1/login`
2. Backend validates credentials using **Joi**
3. Session is created:

   ```js
   req.session.user = {
       id,
       name,
       email
   };
   ```
4. Session stored in DB
5. Cookie (`sid`) sent to browser

---

# 🛡️ Middleware

### isAuthenticated

```js
if (req.session?.user?.id) {
    next();
} else {
    res.redirect("/login");
}
```

---

# 🎟️ Booking Flow

## Step-by-step:

1. User clicks a seat

2. Frontend sends:

   ```http
   PUT /:id/:name
   ```

3. Backend:

   * Starts transaction
   * Locks row:

     ```sql
     SELECT * FROM seats WHERE id = $1 AND isbooked = 0 FOR UPDATE;
     ```
   * If available:

     ```sql
     UPDATE seats
     SET isbooked = 1, name = $2, user_id = $3
     WHERE id = $1;
     ```
   * Commit transaction

4. Response:

```json
{
  "success": true,
  "message": "Seat booked successfully",
  "data": {
    "id": 1,
    "name": "Saif"
  }
}
```

---

# ⚡ Concurrency Handling

* Uses **`FOR UPDATE` row locking**
* Prevents multiple users booking same seat
* Ensures atomic updates via transactions

---

# 📡 API Routes

## Auth

```
POST /api/v1/login
POST /api/v1/register
```

---

## Booking

```
GET  /api/v1/booking/my-booking
PUT  /:id/:name
```

---

## Seats

```
GET /seats
```

---

# 🧾 Booking Response Contract

### ✅ Success

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Saif"
  }
}
```

### ❌ Failure

```json
{
  "error": "Seat already booked"
}
```

---

# 🧪 Validation (Joi)

Used for:

* Login input validation
* Registration validation

Example:

```js
const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
```

---

# 🌐 CORS Setup

```js
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://book-my-ticket-phi.vercel.app"
    ],
    credentials: true
}));
```

---

# 🚀 Running the Project

```bash
npm install
npm run dev
```

---

# 🔥 Production Notes

* Set:

  ```js
  secure: true
  sameSite: "none"
  ```
* Use HTTPS
* Use environment variables
* Prefer connection string for DB

---

