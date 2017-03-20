"use strict";

var expressStream = require("express-stream");
var configController = require("./config.controller");
var bodyParser = require("body-parser");
var express = require("express");

var app = express();

expressStream.useAllAutoTags(true);

app.use(bodyParser.json({strict: false}));
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    res.status(400).json({error: "Input contains syntax errors."});
  } else {
    next();
  }
});

app.get("/user/new", expressStream.stream(), configController.newUser);
app.post("/user/new", configController.postNewUser);
app.get("/colors/intervals", configController.getColorIntervals);
app.put("/colors/intervals", configController.putColorIntervals);
app.get("/colors/byMinute", configController.getArray);
app.get("/colors/byMinute/:type", configController.getArray);
app.get("/config", configController.getConfig);
app.put("/config", configController.putConfig);
app.post("/colors/:time/new", configController.newColorTimeConfig);


function init() {
  configController.check2();
  app.listen(3000, "0.0.0.0");
  setInterval(configController.check2, 60 * 1000);
}

init();
