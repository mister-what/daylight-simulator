"use strict";
var d3 = require("d3");
var fs = require("fs");
var request = require("request");
var config = require("./config");
var hueColor = require("./interpolateHueColor");
var times = require("./times");
var TimeInterval = require("./hueTimeIntervall");
var timeInterval = new TimeInterval();

function transitionTo(color, time, cb) {
  if (!cb) {
    cb = function () {
    };
  }
  var body = hueColor.colorToHsv(color);
  body.transitiontime = time;
  body.on = true;
  var options = {
    method: "PUT",
    url: "http://" + config.bridgeIp + "/api/" + config.user + "/lights/" + config.light + "/state",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  };
  request(options, function (error, response, body) {
    if (error) {
      return cb(error);
    }
    cb(null, JSON.parse(body));
  });
}


function timeString(dateObj) {
  var hours = dateObj.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  var minutes = dateObj.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
}

/* eslint-disable no-console*/
function check2() {
  times.forEach(function (elem) {
    timeInterval.addV2(elem.time, elem.color);
  });
  var now = new Date();
  transitionTo(timeInterval.getColorForNow(), 30 * 10, function (err, result) {
    if (err) {
      return console.error(err);
    }
    console.log("result", timeString(now), JSON.stringify(result, null, 2));
  });
}
/* eslint-enable no-console*/


function saveColorConfig(cb) {
  var times = [];
  for (let x in timeInterval.contentsObj) {
    times.push({
      time: x,
      color: timeInterval.contentsObj[x].color
    });
  }
  fs.writeFile("./times.json", JSON.stringify(times, null, 2), "utf8", cb);
}

function saveConfig(cb) {
  fs.writeFile("./config.json", JSON.stringify(config, null, 2), "utf8", cb);
}

function getArray(req, res) {
  req.params.type = req.params.type || "";
  if (req.params.type.toLowerCase() === "object") {
    var colors = timeInterval.minuteArray.map(function (elem) {
      var rgb = d3.rgb(elem);
      return {r: rgb.r, g: rgb.g, b: rgb.b};
    });
    return res.json({offset: -timeInterval.offset, colors: colors});
  } else {
    return res.json({offset: -timeInterval.offset, colors: timeInterval.minuteArray});
  }
}

function newUserGeneric(data, cb) {
  
  var bridgeIp = config.bridgeIp;
  if (data && data.bridgeIp) {
    bridgeIp = data.bridgeIp;
  }
  var body = {"devicetype": "node.js#daylight-simulator"};
  var options = {
    method: "POST",
    url: "http://" + bridgeIp + "/api",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  };
  request(options, function (error, response, body) {
    body = JSON.parse(body);
    if (error || body[0].error) {
      return cb(null, {message: "Press Hue button!", done: false});
    }
    if (body[0].success && body[0].success.username) {
      config.user = body[0].success.username;
      config.bridgeIp = bridgeIp;
      saveConfig(function (err) {
        if (err) {
          return cb({error: "Saving failed."});
        }
        cb({message: "successful", done: true});
      });
    }
  });
}

function postNewUser(req, res) {
  newUserGeneric(req.body, function (err, result) {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result)
  });
}

function newUser(req, res) {
  var bridgeIp = config.bridgeIp;
  if (req.body && req.body.bridgeIp) {
    bridgeIp = req.body.bridgeIp;
  }
  var body = {"devicetype": "node.js#daylight-simulator"};
  var options = {
    method: "POST",
    url: "http://" + bridgeIp + "/api",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  };
  var tryCount = 0;
  
  function tryRequest() {
    if (tryCount <= 20) {
      request(options, function (error, response, body) {
        body = JSON.parse(body);
        if (error || body[0].error) {
          if (!tryCount) {
            res.status(200);
            res.write("Press Hue button to continue...\n");
            tryCount += 1;
            return setTimeout(tryRequest, 2000);
          }
        }
        if (body[0].success && body[0].success.username) {
          config.user = body[0].success.username;
          config.bridgeIp = bridgeIp;
          saveConfig(function (err) {
            if (err) {
              res.write("Saving failed!");
              return res.end();
            }
            res.write("Done!");
            res.end();
          });
        } else {
          tryCount += 1;
          return setTimeout(tryRequest, 2000);
        }
      });
    } else {
      if (!res.finished) {
        res.write("Failed!");
        return res.end();
      }
    }
  }
  
  tryRequest();
}


function putColorIntervals(req, res) {
  timeInterval.put(req.body);
  saveColorConfig(function (err) {
    if (err) {
      return res.status(500).json({error: "Persisting failed."});
    }
    return res.json(timeInterval.contentsObj);
  });
}


function getColorIntervals(req, res) {
  res.json(timeInterval.contentsObj);
}

function getConfig(req, res) {
  res.json(config);
}

function putConfig(req, res) {
  var newConfig = req.body;
  for (let x in config) {
    config[x] = newConfig[x] || config[x];
  }
  saveConfig(function (err) {
    if (err) {
      return res.status(500).json({error: "Persisting config failed."});
    }
    return res.json(config);
  });
}

function newColorTimeConfig(req, res) {
  if (req.params.time.split(":").length < 2) {
    return res.status(400).json({error: "Time must be in the format: hh:mm"});
  }
  var time = req.params.time.split(":")[0] + ":" + req.params.time.split(":")[1];
  var color = {
    h: Number(req.body.h || 0),
    s: Number(req.body.s || 0),
    l: Number(req.body.l || 0)
  };
  timeInterval.addV2(time, color);
  saveColorConfig(function (err) {
    if (err) {
      return res.status(500).json({error: "Persisting failed."});
    }
    return res.status(200).json(timeInterval.contentsObj);
  });
}

module.exports = {
  getArray: getArray,
  putColorIntervals: putColorIntervals,
  getColorIntervals: getColorIntervals,
  newUser: newUser,
  postNewUser: postNewUser,
  getConfig: getConfig,
  putConfig: putConfig,
  newColorTimeConfig: newColorTimeConfig,
  check2: check2,
  newUserGeneric: newUserGeneric
};
