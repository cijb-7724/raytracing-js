var canvas = document.getElementById("can1");
var context = canvas.getContext("2d");

context.fillStyle = `rgb(${49}, ${176}, ${146})`;
context.fillRect(0, 0, 640, 640);

var wx = 320, wy = 320;
var yFloor = 400, yCeil = -600;
var zsc = 400;
var center = [0, 0, 1500];


var xsc, ysc;
var zeros = [0, 0, 0];
var r = (yFloor - yCeil) / 2;
var Vsee = zeros, Esee = zeros, Vdsee = zeros;


var image = context.getImageData(0, 0, 640, 640);
var pixels = image.data;
for (var i=0; i<2*wy; ++i) {
    for (var j=0; j<2*wx; ++j) {
        ysc = i - wy;
        xsc = j - wx;
        Vsee = [xsc, ysc, zsc];
        var norm = 0.0;
        for (var k=0; k<3; ++k) norm += Vsee[k] * Vsee[k];
        for (var k=0; k<3; ++k) Esee[k] = Vsee[k] / Math.sqrt(norm);
        var c1 = dot(Esee, center) / dot(Esee, Esee);
        var c2 = dot(center, center) - r*r;
        if (c1 * c1 - c2 < 0) {
            //exist t > 0 s.t. t*esee|y = floor or ceil
            var t = yFloor / Esee[1];
            if (t > 0) setColor(pixels, wx, i, j, floorColor(t * Esee[0], t * Esee[2]));
            t = yCeil / Esee[1];
            if (t > 0) setColor(pixels, wx, i, j, ceilColor(t * Esee[0], t * Esee[2]));
        } else {
            var t = c1 - Math.sqrt(c1 * c1 - c2);
            var n = zeros;
            for (var k=0; k<3; ++k) n[k] = t * Esee[k] - center[k];
            var coef = -2 * dot(Esee, n);
            for (var k=0; k<3; ++k) Vdsee[k] = Esee[k] + coef * n[k];
            var s = yFloor / Vdsee[1];
            if (s > 0) {
                var base = (i*2*wx + j) * 4;
                var tmpColor = floorColor(s * Vdsee[0], s * Vdsee[2]);
                pixels[base + 0] = tmpColor[0];
                pixels[base + 1] = tmpColor[1];
                pixels[base + 2] = tmpColor[2];
                pixels[base + 3] = 255;
            }
            s = yCeil / Vdsee[1];
            if (s > 0) {
                var base = (i*2*wx + j) * 4;
                var tmpColor = ceilColor(s * Vdsee[0], s * Vdsee[2]);
                pixels[base + 0] = tmpColor[0];
                pixels[base + 1] = tmpColor[1];
                pixels[base + 2] = tmpColor[2];
                pixels[base + 3] = 255;
            }
        }
        
        
    }
}
context.putImageData(image, 0, 0);

















function dot(a, b) {
    var sum = 0;
    for (var k=0; k<3; ++k) sum += a[k] * b[k];
    return sum;
}

function floorColor(x, z) {
    var wid = 400;
    var r=0, g=0, b=0;
    if (Math.abs(Math.floor(x/wid)%2) == Math.abs(Math.floor(z/wid)%2)) b = 255;
    else r = 255;
    return [r, g, b, 255];
}
function ceilColor(x, z) {
    var wid = 400;
    var r=0, g=0, b=0;
    if (Math.abs(Math.floor(x/wid)%2) == Math.abs(Math.floor(z/wid)%2)) r = 255, g = 255;
    else g = 255;
    return [r, g, b, 255];
}

if (s > 0) {
    var base = (i*2*wx + j) * 4;
    var tmpColor = ceilColor(s * Vdsee[0], s * Vdsee[2]);
    pixels[base + 0] = tmpColor[0];
    pixels[base + 1] = tmpColor[1];
    pixels[base + 2] = tmpColor[2];
    pixels[base + 3] = 255;
}
function setColor(pixels, wx, i, j, color) {
    var base = (i*2*wx + j) * 4;
    for (var k=0; k<4; ++k) pixels[base + k] = color[k];
}