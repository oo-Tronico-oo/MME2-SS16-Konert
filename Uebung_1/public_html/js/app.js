/**
 * Created on : 07.04.2016
 * Authors    : Lisa Bitterling, Nico Nauendorf, Christoph Kozielski
 */

// startet die Funktion init wenn DOM vollständig geladen wurde
window.addEventListener("load", init, false);

//
function init() {
    var allVideoContainer = document.getElementById("allVideo").getElementsByTagName("section");

    for (var i = 0; i < allVideoContainer.length; i++) {
        var allButtons = allVideoContainer[i].getElementsByTagName("button");
        var video = allVideoContainer[i].getElementsByTagName("video");

        for (var t = 0; t < allButtons.length; t++) {
            var btn = allButtons[t];
            //console.log(btn);
            btn.addEventListener("click", function (event) {
                //console.log(event);
                handleButton(event);
            });
        }
    }
}

function handleButton(event) {
    var btn = event.target;
    console.log(btn);
    switch (btn.innerHTML) {
        case 'play' :
            console.log(video);
            //video.play();
            break;
        case 'break' :
            //video.pause();
            break;
        case 'stop' :
            //video.stop();
            break;
    }
}