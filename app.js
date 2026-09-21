// ============================================================

// PEAR PHONE OS — FULL APP.JS

// ============================================================

const phone = document.getElementById("phone-container");

const overlay = document.getElementById("overlay");

const appWindow = document.getElementById("app-window");

const pageDots = document.getElementById("page-dots");

let currentPage = 1;

// Keeps JavaScript's page state synchronized with the actual
// visual .page-two class on the phone.
function syncCurrentPage() {

  currentPage =
    phone && phone.classList.contains("page-two")
      ? 2
      : 1;

  if (pageDots) {

    pageDots.textContent =
      currentPage === 2
        ? "○ ●"
        : "● ○";

  }

  return currentPage;

}

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

function showPage(page) {

  syncCurrentPage();

  if (page === currentPage) return;

  currentPage = page;

  phone.classList.remove(
    "page-switch-up",
    "page-switch-down"
  );

  void phone.offsetWidth;

  phone.classList.add(
    page === 2
      ? "page-switch-up"
      : "page-switch-down"
  );

  phone.classList.toggle(
    "page-two",
    page === 2
  );

  if (pageDots) {

    pageDots.textContent =
      page === 2
        ? "○ ●"
        : "● ○";

  }

  closeApp();

  setTimeout(() => {

    phone.classList.remove(
      "page-switch-up",
      "page-switch-down"
    );

  }, 700);

}

document.addEventListener("keydown", e => {

  syncCurrentPage();

  if (
    e.target.matches(
      "input, textarea, select"
    )
  ) return;

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

phone.addEventListener("touchstart", e => {

  if (
    overlay.classList.contains("open")
  ) return;

  const t = e.touches[0];

  touchStartX = t.clientX;

  touchStartY = t.clientY;

  touchMoved = false;

}, { passive: true });

phone.addEventListener("touchmove", e => {

  if (
    overlay.classList.contains("open")
  ) return;

  const t = e.touches[0];

  const dx =
    t.clientX -
    touchStartX;

  const dy =
    t.clientY -
    touchStartY;

  if (
    Math.abs(dy) > 30 &&
    Math.abs(dy) > Math.abs(dx)
  ) {

    touchMoved = true;

  }

}, { passive: true });

phone.addEventListener("touchend", e => {

  syncCurrentPage();

  if (
    overlay.classList.contains("open") ||
    !touchMoved ||
    swipeLocked
  ) return;

  const t =
    e.changedTouches[0];

  const dx =
    t.clientX -
    touchStartX;

  const dy =
    t.clientY -
    touchStartY;

  if (
    Math.abs(dy) < 80 ||
    Math.abs(dy) <= Math.abs(dx)
  ) return;

  swipeLocked = true;

  if (
    dy < 0 &&
    currentPage === 1
  ) {

    showPage(2);

  }

  if (
    dy > 0 &&
    currentPage === 2
  ) {

    showPage(1);

  }

  setTimeout(() => {

    swipeLocked = false;

  }, 700);

}, { passive: true });

phone.addEventListener("mousedown", e => {

  if (
    overlay.classList.contains("open")
  ) return;

  mouseStartX = e.clientX;

  mouseStartY = e.clientY;

  mouseDragging = true;

});

phone.addEventListener("mouseup", e => {

  syncCurrentPage();

  if (!mouseDragging) return;

  mouseDragging = false;

  if (
    overlay.classList.contains("open")
  ) return;

  const dx =
    e.clientX -
    mouseStartX;

  const dy =
    e.clientY -
    mouseStartY;

  if (
    Math.abs(dy) < 80 ||
    Math.abs(dy) <= Math.abs(dx)
  ) return;

  if (
    dy < 0 &&
    currentPage === 1
  ) {

    showPage(2);

  }

  if (
    dy > 0 &&
    currentPage === 2
  ) {

    showPage(1);

  }

});

// ============================================================

// APP SYSTEM

// ============================================================

function openApp(title, content) {

  // Make sure a previous keyboard cannot remain attached
  // when another app opens.

  hidePearKeyboard(true);

  appWindow.innerHTML = `

    <div class="app-header">

      <button
        type="button"
        class="back-button"
        onclick="closeApp()"
      >
        ‹
      </button>

      <strong>
        ${escapeHTML(title)}
      </strong>

    </div>

    <div class="app-content">

      ${content}

    </div>

  `;

  overlay.classList.add("open");

  addKeyboardSupport();

}

function closeApp() {

  stopCamera();

  stopTypingGame();

  hidePearKeyboard(true);

  overlay.classList.remove("open");

  appWindow.innerHTML = "";

}

// ============================================================

// CUSTOM PEAR KEYBOARD

// ============================================================

let keyboardVisible = false;

let keyboardShift = false;

let keyboardNumberMode = false;

let keyboardTarget = null;

let keyboardHideTimer = null;

function addKeyboardSupport() {

  setTimeout(() => {

    const fields =
      appWindow.querySelectorAll(
        `
        input[type="text"],
        input:not([type]),
        input[type="search"],
        input[type="tel"],
        input[type="email"],
        input[type="number"],
        textarea
        `
      );

    fields.forEach(field => {

      if (
        field.dataset.pearKeyboardBound === "true"
      ) return;

      field.dataset.pearKeyboardBound =
        "true";

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

      field.addEventListener(
        "touchstart",
        () => {

          showPearKeyboard(field);

        },
        { passive: true }
      );

    });

  }, 50);

}

function showPearKeyboard(input) {

  if (
    !input ||
    !appWindow.contains(input)
  ) return;

  keyboardVisible = true;

  keyboardTarget = input;

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

        ${"QWERTYUIOP"
          .split("")
          .map(
            k =>
              `
              <button
                type="button"
                data-key="${k}"
                onclick="keyboardKey('${k}')"
              >
                ${k}
              </button>
              `
          )
          .join("")}

      </div>

      <div class="pear-keyboard-row">

        ${"ASDFGHJKL"
          .split("")
          .map(
            k =>
              `
              <button
                type="button"
                data-key="${k}"
                onclick="keyboardKey('${k}')"
              >
                ${k}
              </button>
              `
          )
          .join("")}

      </div>

      <div class="pear-keyboard-row">

        <button
          type="button"
          onclick="keyboardShiftKey()"
        >
          ⇧
        </button>

        ${"ZXCVBNM"
          .split("")
          .map(
            k =>
              `
              <button
                type="button"
                data-key="${k}"
                onclick="keyboardKey('${k}')"
              >
                ${k}
              </button>
              `
          )
          .join("")}

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

  keyboard.style.display =
    "block";

  if (keyboardHideTimer) {

    clearTimeout(
      keyboardHideTimer
    );

    keyboardHideTimer = null;

  }

  setTimeout(() => {

    keyboard.classList.add(
      "keyboard-show"
    );

  }, 10);

}

function hidePearKeyboard(
  immediate = false
) {

  const keyboard =
    document.getElementById(
      "pear-keyboard"
    );

  keyboardVisible = false;

  keyboardShift = false;

  keyboardNumberMode = false;

  keyboardTarget = null;

  if (!keyboard) return;

  keyboard.classList.remove(
    "keyboard-show"
  );

  if (keyboardHideTimer) {

    clearTimeout(
      keyboardHideTimer
    );

    keyboardHideTimer = null;

  }

  if (immediate) {

    keyboard.style.display =
      "none";

    return;

  }

  keyboardHideTimer =
    setTimeout(() => {

      keyboard.style.display =
        "none";

      keyboardHideTimer =
        null;

    }, 250);

}

function getFocusedField() {

  if (
    keyboardTarget &&
    appWindow.contains(
      keyboardTarget
    )
  ) {

    return keyboardTarget;

  }

  const active =
    document.activeElement;

  if (
    active &&
    appWindow.contains(active) &&
    (
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA"
    )
  ) {

    return active;

  }

  return null;

}

function keyboardKey(key) {

  const field =
    getFocusedField();

  if (!field) return;

  field.focus();

  const character =
    keyboardShift
      ? key
      : key.toLowerCase();

  insertText(
    field,
    character
  );

  keyboardShift = false;

  updateKeyboardLabels();

}

function insertText(
  field,
  text
) {

  if (!field) return;

  const start =
    typeof field.selectionStart === "number"
      ? field.selectionStart
      : field.value.length;

  const end =
    typeof field.selectionEnd === "number"
      ? field.selectionEnd
      : field.value.length;

  field.value =
    field.value.substring(
      0,
      start
    ) +
    text +
    field.value.substring(
      end
    );

  const caret =
    start +
    text.length;

  try {

    field.selectionStart =
      caret;

    field.selectionEnd =
      caret;

  } catch (error) {}

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

  field.focus();

  insertText(
    field,
    " "
  );

}

function keyboardEnter() {

  // Enter is intentionally the CLOSE keyboard button.
  // It does not insert a newline.

  const field =
    getFocusedField();

  if (field) {

    try {

      field.blur();

    } catch (error) {}

  }

  hidePearKeyboard();

}

function keyboardBackspace() {

  const field =
    getFocusedField();

  if (!field) return;

  field.focus();

  const start =
    typeof field.selectionStart === "number"
      ? field.selectionStart
      : field.value.length;

  const end =
    typeof field.selectionEnd === "number"
      ? field.selectionEnd
      : field.value.length;

  if (start !== end) {

    field.value =
      field.value.substring(
        0,
        start
      ) +
      field.value.substring(
        end
      );

    try {

      field.selectionStart =
        start;

      field.selectionEnd =
        start;

    } catch (error) {}

  } else if (start > 0) {

    field.value =
      field.value.substring(
        0,
        start - 1
      ) +
      field.value.substring(
        end
      );

    try {

      field.selectionStart =
        start - 1;

      field.selectionEnd =
        start - 1;

    } catch (error) {}

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

function keyboardShiftKey() {

  keyboardShift =
    !keyboardShift;

  updateKeyboardLabels();

}

function keyboardNumber() {

  keyboardNumberMode =
    !keyboardNumberMode;

  updateKeyboardLabels();

}

function updateKeyboardLabels() {

  const keyboard =
    document.getElementById(
      "pear-keyboard"
    );

  if (!keyboard) return;

  const numberMap = {
    Q: "1",
    W: "2",
    E: "3",
    R: "4",
    T: "5",
    Y: "6",
    U: "7",
    I: "8",
    O: "9",
    P: "0"
  };

  keyboard
    .querySelectorAll(
      "[data-key]"
    )
    .forEach(button => {

      const key =
        button.dataset.key;

      if (keyboardNumberMode) {

        button.textContent =
          numberMap[key] || key;

      } else {

        button.textContent =
          keyboardShift
            ? key
            : key.toLowerCase();

      }

    });

}

// ============================================================

// CAMERA

// ============================================================

let cameraStream = null;

let cameraVideo = null;

function stopCamera() {

  if (cameraStream) {

    cameraStream
      .getTracks()
      .forEach(track => {

        try {

          track.stop();

        } catch (error) {}

      });

    cameraStream = null;

  }

  cameraVideo = null;

}

async function startCamera(
  video
) {

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    return false;

  }

  try {

    stopCamera();

    cameraStream =
      await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false
        });

    cameraVideo =
      video;

    video.srcObject =
      cameraStream;

    await video.play();

    return true;

  } catch (error) {

    console.error(
      "Camera error:",
      error
    );

    return false;

  }

}

// ============================================================

// TYPING GAME

// ============================================================

let typingGameTimer = null;

let typingGameStarted = false;

function stopTypingGame() {

  if (typingGameTimer) {

    clearInterval(
      typingGameTimer
    );

    typingGameTimer =
      null;

  }

  typingGameStarted =
    false;

}

// ============================================================

// HTML ESCAPING

// ============================================================

function escapeHTML(value) {

  return String(
    value ?? ""
  )
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

// MESSAGES

// ============================================================
function messagesApp() {

  openApp(

    "Messages",

    `

      <div class="card">

        <h2>💬 Messages</h2>

        <div id="contact-list">

          ${Object.keys(messageContacts).map(name => `

            <button onclick="openChat('${name}')">

              💬 ${name}

            </button>

          `).join("")}

        </div>

        <button onclick="newMessage()">

          ✏️ New Message

        </button>

        <button onclick="alert('3 unread messages')">

          🔴 Unread Messages

        </button>

      </div>

    `

  );

}

function openChat(name) {

  const messages =

    messageContacts[name] || [];

  openApp(

    name,

    `

      <div class="card">

        <div id="chat-box">

          ${messages.slice(0, 2).map(msg => `

            <div class="message received">

              ${escapeHTML(msg)}

            </div>

          `).join("")}

        </div>

        <input

          id="message-input"

          placeholder="Message..."

        >

        <button onclick="sendMessage('${name}')">

          Send

        </button>

        <button onclick="randomReply('${name}')">

          🤖 Random Reply

        </button>

      </div>

    `

  );

}

function sendMessage(name) {

  const input =

    document.getElementById("message-input");

  const chat =

    document.getElementById("chat-box");

  if (!input || !chat || !input.value.trim()) {

    return;

  }

  chat.innerHTML += `

    <div class="message sent">

      ${escapeHTML(input.value)}

    </div>

  `;

  input.value = "";

  setTimeout(() => randomReply(name), 600);

}

function randomReply(name) {

  const chat =

    document.getElementById("chat-box");

  if (!chat) return;

  const replies =

    messageContacts[name] || ["Okay!"];

  const reply =

    replies[Math.floor(Math.random() * replies.length)];

  chat.innerHTML += `

    <div class="message received">

      ${escapeHTML(reply)}

    </div>

  `;

}

function newMessage() {

  openApp(

    "New Message",

    `

      <div class="card">

        <input id="new-contact" placeholder="Contact">

        <textarea

          id="new-message"

          placeholder="Message..."

        ></textarea>

        <button onclick="alert('Message sent! 📱')">

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

let cameraFacing = "user";

function cameraApp() {

  openApp(

    "Camera",

    `

      <div class="card camera-box">

        <video

          id="camera-video"

          autoplay

          playsinline

        ></video>

        <button onclick="startCamera()">

          📷 Start Camera

        </button>

        <button onclick="capturePhoto()">

          ⭕ Take Photo

        </button>

        <button onclick="flipCamera()">

          🔄 Flip Camera

        </button>

        <div id="camera-photo"></div>

        <canvas id="camera-canvas"></canvas>

      </div>

    `

  );

  startCamera();

}

async function startCamera() {

  try {

    stopCamera();

    cameraStream =

      await navigator.mediaDevices.getUserMedia({

        video: {

          facingMode: cameraFacing

        },

        audio: false

      });

    const video =

      document.getElementById("camera-video");

    if (video) {

      video.srcObject = cameraStream;

    }

  } catch {

    alert("Camera access was not available.");

  }

}

function flipCamera() {

  cameraFacing =

    cameraFacing === "user"

      ? "environment"

      : "user";

  startCamera();

}

function capturePhoto() {

  const video =

    document.getElementById("camera-video");

  const canvas =

    document.getElementById("camera-canvas");

  const preview =

    document.getElementById("camera-photo");

  if (!video || !canvas || !preview) return;

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

  preview.innerHTML = `

    <img

      src="${canvas.toDataURL("image/png")}"

      style="width:100%;border-radius:12px"

    >

  `;

}

function stopCamera() {

  if (!cameraStream) return;

  cameraStream.getTracks().forEach(track => {

    track.stop();

  });

  cameraStream = null;

}


// ============================================================

// SPLASHFACE

// ============================================================

let splashPosts = [

  {

    user: "loganbalbs",

    text: "Living my best Pear Phone life 🍐📱",

    likes: 24,

    comments: []

  },

  {

    user: "sam",

    text: "This phone is actually insane 😂",

    likes: 12,

    comments: []

  },

  {

    user: "chloe",

    text: "New post!!! ✨",

    likes: 31,

    comments: []

  }

];

function splashfaceApp() {

  renderSplashface();

}

function renderSplashface() {

  openApp(

    "SplashFace",

    `

      <div class="card">

        <h2>👤 SplashFace</h2>

        <p>

          Followers: 248

        </p>

        <button onclick="newPost()">

          ➕ New Post

        </button>

        <button onclick="shuffleSplash()">

          🔀 Discover

        </button>

      </div>

      <div id="splash-feed">

        ${splashPosts.map((post, index) => `

          <div class="card splash-post">

            <strong>@${escapeHTML(post.user)}</strong>

            <p>

              ${escapeHTML(post.text)}

            </p>

            <div>

              ❤️ ${post.likes}

            </div>

            <button onclick="likeSplash(${index})">

              ❤️ Like

            </button>

            <button onclick="commentSplash(${index})">

              💬 Comment

            </button>

            <div id="comments-${index}">

              ${post.comments.map(comment => `

                <div class="comment">

                  ${escapeHTML(comment)}

                </div>

              `).join("")}

            </div>

          </div>

        `).join("")}

      </div>

    `

  );

}

function likeSplash(index) {

  if (!splashPosts[index]) return;

  splashPosts[index].likes++;

  renderSplashface();

}

function commentSplash(index) {

  const comment = prompt("Write a comment:");

  if (!comment || !comment.trim()) return;

  if (!splashPosts[index]) return;

  splashPosts[index].comments.push(comment.trim());

  renderSplashface();

}

function newPost() {

  const text = prompt("What's happening?");

  if (!text || !text.trim()) return;

  splashPosts.unshift({

    user: "loganbalbs",

    text: text.trim(),

    likes: 0,

    comments: []

  });

  renderSplashface();

}

function shuffleSplash() {

  splashPosts = [...splashPosts].sort(

    () => Math.random() - 0.5

  );

  renderSplashface();

}


// ============================================================

// STOCKS

// ============================================================

let stockData = {

  PEAR: {

    price: 142.73,

    change: 2.41

  },

  AAPL: {

    price: 245.18,

    change: 1.18

  },

  GOOG: {

    price: 318.42,

    change: -0.73

  },

  TSLA: {

    price: 412.66,

    change: 3.82

  }

};

function stocksApp() {

  renderStocks();

}

function renderStocks() {

  openApp(

    "Stocks",

    `

      <div class="card">

        <h2>📈 Pear Stocks</h2>

        <p>

          Market status:

          <strong>OPEN</strong>

        </p>

      </div>

      <div id="stock-list">

        ${Object.keys(stockData).map(symbol => {

          const stock = stockData[symbol];

          const positive = stock.change >= 0;

          return `

            <div class="card stock-card">

              <strong>${symbol}</strong>

              <span>

                $${stock.price.toFixed(2)}

              </span>

              <span>

                ${positive ? "+" : ""}${stock.change.toFixed(2)}%

              </span>

              <button onclick="buyStock('${symbol}')">

                Buy

              </button>

              <button onclick="sellStock('${symbol}')">

                Sell

              </button>

            </div>

          `;

        }).join("")}

      </div>

      <button onclick="refreshStocks()">

        🔄 Refresh Prices

      </button>

    `

  );

}

function refreshStocks() {

  Object.keys(stockData).forEach(symbol => {

    const movement =

      (Math.random() - 0.5) * 8;

    stockData[symbol].price += movement;

    stockData[symbol].change =

      movement / stockData[symbol].price * 100;

  });

  renderStocks();

}

function buyStock(symbol) {

  if (!stockData[symbol]) return;

  alert(`Bought 1 share of ${symbol} 📈`);

}

function sellStock(symbol) {

  if (!stockData[symbol]) return;

  alert(`Sold 1 share of ${symbol} 📉`);

}


// ============================================================

// MAPS

// ============================================================

let savedPlaces = [];

function mapsApp() {

  openApp(

    "Maps",

    `

      <div class="card">

        <h2>🗺️ Pear Maps</h2>

        <input

          id="map-search"

          placeholder="Search a place..."

        >

        <button onclick="searchMap()">

          🔎 Search

        </button>

        <button onclick="useLocation()">

          📍 Use My Location

        </button>

      </div>

      <div id="map-result"></div>

      <div class="card">

        <h3>Saved Places</h3>

        <div id="saved-places">

          ${savedPlaces.length

            ? savedPlaces.map(place => `

                <button

                  onclick="showSavedPlace('${escapeHTML(place)}')"

                >

                  📍 ${escapeHTML(place)}

                </button>

              `).join("")

            : "<p>No saved places yet.</p>"}

        </div>

      </div>

    `

  );

}

function searchMap() {

  const input =

    document.getElementById("map-search");

  const result =

    document.getElementById("map-result");

  if (!input || !result) return;

  const place = input.value.trim();

  if (!place) {

    result.innerHTML = `

      <div class="card">

        Please enter a place.

      </div>

    `;

    return;

  }

  result.innerHTML = `

    <div class="card">

      <h3>📍 ${escapeHTML(place)}</h3>

      <p>

        Location found.

      </p>

      <button onclick="getDirections('${escapeHTML(place)}')">

        🚗 Directions

      </button>

      <button onclick="savePlace('${escapeHTML(place)}')">

        ⭐ Save Place

      </button>

    </div>

  `;

}

function getDirections(place) {

  alert(

    `Directions to ${place} would open here.`

  );

}

function savePlace(place) {

  if (!savedPlaces.includes(place)) {

    savedPlaces.push(place);

  }

  mapsApp();

}

function showSavedPlace(place) {

  alert(`📍 ${place}`);

}

function useLocation() {

  if (!navigator.geolocation) {

    alert("Location is not supported.");

    return;

  }

  navigator.geolocation.getCurrentPosition(

    position => {

      const lat =

        position.coords.latitude;

      const lon =

        position.coords.longitude;

      const result =

        document.getElementById("map-result");

      if (result) {

        result.innerHTML = `

          <div class="card">

            <h3>📍 Your Location</h3>

            <p>

              ${lat.toFixed(5)},

              ${lon.toFixed(5)}

            </p>

          </div>

        `;

      }

    },

    () => {

      alert("Could not get your location.");

    }

  );

}


// ============================================================

// PHOTOS

// ============================================================

let photoFavorites = [];

let photoFiles = [];

function photosApp() {

  openApp(

    "Photos",

    `

      <div class="card">

        <h2>🖼️ Pear Photos</h2>

        <input

          type="file"

          id="photo-upload"

          accept="image/*"

          multiple

          onchange="loadPhotos(event)"

        >

      </div>

      <div id="photo-gallery">

        ${photoFiles.length

          ? photoFiles.map((src, index) => `

              <div class="photo-item">

                <img

                  src="${src}"

                  style="width:100%;border-radius:10px"

                >

                <button onclick="favoritePhoto(${index})">

                  ${photoFavorites.includes(index)

                    ? "⭐ Favorited"

                    : "☆ Favorite"}

                </button>

                <button onclick="deletePhoto(${index})">

                  🗑️ Delete

                </button>

              </div>

            `).join("")

          : `

              <div class="card">

                <p>

                  No photos yet. Add some from your camera roll.

                </p>

              </div>

            `}

      </div>

    `

  );

}

function loadPhotos(event) {

  const files =

    Array.from(event.target.files || []);

  if (!files.length) return;

  files.forEach(file => {

    const reader = new FileReader();

    reader.onload = e => {

      photoFiles.push(e.target.result);

      photosApp();

    };

    reader.readAsDataURL(file);

  });

}

function favoritePhoto(index) {

  if (photoFavorites.includes(index)) {

    photoFavorites =

      photoFavorites.filter(i => i !== index);

  } else {

    photoFavorites.push(index);

  }

  photosApp();

}

function deletePhoto(index) {

  photoFiles.splice(index, 1);

  photoFavorites =

    photoFavorites.filter(i => i !== index)

      .map(i => i > index ? i - 1 : i);

  photosApp();

}


// ============================================================

// WEATHER

// ============================================================

let weatherCity = "Toronto";

function weatherApp() {

  openApp(

    "Weather",

    `

      <div class="card weather-card">

        <h2>☀️ Pear Weather</h2>

        <input

          id="weather-city"

          value="${escapeHTML(weatherCity)}"

          placeholder="City"

        >

        <button onclick="checkWeather()">

          🔎 Check Weather

        </button>

        <div id="weather-result">

          <h3>${escapeHTML(weatherCity)}</h3>

          <div class="weather-temp">

            21°

          </div>

          <p>

            ☀️ Sunny

          </p>

          <p>

            Feels like 22°

          </p>

          <p>

            Wind: 12 km/h

          </p>

          <p>

            Humidity: 48%

          </p>

        </div>

      </div>

    `

  );

}

function checkWeather() {

  const input =

    document.getElementById("weather-city");

  const result =

    document.getElementById("weather-result");

  if (!input || !result) return;

  const city = input.value.trim();

  if (!city) return;

  weatherCity = city;

  const temperatures =

    [12, 16, 19, 21, 23, 26, 28, 31];

  const temp =

    temperatures[

      Math.floor(Math.random() * temperatures.length)

    ];

  const conditions = [

    "☀️ Sunny",

    "⛅ Partly Cloudy",

    "🌧️ Rainy",

    "☁️ Cloudy",

    "🌤️ Mostly Sunny"

  ];

  const condition =

    conditions[

      Math.floor(Math.random() * conditions.length)

    ];

  result.innerHTML = `

    <h3>${escapeHTML(city)}</h3>

    <div class="weather-temp">

      ${temp}°

    </div>

    <p>${condition}</p>

    <p>

      Feels like ${temp + 1}°

    </p>

    <p>

      Wind: ${Math.floor(Math.random() * 25) + 5} km/h

    </p>

    <p>

      Humidity: ${Math.floor(Math.random() * 45) + 35}%

    </p>

  `;

}


// ============================================================

// NOTES

// ============================================================

let pearNotes = [];

function notesApp() {

  openApp(

    "Notes",

    `

      <div class="card">

        <h2>📝 Pear Notes</h2>

        <textarea

          id="note-text"

          placeholder="Write a note..."

        ></textarea>

        <button onclick="saveNote()">

          💾 Save Note

        </button>

      </div>

      <div id="notes-list">

        ${pearNotes.length

          ? pearNotes.map((note, index) => `

              <div class="card note-card">

                <p>

                  ${escapeHTML(note)}

                </p>

                <button onclick="deleteNote(${index})">

                  🗑️ Delete

                </button>

              </div>

            `).join("")

          : `

              <div class="card">

                <p>No notes yet.</p>

              </div>

            `}

      </div>

    `

  );

}

function saveNote() {

  const input =

    document.getElementById("note-text");

  if (!input || !input.value.trim()) return;

  pearNotes.unshift(input.value.trim());

  notesApp();

}

function deleteNote(index) {

  pearNotes.splice(index, 1);

  notesApp();

} 
        <div id="splash-feed">

          ${splashPosts.map((post, index) => `

            <div class="post">

              <strong>@${escapeHTML(post.user)}</strong>

              <p>${escapeHTML(post.text)}</p>

              <button onclick="likeSplash(${index})">

                ❤️ ${post.likes}

              </button>

              <button onclick="commentSplash(${index})">

                💬 ${post.comments.length}

              </button>

              ${
                post.comments.length
                  ? `

                    <div>

                      ${post.comments.map(c =>

                        `<small>💬 ${escapeHTML(c)}</small><br>`

                      ).join("")}

                    </div>

                  `
                  : ""
              }

            </div>

          `).join("")}

        </div>

      </div>

    `

  );

}

function likeSplash(index) {

  splashPosts[index].likes++;

  renderSplashface();

}

function commentSplash(index) {

  const comment =

    prompt("Write a comment:");

  if (!comment) return;

  splashPosts[index].comments.push(comment);

  renderSplashface();

}

function newPost() {

  const text =

    prompt("What's on your mind?");

  if (!text) return;

  splashPosts.unshift({

    user: "loganbalbs",

    text,

    likes: 0,

    comments: []

  });

  renderSplashface();

}

function shuffleSplash() {

  splashPosts =

    [...splashPosts].sort(

      () => Math.random() - 0.5

    );

  renderSplashface();

}


// ============================================================

// STOCKS

// ============================================================

let stockData = {

  AAPL: 227.40,

  TSLA: 355.20,

  GOOG: 255.10,

  AMZN: 232.80,

  NFLX: 112.30,

  NVDA: 182.60

};

let portfolio = {

  cash: 10000,

  holdings: {}

};

function stocksApp() {

  const rows =

    Object.keys(stockData).map(symbol => `

      <div class="stock-row">

        <strong>${symbol}</strong>

        <span>

          $${stockData[symbol].toFixed(2)}

        </span>

        <button onclick="stockDetails('${symbol}')">

          View

        </button>

      </div>

    `).join("");

  openApp(

    "Stocks",

    `

      <div class="card">

        <h2>📈 Stocks</h2>

        <h3>

          Cash:

          $${portfolio.cash.toFixed(2)}

        </h3>

        ${rows}

        <button onclick="refreshStocks()">

          🔄 Refresh Prices

        </button>

        <button onclick="addStock()">

          ➕ Add Stock

        </button>

        <button onclick="showPortfolio()">

          💼 Portfolio

        </button>

      </div>

    `

  );

}

function refreshStocks() {

  Object.keys(stockData).forEach(symbol => {

    stockData[symbol] +=

      (Math.random() - 0.5) * 15;

    if (stockData[symbol] < 1) {

      stockData[symbol] = 1;

    }

  });

  stocksApp();

}

function stockDetails(symbol) {

  openApp(

    symbol,

    `

      <div class="card">

        <h2>${symbol}</h2>

        <h1>

          $${stockData[symbol].toFixed(2)}

        </h1>

        <button onclick="buyStock('${symbol}')">

          Buy 1

        </button>

        <button onclick="sellStock('${symbol}')">

          Sell 1

        </button>

        <button onclick="stocksApp()">

          ← Back

        </button>

      </div>

    `

  );

}

function buyStock(symbol) {

  const price = stockData[symbol];

  if (portfolio.cash < price) {

    alert("Not enough cash.");

    return;

  }

  portfolio.cash -= price;

  portfolio.holdings[symbol] =

    (portfolio.holdings[symbol] || 0) + 1;

  alert("Bought 1 " + symbol);

  stocksApp();

}

function sellStock(symbol) {

  if (!portfolio.holdings[symbol]) {

    alert("You don't own this stock.");

    return;

  }

  portfolio.holdings[symbol]--;

  portfolio.cash += stockData[symbol];

  alert("Sold 1 " + symbol);

  stocksApp();

}

function showPortfolio() {

  let text = "PORTFOLIO\n\n";

  Object.keys(portfolio.holdings)

    .forEach(symbol => {

      if (portfolio.holdings[symbol] > 0) {

        text +=

          symbol +

          ": " +

          portfolio.holdings[symbol] +

          "\n";

      }

    });

  text +=

    "\nCash: $" +

    portfolio.cash.toFixed(2);

  alert(text);

}

function addStock() {

  const symbol =

    prompt("Enter stock symbol:");

  if (!symbol) return;

  const upper =

    symbol.toUpperCase();

  stockData[upper] =

    50 + Math.random() * 300;

  stocksApp();

}


// ============================================================

// MAPS

// ============================================================

let savedPlaces = [];

function mapsApp() {

  openApp(

    "Maps",

    `

      <div class="card">

        <h2>🗺️ Maps</h2>

        <input

          id="map-search"

          placeholder="Search a place..."

        >

        <button onclick="searchMap()">

          Search

        </button>

        <button onclick="routeDemo()">

          🚗 Directions

        </button>

        <button onclick="locateMe()">

          📍 Find Me

        </button>

        <button onclick="savedMapPlace()">

          ⭐ Save Place

        </button>

        <div id="map-result"></div>

        <h3>Saved Places</h3>

        <div>

          ${

            savedPlaces.length

              ? savedPlaces.map(place =>

                  `<p>📍 ${escapeHTML(place)}</p>`

                ).join("")

              : "No saved places"

          }

        </div>

      </div>

    `

  );

}

function searchMap() {

  const input =

    document.getElementById("map-search");

  const result =

    document.getElementById("map-result");

  if (!input || !result) return;

  result.innerHTML = `

    <div class="card">

      📍 Found:

      <strong>

        ${escapeHTML(input.value)}

      </strong>

      <p>

        Distance: ${(Math.random() * 20 + 1).toFixed(1)} km

      </p>

      <p>

        Estimated travel time:

        ${Math.floor(Math.random() * 30 + 5)} min
  const list =

    document.getElementById(

      "notes-list"

    );

  if (!search || !list) return;

  const query =

    search.value.toLowerCase();

  const filtered =

    notes.filter(note =>

      note.title.toLowerCase().includes(query) ||

      note.text.toLowerCase().includes(query)

    );

  list.innerHTML =

    filtered.map(note => {

      const index =

        notes.indexOf(note);

      return `

        <button

          onclick="editNote(${index})"

          style="text-align:left"

        >

          <strong>

            ${escapeHTML(note.title)}

          </strong>

          <br>

          ${escapeHTML(note.text).slice(0, 60)}

        </button>

      `;

    }).join("");

}


// ============================================================

// PEARTUNES

// ============================================================

let currentSong = 0;

let isPlaying = false;

let shuffleMode = false;

let pearAudio = null;

const pearSongs = [

  {

    title: "Pear Paradise",

    artist: "Pear Sounds",

    duration: "3:24"

  },

  {

    title: "Digital Dreams",

    artist: "Pear Sounds",

    duration: "4:02"

  },

  {

    title: "Midnight Drive",

    artist: "Pear Sounds",

    duration: "3:51"

  },

  {

    title: "Fruit Loops",

    artist: "Pear Sounds",

    duration: "2:58"

  }

];

function pearTunesApp() {

  renderPearTunes();

}

function renderPearTunes() {

  const song =

    pearSongs[currentSong];

  openApp(

    "PearTunes",

    `

      <div class="card music-player">

        <h2>🎵 PearTunes</h2>

        <div class="album-art">

          🍐

        </div>

        <h3>

          ${escapeHTML(song.title)}

        </h3>

        <p>

          ${escapeHTML(song.artist)}

        </p>

        <p>

          ${song.duration}

        </p>

        <div class="music-controls">

          <button onclick="previousSong()">

            ⏮️

          </button>

          <button onclick="toggleMusic()">

            ${isPlaying ? "⏸️" : "▶️"}

          </button>

          <button onclick="nextSong()">

            ⏭️

          </button>

        </div>

        <button onclick="toggleShuffle()">

          🔀 Shuffle:

          ${shuffleMode ? "ON" : "OFF"}

        </button>

        <input

          type="file"

          accept="audio/*"

          onchange="loadPearAudio(event)"

        >

        <div id="music-status">

          ${isPlaying ? "Playing..." : "Paused"}

        </div>

      </div>

      <div class="card">

        <h3>Playlist</h3>

        ${pearSongs.map((item, index) => `

          <button

            onclick="selectSong(${index})"

            style="text-align:left"

          >

            ${index === currentSong ? "▶️ " : ""}

            ${escapeHTML(item.title)}

            <small>

              — ${escapeHTML(item.artist)}

            </small>

          </button>

        `).join("")}

      </div>

    `

  );

}

function toggleMusic() {

  isPlaying = !isPlaying;

  if (pearAudio) {

    if (isPlaying) {

      pearAudio.play().catch(() => {});

    } else {

      pearAudio.pause();

    }

  }

  renderPearTunes();

}

function nextSong() {

  if (shuffleMode) {

    currentSong =

      Math.floor(

        Math.random() *

        pearSongs.length

      );

  } else {

    currentSong =

      (currentSong + 1) %

      pearSongs.length;

  }

  isPlaying = false;

  renderPearTunes();

}

function previousSong() {

  currentSong =

    (currentSong - 1 + pearSongs.length) %

    pearSongs.length;

  isPlaying = false;

  renderPearTunes();

}

function selectSong(index) {

  currentSong = index;

  isPlaying = false;

  renderPearTunes();

}

function toggleShuffle() {

  shuffleMode = !shuffleMode;

  renderPearTunes();

}

function loadPearAudio(event) {

  const file =

    event.target.files &&

    event.target.files[0];

  if (!file) return;

  if (pearAudio) {

    pearAudio.pause();

    pearAudio = null;

  }

  pearAudio =

    new Audio(URL.createObjectURL(file));

  pearAudio.onended = () => {

    isPlaying = false;

    nextSong();

  };

  isPlaying = true;

  pearAudio.play().catch(() => {});

  const status =

    document.getElementById(

      "music-status"

    );

  if (status) {

    status.textContent =

      "Playing: " + file.name;

  }

}


// ============================================================

// SETTINGS

// ============================================================

let pearDarkMode = false;

let pearBrightness = 100;

let pearSound = 80;

let pearAnimations = true;

function settingsApp() {

  openApp(

    "Settings",

    `

      <div class="card">

        <h2>⚙️ Settings</h2>

        <button onclick="togglePearDarkMode()">

          🌙 Dark Mode:

          ${pearDarkMode ? "ON" : "OFF"}

        </button>

        <label>

          Brightness

          <input

            type="range"

            min="20"

            max="100"

            value="${pearBrightness}"

            oninput="changeBrightness(this.value)"

          >

        </label>

        <label>

          Sound

          <input

            type="range"

            min="0"

            max="100"

            value="${pearSound}"

            oninput="changeSound(this.value)"

          >

        </label>

        <button onclick="toggleAnimations()">

          ✨ Animations:

          ${pearAnimations ? "ON" : "OFF"}

        </button>

      </div>

      <div class="card">

        <h3>⌨️ Keyboard</h3>

        <button onclick="keyboardDemo()">

          Test Pear Keyboard

        </button>

      </div>

      <div class="card">

        <h3>📱 Phone Info</h3>

        <p>

          Pear Phone OS

        </p>

        <p>

          Version 1.0

        </p>

        <p>

          Battery: 87%

        </p>

        <p>

          Storage: 42.8 GB / 128 GB

        </p>

      </div>

      <div class="card">

        <button onclick="resetPearPhone()">

          ♻️ Reset Phone

        </button>

      </div>

    `

  );

}

function togglePearDarkMode() {

  pearDarkMode = !pearDarkMode;

  document.body.classList.toggle(

    "pear-dark",

    pearDarkMode

  );

  settingsApp();

}

function changeBrightness(value) {

  pearBrightness = Number(value);

  phone.style.filter =

    `brightness(${pearBrightness}%)`;

}

function changeSound(value) {

  pearSound = Number(value);

}

function toggleAnimations() {

  pearAnimations =

    !pearAnimations;

  document.body.classList.toggle(

    "no-pear-animations",

    !pearAnimations

  );

  settingsApp();

}

function keyboardDemo() {

  openApp(

    "Keyboard",

    `

      <div class="card">

        <h2>⌨️ Pear Keyboard</h2>

        <input

          id="keyboard-demo-input"

          placeholder="Tap here to type..."

        >

        <p>

          The custom Pear Keyboard will appear.

        </p>

      </div>

    `

  );

  setTimeout(() => {

    const input =

      document.getElementById(

        "keyboard-demo-input"

      );

    if (input) input.focus();

  }, 100);

}

function resetPearPhone() {

  if (!confirm(

    "Reset Pear Phone settings?"

  )) return;

  pearDarkMode = false;

  pearBrightness = 100;

  pearSound = 80;

  pearAnimations = true;

  document.body.classList.remove(

    "pear-dark",

    "no-pear-animations"

  );

  phone.style.filter = "";

  alert("Pear Phone reset!");

  settingsApp();

}


// ============================================================

// CLOCK

// ============================================================

let clockInterval = null;

function clockApp() {

  openApp(

    "Clock",

    `

      <div class="card clock-card">

        <h2>🕐 Pear Clock</h2>

        <div

          id="digital-clock"

          style="font-size:32px;font-weight:bold"

        ></div>

        <p id="clock-date"></p>

        <button onclick="startTimer()">

          ⏱️ Timer

        </button>

        <button onclick="stopClock()">

          Stop Clock

        </button>

      </div>

    `

  );

  updateClock();

  clearInterval(clockInterval);

  clockInterval =

    setInterval(updateClock, 1000);

}

function updateClock() {

  const clock =

    document.getElementById(

      "digital-clock"

    );

  const date =

    document.getElementById(

      "clock-date"

    );

  if (!clock) return;

  const now = new Date();

  clock.textContent =

    now.toLocaleTimeString();

  if (date) {

    date.textContent =

      now.toLocaleDateString(

        undefined,

        {

          weekday: "long",

          year: "numeric",

          month: "long",

          day: "numeric"

        }

      );

  }

}

function stopClock() {

  clearInterval(clockInterval);

  clockInterval = null;

}

let timerSeconds = 0;

let timerInterval = null;

function startTimer() {

  const input =

    prompt("Timer length in seconds:", "60");

  const seconds =

    Number(input);

  if (!seconds || seconds <= 0) return;

  timerSeconds = seconds;

  clearInterval(timerInterval);

  timerInterval =

    setInterval(() => {

      timerSeconds--;

      if (timerSeconds <= 0) {

        clearInterval(timerInterval);

        timerInterval = null;

        alert("⏰ Timer finished!");

        return;

      }

    }, 1000);

  alert(

    `⏱️ Timer started for ${seconds} seconds.`

  );

}


// ============================================================

// VIDEOS

// ============================================================

let currentVideoURL = null;

function videosApp() {

  openApp(

    "Videos",

    `

      <div class="card">

        <h2>🎬 Pear Videos</h2>

        <input

          type="file"

          accept="video/*"

          onchange="loadVideo(event)"

        >

        <video

          id="pear-video"

          controls

          playsinline

          style="width:100%;display:none"

        ></video>

        <div>

          <button onclick="playPearVideo()">

            ▶️ Play

          </button>

          <button onclick="pausePearVideo()">

            ⏸️ Pause

          </button>

          <button onclick="restartPearVideo()">

            🔄 Restart

          </button>

        </div>

        <button onclick="fullscreenPearVideo()">

          ⛶ Fullscreen

        </button>

      </div>

    `

  );

}

function loadVideo(event) {

  const file =

    event.target.files &&

    event.target.files[0];

  const video =

    document.getElementById(

      "pear-video"

    );

  if (!file || !video) return;

  if (currentVideoURL) {

    URL.revokeObjectURL(

      currentVideoURL

    );

  }

  currentVideoURL =

    URL.createObjectURL(file);

  video.src = currentVideoURL;

  video.style.display = "block";

}

function playPearVideo() {

  const video =

    document.getElementById(

      "pear-video"

    );

  if (video) {

    video.play().catch(() => {});

  }

}

function pausePearVideo() {

  const video =

    document.getElementById(

      "pear-video"

    );

  if (video) {

    video.pause();

  }

}

function restartPearVideo() {

  const video =

    document.getElementById(

      "pear-video"

    );

  if (!video) return;

  video.currentTime = 0;

  video.play().catch(() => {});

}

function fullscreenPearVideo() {

  const video =

    document.getElementById(

      "pear-video"

    );

  if (!video) return;

  if (video.requestFullscreen) {

    video.requestFullscreen();

  } else if (

    video.webkitEnterFullscreen

  ) {

    video.webkitEnterFullscreen();

  }

}
        <button
          onclick="editNote(${item.index})"
        >
          ${escapeHTML(item.note.title)}
        </button>

      `)

      .join("");

}


// ============================================================

// PEARTUNES

// ============================================================

let musicIndex = 0;

const demoSongs = [

  "Pear Dreams",

  "Midnight Drive",

  "Pixel Paradise",

  "Fruit Juice",

  "Neon Apples"

];

function pearTunesApp() {

  openApp(

    "PearTunes",

    `

      <div class="card">

        <h2>🎵 PearTunes</h2>

        <h3 id="song-title">

          ${demoSongs[musicIndex]}

        </h3>

        <button onclick="previousSong()">

          ⏮

        </button>

        <button onclick="playDemoTone()">

          ▶

        </button>

        <button onclick="nextSong()">

          ⏭

        </button>

        <button onclick="shuffleSongs()">

          🔀

        </button>

        <input

          type="range"

          min="0"

          max="100"

          value="70"

          style="width:100%"

        >

        <hr>

        <input

          type="file"

          accept="audio/*"

          onchange="loadAudio(event)"

        >

        <audio

          id="audio-player"

          controls

          style="width:100%"

        ></audio>

      </div>

    `

  );

}

function playDemoTone() {

  const AudioContext =

    window.AudioContext ||

    window.webkitAudioContext;

  if (!AudioContext) return;

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

    0.0001,

    context.currentTime + 1

  );

  oscillator.stop(

    context.currentTime + 1

  );

}

function nextSong() {

  musicIndex =

    (musicIndex + 1) %

    demoSongs.length;

  updateSongTitle();

}

function previousSong() {

  musicIndex--;

  if (musicIndex < 0) {

    musicIndex =

      demoSongs.length - 1;

  }

  updateSongTitle();

}

function shuffleSongs() {

  musicIndex =

    Math.floor(

      Math.random() *

      demoSongs.length

    );

  updateSongTitle();

}

function updateSongTitle() {

  const title =

    document.getElementById(

      "song-title"

    );

  if (title) {

    title.textContent =

      demoSongs[musicIndex];

  }

}

function loadAudio(event) {

  const file =

    event.target.files[0];

  if (!file) return;

  const player =

    document.getElementById(

      "audio-player"

    );

  player.src =

    URL.createObjectURL(file);

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

        <h3>Appearance</h3>

        <button onclick="toggleDarkMode()">

          🌙 Dark / Light Mode

        </button>

        <label>

          Brightness

          <input

            type="range"

            min="50"

            max="100"

            value="100"

            oninput="changeBrightness(this.value)"

          >

        </label>

        <h3>Sound</h3>

        <button onclick="toggleSound()">

          🔊 Sound On / Off

        </button>

        <button onclick="testSound()">

          🔔 Test Sound

        </button>

        <h3>Animations</h3>

        <button onclick="toggleAnimations()">

          ✨ Toggle Animations

        </button>

        <h3>Keyboard</h3>

        <button onclick="keyboardDemo()">

          ⌨️ Test Keyboard

        </button>

        <h3>Phone</h3>

        <button onclick="phoneInfo()">

          🍐 Pear Phone Info

        </button>

        <button onclick="batteryInfo()">

          🔋 Battery

        </button>

        <button onclick="storageInfo()">

          💾 Storage

        </button>

        <h3>Data</h3>

        <button onclick="resetNotes()">

          📝 Clear Notes

        </button>

        <button onclick="resetPhone()">

          🔄 Reset Pear Phone

        </button>

      </div>

    `

  );

}

function toggleDarkMode() {

  document.body.classList.toggle("dark-mode");

  localStorage.setItem(

    "pear-dark",

    document.body.classList.contains("dark-mode")

  );

}

function changeBrightness(value) {

  phone.style.filter =

    `brightness(${value}%)`;

}

function toggleSound() {

  const enabled =

    localStorage.getItem("pear-sound") !== "false";

  localStorage.setItem(

    "pear-sound",

    String(!enabled)

  );

  alert(

    !enabled

      ? "Sound enabled 🔊"

      : "Sound disabled 🔇"

  );

}

function testSound() {

  playDemoTone();

}

function toggleAnimations() {

  document.body.classList.toggle(

    "no-animations"

  );

  localStorage.setItem(

    "pear-animations",

    document.body.classList.contains(

      "no-animations"

    )

  );

}

function keyboardDemo() {

  openApp(

    "Keyboard Test",
            <input
          id="keyboard-test"
          placeholder="Type here..."
        >

        <p>
          Tap the keyboard below and try it!
        </p>

      </div>

    `

  );

  setTimeout(() => {

    const input =

      document.getElementById(

        "keyboard-test"

      );

    if (input) {

      input.focus();

      showPearKeyboard(input);

    }

  }, 100);

}

function phoneInfo() {

  alert(

    "🍐 PEAR PHONE\n\n" +

    "Pear Phone OS\n" +

    "Version 2.0\n" +

    "Built for the Pear Phone"

  );

}

function batteryInfo() {

  if (

    navigator.getBattery

  ) {

    navigator.getBattery()

      .then(battery => {

        alert(

          "Battery: " +

          Math.round(

            battery.level * 100

          ) +

          "%"

        );

      });

  } else {

    alert(

      "Battery: 87%"

    );

  }

}

function storageInfo() {

  alert(

    "Storage\n\n" +

    "Used: 3.2 GB\n" +

    "Free: 28.8 GB\n" +

    "Total: 32 GB"

  );

}

function resetNotes() {

  localStorage.removeItem(

    "pear-notes"

  );

  notes = [];

  alert("All notes deleted.");

}

function resetPhone() {

  localStorage.clear();

  document.body.classList.remove(

    "dark-mode",

    "no-animations"

  );

  alert(

    "Pear Phone has been reset!"

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

        <div id="live-clock"
             style="font-size:32px">

          ${new Date().toLocaleTimeString()}

        </div>

        <hr>

        <h3>Stopwatch</h3>

        <div id="stopwatch">

          00:00

        </div>

        <button onclick="startStopwatch()">

          Start

        </button>

        <button onclick="stopStopwatch()">

          Stop

        </button>

        <button onclick="resetStopwatch()">

          Reset

        </button>

        <h3>Timer</h3>

        <input

          id="timer-input"

          type="number"

          value="60"

          min="1"

        >

        <div id="timer">

          01:00

        </div>

        <button onclick="startTimer()">

          Start

        </button>

        <button onclick="resetTimer()">

          Reset

        </button>

        <h3>Alarm</h3>

        <input

          id="alarm-time"

          type="time"

        >

        <button onclick="setAlarm()">

          Set Alarm

        </button>

      </div>

    `

  );

  updateClock();

}

function updateClock() {

  const clock =

    document.getElementById("live-clock");

  if (clock) {

    clock.textContent =

      new Date().toLocaleTimeString();

  }

}

setInterval(updateClock, 1000);

function startStopwatch() {

  if (stopwatchInterval) return;

  stopwatchInterval =

    setInterval(() => {

      stopwatchSeconds++;

      const el =

        document.getElementById(

          "stopwatch"

        );

      if (el) {

        el.textContent =

          formatTime(stopwatchSeconds);

      }

    }, 1000);

}

function stopStopwatch() {

  clearInterval(stopwatchInterval);

  stopwatchInterval = null;

}

function resetStopwatch() {

  stopStopwatch();

  stopwatchSeconds = 0;

  const el =

    document.getElementById(

      "stopwatch"

    );

  if (el) {

    el.textContent = "00:00";

  }

}

function startTimer() {

  if (timerInterval) return;

  const input =

    document.getElementById(

      "timer-input"

    );

  if (input) {

    timerSeconds =

      Math.max(

        1,

        Number(input.value) || 60

      );

  }

  timerInterval =

    setInterval(() => {

      timerSeconds--;

      const el =

        document.getElementById(

          "timer"

        );

      if (el) {

        el.textContent =

          formatTime(timerSeconds);

      }

      if (timerSeconds <= 0) {

        clearInterval(timerInterval);

        timerInterval = null;

        alert(

          "⏰ Timer finished!"

        );

      }

    }, 1000);

}

function resetTimer() {

  clearInterval(timerInterval);

  timerInterval = null;

  timerSeconds = 60;

  const el =

    document.getElementById("timer");

  if (el) {

    el.textContent = "01:00";

  }

}

function setAlarm() {

  const time =

    document.getElementById(

      "alarm-time"

    );

  if (!time || !time.value) {

    alert("Choose an alarm time.");

    return;

  }

  alert(

    "⏰ Alarm set for " +

    time.value

  );

}

function formatTime(seconds) {

  const minutes =

    Math.floor(seconds / 60);

  const secs =

    seconds % 60;

  return (

    String(minutes).padStart(2, "0") +

    ":" +

    String(secs).padStart(2, "0")

  );

}


// ============================================================

// VIDEOS

// ============================================================

function videosApp() {

  openApp(

    "Videos",
          <div class="card">

        <h2>🎬 Videos</h2>

        <input
          type="file"
          accept="video/*"
          onchange="loadVideo(event)"
        >

        <video
          id="video-player"
          controls
          style="width:100%"
        ></video>

        <button onclick="fullscreenVideo()">

          ⛶ Fullscreen

        </button>

        <button onclick="restartVideo()">

          🔄 Restart

        </button>

      </div>

    `

  );

}

function loadVideo(event) {

  const file =

    event.target.files[0];

  if (!file) return;

  const video =

    document.getElementById(

      "video-player"

    );

  video.src =

    URL.createObjectURL(file);

}

function fullscreenVideo() {

  const video =

    document.getElementById(

      "video-player"

    );

  if (

    video &&

    video.requestFullscreen

  ) {

    video.requestFullscreen();

  }

}

function restartVideo() {

  const video =

    document.getElementById(

      "video-player"

    );

  if (video) {

    video.currentTime = 0;

    video.play();

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
            font-size:26px;
            text-align:center;
          "
        >

          —

        </div>

        <div class="keypad">

          ${[

            "1","2","3",

            "4","5","6",

            "7","8","9",

            "*","0","#"

          ].map(n => `

            <button
              onclick="pressNumber('${n}')"
            >

              ${n}

            </button>

          `).join("")}

        </div>

        <button onclick="makeCall()">

          📞 Call

        </button>

        <button onclick="clearNumber()">

          Clear

        </button>

        <button onclick="fakeContacts()">

          👥 Contacts

        </button>

        <button onclick="fakeRecents()">

          🕘 Recent Calls

        </button>

      </div>

    `

  );

}

function pressNumber(number) {

  phoneNumber += number;

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

    display.textContent = "—";

  }

}

function makeCall() {

  if (!phoneNumber) {

    alert("Enter a number first.");

    return;

  }

  alert(

    "📞 Calling " +

    phoneNumber +

    "..."

  );

}

function fakeContacts() {

  alert(

    "Contacts\n\n" +

    "Chloe\n" +

    "Sam\n" +

    "Cat\n" +

    "Pear Support"

  );

}

function fakeRecents() {

  alert(

    "Recent Calls\n\n" +

    "Chloe — 2 min\n" +

    "Sam — 14 min\n" +

    "Pear Support — Yesterday"

  );

}


// ============================================================

// MAIL

// ============================================================

let emails = [

  {

    from: "Pear Team",

    subject: "Welcome!",

    body: "Welcome to your Pear Phone!"

  },

  {

    from: "Sam",

    subject: "What's up?",

    body: "Are you free later?"

  },

  {

    from: "PearTunes",

    subject: "New music",

    body: "Check out the latest tracks."

  }

];

function mailApp() {

  openApp(

    "Mail",

    `

      <div class="card">

        <h2>✉️ Mail</h2>

        <button onclick="composeEmail()">

          ✏️ Compose

        </button>

        ${emails.map((email, index) => `

          <button
            onclick="readEmail(${index})"
            style="text-align:left"
          >

            <strong>

              ${escapeHTML(email.from)}

            </strong>

            <br>

            ${escapeHTML(email.subject)}

          </button>

        `).join("")}

      </div>

    `

  );

}

function readEmail(index) {

  const email = emails[index];

  openApp(

    "Mail",

    `

      <div class="card">

        <h2>

          ${escapeHTML(email.subject)}

        </h2>

        <strong>

          From:

          ${escapeHTML(email.from)}

        </strong>

        <p>

          ${escapeHTML(email.body)}

        </p>

        <button onclick="replyEmail(${index})">

          ↩️ Reply

        </button>

        <button onclick="deleteEmail(${index})">

          🗑️ Delete

        </button>

      </div>

    `

  );

}

function replyEmail(index) {

  openApp(

    "Reply",

    `

      <div class="card">

        <h2>

          Re: ${escapeHTML(

            emails[index].subject

          )}

        </h2>

        <textarea

          placeholder="Write reply..."

        ></textarea>

        <button onclick="alert('Reply sent! ✉️')">

          Send

        </button>

      </div>

    `

  );

}

function deleteEmail(index) {

  emails.splice(index, 1);

  mailApp();

}

function composeEmail() {
  openApp(

    "Compose",

    `

      <div class="card">

        <input placeholder="To">

        <input placeholder="Subject">

        <textarea

          placeholder="Write email..."

        ></textarea>

        <button onclick="alert('Email sent! ✉️')">

          Send

        </button>

        <button onclick="alert('Saved to Drafts!')">

          💾 Save Draft

        </button>

      </div>

    `

  );

}


// ============================================================

// COMPASS

// ============================================================

let compassDegree = 0;

function compassApp() {

  openApp(

    "Compass",

    `

      <div

        class="card"

        style="text-align:center"

      >

        <h2>🧭 Compass</h2>

        <div

          id="compass-direction"

          style="font-size:60px"

        >

          N

        </div>

        <p id="compass-degree">

          0°

        </p>

        <button onclick="calibrateCompass()">

          🧭 Calibrate

        </button>

        <button onclick="compassChallenge()">

          🎯 Direction Challenge

        </button>

      </div>

    `

  );

}

function calibrateCompass() {

  compassDegree =

    Math.floor(Math.random() * 360);

  const directions = [

    "N","NE","E","SE",

    "S","SW","W","NW"

  ];

  const direction =

    directions[

      Math.round(

        compassDegree / 45

      ) % 8

    ];

  document.getElementById(

    "compass-direction"

  ).textContent = direction;

  document.getElementById(

    "compass-degree"

  ).textContent =

    compassDegree + "°";

}

function compassChallenge() {

  const directions = [

    "N","NE","E","SE",

    "S","SW","W","NW"

  ];

  const answer =

    directions[

      Math.floor(

        Math.random() *

        directions.length

      )

    ];

  const guess =

    prompt(

      "Which direction is " +

      answer +

      "?"

    );

  if (

    guess &&

    guess.toUpperCase() === answer

  ) {

    alert("Correct! 🧭");

  } else {

    alert(

      "Not quite! The answer was " +

      answer

    );

  }

}


// ============================================================

// TUMPS — TYPING GAME

// ============================================================

let typingTimer = null;

let typingStartTime = 0;

let typingSentence = "";

let typingFinished = false;

const typingSentences = [

  "The quick brown fox jumps over the lazy dog.",

  "Pear Phone OS is ready for another adventure.",

  "I can type really fast when I concentrate.",

  "The best ideas sometimes start with a tiny screen.",

  "Welcome to the coolest phone in the world.",

  "Today is going to be a great day.",

  "The Raspberry Pi is running Pear Phone OS.",

  "Never underestimate a tiny touchscreen computer.",

  "I wonder what secret apps are hiding here.",

  "Everything is better with a little bit of fun."

];

function thumbApp() {

  tumsApp();

}

function tumsApp() {

  typingSentence =

    typingSentences[

      Math.floor(

        Math.random() *

        typingSentences.length

      )

    ];

  typingFinished = false;

  openApp(

    "Tumps",

    `

      <div class="card typing-game">

        <h2>⌨️ Tumps</h2>

        <p>

          Type the sentence as fast and accurately

          as possible.

        </p>

        <div

          id="typing-sentence"

          class="typing-sentence"

        >

          ${escapeHTML(typingSentence)}

        </div>

        <input

          id="typing-input"

          placeholder="Tap START first..."

          disabled

          autocomplete="off"

          autocorrect="off"

          autocapitalize="off"

          spellcheck="false"

          oninput="typingInputChanged()"

        >

        <div class="typing-stats">

          <div>

            ⏱️

            <strong id="typing-time">

              0.0

            </strong>s

          </div>

          <div>

            ⚡

            <strong id="typing-wpm">

              0

            </strong>

            WPM

          </div>

          <div>

            🎯

            <strong id="typing-accuracy">

              100

            </strong>%

          </div>

        </div>

        <button onclick="startTypingGame()">

          ▶ START

        </button>

        <button onclick="newTypingSentence()">

          🔄 NEW SENTENCE

        </button>

        <div id="typing-result"></div>

      </div>

    `

  );

}

function startTypingGame() {

  stopTypingGame();

  const input =

    document.getElementById(

      "typing-input"

    );

  const result =

    document.getElementById(

      "typing-result"

    );

  if (!input) return;

  input.disabled = false;

  input.value = "";

  input.placeholder = "Start typing...";

  if (result) {

    result.innerHTML = "";

  }

  typingFinished = false;

  typingStartTime = Date.now();

  typingTimer =

    setInterval(updateTypingStats, 100);

  input.focus();

  showPearKeyboard(input);

}

function stopTypingGame() {

  if (typingTimer) {

    clearInterval(typingTimer);

    typingTimer = null;

  }

}

function updateTypingStats() {

  if (!typingStartTime) return;

  const elapsed =

    (Date.now() - typingStartTime) / 1000;

  const time =

    document.getElementById(

      "typing-time"

    );

  if (time) {

    time.textContent =

      elapsed.toFixed(1);

  }

  updateTypingCalculations(elapsed);

}

function typingInputChanged() {

  if (typingFinished) return;

  const input =

    document.getElementById(

      "typing-input"

    );

  if (!input) return;

  const typed = input.value;

  updateTypingCalculations(

    (Date.now() - typingStartTime) / 1000

  );

  if (

    typed === typingSentence

  ) {

    finishTypingGame();

  }

}
}

function updateTypingCalculations(elapsed) {

  const input =
    document.getElementById(
      "typing-input"
    );

  if (!input) return;

  const typed =
    input.value;

  let correct = 0;

  for (
    let i = 0;
    i < typed.length &&
    i < typingSentence.length;
    i++
  ) {

    if (
      typed[i] ===
      typingSentence[i]
    ) {

      correct++;

    }

  }

  const accuracy =
    typed.length === 0
      ? 100
      : Math.round(
          (correct /
            typed.length) *
          100
        );

  const words =
    correct / 5;

  const minutes =
    elapsed / 60;

  const wpm =
    minutes > 0
      ? Math.round(
          words / minutes
        )
      : 0;

  const accuracyEl =
    document.getElementById(
      "typing-accuracy"
    );

  const wpmEl =
    document.getElementById(
      "typing-wpm"
    );

  if (accuracyEl) {

    accuracyEl.textContent =
      Math.max(
        0,
        Math.min(
          100,
          accuracy
        )
      );

  }

  if (wpmEl) {

    wpmEl.textContent =
      wpm;

  }

  highlightTyping();

}

function highlightTyping() {

  const sentence =
    document.getElementById(
      "typing-sentence"
    );

  const input =
    document.getElementById(
      "typing-input"
    );

  if (!sentence || !input) return;

  const typed =
    input.value;

  sentence.innerHTML =
    typingSentence
      .split("")
      .map((char, index) => {

        if (index >= typed.length) {

          return `
            <span>
              ${escapeHTML(char)}
            </span>
          `;

        }

        if (
          typed[index] === char
        ) {

          return `
            <span style="color:green">
              ${escapeHTML(char)}
            </span>
          `;

        }

        return `
          <span style="color:red">
            ${escapeHTML(char)}
          </span>
        `;

      })
      .join("");

}

function finishTypingGame() {

  if (typingFinished) return;

  typingFinished = true;

  const elapsed =
    (Date.now() - typingStartTime) / 1000;

  stopTypingGame();

  const input =
    document.getElementById(
      "typing-input"
    );

  if (input) {

    input.disabled = true;

  }

  const wpm =
    Math.round(
      (typingSentence.length / 5) /
      (elapsed / 60)
    );

  const result =
    document.getElementById(
      "typing-result"
    );

  if (result) {

    result.innerHTML = `

      <div class="card">

        <h2>🎉 Finished!</h2>

        <p>

          ⏱️ Time:

          ${elapsed.toFixed(2)} seconds

        </p>

        <p>

          ⚡ Speed:

          ${wpm} WPM

        </p>

        <p>

          🎯 Accuracy:

          100%

        </p>

        <button onclick="newTypingSentence()">

          Play Again

        </button>

      </div>

    `;

  }

  hidePearKeyboard();

}

function newTypingSentence() {

  stopTypingGame();

  typingSentence =

    typingSentences[

      Math.floor(

        Math.random() *

        typingSentences.length

      )

    ];

  tumsApp();

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

        <input
          id="lingo-input"
          placeholder="Type a word..."
        >

        <button onclick="translateLingo()">

          Translate

        </button>

        <button onclick="lingoQuiz()">

          🎯 Word Quiz

        </button>

        <div id="lingo-result"></div>

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

  if (!input || !result) return;

  const dictionary = {

    hello: "hola",

    goodbye: "adios",

    apple: "manzana",

    friend: "amigo",

    house: "casa",

    water: "agua",

    music: "musica",

    phone: "telefono"

  };

  const word =
    input.value
      .trim()
      .toLowerCase();

  result.innerHTML = `

    <h3>

      ${escapeHTML(
        dictionary[word] ||
        "No translation found"
      )}

    </h3>

  `;

}

function lingoQuiz() {

  const words = [

    ["hello", "hola"],

    ["apple", "manzana"],

    ["friend", "amigo"],

    ["house", "casa"],

    ["water", "agua"]

  ];

  const item =

    words[

      Math.floor(

        Math.random() *

        words.length

      )

    ];

  const answer =

    prompt(

      "Translate: " +

      item[0]

    );

  if (

    answer &&

    answer.toLowerCase().trim() ===

    item[1]

  ) {

    alert("Correct! 🎉");

  } else {

    alert(

      "The answer was: " +

      item[1]

    );

  }

}
// ============================================================

// DANWARP

// ============================================================

const warpLocations = [

  "Toronto",

  "New York",

  "Tokyo",

  "London",

  "Paris",

  "Los Angeles",

  "Vancouver",

  "Mars 🚀",

  "The Moon 🌙",

  "Pear Headquarters 🍐"

];

function danwarpApp() {

  openApp(

    "DanWarp",

    `

      <div class="card">

        <h2>🌀 DanWarp</h2>

        <div
          id="warp-location"
          style="font-size:24px"
        >

          Ready...

        </div>

        <button onclick="warp()">

          ⚡ WARP

        </button>

        <button onclick="randomWarp()">

          🎲 Random Destination

        </button>

        <h3>Warp Energy</h3>

        <input
          type="range"
          min="0"
          max="100"
          value="100"
          id="warp-energy"
        >

      </div>

    `

  );

}

function warp() {

  const destination =

    warpLocations[

      Math.floor(

        Math.random() *

        warpLocations.length

      )

    ];

  const result =

    document.getElementById(

      "warp-location"

    );

  if (result) {

    result.innerHTML =

      "⚡ " +

      destination;

  }

}

function randomWarp() {

  warp();

}


// ============================================================

// IMAGE

// ============================================================

function imageApp() {

  openApp(

    "Image",

    `

      <div class="card">

        <h2>🖼️ Image Studio</h2>

        <input
          type="file"
          accept="image/*"
          onchange="loadSingleImage(event)"
        >

        <div id="single-image"></div>

        <button onclick="rotateImage()">

          🔄 Rotate

        </button>

        <button onclick="imageZoom(1.2)">

          🔍 Zoom In

        </button>

        <button onclick="imageZoom(.8)">

          🔎 Zoom Out

        </button>

        <button onclick="imageFilter()">

          ✨ Filter

        </button>

      </div>

    `

  );

}

function loadSingleImage(event) {

  const file =

    event.target.files[0];

  if (!file) return;

  const image =

    document.getElementById(

      "single-image"

    );

  image.innerHTML = `

    <img
      id="studio-image"
      src="${URL.createObjectURL(file)}"
      style="
        width:100%;
        transition:.3s;
      "
    >

  `;

}

let imageRotation = 0;

let imageScale = 1;

function rotateImage() {

  const image =

    document.getElementById(

      "studio-image"

    );

  if (!image) return;

  imageRotation += 90;

  image.style.transform =

    `rotate(${imageRotation}deg)
     scale(${imageScale})`;

}

function imageZoom(amount) {

  const image =

    document.getElementById(

      "studio-image"

    );

  if (!image) return;

  imageScale *= amount;

  imageScale =

    Math.max(

      .5,

      Math.min(

        3,

        imageScale

      )

    );

  image.style.transform =

    `rotate(${imageRotation}deg)
     scale(${imageScale})`;

}

function imageFilter() {

  const image =

    document.getElementById(

      "studio-image"

    );

  if (!image) return;

  image.style.filter =

    image.style.filter

      ? ""

      : "grayscale(100%) contrast(1.2)";

}


// ============================================================

// CHRONO

// ============================================================

function chronoApp() {

  openApp(

    "Chrono",

    `

      <div class="card">

        <h2>⏱️ Chrono</h2>

        <div
          id="chrono-time"
          style="font-size:45px"
        >

          00:00

        </div>

        <button onclick="chronoStart()">

          Start

        </button>

        <button onclick="chronoStop()">

          Stop

        </button>

        <button onclick="chronoReset()">

          Reset

        </button>

        <button onclick="chronoChallenge()">

          🎯 Challenge

        </button>

      </div>

    `

  );

}

let chronoSeconds = 0;

let chronoInterval = null;

function chronoStart() {

  if (chronoInterval) return;

  chronoInterval =

    setInterval(() => {

      chronoSeconds++;

      const el =

        document.getElementById(

          "chrono-time"

        );

      if (el) {

        el.textContent =

          formatTime(

            chronoSeconds

          );

      }

    }, 1000);

}

function chronoStop() {

  clearInterval(chronoInterval);

  chronoInterval = null;

}

function chronoReset() {

  chronoStop();

  chronoSeconds = 0;

  const el =

    document.getElementById(

      "chrono-time"

    );

  if (el) {

    el.textContent = "00:00";

  }

}

function chronoChallenge() {

  const target =

    Math.floor(

      Math.random() * 10

    ) + 5;

  alert(

    "Start the stopwatch and try to stop it at exactly " +

    target +

    " seconds!"

  );

}


// ============================================================

// ZAPLOOK

// ============================================================

const zapCategories = [

  "Technology",

  "Music",

  "Games",

  "Movies",

  "Sports",

  "Travel",

  "Food",

  "Random"

];

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

        <button onclick="zapSearch()">

          🔎 Search

        </button>

        <h3>Categories</h3>

        ${zapCategories.map(category => `

          <button onclick="zapCategory('${category}')">

            ${category}

          </button>

        `).join("")}

        <div id="zap-result"></div>

      </div>

    `

  );

}

function zapSearch() {

  const input =

    document.getElementById(

      "zap-input"

    );

  if (!input) return;

  const result =

    document.getElementById(

      "zap-result"

    );

  result.innerHTML = `

    <div class="card">

      <h3>

        Results for

        "${escapeHTML(input.value)}"

      </h3>

      <p>⚡ Result #1</p>

      <p>⚡ Result #2</p>

      <p>⚡ Result #3</p>

    </div>

  `;

}

function zapCategory(category) {

  const result =

    document.getElementById(

      "zap-result"

    );

  if (result) {

    result.innerHTML = `

      <div class="card">

        <h3>${category}</h3>

        <p>

          Discover something interesting!

        </p>

      </div>

    `;

  }

}


// ============================================================

// MONKEY MINI GAME

// ============================================================

let monkeyScore = 0;

function monkeyApp() {

  monkeyScore = 0;

  openApp(

    "Monkey",

    `

      <div

        class="card"

        style="text-align:center"

      >

        <h2>🐒 Monkey Game</h2>

        <div

          id="monkey"

          style="

            font-size:90px;

            transition:.25s;

          "

        >

          🐒

        </div>

        <h3>

          Bananas:

          <span id="banana-score">

            0

          </span>

        </h3>

        <button onclick="monkeyJump()">

          🍌 Catch Banana

        </button>

        <button onclick="monkeyRandom()">

          🎲 Random Event

        </button>

      </div>

    `

  );

}

function monkeyJump() {

  monkeyScore++;

  const monkey =

    document.getElementById(

      "monkey"

    );

  const score =

    document.getElementById(

      "banana-score"

    );

  if (monkey) {

    monkey.style.transform =

      "translateY(-60px) rotate(-8deg)";

    setTimeout(() => {

      monkey.style.transform =

        "translateY(0) rotate(0)";

    }, 300);

  }

  if (score) {

    score.textContent =

      monkeyScore;

  }

}

function monkeyRandom() {

  const events = [

    "🐒 Monkey found a banana!",

    "🍌 Banana rain!",

    "🌴 Monkey climbed a tree!",

    "😂 Monkey slipped!",

    "🏆 MONKEY POWER!"

  ];

  alert(

    events[

      Math.floor(

        Math.random() *

        events.length

      )

    ]

  );

}


// ============================================================

// REMARK

// ============================================================

let remarks = JSON.parse(

  localStorage.getItem(

    "pear-remarks"

  ) || "[]"

);

function remarkApp() {

  openApp(

    "Remark",

    `

      <div class="card">

        <h2>💭 Remark</h2>

        <textarea

          id="remark-text"

          placeholder="Write something..."

        ></textarea>

        <button onclick="saveRemark()">

          💾 Save

        </button>

        <button onclick="clearRemarks()">

          🗑️ Clear All

        </button>

        <div>

          ${remarks.map((remark, index) => `

            <div class="post">

              ${escapeHTML(remark)}

              <br>

              <button onclick="deleteRemark(${index})">

                Delete

              </button>

            </div>

          `).join("")}

        </div>

      </div>

    `

  );

}

function saveRemark() {

  const text =

    document.getElementById(

      "remark-text"

    );

  if (!text || !text.value.trim()) {

    return;

  }

  remarks.unshift(text.value);

  localStorage.setItem(

    "pear-remarks",

    JSON.stringify(remarks)

  );

  remarkApp();

}

function deleteRemark(index) {

  remarks.splice(index, 1);

  localStorage.setItem(

    "pear-remarks",

    JSON.stringify(remarks)

  );

  remarkApp();

}

function clearRemarks() {

  remarks = [];

  localStorage.removeItem(

    "pear-remarks"

  );

  remarkApp();

}


// ============================================================

// PAGE 1 CONNECTIONS

// ============================================================

function connectPage1Apps() {

  const connections = {

    messages: messagesApp,

    camera: cameraApp,

    splashface: splashfaceApp,

    stocks: stocksApp,

    maps: mapsApp,

    photos: photosApp,

    weather: weatherApp,

    notes: notesApp,

    peartunes: pearTunesApp,

    settings: settingsApp,

    clock: clockApp,

    videos: videosApp,

    phone: phoneApp,

    mail: mailApp,

    compass: compassApp,

    music: pearTunesApp

  };

  Object.keys(connections).forEach(id => {

    const button =

      document.getElementById(id);

    if (!button) return;

    button.addEventListener(

      "click",

      e => {

        e.stopPropagation();

        connections[id]();

      }

    );

  });

}


// ============================================================

// PAGE 2 CONNECTIONS

// ============================================================

function connectPage2Apps() {

  const connections = {

    "p2-lingo": lingoApp,

    "p2-splash": splashfaceApp,
        "p2-thumb": tumsApp,

    "p2-danwarp": danwarpApp,

    "p2-image": imageApp,

    "p2-chrono": chronoApp,

    "p2-zaplook": zaplookApp,

    "p2-weather": weatherApp,

    "p2-music": pearTunesApp,

    "p2-monkey": monkeyApp,

    "p2-remark": remarkApp,

    "p2-settings": settingsApp,

    "p2-phone": phoneApp,

    "p2-mail": mailApp,

    "p2-compass": compassApp,

    "p2-music2": pearTunesApp

  };

  Object.keys(connections).forEach(id => {

    const button =

      document.getElementById(id);

    if (!button) return;

    button.addEventListener(

      "click",

      e => {

        e.stopPropagation();

        connections[id]();

      }

    );

  });

}


// ============================================================

// HOME BUTTON

// ============================================================

const homeButton =

  document.getElementById("home");

if (homeButton) {

  homeButton.addEventListener(

    "click",

    e => {

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

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");

}


// ============================================================

// STARTUP

// ============================================================

connectPage1Apps();

connectPage2Apps();

if (

  localStorage.getItem(

    "pear-dark"

  ) === "true"

) {

  document.body.classList.add(

    "dark-mode"

  );

}

if (

  localStorage.getItem(

    "pear-animations"

  ) === "true"

) {

  document.body.classList.add(

    "no-animations"

  );

}

currentPage = 1;

phone.classList.remove(

  "page-two"

);

if (pageDots) {

  pageDots.textContent = "● ○";

}
