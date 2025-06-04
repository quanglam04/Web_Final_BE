const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AdminRoutes = require("./routes/AdminRouter");
const authenticateToken = require("./middleware/authenticateToken");
require("dotenv").config();

dbConnect();

const corsOptions = {
  origin: `${process.env.ALLOW_ORIGIN}`,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/user", authenticateToken, UserRouter);
app.use("/api/photo", authenticateToken, PhotoRouter);
app.use("/api/admin", AdminRoutes);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
