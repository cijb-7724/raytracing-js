var canvas = document.getElementsByClassName("canv-dynamic");
// console.log('in dynamic js');
// console.log(canvas.length);
// if (canvas.length > 0) {
canvas = canvas[0];
var context = canvas.getContext("2d", { willReadFrequently: true });
context.fillStyle = `rgb(${49}, ${176}, ${146})`;
context.fillRect(0, 0, canvas.width, canvas.height);

// スムージングを無効化
context.imageSmoothingEnabled = false;

var width = canvas.width, height = canvas.height;
var wx = canvas.width/2, wy = canvas.height/2;
var yFloor = 400, yCeil = -yFloor;
var zsc = 200;
var r = 500;

var xsc, ysc;
var zeros = [0, 0, 0];
var Vsee = zeros.slice(), Esee = zeros.slice(), Vdsee = zeros.slice();


var midC = [0, 0, 1700];
// var midC = [400, 100, 1100];


var radius = 600;
var center = [midC[0], midC[1], midC[2]+radius];
var x, z, nx, nz, theta;

var t = 10;
var cnt = 0;
theta = Math.PI * 2 / (t * 10);
// theta = 0;
// t = 0;

draw();
function draw() {
    requestAnimationFrame(draw);
    updateCenterPosition();
    render();
    ++cnt;
    cnt %= 600;

    // setTimeout(draw, 1000/30);
    // if ((Math.floor(cnt/300))%2 == 0) {
    //     r = 500;
    //     midC = [0, 0, 1700];
    //     x = center[0], z = center[2];
    //     x -= midC[0];
    //     z -= midC[2];
    //     nx = Math.cos(theta) * x - Math.sin(theta) * z;
    //     nz = Math.sin(theta) * x + Math.cos(theta) * z;
    //     center[0] = nx + midC[0];
    //     center[2] = nz + midC[2];
    // } else {
    //     r = 250;
    //     midC = [0, 150, 1700];
    //     x = center[0], z = center[2];
    //     x -= midC[0];
    //     z -= midC[2];
    //     nx = Math.cos(theta) * x - Math.sin(theta) * z;
    //     nz = Math.sin(theta) * x + Math.cos(theta) * z;
    //     center[0] = nx + midC[0];
    //     center[2] = nz + midC[2];
    // }
    // render();
    // ++cnt;
    // if (cnt >= 600) cnt -= 600;
}

function updateCenterPosition() {
    if (Math.floor(cnt / 300) % 2 === 0) {
        r = 500;
        midC = [0, 0, 1700];
    } else {
        r = 250;
        midC = [0, 150, 1700];
    }

    var x = center[0] - midC[0];
    var z = center[2] - midC[2];
    var nx = Math.cos(theta) * x - Math.sin(theta) * z;
    var nz = Math.sin(theta) * x + Math.cos(theta) * z;

    center[0] = nx + midC[0];
    center[2] = nz + midC[2];
}

function render() {
    var image = context.getImageData(0, 0, width, height);
    var pixels = image.data;
    for (var i=0; i<2*wy; ++i) for (var j=0; j<2*wx; ++j) {
        ysc = i - wy;
        xsc = j - wx;
        Vsee = [xsc, ysc, zsc];
        var norm = Math.sqrt(dot(Vsee, Vsee));
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
            // //球で反射
            var isFloor = false, isCeil = false;
            var t = c1 - Math.sqrt(c1 * c1 - c2);
            var n = zeros;
            for (var k=0; k<3; ++k) n[k] = t * Esee[k] - center[k];
            norm = Math.sqrt(dot(n, n));
            for (var k=0; k<3; ++k) n[k] /= norm;
        
            var coef = -2 * dot(Esee, n);
            for (var k=0; k<3; ++k) Vdsee[k] = Esee[k] + coef * n[k];

            var s = (yFloor-t*Esee[1]) / Vdsee[1];
            if (s > 0) setColor(pixels, wx, i, j, floorColor(t*Esee[0] + s*Vdsee[0], t*Esee[2] + s*Vdsee[2], true));
            else if (s*Vdsee[1] < 0) isFloor = true;
            
            s = (yCeil-t*Esee[1]) / Vdsee[1];
            if (s > 0) setColor(pixels, wx, i, j, ceilColor(t*Esee[0] + s*Vdsee[0], t*Esee[2] + s*Vdsee[2], true));
            else if (s*Vdsee[1] > 0) isCeil = true;

            if (isFloor) setColor(pixels, wx, i, j, floorColor(yFloor / Esee[1] * Esee[0], yFloor / Esee[1] * Esee[2]));
            if (isCeil) setColor(pixels, wx, i, j, ceilColor(yCeil/Esee[1]*Esee[0], yCeil/Esee[1] * Esee[2]));
        }
    }
    context.putImageData(image, 0, 0);
}


function dot(a, b) {
    var sum = 0;
    for (var k=0; k<3; ++k) sum += a[k] * b[k];
    return sum;
}
function starIn(x, y, r) {
    var ok = true;
    var theta = Math.PI * 4 / 5;
    var as = [0, 0, 0, 0, 0];
    var bs = [0, 0, 0, 0, 0];
    for (var k=0; k<5; ++k) {
        xp = r * Math.cos(Math.PI / 2 + theta * k);
        yp = r * Math.sin(Math.PI / 2 + theta * k);
        xq = r * Math.cos(Math.PI / 2 + theta * (k+1));
        yq = r * Math.sin(Math.PI / 2 + theta * (k+1));
        var a = (yq - yp) / (xq - xp);
        //yp = a xp + b
        var b = yp - a * xp;
        as[k] = a;
        bs[k] = b;
    }
    if (y > as[0] * x + bs[0] && y > as[2] * x + bs[2]) ok = false;
    if (y < as[3] * x + bs[3] && y > as[0] * x + bs[0]) ok = false;
    if (y < as[1] * x + bs[1] && y < as[3] * x + bs[3]) ok = false;
    if (y > as[4] * x + bs[4] && y < as[1] * x + bs[1]) ok = false;
    if (y > as[2] * x + bs[2] && y > as[4] * x + bs[4]) ok = false;
    
    
    return ok;
}
function floorColor(x, z, refrect=false) {
    var wid = 400;
    var alpha = 255;
    var r=0, g=0, b=0;
    if (Math.abs(Math.floor(x/wid)%2) == Math.abs(Math.floor(z/wid)%2)) {
        var nx = Math.abs(x) % wid;
        var nz = Math.abs(z) % wid;
        nx -= wid/2;
        nz -= wid/2;
        if (starIn(nx, nz, wid/2*0.8)) {
            r=255;
            g=255;
            b=255;
        } else {
            r=205;
            g=171;
            b=124;
        }
    } else {
        var nx = Math.abs(x) % wid;
        var nz = Math.abs(z) % wid;
        nx -= wid/2;
        nz -= wid/2;
        if (starIn(nx, nz, wid/2*0.8)) {
            r=205;
            g=171;
            b=124;
        } else {
            r=255;
            g=255;
            b=255;
            // r=205;
            // g=171;
            // b=124;
        }
    }
    var d = (x*x + z*z)/1000000
    r = Math.min(r, r/d);
    g = Math.min(g, g/d);
    b = Math.min(b, b/d);
    

    //-500, 2500
    if (refrect) alpha *= 0.9;
    return [r, g, b, alpha];
}
function ceilColor(x, z, refrect=false) {
    var wid = 400;
    var alpha = 255;
    var r=0, g=0, b=0;
    if (Math.abs(Math.floor(x/wid)%2) == Math.abs(Math.floor(z/wid)%2)) {
        r = 160;
        g = 160;
        b = 234;
    } else {
        r = 243;
        g = 239;
        b = 96;
    }
    var d = (x*x + z*z)/1000000
    r = Math.min(r, r/d);
    g = Math.min(g, g/d);
    b = Math.min(b, b/d);
    
    
    if (refrect) alpha *= 0.9;
    return [r, g, b, alpha];
}
function setColor(pixels, wx, i, j, color) {
    var base = (i*2*wx + j) * 4;
    for (var k=0; k<4; ++k) pixels[base + k] = color[k];
}


// }