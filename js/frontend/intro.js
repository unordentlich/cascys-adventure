document.addEventListener('DOMContentLoaded', () => {
    preloadData();
    document.getElementById('logo').addEventListener('animationstart', () => {
        playSoundEffect('intro_logo');
    })
})

function preloadData() {
    window.electronAPI.retrieveLevelList().then((cb) => {
        sessionStorage.setItem('level-list', JSON.stringify(cb));
        return cb;
    });
}