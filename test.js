var canvas = document.getElementById("can1");
var context = canvas.getContext("2d");

context.fillStyle = "rgb(200, 20, 100)";
context.fillRect(100, 100, 200, 100);

context.fillStyle = "rgb(100, 80, 100)";
context.strokeRect(100, 200, 200, 100);

context.clearRect(150, 175, 100, 50);



draw();
var tx = 4 , ty = 7;
var x = 0, y = 0;
var rectSize = 100;
function draw() {
    requestAnimationFrame(draw);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(x, y, rectSize, rectSize);
    x += tx;
    y -= ty;
    if (x < 0 || x > canvas.width-rectSize) tx *= -1;
    if (y < 0 || y > canvas.width-rectSize) ty *= -1;

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

}