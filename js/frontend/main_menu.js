document.addEventListener('DOMContentLoaded', () => {
    var levels = loadLevels();

    var levelCarousel = document.getElementById('level-selection');
    for(let i = 0; i < levels.length; i++) {
        let child = document.createElement('div');
        child.classList.add('level-container');
        if(i > currentLevel) child.classList.add('locked');
        let subChild = document.createElement('div');
        subChild.classList.add('preview');
        let previewImg = document.createElement('img');
        previewImg.src = "https://i.ytimg.com/vi/60zpPbY1DLA/maxresdefault.jpg"; //only for test
        if(i > currentLevel) {
            let lockImg = document.createElement('img');
            lockImg.src = '../assets/icons/lock.png';
            lockImg.classList.add('lock');
            subChild.appendChild(lockImg);
        }
        subChild.appendChild(previewImg);
        child.appendChild(subChild);

        let informationChild = document.createElement('div');
        informationChild.classList.add('information');

        let levelP = document.createElement('p');
        levelP.innerText = 'Level ' + i;
        
        let nameH = document.createElement('h5');
        nameH.innerText = 'test';

        informationChild.appendChild(levelP);
        informationChild.appendChild(nameH);
        child.append(informationChild);
        levelCarousel.appendChild(child);
    }
})

function loadLevels() {
    if(sessionStorage.getItem('level-list')) return JSON.parse(sessionStorage.getItem('level-list'));
    window.electronAPI.retrieveLevelList().then((cb) => {
        sessionStorage.setItem('level-list', JSON.stringify(cb));
        return cb;
    });
}