const overlay = document.getElementById("overlay");
const appWindow = document.getElementById("app-window");

function openApp(title, content) {
    appWindow.innerHTML = `
        <div class="header">
            <button class="back" onclick="closeApp()">‹</button>
            <span>${title}</span>
        </div>

        <div class="content">
            ${content}
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

        <div class="card" onclick="openChat('Chloe')">
            👩 <b>Chloe</b>
            <p>Hey! What are you doing?</p>
        </div>

        <div class="card" onclick="openChat('Sam')">
            👨 <b>Sam</b>
            <p>Wanna hang out?</p>
        </div>

        <div class="card" onclick="openChat('Cat')">
            🐱 <b>Cat</b>
            <p>Meow.</p>
        </div>
    `);
}

function openChat(name) {
    openApp(name, `
        <div id="chatMessages">
            <div class="message">Hey! 👋</div>
            <div class="message">What's up?</div>
            <div class="message me">Just using my Pear Phone 😂</div>
        </div>

        <br>

        <input id="messageInput" placeholder="iMessage">

        <br><br>

        <button class="button" onclick="sendMessage('${name}')">
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
                ${name === "Cat" ? "Meow 😸" : "Haha that's awesome!"}
            </div>
        `;
    }, 700);
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
               style="width:100%;background:#000;border-radius:18px">
        </video>

        <br><br>

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
                video:true
            });

        document.getElementById("cameraVideo").srcObject =
            cameraStream;

    } catch(error) {
        alert("Camera permission was denied or the camera is unavailable.");
    }
}

function takePhoto() {
    const video = document.getElementById("cameraVideo");

    if (!video.srcObject) {
        alert("Press Start Camera first!");
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
   SPLASHFACE
========================= */

function openSplashFace() {
    openApp("SplashFace", `
        <h2>🌊 SplashFace</h2>

        <div class="card">
            <b>Chloe</b>
            <p>Beach day!! ☀️🌊</p>

            <button class="button" onclick="likePost(this)">
                ❤️ Like <span>24</span>
            </button>
        </div>

        <div class="card">
            <b>Sam</b>
            <p>Just got a new Pear Phone 🍐📱</p>

            <button class="button" onclick="likePost(this)">
                ❤️ Like <span>8</span>
            </button>
        </div>

        <button class="button" onclick="createPost()">
            ➕ Create Post
        </button>
    `);
}

function likePost(button) {
    const number = button.querySelector("span");

    number.textContent =
        Number(number.textContent) + 1;
}

function createPost() {
    openApp("New Post", `
        <h2>Create a Post</h2>

        <textarea id="postText"
                  placeholder="What's happening?"></textarea>

        <br><br>

        <button class="button" onclick="publishPost()">
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
            <p>+2.31%</p>
        </div>

        <div class="card">
            <b>💻 MSFT</b>
            <h2>$511.20</h2>
            <p>+1.42%</p>
        </div>

        <div class="card">
            <b>🚀 TSLA</b>
            <h2>$341.88</h2>
            <p>-0.82%</p>
        </div>

        <button class="button" onclick="refreshStocks()">
            🔄 Refresh
        </button>

        <p id="stockMessage"></p>
    `);
}

function refreshStocks() {
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

        <br><br>

        <button class="button" onclick="searchMap()">
            Search
        </button>

        <div class="card"
             style="
             height:250px;
             display:flex;
             align-items:center;
             justify-content:center;
             font-size:70px;
             ">
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
        "📍 Searching for <b>" + place + "</b>...";
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
             class="grid"
             style="margin-top:15px">
        </div>
    `);
}

function loadPhotos(event) {
    const grid =
        document.getElementById("photoGrid");

    grid.innerHTML = "";

    Array.from(event.target.files).forEach(file => {

        const reader = new FileReader();

        reader.onload = function(e) {

            grid.innerHTML += `
                <img src="${e.target.result}"
                     style="
                     width:100%;
                     aspect-ratio:1;
                     object-fit:cover;
                     border-radius:14px;
                     ">
            `;
        };

        reader.readAsDataURL(file);
    });
}


/* =========================
   WEATHER
========================= */

function openWeather() {
    openApp("Weather", `
        <div style="text-align:center">

            <div style="font-size:80px">
                ☀️
            </div>

            <h1>22°C</h1>

            <h2>Sunny</h2>

        </div>

        <div class="grid">

            <div class="card">
                🌅 Morning
                <br>
                18°C
            </div>

            <div class="card">
                ☀️ Afternoon
                <br>
                24°C
            </div>

            <div class="card">
                🌇 Evening
                <br>
                21°C
            </div>

            <div class="card">
                🌙 Night
                <br>
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

        <br><br>

        <button class="button" onclick="saveNote()">
            Save
        </button>

        <button class="button" onclick="clearNote()">
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
        <div style="text-align:center">

            <div style="font-size:80px">
                🎵
            </div>

            <h2>PearTunes</h2>

            <div class="card">

                <h3 id="songTitle">
                    Pear Phone Radio
                </h3>

                <button class="button"
                        onclick="demoMusic()">
                    ▶️ Play Demo
                </button>

                <button class="button"
                        onclick="pauseMusic()">
                    ⏸ Pause
                </button>

            </div>

            <input type="file"
                   accept="audio/*"
                   onchange="loadMusic(event)">

        </div>
    `);
}

function demoMusic() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    const context =
        new AudioContext();

    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();

    oscillator.frequency.value = 440;

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 1
    );

    oscillator.stop(
        context.currentTime + 1
    );
}

function pauseMusic() {
    audio.pause();
}

function loadMusic(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    audio.src =
        URL.createObjectURL(file);

    document.getElementById("songTitle").textContent =
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

            <button class="button"
                    onclick="toggleDarkMode()">
                🌙 Dark Mode
            </button>

            <button class="button"
                    onclick="biggerText()">
                🔠 Bigger Text
            </button>

            <button class="button"
                    onclick="resetPhone()">
                🔄 Reset Phone
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

function biggerText() {

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

let stopwatch = 0;
let stopwatchTimer = null;

function openClock() {

    openApp("Clock", `
        <div style="text-align:center">

            <div style="font-size:80px">
                🕐
            </div>

            <h1 id="time">
                ${new Date().toLocaleTimeString()}
            </h1>

            <div class="card">

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

        </div>
    `);

    updateTime();
}

function updateTime() {

    const element =
        document.getElementById("time");

    if (!element) return;

    element.textContent =
        new Date().toLocaleTimeString();

    setTimeout(updateTime,1000);
}

function startStopwatch() {

    if (stopwatchTimer) return;

    stopwatchTimer =
        setInterval(() => {

            stopwatch++;

            const minutes =
                Math.floor(stopwatch / 60);

            const seconds =
                stopwatch % 60;

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

    stopwatch = 0;

    const element =
        document.getElementById("stopwatch");

    if (element) {
        element.textContent = "00:00";
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

        <br><br>

        <video id="videoPlayer"
               controls
               style="
               width:100%;
               background:#000;
               border-radius:15px;
               ">
        </video>
    `);
}

function loadVideo(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    document.getElementById("videoPlayer").src =
        URL.createObjectURL(file);
}


/* =========================
   PHONE
========================= */

let phoneNumber = "";

function openPhone() {

    phoneNumber = "";

    openApp("Phone", `
        <h2 style="text-align:center">
            📞 Phone
        </h2>

        <h1 id="phoneNumber"
            style="text-align:center">
        </h1>

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

    openApp("Mail", `
        <h2>📦 Your order shipped!</h2>

        <p>
            Your Pear Phone accessories
            are officially on the way.
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

        <br>

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

            <div style="font-size:100px">
                🧭
            </div>

            <h1 id="direction">
                NORTH
            </h1>

            <p>
                Tap calibrate to change direction.
            </p>

            <button class="button"
                    onclick="calibrateCompass()">
                🧭 Calibrate
            </button>

        </div>
    `);
}

function calibrateCompass() {

    const directions =
        ["NORTH","EAST","SOUTH","WEST"];

    const random =
        directions[
            Math.floor(
                Math.random() * directions.length
            )
        ];

    document.getElementById("direction")
        .textContent =
        random;
}


/* =========================
   APP CLICK CONNECTIONS
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


/* TOUCHSCREEN SUPPORT */

document.querySelectorAll(".hotspot").forEach(button => {

    button.addEventListener("touchend", function(event) {

        event.preventDefault();

        this.click();

    }, {passive:false});

});
