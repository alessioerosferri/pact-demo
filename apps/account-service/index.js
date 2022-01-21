const express = require("express");
const { initialize } = require("express-openapi");
const yaml = require("js-yaml");
const fs = require("fs");
const operations = require("./src/operations");

const app = express();
app.use(express.json());
app.all("*", (req, res, next) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Headers", "*, content-type"); // Authorization
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Authorization
  res.setHeader("Access-Control-Allow-Origin", req.get("origin") || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,PATCH,PUT,POST,DELETE,OPTIONS"
  );
  next();
});
initialize({
  app,
  apiDoc: yaml.load(fs.readFileSync("./docs/openapi.yml", "utf8")),
  operations,
});

module.exports = { app };
