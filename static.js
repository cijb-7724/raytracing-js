var canvas = document.getElementById("can1");
var context = canvas.getContext("2d");

context.fillStyle = "rgb(200, 20, 100)";
context.fillRect(100, 100, 200, 100);

// context.fillStyle = "rgb(100, 80, 100)";
context.fillStyle = `rgb(${100}, ${80}, ${100})`;
context.strokeRect(100, 200, 200, 100);

context.clearRect(150, 175, 100, 50);

// start = 300;
// var image = context.getImageData(start, start, 300, 300);
// var wid = image.width, hei = image.height;
// var pixels = image.data;
// for (var i=0; i<hei; ++i) {
//     for (var j=0; j<wid; ++j) {
//         var base = (i*wid + j) * 4;
//         pixels[base + 0] = j;
//         pixels[base + 1] = i;
//         pixels[base + 2] = Math.max(255-i-j, 0);
//         pixels[base + 3] = 255;
//     }
// }
// context.putImageData(image, start, start);

var wx = 320, wy = 320;
var yFloor = 400, yCeil = -400;
var zsc = 100;
var center = [0, 0, 800];


var xsc, ysc;
var zeros = [0, 0, 0];
var r = 600;
var Vsee = zeros, Esee = zeros, Vdsee = zeros;

function dot(a, b) {
    var sum = 0;
    for (var k=0; k<3; ++k) sum += a[k] * b[k];
    return sum;
}

function floorColor(x, z) {
    var wid = 100;
    var r=0, g=0, b=0;
    if (Math.floor(x/wid)%2 == Math.floor(z/wid)%2) r = 255;
    else g = 255;
    return [r, g, b];
}
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
            var t = yFloor / Esee[1]
            if (t > 0) {
                var base = (i*2*wx + j) * 4;
                var tmpColor = floorColor(t * Esee[0], t * Esee[2]);
                pixels[base + 0] = tmpColor[0];
                pixels[base + 1] = tmpColor[1];
                pixels[base + 2] = tmpColor[2];
                pixels[base + 3] = 255;
            }
            var t = yCeil / Esee[1]
            if (t > 0) {
                var base = (i*2*wx + j) * 4;
                var tmpColor = floorColor(t * Esee[0], t * Esee[2]);
                pixels[base + 0] = tmpColor[0];
                pixels[base + 1] = tmpColor[1];
                pixels[base + 2] = tmpColor[2];
                pixels[base + 3] = 255;
            }
        } else {
            // var t = c1 - Math.sqrt(c1 * c1 - c2);
            // var n = zeros;
            // for (var k=0; k<3; ++k) n[k] += t * Esee[k] - center[k];
            // var coef = -2 * dot(Esee, n);
            // for (var k=0; k<3; ++k) Vdsee[k] += Esee[k] + coef * n[k];
        }
        
    }
}
context.putImageData(image, 0, 0);
console.log(10);
