const express = require("express");
const app = express();
// const vechicle = require("./routes/vehicle");
// const driver = require("./routes/driver");
// const gpsData = require("./routes/gpsData");
// const roads = require("./routes/road");
// const traffic = require("./routes/traffic");
// const violation = require("./routes/violation");
// const profile = require("./routes/driverProfile");
// const accident = require("./routes/accident");
// const maintenance = require("./routes/maintenance");
// const telematics = require("./routes/telematics");
const auth = require("./middleware/auth");
const authorization = require("./middleware/authorization");
const { pool, connectDB, disconnectDB } = require("./db/db");
// const loggerMiddleware = require("./middleware/logger");

connectDB();
app.use(express.json());
// app.use(loggerMiddleware);
// app.use("/", authorization);
// app.use("/register", auth);

// app.use("/api/vechicle", vechicle);
// app.use("/api/driver", driver);
// app.use("/api/gps", gpsData);
// app.use("/api/road", roads);
// app.use("/api/traffic", traffic);
// app.use("/api/violation", violation);
// app.use("/api/profile", profile);
// app.use("/api/accident", accident);
// app.use("/api/maintenance", maintenance);
// app.use("/api/telematics", telematics);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// not null
// foreign key constraint

// module.exports = client;
