// ============================================================
// PEAR PHONE OS — FIXED APP.JS
// ============================================================

const phone = document.getElementById("phone-container");
const overlay = document.getElementById("overlay");
const appWindow = document.getElementById("app-window");

let currentPage = phone && phone.classList.contains("page-two") ? 2 : 1;


// ============================================================
// PAGE SWITCHING
// SWIPE UP = PAGE 2
// SWIPE DOWN = PAGE 1
// ============================================================

let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;

let mouseStartX = 0;
let mouseStartY = 0;
let mouseDragging = false;

let swipeLocked = false;


function syncCurrentPage() {

  currentPage =
    phone.classList.contains("page-two")
      ? 2
      : 1;

}


function showPage(page) {

  if (!phone) return;

  if (page !== 1 && page !== 2) return;

  if (page === currentPage) return;

  currentPage = page;

  if (page === 2) {

    phone.classList.add("page-two");

  } else {

    phone.classList.remove("page-two");

  }

  closeApp();

}


// ============================================================
// KEYBOARD PAGE SWITCHING
// ============================================================

document.addEventListener("keydown", e => {

  const target = e.target;

  if (
    target &&
    (
      target.matches("input") ||
      target.matches("textarea") ||
      target.matches("select")
    )
  ) {

    return;

  }

  syncCurrentPage();

  if (
    e.key === "ArrowUp" &&
    currentPage === 1
  ) {

    e.preventDefault();

    showPage(2);

  }

  if (
    e.key === "ArrowDown" &&
    currentPage === 2
  ) {

    e.preventDefault();

    showPage(1);

  }

});


// ============================================================
// TOUCH PAGE SWITCHING
// ============================================================

phone.addEventListener(
  "touchstart",
  e => {

    if (
      overlay &&
      overlay.classList.contains("open")
    ) {

      return;

    }

    if (!e.touches || !e.touches[0]) {

      return;

    }

    const touch = e.touches[0];

    touchStartX = touch.clientX;

    touchStartY = touch.clientY;

    touchMoved = false;

  },
  {
    passive: true
  }
);


phone.addEventListener(
  "touchmove",
  e => {

    if (
      overlay &&
      overlay.classList.contains("open")
    ) {

      return;

    }

    if (!e.touches || !e.touches[0]) {

      return;

    }

    const touch = e.touches[0];

    const dx =
      touch.clientX -
      touchStartX;

    const dy =
      touch.clientY -
      touchStartY;

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
  e => {

    if (
      !touchMoved ||
      swipeLocked
    ) {

      return;

    }

    if (
      overlay &&
      overlay.classList.contains("open")
    ) {

      return;

    }

    if (
      !e.changedTouches ||
      !e.changedTouches[0]
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

    if (
      Math.abs(dy) < 80 ||
      Math.abs(dy) <= Math.abs(dx)
    ) {

      return;

    }

    syncCurrentPage();

    swipeLocked = true;

    if (
      dy < 0 &&
      currentPage === 1
    ) {

      showPage(2);

    }

    else if (
      dy > 0 &&
      currentPage === 2
    ) {

      showPage(1);

    }

    setTimeout(() => {

      swipeLocked = false;

    }, 250);

  },
  {
    passive: true
  }
);


// ============================================================
// MOUSE / TRACKPAD SWIPING
// ============================================================

phone.addEventListener(
  "mousedown",
  e => {

    if (
      overlay &&
      overlay.classList.contains("open")
    ) {

      return;

    }

    mouseStartX = e.clientX;

    mouseStartY = e.clientY;

    mouseDragging = true;

  }
);


phone.addEventListener(
  "mouseup",
  e => {

    if (!mouseDragging) {

      return;

    }

    mouseDragging = false;

    if (
      overlay &&
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

    if (
      Math.abs(dy) < 80 ||
      Math.abs(dy) <= Math.abs(dx)
    ) {

      return;

    }

    syncCurrentPage();

    if (
      dy < 0 &&
      currentPage === 1
    ) {

      showPage(2);

    }

    else if (
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

  if (!overlay || !appWindow) {

    return;

  }

  // Always completely replace the current app.
  // This guarantees that only the selected app is open.

  stopCamera();
  stopTypingGame();

  hidePearKeyboard();

  appWindow.innerHTML = `

    <div class="window-header">

      <button
        class="back"
        type="button"
        onclick="closeApp()"
      >
        ‹
      </button>

      <strong>
        ${escapeHTML(title)}
      </strong>

    </div>

    <div class="window-body">

      ${content}

    </div>

  `;

  overlay.classList.add("open");

  addKeyboardSupport();

}


function closeApp() {

  stopCamera();
  stopTypingGame();

  hidePearKeyboard();

  if (overlay) {

    overlay.classList.remove("open");

  }

  if (appWindow) {

    appWindow.innerHTML = "";

  }

}


// ============================================================
// CUSTOM PEAR KEYBOARD
// ============================================================

let keyboardVisible = false;

let keyboardShift = false;

let keyboardNumbers = false;

let keyboardTarget = null;


function addKeyboardSupport() {

  if (!appWindow) return;

  setTimeout(() => {

    const fields =
      appWindow.querySelectorAll(
        "input[type='text'], " +
        "input:not([type]), " +
        "textarea"
      );

    fields.forEach(field => {

      field.addEventListener(
        "focus",
        () => {

          showPearKeyboard(field);

        }
      );

      field.addEventListener(
        "click",
        () => {

          showPearKeyboard(field);

        }
      );

    });

  }, 0);

}


function showPearKeyboard(input) {

  if (!input) return;

  keyboardTarget = input;

  keyboardVisible = true;

  let keyboard =
    document.getElementById(
      "pear-keyboard"
    );

  if (!keyboard) {

    keyboard =
      document.createElement("div");

    keyboard.id =
      "pear-keyboard";

    keyboard.innerHTML = `

      <div class="pear-keyboard-row">

        ${"QWERTYUIOP".split("").map(
          key => `
            <button
              type="button"
              data-key="${key}"
              onclick="keyboardKey('${key}')"
            >
              ${key}
            </button>
          `
        ).join("")}

      </div>

      <div class="pear-keyboard-row">

        ${"ASDFGHJKL".split("").map(
          key => `
            <button
              type="button"
              data-key="${key}"
              onclick="keyboardKey('${key}')"
            >
              ${key}
            </button>
          `
        ).join("")}

      </div>

      <div class="pear-keyboard-row">

        <button
          type="button"
          onclick="keyboardShiftKey()"
        >
          ⇧
        </button>

        ${"ZXCVBNM".split("").map(
          key => `
            <button
              type="button"
              data-key="${key}"
              onclick="keyboardKey('${key}')"
            >
              ${key}
            </button>
          `
        ).join("")}

        <button
          type="button"
          onclick="keyboardBackspace()"
        >
          ⌫
        </button>

      </div>

      <div class="pear-keyboard-row bottom">

        <button
          type="button"
          onclick="keyboardNumber()"
        >
          123
        </button>

        <button
          type="button"
          onclick="keyboardSpace()"
        >
          SPACE
        </button>

        <button
          type="button"
          onclick="keyboardEnter()"
        >
          ↵
        </button>

      </div>

    `;

    overlay.appendChild(keyboard);

  }

  keyboard.style.display = "block";

  requestAnimationFrame(() => {

    keyboard.classList.add(
      "keyboard-show"
    );

  });

  updateKeyboardLabels();

}


function hidePearKeyboard() {

  const keyboard =
    document.getElementById(
      "pear-keyboard"
    );

  keyboardVisible = false;

  keyboardTarget = null;

  keyboardShift = false;

  keyboardNumbers = false;

  if (!keyboard) {

    return;

  }

  keyboard.classList.remove(
    "keyboard-show"
  );

  setTimeout(() => {

    if (!keyboardVisible) {

      keyboard.style.display =
        "none";

    }

  }, 280);

}


function getFocusedField() {

  if (
    keyboardTarget &&
    document.body.contains(
      keyboardTarget
    )
  ) {

    return keyboardTarget;

  }

  const active =
    document.activeElement;

  if (
    active &&
    (
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA"
    )
  ) {

    return active;

  }

  return null;

}


function insertText(field, text) {

  if (!field) return;

  const start =
    field.selectionStart ??
    field.value.length;

  const end =
    field.selectionEnd ??
    field.value.length;

  field.value =
    field.value.slice(0, start) +
    text +
    field.value.slice(end);

  const position =
    start + text.length;

  field.setSelectionRange(
    position,
    position
  );

  field.dispatchEvent(
    new Event(
      "input",
      {
        bubbles: true
      }
    )
  );

}


function keyboardKey(key) {

  const field =
    getFocusedField();

  if (!field) return;

  let character = key;

  if (!keyboardNumbers) {

    character =
      keyboardShift
        ? key.toUpperCase()
        : key.toLowerCase();

  }

  else {

    const numbers = {

      Q: "1",
      W: "2",
      E: "3",
      R: "4",
      T: "5",
      Y: "6",
      U: "7",
      I: "8",
      O: "9",
      P: "0",

      A: "@",
      S: "#",
      D: "$",
      F: "%",
      G: "&",
      H: "*",
      J: "(",
      K: ")",
      L: "-",

      Z: "_",
      X: "+",
      C: "=",
      V: "/",
      B: "?",
      N: "!",
      M: "."

    };

    character =
      numbers[key] || key;

  }

  insertText(
    field,
    character
  );

  if (keyboardShift) {

    keyboardShift = false;

    updateKeyboardLabels();

  }

}


function keyboardBackspace() {

  const field =
    getFocusedField();

  if (!field) return;

  const start =
    field.selectionStart ??
    field.value.length;

  const end =
    field.selectionEnd ??
    field.value.length;

  if (start !== end) {

    field.value =
      field.value.slice(0, start) +
      field.value.slice(end);

    field.setSelectionRange(
      start,
      start
    );

  }

  else if (start > 0) {

    field.value =
      field.value.slice(0, start - 1) +
      field.value.slice(end);

    field.setSelectionRange(
      start - 1,
      start - 1
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

}


function keyboardSpace() {

  const field =
    getFocusedField();

  if (!field) return;

  insertText(
    field,
    " "
  );

}


function keyboardShiftKey() {

  keyboardShift =
    !keyboardShift;

  updateKeyboardLabels();

}


function keyboardNumber() {

  keyboardNumbers =
    !keyboardNumbers;

  updateKeyboardLabels();

}


function updateKeyboardLabels() {

  const keyboard =
    document.getElementById(
      "pear-keyboard"
    );

  if (!keyboard) return;

  const buttons =
    keyboard.querySelectorAll(
      "[data-key]"
    );

  buttons.forEach(button => {

    const key =
      button.dataset.key;

    if (keyboardNumbers) {

      const numberMap = {

        Q:"1",
        W:"2",
        E:"3",
        R:"4",
        T:"5",
        Y:"6",
        U:"7",
        I:"8",
        O:"9",
        P:"0",

        A:"@",
        S:"#",
        D:"$",
        F:"%",
        G:"&",
        H:"*",
        J:"(",
        K:")",
        L:"-",

        Z:"_",
        X:"+",
        C:"=",
        V:"/",
        B:"?",
        N:"!",
        M:"."

      };

      button.textContent =
        numberMap[key] || key;

    }

    else {

      button.textContent =
        keyboardShift
          ? key.toUpperCase()
          : key.toLowerCase();

    }

  });

}


function keyboardEnter() {

  // Enter ALWAYS hides the Pear keyboard.

  hidePearKeyboard();

  const field =
    getFocusedField();

  if (field) {

    field.blur();

  }

}


// ============================================================
// CAMERA CLEANUP
// ============================================================

let cameraStream = null;


function stopCamera() {

  if (!cameraStream) {

    return;

  }

  cameraStream
    .getTracks()
    .forEach(track => {

      track.stop();

    });

  cameraStream = null;

}


// ============================================================
// TYPING GAME CLEANUP
// ============================================================

let typingTimer = null;


function stopTypingGame() {

  if (typingTimer) {

    clearInterval(
      typingTimer
    );

    typingTimer = null;

  }

}


// ============================================================
// HTML ESCAPING
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

}// ============================================================
// MESSAGES
// ============================================================

let messages = [
  {
    text: "Hey! Welcome to Pear Phone 🍐",
    me: false
  },
  {
    text: "This phone is actually pretty cool.",
    me: true
  }
];

function messagesApp() {

  openApp(
    "Messages",
    `
      <div class="card">

        <h2>💬 Messages</h2>

        <div
          id="messages-list"
          style="
            display:flex;
            flex-direction:column;
            gap:6px;
            margin-bottom:10px;
          "
        >

          ${messages.map(message => `

            <div
              class="bubble ${message.me ? "me" : ""}"
            >

              ${escapeHTML(message.text)}

            </div>

          `).join("")}

        </div>

        <div
          class="row"
          style="align-items:center"
        >

          <input
            id="message-input"
            type="text"
            placeholder="iMessage..."
            style="flex:1"
          >

          <button
            class="button"
            type="button"
            onclick="sendMessage()"
          >
            Send
          </button>

        </div>

        <br>

        <button
          class="button"
          type="button"
          onclick="fakeMessage()"
        >
          📩 Receive Message
        </button>

        <button
          class="button"
          type="button"
          onclick="clearMessages()"
        >
          🗑️ Clear
        </button>

      </div>
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

    return;

  }

  messages.push({
    text: input.value,
    me: true
  });

  messagesApp();

}


function fakeMessage() {

  const incoming = [

    "What are you doing? 👀",

    "Your Pear Phone is insane 😂",

    "Call me when you get this.",

    "🍐🍐🍐",

    "Did you see that?!",

    "I need your help lol",

    "This is a test message.",

    "PEAR PHONE!!!"

  ];

  messages.push({
    text:
      incoming[
        Math.floor(
          Math.random() *
          incoming.length
        )
      ],
    me: false
  });

  messagesApp();

}


function clearMessages() {

  messages = [];

  messagesApp();

}


// ============================================================
// CAMERA
// ============================================================

async function cameraApp() {

  openApp(
    "Camera",
    `
      <div class="card">

        <h2>📷 Camera</h2>

        <video
          id="camera-video"
          class="camera-video"
          autoplay
          playsinline
        ></video>

        <div
          class="row"
          style="
            margin-top:8px;
            flex-wrap:wrap;
          "
        >

          <button
            class="button"
            type="button"
            onclick="startCamera()"
          >
            ▶ Start Camera
          </button>

          <button
            class="button"
            type="button"
            onclick="takePhoto()"
          >
            📸 Take Photo
          </button>

          <button
            class="button"
            type="button"
            onclick="stopCamera()"
          >
            ⏹ Stop
          </button>

        </div>

        <canvas
          id="camera-canvas"
          style="
            display:none;
            width:100%;
            margin-top:10px;
            border-radius:14px;
          "
        ></canvas>

        <div
          id="camera-status"
          style="
            margin-top:8px;
            font-size:13px;
          "
        >
          Camera ready.
        </div>

      </div>
    `
  );

  await startCamera();

}


async function startCamera() {

  const video =
    document.getElementById(
      "camera-video"
    );

  const status =
    document.getElementById(
      "camera-status"
    );

  if (!video) return;

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    if (status) {

      status.textContent =
        "Camera access is not supported here.";

    }

    return;

  }

  stopCamera();

  try {

    cameraStream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

    video.srcObject =
      cameraStream;

    if (status) {

      status.textContent =
        "Camera connected ✓";

    }

  } catch (error) {

    if (status) {

      status.textContent =
        "Camera permission was denied or unavailable.";

    }

    console.error(
      "Pear Phone camera:",
      error
    );

  }

}


function takePhoto() {

  const video =
    document.getElementById(
      "camera-video"
    );

  const canvas =
    document.getElementById(
      "camera-canvas"
    );

  const status =
    document.getElementById(
      "camera-status"
    );

  if (
    !video ||
    !canvas ||
    !video.videoWidth
  ) {

    if (status) {

      status.textContent =
        "Start the camera first.";

    }

    return;

  }

  canvas.width =
    video.videoWidth;

  canvas.height =
    video.videoHeight;

  const context =
    canvas.getContext("2d");

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  canvas.style.display =
    "block";

  if (status) {

    status.textContent =
      "Photo captured! 📸";

  }

}


// ============================================================
// SPLASHFACE
// ============================================================

let splashPosts = [
  {
    user: "PearUser",
    text: "Just got my Pear Phone 🍐",
    likes: 12
  },
  {
    user: "Dan",
    text: "This thing is actually amazing.",
    likes: 7
  },
  {
    user: "PearFan",
    text: "Pear OS forever!",
    likes: 21
  }
];


function splashfaceApp() {

  openApp(
    "SplashFace",
    `
      <div class="card">

        <h2>📱 SplashFace</h2>

        <input
          id="splash-input"
          type="text"
          placeholder="What's happening?"
        >

        <button
          class="button"
          type="button"
          onclick="postSplash()"
        >
          Post
        </button>

        <button
          class="button"
          type="button"
          onclick="randomSplash()"
        >
          ✨ Random Post
        </button>

        <div
          id="splash-feed"
          style="margin-top:10px"
        >

          ${renderSplashPosts()}

        </div>

      </div>
    `
  );

}


function renderSplashPosts() {

  return splashPosts.map(
    (post, index) => `

      <div
        class="card"
        style="
          margin-bottom:8px;
          padding:10px;
        "
      >

        <strong>
          @${escapeHTML(post.user)}
        </strong>

        <p>
          ${escapeHTML(post.text)}
        </p>

        <button
          class="button"
          type="button"
          onclick="likeSplash(${index})"
        >
          ❤️ ${post.likes}
        </button>

      </div>

    `
  ).join("");

}


function postSplash() {

  const input =
    document.getElementById(
      "splash-input"
    );

  if (
    !input ||
    !input.value.trim()
  ) {

    return;

  }

  splashPosts.unshift({
    user: "You",
    text: input.value,
    likes: 0
  });

  splashfaceApp();

}


function likeSplash(index) {

  if (
    !splashPosts[index]
  ) {

    return;

  }

  splashPosts[index].likes++;

  splashfaceApp();

}


function randomSplash() {

  const posts = [

    "🍐 Pear Phone supremacy.",

    "Just found a secret app 👀",

    "Why is this phone so cool?",

    "Who else is using Pear OS?",

    "Today is a great day! ☀️",

    "My phone just did something crazy.",

    "Pear Phone + music = perfect 🎵"

  ];

  splashPosts.unshift({
    user: "PearBot",
    text:
      posts[
        Math.floor(
          Math.random() *
          posts.length
        )
      ],
    likes:
      Math.floor(
        Math.random() * 50
      )
  });

  splashfaceApp();

}


// ============================================================
// STOCKS
// ============================================================

const stockData = [
  {
    symbol: "PEAR",
    name: "Pear Inc.",
    price: 184.27,
    change: 2.41
  },
  {
    symbol: "PPL",
    name: "Pear Labs",
    price: 92.14,
    change: -1.13
  },
  {
    symbol: "DAN",
    name: "DanWarp",
    price: 47.82,
    change: 4.76
  },
  {
    symbol: "SPL",
    name: "SplashFace",
    price: 61.32,
    change: -0.42
  }
];


function stocksApp() {

  openApp(
    "Stocks",
    `
      <div class="card">

        <h2>📈 Stocks</h2>

        <div id="stock-list">

          ${renderStocks()}

        </div>

        <button
          class="button"
          type="button"
          onclick="refreshStocks()"
        >
          🔄 Refresh Prices
        </button>

      </div>
    `
  );

}


function renderStocks() {

  return stockData.map(
    stock => `

      <div class="stock">

        <div>

          <strong>
            ${stock.symbol}
          </strong>

          <br>

          <small>
            ${stock.name}
          </small>

        </div>

        <div
          style="
            text-align:right;
          "
        >

          <strong>
            $${stock.price.toFixed(2)}
          </strong>

          <br>

          <small>
            ${stock.change >= 0 ? "▲" : "▼"}
            ${Math.abs(stock.change).toFixed(2)}%
          </small>

        </div>

      </div>

    `
  ).join("");

}


function refreshStocks() {

  stockData.forEach(stock => {

    const movement =
      (Math.random() * 4) - 2;

    stock.change =
      movement;

    stock.price *=
      1 + movement / 100;

  });

  stocksApp();

}


// ============================================================
// MAPS
// ============================================================

const mapPlaces = [

  "🍐 Pear Headquarters",

  "🏫 Pear University",

  "🏟️ Pear Stadium",

  "🎬 Pear Studios",

  "🌳 Pear Park",

  "☕ Pear Café"

];


function mapsApp() {

  openApp(
    "Maps",
    `
      <div class="card">

        <h2>🗺️ Pear Maps</h2>

        <div class="map">

          🗺️

        </div>

        <p>
          Select a destination:
        </p>

        <div
          style="
            display:flex;
            flex-direction:column;
            gap:6px;
          "
        >

          ${mapPlaces.map(
            (place, index) => `

              <button
                class="button"
                type="button"
                onclick="mapDestination(${index})"
              >
                ${place}
              </button>

            `
          ).join("")}

        </div>

        <div
          id="map-result"
          style="
            margin-top:10px;
            font-weight:700;
          "
        ></div>

      </div>
    `
  );

}


function mapDestination(index) {

  const result =
    document.getElementById(
      "map-result"
    );

  if (!result) return;

  const destination =
    mapPlaces[index];

  const distance =
    Math.floor(
      Math.random() * 20
    ) + 1;

  result.innerHTML = `

    📍 ${escapeHTML(destination)}

    <br>

    🚗 ${distance} km away

    <br>

    ⏱️ Approximately
    ${distance + 4} minutes

  `;

}


// ============================================================
// PHOTOS
// ============================================================

let pearPhotos = [];


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
        >

        <div
          id="photo-grid"
          class="photos"
          style="margin-top:10px"
        >

          ${renderPhotos()}

        </div>

        <button
          class="button"
          type="button"
          onclick="clearPhotos()"
        >
          🗑️ Clear Photos
        </button>

      </div>
    `
  );

}


function renderPhotos() {

  if (!pearPhotos.length) {

    return `
      <p>
        No photos yet. Choose some from your device.
      </p>
    `;

  }

  return pearPhotos.map(
    src => `

      <img
        src="${src}"
        alt="Pear Photo"
      >

    `
  ).join("");

}


function loadPhotos(event) {

  const files =
    Array.from(
      event.target.files || []
    );

  files.forEach(file => {

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      return;

    }

    pearPhotos.push(
      URL.createObjectURL(file)
    );

  });

  photosApp();

}


function clearPhotos() {

  pearPhotos = [];

  photosApp();

}


// ============================================================
// WEATHER
// ============================================================

let weatherTemperature = 22;


function weatherApp() {

  openApp(
    "Weather",
    `
      <div class="card">

        <h2>☀️ Weather</h2>

        <div
          style="
            text-align:center;
            font-size:48px;
            margin:10px 0;
          "
        >
          ☀️
        </div>

        <h1
          style="
            text-align:center;
            margin:0;
          "
        >
          ${weatherTemperature}°C
        </h1>

        <p
          style="
            text-align:center;
          "
        >
          Sunny · Pear City
        </p>

        <button
          class="button"
          type="button"
          onclick="refreshWeather()"
        >
          🔄 Refresh
        </button>

        <div
          style="
            margin-top:12px;
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:6px;
          "
        >

          <div class="card">
            ☀️<br>
            <strong>Today</strong>
          </div>

          <div class="card">
            🌤️<br>
            <strong>Tomorrow</strong>
          </div>

          <div class="card">
            🌧️<br>
            <strong>Friday</strong>
          </div>

        </div>

      </div>
    `
  );

}


function refreshWeather() {

  weatherTemperature =
    Math.floor(
      Math.random() * 21
    ) + 10;

  weatherApp();

}


// ============================================================
// NOTES
// ============================================================

let pearNotes = JSON.parse(
  localStorage.getItem(
    "pear-notes"
  ) || "[]"
);


function notesApp() {

  openApp(
    "Notes",
    `
      <div class="card">

        <h2>📝 Notes</h2>

        <input
          id="note-title"
          type="text"
          placeholder="Title"
          style="width:100%;margin-bottom:7px"
        >

        <textarea
          id="note-body"
          placeholder="Write your note..."
        ></textarea>

        <button
          class="button"
          type="button"
          onclick="saveNote()"
        >
          💾 Save Note
        </button>

        <button
          class="button"
          type="button"
          onclick="clearNotes()"
        >
          🗑️ Clear All
        </button>

        <div
          style="margin-top:10px"
        >

          ${renderNotes()}

        </div>

      </div>
    `
  );

}


function renderNotes() {

  if (!pearNotes.length) {

    return `
      <p>
        No notes yet.
      </p>
    `;

  }

  return pearNotes.map(
    (note, index) => `

      <div
        class="card"
        style="
          margin-bottom:7px;
        "
      >

        <strong>
          ${escapeHTML(note.title)}
        </strong>

        <p>
          ${escapeHTML(note.body)}
        </p>

        <button
          class="button"
          type="button"
          onclick="deleteNote(${index})"
        >
          Delete
        </button>

      </div>

    `
  ).join("");

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
    !body ||
    !body.value.trim()
  ) {

    return;

  }

  pearNotes.unshift({

    title:
      title &&
      title.value.trim()
        ? title.value
        : "Untitled Note",

    body: body.value

  });

  localStorage.setItem(
    "pear-notes",
    JSON.stringify(
      pearNotes
    )
  );

  notesApp();

}


function deleteNote(index) {

  pearNotes.splice(
    index,
    1
  );

  localStorage.setItem(
    "pear-notes",
    JSON.stringify(
      pearNotes
    )
  );

  notesApp();

}


function clearNotes() {

  pearNotes = [];

  localStorage.removeItem(
    "pear-notes"
  );

  notesApp();

}// ============================================================
// PEARTUNES
// ============================================================

let currentSong = 0;
let musicPlaying = false;

const pearSongs = [
  {
    title: "Pear Paradise",
    artist: "Pear Radio",
    emoji: "🍐"
  },
  {
    title: "Midnight Drive",
    artist: "Pear Sounds",
    emoji: "🌙"
  },
  {
    title: "Pixel Dreams",
    artist: "Pear Sounds",
    emoji: "✨"
  },
  {
    title: "Summer Loading",
    artist: "Pear Radio",
    emoji: "☀️"
  },
  {
    title: "Retro Future",
    artist: "Pear Sounds",
    emoji: "💿"
  }
];

function peartunesApp() {

  openApp(
    "PearTunes",
    `
      <div class="card">

        <h2>🎵 PearTunes</h2>

        <div
          style="
            text-align:center;
            padding:15px 8px;
          "
        >

          <div
            id="album-art"
            style="
              width:120px;
              height:120px;
              margin:auto;
              border-radius:18px;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:55px;
              background:linear-gradient(
                135deg,
                #b8f3c8,
                #77c9ff
              );
              box-shadow:0 5px 15px rgba(0,0,0,.2);
            "
          >
            ${pearSongs[currentSong].emoji}
          </div>

          <h3
            id="song-title"
            style="margin-bottom:2px"
          >
            ${escapeHTML(
              pearSongs[currentSong].title
            )}
          </h3>

          <small
            id="song-artist"
          >
            ${escapeHTML(
              pearSongs[currentSong].artist
            )}
          </small>

        </div>

        <div
          style="
            height:6px;
            background:#d8d8d8;
            border-radius:10px;
            overflow:hidden;
            margin:10px 0;
          "
        >

          <div
            id="music-progress"
            style="
              height:100%;
              width:${musicPlaying ? "45%" : "0%"};
              background:#111;
              transition:width .3s;
            "
          ></div>

        </div>

        <div
          style="
            display:flex;
            justify-content:center;
            gap:7px;
          "
        >

          <button
            class="button"
            type="button"
            onclick="previousSong()"
          >
            ⏮
          </button>

          <button
            class="button"
            type="button"
            onclick="toggleMusic()"
          >
            ${musicPlaying ? "⏸" : "▶"}
          </button>

          <button
            class="button"
            type="button"
            onclick="nextSong()"
          >
            ⏭
          </button>

        </div>

        <div
          style="margin-top:12px"
        >

          ${pearSongs.map(
            (song, index) => `

              <button
                class="button"
                type="button"
                style="
                  width:100%;
                  text-align:left;
                  margin-bottom:5px;
                "
                onclick="selectSong(${index})"
              >
                ${song.emoji}
                ${escapeHTML(song.title)}
              </button>

            `
          ).join("")}

        </div>

      </div>
    `
  );

}


function selectSong(index) {

  currentSong =
    index;

  musicPlaying =
    true;

  peartunesApp();

}


function previousSong() {

  currentSong =
    (
      currentSong -
      1 +
      pearSongs.length
    ) %
    pearSongs.length;

  peartunesApp();

}


function nextSong() {

  currentSong =
    (
      currentSong +
      1
    ) %
    pearSongs.length;

  peartunesApp();

}


function toggleMusic() {

  musicPlaying =
    !musicPlaying;

  peartunesApp();

}


// ============================================================
// SETTINGS
// ============================================================

let darkMode = false;
let soundEnabled = true;


function settingsApp() {

  openApp(
    "Settings",
    `
      <div class="card">

        <h2>⚙️ Settings</h2>

        <button
          class="button"
          type="button"
          onclick="toggleDarkMode()"
        >
          ${darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          class="button"
          type="button"
          onclick="toggleSound()"
        >
          ${soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
        </button>

        <button
          class="button"
          type="button"
          onclick="showDeviceInfo()"
        >
          📱 Device Info
        </button>

        <button
          class="button"
          type="button"
          onclick="keyboardDemo()"
        >
          ⌨️ Test Keyboard
        </button>

        <div
          id="settings-result"
          style="
            margin-top:10px;
          "
        ></div>

      </div>
    `
  );

}


function toggleDarkMode() {

  darkMode =
    !darkMode;

  document.body.classList.toggle(
    "pear-dark",
    darkMode
  );

  settingsApp();

}


function toggleSound() {

  soundEnabled =
    !soundEnabled;

  settingsApp();

}


function showDeviceInfo() {

  const result =
    document.getElementById(
      "settings-result"
    );

  if (!result) return;

  result.innerHTML = `

    <div class="card">

      <strong>Pear Phone</strong>

      <br>

      OS: Pear OS

      <br>

      Version: 1.0

      <br>

      Device: Pear Phone

      <br>

      Status: Online 🟢

    </div>

  `;

}


function keyboardDemo() {

  const result =
    document.getElementById(
      "settings-result"
    );

  if (!result) return;

  result.innerHTML = `

    <input
      id="keyboard-test-input"
      type="text"
      placeholder="Type something..."
      style="width:100%"
    >

  `;

  const input =
    document.getElementById(
      "keyboard-test-input"
    );

  if (input) {

    input.focus();

    showPearKeyboard(
      input
    );

  }

}


// ============================================================
// CLOCK
// ============================================================

let stopwatchSeconds = 0;
let stopwatchRunning = false;
let stopwatchTimer = null;


function clockApp() {

  openApp(
    "Clock",
    `
      <div class="card">

        <h2>🕐 Clock</h2>

        <div
          id="pear-clock"
          style="
            text-align:center;
            font-size:34px;
            font-weight:800;
            margin:12px 0;
          "
        >
          ${getCurrentTime()}
        </div>

        <div
          style="
            text-align:center;
          "
        >
          ${new Date().toLocaleDateString()}
        </div>

        <hr>

        <h3>⏱ Stopwatch</h3>

        <div
          id="stopwatch-display"
          style="
            text-align:center;
            font-size:28px;
            font-weight:800;
          "
        >
          ${formatStopwatch(stopwatchSeconds)}
        </div>

        <button
          class="button"
          type="button"
          onclick="toggleStopwatch()"
        >
          ${stopwatchRunning ? "⏸ Pause" : "▶ Start"}
        </button>

        <button
          class="button"
          type="button"
          onclick="resetStopwatch()"
        >
          ↻ Reset
        </button>

      </div>
    `
  );

  startClockRefresh();

}


let clockRefreshTimer = null;

function startClockRefresh() {

  clearInterval(
    clockRefreshTimer
  );

  clockRefreshTimer =
    setInterval(() => {

      const clock =
        document.getElementById(
          "pear-clock"
        );

      if (clock) {

        clock.textContent =
          getCurrentTime();

      } else {

        clearInterval(
          clockRefreshTimer
        );

      }

    }, 1000);

}


function getCurrentTime() {

  return new Date()
    .toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );

}


function formatStopwatch(seconds) {

  const mins =
    Math.floor(
      seconds / 60
    );

  const secs =
    seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

}


function toggleStopwatch() {

  stopwatchRunning =
    !stopwatchRunning;

  if (stopwatchRunning) {

    clearInterval(
      stopwatchTimer
    );

    stopwatchTimer =
      setInterval(() => {

        stopwatchSeconds++;

        const display =
          document.getElementById(
            "stopwatch-display"
          );

        if (display) {

          display.textContent =
            formatStopwatch(
              stopwatchSeconds
            );

        }

      }, 1000);

  } else {

    clearInterval(
      stopwatchTimer
    );

  }

  clockApp();

}


function resetStopwatch() {

  stopwatchRunning =
    false;

  clearInterval(
    stopwatchTimer
  );

  stopwatchSeconds =
    0;

  clockApp();

}


// ============================================================
// VIDEOS
// ============================================================

let videoPlaying = false;


function videosApp() {

  openApp(
    "Videos",
    `
      <div class="card">

        <h2>🎬 Videos</h2>

        <div
          id="video-player"
          style="
            height:170px;
            border-radius:14px;
            background:#111;
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:48px;
          "
        >
          ${videoPlaying ? "▶️" : "▶"}
        </div>

        <h3>
          Pear Video
        </h3>

        <p>
          Welcome to Pear Videos!
        </p>

        <button
          class="button"
          type="button"
          onclick="toggleVideo()"
        >
          ${videoPlaying ? "⏸ Pause" : "▶ Play"}
        </button>

        <button
          class="button"
          type="button"
          onclick="randomVideo()"
        >
          🎲 Random Video
        </button>

      </div>
    `
  );

}


function toggleVideo() {

  videoPlaying =
    !videoPlaying;

  videosApp();

}


function randomVideo() {

  const titles = [

    "Pear Phone Review",

    "Top 10 Pear Tricks",

    "Pear OS Hidden Features",

    "Funny Pear Moments",

    "Pear Phone Unboxing"

  ];

  openApp(
    "Videos",
    `
      <div class="card">

        <h2>🎬 ${escapeHTML(
          titles[
            Math.floor(
              Math.random() *
              titles.length
            )
          ]
        )}</h2>

        <div
          style="
            height:170px;
            background:#111;
            border-radius:14px;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:45px;
          "
        >
          ▶️
        </div>

        <p>
          Playing a random Pear Video.
        </p>

        <button
          class="button"
          type="button"
          onclick="videosApp()"
        >
          Back to Videos
        </button>

      </div>
    `
  );

}


// ============================================================
// PHONE
// ============================================================

let dialNumber = "";


function phoneApp() {

  openApp(
    "Phone",
    `
      <div class="card">

        <h2>☎️ Phone</h2>

        <input
          id="dial-display"
          value="${escapeHTML(dialNumber)}"
          readonly
          style="
            width:100%;
            font-size:25px;
            text-align:center;
            margin-bottom:8px;
          "
        >

        <div
          style="
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:6px;
          "
        >

          ${[
            "1","2","3",
            "4","5","6",
            "7","8","9",
            "*","0","#"
          ].map(
            number => `

              <button
                class="button"
                type="button"
                onclick="dial('${number}')"
              >
                ${number}
              </button>

            `
          ).join("")}

        </div>

        <button
          class="button"
          type="button"
          onclick="callNumber()"
          style="width:100%;margin-top:7px"
        >
          📞 Call
        </button>

        <button
          class="button"
          type="button"
          onclick="deleteDigit()"
        >
          ⌫ Delete
        </button>

        <button
          class="button"
          type="button"
          onclick="clearDial()"
        >
          Clear
        </button>

        <div
          id="call-status"
          style="
            text-align:center;
            margin-top:8px;
            font-weight:700;
          "
        ></div>

      </div>
    `
  );

}


function dial(number) {

  dialNumber +=
    number;

  phoneApp();

}


function deleteDigit() {

  dialNumber =
    dialNumber.slice(
      0,
      -1
    );

  phoneApp();

}


function clearDial() {

  dialNumber =
    "";

  phoneApp();

}


function callNumber() {

  const status =
    document.getElementById(
      "call-status"
    );

  if (!status) return;

  if (!dialNumber) {

    status.textContent =
      "Enter a number first.";

    return;

  }

  status.textContent =
    `Calling ${dialNumber}... 📞`;

}


// ============================================================
// MAIL
// ============================================================

let mailMessages = [

  {
    from: "Pear Support",
    subject: "Welcome to Pear OS",
    body:
      "Thanks for using your Pear Phone!"
  },

  {
    from: "Pear News",
    subject: "New update available",
    body:
      "Your Pear Phone is running perfectly."
  }

];


function mailApp() {

  openApp(
    "Mail",
    `
      <div class="card">

        <h2>✉️ Mail</h2>

        <div>

          ${mailMessages.map(
            (mail, index) => `

              <button
                class="button"
                type="button"
                style="
                  width:100%;
                  text-align:left;
                  margin-bottom:6px;
                "
                onclick="openMail(${index})"
              >

                <strong>
                  ${escapeHTML(mail.from)}
                </strong>

                <br>

                ${escapeHTML(mail.subject)}

              </button>

            `
          ).join("")}

        </div>

        <button
          class="button"
          type="button"
          onclick="newMail()"
        >
          ✏️ Compose
        </button>

      </div>
    `
  );

}


function openMail(index) {

  const mail =
    mailMessages[index];

  if (!mail) return;

  openApp(
    "Mail",
    `
      <div class="card">

        <h2>
          ${escapeHTML(mail.subject)}
        </h2>

        <strong>
          From:
        </strong>

        ${escapeHTML(mail.from)}

        <hr>

        <p>
          ${escapeHTML(mail.body)}
        </p>

        <button
          class="button"
          type="button"
          onclick="mailApp()"
        >
          ← Back
        </button>

      </div>
    `
  );

}


function newMail() {

  openApp(
    "Compose",
    `
      <div class="card">

        <h2>✏️ New Mail</h2>

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
          placeholder="Message"
        ></textarea>

        <button
          class="button"
          type="button"
          onclick="sendMail()"
        >
          📤 Send
        </button>

      </div>
    `
  );

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

  mailMessages.unshift({

    from:
      "You → " +
      (
        to &&
        to.value
          ? to.value
          : "Unknown"
      ),

    subject:
      subject &&
      subject.value
        ? subject.value
        : "No Subject",

    body:
      body
        ? body.value
        : ""

  });

  mailApp();

}


// ============================================================
// COMPASS
// ============================================================

let compassHeading = 0;


function compassApp() {

  openApp(
    "Compass",
    `
      <div class="card">

        <h2>🧭 Compass</h2>

        <div
          style="
            width:150px;
            height:150px;
            margin:15px auto;
            border:5px solid #111;
            border-radius:50%;
            position:relative;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:35px;
          "
        >

          🧭

        </div>

        <h2
          style="text-align:center"
          id="heading-value"
        >
          ${compassHeading}°
        </h2>

        <button
          class="button"
          type="button"
          onclick="spinCompass()"
        >
          🔄 Calibrate
        </button>

        <p
          style="text-align:center"
        >
          ${
            getCompassDirection(
              compassHeading
            )
          }
        </p>

      </div>
    `
  );

}


function spinCompass() {

  compassHeading =
    Math.floor(
      Math.random() *
      360
    );

  compassApp();

}


function getCompassDirection(
  heading
) {

  const directions = [
    "N",
    "NE",
    "E",
    "SE",
    "S",
    "SW",
    "W",
    "NW"
  ];

  return directions[
    Math.round(
      heading / 45
    ) % 8
  ];

}// ============================================================
// TUMS — TYPING GAME
// ============================================================

let typingWords = [
  "pear",
  "phone",
  "apple",
  "banana",
  "computer",
  "internet",
  "music",
  "camera",
  "weather",
  "message",
  "rainbow",
  "sunshine",
  "keyboard",
  "raspberry",
  "university"
];

let typingScore = 0;
let typingCurrentWord = "";
let typingGameRunning = false;
let typingTimer = null;
let typingTime = 30;


function tumsApp() {

  openApp(
    "Tums",
    `
      <div class="card">

        <h2>⌨️ Tums Typing</h2>

        <p>
          Type the word shown as quickly as you can!
        </p>

        <div
          id="typing-word"
          style="
            text-align:center;
            font-size:28px;
            font-weight:900;
            padding:12px;
            margin:8px 0;
            border-radius:12px;
            background:#e8e8e8;
          "
        >
          Press Start
        </div>

        <input
          id="typing-input"
          type="text"
          placeholder="Type here..."
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          disabled
        >

        <div
          style="
            display:flex;
            justify-content:space-between;
            margin-top:8px;
          "
        >

          <strong>
            Score:
            <span id="typing-score">
              ${typingScore}
            </span>
          </strong>

          <strong>
            Time:
            <span id="typing-time">
              ${typingTime}
            </span>
          </strong>

        </div>

        <button
          class="button"
          type="button"
          onclick="startTypingGame()"
        >
          ▶ Start Game
        </button>

      </div>
    `
  );

}


function startTypingGame() {

  stopTypingGame();

  typingScore =
    0;

  typingTime =
    30;

  typingGameRunning =
    true;

  typingCurrentWord =
    getRandomTypingWord();

  const input =
    document.getElementById(
      "typing-input"
    );

  const word =
    document.getElementById(
      "typing-word"
    );

  const score =
    document.getElementById(
      "typing-score"
    );

  const time =
    document.getElementById(
      "typing-time"
    );

  if (word) {

    word.textContent =
      typingCurrentWord;

  }

  if (score) {

    score.textContent =
      typingScore;

  }

  if (time) {

    time.textContent =
      typingTime;

  }

  if (input) {

    input.disabled =
      false;

    input.value =
      "";

    input.focus();

  }

  typingTimer =
    setInterval(() => {

      typingTime--;

      const timeElement =
        document.getElementById(
          "typing-time"
        );

      if (timeElement) {

        timeElement.textContent =
          typingTime;

      }

      if (
        typingTime <= 0
      ) {

        endTypingGame();

      }

    }, 1000);

  if (input) {

    input.oninput =
      checkTypingWord;

  }

}


function checkTypingWord() {

  if (!typingGameRunning) {

    return;

  }

  const input =
    document.getElementById(
      "typing-input"
    );

  if (!input) {

    return;

  }

  if (
    input.value.trim().toLowerCase() ===
    typingCurrentWord.toLowerCase()
  ) {

    typingScore++;

    input.value =
      "";

    typingCurrentWord =
      getRandomTypingWord();

    const word =
      document.getElementById(
        "typing-word"
      );

    const score =
      document.getElementById(
        "typing-score"
      );

    if (word) {

      word.textContent =
        typingCurrentWord;

    }

    if (score) {

      score.textContent =
        typingScore;

    }

  }

}


function getRandomTypingWord() {

  return typingWords[
    Math.floor(
      Math.random() *
      typingWords.length
    )
  ];

}


function endTypingGame() {

  typingGameRunning =
    false;

  clearInterval(
    typingTimer
  );

  typingTimer =
    null;

  const input =
    document.getElementById(
      "typing-input"
    );

  const word =
    document.getElementById(
      "typing-word"
    );

  if (input) {

    input.disabled =
      true;

  }

  if (word) {

    word.innerHTML =
      `Game Over! 🎉<br><small>Score: ${typingScore}</small>`;

  }

}


function stopTypingGame() {

  clearInterval(
    typingTimer
  );

  typingTimer =
    null;

  typingGameRunning =
    false;

}


// ============================================================
// PAGE 2 — LINGO
// ============================================================

const lingoWords = [
  "PEAR",
  "PHONE",
  "APPLE",
  "MUSIC",
  "CAMERA",
  "CLOCK",
  "NOTES",
  "VIDEO"
];

let lingoAnswer = "";
let lingoAttempts = 0;


function lingoApp() {

  lingoAnswer =
    lingoWords[
      Math.floor(
        Math.random() *
        lingoWords.length
      )
    ];

  lingoAttempts =
    0;

  openApp(
    "Lingo",
    `
      <div class="card">

        <h2>🔤 Lingo</h2>

        <p>
          Guess the hidden 5-letter Pear word.
        </p>

        <input
          id="lingo-input"
          type="text"
          maxlength="5"
          placeholder="Guess..."
          style="text-transform:uppercase"
        >

        <button
          class="button"
          type="button"
          onclick="checkLingo()"
        >
          Guess
        </button>

        <div
          id="lingo-result"
          style="
            margin-top:10px;
            font-size:18px;
            font-weight:800;
          "
        ></div>

        <p>
          Attempts:
          <span id="lingo-attempts">
            0
          </span>
        </p>

        <button
          class="button"
          type="button"
          onclick="lingoApp()"
        >
          🔄 New Word
        </button>

      </div>
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

  const attempts =
    document.getElementById(
      "lingo-attempts"
    );

  if (
    !input ||
    !result
  ) {

    return;

  }

  const guess =
    input.value
      .trim()
      .toUpperCase();

  if (
    guess.length !==
    lingoAnswer.length
  ) {

    result.textContent =
      "Enter a 5-letter word.";

    return;

  }

  lingoAttempts++;

  if (attempts) {

    attempts.textContent =
      lingoAttempts;

  }

  if (
    guess ===
    lingoAnswer
  ) {

    result.innerHTML =
      "🎉 Correct! You got it!";

    return;

  }

  let output = "";

  for (
    let i = 0;
    i < guess.length;
    i++
  ) {

    if (
      guess[i] ===
      lingoAnswer[i]
    ) {

      output +=
        ` 🟩 ${guess[i]} `;

    } else if (
      lingoAnswer.includes(
        guess[i]
      )
    ) {

      output +=
        ` 🟨 ${guess[i]} `;

    } else {

      output +=
        ` ⬜ ${guess[i]} `;

    }

  }

  result.textContent =
    output;

}


// ============================================================
// PAGE 2 — SPLASH
// ============================================================

let splashCounter = 0;


function p2SplashApp() {

  openApp(
    "Splash",
    `
      <div class="card">

        <h2>💦 Splash</h2>

        <div
          style="
            text-align:center;
            font-size:60px;
            margin:8px;
          "
        >
          💦
        </div>

        <p>
          Tap the button and make a splash!
        </p>

        <div
          id="splash-count"
          style="
            text-align:center;
            font-size:32px;
            font-weight:900;
          "
        >
          ${splashCounter}
        </div>

        <button
          class="button"
          type="button"
          onclick="makeSplash()"
        >
          💦 SPLASH!
        </button>

        <button
          class="button"
          type="button"
          onclick="resetSplash()"
        >
          Reset
        </button>

      </div>
    `
  );

}


function makeSplash() {

  splashCounter++;

  p2SplashApp();

}


function resetSplash() {

  splashCounter =
    0;

  p2SplashApp();

}


// ============================================================
// PAGE 2 — THUMB
// ============================================================

let thumbCount = 0;


function thumbApp() {

  openApp(
    "Thumb",
    `
      <div class="card">

        <h2>👍 Thumb</h2>

        <div
          id="thumb-button"
          style="
            width:130px;
            height:130px;
            margin:15px auto;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:65px;
            background:#eee;
            cursor:pointer;
            user-select:none;
            transition:
              transform .12s,
              background .12s;
          "
          onclick="thumbPress()"
        >
          👍
        </div>

        <h2
          style="text-align:center"
        >
          ${thumbCount}
        </h2>

        <p
          style="text-align:center"
        >
          Tap the thumb as many times as possible.
        </p>

        <button
          class="button"
          type="button"
          onclick="resetThumb()"
        >
          Reset
        </button>

      </div>
    `
  );

}


function thumbPress() {

  thumbCount++;

  const button =
    document.getElementById(
      "thumb-button"
    );

  if (button) {

    button.style.transform =
      "scale(.88)";

    button.style.background =
      "#cfefff";

    setTimeout(() => {

      if (
        document.getElementById(
          "thumb-button"
        )
      ) {

        document.getElementById(
          "thumb-button"
        ).style.transform =
          "scale(1)";

      }

    }, 100);

  }

  setTimeout(
    thumbApp,
    120
  );

}


function resetThumb() {

  thumbCount =
    0;

  thumbApp();

}


// ============================================================
// PAGE 2 — DANWARP
// ============================================================

function danwarpApp() {

  openApp(
    "DanWarp",
    `
      <div class="card">

        <h2>🌀 DanWarp</h2>

        <p>
          Warp the Pear Phone through space!
        </p>

        <div
          id="warp-zone"
          style="
            height:150px;
            border-radius:15px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:60px;
            background:
              radial-gradient(
                circle,
                #fff,
                #b8c7ff,
                #6f5cff
              );
            transition:
              transform .5s,
              filter .5s;
          "
        >
          🍐
        </div>

        <button
          class="button"
          type="button"
          onclick="activateWarp()"
        >
          🌀 WARP
        </button>

        <div
          id="warp-status"
          style="
            text-align:center;
            margin-top:8px;
            font-weight:700;
          "
        >
          Warp drive ready.
        </div>

      </div>
    `
  );

}


function activateWarp() {

  const zone =
    document.getElementById(
      "warp-zone"
    );

  const status =
    document.getElementById(
      "warp-status"
    );

  if (!zone) return;

  zone.style.transform =
    "rotate(720deg) scale(.3)";

  zone.style.filter =
    "blur(8px)";

  if (status) {

    status.textContent =
      "WARPING...";

  }

  setTimeout(() => {

    if (!document.getElementById("warp-zone")) {

      return;

    }

    const newZone =
      document.getElementById(
        "warp-zone"
      );

    newZone.style.transform =
      "rotate(0deg) scale(1)";

    newZone.style.filter =
      "blur(0)";

    const newStatus =
      document.getElementById(
        "warp-status"
      );

    if (newStatus) {

      newStatus.textContent =
        "Warp complete! 🚀";

    }

  }, 700);

}


// ============================================================
// PAGE 2 — IMAGE
// ============================================================

let imageClicks = 0;


function imageApp() {

  openApp(
    "Image",
    `
      <div class="card">

        <h2>🖼️ Image</h2>

        <div
          id="interactive-image"
          style="
            height:170px;
            border-radius:15px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:75px;
            background:
              linear-gradient(
                135deg,
                #ffd5e5,
                #d8e7ff,
                #d6ffd9
              );
            cursor:pointer;
            transition:
              transform .2s,
              filter .2s;
          "
          onclick="imageInteract()"
        >
          🍐
        </div>

        <p
          style="text-align:center"
        >
          Tap the image!
        </p>

        <div
          id="image-count"
          style="
            text-align:center;
            font-weight:800;
          "
        >
          Interactions:
          ${imageClicks}
        </div>

      </div>
    `
  );

}


function imageInteract() {

  imageClicks++;

  const image =
    document.getElementById(
      "interactive-image"
    );

  if (image) {

    image.style.transform =
      `rotate(${Math.random() * 12 - 6}deg) scale(1.08)`;

    image.style.filter =
      "brightness(1.2)";

    setTimeout(() => {

      const current =
        document.getElementById(
          "interactive-image"
        );

      if (current) {

        current.style.transform =
          "rotate(0deg) scale(1)";

        current.style.filter =
          "brightness(1)";

      }

    }, 180);

  }

  const count =
    document.getElementById(
      "image-count"
    );

  if (count) {

    count.textContent =
      `Interactions: ${imageClicks}`;

  }

}


// ============================================================
// PAGE 2 — CHRONO
// ============================================================

let chronoSeconds = 10;
let chronoTimer = null;


function chronoApp() {

  openApp(
    "Chrono",
    `
      <div class="card">

        <h2>⏳ Chrono</h2>

        <div
          id="chrono-display"
          style="
            text-align:center;
            font-size:50px;
            font-weight:900;
            margin:15px 0;
          "
        >
          ${chronoSeconds}
        </div>

        <button
          class="button"
          type="button"
          onclick="startChrono()"
        >
          ▶ Start
        </button>

        <button
          class="button"
          type="button"
          onclick="resetChrono()"
        >
          ↻ Reset
        </button>

        <button
          class="button"
          type="button"
          onclick="addChronoTime()"
        >
          +10 Seconds
        </button>

      </div>
    `
  );

}


function startChrono() {

  clearInterval(
    chronoTimer
  );

  chronoTimer =
    setInterval(() => {

      chronoSeconds--;

      const display =
        document.getElementById(
          "chrono-display"
        );

      if (display) {

        display.textContent =
          chronoSeconds;

      }

      if (
        chronoSeconds <= 0
      ) {

        clearInterval(
          chronoTimer
        );

        chronoTimer =
          null;

        if (display) {

          display.textContent =
            "DONE! 🎉";

        }

      }

    }, 1000);

}


function resetChrono() {

  clearInterval(
    chronoTimer
  );

  chronoTimer =
    null;

  chronoSeconds =
    10;

  chronoApp();

}


function addChronoTime() {

  chronoSeconds +=
    10;

  const display =
    document.getElementById(
      "chrono-display"
    );

  if (display) {

    display.textContent =
      chronoSeconds;

  }

}


// ============================================================
// PAGE 2 — ZAPLOOK
// ============================================================

let zapScore = 0;
let zapActive = false;
let zapTimer = null;


function zaplookApp() {

  openApp(
    "ZapLook",
    `
      <div class="card">

        <h2>⚡ ZapLook</h2>

        <p>
          Click the target before it moves!
        </p>

        <div
          id="zap-arena"
          style="
            position:relative;
            height:190px;
            border-radius:15px;
            background:#111;
            overflow:hidden;
          "
        >

          <button
            id="zap-target"
            type="button"
            onclick="zapHit()"
            style="
              position:absolute;
              left:40%;
              top:40%;
              width:48px;
              height:48px;
              border:0;
              border-radius:50%;
              background:#fff;
              font-size:25px;
              cursor:pointer;
            "
          >
            ⚡
          </button>

        </div>

        <p>
          Score:
          <strong id="zap-score">
            ${zapScore}
          </strong>
        </p>

        <button
          class="button"
          type="button"
          onclick="startZaplook()"
        >
          ▶ Start
        </button>

        <button
          class="button"
          type="button"
          onclick="stopZaplook()"
        >
          ⏹ Stop
        </button>

      </div>
    `
  );

}


function startZaplook() {

  stopZaplook();

  zapActive =
    true;

  moveZapTarget();

  zapTimer =
    setInterval(
      moveZapTarget,
      700
    );

}


function stopZaplook() {

  zapActive =
    false;

  clearInterval(
    zapTimer
  );

  zapTimer =
    null;

}


function moveZapTarget() {

  if (!zapActive) {

    return;

  }

  const target =
    document.getElementById(
      "zap-target"
    );

  const arena =
    document.getElementById(
      "zap-arena"
    );

  if (
    !target ||
    !arena
  ) {

    return;

  }

  const maxX =
    arena.clientWidth -
    target.offsetWidth;

  const maxY =
    arena.clientHeight -
    target.offsetHeight;

  target.style.left =
    `${Math.max(
      0,
      Math.random() * maxX
    )}px`;

  target.style.top =
    `${Math.max(
      0,
      Math.random() * maxY
    )}px`;

}


function zapHit() {

  if (!zapActive) {

    return;

  }

  zapScore++;

  const score =
    document.getElementById(
      "zap-score"
    );

  if (score) {

    score.textContent =
      zapScore;

  }

  moveZapTarget();

}// ============================================================
// PAGE 2 — MONKEY
// ============================================================

let monkeyScore = 0;
let monkeyTime = 20;
let monkeyRunning = false;
let monkeyTimer = null;


function monkeyApp() {

  openApp(
    "Monkey",
    `
      <div class="card">

        <h2>🐒 Monkey</h2>

        <p>
          Tap the monkey as many times as possible!
        </p>

        <div
          id="monkey-arena"
          style="
            position:relative;
            height:190px;
            border-radius:15px;
            background:
              linear-gradient(
                135deg,
                #d9f7c8,
                #a8df9b
              );
            overflow:hidden;
            cursor:pointer;
          "
        >

          <button
            id="monkey-target"
            type="button"
            onclick="hitMonkey()"
            style="
              position:absolute;
              left:40%;
              top:40%;
              width:60px;
              height:60px;
              padding:0;
              border:0;
              background:transparent;
              font-size:48px;
              cursor:pointer;
              transition:
                left .15s,
                top .15s,
                transform .1s;
            "
          >
            🐒
          </button>

        </div>

        <div
          style="
            display:flex;
            justify-content:space-between;
            margin-top:8px;
          "
        >

          <strong>
            Score:
            <span id="monkey-score">
              ${monkeyScore}
            </span>
          </strong>

          <strong>
            Time:
            <span id="monkey-time">
              ${monkeyTime}
            </span>
          </strong>

        </div>

        <button
          class="button"
          type="button"
          onclick="startMonkey()"
        >
          ▶ Start
        </button>

        <button
          class="button"
          type="button"
          onclick="resetMonkey()"
        >
          ↻ Reset
        </button>

      </div>
    `
  );

}


function startMonkey() {

  stopMonkey();

  monkeyScore =
    0;

  monkeyTime =
    20;

  monkeyRunning =
    true;

  const score =
    document.getElementById(
      "monkey-score"
    );

  const time =
    document.getElementById(
      "monkey-time"
    );

  if (score) {

    score.textContent =
      monkeyScore;

  }

  if (time) {

    time.textContent =
      monkeyTime;

  }

  moveMonkey();

  monkeyTimer =
    setInterval(() => {

      monkeyTime--;

      const currentTime =
        document.getElementById(
          "monkey-time"
        );

      if (currentTime) {

        currentTime.textContent =
          monkeyTime;

      }

      if (
        monkeyTime <= 0
      ) {

        stopMonkey();

        const target =
          document.getElementById(
            "monkey-target"
          );

        if (target) {

          target.textContent =
            "🏆";

        }

      }

    }, 1000);

}


function stopMonkey() {

  clearInterval(
    monkeyTimer
  );

  monkeyTimer =
    null;

  monkeyRunning =
    false;

}


function resetMonkey() {

  stopMonkey();

  monkeyScore =
    0;

  monkeyTime =
    20;

  monkeyApp();

}


function hitMonkey() {

  if (!monkeyRunning) {

    return;

  }

  monkeyScore++;

  const score =
    document.getElementById(
      "monkey-score"
    );

  const target =
    document.getElementById(
      "monkey-target"
    );

  if (score) {

    score.textContent =
      monkeyScore;

  }

  if (target) {

    target.style.transform =
      "scale(.75)";

    setTimeout(() => {

      const currentTarget =
        document.getElementById(
          "monkey-target"
        );

      if (currentTarget) {

        currentTarget.style.transform =
          "scale(1)";

      }

    }, 80);

  }

  moveMonkey();

}


function moveMonkey() {

  const arena =
    document.getElementById(
      "monkey-arena"
    );

  const target =
    document.getElementById(
      "monkey-target"
    );

  if (
    !arena ||
    !target
  ) {

    return;

  }

  const maxX =
    Math.max(
      0,
      arena.clientWidth -
      target.offsetWidth
    );

  const maxY =
    Math.max(
      0,
      arena.clientHeight -
      target.offsetHeight
    );

  target.style.left =
    `${Math.random() * maxX}px`;

  target.style.top =
    `${Math.random() * maxY}px`;

}


// ============================================================
// PAGE 2 — REMARK
// ============================================================

let remarkValue = "";


function remarkApp() {

  openApp(
    "Remark",
    `
      <div class="card">

        <h2>💭 Remark</h2>

        <p>
          Leave yourself a quick remark.
        </p>

        <textarea
          id="remark-input"
          placeholder="Write something..."
        >${escapeHTML(remarkValue)}</textarea>

        <button
          class="button"
          type="button"
          onclick="saveRemark()"
        >
          💾 Save
        </button>

        <button
          class="button"
          type="button"
          onclick="clearRemark()"
        >
          🗑️ Clear
        </button>

        <div
          id="remark-preview"
          class="card"
          style="margin-top:10px"
        >

          ${
            remarkValue
              ? escapeHTML(remarkValue)
              : "Nothing written yet."
          }

        </div>

      </div>
    `
  );

}


function saveRemark() {

  const input =
    document.getElementById(
      "remark-input"
    );

  if (!input) {

    return;

  }

  remarkValue =
    input.value;

  remarkApp();

}


function clearRemark() {

  remarkValue =
    "";

  remarkApp();

}


// ============================================================
// PAGE 2 — SETTINGS
// ============================================================

function p2SettingsApp() {

  openApp(
    "Settings",
    `
      <div class="card">

        <h2>⚙️ Pear Settings</h2>

        <p>
          Customize your Pear Phone.
        </p>

        <button
          class="button"
          type="button"
          onclick="toggleDarkMode()"
        >
          ${darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          class="button"
          type="button"
          onclick="toggleSound()"
        >
          ${
            soundEnabled
              ? "🔊 Sound On"
              : "🔇 Sound Off"
          }
        </button>

        <button
          class="button"
          type="button"
          onclick="showP2DeviceInfo()"
        >
          📱 About This Phone
        </button>

        <button
          class="button"
          type="button"
          onclick="showPearKeyboardDemo()"
        >
          ⌨️ Keyboard
        </button>

        <div
          id="p2-settings-result"
          style="margin-top:10px"
        ></div>

      </div>
    `
  );

}


function showP2DeviceInfo() {

  const result =
    document.getElementById(
      "p2-settings-result"
    );

  if (!result) {

    return;

  }

  result.innerHTML = `

    <div class="card">

      <strong>🍐 Pear Phone</strong>

      <br><br>

      Pear OS 1.0

      <br>

      Screen: Touch

      <br>

      Network: Connected 🟢

      <br>

      Camera: ${cameraStream ? "Connected" : "Ready"}

      <br>

      Status: Perfect

    </div>

  `;

}


function showPearKeyboardDemo() {

  const result =
    document.getElementById(
      "p2-settings-result"
    );

  if (!result) {

    return;

  }

  result.innerHTML = `

    <input
      id="p2-keyboard-input"
      type="text"
      placeholder="Tap here and type..."
      style="width:100%"
    >

  `;

  const input =
    document.getElementById(
      "p2-keyboard-input"
    );

  if (input) {

    input.addEventListener(
      "focus",
      () => {
        showPearKeyboard(input);
      },
      {
        once:true
      }
    );

    input.focus();

    showPearKeyboard(
      input
    );

  }

}


// ============================================================
// PAGE 2 — PHONE
// ============================================================

function p2PhoneApp() {

  openApp(
    "Phone",
    `
      <div class="card">

        <h2>☎️ Phone</h2>

        <p>
          Your contacts
        </p>

        <button
          class="button"
          type="button"
          onclick="callContact('Pear Support')"
        >
          🍐 Pear Support
        </button>

        <button
          class="button"
          type="button"
          onclick="callContact('Mom')"
        >
          👩 Mom
        </button>

        <button
          class="button"
          type="button"
          onclick="callContact('Friend')"
        >
          👤 Friend
        </button>

        <div
          id="p2-call-status"
          style="
            text-align:center;
            font-weight:800;
            margin-top:10px;
          "
        ></div>

        <hr>

        <input
          id="p2-phone-number"
          type="tel"
          placeholder="Enter phone number"
        >

        <button
          class="button"
          type="button"
          onclick="p2CallNumber()"
        >
          📞 Call Number
        </button>

      </div>
    `
  );

}


function callContact(name) {

  const status =
    document.getElementById(
      "p2-call-status"
    );

  if (!status) {

    return;

  }

  status.textContent =
    `Calling ${name}... 📞`;

}


function p2CallNumber() {

  const input =
    document.getElementById(
      "p2-phone-number"
    );

  const status =
    document.getElementById(
      "p2-call-status"
    );

  if (
    !input ||
    !status
  ) {

    return;

  }

  if (
    !input.value.trim()
  ) {

    status.textContent =
      "Enter a phone number.";

    return;

  }

  status.textContent =
    `Calling ${input.value}... 📞`;

}


// ============================================================
// PAGE 2 — MAIL
// ============================================================

function p2MailApp() {

  openApp(
    "Mail",
    `
      <div class="card">

        <h2>✉️ Mail</h2>

        <div
          class="card"
          style="margin-bottom:7px"
        >

          <strong>
            🍐 Pear Support
          </strong>

          <br>

          Your Pear Phone is ready!

          <br>

          <small>
            Just now
          </small>

        </div>

        <div
          class="card"
          style="margin-bottom:7px"
        >

          <strong>
            🎵 PearTunes
          </strong>

          <br>

          New music has been added.

          <br>

          <small>
            Today
          </small>

        </div>

        <button
          class="button"
          type="button"
          onclick="newMail()"
        >
          ✏️ Compose
        </button>

      </div>
    `
  );

}


// ============================================================
// PAGE 2 — COMPASS
// ============================================================

function p2CompassApp() {

  openApp(
    "Compass",
    `
      <div class="card">

        <h2>🧭 Compass</h2>

        <div
          id="p2-compass-circle"
          style="
            width:145px;
            height:145px;
            margin:12px auto;
            border:5px solid #111;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:45px;
            transition:transform .4s;
          "
        >
          🧭
        </div>

        <h2
          id="p2-heading"
          style="text-align:center"
        >
          ${compassHeading}°
        </h2>

        <p
          id="p2-direction"
          style="text-align:center"
        >
          ${getCompassDirection(compassHeading)}
        </p>

        <button
          class="button"
          type="button"
          onclick="p2CalibrateCompass()"
        >
          🔄 Calibrate
        </button>

      </div>
    `
  );

}


function p2CalibrateCompass() {

  compassHeading =
    Math.floor(
      Math.random() * 360
    );

  const circle =
    document.getElementById(
      "p2-compass-circle"
    );

  const heading =
    document.getElementById(
      "p2-heading"
    );

  const direction =
    document.getElementById(
      "p2-direction"
    );

  if (circle) {

    circle.style.transform =
      `rotate(${compassHeading}deg)`;

  }

  if (heading) {

    heading.textContent =
      `${compassHeading}°`;

  }

  if (direction) {

    direction.textContent =
      getCompassDirection(
        compassHeading
      );

  }

}


// ============================================================
// PAGE 2 — MUSIC
// ============================================================

function p2MusicApp() {

  openApp(
    "Music",
    `
      <div class="card">

        <h2>🎵 Music</h2>

        <div
          style="
            text-align:center;
            font-size:60px;
            margin:12px;
          "
        >
          🎶
        </div>

        <p
          style="text-align:center"
        >
          ${escapeHTML(
            pearSongs[currentSong].title
          )}
        </p>

        <button
          class="button"
          type="button"
          onclick="previousSong()"
        >
          ⏮ Previous
        </button>

        <button
          class="button"
          type="button"
          onclick="toggleMusic()"
        >
          ${musicPlaying ? "⏸ Pause" : "▶ Play"}
        </button>

        <button
          class="button"
          type="button"
          onclick="nextSong()"
        >
          Next ⏭
        </button>

        <p
          style="
            text-align:center;
            margin-top:10px;
          "
        >
          ${
            musicPlaying
              ? "Now Playing 🎵"
              : "Paused"
          }
        </p>

      </div>
    `
  );

}


// ============================================================
// APP CONNECTIONS
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
      peartunesApp,

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
      peartunesApp

  };


  Object.keys(
    connections
  ).forEach(id => {

    const element =
      document.getElementById(
        id
      );

    if (!element) {

      return;

    }

    element.onclick =
      event => {

        event.preventDefault();

        event.stopPropagation();

        connections[id]();

      };

  });

}


function connectPage2Apps() {

  const connections = {

    "p2-lingo":
      lingoApp,

    "p2-splash":
      p2SplashApp,

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
      p2MusicApp,

    "p2-monkey":
      monkeyApp,

    "p2-remark":
      remarkApp,

    "p2-settings":
      p2SettingsApp,

    "p2-phone":
      p2PhoneApp,

    "p2-mail":
      p2MailApp,

    "p2-compass":
      p2CompassApp,

    "p2-music2":
      p2MusicApp

  };


  Object.keys(
    connections
  ).forEach(id => {

    const element =
      document.getElementById(
        id
      );

    if (!element) {

      return;

    }

    element.onclick =
      event => {

        event.preventDefault();

        event.stopPropagation();

        connections[id]();

      };

  });

}


// ============================================================
// PAGE / HOME CONTROLS
// ============================================================

function connectHomeButton() {

  const home =
    document.getElementById(
      "home"
    );

  if (!home) {

    return;

  }

  home.onclick =
    event => {

      event.preventDefault();

      event.stopPropagation();

      closeApp();

      showPage(1);

    };

}


function connectPageSwitching() {

  let startY =
    null;

  let startX =
    null;

  let tracking =
    false;


  phone.addEventListener(
    "touchstart",
    event => {

      if (
        event.target.closest(
          "#overlay"
        )
      ) {

        return;

      }

      const touch =
        event.touches[0];

      startX =
        touch.clientX;

      startY =
        touch.clientY;

      tracking =
        true;

    },
    {
      passive:true
    }
  );


  phone.addEventListener(
    "touchend",
    event => {

      if (!tracking) {

        return;

      }

      tracking =
        false;

      const touch =
        event.changedTouches[0];

      const dx =
        touch.clientX -
        startX;

      const dy =
        touch.clientY -
        startY;

      if (
        Math.abs(dy) >
        Math.abs(dx) &&
        Math.abs(dy) >
        45
      ) {

        if (dy < 0) {

          showPage(2);

        } else {

          showPage(1);

        }

      }

    },
    {
      passive:true
    }
  );


  let mouseDown =
    false;

  let mouseStartY =
    0;


  phone.addEventListener(
    "mousedown",
    event => {

      if (
        event.target.closest(
          "#overlay"
        )
      ) {

        return;

      }

      mouseDown =
        true;

      mouseStartY =
        event.clientY;

    }
  );


  window.addEventListener(
    "mouseup",
    event => {

      if (!mouseDown) {

        return;

      }

      mouseDown =
        false;

      const distance =
        event.clientY -
        mouseStartY;

      if (
        Math.abs(distance) >
        45
      ) {

        if (distance < 0) {

          showPage(2);

        } else {

          showPage(1);

        }

      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "ArrowUp"
      ) {

        showPage(2);

      }

      if (
        event.key ===
        "ArrowDown"
      ) {

        showPage(1);

      }

      if (
        event.key ===
        "Escape"
      ) {

        closeApp();

      }

    }
  );

}


// ============================================================
// START EVERYTHING
// ============================================================

connectPage1Apps();
connectPage2Apps();
connectHomeButton();
connectPageSwitching();

showPage(
  currentPage
);// ============================================================
// PEAR PHONE OS — FINAL CONNECTION / STARTUP SECTION
// ============================================================

// Make sure every Page 1 hotspot opens only its own app.
function bindPage1Hotspots() {

  const apps = {
    messages: messagesApp,
    camera: cameraApp,
    splashface: splashfaceApp,
    stocks: stocksApp,
    maps: mapsApp,
    photos: photosApp,
    weather: weatherApp,
    notes: notesApp,
    peartunes: peartunesApp,
    settings: settingsApp,
    clock: clockApp,
    videos: videosApp,
    phone: phoneApp,
    mail: mailApp,
    compass: compassApp,
    music: peartunesApp
  };

  Object.entries(apps).forEach(
    ([id, appFunction]) => {

      const button =
        document.getElementById(id);

      if (!button) return;

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          if (typeof appFunction === "function") {
            appFunction();
          }

        }
      );

      button.addEventListener(
        "touchend",
        event => {

          event.preventDefault();
          event.stopPropagation();

          if (typeof appFunction === "function") {
            appFunction();
          }

        },
        {
          passive:false
        }
      );

    }
  );

}


// Make sure every Page 2 hotspot opens only its own app.
function bindPage2Hotspots() {

  const apps = {

    "p2-lingo":
      lingoApp,

    "p2-splash":
      p2SplashApp,

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
      p2MusicApp,

    "p2-monkey":
      monkeyApp,

    "p2-remark":
      remarkApp,

    "p2-settings":
      p2SettingsApp,

    "p2-phone":
      p2PhoneApp,

    "p2-mail":
      p2MailApp,

    "p2-compass":
      p2CompassApp,

    "p2-music2":
      p2MusicApp

  };

  Object.entries(apps).forEach(
    ([id, appFunction]) => {

      const button =
        document.getElementById(id);

      if (!button) return;

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          if (typeof appFunction === "function") {
            appFunction();
          }

        }
      );

      button.addEventListener(
        "touchend",
        event => {

          event.preventDefault();
          event.stopPropagation();

          if (typeof appFunction === "function") {
            appFunction();
          }

        },
        {
          passive:false
        }
      );

    }
  );

}


// ============================================================
// HOME BUTTON
// ============================================================

function bindHomeButton() {

  const home =
    document.getElementById(
      "home"
    );

  if (!home) return;

  const goHome =
    event => {

      event.preventDefault();
      event.stopPropagation();

      closeApp();

      showPage(1);

    };

  home.addEventListener(
    "click",
    goHome
  );

  home.addEventListener(
    "touchend",
    goHome,
    {
      passive:false
    }
  );

}


// ============================================================
// PREVENT APP CLICKS FROM BECOMING PHONE SWIPES
// ============================================================

function protectOverlayGestures() {

  if (!overlay) return;

  overlay.addEventListener(
    "touchstart",
    event => {

      event.stopPropagation();

    },
    {
      passive:true
    }
  );

  overlay.addEventListener(
    "touchmove",
    event => {

      event.stopPropagation();

    },
    {
      passive:true
    }
  );

  overlay.addEventListener(
    "touchend",
    event => {

      event.stopPropagation();

    },
    {
      passive:true
    }
  );

}


// ============================================================
// CLEANUP WHEN PAGE CHANGES
// ============================================================

function cleanupBeforePageChange() {

  stopCamera();

  stopTypingGame();

  stopMonkey();

  stopZaplook();

  clearInterval(
    chronoTimer
  );

  clearInterval(
    stopwatchTimer
  );

  clearInterval(
    clockRefreshTimer
  );

}


// ============================================================
// OVERRIDE PAGE SWITCH SO APPS CLOSE CLEANLY
// ============================================================

const originalShowPage =
  typeof showPage === "function"
    ? showPage
    : null;


function setPearPage(page) {

  cleanupBeforePageChange();

  closeApp();

  if (
    phone
  ) {

    phone.classList.toggle(
      "page-two",
      page === 2
    );

  }

  currentPage =
    page === 2
      ? 2
      : 1;

}


// ============================================================
// KEYBOARD SAFETY
// ============================================================

document.addEventListener(
  "focusin",
  event => {

    const target =
      event.target;

    if (!target) return;

    if (
      target.matches(
        "input[type='text'], input[type='search'], input[type='tel'], input[type='email'], textarea"
      )
    ) {

      showPearKeyboard(
        target
      );

    }

  }
);


// Enter should hide the Pear keyboard.
document.addEventListener(
  "keydown",
  event => {

    if (
      event.key !== "Enter"
    ) {

      return;

    }

    const target =
      event.target;

    if (
      target &&
      (
        target.matches(
          "input[type='text'], input[type='search'], input[type='tel'], input[type='email'], textarea"
        )
      )
    ) {

      event.preventDefault();

      const field =
        target;

      hidePearKeyboard();

      field.blur();

    }

  }
);


// Clicking outside a text field should hide the
// custom keyboard, but clicking the keyboard itself
// should obviously keep it open.
document.addEventListener(
  "pointerdown",
  event => {

    if (
      !event.target.closest(
        "#pear-keyboard"
      ) &&
      !event.target.matches(
        "input, textarea"
      )
    ) {

      if (
        typeof hidePearKeyboard ===
        "function"
      ) {

        hidePearKeyboard();

      }

    }

  }
);


// ============================================================
// STARTUP
// ============================================================

function initializePearPhone() {

  bindPage1Hotspots();

  bindPage2Hotspots();

  bindHomeButton();

  protectOverlayGestures();

  if (
    phone
  ) {

    phone.classList.remove(
      "page-two"
    );

  }

  currentPage =
    1;

  closeApp();

}


// Wait until the HTML has completely loaded.
if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializePearPhone,
    {
      once:true
    }
  );

} else {

  initializePearPhone();

}


// ============================================================
// EXTRA TOUCH SUPPORT
// ============================================================

// Some Raspberry Pi touchscreen browsers report
// pointer events rather than normal click events.
// This makes sure the hotspot still activates.

document.addEventListener(
  "pointerup",
  event => {

    const hotspot =
      event.target.closest(
        ".hotspot, .page2-hotspot"
      );

    if (!hotspot) return;

    if (
      hotspot.dataset.pearHandled ===
      "yes"
    ) {

      return;

    }

    hotspot.dataset.pearHandled =
      "yes";

    setTimeout(
      () => {

        delete hotspot.dataset.pearHandled;

      },
      100
    );

  }
);


// ============================================================
// FINAL SAFETY CHECK
// ============================================================

window.addEventListener(
  "beforeunload",
  () => {

    stopCamera();

    stopTypingGame();

    stopMonkey();

    stopZaplook();

    clearInterval(
      chronoTimer
    );

    clearInterval(
      stopwatchTimer
    );

    clearInterval(
      clockRefreshTimer
    );

  }
);
// ============================================================
// END OF APP.JS
// ============================================================
