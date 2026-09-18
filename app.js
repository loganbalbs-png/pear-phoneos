const overlay = document.getElementById("overlay");
const appWindow = document.getElementById("app-window");

function openApp(title, content) {
    appWindow.innerHTML = `
        <div class="header">
            <button class="back" onclick="closeApp()">‹</button>
            <span>${title}</span>
        </div>
        <div class="content">${content}</div>
    `;

    overlay.classList.add("open");
}

function closeApp() {
    overlay.classList.remove("open");
}


/* =========================
   MESSAGES
========================= */

const chats = {
    Chloe: ["Hey!! 👋", "What are you doing?", "We should hang out!"],
    Sam: ["Yo!", "Did you see this?", "😂"],
    Cat: ["Meow.", "MEOW.", "😸"]
};

function openMessages() {
    openApp("Messages", `
        <h2>Messages</h2>

        <div class="card" onclick="openChat('Chloe')">
            👩 <b>Chloe</b>
            <br>
            We should hang out!
        </div>

        <div class="card" onclick="openChat('Sam')">
            👨 <b>Sam</b>
            <br>
            Did you see this?
        </div>

        <div class="card" onclick="openChat('Cat')">
            🐱 <b>Cat</b>
            <br>
            Meow.
        </div>

        <button class="button" onclick="newChat()">
            ➕ New Message
        </button>
    `);
}

function openChat(name) {
    openApp(name, `
        <div id="chatMessages">
            ${chats[name].map(x =>
                `<div class="message">${x}</div>`
            ).join("")}
        </div>

        <input id="messageInput" placeholder="iMessage">

        <button class="button"
                onclick="sendMessage('${name}')">
            Send
        </button>
    `);
}

function sendMessage(name) {
    const input = document.getElementById("messageInput");

    if (!input.value.trim()) return;

    document.getElementById("chatMessages").innerHTML += `
        <div class="message me">${input.value}</div>
    `;

    input.value = "";

    setTimeout(() => {
        document.getElementById("chatMessages").innerHTML += `
            <div class="message">
                ${name === "Cat" ? "Meow 😸" : "Sounds good!"}
            </div>
        `;
    }, 700);
}

function newChat() {
    openApp("New Message", `
        <input id="newContact" placeholder="Contact">

        <textarea id="newMessage"
                  placeholder="Message"></textarea>

        <button class="button"
                onclick="alert('Message sent! 💬')">
            Send
        </button>
    `);
}


/* =========================
   CAMERA
========================= */

let cameraStream = null;

function openCamera() {
    openApp("Camera", `
        <video id="cameraVideo"
               autoplay
               playsinline
               style="width:100%;background:#000;border-radius:9px">
        </video>

        <br>

        <button class="button" onclick="startCamera()">
            📷 Start
        </button>

        <button class="button" onclick="takePhoto()">
            📸 Capture
        </button>

        <button class="button" onclick="stopCamera()">
            ⏹ Stop
        </button>

        <canvas id="cameraCanvas" style="display:none"></canvas>

        <div id="cameraResult"></div>
    `);
}

async function startCamera() {
    try {
        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video:true
            });

        document.getElementById("cameraVideo").srcObject =
            cameraStream;

    } catch(error) {
        alert("Camera permission is unavailable.");
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

function takePhoto() {
    const video = document.getElementById("cameraVideo");

    if (!video.srcObject) {
        alert("Start the camera first!");
        return;
    }

    const canvas = document.getElementById("cameraCanvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(
        video, 0, 0,
        canvas.width,
        canvas.height
    );

    const image = canvas.toDataURL("image/png");

    document.getElementById("cameraResult").innerHTML = `
        <img src="${image}"
             style="width:100%;border-radius:8px">
    `;
}


/* =========================
   SPLASHFACE
========================= */

function openSplashFace() {
    openApp("SplashFace", `
        <h2>🌊 SplashFace</h2>

        <div class="card">
            <b>Chloe</b>
            <p>Beach day!! ☀️🌊</p>

            <button class="button"
                    onclick="likePost(this)">
                ❤️ <span>24</span>
            </button>

            <button class="button"
                    onclick="commentPost()">
                💬 Comment
            </button>
        </div>

        <div class="card">
            <b>Sam</b>
            <p>New Pear Phone! 🍐</p>

            <button class="button"
                    onclick="likePost(this)">
                ❤️ <span>8</span>
            </button>
        </div>

        <button class="button"
                onclick="newPost()">
            ➕ Create Post
        </button>
    `);
}

function likePost(button) {
    const span = button.querySelector("span");
    span.textContent = Number(span.textContent) + 1;
}

function commentPost() {
    const comment = prompt("Write a comment:");

    if (comment) {
        alert("Comment posted! 💬");
    }
}

function newPost() {
    openApp("Create Post", `
        <textarea id="postText"
                  placeholder="What's happening?">
        </textarea>

        <button class="button"
                onclick="publishPost()">
            Post
        </button>
    `);
}

function publishPost() {
    const text =
        document.getElementById("postText").value;

    if (!text.trim()) {
        alert("Write something first!");
        return;
    }

    alert("Posted to SplashFace! 🌊");
    openSplashFace();
}


/* =========================
   STOCKS
========================= */

let stockValues = {
    AAPL: 238.45,
    MSFT: 511.20,
    TSLA: 341.88,
    NVDA: 178.42
};

function openStocks() {
    openApp("Stocks", `
        <h2>📈 Stocks</h2>

        <div id="stocksList"></div>

        <input id="stockSearch"
               placeholder="Add ticker e.g. GOOG">

        <button class="button"
                onclick="addStock()">
            ➕ Add Stock
        </button>

        <button class="button"
                onclick="refreshStocks()">
            🔄 Refresh
        </button>
    `);

    drawStocks();
}

function drawStocks() {
    const list = document.getElementById("stocksList");

    if (!list) return;

    list.innerHTML = Object.keys(stockValues).map(symbol => `
        <div class="card"
             onclick="stockDetails('${symbol}')">

            <b>${symbol}</b>

            <br>

            $${stockValues[symbol].toFixed(2)}

            <br>

            <small>
                Tap for details
            </small>
        </div>
    `).join("");
}

function refreshStocks() {
    Object.keys(stockValues).forEach(symbol => {
        stockValues[symbol] +=
            (Math.random() - 0.5) * 8;
    });

    drawStocks();
}

function addStock() {
    const input =
        document.getElementById("stockSearch");

    const symbol =
        input.value.trim().toUpperCase();

    if (!symbol) return;

    stockValues[symbol] =
        Math.random() * 400 + 20;

    input.value = "";

    drawStocks();
}

function stockDetails(symbol) {
    openApp(symbol, `
        <h2>📊 ${symbol}</h2>

        <h1>
            $${stockValues[symbol].toFixed(2)}
        </h1>

        <div class="progress">
            <div style="width:${Math.random()*80+10}%"></div>
        </div>

        <p>
            Today's activity
        </p>

        <button class="button"
                onclick="openStocks()">
            Back to Watchlist
        </button>
    `);
}


/* =========================
   MAPS
========================= */

function openMaps() {
    openApp("Maps", `
        <h2>🗺️ Pear Maps</h2>

        <input id="mapSearch"
               placeholder="Search a place">

        <button class="button"
                onclick="searchMap()">
            Search
        </button>

        <div class="card"
             style="
             height:130px;
             display:flex;
             align-items:center;
             justify-content:center;
             font-size:50px;
             ">
            🗺️
        </div>

        <div id="mapResults">
            <p>Search for a destination.</p>
        </div>

        <button class="button"
                onclick="findMe()">
            📍 Find Me
        </button>
    `);
}

function searchMap() {
    const place =
        document.getElementById("mapSearch").value;

    if (!place.trim()) return;

    document.getElementById("mapResults").innerHTML = `
        <div class="card">
            📍 <b>${place}</b>
            <br>
            Destination found!
            <br><br>
            <button class="button"
                    onclick="startRoute('${place}')">
                🚗 Start Route
            </button>
        </div>
    `;
}

function startRoute(place) {
    alert("Route started to " + place + " 🚗");
}

function findMe() {
    if (!navigator.geolocation) {
        alert("Location unavailable.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        () => alert("📍 Your location was found!"),
        () => alert("Location permission was denied.")
    );
}


/* =========================
   PHOTOS
========================= */

function openPhotos() {
    openApp("Photos", `
        <h2>📸 Photos</h2>

        <input type="file"
               accept="image/*"
               multiple
               onchange="loadPhotos(event)">

        <div id="photoGrid"
             class="grid">
        </div>
    `);
}

function loadPhotos(event) {
    const grid =
        document.getElementById("photoGrid");

    grid.innerHTML = "";

    Array.from(event.target.files).forEach(file => {

        const reader = new FileReader();

        reader.onload = e => {

            grid.innerHTML += `
                <img src="${e.target.result}"
                     style="
                     width:100%;
                     aspect-ratio:1;
                     object-fit:cover;
                     border-radius:8px;
                     "
                     onclick="viewPhoto(this.src)">
            `;
        };

        reader.readAsDataURL(file);
    });
}

function viewPhoto(src) {
    openApp("Photo", `
        <img src="${src}"
             style="width:100%;border-radius:10px">

        <br><br>

        <button class="button"
                onclick="openPhotos()">
            Back
        </button>
    `);
}


/* =========================
   WEATHER
========================= */

function openWeather() {

    openApp("Weather", `
        <div style="text-align:center">

            <div class="big-icon">
                ☀️
            </div>

            <h1>22°C</h1>

            <p>Sunny</p>

        </div>

        <div class="grid">

            <div class="card">
                🌅<br>
                Morning<br>
                18°C
            </div>

            <div class="card">
                ☀️<br>
                Afternoon<br>
                24°C
            </div>

            <div class="card">
                🌇<br>
                Evening<br>
                21°C
            </div>

            <div class="card">
                🌙<br>
                Night<br>
                16°C
            </div>

        </div>

        <button class="button"
                onclick="changeWeather()">
            🔄 Refresh
        </button>
    `);
}

function changeWeather() {

    const weather =
        ["☀️ Sunny","🌧️ Rain","⛅ Cloudy","❄️ Snow"];

    const choice =
        weather[
            Math.floor(
                Math.random() * weather.length
            )
        ];

    alert("Weather updated: " + choice);
}


/* =========================
   NOTES
========================= */

function openNotes() {

    const saved =
        localStorage.getItem("pearNote") || "";

    openApp("Notes", `
        <h2>📝 Notes</h2>

        <input id="noteTitle"
               placeholder="Title">

        <textarea id="note"
                  placeholder="Write your note...">${saved}</textarea>

        <button class="button"
                onclick="saveNote()">
            💾 Save
        </button>

        <button class="button"
                onclick="clearNote()">
            🗑 Clear
        </button>

        <p id="noteStatus"></p>
    `);
}

function saveNote() {

    const text =
        document.getElementById("note").value;

    localStorage.setItem(
        "pearNote",
        text
    );

    document.getElementById("noteStatus").textContent =
        "Saved! ✅";
}

function clearNote() {

    document.getElementById("note").value = "";

    localStorage.removeItem("pearNote");
}


/* =========================
   PEARTUNES
========================= */

let audio = new Audio();

function openPearTunes() {

    openApp("PearTunes", `
        <div style="text-align:center">

            <div class="big-icon">
                🎵
            </div>

            <h2>PearTunes</h2>

            <p id="songName">
                Pear Phone Radio
            </p>

            <button class="button"
                    onclick="playDemoSong()">
                ▶️ Play
            </button>

            <button class="button"
                    onclick="audio.pause()">
                ⏸ Pause
            </button>

            <button class="button"
                    onclick="nextSong()">
                ⏭ Next
            </button>

            <br><br>

            <input type="file"
                   accept="audio/*"
                   onchange="loadMusic(event)">
        </div>
    `);
}

function playDemoSong() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    const context =
        new AudioContext();

    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();

    oscillator.type = "sine";

    oscillator.frequency.value =
        440;

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 1.5
    );

    oscillator.stop(
        context.currentTime + 1.5
    );
}

function nextSong() {

    const songs =
        [
            "Pear Radio",
            "Pear Chill",
            "Pear Beats",
            "Pear FM"
        ];

    const song =
        songs[
            Math.floor(
                Math.random() * songs.length
            )
        ];

    document.getElementById("songName")
        .textContent = song;
}

function loadMusic(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    audio.src =
        URL.createObjectURL(file);

    document.getElementById("songName")
        .textContent =
        file.name;

    audio.play();
}


/* =========================
   SETTINGS
========================= */

function openSettings() {

    openApp("Settings", `
        <h2>⚙️ Settings</h2>

        <div class="card">
            <b>Appearance</b>

            <br><br>

            <button class="button"
                    onclick="toggleDarkMode()">
                🌙 Dark Mode
            </button>

            <button class="button"
                    onclick="normalMode()">
                ☀️ Light Mode
            </button>
        </div>

        <div class="card">

            <b>Sound</b>

            <br><br>

            <button class="button"
                    onclick="testSound()">
                🔊 Test Sound
            </button>

        </div>

        <div class="card">

            <b>Pear Phone</b>

            <br><br>

            <button class="button"
                    onclick="resetPhone()">
                🔄 Reset Data
            </button>

        </div>
    `);
}

function toggleDarkMode() {

    document.getElementById("app-window")
        .style.background =
        "#181818";

    document.getElementById("app-window")
        .style.color =
        "white";
}

function normalMode() {

    document.getElementById("app-window")
        .style.background =
        "#f2f2f7";

    document.getElementById("app-window")
        .style.color =
        "#111";
}

function testSound() {
    alert("🔊 Pear Phone sound works!");
}

function resetPhone() {

    localStorage.clear();

    alert("Pear Phone data reset!");
}


/* =========================
   CLOCK
========================= */

let stopwatchSeconds = 0;
let stopwatchTimer = null;

function openClock() {

    openApp("Clock", `
        <div style="text-align:center">

            <div class="big-icon">
                🕐
            </div>

            <h2 id="clockTime">
                ${new Date().toLocaleTimeString()}
            </h2>

            <div class="card">

                <h2 id="stopwatch">
                    00:00
                </h2>

                <button class="button"
                        onclick="startStopwatch()">
                    ▶️
                </button>

                <button class="button"
                        onclick="stopStopwatch()">
                    ⏸
                </button>

                <button class="button"
                        onclick="resetStopwatch()">
                    🔄
                </button>

            </div>

            <div class="card">

                <button class="button"
                        onclick="setTimer()">
                    ⏱ Set Timer
                </button>

            </div>

        </div>
    `);

    updateClock();
}

function updateClock() {

    const element =
        document.getElementById("clockTime");

    if (!element) return;

    element.textContent =
        new Date().toLocaleTimeString();

    setTimeout(updateClock,1000);
}

function startStopwatch() {

    if (stopwatchTimer) return;

    stopwatchTimer =
        setInterval(() => {

            stopwatchSeconds++;

            const minutes =
                Math.floor(
                    stopwatchSeconds / 60
                );

            const seconds =
                stopwatchSeconds % 60;

            document.getElementById("stopwatch")
                .textContent =
                String(minutes).padStart(2,"0")
                + ":" +
                String(seconds).padStart(2,"0");

        },1000);
}

function stopStopwatch() {

    clearInterval(stopwatchTimer);

    stopwatchTimer = null;
}

function resetStopwatch() {

    stopStopwatch();

    stopwatchSeconds = 0;

    const display =
        document.getElementById("stopwatch");

    if (display) {
        display.textContent = "00:00";
    }
}

function setTimer() {

    const seconds =
        Number(prompt("Timer length in seconds:"));

    if (!seconds || seconds <= 0) return;

    alert("Timer started! ⏱");

    setTimeout(() => {
        alert("⏰ Timer finished!");
    }, seconds * 1000);
}


/* =========================
   VIDEOS
========================= */

function openVideos() {

    openApp("Videos", `
        <h2>🎬 Videos</h2>

        <input type="file"
               accept="video/*"
               onchange="loadVideo(event)">

        <video id="videoPlayer"
               controls
               style="
               width:100%;
               background:#000;
               border-radius:9px;
               ">
        </video>

        <br>

        <button class="button"
                onclick="fullscreenVideo()">
            ⛶ Fullscreen
        </button>
    `);
}

function loadVideo(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    document.getElementById("videoPlayer").src =
        URL.createObjectURL(file);
}

function fullscreenVideo() {

    const video =
        document.getElementById("videoPlayer");

    if (video.requestFullscreen) {
        video.requestFullscreen();
    }
}


/* =========================
   PHONE
========================= */

let phoneNumber = "";

function openPhone() {

    phoneNumber = "";

    openApp("Phone", `
        <h2 style="text-align:center">
            📞
        </h2>

        <h2 id="phoneNumber"
            style="text-align:center">
        </h2>

        <div class="grid">

            <button class="button" onclick="dial('1')">1</button>
            <button class="button" onclick="dial('2')">2</button>
            <button class="button" onclick="dial('3')">3</button>

            <button class="button" onclick="dial('4')">4</button>
            <button class="button" onclick="dial('5')">5</button>
            <button class="button" onclick="dial('6')">6</button>

            <button class="button" onclick="dial('7')">7</button>
            <button class="button" onclick="dial('8')">8</button>
            <button class="button" onclick="dial('9')">9</button>

            <button class="button" onclick="dial('*')">*</button>
            <button class="button" onclick="dial('0')">0</button>
            <button class="button" onclick="dial('#')">#</button>

        </div>

        <br>

        <button class="button"
                onclick="callNumber()">
            📞 Call
        </button>

        <button class="button"
                onclick="clearNumber()">
            Clear
        </button>
    `);
}

function dial(number) {

    phoneNumber += number;

    document.getElementById("phoneNumber")
        .textContent =
        phoneNumber;
}

function clearNumber() {

    phoneNumber = "";

    document.getElementById("phoneNumber")
        .textContent = "";
}

function callNumber() {

    if (!phoneNumber) {
        alert("Enter a number first!");
        return;
    }

    alert("Calling " + phoneNumber + " 📞");
}


/* =========================
   MAIL
========================= */

function openMail() {

    openApp("Mail", `
        <h2>📧 Pear Mail</h2>

        <div class="card"
             onclick="readMail()">

            <b>Apple</b>

            <br>

            Your Pear Phone order shipped! 📦

        </div>

        <div class="card"
             onclick="readMomMail()">

            <b>Mom</b>

            <br>

            Don't forget dinner ❤️

        </div>

        <div class="card">

            <b>School</b>

            <br>

            New assignment available.

        </div>

        <button class="button"
                onclick="composeMail()">
            ✏️ Compose
        </button>
    `);
}

function readMail() {

    openApp("Mail", `
        <h2>📦 Order Shipped</h2>

        <p>
            Your Pear Phone accessories
            are officially on the way!
        </p>

        <button class="button"
                onclick="openMail()">
            Back
        </button>
    `);
}

function readMomMail() {

    openApp("Mail", `
        <h2>❤️ Mom</h2>

        <p>
            Don't forget dinner tonight!
        </p>

        <button class="button"
                onclick="openMail()">
            Back
        </button>
    `);
}

function composeMail() {

    openApp("Compose", `
        <input placeholder="To">

        <input placeholder="Subject">

        <textarea placeholder="Message"></textarea>

        <button class="button"
                onclick="alert('Email sent! 📧')">
            Send
        </button>
    `);
}


/* =========================
   COMPASS
========================= */

function openCompass() {

    openApp("Compass", `
        <div style="text-align:center">

            <div id="compassIcon"
                 class="big-icon">
                🧭
            </div>

            <h2 id="direction">
                NORTH
            </h2>

            <button class="button"
                    onclick="calibrateCompass()">
                🧭 Calibrate
            </button>

            <button class="button"
                    onclick="randomDirection()">
                🔄 Random Direction
            </button>

        </div>
    `);
}

function calibrateCompass() {

    alert("Compass calibrated! 🧭");

    randomDirection();
}

function randomDirection() {

    const directions =
        ["NORTH","EAST","SOUTH","WEST"];

    const direction =
        directions[
            Math.floor(
                Math.random() * directions.length
            )
        ];

    document.getElementById("direction")
        .textContent =
        direction;
}


/* =========================
   CONNECT APPS
========================= */

document.getElementById("messages").onclick =
    openMessages;

document.getElementById("camera").onclick =
    openCamera;

document.getElementById("splashface").onclick =
    openSplashFace;

document.getElementById("stocks").onclick =
    openStocks;

document.getElementById("maps").onclick =
    openMaps;

document.getElementById("photos").onclick =
    openPhotos;

document.getElementById("weather").onclick =
    openWeather;

document.getElementById("notes").onclick =
    openNotes;

document.getElementById("peartunes").onclick =
    openPearTunes;

document.getElementById("settings").onclick =
    openSettings;

document.getElementById("clock").onclick =
    openClock;

document.getElementById("videos").onclick =
    openVideos;

document.getElementById("phone").onclick =
    openPhone;

document.getElementById("mail").onclick =
    openMail;

document.getElementById("compass").onclick =
    openCompass;

document.getElementById("music").onclick =
    openPearTunes;

document.getElementById("home").onclick =
    closeApp;
