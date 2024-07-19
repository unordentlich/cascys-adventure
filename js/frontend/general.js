document.addEventListener("DOMContentLoaded", () => {
    hideTaskbarOnFullscreen();
})

function hideTaskbarOnFullscreen() {
    if(localStorage.getItem('fullscreenMode') === 'true') {
        document.getElementById('titlebar').style.display = 'none';
    } else {
        document.getElementById('titlebar').style.display = 'flex';
    }
    window.electronAPI.getInformation().then((cb) => {
        localStorage.setItem('fullscreenMode', cb.fullscreen ?? false);
    });
}