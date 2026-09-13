document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const overlay = document.getElementById("overlay");
    const appWindow = document.getElementById("app-window");

    let cameraStream = null;
    let musicAudio = null;
    let stopwatchInterval = null;
    let stopwatchStart = 0;
    let stopwatchElapsed = 0;
    let timerInterval = null;
    let timerSeconds = 0;


    /* =========================================================
       GENERAL HELPERS
       ========================================================= */

    function openApp(title, content) {
        appWindow.innerHTML = `
            <div class="window-header">
                <button class="back" id="backButton">‹</button>
                <span>${escapeHTML(title)}</span>
            </div>

            <div class="window-body">
                ${content}
            </div>
        `;

        overlay.classList.add("open");

        document.getElementById("backButton").onclick = closeApp;
    }


    function closeApp() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }

        overlay.classList.remove("open");
        appWindow.innerHTML = "";
    }


    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeApp();
        }
    });


    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char]));
    }


    function getJSON(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? fallback;
        } catch {
            return fallback;
        }
    }


    function saveJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }


    /* =========================================================
       MESSAGES
       ========================================================= */

    document.getElementById("messages").onclick = () => {
        const messages = getJSON("pearMessages", []);

        openApp(
            "Messages",
            `
                <div id="messageList">

                    <div class="bubble">
                        hey 👋
                    </div>

                    <div class="bubble">
                        welcome to Pear Phone OS 🍐
                    </div>

                    ${
                        messages.map(msg => `
                            <div class="bubble me">
                                ${escapeHTML(msg.text)}
                                <div style="
                                    font-size:10px;
                                    opacity:.7;
                                    margin-top:3px;">
                                    ${escapeHTML(msg.time)}
                                </div>
                            </div>
                        `).join("")
                    }

                </div>

                <div style="
                    display:flex;
                    gap:7px;
                    margin-top:12px;">

                    <input
                        id="messageInput"
                        placeholder="iMessage"
                        style="flex:1">

                    <button
                        class="button"
                        id="sendMessage">
                        Send
                    </button>

                </div>

                <div style="height:10px"></div>

                <button
                    class="button"
                    id="clearMessages">
                    Clear Messages
                </button>
            `
        );


        const send = () => {
            const input = document.getElementById("messageInput");
            const text = input.value.trim();

            if (!text) return;

            messages.push({
                text,
                time: new Date().toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit"
                })
            });

            saveJSON("pearMessages", messages.slice(-100));

            document.getElementById("messages").click();
        };


        document.getElementById("sendMessage").onclick = send;


        document.getElementById("messageInput")
            .addEventListener("keydown", event => {
                if (event.key === "Enter") {
                    send();
                }
            });


        document.getElementById("clearMessages").onclick = () => {
            localStorage.removeItem("pearMessages");
            document.getElementById("messages").click();
        };
    };


    /* =========================================================
       CAMERA
       ========================================================= */

    document.getElementById("camera").onclick = () => {
        openApp(
            "Camera",
            `
                <video
                    id="cameraVideo"
                    class="camera-video"
                    autoplay
                    playsinline>
                </video>

                <div style="
                    display:flex;
                    gap:7px;
                    flex-wrap:wrap;
                    margin-top:10px;">

                    <button
                        class="button"
                        id="startCamera">
                        Start Camera
                    </button>

                    <button
                        class="button"
                        id="switchCamera">
                        Flip Camera
                    </button>

                    <button
                        class="button"
                        id="takePhoto">
                        Take Photo
                    </button>

                </div>

                <canvas
                    id="cameraCanvas"
                    style="display:none">
                </canvas>

                <img
                    id="capturedPhoto"
                    style="
                        display:none;
                        width:100%;
                        margin-top:10px;
                        border-radius:18px;">
            `
        );


        const video = document.getElementById("cameraVideo");
        const canvas = document.getElementById("cameraCanvas");
        const photo = document.getElementById("capturedPhoto");

        let facingMode = "environment";


        async function startCamera() {
            try {
                if (cameraStream) {
                    cameraStream.getTracks().forEach(track => track.stop());
                }

                cameraStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode
                        },
                        audio: false
                    });

                video.srcObject = cameraStream;
            } catch (error) {
                console.error(error);

                alert(
                    "Camera access was denied. Allow Camera access in your browser."
                );
            }
        }


        document.getElementById("startCamera").onclick =
            startCamera;


        document.getElementById("switchCamera").onclick = async () => {
            facingMode =
                facingMode === "environment"
                    ? "user"
                    : "environment";

            await startCamera();
        };


        document.getElementById("takePhoto").onclick = () => {
            if (!video.videoWidth) {
                alert("Start the camera first.");
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            canvas
                .getContext("2d")
                .drawImage(video, 0, 0);

            const image =
                canvas.toDataURL("image/jpeg", 0.92);

            photo.src = image;
            photo.style.display = "block";

            const photos = getJSON("pearPhotos", []);

            photos.unshift({
                image,
                time: Date.now()
            });

            saveJSON(
                "pearPhotos",
                photos.slice(0, 50)
            );
        };


        startCamera();
    };


    /* =========================================================
       PHOTOS
       ========================================================= */

    document.getElementById("photos").onclick = () => {
        const photos = getJSON("pearPhotos", []);

        openApp(
            "Photos",
            `
                <input
                    type="file"
                    id="photoImport"
                    accept="image/*"
                    multiple>

                <div style="height:12px"></div>

                <div
                    class="photo-grid"
                    id="photoGrid">

                    ${
                        photos.length
                        ?
                        photos.map((photo, index) => `
                            <div style="position:relative">
                                <img
                                    src="${photo.image}"
                                    data-photo="${index}"
                                    style="cursor:pointer">

                                <button
                                    data-delete-photo="${index}"
                                    style="
                                        position:absolute;
                                        right:4px;
                                        top:4px;
                                        width:24px;
                                        height:24px;
                                        border:0;
                                        border-radius:50%;
                                        background:rgba(0,0,0,.65);
                                        color:#fff;">
                                    ×
                                </button>
                            </div>
                        `).join("")
                        :
                        `
                            <div
                                style="
                                grid-column:1/-1;
                                text-align:center;
                                padding:35px;
                                color:#777;">
                                No photos yet.
                            </div>
                        `
                    }

                </div>

                <div
                    id="fullscreenPhoto"
                    style="
                        display:none;
                        position:fixed;
                        inset:0;
                        background:rgba(0,0,0,.9);
                        z-index:3000;
                        align-items:center;
                        justify-content:center;
                        padding:20px;">

                    <img
                        id="fullImage"
                        style="
                            max-width:100%;
                            max-height:90%;
                            object-fit:contain;
                            border-radius:12px;">
                </div>
            `
        );


        document.getElementById("photoImport").onchange =
            async event => {

                const files =
                    Array.from(event.target.files);

                const imported =
                    await Promise.all(
                        files.map(
                            file =>
                                new Promise(resolve => {
                                    const reader =
                                        new FileReader();

                                    reader.onload =
                                        () => resolve({
                                            image: reader.result,
                                            time: Date.now()
                                        });

                                    reader.readAsDataURL(file);
                                })
                        )
                    );

                saveJSON(
                    "pearPhotos",
                    [...imported, ...photos].slice(0, 50)
                );

                document.getElementById("photos").click();
            };


        document
            .querySelectorAll("[data-delete-photo]")
            .forEach(button => {

                button.onclick = event => {
                    event.stopPropagation();

                    const index =
                        Number(
                            button.dataset.deletePhoto
                        );

                    photos.splice(index, 1);

                    saveJSON("pearPhotos", photos);

                    document
                        .getElementById("photos")
                        .click();
                };
            });


        const fullScreen =
            document.getElementById("fullscreenPhoto");

        const fullImage =
            document.getElementById("fullImage");


        document
            .querySelectorAll("[data-photo]")
            .forEach(image => {

                image.onclick = () => {

                    fullImage.src = image.src;

                    fullScreen.style.display =
                        "flex";
                };
            });


        fullScreen.onclick = () => {
            fullScreen.style.display = "none";
        };
    };


    /* =========================================================
       NOTES
       ========================================================= */

    document.getElementById("notes").onclick = () => {
        const notes = getJSON("pearNotes", []);

        openApp(
            "Notes",
            `
                <div style="margin-bottom:12px">

                    ${
                        notes.map((note, index) => `
                            <div
                                class="stock"
                                data-note="${index}"
                                style="cursor:pointer">

                                <div>
                                    <strong>
                                        ${escapeHTML(note.title)}
                                    </strong>

                                    <br>

                                    <small>
                                        ${escapeHTML(
                                            note.body.slice(0, 80)
                                        )}
                                    </small>
                                </div>

                            </div>
                        `).join("")
                    }

                    ${
                        notes.length === 0
                        ?
                        `<div style="color:#777;margin-bottom:12px">
                            No notes yet.
                        </div>`
                        : ""
                    }

                </div>

                <input
                    id="noteTitle"
                    placeholder="Title"
                    style="margin-bottom:8px">

                <textarea
                    id="noteBody"
                    placeholder="Write something..."></textarea>

                <br><br>

                <button
                    class="button"
                    id="saveNote">
                    Save Note
                </button>
            `
        );


        document
            .querySelectorAll("[data-note]")
            .forEach(card => {

                card.onclick = () => {

                    const note =
                        notes[
                            Number(card.dataset.note)
                        ];

                    document.getElementById(
                        "noteTitle"
                    ).value = note.title;

                    document.getElementById(
                        "noteBody"
                    ).value = note.body;
                };
            });


        document.getElementById("saveNote").onclick = () => {

            const title =
                document.getElementById("noteTitle")
                    .value.trim();

            const body =
                document.getElementById("noteBody")
                    .value.trim();

            if (!title && !body) return;

            notes.unshift({
                title: title || "Untitled",
                body
            });

            saveJSON(
                "pearNotes",
                notes.slice(0, 100)
            );

            document
                .getElementById("notes")
                .click();
        };
    };


    /* =========================================================
       STOCKS
       ========================================================= */

    document.getElementById("stocks").onclick = () => {
        openApp(
            "Stocks",
            `
                <div class="stock">
                    <span>
                        <b>AAPL</b><br>
                        Apple
                    </span>

                    <span style="text-align:right">
                        <b>$229.87</b><br>
                        <small style="color:#09983d">
                            +1.8%
                        </small>
                    </span>
                </div>

                <div class="stock">
                    <span>
                        <b>MSFT</b><br>
                        Microsoft
                    </span>

                    <span style="text-align:right">
                        <b>$532.44</b><br>
                        <small style="color:#09983d">
                            +0.9%
                        </small>
                    </span>
                </div>

                <div class="stock">
                    <span>
                        <b>TSLA</b><br>
                        Tesla
                    </span>

                    <span style="text-align:right">
                        <b>$318.26</b><br>
                        <small style="color:#d92727">
                            -1.2%
                        </small>
                    </span>
                </div>

                <div class="stock">
                    <span>
                        <b>PEAR</b><br>
                        Pear Inc.
                    </span>

                    <span style="text-align:right">
                        <b>$99.99</b><br>
                        <small style="color:#09983d">
                            +4.2%
                        </small>
                    </span>
                </div>

                <p style="
                    color:#777;
                    font-size:12px;
                    text-align:center;">
                    Demo market data
                </p>
            `
        );
    };


    /* =========================================================
       MAPS
       ========================================================= */

    document.getElementById("maps").onclick = () => {

        openApp(
            "Maps",
            `
                <div
                    style="
                    height:230px;
                    border-radius:18px;
                    background:
                        linear-gradient(
                            130deg,
                            #d3e4c7,
                            #e8dfbd
                        );
                    position:relative;
                    overflow:hidden;">

                    <div style="
                        position:absolute;
                        width:140%;
                        height:8px;
                        background:white;
                        top:53%;
                        left:-20%;
                        transform:rotate(-25deg);
                        box-shadow:0 0 0 1px #bbb;">
                    </div>

                    <div style="
                        position:absolute;
                        left:55%;
                        top:40%;
                        font-size:50px;">
                        📍
                    </div>

                </div>

                <h3>
                    Pear Park
                </h3>

                <p>
                    Explore the map or use your current location.
                </p>

                <button
                    class="button"
                    id="myLocation">
                    Use My Location
                </button>

                <p
                    id="locationResult"
                    style="color:#777;">
                </p>
            `
        );


        document
            .getElementById("myLocation")
            .onclick = () => {

                const result =
                    document.getElementById(
                        "locationResult"
                    );

                if (!navigator.geolocation) {
                    result.textContent =
                        "Geolocation isn't supported.";
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    position => {

                        result.textContent =
                            `Latitude: ${
                                position.coords.latitude.toFixed(5)
                            } · Longitude: ${
                                position.coords.longitude.toFixed(5)
                            }`;
                    },

                    () => {

                        result.textContent =
                            "Location permission was denied.";
                    }
                );
            };
    };


    /* =========================================================
       WEATHER
       ========================================================= */

    document.getElementById("weather").onclick = () => {

        openApp(
            "Weather",
            `
                <div style="
                    text-align:center;
                    padding:10px;">

                    <div style="font-size:75px">
                        ☀️
                    </div>

                    <div style="
                        font-size:60px;
                        font-weight:900;">
                        24°
                    </div>

                    <h3>
                        Sunny
                    </h3>

                    <p>
                        Feels like 25°
                    </p>

                </div>

                <div class="stock">
                    <span>9 AM</span>
                    <span>21° ☀️</span>
                </div>

                <div class="stock">
                    <span>12 PM</span>
                    <span>24° ☀️</span>
                </div>

                <div class="stock">
                    <span>3 PM</span>
                    <span>26° 🌤️</span>
                </div>

                <div class="stock">
                    <span>6 PM</span>
                    <span>23° 🌇</span>
                </div>
            `
        );
    };


    /* =========================================================
       CLOCK — CLOCK / STOPWATCH / TIMER
       ========================================================= */

    document.getElementById("clock").onclick = () => {

        openApp(
            "Clock",
            `
                <div
                    id="clockTabs"
                    style="
                    display:flex;
                    gap:5px;
                    margin-bottom:15px;">

                    <button
                        class="button"
                        data-tab="clock">
                        Clock
                    </button>

                    <button
                        class="button"
                        data-tab="stopwatch">
                        Stopwatch
                    </button>

                    <button
                        class="button"
                        data-tab="timer">
                        Timer
                    </button>

                </div>

                <div id="clockArea"></div>
            `
        );


        const area =
            document.getElementById("clockArea");


        function showClock() {

            area.innerHTML = `
                <div style="
                    text-align:center;
                    font-size:48px;
                    font-weight:900;
                    padding:25px 0;"
                    id="digitalClock">
                </div>

                <p style="
                    text-align:center;
                    color:#777;">
                    Local time
                </p>
            `;

            function tick() {
                const clock =
                    document.getElementById(
                        "digitalClock"
                    );

                if (!clock) return;

                clock.textContent =
                    new Date().toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit"
                    });
            }

            tick();

            const interval =
                setInterval(tick, 1000);

            setTimeout(
                () => clearInterval(interval),
                3600000
            );
        }


        function showStopwatch() {

            clearInterval(stopwatchInterval);

            area.innerHTML = `
                <div
                    id="stopwatchDisplay"
                    style="
                    text-align:center;
                    font-size:48px;
                    font-weight:900;
                    padding:25px 0;">
                    00:00.0
                </div>

                <div
                    style="
                    display:flex;
                    justify-content:center;
                    gap:8px;">

                    <button
                        class="button"
                        id="swStart">
                        Start
                    </button>

                    <button
                        class="button"
                        id="swStop">
                        Stop
                    </button>

                    <button
                        class="button"
                        id="swReset">
                        Reset
                    </button>

                </div>
            `;


            let running = false;


            function formatStopwatch(ms) {

                const minutes =
                    Math.floor(ms / 60000);

                const seconds =
                    Math.floor(
                        (ms % 60000) / 1000
                    );

                const tenths =
                    Math.floor(
                        (ms % 1000) / 100
                    );

                return `${
                    String(minutes).padStart(2,"0")
                }:${
                    String(seconds).padStart(2,"0")
                }.${
                    tenths
                }`;
            }


            function update() {

                const display =
                    document.getElementById(
                        "stopwatchDisplay"
                    );

                if (!display) return;

                const now =
                    Date.now();

                const total =
                    stopwatchElapsed +
                    (running
                        ? now - stopwatchStart
                        : 0);

                display.textContent =
                    formatStopwatch(total);
            }


            document.getElementById("swStart").onclick =
                () => {

                    if (running) return;

                    running = true;

                    stopwatchStart =
                        Date.now();

                    stopwatchInterval =
                        setInterval(
                            update,
                            100
                        );
                };


            document.getElementById("swStop").onclick =
                () => {

                    if (!running) return;

                    stopwatchElapsed +=
                        Date.now() -
                        stopwatchStart;

                    running = false;

                    clearInterval(
                        stopwatchInterval
                    );

                    update();
                };


            document.getElementById("swReset").onclick =
                () => {

                    running = false;

                    clearInterval(
                        stopwatchInterval
                    );

                    stopwatchElapsed = 0;

                    update();
                };
        }


        function showTimer() {

            clearInterval(timerInterval);

            area.innerHTML = `
                <div
                    id="timerDisplay"
                    style="
                    text-align:center;
                    font-size:48px;
                    font-weight:900;
                    padding:25px 0;">
                    01:00
                </div>

                <div
                    style="
                    display:flex;
                    gap:7px;
                    justify-content:center;">

                    <input
                        id="timerMinutes"
                        type="number"
                        min="0"
                        value="1"
                        style="width:80px">

                    <input
                        id="timerSeconds"
                        type="number"
                        min="0"
                        max="59"
                        value="0"
                        style="width:80px">

                </div>

                <br>

                <div
                    style="
                    display:flex;
                    justify-content:center;
                    gap:7px;">

                    <button
                        class="button"
                        id="timerStart">
                        Start
                    </button>

                    <button
                        class="button"
                        id="timerStop">
                        Stop
                    </button>

                </div>
            `;


            function renderTimer() {

                const minutes =
                    Math.floor(
                        timerSeconds / 60
                    );

                const seconds =
                    timerSeconds % 60;

                const display =
                    document.getElementById(
                        "timerDisplay"
                    );

                if (!display) return;

                display.textContent =
                    `${String(minutes).padStart(2,"0")}:${
                        String(seconds).padStart(2,"0")
                    }`;
            }


            document.getElementById("timerStart").onclick =
                () => {

                    clearInterval(timerInterval);

                    timerSeconds =
                        Number(
                            document.getElementById(
                                "timerMinutes"
                            ).value
                        ) * 60
                        +
                        Number(
                            document.getElementById(
                                "timerSeconds"
                            ).value
                        );

                    renderTimer();


                    timerInterval =
                        setInterval(
                            () => {

                                if (timerSeconds <= 0) {

                                    clearInterval(
                                        timerInterval
                                    );

                                    alert(
                                        "⏰ Timer finished!"
                                    );

                                    return;
                                }

                                timerSeconds--;

                                renderTimer();

                            },
                            1000
                        );
                };


            document.getElementById("timerStop").onclick =
                () => {
                    clearInterval(timerInterval);
                };


            renderTimer();
        }


        document
            .querySelectorAll("[data-tab]")
            .forEach(button => {

                button.onclick = () => {

                    switch(button.dataset.tab) {

                        case "clock":
                            showClock();
                            break;

                        case "stopwatch":
                            showStopwatch();
                            break;

                        case "timer":
                            showTimer();
                            break;
                    }
                };
            });


        showClock();
    };


    /* =========================================================
       SETTINGS
       ========================================================= */

    document.getElementById("settings").onclick = () => {

        openApp(
            "Settings",
            `
                <div class="stock">
                    <span>
                        Dark Display
                    </span>

                    <input
                        id="darkToggle"
                        type="checkbox">
                </div>

                <div class="stock">
                    <span>
                        Sound Effects
                    </span>

                    <input
                        id="soundToggle"
                        type="checkbox"
                        checked>
                </div>

                <div class="stock">
                    <span>
                        Large Icons
                    </span>

                    <input
                        id="largeIcons"
                        type="checkbox">
                </div>

                <br>

                <button
                    class="button"
                    id="resetPhone">
                    Reset Pear OS
                </button>
            `
        );


        document.getElementById("darkToggle").onchange =
            event => {

                document.body.style.filter =
                    event.target.checked
                        ? "brightness(.78)"
                        : "";
            };


        document.getElementById("largeIcons").onchange =
            event => {

                document.body.style.setProperty(
                    "--pear-scale",
                    event.target.checked
                        ? "1.08"
                        : "1"
                );

                const icons =
                    document.querySelectorAll(
                        ".hotspot"
                    );

                icons.forEach(icon => {

                    icon.style.transform =
                        event.target.checked
                            ? "scale(1.08)"
                            : "";

                });
            };


        document.getElementById("resetPhone").onclick =
            () => {

                localStorage.clear();

                location.reload();
            };
    };


    /* =========================================================
       MUSIC PLAYER — REAL AUDIO
       ========================================================= */

    function openMusicPlayer() {

        const savedTracks =
            getJSON("pearMusicTracks", []);

        openApp(
            "PearTunes",
            `
                <div
                    style="
                    text-align:center;
                    padding:10px 0 15px;">

                    <div style="
                        font-size:65px;
                        color:#df3caf;">
                        ♫
                    </div>

                    <h2>
                        PearTunes
                    </h2>

                    <div
                        id="nowPlaying"
                        style="color:#777;">
                        Nothing playing
                    </div>

                </div>


                <audio
                    id="audioPlayer"
                    controls
                    style="width:100%;">
                </audio>


                <br>


                <input
                    type="file"
                    id="musicFiles"
                    accept="audio/*"
                    multiple>


                <div style="height:12px"></div>


                <div id="playlist">

                    ${
                        savedTracks.length

                        ?

                        savedTracks.map(
                            (track,index) => `

                                <div
                                    class="stock"
                                    data-track="${index}"
                                    style="
                                    cursor:pointer;">

                                    <span>
                                        ${escapeHTML(track.name)}
                                    </span>

                                    <button
                                        class="button"
                                        data-remove-track="${index}">
                                        ×
                                    </button>

                                </div>

                            `
                        ).join("")

                        :

                        `
                            <div
                                style="
                                text-align:center;
                                color:#777;
                                padding:20px;">
                                Choose audio files above
                                to create your playlist.
                            </div>
                        `
                    }

                </div>


                <div
                    style="
                    display:flex;
                    justify-content:center;
                    gap:8px;
                    margin-top:10px;">

                    <button
                        class="button"
                        id="previousTrack">
                        ◀◀
                    </button>

                    <button
                        class="button"
                        id="playPause">
                        ▶ / ❚❚
                    </button>

                    <button
                        class="button"
                        id="nextTrack">
                        ▶▶
                    </button>

                </div>
            `
        );


        const audio =
            document.getElementById(
                "audioPlayer"
            );

        const nowPlaying =
            document.getElementById(
                "nowPlaying"
            );


        /*
          Browser storage cannot reliably hold arbitrary
          audio files forever, so local selected files are
          represented by temporary browser URLs for the
          current session.
        */

        const sessionTracks = savedTracks.map(track => ({
            ...track,
            url: track.url
        }));

        let currentTrack = 0;


        function loadTrack(index, autoPlay = false) {

            if (
                !sessionTracks.length
            ) {

                nowPlaying.textContent =
                    "Choose music above";

                return;
            }


            currentTrack =
                (index + sessionTracks.length)
                % sessionTracks.length;


            const track =
                sessionTracks[currentTrack];


            audio.src =
                track.url;


            nowPlaying.textContent =
                track.name;


            if (autoPlay) {

                audio.play().catch(
                    () => {}
                );
            }
        }


        document
            .getElementById("musicFiles")
            .onchange = event => {

                const files =
                    Array.from(
                        event.target.files
                    );


                files.forEach(file => {

                    const url =
                        URL.createObjectURL(file);


                    sessionTracks.push({
                        name:file.name,
                        url
                    });

                });


                if (
                    sessionTracks.length === files.length
                ) {

                    loadTrack(0);

                }
            };


        document
            .getElementById("playPause")
            .onclick = () => {

                if (!audio.src) {

                    if (sessionTracks.length) {
                        loadTrack(0);
                    }

                    return;
                }


                if (audio.paused) {

                    audio.play().catch(
                        () => {}
                    );

                } else {

                    audio.pause();

                }
            };


        document
            .getElementById("nextTrack")
            .onclick = () => {

                loadTrack(
                    currentTrack + 1,
                    true
                );
            };


        document
            .getElementById("previousTrack")
            .onclick = () => {

                loadTrack(
                    currentTrack - 1,
                    true
                );
            };


        audio.onended = () => {

            if (sessionTracks.length) {

                loadTrack(
                    currentTrack + 1,
                    true
                );
            }
        };


        windowBox
            .querySelectorAll("[data-track]")
            .forEach(element => {

                element.onclick = event => {

                    if (
                        event.target.closest(
                            "[data-remove-track]"
                        )
                    ) {
                        return;
                    }

                    loadTrack(
                        Number(
                            element.dataset.track
                        ),
                        true
                    );
                };
            });


        windowBox
            .querySelectorAll(
                "[data-remove-track]"
            )
            .forEach(button => {

                button.onclick = event => {

                    event.stopPropagation();

                    const index =
                        Number(
                            button
                                .dataset
                                .removeTrack
                        );

                    sessionTracks.splice(
                        index,
                        1
                    );

                    button
                        .closest(".stock")
                        ?.remove();

                    if (!sessionTracks.length) {

                        audio.pause();
                        audio.removeAttribute(
                            "src"
                        );

                        nowPlaying.textContent =
                            "Nothing playing";

                    }
                };
            });


        /*
          This stores track names only. The actual audio
          remains local to the browser session.
        */

        saveJSON(
            "pearMusicTracks",
            sessionTracks.map(track => ({
                name:track.name
            }))
        );
    }


    document.getElementById("peartunes").onclick =
        openMusicPlayer;

    document.getElementById("music").onclick =
        openMusicPlayer;


    /* =========================================================
       PHONE
       ========================================================= */

    document.getElementById("phone").onclick = () => {

        let number = "";

        openApp(
            "Phone",
            `
                <div
                    id="phoneNumber"
                    style="
                    text-align:center;
                    font-size:30px;
                    padding:14px;
                    min-height:65px;">
                </div>

                <div
                    style="
                    display:grid;
                    grid-template-columns:
                        repeat(3,1fr);
                    gap:8px;">

                    ${[
                        "1","2","3",
                        "4","5","6",
                        "7","8","9",
                        "*","0","#"
                    ].map(key => `
                        <button
                            class="button"
                            data-key="${key}"
                            style="font-size:20px;">
                            ${key}
                        </button>
                    `).join("")}

                </div>

                <br>

                <div
                    style="
                    display:flex;
                    justify-content:center;
                    gap:8px;">

                    <button
                        class="button"
                        id="call">
                        ☎ Call
                    </button>

                    <button
                        class="button"
                        id="clearNumber">
                        Clear
                    </button>

                </div>
            `
        );


        const display =
            document.getElementById(
                "phoneNumber"
            );


        document
            .querySelectorAll("[data-key]")
            .forEach(button => {

                button.onclick = () => {

                    if (number.length >= 20)
                        return;

                    number +=
                        button.dataset.key;

                    display.textContent =
                        number;
                };
            });


        document.getElementById(
            "clearNumber"
        ).onclick = () => {

            number = "";

            display.textContent = "";
        };


        document.getElementById("call").onclick =
            () => {

                if (!number) {
                    alert("Enter a number first.");
                    return;
                }

                alert(
                    `Calling ${number}…\n\n`
                    +
                    "Real cellular calling is not available to a normal web page."
                );
            };
    };


    /* =========================================================
       MAIL
       ========================================================= */

    document.getElementById("mail").onclick = () => {

        const emails =
            getJSON("pearEmails", []);


        openApp(
            "Mail",
            `
                <button
                    class="button"
                    id="compose">
                    ✎ Compose
                </button>

                <div style="height:12px"></div>

                ${
                    emails.length

                    ?

                    emails
                        .map(
                            email => `

                                <div class="stock">

                                    <div>

                                        <strong>
                                            ${escapeHTML(email.subject)}
                                        </strong>

                                        <br>

                                        <small>
                                            ${escapeHTML(email.to)}
                                        </small>

                                    </div>

                                </div>

                            `
                        )
                        .join("")

                    :

                    `
                        <div
                            style="
                            text-align:center;
                            color:#777;
                            padding:30px;">
                            Your inbox is empty.
                        </div>
                    `
                }
            `
        );


        document
            .getElementById("compose")
            .onclick = () => {

                openApp(
                    "New Message",
                    `
                        <input
                            id="emailTo"
                            placeholder="To">

                        <br><br>

                        <input
                            id="emailSubject"
                            placeholder="Subject">

                        <br><br>

                        <textarea
                            id="emailBody"
                            placeholder="Write your message..."
                            style="width:100%;height:180px">
                        </textarea>

                        <br><br>

                        <button
                            class="button"
                            id="sendEmail">
                            Send
                        </button>
                    `
                );


                document
                    .getElementById(
                        "sendEmail"
                    )
                    .onclick = () => {

                        const to =
                            document
                                .getElementById("emailTo")
                                .value
                                .trim();

                        const subject =
                            document
                                .getElementById(
                                    "emailSubject"
                                )
                                .value
                                .trim();

                        if (!to || !subject) {

                            alert(
                                "Enter a recipient and subject."
                            );

                            return;
                        }


                        emails.unshift({
                            to,
                            subject,
                            body:
                                document
                                    .getElementById(
                                        "emailBody"
                                    )
                                    .value
                        });


                        saveJSON(
                            "pearEmails",
                            emails.slice(0,50)
                        );


                        alert(
                            "Saved as a local Pear Mail message."
                        );


                        closeApp();
                    };
            };
    };


    /* =========================================================
       COMPASS
       ========================================================= */

    document.getElementById("compass").onclick = async () => {

        openApp(
            "Compass",
            `
                <div
                    style="
                    text-align:center;
                    padding:20px;">

                    <div
                        id="compassNeedle"
                        style="
                            width:170px;
                            height:170px;
                            margin:auto;

                            border-radius:50%;

                            background:
                                radial-gradient(
                                    circle,
                                    #eee,
                                    #999
                                );

                            border:
                                4px solid #333;

                            display:flex;
                            align-items:center;
                            justify-content:center;

                            font-size:75px;

                            transition:
                                transform .15s linear;
                        ">
                        🧭
                    </div>

                    <h2 id="direction">
                        North
                    </h2>

                    <p
                        id="degrees"
                        style="color:#777">
                        0°
                    </p>

                    <button
                        class="button"
                        id="enableCompass">
                        Enable Motion
                    </button>

                </div>
            `
        );


        function handleOrientation(event) {

            const heading =
                event.webkitCompassHeading ??
                (
                    typeof event.alpha === "number"
                        ? 360 - event.alpha
                        : 0
                );


            const needle =
                document.getElementById(
                    "compassNeedle"
                );

            const degrees =
                document.getElementById(
                    "degrees"
                );

            const direction =
                document.getElementById(
                    "direction"
                );


            if (!needle) return;


            needle.style.transform =
                `rotate(${-heading}deg)`;


            degrees.textContent =
                `${Math.round(heading)}°`;


            const directions =
                [
                    "North",
                    "North-East",
                    "East",
                    "South-East",
                    "South",
                    "South-West",
                    "West",
                    "North-West"
                ];


            direction.textContent =
                directions[
                    Math.round(
                        heading / 45
                    ) % 8
                ];
        }


        document
            .getElementById(
                "enableCompass"
            )
            .onclick = async () => {

                try {

                    if (
                        typeof DeviceOrientationEvent !==
                        "undefined" &&
                        typeof DeviceOrientationEvent.requestPermission ===
                        "function"
                    ) {

                        const permission =
                            await DeviceOrientationEvent
                                .requestPermission();

                        if (
                            permission !== "granted"
                        ) {

                            alert(
                                "Motion permission was denied."
                            );

                            return;
                        }
                    }


                    window.addEventListener(
                        "deviceorientation",
                        handleOrientation,
                        true
                    );


                    document
                        .getElementById(
                            "enableCompass"
                        )
                        .textContent =
                        "Compass Enabled";

                }
                catch {

                    alert(
                        "Compass motion isn't available in this browser."
                    );
                }
            };
    };


    /* =========================================================
       VIDEOS
       ========================================================= */

    document.getElementById("videos").onclick = () => {

        openApp(
            "Videos",

            `
                <input
                    type="file"
                    id="videoFiles"
                    accept="video/*"
                    multiple>

                <div style="height:12px"></div>

                <div
                    id="videoList"
                    style="display:grid;gap:10px;">
                </div>
            `
        );


        document
            .getElementById("videoFiles")
            .onchange = event => {

                const files =
                    Array.from(
                        event.target.files
                    );

                const list =
                    document.getElementById(
                        "videoList"
                    );

                list.innerHTML = "";

                files.forEach(file => {

                    const video =
                        document.createElement(
                            "video"
                        );

                    video.controls = true;

                    video.playsInline = true;

                    video.style.width = "100%";

                    video.style.borderRadius =
                        "18px";

                    video.src =
                        URL.createObjectURL(
                            file
                        );

                    list.appendChild(video);
                });
            };
    };


    /* =========================================================
       HOME
       ========================================================= */

    document.getElementById("home").onclick =
        closeApp;

});
