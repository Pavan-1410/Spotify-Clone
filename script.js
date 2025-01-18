let currFolder;
let currentsong =new Audio();
let currentindex = 0;
let songs; 
// login and signup
let login = document.querySelector(".btn2");
login.addEventListener("click",()=>{
    document.querySelector(".login").classList.remove("x") 
})
let signup = document.querySelector(".btn1");
signup.addEventListener("click",()=>{
    document.querySelector(".signup").classList.remove("x")     
})
let slink = document.querySelector(".slink")
slink.addEventListener("click",()=>{
    document.querySelector(".signup").classList.remove("x")
    document.querySelector(".login").classList.add("x")
})    
// handlers
document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('signupusername').value.trim();
    const email = document.getElementById('signupemail').value.trim();
    const password = document.getElementById('signuppasswors').value;


    // Check if username already exists
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (existingUsers.some(user => user.username === username)) {
        alert('Username already exists. Please choose a different username.');
        document.getElementById('signup').reset();
        return;
    }

    // Store user data in localStorage
    const newUser = { username, email, password };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    alert('Signup successful! You can now log in.');

    // Clear form fields and switch to login
    document.getElementById('signup').reset();
    document.querySelector(".signup").classList.add("x")

});

// 
document.getElementById('login').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('loginusername').value.trim();
    const password = document.getElementById('loginpassword').value;

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const matchedUser = users.find(user => user.username === username && user.password === password);

    if (matchedUser) {
        alert(`Login successful! Welcome back, ${matchedUser.username}.`);
    } else {
        alert('Invalid username or password. Please try again.');
    }

    // Clear form fields
    document.getElementById('login').reset();
    document.querySelector(".login").classList.add("x")
});

async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`/spotify_clone/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `
                        <div class="show-song">
                            <li><img src="song.svg" alt="">
                                <div class="sn">${song.replaceAll("%20"," ").replaceAll("%2"," ")}</div><img
                                    src="play-song.svg" alt="">
                            </li>
                        </div>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",()=>{

            playmusic(e.querySelector(".sn").innerHTML.trim());
        })
    });
}
// sec to min
function convertSecondsToTime(seconds) {
    // Ensure the input is a positive integer
    // seconds = Math.max(0, Math.floor(seconds));
    if(isNaN(seconds))
    {
        formattedHours = "00";
        formattedMinutes = "00";
    }

    // Calculate hours and minutes
    const hours = Math.floor(seconds / 60);
    const minutes = Math.floor(seconds %60);

    // Format hours and minutes as two digits
    const formattedHours = hours.toString();
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Return the formatted time
    return `${formattedHours}:${formattedMinutes}`;
}

const playmusic = (track,pause = false)=>{
    currentsong.src = `${currFolder}/`+track
    if(!pause){
        currentsong.play();
        o.src= "pause.svg";
    }

    document.querySelector(".songinfo").innerHTML= decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}
async function main() {
    await getsongs("songs/Arjit");
    playmusic(songs[0],true)
    // add event listner for play next prev
    play = document.querySelector(".play-song")
    o = document.querySelector(".o")
    play.addEventListener("click",()=>{
        if(currentsong.paused)
        {
            currentsong.play();
            o.src = "pause.svg";
        }
        else{
            currentsong.pause();
            o.src = "play-song.svg";
        }
    })
    
    next = document.querySelector(".next")
    next.addEventListener("click",()=>{
        currentindex = (currentindex + 1) % songs.length;
        playmusic(songs[currentindex])
    })
    prev = document.querySelector(".prev")
    prev.addEventListener("click",()=>{
        currentindex = (currentindex - 1 + songs.length) % songs.length
        playmusic(songs[currentindex])
    })
    // time
    currentsong.addEventListener("timeupdate",()=> {
        // console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtime").innerHTML =`${convertSecondsToTime(currentsong.currentTime)} / ${convertSecondsToTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    // seek bar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
       let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
       document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100;
    })
    // event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%"
    })

    // load folder when card is click
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        
        e.addEventListener("click", async item=>{
                        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })
    Array.from(document.getElementsByClassName("card-1")).forEach(e=>{
        
        e.addEventListener("click", async item=>{
                        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })

    
}
main();
