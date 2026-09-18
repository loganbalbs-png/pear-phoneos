const overlay = document.getElementById("overlay");
const appWindow = document.getElementById("app-window");

function openApp(title, html) {
    appWindow.innerHTML = `
        <div class="header">
            <button class="back" onclick="closeApp()">‹</button>
            <span>${title}</span>
        </div>

        <div class="content">
            ${html}
        </div>
    `;

    overlay.classList.add("open");
}

function closeApp() {
    overlay.classList.remove("open");
    appWindow.innerHTML = "";
}


/* =========================
   MESSAGES
========================= */

function openMessages() {

    openApp("Messages", `
        <h2>Messages</h2>

        <div class="card" onclick="chat('Chloe')">
            👩 Chloe
            <br>
            <small>Hey!! What are you doing?</small>
        </div>

        <div class="card" onclick="chat('Sam')">
            👨 Sam
            <br>
            <small>Wanna hang out?</small>
        </div>

        <div class="card" onclick="chat('Cat')">
            🐱 Cat
            <br>
            <small>Meow.</small>
        </div>
    `);
}

function chat(name) {

    openApp(name, `
        <div id="chat">

            <div class="message">
                Hey! 👋
            </div>

            <div class="message">
                What's up?
            </div>

            <div class="message me">
                Just using my Pear Phone 😂
            </div>

        </div>

        <br>

        <input id="msgInput" placeholder="iMessage">

        <button class="button" onclick="sendMessage('${name}')">
            Send
        </button>
    `);
}

function sendMessage(name) {

    const input = document.getElementById("msgInput");

    if (!input.value.trim()) return;

    document.getElementById("chat").innerHTML += `
        <div class="message me">
            ${input.value}
        </div>
    `;

    input.value = "";

    setTimeout(() => {

        document.getElementById("chat").innerHTML += `
            <div class="message">
                ${name === "Cat"
                    ? "Meow 😸"
                    : "Haha that's awesome!"
                }
            </div>
        `;

    }, 800);
}


/* =========================
   CAMERA
========================= */

let cameraStream;

function openCamera() {

    openApp("Camera", `

        <video id="cameraVideo"
               class="camera-video"
               autoplay
               playsinline
               style="width:100%;background:black;border-radius:18px">
        </video>

        <br>

        <button class="button" onclick="startCamera()">
            📷 Start Camera
        </button>

        <button class="button" onclick="takePhoto()">
            📸 Take Photo
        </button>

        <canvas id="cameraCanvas" style="display:none"></canvas>

        <div id="cameraResult"></div>
    `);
}

async function startCamera() {

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: true
            });

        document.getElementById("cameraVideo").srcObject =
            cameraStream;

    } catch (error) {

        alert("Camera permission was denied or unavailable.");

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
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const image = canvas.toDataURL("image/png");

    document.getElementById("cameraResult").innerHTML = `
        <br>
        <h3>Photo Taken 📸</h3>
        <img src="${image}"
             style="width:100%;border-radius:15px">
    `;
}


/* =========================
   PHOTOS
========================= */

function openPhotos() {

    openApp("Photos", `

        <h2>📷 My Photos</h2>

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

    const grid = document.getElementById("photoGrid");

    grid.innerHTML = "";

    [...event.target.files].forEach(file => {

        const reader = new FileReader();

        reader.onload = function(e) {

            grid.innerHTML += `
                <img src="${e.target.result}"
                     style="
                     width:100%;
                     border-radius:14px;
                     aspect-ratio:1;
                     object-fit:cover;
                     ">
            `;
        };

        reader.readAsDataURL(file);
    });
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
                ❤️ Like <span>24</span>
            </button>
        </div>

        <div class="card">
            <b>Sam</b>
            <p>Just got a new Pear Phone 🍐📱</p>
            <button class="button"
                    onclick="likePost(this)">
                ❤️ Like <span>8</span>
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

    span.textContent =
        Number(span.textContent) + 1;
}

function newPost() {

    openApp("New Post", `

        <h2>Create a Post</h2>

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

function openStocks() {

    openApp("Stocks", `

        <h2>📈 Stocks</h2>

        <div class="card">
            <b>🍎 AAPL</b>
            <h2>$238.45</h2>
            <span>+2.31%</span>
        </div>

        <div class="card">
            <b>💻 MSFT</b>
            <h2>$511.20</h2>
            <span>+1.42%</span>
        </div>

        <div class="card">
            <b>🚀 TSLA</b>
            <h2>$341.88</h2>
            <span>-0.82%</span>
        </div>

        <button class="button"
                onclick="randomStocks()">
            🔄 Refresh Prices
        </button>

        <p id="stockMessage"></p>
    `);
}

function randomStocks() {

    document.getElementById("stockMessage").textContent =
        "Prices updated! 📊";
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
             style="height:250px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:70px">
            🗺️
        </div>

        <p id="mapResult">
            Search for somewhere to go.
        </p>
    `);
}

function searchMap() {

    const place =
        document.getElementById("mapSearch").value;

    if (!place.trim()) return;

    document.getElementById("mapResult").innerHTML =
        `📍 Searching for <b>${place}</b>...`;
}


/* =========================
   WEATHER
========================= */

function openWeather() {

    openApp("Weather", `

        <div class="big">☀️</div>

        <h1 style="text-align:center">
            22°C
        </h1>

        <h2 style="text-align:center">
            Sunny
        </h2>

        <div class="grid">

            <div class="card">
                🌅 Morning<br>
                18°C
            </div>

            <div class="card">
                ☀️ Afternoon<br>
                24°C
            </div>

            <div class="card">
                🌇 Evening<br>
                21°C
            </div>

            <div class="card">
                🌙 Night<br>
                16°C
            </div>

        </div>
    `);
}


/* =========================
   NOTES
========================= */

function openNotes() {

    openApp("Notes", `

        <h2>📝 Notes</h2>

        <textarea id="note"
                  placeholder="Write something..."></textarea>

        <button class="button"
                onclick="saveNote()">
            Save Note
        </button>

        <button class="button"
                onclick="clearNote()">
            Clear
        </button>

        <p id="noteStatus"></p>
    `);

    const saved =
        localStorage.getItem("pearNote");

    if (saved) {
        document.getElementById("note").value = saved;
    }
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

        <div class="big">🎵</div>

        <h2 style="text-align:center">
            PearTunes
        </h2>

        <div class="card"
             style="text-align:center">

            <h3 id="songTitle">
                Pear Phone Radio
            </h3>

            <button class="button"
                    onclick="playMusic()">
                ▶️ Play
            </button>

            <button class="button"
                    onclick="pauseMusic()">
                ⏸ Pause
            </button>

            <button class="button"
                    onclick="demoSong()">
                🎶 Demo Song
            </button>

        </div>

        <input type="file"
               accept="audio/*"
               onchange="loadSong(event)">
    `);
}

function playMusic() {
    audio.play();
}

function pauseMusic() {
    audio.pause();
}

function loadSong(event) {

    const file = event.target.files[0];

    if (!file) return;

    audio.src =
        URL.createObjectURL(file);

    document.getElementById("songTitle").textContent =
        file.name;

    audio.play();
}

function demoSong() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    const ctx = new AudioContext();

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.frequency.value = 440;

    oscillator.connect(gain);

    gain.connect(ctx.destination);

    oscillator.start();

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 1
    );

    oscillator.stop(
        ctx.currentTime + 1
    );
}


/* =========================
   SETTINGS
========================= */

function openSettings() {

    openApp("Settings", `

        <h2>⚙️ Settings</h2>

        <div class="card">

            <button class="button"
                    onclick="toggleDarkMode()">
                🌙 Dark Mode
            </button>

            <button class="button"
                    onclick="increaseText()">
                🔠 Bigger Text
            </button>

            <button class="button"
                    onclick="resetPhone()">
                🔄 Reset Pear Phone
            </button>

        </div>

        <p id="settingsMessage"></p>
    `);
}

function toggleDarkMode() {

    document.body.style.background =
        document.body.style.background === "black"
        ? "white"
        : "black";

    document.getElementById("settingsMessage").textContent =
        "Theme changed!";
}

function increaseText() {

    document.body.style.fontSize = "18px";

    document.getElementById("settingsMessage").textContent =
        "Text size increased!";
}

function resetPhone() {

    localStorage.clear();

    alert("Pear Phone reset!");
}


/* =========================
   CLOCK
========================= */

let stopwatchInterval;
let stopwatchSeconds = 0;

function openClock() {

    openApp("Clock", `

        <div class="big">
            🕐
        </div>

        <h1 id="currentTime"
            style="text-align:center">
            --
        </h1>

        <div class="card"
             style="text-align:center">

            <h2 id="stopwatch">
                00:00
            </h2>

            <button class="button"
                    onclick="startStopwatch()">
                ▶️ Start
            </button>

            <button class="button"
                    onclick="stopStopwatch()">
                ⏸ Stop
            </button>

            <button class="button"
                    onclick="resetStopwatch()">
                🔄 Reset
            </button>

        </div>
    `);

    updateClock();

    setInterval(() => {

        const clock =
            document.getElementById("currentTime");

        if (clock) {
            updateClock();
        }

    }, 1000);
}

function updateClock() {

    const clock =
        document.getElementById("currentTime");

    if (!clock) return;

    clock.textContent =
        new Date().toLocaleTimeString();
}

function startStopwatch() {

    if (stopwatchInterval) return;

    stopwatchInterval =
        setInterval(() => {

            stopwatchSeconds++;

            const minutes =
                Math.floor(stopwatchSeconds / 60);

            const seconds =
                stopwatchSeconds % 60;

            document.getElementById("stopwatch")
                .textContent =
                `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

        }, 1000);
}

function stopStopwatch() {

    clearInterval(stopwatchInterval);

    stopwatchInterval = null;
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
               style="width:100%;
                      border-radius:15px;
                      background:black">
        </video>
    `);
}

function loadVideo(event) {

    const file = event.target.files[0];

    if (!file) return;

    document.getElementById("videoPlayer").src =
        URL.createObjectURL(file);
}


/* =========================
   PHONE
========================= */

let phoneNumber = "";

function openPhone() {

    openApp("Phone", `

        <h1 id="phoneNumber"
            style="text-align:center">
            ${phoneNumber || " "}
        </h1>

        <div class="grid">

            ${["1","2","3","4","5","6","7","8","9","*","0","#"]
            .map(n => `
                <button class="button"
                        style="font-size:22px"
                        onclick="dial('${n}')">
                    ${n}
                </button>
            `).join("")}

        </div>

        <button class="button"
                onclick="callNumber()">
            📞 Call
        </button>

        <button class="button"
                onclick="clearNumber()">
            ❌ Clear
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

    alert(
        "Calling " +
        phoneNumber +
        " 📞"
    );
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

            <p>
                Your Pear Phone order has shipped!
            </p>

        </div>

        <div class="card">

            <b>Mom</b>

            <p>
                Don't forget dinner tonight ❤️
            </p>

        </div>

        <button class="button"
                onclick="composeMail()">
            ✏️ Compose
        </button>
    `);
}

function readMail() {

    openApp("Apple", `

        <h2>Your order shipped! 📦</h2>

        <p>
            Your Pear Phone accessories
            are officially on the way.
        </p>

        <button class="button"
                onclick="openMail()">
            Back to Inbox
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

        <div class="big">
            🧭
        </div>

        <h1 id="direction"
            style="text-align:center">
            North
        </h1>

        <p style="text-align:center">
            Rotate your device to use the compass.
        </p>

        <button class="button"
                onclick="randomDirection()">
            🧭 Calibrate
        </button>
    `);
}

function randomDirection() {

    const directions =
        ["North","East","South","West"];

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
   CLICK SYSTEM
========================= */

document.getElementById("messages")
    .onclick = openMessages;

document.getElementById("camera")
    .onclick = openCamera;

document.getElementById("splashface")
    .onclick = openSplashFace;

document.getElementById("stocks")
    .onclick = openStocks;

document.getElementById("maps")
    .onclick = openMaps;

document.getElementById("photos")
    .onclick = openPhotos;

document.getElementById("weather")
    .onclick = openWeather;

document.getElementById("notes")
    .onclick = openNotes;

document.getElementById("peartunes")
    .onclick = openPearTunes;

document.getElementById("settings")
    .onclick = openSettings;

document.getElementById("clock")
    .onclick = openClock;

document.getElementById("videos")
    .onclick = openVideos;

document.getElementById("phone")
    .onclick = openPhone;

document.getElementById("mail")
    .onclick = openMail;

document.getElementById("compass")
    .onclick = openCompass;

document.getElementById("music")
    .onclick = openPearTunes;

document.getElementById("home")
    .onclick = closeApp;


/* Touchscreen support */

document.querySelectorAll(".hotspot").forEach(button => {

    button.addEventListener("pointerup", function(event) {

        event.preventDefault();

        this.click();

    });

});
