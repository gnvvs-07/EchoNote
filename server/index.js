// requirements
require("dotenv").config({ path: __dirname + "/.env" });  // Specify the path to the .env file
require("express-async-errors");
const express = require("express");
const cors = require("cors");
// routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const playlistRoutes = require("./routes/playlist");
const searchRoutes = require("./routes/search");
// creating an express app
const app = express();
// establishing a connection to DataBase
const connection = require("./db");
// creating a connection
connection();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/login", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/search", searchRoutes); // Change the path here

// port declaration
const port = process.env.PORT || 8080;
// app listen
app.listen(port, () => console.log(`Listening on port ${port}!!!`)); // Use an arrow function for the callback
