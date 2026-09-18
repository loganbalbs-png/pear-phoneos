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
}


/* MESSAGES */

function openMessages() {

    openApp("Messages", `
        <h2>Messages</h2>

        <div class="card" onclick="chat('Chloe')">
            👩 <b>Chloe</b>
            <br>
            Hey! What are you doing?
        </div>

        <div class="card" onclick="chat('Sam')">
            👨 <b>Sam</b>
            <br>
            Wanna hang out?
        </div>

        <div class="card" onclick="chat('Cat')">
            🐱 <b>Cat</b>
            <br>
            Meow.
        </div>
    `);
}

function chat(name) {

    openApp(name, `
        <div id="chatMessages">

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

        <input id="messageInput" placeholder="iMessage">

        <br><br>

        <button class="button"
                onclick="sendMessage('${name}')">
            Send
        </button>
    `);
}

function sendMessage(name) {

    const input =
        document.getElementById("messageInput");

    if (!input.value.trim()) return;

    document.getElementById("chatMessages").innerHTML += `
        <div class="message me">
            ${input.value}
        </div>
    `;

    input.value = "";

    setTimeout(() => {

        document.getElementById("chatMessages").innerHTML += `
            <div class="message">
                ${name === "Cat"
                    ? "Meow 😸"
                    : "Haha that's awesome!"
                }
            </div>
        `;

    }, 700);
}


/* CAMERA */

let cameraStream = null;

function openCamera() {

    openApp("Camera", `
        <video id="cameraVideo"
               autoplay
               playsinline
               style="width:100%;background:#000;border-radius:12px">
        </video>

        <br><br>

        <button class="button"
                onclick="startCamera()">
            📷 Start
        </button>

        <button class="button"
                onclick="takePhoto()">
            📸 Take Photo
        </button>

        <canvas id="cameraCanvas"
                style="display:none">
        </canvas>

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

        alert("Camera unavailable.");

    }
}

function takePhoto() {

    const video =
        document.getElementById("cameraVideo");

    if (!video.srcObject) {

        alert("Start the camera first!");

        return;
    }

    const canvas =
        document.getElementById("cameraCanvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d")
        .drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

    const image =
        canvas.toDataURL("image/png");

    document.getElementById("cameraResult").innerHTML = `
        <br>
        <img src="${image}"
             style="width:100%;border-radius:10px">
    `;
}


/* SPLASHFACE */

function openSplashFace() {

    openApp("SplashFace", `
        <h2>🌊 SplashFace</h2>

        <div class="card">

            <b>Chloe</b>

            <p>
                Beach day!! ☀️🌊
            </p>

            <button class="button"
                    onclick="likePost(this)">
                ❤️ Like <span>24</span>
            </button>

        </div>

        <div class="card">

            <b>Sam</b>

            <p>
                Just got a new Pear Phone 🍐📱
            </p>

            <button class="button"
                    onclick="likePost(this)">
                ❤️ Like <span>8</span>
            </button>

        </div>

        <button class="button"
                onclick="newPost()">
            ➕ Post
        </button>
    `);
}

function likePost(button) {

    const number =
        button.querySelector("span");

    number.textContent =
        Number(number.textContent) + 1;
}

function newPost() {

    openApp("New Post", `
        <textarea id="postText"
                  placeholder="What's happening?">
        </textarea>

        <br><br>

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

    alert("Posted! 🌊");

    openSplashFace();
}


/* STOCKS */

function openStocks() {

    openApp("Stocks", `
        <h2>📈 Stocks</h2>

        <div class="card">
            <b>🍎 AAPL</b>
            <br>
            $238.45
            <br>
            +2.31%
        </div>

        <div class="card">
            <b>💻 MSFT</b>
            <br>
            $511.20
            <br>
            +1.42%
        </div>

        <div class="card">
            <b>🚀 TSLA</b>
            <br>
            $341.88
            <br>
            -0.82%
        </div>

        <button class="button"
                onclick="alert('Prices refreshed! 📊')">
            🔄 Refresh
        </button>
    `);
}


/* MAPS */

function openMaps() {

    openApp("Maps", `
        <h2>🗺️ Pear Maps</h2>

        <input id="mapSearch"
               placeholder="Search a place">

        <br><br>

        <button class="button"
                onclick="searchMap()">
            Search
        </button>

        <div class="card"
             style="
             height:150px;
             display:flex;
             align-items:center;
             justify-content:center;
             font-size:50px;
             ">
            🗺️
        </div>

        <p id="mapResult">
            Search somewhere.
        </p>
    `);
}

function searchMap() {

    const place =
        document.getElementById("mapSearch").value;

    if (!place.trim()) return;

    document.getElementById("mapResult").innerHTML =
        "📍 Searching for <b>" +
        place +
        "</b>...";
}


/* PHOTOS */

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

        const reader =
            new FileReader();

        reader.onload = function(e) {

            grid.innerHTML += `
                <img src="${e.target.result}"
                     style="
                     width:100%;
                     aspect-ratio:1;
                     object-fit:cover;
                     border-radius:9px;
                     ">
            `;
        };

        reader.readAsDataURL(file);
    });
}


/* WEATHER */

function openWeather() {

    openApp("Weather", `
        <div style="text-align:center">

            <div style="font-size:55px">
                ☀️
            </div>

            <h1>22°C</h1>

            <h3>Sunny</h3>

        </div>

        <div class="grid">

            <div class="card">
                🌅 18°C
            </div>

            <div class="card">
                ☀️ 24°C
            </div>

            <div class="card">
                🌇 21°C
            </div>

            <div class="card">
                🌙 16°C
            </div>

        </div>
    `);
}


/* NOTES */

function openNotes() {

    openApp("Notes", `
        <h2>📝 Notes</h2>

        <textarea id="note"
                  placeholder="Write something...">
        </textarea>

        <br><br>

        <button class="button"
                onclick="saveNote()">
            Save
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

        document.getElementById("note").value =
            saved;
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


/* PEARTUNES */

let audio = new Audio();

function openPearTunes() {

    openApp("PearTunes", `
        <div style="text-align:center">

            <div style="font-size:55px">
                🎵
            </div>

            <h2>PearTunes</h2>

            <button class="button"
                    onclick="demoMusic()">
                ▶️ Play
            </button>

            <button class="button"
                    onclick="audio.pause()">
                ⏸ Pause
            </button>

            <br><br>

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

function loadMusic(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    audio.src =
        URL.createObjectURL(file);

    audio.play();
}


/* SETTINGS */

function openSettings() {

    openApp("Settings", `
        <h2>⚙️ Settings</h2>

        <div class="card">

            <button class="button"
                    onclick="toggleDarkMode()">
                🌙 Dark Mode
            </button>

            <button class="button"
                    onclick="resetPhone()">
                🔄 Reset
            </button>

        </div>
    `);
}

function toggleDarkMode() {

    document.getElementById("app-window")
        .style.background =
        document.getElementById("app-window")
        .style.background === "rgb(20, 20, 20)"
        ? "#f2f2f7"
        : "#141414";
}

function resetPhone() {

    localStorage.clear();

    alert("Pear Phone reset!");
}


/* CLOCK */

let stopwatchSeconds = 0;
let stopwatchTimer = null;

function openClock() {

    openApp("Clock", `
        <div style="text-align:center">

            <div style="font-size:55px">
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
                Math.floor(stopwatchSeconds / 60);

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

    const element =
        document.getElementById("stopwatch");

    if (element) {
        element.textContent = "00:00";
    }
}


/* VIDEOS */

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
               border-radius:10px;
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


/* PHONE */

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

    alert(
        "Calling " +
        phoneNumber +
        " 📞"
    );
}


/* MAIL */

function openMail() {

    openApp("Mail", `
        <h2>📧 Pear Mail</h2>

        <div class="card"
             onclick="readMail()">

            <b>Apple</b>

            <p>
                Your Pear Phone order shipped!
            </p>

        </div>

        <div class="card">

            <b>Mom</b>

            <p>
                Don't forget dinner ❤️
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
        <h2>📦 Order Shipped</h2>

        <p>
            Your Pear Phone accessories
            are on the way!
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

        <br><br>

        <input placeholder="Subject">

        <br><br>

        <textarea placeholder="Message"></textarea>

        <br><br>

        <button class="button"
                onclick="alert('Email sent! 📧')">
            Send
        </button>
    `);
}


/* COMPASS */

function openCompass() {

    openApp("Compass", `
        <div style="text-align:center">

            <div style="font-size:80px">
                🧭
            </div>

            <h2 id="direction">
                NORTH
            </h2>

            <button class="button"
                    onclick="calibrateCompass()">
                Calibrate
            </button>

        </div>
    `);
}

function calibrateCompass() {

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


/* CONNECT ALL APPS */

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
