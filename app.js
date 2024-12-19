require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./Middleware/errorHandler");
const authRouter = require("./Router/userRouter");
const { swaggerUi, swaggerDocs } = require("./swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Error Handling
app.use(errorHandler);

module.exports = app;
