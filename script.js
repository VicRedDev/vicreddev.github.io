const audios = ['billiejean', 'iwannabeyours']

// Nota: no se puede usar un guion en un identificador JS ("lyrics-list"),
// por eso usamos `lyricsList` como nombre de variable válido.


const main = document.querySelector("main");

let songsData = [];

async function showSongs(){
    let htmlString = '';
    for(const data of songsData){
        const sec = data.seconds % 60
        htmlString += `<div class="list-song">
            <a href="tracks/${data.id}/index.html" class="play-button"></a>
            <div>
                <h1 class="list-song-title">${data.name} - ${data.author}</h1>
                <p class="list-song-duration">${parseInt(data.seconds / 60)}:${sec > 9 ? sec : '0' + sec}</p>
            </div>
        </div>`;
        main.innerHTML = htmlString;
    }
}

async function fetchSong(index){
    console.log(index);
    if(index >= audios.length) {
        showSongs();
        return;
    }

    const audio = audios[index];

    fetch(`tracks/${audio}/data.json`).then(res => {
        return res.json();
    }).then(data => {
        songsData.push(data);
        fetchSong(index+1);
    }).catch(err => {
        fetchSong(index+1);
    });    
}

fetchSong(0);