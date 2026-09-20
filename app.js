/* =========================================================
   PEAR PHONE OS
   FULL APP SCRIPT
   PAGE 1 + PAGE 2
   ========================================================= */


/* =========================================================
   APP WINDOW
   ========================================================= */

const overlay = document.getElementById("overlay");
const appWindow = document.getElementById("app-window");

function openApp(title, content) {

    if (!appWindow || !overlay) return;

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

    if (overlay) {
        overlay.classList.remove("open");
    }

    stopCamera();
}


/* =========================================================
   PAGE SWITCHING
   ========================================================= */

let currentPage = 1;

let touchStartX = 0;
let touchStartY = 0;

const phoneContainer =
    document.getElementById("phone-container");

const pageDots =
    document.getElementById("page-dots");


function showPage(page) document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowRight") {
        showPage(2);
    }

    if (event.key === "ArrowLeft") {
        showPage(1);
    }

}); { 

    currentPage = page;

    if (!phoneContainer) return;

    if (page === 2) {

        phoneContainer.classList.add("page-two");

        if (pageDots) {
            pageDots.textContent = "○ ●";
        }

    } else {

        phoneContainer.classList.remove("page-two");

        if (pageDots) {
            pageDots.textContent = "● ○";
        }
    }

    closeApp();
}


/* TOUCH SWIPE */

if (phoneContainer) {

    phoneContainer.addEventListener(
        "touchstart",
        function(event) {

            if (overlay &&
                overlay.classList.contains("open")) {
                return;
            }

            const touch = event.touches[0];

            touchStartX = touch.clientX;
            touchStartY = touch.clientY;

        },
        { passive: true }
    );


    phoneContainer.addEventListener(
        "touchend",
        function(event) {

            if (overlay &&
                overlay.classList.contains("open")) {
                return;
            }

            const touch = event.changedTouches[0];

            const differenceX =
                touch.clientX - touchStartX;

            const differenceY =
                touch.clientY - touchStartY;

            if (Math.abs(differenceX) < 60) {
                return;
            }

            if (
                Math.abs(differenceX) <
                Math.abs(differenceY)
            ) {
                return;
            }

            if (differenceX < 0) {

                showPage(2);

            } else {

                showPage(1);
            }

        },
        { passive: true }
    );
}


/* =========================================================
   MESSAGES
   ========================================================= */

const chats = {

    Chloe: [
        "Hey!! 👋",
        "What are you doing?",
        "We should hang out!"
    ],

    Sam: [
        "Yo!",
        "Did you see this?",
        "😂"
    ],

    Cat: [
        "Meow.",
        "MEOW.",
        "😸"
    ]
};


function openMessages() {

    openApp("Messages", `

        <h2>Messages</h2>

        <div class="card"
             onclick="openChat('Chloe')">

            👩 <b>Chloe</b>

            <br>

            We should hang out!

        </div>


        <div class="card"
             onclick="openChat('Sam')">

            👨 <b>Sam</b>

            <br>

            Did you see this?

        </div>


        <div class="card"
             onclick="openChat('Cat')">

            🐱 <b>Cat</b>

            <br>

            Meow.

        </div>


        <button class="button"
                onclick="newChat()">

            ➕ New Message

        </button>

    `);
}


function openChat(name) {

    openApp(name, `

        <div id="chatMessages">

            ${chats[name].map(
                message =>
                `<div class="message">
                    ${message}
                </div>`
            ).join("")}

        </div>


        <input
            id="messageInput"
            placeholder="iMessage"
        >


        <button
            class="button"
            onclick="sendMessage('${name}')"
        >

            Send

        </button>

    `);
}


function sendMessage(name) {

    const input =
        document.getElementById("messageInput");

    if (!input || !input.value.trim()) {
        return;
    }

    const messages =
        document.getElementById("chatMessages");

    messages.innerHTML += `
        <div class="message me">
            ${input.value}
        </div>
    `;

    input.value = "";

    setTimeout(() => {

        if (!document.getElementById("chatMessages")) {
            return;
        }

        document.getElementById("chatMessages")
            .innerHTML += `

            <div class="message">

                ${
                    name === "Cat"
                    ? "Meow 😸"
                    : "Sounds good!"
                }

            </div>

        `;

    }, 700);
}


function newChat() {

    openApp("New Message", `

        <input
            id="newContact"
            placeholder="Contact"
        >

        <textarea
            id="newMessage"
            placeholder="Message"
        ></textarea>


        <button
            class="button"
            onclick="alert('Message sent! 💬')"
        >

            Send

        </button>

    `);
}


/* =========================================================
   CAMERA
   ========================================================= */

let cameraStream = null;


function openCamera() {

    openApp("Camera", `

        <video
            id="cameraVideo"
            autoplay
            playsinline
            style="
                width:100%;
                background:#000;
                border-radius:9px;
            "
        ></video>


        <br>


        <button
            class="button"
            onclick="startCamera()"
        >

            📷 Start

        </button>


        <button
            class="button"
            onclick="takePhoto()"
        >

            📸 Capture

        </button>


        <button
            class="button"
            onclick="stopCamera()"
        >

            ⏹ Stop

        </button>


        <canvas
            id="cameraCanvas"
            style="display:none"
        ></canvas>


        <div id="cameraResult"></div>

    `);

    startCamera();
}


async function startCamera() {

    try {

        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {

            alert("This browser does not support camera access.");
            return;
        }

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user"
                },
                audio: false
            });

        const video =
            document.getElementById("cameraVideo");

        if (video) {
            video.srcObject = cameraStream;
        }

    } catch (error) {

        alert(
            "Camera permission is unavailable. " +
            "Allow camera access in Chromium."
        );
    }
}


function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => track.stop());

        cameraStream = null;
    }
}


function takePhoto() {

    const video =
        document.getElementById("cameraVideo");

    if (!video ||
        !video.srcObject) {

        alert("Start the camera first!");
        return;
    }

    const canvas =
        document.getElementById("cameraCanvas");

    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;

    canvas
        .getContext("2d")
        .drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

    const image =
        canvas.toDataURL("image/png");

    document.getElementById(
        "cameraResult"
    ).innerHTML = `

        <img
            src="${image}"
            style="
                width:100%;
                border-radius:8px;
                margin-top:8px;
            "
        >

    `;
}


/* =========================================================
   SPLASHFACE
   ========================================================= */

function openSplashFace() {

    openApp("SplashFace", `

        <h2>🌊 SplashFace</h2>


        <div class="card">

            <b>Chloe</b>

            <p>
                Beach day!! ☀️🌊
            </p>


            <button
                class="button"
                onclick="likePost(this)"
            >

                ❤️ <span>24</span>

            </button>


            <button
                class="button"
                onclick="commentPost()"
            >

                💬 Comment

            </button>

        </div>


        <div class="card">

            <b>Sam</b>

            <p>
                New Pear Phone! 🍐
            </p>


            <button
                class="button"
                onclick="likePost(this)"
            >

                ❤️ <span>8</span>

            </button>

        </div>


        <button
            class="button"
            onclick="newPost()"
        >

            ➕ Create Post

        </button>

    `);
}


function likePost(button) {

    const span =
        button.querySelector("span");

    span.textContent =
        Number(span.textContent) + 1;
}


function commentPost() {

    const comment =
        prompt("Write a comment:");

    if (comment) {

        alert("Comment posted! 💬");
    }
}


function newPost() {

    openApp("Create Post", `

        <textarea
            id="postText"
            placeholder="What's happening?"
        ></textarea>


        <button
            class="button"
            onclick="publishPost()"
        >

            Post

        </button>

    `);
}


function publishPost() {

    const text =
        document.getElementById(
            "postText"
        ).value;

    if (!text.trim()) {

        alert("Write something first!");
        return;
    }

    alert("Posted to SplashFace! 🌊");

    openSplashFace();
}


/* =========================================================
   STOCKS
   ========================================================= */

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


        <input
            id="stockSearch"
            placeholder="Add ticker e.g. GOOG"
        >


        <button
            class="button"
            onclick="addStock()"
        >

            ➕ Add Stock

        </button>


        <button
            class="button"
            onclick="refreshStocks()"
        >

            🔄 Refresh

        </button>

    `);

    drawStocks();
}


function drawStocks() {

    const list =
        document.getElementById(
            "stocksList"
        );

    if (!list) return;

    list.innerHTML =
        Object.keys(stockValues)
        .map(symbol => `

            <div
                class="card"
                onclick="stockDetails('${symbol}')"
            >

                <b>${symbol}</b>

                <br>

                $${stockValues[symbol].toFixed(2)}

                <br>

                <small>
                    Tap for details
                </small>

            </div>

        `)
        .join("");
}


function refreshStocks() {

    Object.keys(stockValues)
        .forEach(symbol => {

            stockValues[symbol] +=
                (Math.random() - 0.5) * 8;

        });

    drawStocks();
}


function addStock() {

    const input =
        document.getElementById(
            "stockSearch"
        );

    const symbol =
        input.value
        .trim()
        .toUpperCase();

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

            <div
                style="
                    width:${Math.random() * 80 + 10}%;
                "
            ></div>

        </div>


        <p>
            Today's activity
        </p>


        <button
            class="button"
            onclick="openStocks()"
        >

            Back to Watchlist

        </button>

    `);
}


/* =========================================================
   MAPS
   ========================================================= */

function openMaps() {

    openApp("Maps", `

        <h2>🗺️ Pear Maps</h2>


        <input
            id="mapSearch"
            placeholder="Search a place"
        >


        <button
            class="button"
            onclick="searchMap()"
        >

            Search

        </button>


        <div
            class="card"
            style="
                height:130px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:50px;
            "
        >

            🗺️

        </div>


        <div id="mapResults">

            <p>
                Search for a destination.
            </p>

        </div>


        <button
            class="button"
            onclick="findMe()"
        >

            📍 Find Me

        </button>

    `);
}


function searchMap() {

    const place =
        document.getElementById(
            "mapSearch"
        ).value;

    if (!place.trim()) return;

    document.getElementById(
        "mapResults"
    ).innerHTML = `

        <div class="card">

            📍 <b>${place}</b>

            <br>

            Destination found!

            <br><br>

            <button
                class="button"
                onclick="startRoute()"
            >

                🚗 Start Route

            </button>

        </div>

    `;
}


function startRoute() {

    alert(
        "Route started! 🚗"
    );
}


function findMe() {

    if (!navigator.geolocation) {

        alert("Location unavailable.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        () => {
            alert("📍 Your location was found!");
        },

        () => {
            alert(
                "Location permission was denied."
            );
        }

    );
}


/* =========================================================
   PHOTOS
   ========================================================= */

function openPhotos() {

    openApp("Photos", `

        <h2>📸 Photos</h2>


        <input
            type="file"
            accept="image/*"
            multiple
            onchange="loadPhotos(event)"
        >


        <div
            id="photoGrid"
            class="grid"
        ></div>

    `);
}


function loadPhotos(event) {

    const grid =
        document.getElementById(
            "photoGrid"
        );

    grid.innerHTML = "";

    Array.from(event.target.files)
        .forEach(file => {

            const reader =
                new FileReader();

            reader.onload = function(event) {

                grid.innerHTML += `

                    <img
                        src="${event.target.result}"
                        style="
                            width:100%;
                            aspect-ratio:1;
                            object-fit:cover;
                            border-radius:8px;
                        "
                        onclick="viewPhoto(this.src)"
                    >

                `;
            };

            reader.readAsDataURL(file);

        });
}


function viewPhoto(src) {

    openApp("Photo", `

        <img
            src="${src}"
            style="
                width:100%;
                border-radius:10px;
            "
        >


        <br><br>


        <button
            class="button"
            onclick="openPhotos()"
        >

            Back

        </button>

    `);
}


/* =========================================================
   WEATHER
   ========================================================= */

function openWeather() {

    openApp("Weather", `

        <div style="text-align:center">

            <div class="big-icon">
                ☀️
            </div>

            <h1 id="weatherTemp">
                22°C
            </h1>

            <p id="weatherCondition">
                Sunny
            </p>

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


        <button
            class="button"
            onclick="changeWeather()"
        >

            🔄 Refresh

        </button>

    `);
}


function changeWeather() {

    const weather = [

        ["☀️", "Sunny"],
        ["🌧️", "Rain"],
        ["⛅", "Cloudy"],
        ["❄️", "Snow"]

    ];

    const choice =
        weather[
            Math.floor(
                Math.random() * weather.length
            )
        ];

    const temp =
        Math.floor(
            Math.random() * 15
        ) + 10;

    const icon =
        document.querySelector(
            "#weatherTemp"
        );

    const condition =
        document.querySelector(
            "#weatherCondition"
        );

    if (condition) {
        condition.textContent =
            choice[0] + " " + choice[1];
    }

    if (icon) {
        icon.textContent =
            temp + "°C";
    }
}


/* =========================================================
   NOTES
   ========================================================= */

function openNotes() {

    const saved =
        localStorage.getItem(
            "pearNote"
        ) || "";

    openApp("Notes", `

        <h2>📝 Notes</h2>


        <input
            id="noteTitle"
            placeholder="Title"
        >


        <textarea
            id="note"
            placeholder="Write your note..."
        >${saved}</textarea>


        <button
            class="button"
            onclick="saveNote()"
        >

            💾 Save

        </button>


        <button
            class="button"
            onclick="clearNote()"
        >

            🗑 Clear

        </button>


        <p id="noteStatus"></p>

    `);
}


function saveNote() {

    const note =
        document.getElementById(
            "note"
        );

    if (!note) return;

    localStorage.setItem(
        "pearNote",
        note.value
    );

    document.getElementById(
        "noteStatus"
    ).textContent =
        "Saved! ✅";
}


function clearNote() {

    const note =
        document.getElementById(
            "note"
        );

    if (note) {
        note.value = "";
    }

    localStorage.removeItem(
        "pearNote"
    );
}


/* =========================================================
   PEARTUNES
   ========================================================= */

let audio = new Audio();


function openPearTunes() {

    openApp("PearTunes", `

        <div style="text-align:center">

            <div class="big-icon">
                🎵
            </div>


            <h2>
                PearTunes
            </h2>


            <p id="songName">
                Pear Phone Radio
            </p>


            <button
                class="button"
                onclick="playDemoSong()"
            >

                ▶️ Play

            </button>


            <button
                class="button"
                onclick="audio.pause()"
            >

                ⏸ Pause

            </button>


            <button
                class="button"
                onclick="nextSong()"
            >

                ⏭ Next

            </button>


            <br><br>


            <input
                type="file"
                accept="audio/*"
                onchange="loadMusic(event)"
            >

        </div>

    `);
}


function playDemoSong() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) {

        alert(
            "Audio is not supported."
        );

        return;
    }

    const context =
        new AudioContext();

    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();

    oscillator.type =
        "sine";

    oscillator.frequency.value =
        440;

    oscillator.connect(gain);

    gain.connect(
        context.destination
    );

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

    const songs = [

        "Pear Radio",
        "Pear Chill",
        "Pear Beats",
        "Pear FM"

    ];

    const song =
        songs[
            Math.floor(
                Math.random() *
                songs.length
            )
        ];

    const element =
        document.getElementById(
            "songName"
        );

    if (element) {
        element.textContent =
            song;
    }
}


function loadMusic(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    audio.src =
        URL.createObjectURL(file);

    const element =
        document.getElementById(
            "songName"
        );

    if (element) {
        element.textContent =
            file.name;
    }

    audio.play();
}


/* =========================================================
   SETTINGS
   ========================================================= */

function openSettings() {

    openApp("Settings", `

        <h2>⚙️ Settings</h2>


        <div class="card">

            <b>Appearance</b>

            <br><br>


            <button
                class="button"
                onclick="toggleDarkMode()"
            >

                🌙 Dark Mode

            </button>


            <button
                class="button"
                onclick="normalMode()"
            >

                ☀️ Light Mode

            </button>

        </div>


        <div class="card">

            <b>Sound</b>

            <br><br>


            <button
                class="button"
                onclick="testSound()"
            >

                🔊 Test Sound

            </button>

        </div>


        <div class="card">

            <b>Pear Phone</b>

            <br><br>


            <button
                class="button"
                onclick="resetPhone()"
            >

                🔄 Reset Data

            </button>

        </div>

    `);
}


function toggleDarkMode() {

    if (!appWindow) return;

    appWindow.style.background =
        "#181818";

    appWindow.style.color =
        "white";
}


function normalMode() {

    if (!appWindow) return;

    appWindow.style.background =
        "#f2f2f7";

    appWindow.style.color =
        "#111";
}


function testSound() {

    alert(
        "🔊 Pear Phone sound works!"
    );
}


function resetPhone() {

    localStorage.clear();

    alert(
        "Pear Phone data reset!"
    );
}


/* =========================================================
   CLOCK
   ========================================================= */

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


                <button
                    class="button"
                    onclick="startStopwatch()"
                >
                    ▶️
                </button>


                <button
                    class="button"
                    onclick="stopStopwatch()"
                >
                    ⏸
                </button>


                <button
                    class="button"
                    onclick="resetStopwatch()"
                >
                    🔄
                </button>

            </div>


            <div class="card">

                <button
                    class="button"
                    onclick="setTimer()"
                >

                    ⏱ Set Timer

                </button>

            </div>

        </div>

    `);

    updateClock();
}


function updateClock() {

    const element =
        document.getElementById(
            "clockTime"
        );

    if (!element) return;

    element.textContent =
        new Date().toLocaleTimeString();

    setTimeout(
        updateClock,
        1000
    );
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

            const display =
                document.getElementById(
                    "stopwatch"
                );

            if (!display) return;

            display.textContent =
                String(minutes)
                    .padStart(2, "0")
                +
                ":"
                +
                String(seconds)
                    .padStart(2, "0");

        }, 1000);
}


function stopStopwatch() {

    clearInterval(
        stopwatchTimer
    );

    stopwatchTimer = null;
}


function resetStopwatch() {

    stopStopwatch();

    stopwatchSeconds = 0;

    const display =
        document.getElementById(
            "stopwatch"
        );

    if (display) {

        display.textContent =
            "00:00";
    }
}


function setTimer() {

    const seconds =
        Number(
            prompt(
                "Timer length in seconds:"
            )
        );

    if (!seconds ||
        seconds <= 0) {
        return;
    }

    alert(
        "Timer started! ⏱"
    );

    setTimeout(() => {

        alert(
            "⏰ Timer finished!"
        );

    }, seconds * 1000);
}


/* =========================================================
   VIDEOS
   ========================================================= */

function openVideos() {

    openApp("Videos", `

        <h2>🎬 Videos</h2>


        <input
            type="file"
            accept="video/*"
            onchange="loadVideo(event)"
        >


        <video
            id="videoPlayer"
            controls
            style="
                width:100%;
                background:#000;
                border-radius:9px;
            "
        ></video>


        <br>


        <button
            class="button"
            onclick="fullscreenVideo()"
        >

            ⛶ Fullscreen

        </button>

    `);
}


function loadVideo(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const player =
        document.getElementById(
            "videoPlayer"
        );

    player.src =
        URL.createObjectURL(file);
}


function fullscreenVideo() {

    const video =
        document.getElementById(
            "videoPlayer"
        );

    if (video &&
        video.requestFullscreen) {

        video.requestFullscreen();
    }
}


/* =========================================================
   PHONE
   ========================================================= */

let phoneNumber = "";


function openPhone() {

    phoneNumber = "";

    openApp("Phone", `

        <h2 style="text-align:center">
            📞
        </h2>


        <h2
            id="phoneNumber"
            style="text-align:center"
        ></h2>


        <div class="grid">

            <button class="button"
                    onclick="dial('1')">
                1
            </button>

            <button class="button"
                    onclick="dial('2')">
                2
            </button>

            <button class="button"
                    onclick="dial('3')">
                3
            </button>

            <button class="button"
                    onclick="dial('4')">
                4
            </button>

            <button class="button"
                    onclick="dial('5')">
                5
            </button>

            <button class="button"
                    onclick="dial('6')">
                6
            </button>

            <button class="button"
                    onclick="dial('7')">
                7
            </button>

            <button class="button"
                    onclick="dial('8')">
                8
            </button>

            <button class="button"
                    onclick="dial('9')">
                9
            </button>

            <button class="button"
                    onclick="dial('*')">
                *
            </button>

            <button class="button"
                    onclick="dial('0')">
                0
            </button>

            <button class="button"
                    onclick="dial('#')">
                #
            </button>

        </div>


        <br>


        <button
            class="button"
            onclick="callNumber()"
        >

            📞 Call

        </button>


        <button
            class="button"
            onclick="clearNumber()"
        >

            Clear

        </button>

    `);
}


function dial(number) {

    phoneNumber += number;

    const display =
        document.getElementById(
            "phoneNumber"
        );

    if (display) {
        display.textContent =
            phoneNumber;
    }
}


function clearNumber() {

    phoneNumber = "";

    const display =
        document.getElementById(
            "phoneNumber"
        );

    if (display) {
        display.textContent = "";
    }
}


function callNumber() {

    if (!phoneNumber) {

        alert(
            "Enter a number first!"
        );

        return;
    }

    alert(
        "Calling " +
        phoneNumber +
        " 📞"
    );
}


/* =========================================================
   MAIL
   ========================================================= */

function openMail() {

    openApp("Mail", `

        <h2>
            📧 Pear Mail
        </h2>


        <div
            class="card"
            onclick="readMail()"
        >

            <b>Apple</b>

            <br>

            Your Pear Phone order shipped! 📦

        </div>


        <div
            class="card"
            onclick="readMomMail()"
        >

            <b>Mom</b>

            <br>

            Don't forget dinner ❤️

        </div>


        <div class="card">

            <b>School</b>

            <br>

            New assignment available.

        </div>


        <button
            class="button"
            onclick="composeMail()"
        >

            ✏️ Compose

        </button>

    `);
}


function readMail() {

    openApp("Mail", `

        <h2>
            📦 Order Shipped
        </h2>


        <p>
            Your Pear Phone accessories
            are officially on the way!
        </p>


        <button
            class="button"
            onclick="openMail()"
        >

            Back

        </button>

    `);
}


function readMomMail() {

    openApp("Mail", `

        <h2>
            ❤️ Mom
        </h2>


        <p>
            Don't forget dinner tonight!
        </p>


        <button
            class="button"
            onclick="openMail()"
        >

            Back

        </button>

    `);
}


function composeMail() {

    openApp("Compose", `

        <input
            placeholder="To"
        >


        <input
            placeholder="Subject"
        >


        <textarea
            placeholder="Message"
        ></textarea>


        <button
            class="button"
            onclick="alert('Email sent! 📧')"
        >

            Send

        </button>

    `);
}


/* =========================================================
   COMPASS
   ========================================================= */

function openCompass() {

    openApp("Compass", `

        <div style="text-align:center">

            <div
                id="compassIcon"
                class="big-icon"
            >
                🧭
            </div>


            <h2 id="direction">
                NORTH
            </h2>


            <button
                class="button"
                onclick="calibrateCompass()"
            >

                🧭 Calibrate

            </button>


            <button
                class="button"
                onclick="randomDirection()"
            >

                🔄 Random Direction

            </button>

        </div>

    `);
}


function calibrateCompass() {

    alert(
        "Compass calibrated! 🧭"
    );

    randomDirection();
}


function randomDirection() {

    const directions = [

        "NORTH",
        "EAST",
        "SOUTH",
        "WEST"

    ];

    const direction =
        directions[
            Math.floor(
                Math.random() *
                directions.length
            )
        ];

    const element =
        document.getElementById(
            "direction"
        );

    if (element) {

        element.textContent =
            direction;
    }
}


/* =========================================================
   PAGE 2 — LINGO
   ========================================================= */

function openLingo() {

    openApp("Lingo", `

        <h2>🌐 Lingo</h2>

        <p>
            Type a phrase to translate it.
        </p>


        <select id="lingoLanguage">

            <option value="spanish">
                Spanish
            </option>

            <option value="french">
                French
            </option>

            <option value="italian">
                Italian
            </option>

        </select>


        <input
            id="lingoInput"
            placeholder="Type something..."
        >


        <button
            class="button"
            onclick="translateLingo()"
        >

            Translate

        </button>


        <div
            id="lingoResult"
            class="card"
        >

            Translation will appear here.

        </div>

    `);
}


function translateLingo() {

    const text =
        document.getElementById(
            "lingoInput"
        ).value
        .trim()
        .toLowerCase();

    const language =
        document.getElementById(
            "lingoLanguage"
        ).value;

    const dictionary = {

        spanish: {

            hello: "Hola",
            "how are you": "¿Cómo estás?",
            thanks: "Gracias",
            goodbye: "Adiós",
            yes: "Sí",
            no: "No"

        },

        french: {

            hello: "Bonjour",
            "how are you": "Comment allez-vous?",
            thanks: "Merci",
            goodbye: "Au revoir",
            yes: "Oui",
            no: "Non"

        },

        italian: {

            hello: "Ciao",
            "how are you": "Come stai?",
            thanks: "Grazie",
            goodbye: "Arrivederci",
            yes: "Sì",
            no: "No"

        }

    };

    const result =
        dictionary[language][text] ||
        "I don't know that phrase yet.";

    document.getElementById(
        "lingoResult"
    ).textContent = result;
}


/* =========================================================
   PAGE 2 — THUMB
   ========================================================= */

let thumbScore = 0;


function openThumb() {

    thumbScore = 0;

    openApp("Thumb", `

        <div style="text-align:center">

            <div class="big-icon">
                👍
            </div>


            <h2>
                Thumb Challenge
            </h2>


            <p>
                Tap as many times as possible!
            </p>


            <h1 id="thumbScore">
                0
            </h1>


            <button
                class="button"
                style="
                    font-size:22px;
                    padding:20px;
                "
                onclick="thumbTap()"
            >

                👍 TAP!

            </button>

        </div>

    `);
}


function thumbTap() {

    thumbScore++;

    const score =
        document.getElementById(
            "thumbScore"
        );

    if (score) {

        score.textContent =
            thumbScore;
    }
}


/* =========================================================
   PAGE 2 — DANWARP
   ========================================================= */

function openDanWarp() {

    openApp("DanWarp", `

        <div
            id="warpBox"
            style="
                height:170px;
                display:flex;
                align-items:center;
                justify-content:center;
                background:
                    radial-gradient(
                        circle,
                        #744cff,
                        #111
                    );
                border-radius:12px;
                color:white;
                font-size:25px;
                transition:.4s;
            "
        >

            DANWARP

        </div>


        <br>


        <button
            class="button"
            onclick="activateWarp()"
        >

            🌀 Warp

        </button>


        <button
            class="button"
            onclick="resetWarp()"
        >

            Reset

        </button>

    `);
}


function activateWarp() {

    const box =
        document.getElementById(
            "warpBox"
        );

    if (!box) return;

    box.style.transform =
        "perspective(300px) rotateX(25deg) rotateY(35deg) scale(1.2)";

    box.textContent =
        "🌀 WARPED!";
}


function resetWarp() {

    const box =
        document.getElementById(
            "warpBox"
        );

    if (!box) return;

    box.style.transform =
        "none";

    box.textContent =
        "DANWARP";
}


/* =========================================================
   PAGE 2 — ZAPLOOK
   ========================================================= */

function openZapLook() {

    openApp("ZapLook", `

        <div style="text-align:center">

            <div
                class="big-icon"
                id="zapEmoji"
            >
                👀
            </div>


            <h2>
                ZapLook
            </h2>


            <p id="zapText">

                What will ZapLook find?

            </p>


            <button
                class="button"
                onclick="zapLook()"
            >

                ⚡ ZAP!

            </button>

        </div>

    `);
}


function zapLook() {

    const things = [

        "🍕 Pizza detected!",
        "🐱 Cat detected!",
        "🏖️ Beach detected!",
        "🍐 Pear detected!",
        "🎮 Gaming detected!",
        "🚗 Car detected!",
        "⭐ Something interesting!",
        "😂 Meme detected!"

    ];

    const result =
        things[
            Math.floor(
                Math.random() *
                things.length
            )
        ];

    const text =
        document.getElementById(
            "zapText"
        );

    if (text) {

        text.textContent =
            result;
    }
}


/* =========================================================
   PAGE 2 — CONNECT ALL APPS
   ========================================================= */

function connectPage2Apps() {

    const connections = {

        "p2-lingo":
            openLingo,

        "p2-splash":
            openSplashFace,

        "p2-thumb":
            openThumb,

        "p2-danwarp":
            openDanWarp,

        "p2-image":
            openCamera,

        "p2-chrono":
            openClock,

        "p2-zaplook":
            openZapLook,

        "p2-weather":
            openWeather,

        "p2-music":
            openPearTunes,

        "p2-monkey":
            openPhotos,

        "p2-remark":
            openNotes,

        "p2-settings":
            openSettings,

        "p2-phone":
            openPhone,

        "p2-mail":
            openMail,

        "p2-compass":
            openCompass,

        "p2-music2":
            openPearTunes

    };


    Object.keys(connections)
        .forEach(id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.onclick =
                    connections[id];
            }

        });
}


/* =========================================================
   CONNECT PAGE 1 APPS
   ========================================================= */

function connectPage1Apps() {

    const connections = {

        messages:
            openMessages,

        camera:
            openCamera,

        splashface:
            openSplashFace,

        stocks:
            openStocks,

        maps:
            openMaps,

        photos:
            openPhotos,

        weather:
            openWeather,

        notes:
            openNotes,

        peartunes:
            openPearTunes,

        settings:
            openSettings,

        clock:
            openClock,

        videos:
            openVideos,

        phone:
            openPhone,

        mail:
            openMail,

        compass:
            openCompass,

        music:
            openPearTunes

    };


    Object.keys(connections)
        .forEach(id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.onclick =
                    connections[id];
            }

        });


    const home =
        document.getElementById(
            "home"
        );

    if (home) {

        home.onclick = function() {

            closeApp();

            showPage(1);

        };

    }
}


/* =========================================================
   STARTUP
   ========================================================= */

connectPage1Apps();
connectPage2Apps();

showPage(1);
