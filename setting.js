
var setting = document.getElementsByClassName('fa-gear');
setting = setting[0];
setting.addEventListener('click', function() {
    this.classList.toggle('fa-gear-clicked');
    this.classList.toggle('fa-spin');
    for (var j=0; j<buttons.length; ++j) {
        buttons[j].classList.remove('button-clicked');
    }
});

var buttons = document.getElementsByClassName('button');
for (var i=0; i<buttons.length; ++i) {
    buttons[i].addEventListener('click', function() {
        setting.classList.remove('fa-gear-clicked');
        setting.classList.remove('fa-spin');
        for (var j=0; j<buttons.length; ++j) {
            buttons[j].classList.remove('button-clicked');
        }
        this.classList.add('button-clicked');
    });
}


var canv = document.getElementsByClassName('canv');
canv = canv[0];

var changeJsDynamic = document.getElementsByClassName('dynamic');
changeJsDynamic = changeJsDynamic[0];
changeJsDynamic.addEventListener('click', function() {
    canv.classList.add('canv-dynamic');
    canv.classList.remove('canv-static');
    
    //test print
    var canvas = document.getElementsByClassName("canv-static");
    console.log('in static js');
    console.log(canvas.length);

    canvas = document.getElementsByClassName("canv-dynamic");
    console.log('in dynamic js');
    console.log(canvas.length);
});

var changeJsStatic = document.getElementsByClassName('static');
changeJsStatic = changeJsStatic[0];
changeJsStatic.addEventListener('click', function() {
    canv.classList.add('canv-static');
    canv.classList.remove('canv-dynamic');

    //test print
    var canvas = document.getElementsByClassName("canv-static");
    console.log('in static js');
    console.log(canvas.length);

    canvas = document.getElementsByClassName("canv-dynamic");
    console.log('in dynamic js');
    console.log(canvas.length);
});


