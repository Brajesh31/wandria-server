const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// export routes
const userRouter = require("./routes/user.route");
const handler = require("./middleware/errorHandler");
const tripRouter = require("./routes/trip.route");
const bookingRouter = require("./routes/booking.route");
const authRouter = require("./routes/auth.route");
const refreshRoute = require("./routes/refresh.route");
const accountRouter = require("./routes/account.route");
const dashRouter = require("./routes/dashboard.route");

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, please try again later after 15 min.",
});

app.set("trust proxy", 1);
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: "https://wandira-travel.vercel.app" ,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/trip", tripRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/refresh", refreshRoute);
app.use("/api/profile", accountRouter);
app.use("/api/v1/dashboard", dashRouter);

app.use(handler);

app.listen(process.env.PORT, () => {
  console.log(`Server run in port:${process.env.PORT}`);

  mongoose
    .connect(process.env.MONGO_URL)
    .then(console.log("Database Connected Successfully."))
    .catch((err) => console.log("error in conection with DB: ", err.message));
});
