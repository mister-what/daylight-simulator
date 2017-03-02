var d3 = require('d3');

function rgb2hsv(r, g, b) {
  var computedH;
  var computedS;
  var computedV = 0;
  if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
    return [0, 0, 0];
  }
  r = r / 255;
  g = g / 255;
  b = b / 255;
  var minRGB = Math.min(r, Math.min(g, b));
  var maxRGB = Math.max(r, Math.max(g, b));
  if (minRGB == maxRGB) {
    computedV = minRGB;
    return [0, 0, computedV];
  }
  var d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
  var h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
  computedH = 60 * (h - d / (maxRGB - minRGB));
  computedS = (maxRGB - minRGB) / maxRGB;
  computedV = maxRGB;
  return [computedH, computedS, computedV];
}

function colorToHsv(color) {
  color = d3.rgb(color);
  var hsv = rgb2hsv(color.r, color.g, color.b);
  console.log(hsv);
  var hue, sat, bri;
  hue = Math.floor((65536 / 360) * hsv[0]);
  sat = Math.floor(255 * hsv[1]);
  bri = Math.floor(255 * hsv[2]);
  if (sat > 254) {
    sat = 254;
  } else if (sat < 1) {
    sat = 1;
  }
  if (bri > 254) {
    bri = 254;
  } else if (bri < 1) {
    bri = 1;
  }
  return {
    hue: hue,
    sat: sat,
    bri: bri
  };
}

module.exports.colorToHsv = colorToHsv;