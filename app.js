/* =========================================================
   PEAR PHONE OS — APP.JS
   ========================================================= */

const overlay = document.getElementById("overlay");
const appWindow = document.getElementById("app-window");
const phoneContainer = document.getElementById("phone-container");

let currentApp = null;
let activeKeyboardField = null;
let keyboardVisible = false;

/* =========================================================
   BASIC HELPERS
   ========================================================= */

function esc(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function openApp(name) {
  currentApp = name;

  if (!overlay || !appWindow) return;

  overlay.classList.add("open");

  const apps = {
    messages: appMessages,
    camera: appCamera,
    splashface: appSplashFace,
    stocks: appStocks,
    maps: appMaps,
    photos: appPhotos,
    weather: appWeather,
    notes: appNotes,
    peartunes: appPearTunes,
    settings: appSettings,
    clock: appClock,
    videos: appVideos,
    phone: appPhone,
    mail: appMail,
    compass: appCompass,

    lingo: appLingo,
    splash: appSplashFace,
    thumb: appThumbsUp,
    danwarp: appDanWarp,
    image: appImage,
    chrono: appChrono,
    zaplook: appZapLook,
    monkey: appMonkey,
    remark: appRemark
  };

  if (apps[name]) {
    apps[name]();
  } else {
    appWindow.innerHTML = `
      <div class="app-page">
        <h2>${esc(name)}</h2>
        <p>This Pear Phone app isn't configured yet.</p>
      </div>
    `;
  }

  setupKeyboardFields();
}

function closeApp() {
  currentApp = null;
  hideKeyboard();

  if (overlay) {
    overlay.classList.remove("open");
  }

  if (appWindow) {
    appWindow.innerHTML = "";
  }
}

function appShell(title, content, extra = "") {
  appWindow.innerHTML = `
    <div class="app-page">
      <div class="app-header">
        <button class="back-btn" onclick="closeApp()">‹</button>
        <strong>${esc(title)}</strong>
        ${extra}
      </div>

      <div class="app-content">
        ${content}
      </div>
    </div>
  `;

  setupKeyboardFields();
}

function button(text, action, cls = "") {
  return `<button class="pear-btn ${cls}" onclick="${action}">${text}</button>`;
}

function toast(message) {
  const old = document.getElementById("pear-toast");
  if (old) old.remove();

  const el = document.createElement("div");
  el.id = "pear-toast";
  el.textContent = message;

  Object.assign(el.style, {
    position: "absolute",
    left: "50%",
    bottom: "12px",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,.82)",
    color: "white",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    zIndex: "5000",
    whiteSpace: "nowrap"
  });

  overlay.appendChild(el);

  setTimeout(() => el.remove(), 1600);
}

/* =========================================================
   KEYBOARD
   ========================================================= */

function setupKeyboardFields() {
  document.querySelectorAll(
    '#app-window input:not([type="file"]):not([type="checkbox"]):not([type="range"]):not([type="button"]), #app-window textarea'
  ).forEach(field => {
    field.addEventListener("focus", () => {
      activeKeyboardField = field;
      showKeyboard();
    });

    field.addEventListener("click", () => {
      activeKeyboardField = field;
      showKeyboard();
    });
  });
}

function createKeyboard() {
  if (document.getElementById("pear-keyboard")) return;

  const keyboard = document.createElement("div");
  keyboard.id = "pear-keyboard";

  keyboard.innerHTML = `
    <div class="pear-keyboard-row">
      ${["Q","W","E","R","T","Y","U","I","O","P"]
        .map(k => `<button type="button" data-key="${k}">${k}</button>`).join("")}
    </div>

    <div class="pear-keyboard-row">
      ${["A","S","D","F","G","H","J","K","L"]
        .map(k => `<button type="button" data-key="${k}">${k}</button>`).join("")}
    </div>

    <div class="pear-keyboard-row">
      ${["Z","X","C","V","B","N","M"]
        .map(k => `<button type="button" data-key="${k}">${k}</button>`).join("")}
    </div>

    <div class="pear-keyboard-row bottom">
      <button type="button" data-action="backspace">⌫</button>
      <button type="button" data-action="space">SPACE</button>
      <button type="button" data-action="enter">↵</button>
    </div>
  `;

  overlay.appendChild(keyboard);

  keyboard.addEventListener("pointerdown", e => {
    e.preventDefault();

    const key = e.target.dataset.key;
    const action = e.target.dataset.action;

    if (!activeKeyboardField) return;

    if (key) {
      insertKeyboardText(key);
    } else if (action === "space") {
      insertKeyboardText(" ");
    } else if (action === "backspace") {
      deleteKeyboardCharacter();
    } else if (action === "enter") {
      insertKeyboardText("\n");
    }
  });
}

function showKeyboard() {
  createKeyboard();

  const keyboard = document.getElementById("pear-keyboard");
  if (!keyboard) return;

  keyboard.style.display = "block";

  requestAnimationFrame(() => {
    keyboard.classList.add("keyboard-show");
  });

  keyboardVisible = true;

  if (overlay) {
    overlay.classList.add("keyboard-open");
  }
}

function hideKeyboard() {
  const keyboard = document.getElementById("pear-keyboard");

  if (keyboard) {
    keyboard.classList.remove("keyboard-show");

    setTimeout(() => {
      if (!keyboardVisible) {
        keyboard.style.display = "none";
      }
    }, 280);
  }

  keyboardVisible = false;

  if (overlay) {
    overlay.classList.remove("keyboard-open");
  }

  activeKeyboardField = null;
}

function insertKeyboardText(text) {
  if (!activeKeyboardField) return;

  const field = activeKeyboardField;
  const start = field.selectionStart ?? field.value.length;
  const end = field.selectionEnd ?? field.value.length;

  field.value =
    field.value.substring(0, start) +
    text +
    field.value.substring(end);

  const newPos = start + text.length;

  field.focus();
  field.setSelectionRange(newPos, newPos);

  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function deleteKeyboardCharacter() {
  if (!activeKeyboardField) return;

  const field = activeKeyboardField;
  const start = field.selectionStart ?? field.value.length;
  const end = field.selectionEnd ?? field.value.length;

  if (start === 0 && end === 0) return;

  if (start !== end) {
    field.value =
      field.value.substring(0, start) +
      field.value.substring(end);

    field.setSelectionRange(start, start);
  } else {
    field.value =
      field.value.substring(0, start - 1) +
      field.value.substring(end);

    field.setSelectionRange(start - 1, start - 1);
  }

  field.dispatchEvent(new Event("input", { bubbles: true }));
}

document.addEventListener("pointerdown", e => {
  if (!keyboardVisible) return;

  const keyboard = document.getElementById("pear-keyboard");

  if (
    keyboard &&
    !keyboard.contains(e.target) &&
    !e.target.matches("input, textarea")
  ) {
    hideKeyboard();
  }
});

/* =========================================================
   MESSAGES
   ========================================================= */

let messages = [
  {
    name: "Dylan",
    text: "Yo! You using the Pear Phone?",
    time: "9:41 PM"
  },
  {
    name: "Alex",
    text: "Check out this new app 😂",
    time: "8:18 PM"
  },
  {
    name: "Pear Bot",
    text: "Welcome to Pear Phone OS!",
    time: "7:02 PM"
  }
];

function appMessages() {
  appShell(
    "Messages",
    `
      <div class="message-list">
        ${messages.map((m, i) => `
          <div class="message-card" onclick="openMessage(${i})">
            <div>
              <strong>${esc(m.name)}</strong>
              <p>${esc(m.text)}</p>
            </div>
            <small>${esc(m.time)}</small>
          </div>
        `).join("")}
      </div>

      <input id="message-input" placeholder="New message...">

      <button class="pear-btn wide" onclick="sendMessage()">
        Send
      </button>
    `
  );
}

function openMessage(index) {
  const m = messages[index];

  appShell(
    m.name,
    `
      <div class="chat">
        ${messages.slice(0, index + 1).map(x => `
          <div class="bubble">${esc(x.text)}</div>
        `).join("")}
      </div>

      <input id="reply-input" placeholder="Reply...">

      <button class="pear-btn wide" onclick="sendReply(${index})">
        Send Reply
      </button>
    `
  );
}

function sendMessage() {
  const input = document.getElementById("message-input");

  if (!input || !input.value.trim()) {
    toast("Type something first");
    return;
  }

  messages.unshift({
    name: "You",
    text: input.value,
    time: new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    })
  });

  toast("Message sent!");
  appMessages();
}

function sendReply(index) {
  const input = document.getElementById("reply-input");

  if (!input || !input.value.trim()) {
    toast("Type a reply first");
    return;
  }

  messages.splice(index + 1, 0, {
    name: "You",
    text: input.value,
    time: "Now"
  });

  toast("Reply sent!");
  appMessages();
}

/* =========================================================
   CAMERA
   ========================================================= */

let cameraCount = 0;

function appCamera() {
  appShell(
    "Camera",
    `
      <div class="camera-view">
        <div class="camera-lens">●</div>
        <div class="camera-cross">+</div>
        <span>PEAR CAMERA</span>
      </div>

      <div class="camera-controls">
        <button class="circle-btn" onclick="toggleFlash()">⚡</button>
        <button class="shutter" onclick="takePicture()">●</button>
        <button class="circle-btn" onclick="cameraFlip()">↻</button>
      </div>

      <p id="camera-status">Ready</p>
    `
  );
}

function takePicture() {
  cameraCount++;

  const status = document.getElementById("camera-status");

  if (status) {
    status.textContent = `Photo ${cameraCount} saved to Photos`;
  }

  toast("📸 Photo saved!");

  localStorage.setItem(
    "pear-camera-count",
    cameraCount
  );
}

function toggleFlash() {
  toast("Flash toggled ⚡");
}

function cameraFlip() {
  toast("Camera flipped ↻");
}

/* =========================================================
   SPLASHFACE
   ========================================================= */

let splashLikes = [23, 81, 14];

function appSplashFace() {
  appShell(
    "SplashFace",
    `
      <div class="social-post">
        <div class="social-avatar">🙂</div>
        <strong>pear_user</strong>
        <div class="fake-photo">🌴</div>
        <button class="like-btn" onclick="likeSplash(0)">
          ❤️ <span id="like-0">${splashLikes[0]}</span>
        </button>
        <p>Another day in paradise.</p>
      </div>

      <div class="social-post">
        <div class="social-avatar">🍐</div>
        <strong>PearOfficial</strong>
        <div class="fake-photo">🍐</div>
        <button class="like-btn" onclick="likeSplash(1)">
          ❤️ <span id="like-1">${splashLikes[1]}</span>
        </button>
        <p>Think different. Think Pear.</p>
      </div>

      <input id="splash-post" placeholder="Write a post...">

      <button class="pear-btn wide" onclick="makeSplashPost()">
        Post
      </button>
    `
  );
}

function likeSplash(index) {
  splashLikes[index]++;
  const el = document.getElementById(`like-${index}`);

  if (el) el.textContent = splashLikes[index];

  toast("❤️ Liked!");
}

function makeSplashPost() {
  const input = document.getElementById("splash-post");

  if (!input || !input.value.trim()) {
    toast("Write something first");
    return;
  }

  toast("Posted to SplashFace!");
  input.value = "";
}

/* =========================================================
   STOCKS
   ========================================================= */

let stockPrice = 142.31;
let balance = 10000;
let shares = 0;

function appStocks() {
  const value = shares * stockPrice;

  appShell(
    "Stocks",
    `
      <div class="stock-main">
        <h1>$${stockPrice.toFixed(2)}</h1>
        <p class="up">▲ 2.41%</p>
      </div>

      <div class="stock-stats">
        <div>
          <small>Cash</small>
          <strong>$${balance.toFixed(2)}</strong>
        </div>
        <div>
          <small>Shares</small>
          <strong>${shares}</strong>
        </div>
        <div>
          <small>Position</small>
          <strong>$${value.toFixed(2)}</strong>
        </div>
      </div>

      <button class="pear-btn" onclick="buyStock()">Buy</button>
      <button class="pear-btn" onclick="sellStock()">Sell</button>
      <button class="pear-btn" onclick="refreshStock()">Refresh</button>

      <div id="stock-chart">
        ${Array.from({length: 12}, () =>
          `<i style="height:${20 + Math.random()*65}%"></i>`
        ).join("")}
      </div>
    `
  );
}

function buyStock() {
  if (balance >= stockPrice) {
    balance -= stockPrice;
    shares++;
    toast("Bought 1 share 📈");
    appStocks();
  } else {
    toast("Not enough cash");
  }
}

function sellStock() {
  if (shares > 0) {
    shares--;
    balance += stockPrice;
    toast("Sold 1 share");
    appStocks();
  } else {
    toast("You have no shares");
  }
}

function refreshStock() {
  stockPrice += (Math.random() - 0.45) * 8;

  if (stockPrice < 1) stockPrice = 1;

  appStocks();
}

/* =========================================================
   MAPS
   ========================================================= */

function appMaps() {
  appShell(
    "Pear Maps",
    `
      <div class="map-screen">
        <div class="map-road"></div>
        <div class="map-road road2"></div>
        <div class="map-pin">📍</div>
      </div>

      <button class="pear-btn wide" onclick="mapDestination('Campus')">
        🏫 Campus
      </button>

      <button class="pear-btn wide" onclick="mapDestination('Home')">
        🏠 Home
      </button>

      <button class="pear-btn wide" onclick="mapDestination('Mall')">
        🛍️ Mall
      </button>

      <p id="map-result">Choose a destination.</p>
    `
  );
}

function mapDestination(place) {
  const distances = {
    Campus: "1.8 km",
    Home: "4.2 km",
    Mall: "6.7 km"
  };

  const result = document.getElementById("map-result");

  if (result) {
    result.innerHTML = `
      Route to <strong>${place}</strong><br>
      ${distances[place]} away<br>
      ETA: ${Math.floor(5 + Math.random() * 15)} min
    `;
  }
}

/* =========================================================
   PHOTOS
   ========================================================= */

let photos = ["🌴", "🍐", "🌅"];

function appPhotos() {
  appShell(
    "Photos",
    `
      <div class="photo-grid">
        ${photos.map((p, i) => `
          <div class="photo-item" onclick="viewPhoto(${i})">
            ${p}
          </div>
        `).join("")}
      </div>

      <button class="pear-btn" onclick="addPhoto()">
        ＋ Add
      </button>

      <button class="pear-btn" onclick="deletePhoto()">
        Delete
      </button>
    `
  );
}

function viewPhoto(index) {
  toast(`Photo ${index + 1}`);
}

function addPhoto() {
  const newPhotos = ["🌊", "🏔️", "🌃", "🌸", "🚀", "🎆"];

  photos.push(
    newPhotos[Math.floor(Math.random() * newPhotos.length)]
  );

  appPhotos();
}

function deletePhoto() {
  if (photos.length > 0) {
    photos.pop();
    appPhotos();
  }
}

/* =========================================================
   WEATHER
   ========================================================= */

function appWeather() {
  const temps = [18, 21, 24, 26, 19];

  appShell(
    "Weather",
    `
      <div class="weather-big">
        <div class="weather-icon">☀️</div>
        <h1 id="weather-temp">24°</h1>
        <p>Mostly Sunny</p>
      </div>

      <div class="forecast">
        ${["Mon","Tue","Wed","Thu","Fri"].map((day, i) => `
          <div>
            <strong>${day}</strong>
            <span>${temps[i]}°</span>
            <small>☀️</small>
          </div>
        `).join("")}
      </div>

      <button class="pear-btn wide" onclick="refreshWeather()">
        Refresh Weather
      </button>
    `
  );
}

function refreshWeather() {
  const temp = Math.floor(15 + Math.random() * 15);

  const el = document.getElementById("weather-temp");

  if (el) {
    el.textContent = `${temp}°`;
  }

  toast("Weather updated");
}

/* =========================================================
   NOTES
   ========================================================= */

let notes = JSON.parse(
  localStorage.getItem("pear-notes") || "[]"
);

function appNotes() {
  appShell(
    "Notes",
    `
      <input id="note-title" placeholder="Title">

      <textarea
        id="note-body"
        rows="6"
        placeholder="Start typing..."
      ></textarea>

      <button class="pear-btn wide" onclick="saveNote()">
        Save Note
      </button>

      <div class="saved-notes">
        ${notes.map((n, i) => `
          <div class="note-card" onclick="openNote(${i})">
            <strong>${esc(n.title)}</strong>
            <p>${esc(n.body.substring(0, 45))}</p>
          </div>
        `).join("")}
      </div>
    `
  );
}

function saveNote() {
  const title = document.getElementById("note-title");
  const body = document.getElementById("note-body");

  if (!body.value.trim()) {
    toast("Write something first");
    return;
  }

  notes.unshift({
    title: title.value || "Untitled",
    body: body.value
  });

  localStorage.setItem("pear-notes", JSON.stringify(notes));

  toast("Note saved!");
  appNotes();
}

function openNote(index) {
  const n = notes[index];

  appShell(
    n.title,
    `
      <textarea id="edit-note" rows="9">${esc(n.body)}</textarea>

      <button class="pear-btn wide" onclick="updateNote(${index})">
        Save Changes
      </button>

      <button class="pear-btn danger wide" onclick="deleteNote(${index})">
        Delete
      </button>
    `
  );
}

function updateNote(index) {
  const input = document.getElementById("edit-note");

  notes[index].body = input.value;

  localStorage.setItem("pear-notes", JSON.stringify(notes));

  toast("Updated!");
  appNotes();
}

function deleteNote(index) {
  notes.splice(index, 1);

  localStorage.setItem("pear-notes", JSON.stringify(notes));

  toast("Deleted");
  appNotes();
}

/* =========================================================
   PEARTUNES
   ========================================================= */

let musicPlaying = false;
let currentSong = 0;

const songs = [
  ["Pearwave", "The Pears"],
  ["Electric Summer", "P-Club"],
  ["Midnight Drive", "Pear Radio"],
  ["Loading...", "Pear OS"]
];

function appPearTunes() {
  appShell(
    "PearTunes",
    `
      <div class="album-art">🍐</div>

      <h2 id="song-title">${songs[currentSong][0]}</h2>
      <p>${songs[currentSong][1]}</p>

      <div class="music-progress">
        <div id="music-bar"></div>
      </div>

      <div class="music-controls">
        <button class="pear-btn" onclick="previousSong()">◀</button>
        <button class="pear-btn" onclick="toggleMusic()">
          ${musicPlaying ? "❚❚" : "▶"}
        </button>
        <button class="pear-btn" onclick="nextSong()">▶</button>
      </div>

      <div class="song-list">
        ${songs.map((s, i) => `
          <div class="song" onclick="selectSong(${i})">
            ${i + 1}. ${esc(s[0])}
          </div>
        `).join("")}
      </div>
    `
  );
}

function toggleMusic() {
  musicPlaying = !musicPlaying;
  appPearTunes();
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  appPearTunes();
}

function previousSong() {
  currentSong =
    (currentSong - 1 + songs.length) % songs.length;

  appPearTunes();
}

function selectSong(index) {
  currentSong = index;
  musicPlaying = true;
  appPearTunes();
}

/* =========================================================
   SETTINGS
   ========================================================= */

function appSettings() {
  const dark =
    localStorage.getItem("pear-dark") === "true";

  appShell(
    "Settings",
    `
      <div class="setting-row">
        <span>Dark Mode</span>
        <input
          type="checkbox"
          ${dark ? "checked" : ""}
          onchange="toggleDark(this.checked)"
        >
      </div>

      <div class="setting-row">
        <span>Phone Vibration</span>
        <input type="checkbox" checked>
      </div>

      <div class="setting-row">
        <span>Sounds</span>
        <input type="checkbox" checked>
      </div>

      <button class="pear-btn wide" onclick="testSound()">
        Test Sound 🔊
      </button>

      <button class="pear-btn danger wide" onclick="resetPear()">
        Reset Pear Phone
      </button>
    `
  );
}

function toggleDark(value) {
  localStorage.setItem("pear-dark", value);

  appWindow.classList.toggle("dark-app", value);

  toast(value ? "Dark mode on" : "Dark mode off");
}

function testSound() {
  toast("🔊 PEAR!");
}

function resetPear() {
  localStorage.removeItem("pear-notes");
  localStorage.removeItem("pear-dark");

  toast("Pear Phone reset");
}

/* =========================================================
   CLOCK
   ========================================================= */

let stopwatchStart = null;
let stopwatchTimer = null;
let stopwatchElapsed = 0;

function appClock() {
  appShell(
    "Clock",
    `
      <div class="clock-big" id="live-clock">
        --:--
      </div>

      <p id="live-date"></p>

      <hr>

      <h3>Stopwatch</h3>

      <div class="stopwatch" id="stopwatch">
        00:00.00
      </div>

      <button class="pear-btn" onclick="startStopwatch()">
        Start
      </button>

      <button class="pear-btn" onclick="stopStopwatch()">
        Stop
      </button>

      <button class="pear-btn" onclick="resetStopwatch()">
        Reset
      </button>
    `
  );

  updateClock();
}

function updateClock() {
  const clock = document.getElementById("live-clock");
  const date = document.getElementById("live-date");

  if (!clock) return;

  const now = new Date();

  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  date.textContent = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  setTimeout(updateClock, 1000);
}

function startStopwatch() {
  if (stopwatchStart) return;

  stopwatchStart = Date.now() - stopwatchElapsed;

  stopwatchTimer = setInterval(() => {
    stopwatchElapsed = Date.now() - stopwatchStart;

    const el = document.getElementById("stopwatch");

    if (el) {
      const seconds =
        Math.floor(stopwatchElapsed / 1000);

      const minutes =
        Math.floor(seconds / 60);

      const hundredths =
        Math.floor((stopwatchElapsed % 1000) / 10);

      el.textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds % 60).padStart(2, "0")}.` +
        `${String(hundredths).padStart(2, "0")}`;
    }
  }, 10);
}

function stopStopwatch() {
  clearInterval(stopwatchTimer);
  stopwatchTimer = null;
  stopwatchStart = null;
}

function resetStopwatch() {
  stopStopwatch();
  stopwatchElapsed = 0;

  const el = document.getElementById("stopwatch");

  if (el) el.textContent = "00:00.00";
}

/* =========================================================
   VIDEOS
   ========================================================= */

function appVideos() {
  appShell(
    "Pear Videos",
    `
      <div class="video-player">
        <div id="video-screen">▶</div>
      </div>

      <button class="pear-btn wide" onclick="playFakeVideo()">
        Play Video
      </button>

      <button class="pear-btn wide" onclick="videoEffect()">
        Random Effect
      </button>

      <p id="video-status">Choose a video.</p>
    `
  );
}

function playFakeVideo() {
  const screen = document.getElementById("video-screen");
  const status = document.getElementById("video-status");

  if (screen) {
    screen.textContent = "🎬";
    screen.style.transform =
      `rotate(${Math.random() * 8 - 4}deg)`;
  }

  if (status) {
    status.textContent = "Now playing: Pear Adventures";
  }
}

function videoEffect() {
  const screen = document.getElementById("video-screen");

  if (!screen) return;

  screen.textContent =
    ["🍐","😂","🌈","💥","🚀"][Math.floor(Math.random()*5)];

  toast("Effect applied!");
}

/* =========================================================
   PHONE
   ========================================================= */

let phoneNumber = "";

function appPhone() {
  phoneNumber = "";

  appShell(
    "Phone",
    `
      <div class="dial-number" id="dial-number"></div>

      <div class="dialer">
        ${["1","2","3","4","5","6","7","8","9","*","0","#"]
          .map(n => `
            <button onclick="dial('${n}')">${n}</button>
          `).join("")}
      </div>

      <button class="call-btn" onclick="makeCall()">
        📞 Call
      </button>

      <button class="pear-btn wide" onclick="deleteDial()">
        Delete
      </button>
    `
  );
}

function dial(number) {
  phoneNumber += number;

  const el = document.getElementById("dial-number");

  if (el) el.textContent = phoneNumber;
}

function deleteDial() {
  phoneNumber = phoneNumber.slice(0, -1);

  const el = document.getElementById("dial-number");

  if (el) el.textContent = phoneNumber;
}

function makeCall() {
  if (!phoneNumber) {
    toast("Enter a number");
    return;
  }

  toast(`Calling ${phoneNumber}...`);
}

/* =========================================================
   MAIL
   ========================================================= */

let mailMessages = [
  {
    from: "Pear Team",
    subject: "Welcome!",
    body: "Welcome to your new Pear Phone."
  },
  {
    from: "Pear News",
    subject: "Breaking Pear News",
    body: "Everything is working perfectly."
  }
];

function appMail() {
  appShell(
    "Mail",
    `
      ${mailMessages.map((m, i) => `
        <div class="mail-card" onclick="readMail(${i})">
          <strong>${esc(m.from)}</strong>
          <b>${esc(m.subject)}</b>
          <p>${esc(m.body.substring(0, 35))}...</p>
        </div>
      `).join("")}

      <button class="pear-btn wide" onclick="composeMail()">
        ✉ Compose
      </button>
    `
  );
}

function readMail(index) {
  const m = mailMessages[index];

  appShell(
    m.subject,
    `
      <p><strong>From:</strong> ${esc(m.from)}</p>
      <hr>
      <p>${esc(m.body)}</p>
    `
  );
}

function composeMail() {
  appShell(
    "New Mail",
    `
      <input id="mail-to" placeholder="To">

      <input id="mail-subject" placeholder="Subject">

      <textarea id="mail-body" rows="6"
        placeholder="Message"></textarea>

      <button class="pear-btn wide" onclick="sendMail()">
        Send
      </button>
    `
  );
}

function sendMail() {
  const to = document.getElementById("mail-to");
  const subject = document.getElementById("mail-subject");
  const body = document.getElementById("mail-body");

  if (!to.value || !body.value) {
    toast("Fill in the message");
    return;
  }

  mailMessages.unshift({
    from: "You → " + to.value,
    subject: subject.value || "(No subject)",
    body: body.value
  });

  toast("Email sent!");
  appMail();
}

/* =========================================================
   COMPASS
   ========================================================= */

function appCompass() {
  appShell(
    "Compass",
    `
      <div class="compass">
        <div class="compass-ring">
          <span class="north">N</span>
          <span class="east">E</span>
          <span class="south">S</span>
          <span class="west">W</span>
          <div class="needle"></div>
        </div>
      </div>

      <h2 id="heading">0°</h2>

      <button class="pear-btn wide" onclick="randomCompass()">
        Calibrate
      </button>
    `
  );
}

function randomCompass() {
  const heading =
    Math.floor(Math.random() * 360);

  const el = document.getElementById("heading");

  if (el) {
    el.textContent = `${heading}°`;
  }

  toast("Compass calibrated");
}

/* =========================================================
   LINGO
   ========================================================= */

const lingoWords = [
  "PEAR",
  "APPLE",
  "PHONE",
  "MUSIC",
  "RADIO",
  "CLOUD"
];

let lingoAnswer = "";

function appLingo() {
  lingoAnswer =
    lingoWords[Math.floor(Math.random() * lingoWords.length)];

  appShell(
    "Lingo",
    `
      <h2>Guess the word</h2>
      <p>Hint: It's related to Pear Phone.</p>

      <input id="lingo-input"
        maxlength="${lingoAnswer.length}"
        placeholder="${"_".repeat(lingoAnswer.length)}">

      <button class="pear-btn wide" onclick="checkLingo()">
        Guess
      </button>

      <p id="lingo-result"></p>
    `
  );
}

function checkLingo() {
  const input =
    document.getElementById("lingo-input");

  const result =
    document.getElementById("lingo-result");

  if (!input) return;

  if (
    input.value.trim().toUpperCase() ===
    lingoAnswer
  ) {
    result.textContent =
      "🎉 Correct! You got it!";
  } else {
    result.textContent =
      `❌ Nope! Try again.`;
  }
}

/* =========================================================
   THUMBS UP
   ========================================================= */

let thumbScore = 0;
let thumbTimer = null;

function appThumbsUp() {
  thumbScore = 0;

  appShell(
    "Thumbs Up",
    `
      <h2>Tap as fast as possible!</h2>

      <div class="thumb-score">
        Score: <span id="thumb-score">0</span>
      </div>

      <button
        class="giant-thumb"
        onclick="thumbTap()"
      >
        👍
      </button>

      <p id="thumb-status">
        You have 10 seconds.
      </p>
    `
  );

  let time = 10;

  thumbTimer = setInterval(() => {
    time--;

    const status =
      document.getElementById("thumb-status");

    if (status) {
      status.textContent =
        `${time} seconds left`;
    }

    if (time <= 0) {
      clearInterval(thumbTimer);

      if (status) {
        status.textContent =
          `Finished! Score: ${thumbScore}`;
      }
    }
  }, 1000);
}

function thumbTap() {
  thumbScore++;

  const score =
    document.getElementById("thumb-score");

  if (score) {
    score.textContent = thumbScore;
  }
}

/* =========================================================
   DANWARP
   ========================================================= */

function appDanWarp() {
  appShell(
    "DanWarp",
    `
      <div id="warp-box" class="warp-box">
        DANWARP
      </div>

      <button class="pear-btn wide" onclick="warpIt()">
        WARP!
      </button>

      <button class="pear-btn wide" onclick="warpReset()">
        Reset
      </button>
    `
  );
}

function warpIt() {
  const box = document.getElementById("warp-box");

  if (!box) return;

  box.style.transform =
    `rotate(${Math.random()*360}deg)
     scale(${0.6 + Math.random() * 1.4})
     skew(${Math.random()*30-15}deg)`;

  box.style.borderRadius =
    `${Math.random()*50}%`;

  toast("WARP ACTIVATED!");
}

function warpReset() {
  const box = document.getElementById("warp-box");

  if (!box) return;

  box.style.transform = "";
  box.style.borderRadius = "";
}

/* =========================================================
   IMAGE
   ========================================================= */

function appImage() {
  appShell(
    "Image Lab",
    `
      <div id="image-canvas" class="image-canvas">
        🖼️
      </div>

      <button class="pear-btn" onclick="imageFilter('spin')">
        Spin
      </button>

      <button class="pear-btn" onclick="imageFilter('zoom')">
        Zoom
      </button>

      <button class="pear-btn" onclick="imageFilter('shake')">
        Shake
      </button>

      <button class="pear-btn" onclick="imageFilter('rainbow')">
        Rainbow
      </button>

      <input
        type="file"
        accept="image/*"
        onchange="loadImage(event)"
      >
    `
  );
}

function imageFilter(type) {
  const image =
    document.getElementById("image-canvas");

  if (!image) return;

  if (type === "spin") {
    image.style.transform =
      "rotate(360deg)";
  }

  if (type === "zoom") {
    image.style.transform =
      "scale(1.3)";
  }

  if (type === "shake") {
    image.animate(
      [
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(0)" }
      ],
      { duration: 400 }
    );
  }

  if (type === "rainbow") {
    image.style.filter =
      "hue-rotate(120deg)";
  }
}

function loadImage(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = e => {
    const image =
      document.getElementById("image-canvas");

    image.innerHTML =
      `<img src="${e.target.result}">`;
  };

  reader.readAsDataURL(file);
}

/* =========================================================
   CHRONO
   ========================================================= */

let chronoSeconds = 30;
let chronoTimer = null;

function appChrono() {
  appShell(
    "Chrono",
    `
      <div class="chrono-time" id="chrono-time">
        00:30
      </div>

      <button class="pear-btn" onclick="startChrono()">
        Start
      </button>

      <button class="pear-btn" onclick="stopChrono()">
        Stop
      </button>

      <button class="pear-btn" onclick="resetChrono()">
        Reset
      </button>
    `
  );
}

function startChrono() {
  if (chronoTimer) return;

  chronoTimer = setInterval(() => {
    chronoSeconds--;

    updateChrono();

    if (chronoSeconds <= 0) {
      stopChrono();
      toast("⏰ TIME!");
    }
  }, 1000);
}

function stopChrono() {
  clearInterval(chronoTimer);
  chronoTimer = null;
}

function resetChrono() {
  stopChrono();

  chronoSeconds = 30;

  updateChrono();
}

function updateChrono() {
  const el =
    document.getElementById("chrono-time");

  if (!el) return;

  const minutes =
    Math.floor(chronoSeconds / 60);

  const seconds =
    chronoSeconds % 60;

  el.textContent =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;
}

/* =========================================================
   ZAPLOOK
   ========================================================= */

function appZapLook() {
  appShell(
    "ZapLook",
    `
      <input
        id="zap-search"
        placeholder="Search Pear..."
      >

      <button class="pear-btn wide"
        onclick="zapSearch()">
        🔍 Search
      </button>

      <div id="zap-results"></div>
    `
  );
}

function zapSearch() {
  const input =
    document.getElementById("zap-search");

  const results =
    document.getElementById("zap-results");

  const q = input.value.toLowerCase();

  if (!q) {
    results.innerHTML =
      "<p>Type something to search.</p>";
    return;
  }

  const facts = [
    "Pear Phone OS was built for maximum fun.",
    "The Pear logo is definitely not an apple.",
    "PearTunes has four songs.",
    "DanWarp should probably be used responsibly.",
    "The Pear Phone has two home pages."
  ];

  const matches =
    facts.filter(x =>
      x.toLowerCase().includes(q)
    );

  results.innerHTML =
    matches.length
      ? matches.map(x => `<p>🔎 ${esc(x)}</p>`).join("")
      : `<p>No results for "${esc(q)}".</p>`;
}

/* =========================================================
   MONKEY GAME
   ========================================================= */

let monkeyScore = 0;

function appMonkey() {
  monkeyScore = 0;

  appShell(
    "Monkey",
    `
      <h2>Catch the monkey!</h2>

      <p>
        Score:
        <strong id="monkey-score">0</strong>
      </p>

      <div
        id="monkey-arena"
        class="monkey-arena"
        onclick="catchMonkey(event)"
      >
        🐒
      </div>

      <button class="pear-btn wide"
        onclick="moveMonkey()">
        Move Monkey
      </button>
    `
  );

  moveMonkey();
}

function moveMonkey() {
  const monkey =
    document.querySelector("#monkey-arena");

  if (!monkey) return;

  monkey.style.textAlign =
    ["left","center","right"]
      [Math.floor(Math.random()*3)];

  monkey.style.fontSize =
    `${30 + Math.random()*25}px`;
}

function catchMonkey() {
  monkeyScore++;

  const score =
    document.getElementById("monkey-score");

  if (score) {
    score.textContent = monkeyScore;
  }

  moveMonkey();
}

/* =========================================================
   REMARK
   ========================================================= */

let remarks = [];

function appRemark() {
  appShell(
    "Remark",
    `
      <textarea
        id="remark-input"
        rows="7"
        placeholder="Write something..."
      ></textarea>

      <button class="pear-btn wide"
        onclick="saveRemark()">
        Save Remark
      </button>

      <div id="remark-list">
        ${remarks.map(r => `
          <div class="remark-card">
            ${esc(r)}
          </div>
        `).join("")}
      </div>
    `
  );
}

function saveRemark() {
  const input =
    document.getElementById("remark-input");

  if (!input || !input.value.trim()) {
    toast("Write something first");
    return;
  }

  remarks.unshift(input.value);

  toast("Remark saved!");
  appRemark();
}

/* =========================================================
   PAGE 2 SETTINGS / OTHER ROUTES
   ========================================================= */

function appSplash() {
  appSplashFace();
}

/* =========================================================
   HOTSPOT ROUTING
   IMPORTANT:
   ONE ID = ONE APP
   ========================================================= */

const appRoutes = {

  /* PAGE 1 */
  messages: "messages",
  camera: "camera",
  splashface: "splashface",
  stocks: "stocks",
  maps: "maps",
  photos: "photos",
  weather: "weather",
  notes: "notes",
  peartunes: "peartunes",
  settings: "settings",
  clock: "clock",
  videos: "videos",
  phone: "phone",
  mail: "mail",
  compass: "compass",

  /* PAGE 2 */
  "p2-lingo": "lingo",
  "p2-splash": "splashface",
  "p2-thumb": "thumb",
  "p2-danwarp": "danwarp",
  "p2-image": "image",
  "p2-chrono": "chrono",
  "p2-zaplook": "zaplook",
  "p2-weather": "weather",
  "p2-music": "peartunes",
  "p2-monkey": "monkey",
  "p2-remark": "remark",
  "p2-settings": "settings",
  "p2-phone": "phone",
  "p2-mail": "mail",
  "p2-compass": "compass",
  "p2-music2": "peartunes"
};

function setupAppButtons() {
  Object.entries(appRoutes).forEach(([id, app]) => {
    const element = document.getElementById(id);

    if (!element) return;

    /* Remove old inline-style event behavior */
    element.onclick = null;

    element.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      openApp(app);
    });

    element.addEventListener("pointerdown", e => {
      e.stopPropagation();
    });
  });
}

/* =========================================================
   HOME BUTTON
   ========================================================= */

function setupHomeButton() {
  const home = document.getElementById("home");

  if (!home) return;

  home.onclick = e => {
    e.preventDefault();
    e.stopPropagation();

    closeApp();
  };
}

/* =========================================================
   PAGE SWITCHING
   UP = PAGE 2
   DOWN = PAGE 1
   ========================================================= */

let currentPage = 1;
let pointerStartX = 0;
let pointerStartY = 0;

function setPage(page) {
  if (page !== 1 && page !== 2) return;

  currentPage = page;

  if (!phoneContainer) return;

  phoneContainer.classList.toggle(
    "page-two",
    page === 2
  );

  const dots =
    document.getElementById("page-dots");

  if (dots) {
    dots.textContent =
      page === 1 ? "● ○" : "○ ●";
  }
}

function changePage(direction) {
  if (overlay && overlay.classList.contains("open")) {
    return;
  }

  if (direction === "up") {
    setPage(2);
  }

  if (direction === "down") {
    setPage(1);
  }
}

if (phoneContainer) {

  phoneContainer.addEventListener(
    "pointerdown",
    e => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
    }
  );

  phoneContainer.addEventListener(
    "pointerup",
    e => {

      if (
        overlay &&
        overlay.classList.contains("open")
      ) {
        return;
      }

      const dx = e.clientX - pointerStartX;
      const dy = e.clientY - pointerStartY;

      if (Math.abs(dy) < 50) return;

      if (Math.abs(dy) > Math.abs(dx)) {

        if (dy < 0) {
          changePage("up");
        } else {
          changePage("down");
        }
      }
    }
  );
}

document.addEventListener("keydown", e => {

  if (e.key === "Escape") {
    closeApp();
    return;
  }

  if (
    overlay &&
    overlay.classList.contains("open")
  ) {
    return;
  }

  if (e.key === "ArrowUp") {
    changePage("up");
  }

  if (e.key === "ArrowDown") {
    changePage("down");
  }
});

/* =========================================================
   PREVENT APP CLICKS FROM TRIGGERING PAGE SWIPES
   ========================================================= */

if (overlay) {
  overlay.addEventListener("pointerdown", e => {
    e.stopPropagation();
  });

  overlay.addEventListener("pointerup", e => {
    e.stopPropagation();
  });
}

/* =========================================================
   STARTUP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  createKeyboard();

  setupAppButtons();

  setupHomeButton();

  setPage(1);

  cameraCount =
    Number(localStorage.getItem("pear-camera-count") || 0);

  /* Restore dark mode */
  if (
    localStorage.getItem("pear-dark") === "true"
  ) {
    appWindow?.classList.add("dark-app");
  }
});
