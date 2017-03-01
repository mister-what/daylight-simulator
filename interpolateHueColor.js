var d3 = require('d3');


function hsl2hsv(hue,sat,light){
  sat*=light<.5?light:1-light;
  return {
    h: hue,
    s: 2*sat/(light+sat),
    v: light+sat
  };
}

function colorToHsv(color) {
  color = d3.hsl(color);
  var hue, sat, bri;
  var hsvCol = hsl2hsv(color.h, color.s, color.l);
  hue = Math.floor((65536/360) * hsvCol.h);
  sat = Math.floor(254 * hsvCol.s);
  bri = Math.ceil(254 * hsvCol.v);
  return {
    hue: hue,
    sat: sat,
    bri: bri
  };
}

module.exports.colorToHsv = colorToHsv;