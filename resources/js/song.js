var audioPlayer;
var playPauseButton;
var seekBar;
var currentTimeDisplay;
var durationDisplay;
var musicTitle;
var musicTitleMsg;

var currentIndex;
var myPlaylist;
var shuffle = false;
var repeatOnce = false;

function playNow() {
    
    if(isShuffle()) {
        currentIndex = Math.floor(Math.random() * myPlaylist.length);
    }
    if(myPlaylist.length > currentIndex) {
        song = myPlaylist[currentIndex];
        play(song.url,song.title,currentIndex);
    }
}

function isShuffle() {
    return shuffle;
}

function isRepeatOnce() {
    return repeatOnce;
}
initPlayerView()
function initPlayerView() {

    audioPlayer = document.getElementById('audioPlayer');
    playPauseButton = document.getElementById('playPauseButton');
    seekBar = document.getElementById('seekBar');

    currentTimeDisplay = document.getElementById('currentTime');
    durationDisplay = document.getElementById('duration');
    musicTitle = document.getElementById('musicTitle');

    nextButton = document.getElementById("nextButton");
    preButton = document.getElementById("preButton");

    var featureButton = document.getElementById('featureButton');
    featureButton.addEventListener('click', function() {
        if(featureButton.innerHTML === '<img src="images/repeat-once-on.png">') {
            featureButton.innerHTML = '<img src="images/shuffle_on.png">';
            //do shffle function here
            repeatOnce = false;
            shuffle = true;
        } else if(featureButton.innerHTML === '<img src="images/shuffle_on.png">') {
            featureButton.innerHTML = '<img src="images/repeat.png">';
            //do repeat all function here
            repeatOnce = false;
            shuffle = false;
        } else {
            featureButton.innerHTML = '<img src="images/repeat-once-on.png">';
            // do repeat one function here
            repeatOnce = true;
            shuffle = false;
        }
    });

    playPauseButton.addEventListener('click', function () {
        console.log("PPP CLICKED")
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.innerHTML = '<img src="images/pause.png">';
        } else {
            audioPlayer.pause();
            playPauseButton.innerHTML = '<img src="images/play.png">';
        }
    });

    nextButton.addEventListener('click',function() {
        next();
        playNow();
    });

    preButton.addEventListener('click',function() {
        prev();
        if(currentIndex < 0) {
            currentIndex = 0;
        }
        playNow();
    });



    durationDisplay.textContent = "00:00";

    audioPlayer.addEventListener('timeupdate', function () {
        const currentTime = formatTime(audioPlayer.currentTime);
        currentTimeDisplay.textContent = currentTime;

        musicTitle.textContent = musicTitleMsg;

        const totalDuration = formatTime(audioPlayer.duration);
        durationDisplay.textContent = totalDuration;

        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        seekBar.value = progress;

        if(audioPlayer.currentTime == audioPlayer.duration) {
            if(!isRepeatOnce()) {
                currentIndex = currentIndex + 1;
            }
            playNow();
        }

    });

    audioPlayer.addEventListener('ended', playFromFirstSong);


    seekBar.addEventListener('input', function () {
        const seekTime = (audioPlayer.duration / 100) * seekBar.value;
        audioPlayer.currentTime = seekTime;
    });
}

function playFromFirstSong() {
    if(currentIndex >= myPlaylist.length) {
        currentIndex = 0;
        playNow();
    }
}

function next() {
    console.log("MASD", myPlaylist)
    if(isShuffle()) {
        currentIndex = Math.floor(Math.random() * myPlaylist.length);
    }
    else {
        currentIndex = currentIndex + 1;
    } 
}

function prev() {
    if(isShuffle()) {
        currentIndex = Math.floor(Math.random() * myPlaylist.length);
    }
    else {
        currentIndex = currentIndex - 1;
    }

    if(currentIndex < 0 ) {
        currentIndex = 0;
    }
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function stopAndClearAudio() {
    var audio = document.getElementById('audioPlayer');
    audio.pause();
    audio.currentTime = 0;
    musicTitleMsg = "No Title"
}

async function fetchSongs(keyword) {
    const response = await fetch(baseURL + '/music?search=' + keyword, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('my-token')}`
        }
    });

    if(response.status != 200) {

    }
    let songs = await response.json();

    let html = `
            <tr>
                <th>Title</th>
                <th>Release Date</th>
                <th>Action</th>
            </tr>
        `;
    songs.forEach(song => {
        html += `
        <tr>
            <td>${song.title}</td>
            <td>${song.releaseDate}</td>
            <td><a href='#' onclick="addToMyPlaylist('${song.id}')">Add to playlist</a></td>
        </tr>
        `;
        document.getElementById('songs').innerHTML = html;
    })
}

var baseURL = "http://localhost:3000/";
var mp3BaseUrl = "http://localhost:3000/";

function handleDeleteAction(id) {
    // Perform delete action using the song ID
    console.log(`Delete song with ID: ${id}`);
    fetch('http://localhost:3000/songs/' + id, {
        method: 'DELETE',
    }).then(response => {
        alert('Delete Successfully!');
        // Refresh the page
        playListRestart();
    });
}

// can't pass 'song' as obj, even just JSON.stringify API
function handleEditAction(id, title, artist, releaseDate) {
    // alert("handleEditAction id = " + id + " , title = " + title)
    // Step1: show edit div & binding song info
    const songEditDiv = document.getElementById('song-edit');
    const songForm = document.getElementById('song-form');
    const actionTitle = document.getElementById('action-title');
    const actionSubmit = document.getElementById('action-submit');
    songEditDiv.style.display = 'block';
    actionTitle.textContent = "Edit Song"
    actionSubmit.value = "Save"

    const sTitle = document.getElementById('title');
    const sArtist = document.getElementById('artist');
    const sReleaseDate = document.getElementById('releaseDate');
    sTitle.value = title;
    sArtist.value = artist;
    let dateParts = releaseDate.split("-");
    sReleaseDate.value = dateParts[0] + "-" + dateParts[1].padStart(2, "0") + "-" + dateParts[2].padStart(2, "0")

    // Step2: bind form action event
    songForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        // const formData = event.target;
        // console.log("formData.title.value" + formData.title.value)
        // Call API to save new info
        editSong(id, sTitle.value, sArtist.value, sReleaseDate.value)
    });
}

let handleFormSubmit = function (event) {
    event.preventDefault(); // Prevent the default form submission
    // Call API to save new info
    const sTitle = document.getElementById('title');
    const sArtist = document.getElementById('artist');
    const sReleaseDate = document.getElementById('releaseDate');
    addSong(sTitle.value, sArtist.value, sReleaseDate.value)
}

function handleCreateAction() {
    const actionTitle = document.getElementById('action-title');
    const songForm = document.getElementById('song-form');
    const actionSubmit = document.getElementById('action-submit');
    actionTitle.textContent = "Add New Song"
    actionSubmit.textContent = "Submit"
    songForm.removeEventListener('submit', handleFormSubmit);  // remove the old listener
    songForm.addEventListener('submit', handleFormSubmit, {once: true});  // add a new listener
}


function editSong(id, title, artist, releaseDate) {
    fetch('http://localhost:3000/songs/' + id, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            title: title,
            releaseDate: releaseDate,
            artist: artist
        })
    }).then(response => {
        response.json()
    })
        .then(jsonObj => {
            alert('Edit Successfully!');
            const songEditDiv = document.getElementById('song-edit');
            songEditDiv.style.display = 'none';
            // Refresh the page
            playListRestart();
        });
}

function addSong(title, artist, releaseDate) {
    fetch('http://localhost:3000/songs/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            id: null,
            title: title,
            releaseDate: releaseDate,
            artist: artist
        })
    }).then(response => {
        response.json()
    }).then(jsonObj => {
            alert('Add Successfully!');
            const songEdit = document.getElementById('song-edit');
            songEdit.style.display = 'none';
            // Refresh the page
            location.reload();
        });
}

function handleAddToPlayListAction(sId) {
    const playListDiv = document.getElementById('playList-div')
    const playListId = playListDiv.getAttribute("playListId")
    fetch('http://localhost:3000/playList/' + playListId + '/song', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            sId: sId
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }
        response.json();
    })
        .then(jsonObj => {
            console.log(jsonObj)
            alert('Add to playList Successfully!');
            // Refresh the page
            playListRestart();
        })
        .catch(error => {
            console.error('An error occurred:', error.message);
            alert('Add to playList Failed!');
        });
}

async function playClick(event,url,title,pIndex) {
    console.log("mypl", url)
    event.preventDefault();
    play(url, title, pIndex)
}

async function play(url,title,pIndex) {
    let mp3 = mp3BaseUrl + url;
    console.log("MP#", url)
    var audio = document.getElementById("audioPlayer");
    audio.src = mp3;
    audio.play();
    playPauseButton.innerHTML = '<img src="images/pause.png">';
    musicTitleMsg = title;
    currentIndex = pIndex;
    return false;
}

function handleRemoveSongAction(sId) {
    const playListDiv = document.getElementById('playList-div')
    const playListId = playListDiv.getAttribute("playListId")
    fetch('http://localhost:3000/playList/' + playListId + '/song', {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            sId: sId
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }
        response.json()
    })
        .then(jsonObj => {
            console.log(jsonObj)
            alert('Remove song from playList Successfully!');
            // Refresh the page
            playListRestart();
        })
        .catch(error => {
            console.error('An error occurred:', error.message);
            alert('Remove song from playList Failed!');
        });
}

window.onload = playListRestart;

function playListRestart() {
    const loginFormDiv = document.getElementById('loginForm');
    const userDisplayDiv = document.getElementById('userDisplay');
    // const songListDiv = document.getElementById('song-list-div');
    const playListDiv = document.getElementById('playList-div');
    // check if user has login
    if (sessionStorage.getItem("token") && sessionStorage.getItem("userId")) {
        loginFormDiv.style.display = 'none';
        userDisplayDiv.style.display = 'block';
        // show current userName
        const username = sessionStorage.getItem("userName");
        document.getElementById('usernameDisplay').innerText = 'Logged in as: ' + username;

        // songListDiv.style.display = 'block';
        playListDiv.style.display = 'block';
    } else {
        loginFormDiv.style.display = 'block';
        userDisplayDiv.style.display = 'none';
        // hide other divs
        // songListDiv.style.display = 'none';
        playListDiv.style.display = 'none';
    }

    const addButton = document.querySelector('.add-button');
    const songEdit = document.getElementById('song-edit');
    const playerDiv = document.getElementById('song-player-div');

    addButton.addEventListener('click', function () {
        songEdit.style.display = 'block';
        handleCreateAction()
    }, {once: true});
    songEdit.style.display = 'none';
    playerDiv.style.display = 'none';

    fetch('http://localhost:3000/songs')
        .then(response => response.json())
        .then(songs => {
            let html = `<tr>
            <th>ID</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Release Date</th>
            <th>Action</th>
        </tr>`;

            songs.forEach(s => {
                html += `
            <tr id="row-${s.id}">
                 <td>${s.id}</td> 
                 <td>${s.title}</td>
                 <td>${s.artist}</td>
                 <td>${s.releaseDate}</td>
                 <td>
                 <button type="button" onclick="handleAddToPlayListAction(${s.id})">add to playList</button>
                 <button type="button" onclick="handleEditAction(
                     ${s.id}, '${s.title}', '${s.artist}', '${s.releaseDate}'
                 )">edit</button>
                 <button type="button" onclick="handleDeleteAction(${s.id})">delete</button>
                 </td>
            </tr>
            `;
            })

            document.getElementById('song-list').innerHTML = html;
        });

    // load current login user '1' PlayList
    // const token = sessionStorage.getItem("token")
    // console.log("token 111 = " + token)
    const response = fetch('http://localhost:3000/playList', {
        headers: {
            'Authorization': sessionStorage.getItem('token')
        }
    }).then(response => {
        console.log("9991919");
        return response.json()
    })
        .then(playList => {
            myPlaylist = playList.songs
            let html = `<tr>
            <th>Index</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Actions</th>
        </tr>`;
            playListDiv.setAttribute('playListId', playList.id);
            let idx = 1;
            var pIndex = 0;
            playList.songs.forEach(s => {
                console.log("S", s)
                html += `
            <tr id="row-${s.id}">
                 <td>${idx++}</td> 
                 <td>${s.title}</td>
                 <td>${s.artist}</td>
                 <td>
                 <button type="button" onclick="return playClick(event,'${s.url}','${s.title}',${pIndex})">play</button>
                 <button type="button" onclick="handleRemoveSongAction(${s.id})">remove from list</button>
                 </td>
            </tr>
            `;
            pIndex = pIndex + 1;
            })
            document.getElementById('playList').innerHTML = html;
        });

}
