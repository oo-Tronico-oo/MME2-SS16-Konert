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

        for (var t = 0; t < allButtons.length; t++) {
            var btn = allButtons[t];
            
            btn.addEventListener("click", function (event) {
                handleButton(event);
            });
        }
    }
}

function handleButton(event) {
    var btn = event.target;
    var video = btn.parentNode.getElementsByTagName("video")[0];
    
    switch (btn.innerHTML) {
        case 'play' :
            video.play();
            btn.innerHTML = "break";
            break;
        case 'break' :
            video.pause();
            btn.innerHTML = "play";
            break;
        case 'stop' :
            video.currentTime = 0;
            video.pause();
            video.parentNode.getElementsByTagName("button")[0].innerHTML = "play";
            break;
    }
}