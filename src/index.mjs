//  CREATE TABLE seats (
//      id SERIAL PRIMARY KEY,
//      name VARCHAR(255),
//      isbooked INT DEFAULT 0
//  );
// INSERT INTO seats (isbooked)
// SELECT 0 FROM generate_series(1, 20);

import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from './modules/auth/auth.route.js'
import isAuthenticated from "./modules/auth/auth.middleware.js";
import cors from "cors";
import 'dotenv/config'
import { pool } from "./common/database/config/db.js";
import session from "express-session";
import bookingRoutes from "./modules/booking/booking.routes.js";
import pgSession from 'connect-pg-simple'
const __dirname = dirname(fileURLToPath(import.meta.url));

console.log("Port from env", process.env.PORT)
const port = process.env.PORT || 8080;

const PgStore = pgSession(session)
// Equivalent to mongoose connection
// Pool is nothing but group of connections
// If you pick one connection out of the pool and release it
// the pooler will keep that connection open for sometime to other clients to reuse

const app = new express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json())


app.use(
    session({
        store: new PgStore({
            pool: pool, // your pg pool
            tableName: "session",
            createTableIfMissing: true
        }),
        name: "sid",
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);

// Authentication
app.use('/api/v1', authRoutes);
app.use('/api/v1/booking', bookingRoutes)

app.get("/", isAuthenticated, (req, res) => {
    console.log("Session in", req.session)
    res.sendFile(__dirname + "/index.html");
});


app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/register.html");
});

//get all seats
app.get("/seats", async (req, res) => {
    const result = await pool.query("select * from seats"); // equivalent to Seats.find() in mongoose
    res.send(result.rows);
});


app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({ status: "ok" });
    } catch (err) {
        res.status(500).json({ status: "db down", err });
    }
});
//book a seat give the seatId and your name

app.put("/:id/:name", isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const name = req.params.name;
        // payment integration should be here
        // verify payment
        const conn = await pool.connect(); // pick a connection from the pool
        //begin transaction
        // KEEP THE TRANSACTION AS SMALL AS POSSIBLE
        const userId = req.session.user.id;

        await conn.query("BEGIN");
        //getting the row to make sure it is not booked
        /// $1 is a variable which we are passing in the array as the second parameter of query function,
        // Why do we use $1? -> this is to avoid SQL INJECTION
        // (If you do ${id} directly in the query string,
        // then it can be manipulated by the user to execute malicious SQL code)
        const sql = "SELECT * FROM seats where id = $1 and isbooked = 0 FOR UPDATE";
        const result = await conn.query(sql, [id]);

        //if no rows found then the operation should fail can't book
        // This shows we Do not have the current seat available for booking
        if (result.rowCount === 0) {
            await conn.query("ROLLBACK")
            res.send({ error: "Seat already booked" });
            return;
        }
        //if we get the row, we are safe to update
        const sqlU = "update seats set isbooked = 1, name = $2, user_id = $3 where id = $1  ";
        const updateResult = await conn.query(sqlU, [id, name, userId]); // Again to avoid SQL INJECTION we are using $1 and $2 as placeholders
        console.log("Updated Result")
        //end transaction by committing
        await conn.query("COMMIT");
        conn.release(); // release the connection back to the pool (so we do not keep the connection open unnecessarily)
        // res.send(updateResult);
        res.json({
            success: true,
            message: "Seat booked successfully",
            data: {
                id: id,
                name: name
            }
        });
    } catch (ex) {
        console.log(ex);
        res.send(500);
    }
});

app.listen(port, async () => {
    try {
        console.log("Server starting on port: " + port)
    } catch (err) {
        console.log("Server could not start", err)
    }
}
);
