document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logo').addEventListener('animationstart', () => {
        playSoundEffect('intro_logo');
    })
})