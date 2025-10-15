let lyrics = false;

async function loadLyrics() {
    await fetch(`lyrics.json`).then(res => {
        return res.json();
    }).then(data => {
        lyrics = data;
        playAudio();
        karaoke(0);
        console.log("Success");
    }).catch(err => {
        console.log("Error en el fetch");
    });    
}

// Audio player for Billie Jean
let audioPlayer = null;

// Plays tracks/billiejean/audio.mp3. Returns the Audio object.
function playAudio() {
    if (!audioPlayer) {
        audioPlayer = new Audio('audio.mp3');
        audioPlayer.preload = 'auto';
        audioPlayer.addEventListener('error', (e) => {
            console.error('Error loading audio:', e);
        });
    }

   const playPromise = audioPlayer.play();
   if (playPromise !== undefined) {
       playPromise.then(() => {
           console.log('Billie Jean playback started');
       }).catch(err => {
           // Autoplay might be blocked; advise user to interact with the page.
           console.warn('Playback prevented (autoplay policy). Call this function from a user gesture to start audio.', err);
       });
   }

   // Expose for debugging
   return audioPlayer;
}

// Make it callable from inline HTML if needed
window.playAudio = playAudio;

const main = document.querySelector("main");

function addLyric(text, jump, fullDuration, id) {
    const duration = parseInt(fullDuration / text.length);
    if(jump) {
        const child = document.createElement('p');;
        child.id = id;
        main.appendChild(child);
    }
    const lastChild = document.getElementById(id);
    for(let letterIndex=0 ; letterIndex < text.length ; letterIndex++) {
        const letter = text[letterIndex]; 
        console.log(letter);
        setTimeout(()=>{
            lastChild.textContent += letter;
        },letterIndex*duration);
    }
    return lastChild;
}

function karaoke(index, part=0) {
    if(index >= lyrics.length){
        return;
    }
    if(part >= lyrics[index].length){
        karaoke(index+1,0);
    }
    const id = `p-${index}`;
    const piece = lyrics[index][part];
    console.log(piece);
    const lastChild = addLyric(piece.text, part == 0 ? true : false, piece.duration*1000, id);
    if(part >= lyrics[index].length-1){
        setTimeout(()=>{
            lastChild.classList.add('transparentText');
        }, piece.duration*1000+1500)
        setTimeout(()=>{
            console.log(`Se removio ${lastChild.id}`)
            lastChild.classList.add("hidden");
        }, piece.duration*1000+3500)
    }
    setTimeout(()=>{karaoke(index,part+1);}, piece.hold*1000)
}

const button = document.querySelector("body>.play-button");
// Guard to prevent double execution if the handler is attached twice or the user clicks rapidly
let buttonClicked = false;
if (button) {
    button.addEventListener("click", () => {
        if (buttonClicked) return;
        buttonClicked = true;
        loadLyrics();
        button.classList.add("hidden");
    }, { once: true }); // also instructs the browser to remove the listener after first invocation
} else {
    console.warn('Play button not found: selector "body>.play-button" returned null');
}





