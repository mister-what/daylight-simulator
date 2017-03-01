/**
 * Created by napalm on 28.02.17.
 */
'use strict';
var interpolateHueColor = require('./interpolateHueColor');
var d3 = require('d3');

function TimeInterval() {
  this.contentsObj = {};
  this.minuteArray = [];
  this.offset = 0;
}

function timeInMinutes(timeString) {
  return Number(timeString.split(':')[0]) * 60 + Number(timeString.split(':')[1]);
}

TimeInterval.prototype.put = function (contentsObj) {
  this.contentsObj = {};
  this.minuteArray = [];
  this.offset = 0;
  for(let x in contentsObj) {
    if(!contentsObj[x].color) {
      contentsObj[x].color = {h: 0, s: 0, l: 0};
    }
    contentsObj[x].color.h = Number(contentsObj[x].color.h) || 0;
    contentsObj[x].color.s = Number(contentsObj[x].color.s) || 0;
    contentsObj[x].color.l = Number(contentsObj[x].color.l) || 0;
    this.addV2(x, contentsObj[x].color);
  }
};

TimeInterval.prototype.addV2 = function(timeString, hslColor) {
  var that = this;
  hslColor = d3.hsl(hslColor.h, hslColor.s, hslColor.l);
  this.contentsObj[timeString] = {
    name: timeString,
    beginMinute: timeInMinutes(timeString),
    color: hslColor
  };
  if(this.minuteArray.length < 1440) {
    this.contentsObj[timeString].next = timeString;
    for(let i = 0; i < 1440; i++) {
      this.minuteArray.push(hslColor);
    }
    this.offset = timeInMinutes(timeString);
  } else {
    var contents = [];
    for(let x in this.contentsObj) {
      contents.push(this.contentsObj[x]);
    }
    contents.sort(function(first, second) {
      return first.beginMinute - second.beginMinute;
    });
    this.offset = contents[0].beginMinute;
    contents.forEach(function(elem, index) {
      contents[index].next = contents[(index+1)%contents.length].name;
      that.contentsObj[contents[index].name] = contents[index];
    });
    this.minuteArray = [];
    for(let x in that.contentsObj) {
      let duration = that.contentsObj[that.contentsObj[x].next].beginMinute - that.contentsObj[x].beginMinute;
      if(duration < 0) {
        duration += 24*60;
      }
      let interpolator = d3.interpolateHsl(that.contentsObj[x].color, that.contentsObj[that.contentsObj[x].next].color);
      this.minuteArray = this.minuteArray.concat(d3.quantize(interpolator, duration));
    }
  }
};

TimeInterval.prototype.getColorForNow = function() {
  var now = new Date();
  var index = now.getHours()*60 + now.getMinutes() - this.offset + this.minuteArray.length;
  return d3.hsl(this.minuteArray[index%this.minuteArray.length]);
};

module.exports = TimeInterval;