import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { z } from "zod";
import connectDB from "./config/db.js";
import { isloggedIn } from "./middleware/auth.loggedIn.js";
import authRoutes from "./routes/auth.routes.js";


// DATABASE CONNECTION
connectDB();

// DIRECTORY PATH
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ENVIRONMENT VARIABLES
const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    MONGO_URI: z.string().default(
        "mongodb://127.0.0.1:27017/siddhant_db"
    ),
    JWT_SECRET: z.string().default("lalaladfhgdsjgf"),
    ACCESS_TOKEN_SECRET: z.string().default("accessSecret123"),
    REFRESH_TOKEN_SECRET: z.string().default("refreshSecret456")
});

export const env = envSchema.parse(process.env);

// EXPRESS APP
const app = express();


// VIEW ENGINE
app.set("view engine", "ejs");

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(isloggedIn);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRoutes);

app.use((req, res) => {
    res.status(404).send(`Route not found: ${req.url}`);
});

app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
});