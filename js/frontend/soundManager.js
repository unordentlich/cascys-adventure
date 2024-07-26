function playMusic(trackId) {
    var volume = getSetting('audio.master', 100)/100 * (getSetting('audio.music', 100)/100);
    var audio = new Audio('../assets/sounds/' + trackId + '.m4a');
    audio.volume = volume;

    audio.play();
}

function playSoundEffect(trackId) {
    var volume = parseInt(getSetting('audio.master', 100))/100 * (parseInt(getSetting('audio.fx', 100))/100);
    var audio = new Audio('../assets/sounds/' + trackId + '.m4a');
    audio.volume = volume;
    
    audio.play();
}