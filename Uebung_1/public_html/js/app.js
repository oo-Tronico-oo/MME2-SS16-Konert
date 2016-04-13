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
            btn.addEventListener("click", handleButton(btn, video));
        }
    }
}

function handleButton(btn, video) {
    switch (btn.innerHTML) {
        case 'play' :
            video.play();
            break;
        case 'break' :
            video.pause();
            break;
        case 'stop' :
            video.stop();
            break;
    }
}