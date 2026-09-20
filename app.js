/* =========================================================
   PEAR PHONE OS
   COMPLETE APP ENGINE
========================================================= */

"use strict";

/* =========================================================
   GLOBAL ELEMENTS
========================================================= */

const phone = document.getElementById("phone-container");
const overlay = document.getElementById("overlay");
const appWindow = document.getElementById("app-window");

let currentApp = null;
let currentPage = 1;

let activeInput = null;
let keyboard = null;

let pointerStartX = 0;
let pointerStartY = 0;
let pointerDownTime = 0;

let stopwatchInterval = null;
let chronoInterval = null;
let musicInterval = null;
let monkeyInterval = null;

let stopwatchStart = 0;
let stopwatchElapsed = 0;

let chronoSeconds = 30;

let musicPlaying = false;
let currentSong = 0;
let musicProgress = 0;

let monkeyScore = 0;

let phoneNumber = "";

let splashLikes = [
    24,
    91,
    17
];


/* =========================================================
   STORAGE
========================================================= */

function getStorage(key, fallback) {

    try {

        const value = localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);

    } catch {

        return fallback;

    }

}

function setStorage(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch {

        /* Ignore storage failures */

    }

}


/* =========================================================
   SAFE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

    const old =
        document.getElementById("pear-toast");

    if (old) {
        old.remove();
    }

    const element =
        document.createElement("div");

    element.id = "pear-toast";

    element.textContent = message;

    Object.assign(
        element.style,
        {

            position: "absolute",

            left: "50%",

            bottom: "12px",

            transform: "translateX(-50%)",

            background: "rgba(0,0,0,.85)",

            color: "white",

            padding: "7px 12px",

            borderRadius: "20px",

            fontSize: "10px",

            fontWeight: "bold",

            zIndex: "5000",

            pointerEvents: "none",

            whiteSpace: "nowrap"

        }
    );

    overlay.appendChild(element);

    setTimeout(
        () => {

            if (element.parentNode) {
                element.remove();
            }

        },
        1500
    );

}


/* =========================================================
   APP OPENING
========================================================= */

function openApp(appName) {

    if (!appName) {
        return;
    }

    stopTemporaryTimers();

    currentApp = appName;

    overlay.classList.add("open");

    /*
       IMPORTANT:

       Only THIS function decides what application opens.
       There is no "next app" logic.
    */

    switch (appName) {

        case "messages":
            renderMessages();
            break;

        case "camera":
            renderCamera();
            break;

        case "splashface":
            renderSplashFace();
            break;

        case "stocks":
            renderStocks();
            break;

        case "maps":
            renderMaps();
            break;

        case "photos":
            renderPhotos();
            break;

        case "weather":
            renderWeather();
            break;

        case "notes":
            renderNotes();
            break;

        case "peartunes":
            renderPearTunes();
            break;

        case "settings":
            renderSettings();
            break;

        case "clock":
            renderClock();
            break;

        case "videos":
            renderVideos();
            break;

        case "phone":
            renderPhone();
            break;

        case "mail":
            renderMail();
            break;

        case "compass":
            renderCompass();
            break;

        case "lingo":
            renderLingo();
            break;

        case "thumb":
            renderThumbsUp();
            break;

        case "danwarp":
            renderDanWarp();
            break;

        case "image":
            renderImageLab();
            break;

        case "chrono":
            renderChrono();
            break;

        case "zaplook":
            renderZapLook();
            break;

        case "monkey":
            renderMonkey();
            break;

        case "remark":
            renderRemark();
            break;

        default:
            renderUnknown(appName);

    }

    setupTextFields();

}


/* =========================================================
   CLOSE APP
========================================================= */

function closeApp() {

    stopTemporaryTimers();

    hideKeyboard();

    currentApp = null;

    overlay.classList.remove("open");

    appWindow.innerHTML = "";

}


/* =========================================================
   TEMP TIMER CLEANUP
========================================================= */

function stopTemporaryTimers() {

    if (stopwatchInterval) {

        clearInterval(stopwatchInterval);

        stopwatchInterval = null;

    }

    if (chronoInterval) {

        clearInterval(chronoInterval);

        chronoInterval = null;

    }

    if (musicInterval) {

        clearInterval(musicInterval);

        musicInterval = null;

    }

    if (monkeyInterval) {

        clearInterval(monkeyInterval);

        monkeyInterval = null;

    }

}


/* =========================================================
   APP SHELL
========================================================= */

function appShell(title, body) {

    appWindow.innerHTML = `

        <div class="app-page">

            <div class="app-header">

                <button
                    class="back-button"
                    data-action="close-app"
                >
                    ‹
                </button>

                <div class="app-title">
                    ${escapeHTML(title)}
                </div>

            </div>

            <div class="app-content">

                ${body}

            </div>

        </div>

    `;

}


/* =========================================================
   EVENT DELEGATION INSIDE APPS
========================================================= */

appWindow.addEventListener(
    "click",
    function(event) {

        const target =
            event.target.closest("[data-action]");

        if (!target) {
            return;
        }

        event.preventDefault();

        event.stopPropagation();

        const action =
            target.dataset.action;

        switch (action) {

            case "close-app":
                closeApp();
                break;

            case "send-message":
                sendMessage();
                break;

            case "take-picture":
                takePicture();
                break;

            case "toggle-flash":
                toast("⚡ Flash toggled");
                break;

            case "new-photo":
                addPhoto();
                break;

            case "delete-photo":
                deletePhoto();
                break;

            case "refresh-weather":
                refreshWeather();
                break;

            case "save-note":
                saveNote();
                break;

            case "next-song":
                nextSong();
                break;

            case "previous-song":
                previousSong();
                break;

            case "toggle-music":
                toggleMusic();
                break;

            case "buy-stock":
                buyStock();
                break;

            case "sell-stock":
                sellStock();
                break;

            case "refresh-stock":
                refreshStock();
                break;

            case "random-compass":
                randomCompass();
                break;

            case "start-stopwatch":
                startStopwatch();
                break;

            case "stop-stopwatch":
                stopStopwatch();
                break;

            case "reset-stopwatch":
                resetStopwatch();
                break;

            case "start-chrono":
                startChrono();
                break;

            case "stop-chrono":
                stopChrono();
                break;

            case "reset-chrono":
                resetChrono();
                break;

            case "make-call":
                makeCall();
                break;

            case "delete-dial":
                deleteDial();
                break;

            case "send-mail":
                sendMail();
                break;

            case "check-lingo":
                checkLingo();
                break;

            case "thumb-tap":
                thumbTap();
                break;

            case "warp":
                warp();
                break;

            case "warp-reset":
                warpReset();
                break;

            case "move-monkey":
                moveMonkey();
                break;

            case "catch-monkey":
                catchMonkey();
                break;

            case "save-remark":
                saveRemark();
                break;

            case "toggle-dark":
                toggleDark(target.checked);
                break;

        }

    }
);


/* =========================================================
   HOTSPOT SYSTEM
========================================================= */

/*
   THIS IS THE MAIN FIX.

   Every hotspot has:
       data-app="..."

   We read ONLY that attribute.

   We do NOT use:
       nextElementSibling
       parentElement
       nearby buttons
       coordinates
       index numbers

   Therefore clicking CAMERA cannot open SPLASHFACE,
   clicking STOCKS cannot open MAPS, etc.
*/

document
    .querySelectorAll(".hotspot")
    .forEach(
        hotspot => {

            hotspot.addEventListener(
                "pointerdown",
                function(event) {

                    event.stopPropagation();

                },
                true
            );

            hotspot.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopPropagation();

                    event.stopImmediatePropagation();

                    /*
                       Home is special.
                    */

                    if (
                        this.dataset.app ===
                        "home"
                    ) {

                        closeApp();

                        return;

                    }

                    /*
                       ONLY this button's data-app.
                    */

                    const app =
                        this.dataset.app;

                    openApp(app);

                },
                true
            );

        }
    );


/* =========================================================
   PAGE SWITCHING
========================================================= */

function setPage(page) {

    if (
        page !== 1 &&
        page !== 2
    ) {
        return;
    }

    currentPage = page;

    if (page === 1) {

        phone.classList.remove(
            "page-two"
        );

    } else {

        phone.classList.add(
            "page-two"
        );

    }

    const dots =
        document.getElementById(
            "page-dots"
        );

    if (dots) {

        dots.textContent =
            page === 1
                ? "● ○"
                : "○ ●";

    }

}


/* =========================================================
   SWIPE / DRAG
========================================================= */

phone.addEventListener(
    "pointerdown",
    function(event) {

        if (
            event.target.closest("#overlay")
        ) {
            return;
        }

        pointerStartX =
            event.clientX;

        pointerStartY =
            event.clientY;

        pointerDownTime =
            Date.now();

    },
    false
);


phone.addEventListener(
    "pointerup",
    function(event) {

        if (
            event.target.closest("#overlay")
        ) {
            return;
        }

        const dx =
            event.clientX -
            pointerStartX;

        const dy =
            event.clientY -
            pointerStartY;

        const duration =
            Date.now() -
            pointerDownTime;

        if (
            Math.abs(dy) < 45
        ) {
            return;
        }

        if (
            Math.abs(dy) <
            Math.abs(dx)
        ) {
            return;
        }

        if (
            duration > 1000
        ) {
            return;
        }

        if (dy < 0) {

            setPage(2);

        } else {

            setPage(1);

        }

    },
    false
);


/* =========================================================
   KEYBOARD PAGE CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        /*
           Do not change pages while typing.
        */

        if (
            activeInput
        ) {

            if (
                event.key === "Escape"
            ) {

                hideKeyboard();

            }

            return;

        }

        if (
            event.key === "Escape"
        ) {

            closeApp();

            return;

        }

        if (
            overlay.classList.contains(
                "open"
            )
        ) {

            return;

        }

        if (
            event.key === "ArrowUp"
        ) {

            setPage(2);

        }

        if (
            event.key === "ArrowDown"
        ) {

            setPage(1);

        }

    }
);


/* =========================================================
   CUSTOM KEYBOARD
========================================================= */

function createKeyboard() {

    if (
        document.getElementById(
            "pear-keyboard"
        )
    ) {

        return;

    }

    keyboard =
        document.createElement("div");

    keyboard.id =
        "pear-keyboard";

    keyboard.innerHTML = `

        <div class="keyboard-row">

            ${[
                "Q","W","E","R","T",
                "Y","U","I","O","P"
            ].map(
                key =>
                    `<button
                        class="keyboard-key"
                        data-key="${key}"
                    >${key}</button>`
            ).join("")}

        </div>

        <div class="keyboard-row">

            ${[
                "A","S","D","F","G",
                "H","J","K","L"
            ].map(
                key =>
                    `<button
                        class="keyboard-key"
                        data-key="${key}"
                    >${key}</button>`
            ).join("")}

        </div>

        <div class="keyboard-row">

            ${[
                "Z","X","C","V",
                "B","N","M"
            ].map(
                key =>
                    `<button
                        class="keyboard-key"
                        data-key="${key}"
                    >${key}</button>`
            ).join("")}

        </div>

        <div class="keyboard-row">

            <button
                class="keyboard-key"
                data-key="BACKSPACE"
            >
                ⌫
            </button>

            <button
                class="keyboard-key keyboard-space"
                data-key="SPACE"
            >
                SPACE
            </button>

            <button
                class="keyboard-key"
                data-key="ENTER"
            >
                ↵
            </button>

        </div>

    `;

    overlay.appendChild(keyboard);

    keyboard.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

        }
    );

    keyboard.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            const key =
                event.target.dataset.key;

            if (!key) {
                return;
            }

            keyboardInput(key);

        }
    );

}


function showKeyboard() {

    createKeyboard();

    keyboard.style.display =
        "block";

    requestAnimationFrame(
        function() {

            keyboard.classList.add(
                "keyboard-show"
            );

        }
    );

}


function hideKeyboard() {

    if (!keyboard) {
        return;
    }

    keyboard.classList.remove(
        "keyboard-show"
    );

    setTimeout(
        function() {

            if (
                !activeInput
            ) {

                keyboard.style.display =
                    "none";

            }

        },
        280
    );

    activeInput = null;

}


function keyboardInput(key) {

    if (!activeInput) {
        return;
    }

    const field =
        activeInput;

    const start =
        field.selectionStart ??
        field.value.length;

    const end =
        field.selectionEnd ??
        field.value.length;

    if (
        key === "BACKSPACE"
    ) {

        if (
            start === end &&
            start > 0
        ) {

            field.value =
                field.value.substring(
                    0,
                    start - 1
                ) +
                field.value.substring(
                    end
                );

            field.setSelectionRange(
                start - 1,
                start - 1
            );

        } else {

            field.value =
                field.value.substring(
                    0,
                    start
                ) +
                field.value.substring(
                    end
                );

            field.setSelectionRange(
                start,
                start
            );

        }

    } else if (
        key === "SPACE"
    ) {

        insertTextAtCursor(" ");

    } else if (
        key === "ENTER"
    ) {

        if (
            field.tagName ===
            "TEXTAREA"
        ) {

            insertTextAtCursor(
                "\n"
            );

        } else {

            hideKeyboard();

        }

    } else {

        insertTextAtCursor(
            key.toLowerCase()
        );

    }

    field.dispatchEvent(
        new Event(
            "input",
            {
                bubbles: true
            }
        )
    );

    field.focus();

}


function insertTextAtCursor(text) {

    if (!activeInput) {
        return;
    }

    const field =
        activeInput;

    const start =
        field.selectionStart ??
        field.value.length;

    const end =
        field.selectionEnd ??
        field.value.length;

    field.value =
        field.value.substring(
            0,
            start
        ) +
        text +
        field.value.substring(
            end
        );

    const newPosition =
        start + text.length;

    field.setSelectionRange(
        newPosition,
        newPosition
    );

}


/* =========================================================
   TEXT FIELD SETUP
========================================================= */

function setupTextFields() {

    document
        .querySelectorAll(
            "#app-window input[type='text'], " +
            "#app-window input:not([type]), " +
            "#app-window textarea"
        )
        .forEach(
            field => {

                field.addEventListener(
                    "focus",
                    function() {

                        activeInput =
                            this;

                        showKeyboard();

                    }
                );

                field.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();

                        activeInput =
                            this;

                        showKeyboard();

                    }
                );

            }
        );

}


createKeyboard();


/* =========================================================
   MESSAGES
========================================================= */

let messages =
    getStorage(
        "pear-messages",
        [
            {
                name: "Dylan",
                text:
                    "Yo! You using the Pear Phone?",
                time:
                    "9:41 PM"
            },
            {
                name: "Alex",
                text:
                    "Check out this new app 😂",
                time:
                    "8:18 PM"
            },
            {
                name: "Pear",
                text:
                    "Welcome to Pear Phone OS!",
                time:
                    "7:02 PM"
            }
        ]
    );


function renderMessages() {

    appShell(
        "Messages",
        `

        <div>

            ${messages.map(
                (message, index) => `

                    <div
                        class="app-card"
                        data-message="${index}"
                    >

                        <strong>
                            ${escapeHTML(
                                message.name
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                message.text
                            )}
                        </p>

                        <small>
                            ${escapeHTML(
                                message.time
                            )}
                        </small>

                    </div>

                `
            ).join("")}

        </div>

        <input
            id="message-input"
            type="text"
            placeholder="Type a message..."
        >

        <button
            class="pear-button wide"
            data-action="send-message"
        >
            Send
        </button>

        `
    );

}


function sendMessage() {

    const input =
        document.getElementById(
            "message-input"
        );

    if (
        !input ||
        !input.value.trim()
    ) {

        toast(
            "Type a message first"
        );

        return;

    }

    messages.unshift(
        {
            name: "You",
            text: input.value,
            time: "Now"
        }
    );

    setStorage(
        "pear-messages",
        messages
    );

    toast(
        "Message sent!"
    );

    renderMessages();

}


/* =========================================================
   CAMERA
========================================================= */

let cameraPhotos =
    getStorage(
        "pear-camera-photos",
        0
    );


function renderCamera() {

    appShell(
        "Camera",
        `

        <div class="camera-preview">

            PEAR CAMERA

        </div>

        <button
            class="shutter"
            data-action="take-picture"
        ></button>

        <button
            class="pear-button"
            data-action="toggle-flash"
        >
            ⚡
        </button>

        <p id="camera-status">
            Ready to take a photo.
        </p>

        <p>
            Photos taken:
            <strong>
                ${cameraPhotos}
            </strong>
        </p>

        `
    );

}


function takePicture() {

    cameraPhotos++;

    setStorage(
        "pear-camera-photos",
        cameraPhotos
    );

    const status =
        document.getElementById(
            "camera-status"
        );

    if (status) {

        status.textContent =
            "📸 Photo saved to Photos!";

    }

    toast(
        "📸 Photo saved!"
    );

}


/* =========================================================
   SPLASHFACE
========================================================= */

function renderSplashFace() {

    appShell(
        "SplashFace",
        `

        <div class="app-card">

            <strong>
                pear_user
            </strong>

            <div class="social-image">
                🌴
            </div>

            <button
                class="pear-button"
                data-like="0"
            >
                ❤️
                <span>
                    ${splashLikes[0]}
                </span>
            </button>

            <p>
                Another day in paradise.
            </p>

        </div>


        <div class="app-card">

            <strong>
                PearOfficial
            </strong>

            <div class="social-image">
                🍐
            </div>

            <button
                class="pear-button"
                data-like="1"
            >
                ❤️
                <span>
                    ${splashLikes[1]}
                </span>
            </button>

            <p>
                Think different. Think Pear.
            </p>

        </div>


        <div class="app-card">

            <strong>
                Pear Adventures
            </strong>

            <div class="social-image">
                🌊
            </div>

            <button
                class="pear-button"
                data-like="2"
            >
                ❤️
                <span>
                    ${splashLikes[2]}
                </span>
            </button>

            <p>
                New adventure unlocked.
            </p>

        </div>

        <input
            id="splash-input"
            type="text"
            placeholder="Write a post..."
        >

        <button
            class="pear-button wide"
            data-action="send-message"
        >
            Post
        </button>

        `
    );

    document
        .querySelectorAll(
            "[data-like]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();
                        event.stopPropagation();

                        const index =
                            Number(
                                this.dataset.like
                            );

                        splashLikes[index]++;

                        this.querySelector(
                            "span"
                        ).textContent =
                            splashLikes[index];

                    }
                );

            }
        );

}


/* =========================================================
   STOCKS
========================================================= */

let stockPrice =
    Number(
        localStorage.getItem(
            "pear-stock-price"
        )
    ) || 142.31;

let stockCash =
    Number(
        localStorage.getItem(
            "pear-stock-cash"
        )
    ) || 10000;

let stockShares =
    Number(
        localStorage.getItem(
            "pear-stock-shares"
        )
    ) || 0;


function renderStocks() {

    const position =
        stockPrice *
        stockShares;

    appShell(
        "Stocks",
        `

        <div
            class="app-card"
            style="text-align:center"
        >

            <small>
                PEAR
            </small>

            <h1>
                $${stockPrice.toFixed(2)}
            </h1>

            <p>
                ▲ 2.41%
            </p>

        </div>


        <div class="app-card">

            <p>
                Cash:
                <strong>
                    $${stockCash.toFixed(2)}
                </strong>
            </p>

            <p>
                Shares:
                <strong>
                    ${stockShares}
                </strong>
            </p>

            <p>
                Position:
                <strong>
                    $${position.toFixed(2)}
                </strong>
            </p>

        </div>


        <div class="chart">

            ${Array
                .from(
                    {
                        length: 12
                    }
                )
                .map(
                    () =>
                        `<div
                            class="chart-bar"
                            style="
                                height:
                                ${20 +
                                Math.random()*70}%
                            "
                        ></div>`
                )
                .join("")}

        </div>


        <button
            class="pear-button green"
            data-action="buy-stock"
        >
            Buy
        </button>

        <button
            class="pear-button"
            data-action="sell-stock"
        >
            Sell
        </button>

        <button
            class="pear-button"
            data-action="refresh-stock"
        >
            Refresh
        </button>

        `
    );

}


function buyStock() {

    if (
        stockCash >=
        stockPrice
    ) {

        stockCash -=
            stockPrice;

        stockShares++;

        saveStocks();

        toast(
            "Bought 1 share 📈"
        );

        renderStocks();

    } else {

        toast(
            "Not enough cash"
        );

    }

}


function sellStock() {

    if (
        stockShares <= 0
    ) {

        toast(
            "You don't own any"
        );

        return;

    }

    stockShares--;

    stockCash +=
        stockPrice;

    saveStocks();

    toast(
        "Sold 1 share"
    );

    renderStocks();

}


function refreshStock() {

    stockPrice +=
        (Math.random() - .45) * 8;

    if (
        stockPrice < 1
    ) {

        stockPrice = 1;

    }

    saveStocks();

    renderStocks();

}


function saveStocks() {

    localStorage.setItem(
        "pear-stock-price",
        stockPrice
    );

    localStorage.setItem(
        "pear-stock-cash",
        stockCash
    );

    localStorage.setItem(
        "pear-stock-shares",
        stockShares
    );

}


/* =========================================================
   MAPS
========================================================= */

function renderMaps() {

    appShell(
        "Pear Maps",
        `

        <div
            class="app-card"
            style="
                height:140px;
                background:#d8e9c8;
                position:relative;
                overflow:hidden;
            "
        >

            <div
                style="
                    position:absolute;
                    width:160%;
                    height:12px;
                    background:white;
                    top:60px;
                    left:-20px;
                    transform:rotate(25deg);
                "
            ></div>

            <div
                style="
                    position:absolute;
                    width:160%;
                    height:9px;
                    background:#aaa;
                    top:100px;
                    left:-20px;
                    transform:rotate(-35deg);
                "
            ></div>

            <div
                style="
                    position:absolute;
                    left:50%;
                    top:50%;
                    font-size:30px;
                "
            >
                📍
            </div>

        </div>


        <button
            class="pear-button wide"
            data-map="Campus"
        >
            🏫 Campus
        </button>

        <button
            class="pear-button wide"
            data-map="Home"
        >
            🏠 Home
        </button>

        <button
            class="pear-button wide"
            data-map="Mall"
        >
            🛍️ Mall
        </button>

        <p id="map-result">
            Choose a destination.
        </p>

        `
    );

    document
        .querySelectorAll(
            "[data-map]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();
                        event.stopPropagation();

                        const place =
                            this.dataset.map;

                        const distance =
                            {
                                Campus: "1.8 km",
                                Home: "4.2 km",
                                Mall: "6.7 km"
                            }[place];

                        const result =
                            document.getElementById(
                                "map-result"
                            );

                        result.innerHTML = `
                            Route to
                            <strong>
                                ${place}
                            </strong>
                            <br>
                            ${distance}
                            away
                            <br>
                            ETA:
                            ${
                                5 +
                                Math.floor(
                                    Math.random()*15
                                )
                            }
                            min
                        `;

                    }
                );

            }
        );

}


/* =========================================================
   PHOTOS
========================================================= */

let photos =
    getStorage(
        "pear-photos",
        [
            "🌴",
            "🍐",
            "🌅"
        ]
    );


function renderPhotos() {

    appShell(
        "Photos",
        `

        <div class="photo-grid">

            ${photos.map(
                photo =>
                    `
                    <div
                        class="photo-tile"
                    >
                        ${photo}
                    </div>
                    `
            ).join("")}

        </div>

        <button
            class="pear-button"
            data-action="new-photo"
        >
            ＋ Add
        </button>

        <button
            class="pear-button"
            data-action="delete-photo"
        >
            Delete
        </button>

        `
    );

}


function addPhoto() {

    const options = [
        "🌊",
        "🏔️",
        "🌃",
        "🌸",
        "🚀",
        "🎆",
        "🐸",
        "🏖️"
    ];

    photos.push(
        options[
            Math.floor(
                Math.random() *
                options.length
            )
        ]
    );

    setStorage(
        "pear-photos",
        photos
    );

    renderPhotos();

}


function deletePhoto() {

    if (
        photos.length === 0
    ) {

        toast(
            "No photos"
        );

        return;

    }

    photos.pop();

    setStorage(
        "pear-photos",
        photos
    );

    renderPhotos();

}


/* =========================================================
   WEATHER
========================================================= */

function renderWeather() {

    const temperature =
        18 +
        Math.floor(
            Math.random()*10
        );

    appShell(
        "Weather",
        `

        <div class="weather-main">

            <div
                style="font-size:45px"
            >
                ☀️
            </div>

            <div
                class="weather-temperature"
            >
                ${temperature}°
            </div>

            <p>
                Mostly Sunny
            </p>

        </div>


        <div
            class="app-card"
            style="
                display:flex;
                justify-content:space-between;
            "
        >

            <span>
                Mon<br>☀️ 21°
            </span>

            <span>
                Tue<br>🌤️ 23°
            </span>

            <span>
                Wed<br>☀️ 25°
            </span>

            <span>
                Thu<br>🌧️ 19°
            </span>

            <span>
                Fri<br>☀️ 22°
            </span>

        </div>


        <button
            class="pear-button wide"
            data-action="refresh-weather"
        >
            Refresh
        </button>

        `
    );

}


function refreshWeather() {

    renderWeather();

    toast(
        "Weather updated"
    );

}


/* =========================================================
   NOTES
========================================================= */

let notes =
    getStorage(
        "pear-notes",
        []
    );


function renderNotes() {

    appShell(
        "Notes",
        `

        <input
            id="note-title"
            type="text"
            placeholder="Title"
        >

        <textarea
            id="note-body"
            rows="6"
            placeholder="Write your note..."
        ></textarea>

        <button
            class="pear-button wide"
            data-action="save-note"
        >
            Save Note
        </button>


        <hr>

        ${notes.map(
            (note, index) =>
                `
                <div
                    class="app-card"
                    data-note="${index}"
                >

                    <strong>
                        ${escapeHTML(
                            note.title
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            note.body
                        )}
                    </p>

                </div>
                `
        ).join("")}

        `
    );

}


function saveNote() {

    const title =
        document.getElementById(
            "note-title"
        );

    const body =
        document.getElementById(
            "note-body"
        );

    if (
        !body.value.trim()
    ) {

        toast(
            "Write something first"
        );

        return;

    }

    notes.unshift(
        {
            title:
                title.value ||
                "Untitled",

            body:
                body.value
        }
    );

    setStorage(
        "pear-notes",
        notes
    );

    toast(
        "Note saved!"
    );

    renderNotes();

}


/* =========================================================
   PEARTUNES
========================================================= */

const songs = [

    [
        "Pearwave",
        "The Pears"
    ],

    [
        "Electric Summer",
        "P-Club"
    ],

    [
        "Midnight Drive",
        "Pear Radio"
    ],

    [
        "Loading...",
        "Pear OS"
    ]

];


function renderPearTunes() {

    const song =
        songs[currentSong];

    appShell(
        "PearTunes",
        `

        <div class="music-art">
            🍐
        </div>

        <h2>
            ${escapeHTML(song[0])}
        </h2>

        <p>
            ${escapeHTML(song[1])}
        </p>

        <div
            style="
                height:5px;
                background:#ccc;
                border-radius:5px;
                overflow:hidden;
            "
        >

            <div
                id="music-progress"
                style="
                    height:100%;
                    width:${musicProgress}%;
                    background:#111;
                "
            ></div>

        </div>


        <div
            style="
                text-align:center;
                margin-top:7px;
            "
        >

            <button
                class="pear-button"
                data-action="previous-song"
            >
                ◀
            </button>

            <button
                class="pear-button"
                data-action="toggle-music"
            >
                ${
                    musicPlaying
                        ? "❚❚"
                        : "▶"
                }
            </button>

            <button
                class="pear-button"
                data-action="next-song"
            >
                ▶
            </button>

        </div>


        ${songs.map(
            (song,index) =>
                `
                <div
                    class="app-card"
                    data-song="${index}"
                >
                    ${index + 1}.
                    ${escapeHTML(
                        song[0]
                    )}
                </div>
                `
        ).join("")}

        `
    );

    document
        .querySelectorAll(
            "[data-song]"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();
                        event.stopPropagation();

                        currentSong =
                            Number(
                                this.dataset.song
                            );

                        musicProgress = 0;

                        musicPlaying = true;

                        renderPearTunes();

                    }
                );

            }
        );

    if (
        musicPlaying
    ) {

        musicInterval =
            setInterval(
                function() {

                    musicProgress +=
                        .8;

                    if (
                        musicProgress >= 100
                    ) {

                        musicProgress = 0;

                        nextSong();

                        return;

                    }

                    const bar =
                        document.getElementById(
                            "music-progress"
                        );

                    if (bar) {

                        bar.style.width =
                            musicProgress +
                            "%";

                    }

                },
                500
            );

    }

}


function toggleMusic() {

    musicPlaying =
        !musicPlaying;

    renderPearTunes();

}


function nextSong() {

    currentSong =
        (
            currentSong + 1
        ) %
        songs.length;

    musicProgress = 0;

    renderPearTunes();

}


function previousSong() {

    currentSong =
        (
            currentSong -
            1 +
            songs.length
        ) %
        songs.length;

    musicProgress = 0;

    renderPearTunes();

}


/* =========================================================
   SETTINGS
========================================================= */

function renderSettings() {

    const dark =
        localStorage.getItem(
            "pear-dark"
        ) === "true";

    appShell(
        "Settings",
        `

        <div class="app-card">

            <strong>
                Appearance
            </strong>

            <p>

                <label>

                    <input
                        id="dark-toggle"
                        type="checkbox"
                        ${
                            dark
                                ? "checked"
                                : ""
                        }
                        style="
                            width:auto;
                        "
                    >

                    Dark Mode

                </label>

            </p>

        </div>


        <div class="app-card">

            <strong>
                Pear Phone
            </strong>

            <p>
                Version 2.0
            </p>

            <p>
                Storage:
                Working normally
            </p>

            <p>
                Touch:
                Enabled
            </p>

        </div>


        <button
            class="pear-button wide"
            data-settings-test
        >
            Test Notification
        </button>

        `
    );

    document
        .getElementById(
            "dark-toggle"
        )
        ?.addEventListener(
            "change",
            function() {

                toggleDark(
                    this.checked
                );

            }
        );

    document
        .querySelector(
            "[data-settings-test]"
        )
        ?.addEventListener(
            "click",
            function() {

                toast(
                    "🔔 Pear notification!"
                );

            }
        );

}


function toggleDark(enabled) {

    localStorage.setItem(
        "pear-dark",
        enabled
            ? "true"
            : "false"
    );

    appWindow.classList.toggle(
        "dark-app",
        enabled
    );

}


/* =========================================================
   CLOCK
========================================================= */

function renderClock() {

    appShell(
        "Clock",
        `

        <div
            id="live-clock"
            style="
                text-align:center;
                font-size:30px;
                font-weight:bold;
                margin:12px 0;
            "
        >
            --:--
        </div>

        <p
            id="live-date"
            style="
                text-align:center;
            "
        ></p>

        <hr>

        <h3>
            Stopwatch
        </h3>

        <div
            id="stopwatch"
            style="
                text-align:center;
                font-size:24px;
                margin:8px;
            "
        >
            00:00.00
        </div>

        <button
            class="pear-button"
            data-action="start-stopwatch"
        >
            Start
        </button>

        <button
            class="pear-button"
            data-action="stop-stopwatch"
        >
            Stop
        </button>

        <button
            class="pear-button"
            data-action="reset-stopwatch"
        >
            Reset
        </button>

        `
    );

    updateClock();

}


function updateClock() {

    if (
        currentApp !==
        "clock"
    ) {

        return;

    }

    const clock =
        document.getElementById(
            "live-clock"
        );

    const date =
        document.getElementById(
            "live-date"
        );

    if (!clock) {
        return;
    }

    const now =
        new Date();

    clock.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit"
            }
        );

    date.textContent =
        now.toLocaleDateString(
            [],
            {
                weekday:
                    "long",

                month:
                    "long",

                day:
                    "numeric"
            }
        );

    setTimeout(
        updateClock,
        1000
    );

}


function startStopwatch() {

    if (
        stopwatchInterval
    ) {
        return;
    }

    stopwatchStart =
        Date.now() -
        stopwatchElapsed;

    stopwatchInterval =
        setInterval(
            function() {

                stopwatchElapsed =
                    Date.now() -
                    stopwatchStart;

                const element =
                    document.getElementById(
                        "stopwatch"
                    );

                if (!element) {
                    return;
                }

                const minutes =
                    Math.floor(
                        stopwatchElapsed /
                        60000
                    );

                const seconds =
                    Math.floor(
                        stopwatchElapsed /
                        1000
                    ) % 60;

                const hundredths =
                    Math.floor(
                        (
                            stopwatchElapsed %
                            1000
                        ) / 10
                    );

                element.textContent =
                    String(
                        minutes
                    ).padStart(
                        2,
                        "0"
                    ) +
                    ":" +
                    String(
                        seconds
                    ).padStart(
                        2,
                        "0"
                    ) +
                    "." +
                    String(
                        hundredths
                    ).padStart(
                        2,
                        "0"
                    );

            },
            10
        );

}


function stopStopwatch() {

    clearInterval(
        stopwatchInterval
    );

    stopwatchInterval =
        null;

}


function resetStopwatch() {

    stopStopwatch();

    stopwatchElapsed =
        0;

    const element =
        document.getElementById(
            "stopwatch"
        );

    if (element) {

        element.textContent =
            "00:00.00";

    }

}


/* =========================================================
   VIDEOS
========================================================= */

function renderVideos() {

    appShell(
        "Pear Videos",
        `

        <div
            id="video-screen"
            style="
                height:140px;
                border-radius:9px;
                background:#111;
                display:flex;
                align-items:center;
                justify-content:center;
                color:white;
                font-size:50px;
            "
        >
            ▶
        </div>

        <button
            class="pear-button wide"
            data-video-play
        >
            Play
        </button>

        <button
            class="pear-button wide"
            data-video-effect
        >
            Random Effect
        </button>

        <p id="video-status">
            Select a video.
        </p>

        `
    );

    document
        .querySelector(
            "[data-video-play]"
        )
        ?.addEventListener(
            "click",
            function() {

                const screen =
                    document.getElementById(
                        "video-screen"
                    );

                screen.textContent =
                    "🎬";

                document.getElementById(
                    "video-status"
                ).textContent =
                    "Playing: Pear Adventures";

            }
        );

    document
        .querySelector(
            "[data-video-effect]"
        )
        ?.addEventListener(
            "click",
            function() {

                const effects = [
                    "🍐",
                    "🚀",
                    "🌈",
                    "😂",
                    "💥",
                    "🎆"
                ];

                document.getElementById(
                    "video-screen"
                ).textContent =
                    effects[
                        Math.floor(
                            Math.random() *
                            effects.length
                        )
                    ];

            }
        );

}


/* =========================================================
   PHONE
========================================================= */

function renderPhone() {

    phoneNumber = "";

    appShell(
        "Phone",
        `

        <div
            class="dial-number"
            id="dial-number"
        ></div>

        <div class="dial-grid">

            ${[
                "1","2","3",
                "4","5","6",
                "7","8","9",
                "*","0","#"
            ].map(
                number =>
                    `
                    <button
                        data-dial="${number}"
                    >
                        ${number}
                    </button>
                    `
            ).join("")}

        </div>

        <button
            class="pear-button green wide"
            data-action="make-call"
        >
            📞 Call
        </button>

        <button
            class="pear-button wide"
            data-action="delete-dial"
        >
            Delete
        </button>

        `
    );

    document
        .querySelectorAll(
            "[data-dial]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();
                        event.stopPropagation();

                        phoneNumber +=
                            this.dataset.dial;

                        document.getElementById(
                            "dial-number"
                        ).textContent =
                            phoneNumber;

                    }
                );

            }
        );

}


function deleteDial() {

    phoneNumber =
        phoneNumber.slice(
            0,
            -1
        );

    const element =
        document.getElementById(
            "dial-number"
        );

    if (element) {

        element.textContent =
            phoneNumber;

    }

}


function makeCall() {

    if (!phoneNumber) {

        toast(
            "Enter a number"
        );

        return;

    }

    toast(
        "📞 Calling " +
        phoneNumber
    );

}


/* =========================================================
   MAIL
========================================================= */

let emails =
    getStorage(
        "pear-email",
        [
            {
                from:
                    "Pear Team",
                subject:
                    "Welcome!",
                body:
                    "Welcome to your Pear Phone."
            },
            {
                from:
                    "Pear News",
                subject:
                    "New Update",
                body:
                    "Your Pear Phone has received a new update."
            }
        ]
    );


function renderMail() {

    appShell(
        "Mail",
        `

        ${emails.map(
            (email,index) =>
                `
                <div
                    class="app-card"
                    data-email="${index}"
                >

                    <strong>
                        ${escapeHTML(
                            email.from
                        )}
                    </strong>

                    <b>
                        ${escapeHTML(
                            email.subject
                        )}
                    </b>

                    <p>
                        ${escapeHTML(
                            email.body
                        )}
                    </p>

                </div>
                `
        ).join("")}


        <button
            class="pear-button wide"
            data-compose
        >
            ✉ Compose
        </button>

        `
    );

    document
        .querySelectorAll(
            "[data-email]"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "click",
                    function() {

                        const email =
                            emails[
                                Number(
                                    this.dataset.email
                                )
                            ];

                        appShell(
                            email.subject,
                            `
                            <p>
                                <strong>
                                    From:
                                </strong>

                                ${
                                    escapeHTML(
                                        email.from
                                    )
                                }
                            </p>

                            <hr>

                            <p>
                                ${
                                    escapeHTML(
                                        email.body
                                    )
                                }
                            </p>
                            `
                        );

                    }
                );

            }
        );

    document
        .querySelector(
            "[data-compose]"
        )
        ?.addEventListener(
            "click",
            composeMail
        );

}


function composeMail() {

    appShell(
        "New Mail",
        `

        <input
            id="mail-to"
            type="text"
            placeholder="To"
        >

        <input
            id="mail-subject"
            type="text"
            placeholder="Subject"
        >

        <textarea
            id="mail-body"
            rows="6"
            placeholder="Message"
        ></textarea>

        <button
            class="pear-button wide"
            data-action="send-mail"
        >
            Send
        </button>

        `
    );

    setupTextFields();

}


function sendMail() {

    const to =
        document.getElementById(
            "mail-to"
        );

    const subject =
        document.getElementById(
            "mail-subject"
        );

    const body =
        document.getElementById(
            "mail-body"
        );

    if (
        !to.value ||
        !body.value
    ) {

        toast(
            "Fill in the message"
        );

        return;

    }

    emails.unshift(
        {
            from:
                "You → " +
                to.value,

            subject:
                subject.value ||
                "(No subject)",

            body:
                body.value
        }
    );

    setStorage(
        "pear-email",
        emails
    );

    toast(
        "Email sent!"
    );

    renderMail();

}


/* =========================================================
   COMPASS
========================================================= */

function renderCompass() {

    appShell(
        "Compass",
        `

        <div class="compass-circle">

            <span class="n">
                N
            </span>

            <span class="e">
                E
            </span>

            <span class="s">
                S
            </span>

            <span class="w">
                W
            </span>

            <div
                class="compass-needle"
                id="compass-needle"
            ></div>

        </div>

        <h2
            id="heading"
            style="
                text-align:center;
            "
        >
            0°
        </h2>

        <button
            class="pear-button wide"
            data-action="random-compass"
        >
            Calibrate
        </button>

        `
    );

}


function randomCompass() {

    const heading =
        Math.floor(
            Math.random() *
            360
        );

    document.getElementById(
        "heading"
    ).textContent =
        heading +
        "°";

    document.getElementById(
        "compass-needle"
    ).style.transform =
        `rotate(${heading}deg)`;

}


/* =========================================================
   LINGO
========================================================= */

const lingoWords = [
    "PEAR",
    "PHONE",
    "MUSIC",
    "APPLE",
    "RADIO",
    "CLOUD"
];

let lingoAnswer =
    "PEAR";


function renderLingo() {

    lingoAnswer =
        lingoWords[
            Math.floor(
                Math.random() *
                lingoWords.length
            )
        ];

    appShell(
        "Lingo",
        `

        <h2>
            Guess the word
        </h2>

        <p>
            Hint: Think Pear Phone.
        </p>

        <input
            id="lingo-input"
            type="text"
            maxlength="${lingoAnswer.length}"
            placeholder="${"_".repeat(
                lingoAnswer.length
            )}"
        >

        <button
            class="pear-button wide"
            data-action="check-lingo"
        >
            Guess
        </button>

        <p
            id="lingo-result"
            style="
                text-align:center;
                font-weight:bold;
            "
        ></p>

        `
    );

}


function checkLingo() {

    const input =
        document.getElementById(
            "lingo-input"
        );

    const result =
        document.getElementById(
            "lingo-result"
        );

    if (
        input.value
            .trim()
            .toUpperCase() ===
        lingoAnswer
    ) {

        result.textContent =
            "🎉 Correct!";

    } else {

        result.textContent =
            "❌ Not quite. Try again!";

    }

}


/* =========================================================
   THUMBS UP
========================================================= */

function renderThumbsUp() {

    monkeyScore = 0;

    appShell(
        "Thumbs Up",
        `

        <h2
            style="
                text-align:center;
            "
        >
            Tap as fast as possible!
        </h2>

        <p
            style="
                text-align:center;
            "
        >
            Score:
            <strong
                id="thumb-score"
            >
                0
            </strong>
        </p>

        <button
            class="game-button"
            data-action="thumb-tap"
        >
            👍
        </button>

        <p
            id="thumb-status"
            style="
                text-align:center;
            "
        >
            10 seconds!
        </p>

        `
    );

    let time = 10;

    const timer =
        setInterval(
            function() {

                if (
                    currentApp !==
                    "thumb"
                ) {

                    clearInterval(
                        timer
                    );

                    return;

                }

                time--;

                const status =
                    document.getElementById(
                        "thumb-status"
                    );

                if (status) {

                    status.textContent =
                        time +
                        " seconds left";

                }

                if (
                    time <= 0
                ) {

                    clearInterval(
                        timer
                    );

                    if (status) {

                        status.textContent =
                            "Finished! Score: " +
                            monkeyScore;

                    }

                }

            },
            1000
        );

}


function thumbTap() {

    monkeyScore++;

    const score =
        document.getElementById(
            "thumb-score"
        );

    if (score) {

        score.textContent =
            monkeyScore;

    }

}


/* =========================================================
   DANWARP
========================================================= */

function renderDanWarp() {

    appShell(
        "DanWarp",
        `

        <div
            id="warp-box"
            class="warp-box"
        >
            DANWARP
        </div>

        <button
            class="pear-button wide"
            data-action="warp"
        >
            WARP!
        </button>

        <button
            class="pear-button wide"
            data-action="warp-reset"
        >
            Reset
        </button>

        `
    );

}


function warp() {

    const box =
        document.getElementById(
            "warp-box"
        );

    if (!box) {
        return;
    }

    const rotation =
        Math.random()*720 -
        360;

    const scale =
        .6 +
        Math.random()*1.3;

    const radius =
        Math.random()*50;

    box.style.transform =
        `
        rotate(${rotation}deg)
        scale(${scale})
        `;

    box.style.borderRadius =
        radius +
        "%";

}


function warpReset() {

    const box =
        document.getElementById(
            "warp-box"
        );

    if (!box) {
        return;
    }

    box.style.transform =
        "";

    box.style.borderRadius =
        "";

}


/* =========================================================
   IMAGE LAB
========================================================= */

function renderImageLab() {

    appShell(
        "Image Lab",
        `

        <div
            id="image-canvas"
            style="
                height:130px;
                border-radius:9px;
                background:#ddd;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:50px;
                overflow:hidden;
                transition:.4s;
            "
        >
            🖼️
        </div>

        <button
            class="pear-button"
            data-image-effect="spin"
        >
            Spin
        </button>

        <button
            class="pear-button"
            data-image-effect="zoom"
        >
            Zoom
        </button>

        <button
            class="pear-button"
            data-image-effect="rainbow"
        >
            Rainbow
        </button>

        <input
            type="file"
            accept="image/*"
            id="image-upload"
        >

        `
    );

    document
        .querySelectorAll(
            "[data-image-effect]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        const image =
                            document.getElementById(
                                "image-canvas"
                            );

                        const effect =
                            this.dataset
                                .imageEffect;

                        if (
                            effect ===
                            "spin"
                        ) {

                            image.style.transform =
                                "rotate(360deg)";

                        }

                        if (
                            effect ===
                            "zoom"
                        ) {

                            image.style.transform =
                                "scale(1.25)";

                        }

                        if (
                            effect ===
                            "rainbow"
                        ) {

                            image.style.filter =
                                "hue-rotate(180deg)";

                        }

                    }
                );

            }
        );

    document
        .getElementById(
            "image-upload"
        )
        ?.addEventListener(
            "change",
            loadImage
        );

}


function loadImage(event) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload =
        function(e) {

            const canvas =
                document.getElementById(
                    "image-canvas"
                );

            canvas.innerHTML = `

                <img
                    src="${e.target.result}"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                    "
                >

            `;

        };

    reader.readAsDataURL(
        file
    );

}


/* =========================================================
   CHRONO
========================================================= */

function renderChrono() {

    chronoSeconds = 30;

    appShell(
        "Chrono",
        `

        <div
            id="chrono-time"
            style="
                text-align:center;
                font-size:38px;
                font-weight:bold;
                margin:15px;
            "
        >
            00:30
        </div>

        <button
            class="pear-button"
            data-action="start-chrono"
        >
            Start
        </button>

        <button
            class="pear-button"
            data-action="stop-chrono"
        >
            Stop
        </button>

        <button
            class="pear-button"
            data-action="reset-chrono"
        >
            Reset
        </button>

        `
    );

}


function startChrono() {

    if (
        chronoInterval
    ) {
        return;
    }

    chronoInterval =
        setInterval(
            function() {

                chronoSeconds--;

                updateChrono();

                if (
                    chronoSeconds <=
                    0
                ) {

                    stopChrono();

                    toast(
                        "⏰ TIME!"
                    );

                }

            },
            1000
        );

}


function stopChrono() {

    clearInterval(
        chronoInterval
    );

    chronoInterval =
        null;

}


function resetChrono() {

    stopChrono();

    chronoSeconds =
        30;

    updateChrono();

}


function updateChrono() {

    const element =
        document.getElementById(
            "chrono-time"
        );

    if (!element) {
        return;
    }

    const minutes =
        Math.floor(
            chronoSeconds /
            60
        );

    const seconds =
        chronoSeconds %
        60;

    element.textContent =
        String(
            minutes
        ).padStart(
            2,
            "0"
        ) +
        ":" +
        String(
            seconds
        ).padStart(
            2,
            "0"
        );

}


/* =========================================================
   ZAPLOOK
========================================================= */

function renderZapLook() {

    appShell(
        "ZapLook",
        `

        <input
            id="zap-search"
            type="text"
            placeholder="Search Pear..."
        >

        <button
            class="pear-button wide"
            data-zap-search
        >
            🔍 Search
        </button>

        <div
            id="zap-results"
        ></div>

        `
    );

    document
        .querySelector(
            "[data-zap-search]"
        )
        ?.addEventListener(
            "click",
            zapSearch
        );

}


function zapSearch() {

    const input =
        document.getElementById(
            "zap-search"
        );

    const results =
        document.getElementById(
            "zap-results"
        );

    const query =
        input.value
            .trim()
            .toLowerCase();

    const facts = [

        "Pear Phone has two home pages.",

        "PearTunes has multiple songs.",

        "DanWarp can warp the screen.",

        "The Pear Phone supports a touchscreen.",

        "Lingo is a word guessing game.",

        "Monkey is a reaction game.",

        "Pear Phone OS was built for fun."

    ];

    if (!query) {

        results.innerHTML =
            "<p>Type something.</p>";

        return;

    }

    const matches =
        facts.filter(
            fact =>
                fact
                    .toLowerCase()
                    .includes(query)
        );

    if (
        matches.length
    ) {

        results.innerHTML =
            matches.map(
                fact =>
                    `<div class="app-card">
                        🔎
                        ${escapeHTML(
                            fact
                        )}
                    </div>`
            ).join("");

    } else {

        results.innerHTML =
            `
            <div class="app-card">
                No results found.
            </div>
            `;

    }

}


/* =========================================================
   MONKEY
========================================================= */

function renderMonkey() {

    monkeyScore = 0;

    appShell(
        "Monkey",
        `

        <h2
            style="
                text-align:center;
            "
        >
            Catch the monkey!
        </h2>

        <p
            style="
                text-align:center;
            "
        >
            Score:
            <strong
                id="monkey-score"
            >
                0
            </strong>
        </p>

        <div
            id="monkey-arena"
            style="
                height:150px;
                border-radius:10px;
                background:#d9f0cf;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:45px;
                cursor:pointer;
            "
            data-action="catch-monkey"
        >
            🐒
        </div>

        <button
            class="pear-button wide"
            data-action="move-monkey"
        >
            Move Monkey
        </button>

        `
    );

}


function moveMonkey() {

    const monkey =
        document.getElementById(
            "monkey-arena"
        );

    if (!monkey) {
        return;
    }

    const positions = [
        "flex-start",
        "center",
        "flex-end"
    ];

    monkey.style.justifyContent =
        positions[
            Math.floor(
                Math.random()*3
            )
        ];

}


function catchMonkey() {

    monkeyScore++;

    const score =
        document.getElementById(
            "monkey-score"
        );

    if (score) {

        score.textContent =
            monkeyScore;

    }

    moveMonkey();

}


/* =========================================================
   REMARK
========================================================= */

let remarks =
    getStorage(
        "pear-remarks",
        []
    );


function renderRemark() {

    appShell(
        "Remark",
        `

        <textarea
            id="remark-input"
            rows="7"
            placeholder="Write something..."
        ></textarea>

        <button
            class="pear-button wide"
            data-action="save-remark"
        >
            Save Remark
        </button>

        <hr>

        ${remarks.map(
            remark =>
                `
                <div class="app-card">
                    ${escapeHTML(
                        remark
                    )}
                </div>
                `
        ).join("")}

        `
    );

}


function saveRemark() {

    const input =
        document.getElementById(
            "remark-input"
        );

    if (
        !input ||
        !input.value.trim()
    ) {

        toast(
            "Write something first"
        );

        return;

    }

    remarks.unshift(
        input.value
    );

    setStorage(
        "pear-remarks",
        remarks
    );

    toast(
        "Remark saved!"
    );

    renderRemark();

}


/* =========================================================
   UNKNOWN APP
========================================================= */

function renderUnknown(name) {

    appShell(
        name,
        `

        <div class="app-card">

            <h2>
                ${escapeHTML(name)}
            </h2>

            <p>
                Pear Phone couldn't find
                this application.
            </p>

        </div>

        `
    );

}


/* =========================================================
   STARTUP
========================================================= */

setPage(1);

createKeyboard();

console.log(
    "🍐 Pear Phone OS loaded successfully."
);

console.log(
    "Hotspots:",
    document.querySelectorAll(
        ".hotspot"
    ).length
);
