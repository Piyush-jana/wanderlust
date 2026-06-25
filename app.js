require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

const reviewRouter = require("./routes/review.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

const Listing = require("./init/index");

const dbUrl = process.env.ATLAS;

async function main() {
await mongoose.connect(dbUrl);
}

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Mongo Session Store
const store = MongoStore.create({
mongoUrl: dbUrl,
crypto: {
secret: process.env.SECRET,
},
touchAfter: 24 * 3600,
});

store.on("error", (err) => {
console.log("Session Store Error:", err);
});

const sessionOptions = {
store,
secret: process.env.SECRET,
resave: false,
saveUninitialized: true,
cookie: {
expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
maxAge: 7 * 24 * 60 * 60 * 1000,
httpOnly: true,
},
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals Middleware
app.use((req, res, next) => {
res.locals.currUser = req.user;
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
next();
});

// Routes
app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);

// Database Initialization Route
app.get("/init", async (req, res, next) => {
try {
await Listing.initDB();
req.flash("success", "Database initialized successfully.");
res.redirect("/listing");
} catch (err) {
next(err);
}
});

// 404 Handler (Express 5 Compatible)
app.use((req, res, next) => {
const err = new Error("Page Not Found");
err.statusCode = 404;
next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
const { statusCode = 500, message = "Something went wrong" } = err;

```
res.status(statusCode).render("listing/error.ejs", {
    message,
});
```

});

// Start Server After DB Connection
const PORT = process.env.PORT || 8080;

main()
.then(() => {
console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.log("MongoDB Connection Error:", err);
});
