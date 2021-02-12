const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const errorHandler = require("./middleware/error-handler");
const errorMessage = require("./middleware/error-message");
const accessControls = require("./middleware/access-controls");
const mongoose = require("mongoose");
const cors = require("cors");
const formData = require("express-form-data");
const bodyParser = require("body-parser");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
      swaggerDocument = require("./swagger.json");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

const UsersRoutes = require("./routes/users.routes");
const PostRoutes = require("./routes/post.routes");

// connection to mongoose
const mongoCon = process.env.mongoCon;
mongoose.connect(mongoCon, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

fs.readdirSync(__dirname + "/models").forEach(function (file) {
  require(__dirname + "/models/" + file);
});

// in case you want to serve images
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.status(200).send({
    message: "Express backend server",
  });
});

app.use(cors());
app.use(formData.parse());
app.use("/users", UsersRoutes);
app.use("/posts", PostRoutes);
app.use("/swagger",swaggerUi.serve, swaggerUi.setup(swaggerDocument));






app.use(errorHandler);
app.use(errorMessage);
app.use(accessControls);

app.set("port", process.env.PORT);
server.listen(app.get("port"));
console.log("listening on port", app.get("port"));
