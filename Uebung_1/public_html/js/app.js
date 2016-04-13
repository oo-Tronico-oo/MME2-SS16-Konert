/**
 * Created on : 07.04.2016
 * Authors    : Lisa Bitterling, Nico Nauendorf, Christoph Kozielski
 */

// startet die Funktion init wenn DOM vollständig geladen wurde
window.addEventListener("load",init, false);

// manipuliert jedes Videoelement
function init(){
    var allVideoContainer = document.getElementsByTagName("video");
    
    for(var i = 0; i < allVideoContainer.length; i++){
        containerBuild(allVideoContainer[i]);
    }
}

// fügt jedem Videoelement Interaktionsbutton hinzu
function containerBuild(videoContainer){
    console.log(videoContainer);
    //videoContainer.insertAdjacentHTML('beforebegin', '<section>');
    //videoContainer.insertAdjacentHTML('afterend', 'cda</section>');
}

// meldet Eventhändler an
function buttonEvent(button){
    
}