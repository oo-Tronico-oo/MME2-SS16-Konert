/**
 * Created on : 07.04.2016
 * Authors    : Lisa Bitterling, Nico Nauendorf, Christoph Kozielski
 */

/**
 * startet die Funktion init wenn DOM vollständig geladen wurde
 */
window.addEventListener("load", init, false);

/**
 * the function that will be triggered when the DOM is fully loaded
 */
function init() {
    // get all sections
    var allVideoContainer = document.getElementById("allVideo").getElementsByTagName("section");

    // for every sections...
    for (var i = 0; i < allVideoContainer.length; i++) {
        // ... get all buttons...
        var allButtons = allVideoContainer[i].getElementsByTagName("button");

        // and for every button add the event listener
        for (var t = 0; t < allButtons.length; t++) {
            var btn = allButtons[t];
            
            btn.addEventListener("click", function (event) {
                handleButton(event);
            });
        }
    }
}

/**
 * this function will be triggered while clicking on a button
 * @param event the triggered event
 */
function handleButton(event) {
    // get the button that triggered the event
    var btn = event.target;
    console.log(btn);
    // get the video to this button
    var video = btn.parentNode.getElementsByTagName("video")[0];
    
    switch (btn.innerHTML) {
        case 'play' :
            video.play();
            break;
        case 'break' :
            video.pause();
            break;
        case 'stop' :
            video.currentTime = 0;
            video.pause();
            break;
    }
}