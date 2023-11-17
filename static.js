var canvas = document.getElementById("can1");
var context = canvas.getContext("2d", { willReadFrequently: true });

context.fillStyle = `rgb(${49}, ${176}, ${146})`;
context.fillRect(0, 0, 640, 640);

var wx = 320, wy = 320;
var yFloor = 400, yCeil = -yFloor;
var zsc = 400;
var center = [200, 0, 1200];
var r = 400;

var xsc, ysc;
var zeros = [0, 0, 0];
var Vsee = zeros.slice(), Esee = zeros.slice(), Vdsee = zeros.slice();


// draw();
function draw() {
    // requestAnimationFrame(draw);
    setTimeout(draw, 1000/30);
    // center[2] += 10;
    if (center[2] > 4000) center[2] = 1000;
    render();
}
render()

function render() {
    var image = context.getImageData(0, 0, 640, 640);
    var pixels = image.data;
    for (var i=0; i<2*wy; ++i) for (var j=0; j<2*wx; ++j) {
        ysc = i - wy;
        xsc = j - wx;
        Vsee = [xsc, ysc, zsc];
        var norm = 0.0;
        // for (var k=0; k<3; ++k) norm += Vsee[k] * Vsee[k];
        norm = Math.sqrt(dot(Vsee, Vsee));
        for (var k=0; k<3; ++k) Esee[k] = Vsee[k] / norm;
        var c1 = dot(Esee, center);
        var c2 = dot(center, center) - r*r;
        if (c1 * c1 - c2 < 0) {
            //直接床/天井にぶつかる
            //exist t > 0 s.t. t*esee|y = floor or ceil
            var t = yFloor / Esee[1];
            if (t > 0) setColor(pixels, wx, i, j, floorColor(t * Esee[0], t * Esee[2]));
            t = yCeil / Esee[1];
            if (t > 0) setColor(pixels, wx, i, j, ceilColor(t * Esee[0], t * Esee[2]));
        } else {
            //球で反射
            var t = c1 - Math.sqrt(c1 * c1 - c2);
            var n = zeros;
            for (var k=0; k<3; ++k) n[k] = t * Esee[k] - center[k];
            norm = dot(n, n);
            norm = Math.sqrt(norm);
            // console.log(norm);
            for (var k=0; k<3; ++k) n[k] /= norm;
            
            var coef = -2 * dot(Esee, n);
            for (var k=0; k<3; ++k) Vdsee[k] = Esee[k] + coef * n[k];
            if (xsc == 50 && ysc == 50) {
                console.log(t);
                console.log(Esee);
                console.log(Vdsee);
            }

            var s = (yFloor-t*Esee[1]) / Vdsee[1];
            if (s > 0) setColor(pixels, wx, i, j, floorColor(s * Vdsee[0], s * Vdsee[2]));
            s = yCeil / Vdsee[1];
            if (s > 0) setColor(pixels, wx, i, j, ceilColor(s * Vdsee[0], s * Vdsee[2]));
        }
    }
    context.putImageData(image, 0, 0);

}










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
    r /= (x*x + z*z)/10000000;
    g /= (x*x + z*z)/10000000;
    b /= (x*x + z*z)/10000000;
    return [r, g, b, 255];
}
function ceilColor(x, z) {
    var wid = 400;
    var r=0, g=0, b=0;
    if (Math.abs(Math.floor(x/wid)%2) == Math.abs(Math.floor(z/wid)%2)) r = 255, g = 255;
    else g = 255;
    r /= (x*x + z*z)/10000000;
    g /= (x*x + z*z)/10000000;
    b /= (x*x + z*z)/10000000;
    return [r, g, b, 255];
}
function setColor(pixels, wx, i, j, color) {
    var base = (i*2*wx + j) * 4;
    for (var k=0; k<4; ++k) pixels[base + k] = color[k];
}