// ============================================================
// PEAR PHONE OS
// ============================================================

const phone = document.getElementById("phone-container");
const overlay = document.getElementById("overlay");
const appWindow = document.getElementById("app-window");
const pageDots = document.getElementById("page-dots");

let currentPage = 1;

// ============================================================
// PAGE SWITCHING
// UP = PAGE 2
// DOWN = PAGE 1
// ============================================================

let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;

let mouseStartX = 0;
let mouseStartY = 0;
let mouseDragging = false;

let swipeLocked = false;


// ============================================================
// SHOW PAGE
// ============================================================

function showPage(page) {

  if (page === currentPage) {
    return;
  }

  currentPage = page;

  // Remove any previous animation
  phone.classList.remove(
    "page-switch-up",
    "page-switch-down"
  );

  // Force browser to restart animation
  void phone.offsetWidth;

  // Add the correct animation
  if (page === 2) {
    phone.classList.add(
      "page-switch-up"
    );
  } else {
    phone.classList.add(
      "page-switch-down"
    );
  }

  // Change actual page
  phone.classList.toggle(
    "page-two",
    page === 2
  );

  // Change page dots
  if (pageDots) {
    pageDots.textContent =
      page === 2
        ? "○ ●"
        : "● ○";
  }

  // Close apps when changing pages
  closeApp();

  // Remove animation class after animation
  setTimeout(function () {

    phone.classList.remove(
      "page-switch-up",
      "page-switch-down"
    );

  }, 700);
}


// ============================================================
// KEYBOARD PAGE SWITCHING
// ============================================================

document.addEventListener(
  "keydown",
  function (e) {

    // Don't change pages while typing
    if (
      e.target.matches(
        "input, textarea, select"
      )
    ) {
      return;
    }

    // UP = PAGE 2
    if (e.key === "ArrowUp") {

      e.preventDefault();

      if (currentPage === 1) {
        showPage(2);
      }

    }

    // DOWN = PAGE 1
    if (e.key === "ArrowDown") {

      e.preventDefault();

      if (currentPage === 2) {
        showPage(1);
      }

    }

  }
);


// ============================================================
// TOUCHSCREEN SWIPE
// UP = PAGE 2
// DOWN = PAGE 1
// ============================================================

phone.addEventListener(
  "touchstart",
  function (e) {

    if (
      overlay.classList.contains("open")
    ) {
      return;
    }

    const touch =
      e.touches[0];

    touchStartX =
      touch.clientX;

    touchStartY =
      touch.clientY;

    touchMoved = false;

  },
  {
    passive: true
  }
);


phone.addEventListener(
  "touchmove",
  function (e) {

    if (
      overlay.classList.contains("open")
    ) {
      return;
    }

    const touch =
      e.touches[0];

    const dx =
      touch.clientX -
      touchStartX;

    const dy =
      touch.clientY -
      touchStartY;

    // Only count vertical movement
    if (
      Math.abs(dy) > 30 &&
      Math.abs(dy) > Math.abs(dx)
    ) {

      touchMoved = true;

    }

  },
  {
    passive: true
  }
);


phone.addEventListener(
  "touchend",
  function (e) {

    if (
      overlay.classList.contains("open") ||
      !touchMoved ||
      swipeLocked
    ) {
      return;
    }

    const touch =
      e.changedTouches[0];

    const dx =
      touch.clientX -
      touchStartX;

    const dy =
      touch.clientY -
      touchStartY;

    // Ignore weak or horizontal swipes
    if (
      Math.abs(dy) < 80 ||
      Math.abs(dy) <= Math.abs(dx)
    ) {
      return;
    }

    swipeLocked = true;


    // ========================================
    // SWIPE UP = PAGE 2
    // ========================================

    if (
      dy < 0 &&
      currentPage === 1
    ) {

      showPage(2);

    }


    // ========================================
    // SWIPE DOWN = PAGE 1
    // ========================================

    if (
      dy > 0 &&
      currentPage === 2
    ) {

      showPage(1);

    }


    setTimeout(
      function () {

        swipeLocked = false;

      },
      700
    );

  },
  {
    passive: true
  }
);


// ============================================================
// MOUSE / TRACKPAD
// UP = PAGE 2
// DOWN = PAGE 1
// ============================================================

phone.addEventListener(
  "mousedown",
  function (e) {

    if (
      overlay.classList.contains("open")
    ) {
      return;
    }

    mouseStartX =
      e.clientX;

    mouseStartY =
      e.clientY;

    mouseDragging = true;

  }
);


phone.addEventListener(
  "mouseup",
  function (e) {

    if (!mouseDragging) {
      return;
    }

    mouseDragging = false;

    if (
      overlay.classList.contains("open")
    ) {
      return;
    }

    const dx =
      e.clientX -
      mouseStartX;

    const dy =
      e.clientY -
      mouseStartY;

    // Only vertical drags count
    if (
      Math.abs(dy) < 80 ||
      Math.abs(dy) <= Math.abs(dx)
    ) {
      return;
    }


    // ========================================
    // DRAG UP = PAGE 2
    // ========================================

    if (
      dy < 0 &&
      currentPage === 1
    ) {

      showPage(2);

    }


    // ========================================
    // DRAG DOWN = PAGE 1
    // ========================================

    if (
      dy > 0 &&
      currentPage === 2
    ) {

      showPage(1);

    }

  }
);


// ============================================================
// APP SYSTEM
// ============================================================

function openApp(title, content) {

  appWindow.innerHTML = `

    <div class="app-header">

      <button
        class="back-button"
        onclick="closeApp()"
      >
        ‹
      </button>

      <strong>
        ${title}
      </strong>

    </div>

    <div class="app-content">
      ${content}
    </div>

  `;

  overlay.classList.add("open");
}


function closeApp() {

  stopCamera();

  overlay.classList.remove("open");

  appWindow.innerHTML = "";

}


// ============================================================
// MESSAGES
// ============================================================

function messagesApp() {

  openApp(
    "Messages",
    `

    <div class="card">

      <h3>Messages</h3>

      <button onclick="openChat('Chloe')">
        💬 Chloe
      </button>

      <button onclick="openChat('Sam')">
        💬 Sam
      </button>

      <button onclick="openChat('Cat')">
        💬 Cat
      </button>

      <button onclick="newMessage()">
        ✏️ New Message
      </button>

    </div>

    `
  );

}


function openChat(name) {

  openApp(
    name,
    `

    <div
      id="chat-box"
      class="card"
    >

      <div class="message received">
        Hey! 👋
      </div>

      <div class="message sent">
        Heyyy
      </div>

    </div>

    <div class="chat-input">

      <input
        id="message-input"
        placeholder="Message..."
      />

      <button
        onclick="sendMessage('${name}')"
      >
        Send
      </button>

    </div>

    `
  );

}


function sendMessage(name) {

  const input =
    document.getElementById(
      "message-input"
    );

  if (
    !input ||
    !input.value.trim()
  ) {
    return;
  }

  const chat =
    document.getElementById(
      "chat-box"
    );

  chat.innerHTML += `

    <div class="message sent">
      ${escapeHTML(input.value)}
    </div>

  `;

  input.value = "";

  setTimeout(
    function () {

      chat.innerHTML += `

        <div class="message received">
          ${
            name === "Chloe"
              ? "HAHA okay 😭"
              : "Sounds good!"
          }
        </div>

      `;

    },
    800
  );

}


function newMessage() {

  openApp(
    "New Message",
    `

    <div class="card">

      <input
        id="new-contact"
        placeholder="Contact"
      />

      <br><br>

      <textarea
        id="new-message"
        placeholder="Message..."
      ></textarea>

      <br><br>

      <button
        onclick="alert('Message sent! 📱')"
      >
        Send
      </button>

    </div>

    `
  );

}


// ============================================================
// CAMERA
// ============================================================

let cameraStream = null;


function cameraApp() {

  openApp(
    "Camera",
    `

    <div class="camera-box">

      <video
        id="camera-video"
        autoplay
        playsinline
      ></video>

      <button onclick="startCamera()">
        📷 Start Camera
      </button>

      <button onclick="capturePhoto()">
        ⭕ Capture
      </button>

      <canvas
        id="camera-canvas"
      ></canvas>

      <button onclick="stopCamera()">
        Stop Camera
      </button>

    </div>

    `
  );

  startCamera();

}


async function startCamera() {

  try {

    cameraStream =
      await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false
        });

    const video =
      document.getElementById(
        "camera-video"
      );

    if (video) {
      video.srcObject =
        cameraStream;
    }

  } catch (error) {

    alert(
      "Camera access was not available."
    );

  }

}


function capturePhoto() {

  const video =
    document.getElementById(
      "camera-video"
    );

  const canvas =
    document.getElementById(
      "camera-canvas"
    );

  if (!video || !canvas) {
    return;
  }

  canvas.width =
    video.videoWidth || 640;

  canvas.height =
    video.videoHeight || 480;

  const ctx =
    canvas.getContext("2d");

  ctx.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

}


function stopCamera() {

  if (!cameraStream) {
    return;
  }

  cameraStream
    .getTracks()
    .forEach(
      function (track) {
        track.stop();
      }
    );

  cameraStream = null;

}


// ============================================================
// SPLASHFACE
// ============================================================

function splashfaceApp() {

  openApp(
    "SplashFace",
    `

    <div class="card">

      <h2>👤 SplashFace</h2>

      <div class="post">

        <h3>loganbalbs</h3>

        <p>
          Living my best Pear Phone
          life 🍐📱
        </p>

        <button
          onclick="likePost(this)"
        >
          ♡ Like
        </button>

        <button
          onclick="commentPost()"
        >
          💬 Comment
        </button>

      </div>

      <button
        onclick="newPost()"
      >
        ➕ New Post
      </button>

    </div>

    `
  );

}


function likePost(button) {

  if (
    button.dataset.liked === "true"
  ) {

    button.innerHTML =
      "♡ Like";

    button.dataset.liked =
      "false";

  } else {

    button.innerHTML =
      "♥ Liked";

    button.dataset.liked =
      "true";

  }

}


function commentPost() {

  const comment =
    prompt(
      "Write a comment:"
    );

  if (comment) {

    alert(
      "Comment posted!"
    );

  }

}


function newPost() {

  const post =
    prompt(
      "What's on your mind?"
    );

  if (post) {

    alert(
      "Posted to SplashFace! 📸"
    );

  }

}


// ============================================================
// STOCKS
// ============================================================

let stockData = {

  AAPL: 227.40,
  TSLA: 355.20,
  GOOG: 255.10,
  AMZN: 232.80

};


function stocksApp() {

  let stocksHTML = "";

  Object.keys(stockData)
    .forEach(
      function (symbol) {

        stocksHTML += `

          <div class="stock-row">

            <strong>
              ${symbol}
            </strong>

            <span>
              $${stockData[
                symbol
              ].toFixed(2)}
            </span>

            <button
              onclick="stockDetails('${symbol}')"
            >
              View
            </button>

          </div>

        `;

      }
    );


  openApp(
    "Stocks",
    `

    <div class="card">

      <h2>📈 Stocks</h2>

      ${stocksHTML}

      <button
        onclick="refreshStocks()"
      >
        🔄 Refresh Prices
      </button>

      <button
        onclick="addStock()"
      >
        ➕ Add Stock
      </button>

    </div>

    `
  );

}


function refreshStocks() {

  Object.keys(stockData)
    .forEach(
      function (symbol) {

        const change =
          (Math.random() - 0.5) * 10;

        stockData[symbol] +=
          change;

      }
    );

  stocksApp();

}


function addStock() {

  const symbol =
    prompt(
      "Enter stock symbol:"
    );

  if (!symbol) {
    return;
  }

  const upper =
    symbol.toUpperCase();

  stockData[upper] =
    100 + Math.random() * 200;

  stocksApp();

}


function stockDetails(symbol) {

  alert(
    symbol +
      "\n\nCurrent price: $" +
      stockData[
        symbol
      ].toFixed(2)
  );

}


// ============================================================
// MAPS
// ============================================================

function mapsApp() {

  openApp(
    "Maps",
    `

    <div class="card">

      <h2>🗺️ Maps</h2>

      <input
        id="map-search"
        placeholder="Search a place..."
      />

      <button
        onclick="searchMap()"
      >
        Search
      </button>

      <button
        onclick="routeDemo()"
      >
        🚗 Get Directions
      </button>

      <button
        onclick="locateMe()"
      >
        📍 Find Me
      </button>

      <div id="map-result"></div>

    </div>

    `
  );

}


function searchMap() {

  const input =
    document.getElementById(
      "map-search"
    );

  const result =
    document.getElementById(
      "map-result"
    );

  if (!input || !result) {
    return;
  }

  result.innerHTML = `

    <div class="card">

      📍 Searching for
      <strong>
        ${escapeHTML(
          input.value
        )}
      </strong>

      <br><br>

      Location found!

    </div>

  `;

}


function routeDemo() {

  alert(
    "Route calculated! 🚗\n" +
    "Estimated time: 18 minutes."
  );

}


function locateMe() {

  if (!navigator.geolocation) {

    alert(
      "Location is not available."
    );

    return;
  }

  navigator.geolocation
    .getCurrentPosition(
      function (position) {

        alert(
          "Location found!\n\n" +
          "Latitude: " +
          position.coords.latitude
            .toFixed(4) +
          "\nLongitude: " +
          position.coords.longitude
            .toFixed(4)
        );

      },
      function () {

        alert(
          "Could not access your location."
        );

      }
    );

}


// ============================================================
// PHOTOS
// ============================================================

function photosApp() {

  openApp(
    "Photos",
    `

    <div class="card">

      <h2>🖼️ Photos</h2>

      <input
        type="file"
        accept="image/*"
        multiple
        onchange="loadPhotos(event)"
      />

      <div
        id="photo-grid"
      ></div>

    </div>

    `
  );

}


function loadPhotos(event) {

  const grid =
    document.getElementById(
      "photo-grid"
    );

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  Array.from(
    event.target.files
  ).forEach(
    function (file) {

      const url =
        URL.createObjectURL(
          file
        );

      grid.innerHTML += `

        <img
          src="${url}"
          class="photo-item"
        />

      `;

    }
  );

}


// ============================================================
// WEATHER
// ============================================================

function weatherApp() {

  openApp(
    "Weather",
    `

    <div class="card">

      <h2>☀️ Weather</h2>

      <div class="weather-big">
        22°C
      </div>

      <p>
        Partly cloudy
      </p>

      <hr>

      <p>
        Monday — ☀️ 24°
      </p>

      <p>
        Tuesday — 🌤️ 23°
      </p>

      <p>
        Wednesday — 🌧️ 19°
      </p>

      <p>
        Thursday — ☀️ 25°
      </p>

      <button
        onclick="refreshWeather()"
      >
        🔄 Refresh
      </button>

    </div>

    `
  );

}


function refreshWeather() {

  const temperature =
    Math.floor(
      Math.random() * 15
    ) + 15;

  alert(
    "Updated temperature: " +
    temperature +
    "°C"
  );

}


// ============================================================
// NOTES
// ============================================================

function notesApp() {

  const saved =
    localStorage.getItem(
      "pear-note"
    ) || "";

  openApp(
    "Notes",
    `

    <div class="card">

      <h2>📝 Notes</h2>

      <textarea
        id="notes-area"
        style="height:220px"
        placeholder="Write something..."
      >${escapeHTML(saved)}</textarea>

      <button
        onclick="saveNote()"
      >
        Save
      </button>

      <button
        onclick="clearNote()"
      >
        Clear
      </button>

    </div>

    `
  );

}


function saveNote() {

  const textarea =
    document.getElementById(
      "notes-area"
    );

  if (!textarea) {
    return;
  }

  localStorage.setItem(
    "pear-note",
    textarea.value
  );

  alert(
    "Note saved! 📝"
  );

}


function clearNote() {

  localStorage.removeItem(
    "pear-note"
  );

  const textarea =
    document.getElementById(
      "notes-area"
    );

  if (textarea) {
    textarea.value = "";
  }

}


// ============================================================
// PEARTUNES
// ============================================================

let musicIndex = 0;

const demoSongs = [

  "Pear Dreams",
  "Midnight Drive",
  "Pixel Paradise",
  "Fruit Juice"

];


function pearTunesApp() {

  openApp(
    "PearTunes",
    `

    <div class="card">

      <h2>🎵 PearTunes</h2>

      <div id="song-title">

        ${demoSongs[
          musicIndex
        ]}

      </div>

      <button
        onclick="playDemoTone()"
      >
        ▶ Play
      </button>

      <button
        onclick="nextSong()"
      >
        ⏭ Next
      </button>

      <br><br>

      <input
        type="file"
        accept="audio/*"
        onchange="loadAudio(event)"
      />

      <audio
        id="audio-player"
        controls
        style="width:100%;margin-top:15px"
      ></audio>

    </div>

    `
  );

}


function playDemoTone() {

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

  oscillator.frequency.value =
    440;

  oscillator.connect(gain);

  gain.connect(
    context.destination
  );

  oscillator.start();

  gain.gain
    .exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + 1
    );

  oscillator.stop(
    context.currentTime + 1
  );

}


function nextSong() {

  musicIndex++;

  if (
    musicIndex >=
    demoSongs.length
  ) {
    musicIndex = 0;
  }

  const title =
    document.getElementById(
      "song-title"
    );

  if (title) {

    title.textContent =
      demoSongs[
        musicIndex
      ];

  }

}


function loadAudio(event) {

  const file =
    event.target.files[0];

  if (!file) {
    return;
  }

  const player =
    document.getElementById(
      "audio-player"
    );

  player.src =
    URL.createObjectURL(
      file
    );

}


// ============================================================
// SETTINGS
// ============================================================

function settingsApp() {

  openApp(
    "Settings",
    `

    <div class="card">

      <h2>⚙️ Settings</h2>

      <button
        onclick="toggleDarkMode()"
      >
        🌙 Toggle Dark Mode
      </button>

      <button
        onclick="toggleSound()"
      >
        🔊 Toggle Sound
      </button>

      <button
        onclick="resetPhone()"
      >
        🔄 Reset Phone
      </button>

    </div>

    `
  );

}


function toggleDarkMode() {

  document.body.classList.toggle(
    "dark-mode"
  );

  localStorage.setItem(
    "pear-dark",
    document.body.classList.contains(
      "dark-mode"
    )
  );

}


function toggleSound() {

  const current =
    localStorage.getItem(
      "pear-sound"
    ) !== "false";

  localStorage.setItem(
    "pear-sound",
    !current
  );

  alert(
    "Sound " +
      (!current
        ? "enabled"
        : "disabled")
  );

}


function resetPhone() {

  localStorage.clear();

  document.body.classList.remove(
    "dark-mode"
  );

  alert(
    "Pear Phone reset!"
  );

}


// ============================================================
// CLOCK
// ============================================================

let stopwatchInterval = null;
let stopwatchSeconds = 0;

let timerInterval = null;
let timerSeconds = 60;


function clockApp() {

  openApp(
    "Clock",
    `

    <div class="card">

      <h2>🕐 Clock</h2>

      <div id="live-clock">
        ${new Date()
          .toLocaleTimeString()}
      </div>

      <hr>

      <h3>
        Stopwatch
      </h3>

      <div id="stopwatch">
        00:00
      </div>

      <button
        onclick="startStopwatch()"
      >
        Start
      </button>

      <button
        onclick="stopStopwatch()"
      >
        Stop
      </button>

      <button
        onclick="resetStopwatch()"
      >
        Reset
      </button>

      <hr>

      <h3>
        Timer
      </h3>

      <div id="timer">
        01:00
      </div>

      <button
        onclick="startTimer()"
      >
        Start Timer
      </button>

      <button
        onclick="resetTimer()"
      >
        Reset Timer
      </button>

    </div>

    `
  );

  updateClock();

}


function updateClock() {

  const clock =
    document.getElementById(
      "live-clock"
    );

  if (clock) {

    clock.textContent =
      new Date()
        .toLocaleTimeString();

  }

}


setInterval(
  updateClock,
  1000
);


function startStopwatch() {

  if (stopwatchInterval) {
    return;
  }

  stopwatchInterval =
    setInterval(
      function () {

        stopwatchSeconds++;

        const element =
          document.getElementById(
            "stopwatch"
          );

        if (element) {

          element.textContent =
            formatTime(
              stopwatchSeconds
            );

        }

      },
      1000
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

  stopwatchSeconds = 0;

  const element =
    document.getElementById(
      "stopwatch"
    );

  if (element) {

    element.textContent =
      "00:00";

  }

}


function startTimer() {

  if (timerInterval) {
    return;
  }

  timerInterval =
    setInterval(
      function () {

        timerSeconds--;

        const element =
          document.getElementById(
            "timer"
          );

        if (element) {

          element.textContent =
            formatTime(
              timerSeconds
            );

        }

        if (
          timerSeconds <= 0
        ) {

          clearInterval(
            timerInterval
          );

          timerInterval =
            null;

          alert(
            "Timer finished! ⏰"
          );

        }

      },
      1000
    );

}


function resetTimer() {

  clearInterval(
    timerInterval
  );

  timerInterval = null;

  timerSeconds = 60;

  const element =
    document.getElementById(
      "timer"
    );

  if (element) {

    element.textContent =
      "01:00";

  }

}


function formatTime(seconds) {

  const minutes =
    Math.floor(
      seconds / 60
    );

  const secs =
    seconds % 60;

  return (
    String(minutes)
      .padStart(2, "0") +
    ":" +
    String(secs)
      .padStart(2, "0")
  );

}


// ============================================================
// VIDEOS
// ============================================================

function videosApp() {

  openApp(
    "Videos",
    `

    <div class="card">

      <h2>🎬 Videos</h2>

      <input
        type="file"
        accept="video/*"
        onchange="loadVideo(event)"
      />

      <video
        id="video-player"
        controls
        style="
          width:100%;
          margin-top:15px;
        "
      ></video>

      <button
        onclick="fullscreenVideo()"
      >
        ⛶ Fullscreen
      </button>

    </div>

    `
  );

}


function loadVideo(event) {

  const file =
    event.target.files[0];

  if (!file) {
    return;
  }

  const video =
    document.getElementById(
      "video-player"
    );

  video.src =
    URL.createObjectURL(
      file
    );

}


function fullscreenVideo() {

  const video =
    document.getElementById(
      "video-player"
    );

  if (!video) {
    return;
  }

  if (
    video.requestFullscreen
  ) {

    video.requestFullscreen();

  }

}


// ============================================================
// PHONE
// ============================================================

let phoneNumber = "";


function phoneApp() {

  openApp(
    "Phone",
    `

    <div class="card">

      <h2>📞 Phone</h2>

      <div
        id="phone-number"
        style="
          font-size:25px;
          text-align:center;
        "
      >
        —
      </div>

      <div class="keypad">

        ${
          [
            "1","2","3",
            "4","5","6",
            "7","8","9",
            "*","0","#"
          ]
          .map(
            function (n) {

              return `

                <button
                  onclick="pressNumber('${n}')"
                >
                  ${n}
                </button>

              `;

            }
          )
          .join("")
        }

      </div>

      <button
        onclick="makeCall()"
      >
        📞 Call
      </button>

      <button
        onclick="clearNumber()"
      >
        Clear
      </button>

    </div>

    `
  );

}


function pressNumber(number) {

  phoneNumber +=
    number;

  const display =
    document.getElementById(
      "phone-number"
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
      "phone-number"
    );

  if (display) {

    display.textContent =
      "—";

  }

}


function makeCall() {

  if (!phoneNumber) {

    alert(
      "Enter a number first."
    );

    return;
  }

  alert(
    "Calling " +
      phoneNumber +
      "..."
  );

}


// ============================================================
// MAIL
// ============================================================

const emails = [

  {
    from: "Pear Team",
    subject: "Welcome!",
    body:
      "Welcome to your Pear Phone!"
  },

  {
    from: "Sam",
    subject: "What's up?",
    body:
      "Are you free later?"
  },

  {
    from: "PearTunes",
    subject: "New music",
    body:
      "Check out the latest tracks."
  }

];


function mailApp() {

  let html = `

    <div class="card">

      <h2>✉️ Mail</h2>

  `;

  emails.forEach(
    function (email, index) {

      html += `

        <button
          onclick="readEmail(${index})"
          style="
            text-align:left;
          "
        >

          <strong>
            ${email.from}
          </strong>

          <br>

          ${email.subject}

        </button>

      `;

    }
  );

  html += `

      <button
        onclick="composeEmail()"
      >
        ✏️ Compose
      </button>

    </div>

  `;

  openApp(
    "Mail",
    html
  );

}


function readEmail(index) {

  const email =
    emails[index];

  openApp(
    "Mail",
    `

    <div class="card">

      <h2>
        ${escapeHTML(
          email.subject
        )}
      </h2>

      <strong>
        From:
        ${escapeHTML(
          email.from
        )}
      </strong>

      <p>
        ${escapeHTML(
          email.body
        )}
      </p>

    </div>

    `
  );

}


function composeEmail() {

  openApp(
    "Compose",
    `

    <div class="card">

      <input
        placeholder="To"
      >

      <input
        placeholder="Subject"
      >

      <textarea
        placeholder="Write email..."
      ></textarea>

      <button
        onclick="alert('Email sent! ✉️')"
      >
        Send
      </button>

    </div>

    `
  );

}


// ============================================================
// COMPASS
// ============================================================

function compassApp() {

  openApp(
    "Compass",
    `

    <div
      class="card"
      style="
        text-align:center;
      "
    >

      <h2>🧭 Compass</h2>

      <div
        id="compass-direction"
        style="
          font-size:50px;
        "
      >
        N
      </div>

      <p
        id="compass-degree"
      >
        0°
      </p>

      <button
        onclick="calibrateCompass()"
      >
        Calibrate
      </button>

    </div>

    `
  );

}


function calibrateCompass() {

  const directions = [

    ["N", 0],
    ["NE", 45],
    ["E", 90],
    ["SE", 135],
    ["S", 180],
    ["SW", 225],
    ["W", 270],
    ["NW", 315]

  ];

  const random =
    directions[
      Math.floor(
        Math.random() *
        directions.length
      )
    ];

  const direction =
    document.getElementById(
      "compass-direction"
    );

  const degree =
    document.getElementById(
      "compass-degree"
    );

  if (direction) {

    direction.textContent =
      random[0];

  }

  if (degree) {

    degree.textContent =
      random[1] + "°";

  }

}


// ============================================================
// PAGE 2 APPS
// ============================================================

function lingoApp() {

  openApp(
    "Lingo",
    `

    <div class="card">

      <h2>🗣️ Lingo</h2>

      <p>
        Translate a word:
      </p>

      <input
        id="lingo-input"
        placeholder="Type something..."
      >

      <button
        onclick="translateLingo()"
      >
        Translate
      </button>

      <div
        id="lingo-result"
      ></div>

    </div>

    `
  );

}


function translateLingo() {

  const input =
    document.getElementById(
      "lingo-input"
    );

  const result =
    document.getElementById(
      "lingo-result"
    );

  if (!input || !result) {
    return;
  }

  result.innerHTML = `

    <h3>
      Translation
    </h3>

    🍐
    ${escapeHTML(
      input.value
    )}

  `;

}


function thumbApp() {

  openApp(
    "Thumb",
    `

    <div
      class="card"
      style="
        text-align:center;
      "
    >

      <h2>👍 Thumb</h2>

      <div
        id="thumb"
        style="
          font-size:90px;
        "
      >
        👍
      </div>

      <button
        onclick="changeThumb()"
      >
        Tap Me
      </button>

    </div>

    `
  );

}


function changeThumb() {

  const thumb =
    document.getElementById(
      "thumb"
    );

  if (!thumb) {
    return;
  }

  thumb.textContent =
    thumb.textContent === "👍"
      ? "👎"
      : "👍";

}


function danwarpApp() {

  openApp(
    "DanWarp",
    `

    <div class="card">

      <h2>🌀 DanWarp</h2>

      <p>
        Ready to warp?
      </p>

      <button
        onclick="warp()"
      >
        WARP!
      </button>

      <div
        id="warp-result"
      ></div>

    </div>

    `
  );

}


function warp() {

  const result =
    document.getElementById(
      "warp-result"
    );

  if (result) {

    result.innerHTML = `

      <h2>
        ⚡ WARP COMPLETE!
      </h2>

      <p>
        You have been transported.
      </p>

    `;

  }

}


function imageApp() {

  openApp(
    "Image",
    `

    <div class="card">

      <h2>🖼️ Image</h2>

      <input
        type="file"
        accept="image/*"
        onchange="loadSingleImage(event)"
      >

      <div
        id="single-image"
      ></div>

    </div>

    `
  );

}


function loadSingleImage(event) {

  const file =
    event.target.files[0];

  if (!file) {
    return;
  }

  const image =
    document.getElementById(
      "single-image"
    );

  image.innerHTML = `

    <img
      src="${URL.createObjectURL(file)}"
      style="
        width:100%;
        border-radius:12px;
      "
    >

  `;

}


function chronoApp() {

  openApp(
    "Chrono",
    `

    <div class="card">

      <h2>⏱️ Chrono</h2>

      <div
        id="chrono-time"
        style="
          font-size:50px;
          text-align:center;
        "
      >
        ${new Date()
          .toLocaleTimeString()}
      </div>

      <button
        onclick="chronoAlert()"
      >
        Time Check
      </button>

    </div>

    `
  );

}


function chronoAlert() {

  alert(
    "Current time:\n" +
    new Date()
      .toLocaleTimeString()
  );

}


function zaplookApp() {

  openApp(
    "ZapLook",
    `

    <div class="card">

      <h2>⚡ ZapLook</h2>

      <input
        id="zap-input"
        placeholder="Search..."
      >

      <button
        onclick="zapSearch()"
      >
        Search
      </button>

      <div
        id="zap-result"
      ></div>

    </div>

    `
  );

}


function zapSearch() {

  const input =
    document.getElementById(
      "zap-input"
    );

  const result =
    document.getElementById(
      "zap-result"
    );

  if (!input || !result) {
    return;
  }

  result.innerHTML = `

    <div class="card">

      Results for:

      <strong>
        ${escapeHTML(
          input.value
        )}
      </strong>

    </div>

  `;

}


function monkeyApp() {

  openApp(
    "Monkey",
    `

    <div
      class="card"
      style="
        text-align:center;
      "
    >

      <h2>🐒 Monkey</h2>

      <div
        id="monkey"
        style="
          font-size:100px;
        "
      >
        🐒
      </div>

      <button
        onclick="monkeyJump()"
      >
        Make Monkey Jump
      </button>

    </div>

    `
  );

}


function monkeyJump() {

  const monkey =
    document.getElementById(
      "monkey"
    );

  if (!monkey) {
    return;
  }

  monkey.style.transform =
    "translateY(-50px)";

  setTimeout(
    function () {

      monkey.style.transform =
        "translateY(0)";

    },
    400
  );

}


function remarkApp() {

  openApp(
    "Remark",
    `

    <div class="card">

      <h2>💭 Remark</h2>

      <textarea
        id="remark-text"
        placeholder="Write a remark..."
      ></textarea>

      <button
        onclick="saveRemark()"
      >
        Save Remark
      </button>

    </div>

    `
  );

}


function saveRemark() {

  const text =
    document.getElementById(
      "remark-text"
    );

  if (!text) {
    return;
  }

  localStorage.setItem(
    "pear-remark",
    text.value
  );

  alert(
    "Remark saved!"
  );

}


// ============================================================
// PAGE 2 CONNECTIONS
// ============================================================

function connectPage2Apps() {

  const connections = {

    "p2-lingo":
      lingoApp,

    "p2-splash":
      splashfaceApp,

    "p2-thumb":
      thumbApp,

    "p2-danwarp":
      danwarpApp,

    "p2-image":
      imageApp,

    "p2-chrono":
      chronoApp,

    "p2-zaplook":
      zaplookApp,

    "p2-weather":
      weatherApp,

    "p2-music":
      pearTunesApp,

    "p2-monkey":
      monkeyApp,

    "p2-remark":
      remarkApp,

    "p2-settings":
      settingsApp,

    "p2-phone":
      phoneApp,

    "p2-mail":
      mailApp,

    "p2-compass":
      compassApp,

    "p2-music2":
      pearTunesApp

  };


  Object.keys(connections)
    .forEach(
      function (id) {

        const button =
          document.getElementById(
            id
          );

        if (button) {

          button.addEventListener(
            "click",
            function (e) {

              e.stopPropagation();

              connections[id]();

            }
          );

        }

      }
    );

}


// ============================================================
// PAGE 1 CONNECTIONS
// ============================================================

function connectPage1Apps() {

  const connections = {

    messages:
      messagesApp,

    camera:
      cameraApp,

    splashface:
      splashfaceApp,

    stocks:
      stocksApp,

    maps:
      mapsApp,

    photos:
      photosApp,

    weather:
      weatherApp,

    notes:
      notesApp,

    peartunes:
      pearTunesApp,

    settings:
      settingsApp,

    clock:
      clockApp,

    videos:
      videosApp,

    phone:
      phoneApp,

    mail:
      mailApp,

    compass:
      compassApp,

    music:
      pearTunesApp

  };


  Object.keys(connections)
    .forEach(
      function (id) {

        const button =
          document.getElementById(
            id
          );

        if (button) {

          button.addEventListener(
            "click",
            function (e) {

              e.stopPropagation();

              connections[id]();

            }
          );

        }

      }
    );

}


// ============================================================
// HOME BUTTON
// ============================================================

const homeButton =
  document.getElementById(
    "home"
  );

if (homeButton) {

  homeButton.addEventListener(
    "click",
    function (e) {

      e.stopPropagation();

      closeApp();

    }
  );

}


// ============================================================
// UTILITY
// ============================================================

function escapeHTML(value) {

  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


// ============================================================
// STARTUP
// ============================================================

connectPage1Apps();

connectPage2Apps();


// Restore dark mode
if (
  localStorage.getItem(
    "pear-dark"
  ) === "true"
) {

  document.body.classList.add(
    "dark-mode"
  );

}


// Always start on Page 1
currentPage = 1;

phone.classList.remove(
  "page-two"
);

if (pageDots) {

  pageDots.textContent =
    "● ○";

}
