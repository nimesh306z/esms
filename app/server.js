const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); 

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Esms application." });  
});

require("./routes/zapp.routes.js")(app);

// set port, listen for requests
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
