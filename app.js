// ============================================================

// PEAR PHONE OS — FULL APP.JS

// ============================================================

const phone = document.getElementById("phone-container");

const overlay = document.getElementById("overlay");

const appWindow = document.getElementById("app-window");

const pageDots = document.getElementById("page-dots");

let currentPage = 1;

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
      page === 2 ? "○ ●" : "● ○";

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

  if (e.target.matches("input, textarea, select")) return;

  if (e.key === "ArrowUp" && currentPage === 1) {

    e.preventDefault();

    showPage(2);

  }

  if (e.key === "ArrowDown" && currentPage === 2) {

    e.preventDefault();

    showPage(1);

  }

});

phone.addEventListener("touchstart", e => {

  if (overlay.classList.contains("open")) return;

  const t = e.touches[0];

  touchStartX = t.clientX;

  touchStartY = t.clientY;

  touchMoved = false;

}, { passive: true });

phone.addEventListener("touchmove", e => {

  if (overlay.classList.contains("open")) return;

  const t = e.touches[0];

  const dx = t.clientX - touchStartX;

  const dy = t.clientY - touchStartY;

  if (

    Math.abs(dy) > 30 &&

    Math.abs(dy) > Math.abs(dx)

  ) {

    touchMoved = true;

  }

}, { passive: true });

phone.addEventListener("touchend", e => {

  if (

    overlay.classList.contains("open") ||

    !touchMoved ||

    swipeLocked

  ) return;

  const t = e.changedTouches[0];

  const dx = t.clientX - touchStartX;

  const dy = t.clientY - touchStartY;

  if (

    Math.abs(dy) < 80 ||

    Math.abs(dy) <= Math.abs(dx)

  ) return;

  swipeLocked = true;

  if (dy < 0 && currentPage === 1) {

    showPage(2);

  }

  if (dy > 0 && currentPage === 2) {

    showPage(1);

  }

  setTimeout(() => {

    swipeLocked = false;

  }, 700);

}, { passive: true });

phone.addEventListener("mousedown", e => {

  if (overlay.classList.contains("open")) return;

  mouseStartX = e.clientX;

  mouseStartY = e.clientY;

  mouseDragging = true;

});

phone.addEventListener("mouseup", e => {

  if (!mouseDragging) return;

  mouseDragging = false;

  if (overlay.classList.contains("open")) return;

  const dx = e.clientX - mouseStartX;

  const dy = e.clientY - mouseStartY;

  if (

    Math.abs(dy) < 80 ||

    Math.abs(dy) <= Math.abs(dx)

  ) return;

  if (dy < 0 && currentPage === 1) {

    showPage(2);

  }

  if (dy > 0 && currentPage === 2) {

    showPage(1);

  }

});

// ============================================================

// APP SYSTEM

// ============================================================

function openApp(title, content) {

  appWindow.innerHTML = `

    <div class="app-header">

      <button class="back-button" onclick="closeApp()">‹</button>

      <strong>${escapeHTML(title)}</strong>

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

  overlay.classList.remove("open");

  appWindow.innerHTML = "";

}

// ============================================================

// CUSTOM PEAR KEYBOARD

// ============================================================

let keyboardVisible = false;

let keyboardShift = false;

function addKeyboardSupport() {

  setTimeout(() => {

    const fields = appWindow.querySelectorAll(

      "input[type='text'], input:not([type]), textarea"

    );

    fields.forEach(field => {

      field.addEventListener("click", () => {

        field.focus();

        showPearKeyboard(field);

      });

    });

  }, 50);

}

function showPearKeyboard(input) {

  if (!input) return;

  keyboardVisible = true;

  let keyboard = document.getElementById(

    "pear-keyboard"

  );

  if (!keyboard) {

    keyboard = document.createElement("div");

    keyboard.id = "pear-keyboard";

    keyboard.innerHTML = `

      <div class="pear-keyboard-row">

        ${"QWERTYUIOP".split("").map(k =>

          `<button type="button" onclick="keyboardKey('${k}')">${k}</button>`

        ).join("")}

      </div>

      <div class="pear-keyboard-row">

        ${"ASDFGHJKL".split("").map(k =>

          `<button type="button" onclick="keyboardKey('${k}')">${k}</button>`

        ).join("")}

      </div>

      <div class="pear-keyboard-row">

        <button type="button" onclick="keyboardShiftKey()">⇧</button>

        ${"ZXCVBNM".split("").map(k =>

          `<button type="button" onclick="keyboardKey('${k}')">${k}</button>`

        ).join("")}

        <button type="button" onclick="keyboardBackspace()">⌫</button>

      </div>

      <div class="pear-keyboard-row bottom">

        <button type="button" onclick="keyboardNumber()">123</button>

        <button type="button" onclick="keyboardSpace()">SPACE</button>

        <button type="button" onclick="keyboardEnter()">↵</button>

      </div>

    `;

    overlay.appendChild(keyboard);

  }

  keyboard.style.display = "block";

  setTimeout(() => {

    keyboard.classList.add("keyboard-show");

  }, 10);

}

function hidePearKeyboard() {

  const keyboard =

    document.getElementById("pear-keyboard");

  if (!keyboard) return;

  keyboard.classList.remove("keyboard-show");

  setTimeout(() => {

    keyboard.style.display = "none";

  }, 250);

  keyboardVisible = false;

}

function getFocusedField() {

  const active = document.activeElement;

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

function keyboardKey(key) {

  const field = getFocusedField();

  if (!field) return;

  const character =

    keyboardShift ? key : key.toLowerCase();

  insertText(field, character);

  keyboardShift = false;

}

function insertText(field, text) {

  const start = field.selectionStart;

  const end = field.selectionEnd;

  field.value =

    field.value.substring(0, start) +

    text +

    field.value.substring(end);

  field.selectionStart =

    field.selectionEnd =

    start + text.length;

  field.dispatchEvent(

    new Event("input", { bubbles: true })

  );

}

function keyboardSpace() {

  const field = getFocusedField();

  if (field) insertText(field, " ");

}

function keyboardEnter() {

  const field = getFocusedField();

  if (!field) return;

  if (field.tagName === "TEXTAREA") {

    insertText(field, "\n");

  } else {

    field.blur();

  }

}

function keyboardBackspace() {

  const field = getFocusedField();

  if (!field) return;

  const start = field.selectionStart;

  const end = field.selectionEnd;

  if (start !== end) {

    field.value =

      field.value.substring(0, start) +

      field.value.substring(end);

    field.selectionStart =

      field.selectionEnd = start;

  } else if (start > 0) {

    field.value =

      field.value.substring(0, start - 1) +

      field.value.substring(end);

    field.selectionStart =

      field.selectionEnd = start - 1;

  }

  field.dispatchEvent(

    new Event("input", { bubbles: true })

  );

}

function keyboardShiftKey() {

  keyboardShift = !keyboardShift;

}

function keyboardNumber() {

  const field = getFocusedField();

  if (!field) return;

  insertText(

    field,

    keyboardShift ? "1234567890" : "1234567890"

  );

}

// ============================================================

// MESSAGES

// ============================================================

const messageContacts = {

  Chloe: [

    "Heyyy 👋",

    "What are you doing?",

    "HAHA wait 😭",

    "Okayyy sounds good"

  ],

  Sam: [

    "Yo!",

    "Are you free later?",

    "That's actually crazy 😂",

    "See you soon"

  ],

  Cat: [

    "meow",

    "feed me",

    "MEOWWW",

    "😼"

  ]

};

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

      </p>

    </div>

  `;

}

function routeDemo() {

  alert(

    "🚗 Route calculated!\n\n" +

    "Distance: 8.4 km\n" +

    "Time: 18 minutes"

  );

}

function savedMapPlace() {

  const input =

    document.getElementById("map-search");

  if (!input || !input.value.trim()) {

    alert("Search for a place first.");

    return;

  }

  savedPlaces.push(input.value);

  mapsApp();

}

function locateMe() {

  alert(

    "📍 You are here!\n\n" +

    "Location services connected."

  );

}

// ============================================================

// PHOTOS

// ============================================================

let favoritePhotos = [];

function photosApp() {

  openApp(

    "Photos",

    `

      <div class="card">

        <h2>🖼️ Photos</h2>

        <input

          type="file"

          accept="image/png"

          multiple

          onchange="loadPhotos(event)"

        >

        <button onclick="showFavoritePhotos()">

          ⭐ Favorites

        </button>

        <div id="photo-grid"></div>

      </div>

    `

  );

}

function loadPhotos(event) {

  const grid =

    document.getElementById("photo-grid");

  if (!grid) return;

  grid.innerHTML = "";

  Array.from(event.target.files)

    .filter(file => file.type === "image/png")

    .forEach((file, index) => {

      const url =

        URL.createObjectURL(file);

      grid.innerHTML += `

        <div class="photo-item">

          <img

            src="${url}"

            style="width:100%;border-radius:12px"

          >

          <button onclick="favoritePhoto(${index})">

            ⭐ Favorite

          </button>

        </div>

      `;

    });

}

function favoritePhoto(index) {

  favoritePhotos.push(index);

  alert("Added to favorites ⭐");

}

function showFavoritePhotos() {

  alert(

    favoritePhotos.length +

    " favorite photo(s)"

  );

}

// ============================================================

// WEATHER

// ============================================================

let weatherCities = [

  "Toronto",

  "Vancouver",

  "New York",

  "Los Angeles",

  "London"

];

function weatherApp() {

  openApp(

    "Weather",

    `

      <div class="card">

        <h2>☀️ Weather</h2>

        <select id="weather-city">

          ${weatherCities.map(city =>

            `<option>${city}</option>`

          ).join("")}

        </select>

        <div id="weather-main">

          <h1>22°C</h1>

          <p>Partly Cloudy ☁️</p>

        </div>

        <button onclick="refreshWeather()">

          🔄 Refresh

        </button>

        <h3>Hourly</h3>

        <p>10 AM ☀️ 21°</p>

        <p>12 PM ☀️ 23°</p>

        <p>2 PM 🌤️ 24°</p>

        <p>4 PM 🌤️ 23°</p>

        <h3>7 Day</h3>

        <p>Mon ☀️ 24°</p>

        <p>Tue 🌤️ 23°</p>

        <p>Wed 🌧️ 19°</p>

        <p>Thu ☀️ 25°</p>

      </div>

    `

  );

}

function refreshWeather() {

  const temp =

    Math.floor(Math.random() * 20) + 10;

  const main =

    document.getElementById("weather-main");

  if (main) {

    main.innerHTML = `

      <h1>${temp}°C</h1>

      <p>

        ${

          temp > 20

            ? "Sunny ☀️"

            : "Cool 🌤️"

        }

      </p>

    `;

  }

}

// ============================================================

// NOTES

// ============================================================

let notes = JSON.parse(

  localStorage.getItem("pear-notes") || "[]"

);

function notesApp() {

  renderNotes();

}

function renderNotes() {

  openApp(

    "Notes",

    `

      <div class="card">

        <h2>📝 Notes</h2>

        <button onclick="createNote()">

          ➕ New Note

        </button>

        <input

          id="note-search"

          placeholder="Search notes..."

          oninput="searchNotes()"

        >

        <div id="notes-list">

          ${notes.map((note, index) => `

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

          `).join("")}

        </div>

      </div>

    `

  );

}

function createNote() {

  const title =

    prompt("Note title:");

  if (!title) return;

  notes.unshift({

    title,

    text: "",

    date: new Date().toLocaleString()

  });

  saveNotes();

  editNote(0);

}

function editNote(index) {

  const note = notes[index];

  openApp(

    "Edit Note",

    `

      <div class="card">

        <input

          id="edit-note-title"

          value="${escapeHTML(note.title)}"

        >

        <textarea

          id="edit-note-text"

          style="height:200px"

        >${escapeHTML(note.text)}</textarea>

        <button onclick="saveEditedNote(${index})">

          💾 Save

        </button>

        <button onclick="deleteNote(${index})">

          🗑️ Delete

        </button>

      </div>

    `

  );

}

function saveEditedNote(index) {

  notes[index].title =

    document.getElementById(

      "edit-note-title"

    ).value;

  notes[index].text =

    document.getElementById(

      "edit-note-text"

    ).value;

  notes[index].date =

    new Date().toLocaleString();

  saveNotes();

  notesApp();

}

function deleteNote(index) {

  notes.splice(index, 1);

  saveNotes();

  notesApp();

}

function saveNotes() {

  localStorage.setItem(

    "pear-notes",

    JSON.stringify(notes)

  );

}

function searchNotes() {

  const search =

    document.getElementById(

      "note-search"

    );

  const list =

    document.getElementById(

      "notes-list"

    );

  if (!search || !list) return;

  const query =

    search.value.toLowerCase();

  list.innerHTML =

    notes

      .map((note, index) => ({

        note,

        index

      }))

      .filter(item =>

        (

          item.note.title +

          " " +

          item.note.text

        )

          .toLowerCase()

          .includes(query)

      )

      .map(item => `

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

    `

      <div class="card">

        <h2>⌨️ Pear Keyboard</h2>

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

    `

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

  const typed = input.value;

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

        dictionary[word] || "No translation found"

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

          accept="image/png"

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

  if (!file || file.type !== "image/png") {

    if (file) alert("Please choose a PNG image.");

    return;

  }

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
