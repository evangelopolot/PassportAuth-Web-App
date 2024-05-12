import express from "express";
import { config } from "dotenv";
config();
import cookieParser from "cookie-parser";
import sessions from "express-session";
import viewRouter from "./routes/viewRouter.mjs";
import userRouter from "./routes/usersRouter.mjs";
import path from "path";
import passport from "passport";
import AppError from "./utils/appError.mjs";
import globalErrorHandler from "./controllers/errorController.mjs";
import flash from "connect-flash";
import { fileURLToPath } from "url";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Parse application/json
app.use(express.json());
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Read the cookies
app.use(cookieParser("the secret"));

// Middleware to log the request
const skip = (req, res) => {
  return (
    req.url.startsWith("/css") ||
    req.url.startsWith("/scripts") ||
    req.url === "/favicon.ico"
  );
};
const customFormat = ":method :url :status - :response-time ms";
app.use(morgan(customFormat, { skip: skip }));

// Create sessions
app.use(
  sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false, // Dont save unmodified sessions - e.g. when users are just visiting
    resave: false,
    cookie: {
      maxAge: 60000 * 60, // how long the session is live for
    },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// This middleware will be called when authentication fails
app.use((req, res, next) => {
  if (req.session && req.session.flash && req.session.flash.error) {
    // Display the error message in the OAuth UI
    res.locals.error = req.session.flash.error[0];
    delete req.session.flash;
  }
  next();
});

// register view engine
app.set("view engine", "pug");

// tell view engine where to look
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // Return empty response
});

// Mount the Routes
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);

// Error handling middleware for invalid routes
app.all("*", (req, res, next) => {
  // Pass the error to the error handling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
export default app;
