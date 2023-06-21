var loginButton = document.getElementById('loginButton');
var logoutButton = document.getElementById('logoutButton');
var testLogin = document.getElementById('logo');
loginButton.addEventListener('click', function () {
    const user = document.getElementById('usernameInput').value;
    const pwd = document.getElementById('passwordInput').value;
    // request login api by fetch api
    fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify({username: user, password: pwd}),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                throw new Error(errorText);
            });
        }
        return response.json();
    }).then(data => {
        const username = document.getElementById('usernameInput').value;
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("userName", username);

        // valid the jwt work
        fetch('http://localhost:3000/secure-endpoint', {
            headers: {
                'Authorization': sessionStorage.getItem('token')
            }
        }).then(response => {
            if (response.ok) {
                console.log('Access granted');
            } else {
                console.log('Access denied');
            }
        });
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('usernameDisplay').innerText = 'Logged in as: ' + username;
        document.getElementById('userDisplay').style.display = 'block';
        playListRestart();



        // Refresh the page --- we will show/hide divs on window.onload function.
        //location.reload();
    }).catch(error => {
        alert('You should enter a valid or correct password');
        console.log('Error:', error)
    });
});

logoutButton.addEventListener('click', function () {
    // logout action: remove token
    sessionStorage.removeItem('token');
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");

    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
    myAudioFooter.style.display = 'none'
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('userDisplay').style.display = 'none';
    playListRestart();
    stopAndClearAudio();
    // Refresh the page
    //location.reload();
});

testLogin.addEventListener('click', function () {
    // test work
    fetch('http://localhost:3000/secure-endpoint', {
        headers: {
            'Authorization': sessionStorage.getItem('token')
        }
    }).then(response => {
        if (response.ok) {
            console.log('Access granted');
        } else {
            console.log('Access denied');
        }
    });
});
