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

function handlePlayAction(id) {
    fetch(`http://localhost:3000/songs/${id}/play`)
    .then(res => res.json())
    .then(data => togglePlay(data))
    // alert("Play song... " + url)
    // // const mockUrl = 'http://localhost:3000/Still%20Loving%20You-Scorpions.mp3'
    // if (typeof url === 'string' && url.trim().length > 0 && url.endsWith(".mp3")) {
    //     const fullUrl = 'http://localhost:3000/' + url;
    //     const playerSource = document.getElementById('player');
    //     playerSource.setAttribute("src", fullUrl)
    //     const playerDiv = document.getElementById('song-player-div');
    //     playerDiv.style.display = 'block';
    //     // Scroll the entire page to the bottom
    //     window.scrollTo(0, document.body.scrollHeight);
    // } else {
    //     console.error('Invalid URL');
    // }
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
    fetch('http://localhost:3000/playList', {
        headers: {
            'Authorization': sessionStorage.getItem('token')
        }
    }).then(response => {
        console.log("9991919");
        return response.json()
    })
        .then(playList => {
            let html = `<tr>
            <th>Index</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Actions</th>
        </tr>`;
            playListDiv.setAttribute('playListId', playList.id);
            let idx = 1;
            playList.songs.forEach(s => {
                html += `
            <tr id="row-${s.id}">
                 <td>${idx++}</td> 
                 <td>${s.title}</td>
                 <td>${s.artist}</td>
                 <td>
                 <button type="button" onclick="handlePlayAction('${s.id}')">play</button>
                 <button type="button" onclick="handleRemoveSongAction(${s.id})">remove from list</button>
                 </td>
            </tr>
            `;
            })
            document.getElementById('playList').innerHTML = html;
        });

}
