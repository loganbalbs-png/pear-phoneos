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
// ============================================================

function showPage(page) {
  if (page !== 1 && page !== 2) return;

  currentPage = page;

  phone.classList.toggle("page-two", page === 2);
  phone.classList.remove("page-switch-up", "page-switch-down");

  if (pageDots) {
    pageDots.textContent = page === 2 ? "○ ●" : "● ○";
  }

  closeApp();
}

// Keyboard page switching
document.addEventListener("keydown", e => {
  if (
    e.target &&
    e.target.matches &&
    e.target.matches("input, textarea, select")
  ) {
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    showPage(2);
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    showPage(1);
  }
});

// ============================================================
// TOUCH SWIPE
// ============================================================

let swipeStartX = 0;
let swipeStartY = 0;
let swipeTracking = false;

document.addEventListener(
  "touchstart",
  e => {
    if (!e.touches || !e.touches[0]) return;

    const target = e.target;

    // Don't interpret app controls, keyboard, or Home as page swipes
    if (
      target.closest("#overlay") ||
      target.closest("#pear-keyboard") ||
      target.closest("#home")
    ) {
      swipeTracking = false;
      return;
    }

    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
    swipeTracking = true;
  },
  {
    passive: true,
    capture: true
  }
);

document.addEventListener(
  "touchend",
  e => {
    if (
      !swipeTracking ||
      !e.changedTouches ||
      !e.changedTouches[0]
    ) {
      return;
    }

    swipeTracking = false;

    if (overlay.classList.contains("open")) {
      return;
    }

    const dx =
      e.changedTouches[0].clientX - swipeStartX;

    const dy =
      e.changedTouches[0].clientY - swipeStartY;

    // Must clearly be a vertical swipe
    if (Math.abs(dy) < 35) return;
    if (Math.abs(dy) <= Math.abs(dx)) return;

    if (dy < 0) {
      // SWIPE UP = PAGE 2
      showPage(2);
    } else {
      // SWIPE DOWN = PAGE 1
      showPage(1);
    }
  },
  {
    passive: true,
    capture: true
  }
);

// ============================================================
// MOUSE / TRACKPAD DRAG
// ============================================================

let mouseStartX = 0;
let mouseStartY = 0;
let mouseDragging = false;

document.addEventListener("mousedown", e => {
  const target = e.target;

  if (
    target.closest("#overlay") ||
    target.closest("#pear-keyboard") ||
    target.closest("#home")
  ) {
    mouseDragging = false;
    return;
  }

  mouseStartX = e.clientX;
  mouseStartY = e.clientY;
  mouseDragging = true;
});

document.addEventListener("mouseup", e => {
  if (!mouseDragging) return;

  mouseDragging = false;

  if (overlay.classList.contains("open")) {
    return;
  }

  const dx = e.clientX - mouseStartX;
  const dy = e.clientY - mouseStartY;

  if (Math.abs(dy) < 35) return;
  if (Math.abs(dy) <= Math.abs(dx)) return;

  if (dy < 0) {
    showPage(2);
  } else {
    showPage(1);
  }
});

// ============================================================
// APP SYSTEM
// ============================================================

function openApp(title, content) {
  hidePearKeyboard(true);

  appWindow.innerHTML = `
    <div class="app-header">
      <button
        class="back-button"
        onclick="closeApp()"
      >‹</button>

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

  hidePearKeyboard(true);

  overlay.classList.remove("open");

  appWindow.innerHTML = "";
}

// ============================================================
// KEYBOARD
// ============================================================

let keyboardVisible = false;
let keyboardShift = false;
let activeKeyboardField = null;

function addKeyboardSupport() {
  setTimeout(() => {
    const fields = appWindow.querySelectorAll(
      "input[type='text'], input:not([type]), textarea"
    );

    fields.forEach(field => {
      field.addEventListener(
        "pointerdown",
        () => {
          activeKeyboardField = field;
        }
      );

      field.addEventListener(
        "click",
        e => {
          e.stopPropagation();

          activeKeyboardField = field;

          field.focus({
            preventScroll: true
          });

          showPearKeyboard(field);
        }
      );
    });
  }, 50);
}

function showPearKeyboard(input) {
  activeKeyboardField = input;

  let keyboard =
    document.getElementById("pear-keyboard");

  if (!keyboard) {
    keyboard = document.createElement("div");
    keyboard.id = "pear-keyboard";

    document.body.appendChild(keyboard);
  }

  keyboard.innerHTML = "";

  keyboard.addEventListener(
    "pointerdown",
    e => {
      e.preventDefault();
    }
  );

  keyboard.addEventListener(
    "mousedown",
    e => {
      e.preventDefault();
    }
  );

  keyboard.addEventListener(
    "touchstart",
    e => {
      e.preventDefault();
    },
    {
      passive: false
    }
  );

  const rows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["SHIFT","Z","X","C","V","B","N","M","⌫"],
    ["123","SPACE","ENTER"]
  ];

  rows.forEach((row, rowIndex) => {
    const rowElement =
      document.createElement("div");

    rowElement.className =
      "pear-keyboard-row";

    if (rowIndex === rows.length - 1) {
      rowElement.classList.add("bottom");
    }

    row.forEach(key => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.textContent = key;

      button.addEventListener(
        "pointerdown",
        e => {
          e.preventDefault();
          e.stopPropagation();

          keyboardKey(key);
        }
      );

      rowElement.appendChild(button);
    });

    keyboard.appendChild(rowElement);
  });

  keyboard.style.display = "block";

  requestAnimationFrame(() => {
    keyboard.classList.add("keyboard-show");
  });

  keyboardVisible = true;
}

function hidePearKeyboard(immediate = false) {
  const keyboard =
    document.getElementById("pear-keyboard");

  if (!keyboard) {
    activeKeyboardField = null;
    keyboardVisible = false;
    return;
  }

  if (immediate) {
    keyboard.classList.remove("keyboard-show");
    keyboard.style.display = "none";
  } else {
    keyboard.classList.remove("keyboard-show");

    setTimeout(() => {
      if (!keyboard.classList.contains("keyboard-show")) {
        keyboard.style.display = "none";
      }
    }, 280);
  }

  activeKeyboardField = null;
  keyboardVisible = false;
}

function getFocusedField() {
  if (
    activeKeyboardField &&
    document.body.contains(activeKeyboardField)
  ) {
    return activeKeyboardField;
  }

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

  if (key === "SHIFT") {
    keyboardShiftKey();
    return;
  }

  if (key === "⌫") {
    keyboardBackspace();
    return;
  }

  if (key === "SPACE") {
    keyboardSpace();
    return;
  }

  if (key === "ENTER") {
    keyboardEnter();
    return;
  }

  if (key === "123") {
    keyboardNumber();
    return;
  }

  let value = key;

  if (!keyboardShift) {
    value = value.toLowerCase();
  }

  insertText(value);

  if (keyboardShift) {
    keyboardShift = false;
  }
}

function insertText(text) {
  const field = getFocusedField();

  if (!field) return;

  const start =
    field.selectionStart ??
    field.value.length;

  const end =
    field.selectionEnd ??
    field.value.length;

  const before =
    field.value.slice(0, start);

  const after =
    field.value.slice(end);

  field.value =
    before + text + after;

  const position =
    start + text.length;

  field.setSelectionRange(
    position,
    position
  );

  field.dispatchEvent(
    new Event("input", {
      bubbles: true
    })
  );

  field.focus({
    preventScroll: true
  });
}

function keyboardSpace() {
  insertText(" ");
}

function keyboardBackspace() {
  const field = getFocusedField();

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
  } else if (start > 0) {
    field.value =
      field.value.slice(0, start - 1) +
      field.value.slice(start);

    field.setSelectionRange(
      start - 1,
      start - 1
    );
  }

  field.dispatchEvent(
    new Event("input", {
      bubbles: true
    })
  );

  field.focus({
    preventScroll: true
  });
}

function keyboardEnter() {
  const field = getFocusedField();

  if (!field) return;

  if (field.tagName === "TEXTAREA") {
    insertText("\n");
    return;
  }

  field.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true
    })
  );
}

function keyboardShiftKey() {
  keyboardShift = !keyboardShift;

  const keyboard =
    document.getElementById("pear-keyboard");

  if (!keyboard) return;

  const buttons =
    keyboard.querySelectorAll("button");

  buttons.forEach(button => {
    const text = button.textContent;

    if (
      text &&
      text.length === 1 &&
      /^[A-Z]$/.test(text)
    ) {
      button.textContent =
        keyboardShift
          ? text.toUpperCase()
          : text.toLowerCase();
    }
  });
}

function keyboardNumber() {
  insertText("123");
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

        <div id="message-list">
          <div class="bubble">
            Hey! 👋
          </div>

          <div class="bubble">
            Welcome to Pear Phone.
          </div>
        </div>

        <div class="row">
          <input
            id="message-input"
            type="text"
            placeholder="Message..."
            style="flex:1"
          >

          <button
            class="button"
            onclick="sendMessage()"
          >
            Send
          </button>
        </div>
      </div>
    `
  );
}

function sendMessage() {
  const input =
    document.getElementById("message-input");

  const list =
    document.getElementById("message-list");

  if (!input || !list) return;

  const value =
    input.value.trim();

  if (!value) return;

  list.innerHTML += `
    <div class="bubble me">
      ${escapeHTML(value)}
    </div>
  `;

  input.value = "";

  setTimeout(() => {
    list.innerHTML += `
      <div class="bubble">
        ${escapeHTML(randomReply())}
      </div>
    `;

    list.scrollTop =
      list.scrollHeight;
  }, 700);
}

function randomReply() {
  const replies = [
    "Sounds good!",
    "Nice 👍",
    "Got it!",
    "That's awesome!",
    "Pear Phone approved 🍐",
    "Haha 😂",
    "Absolutely!"
  ];

  return replies[
    Math.floor(
      Math.random() * replies.length
    )
  ];
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
      <div class="card">

        <h2>📷 Camera</h2>

        <video
          id="camera-video"
          class="camera-video"
          autoplay
          playsinline
          muted
        ></video>

        <div class="row">
          <button
            class="button"
            onclick="startCamera()"
          >
            Start Camera
          </button>

          <button
            class="button"
            onclick="capturePhoto()"
          >
            Take Photo
          </button>

          <button
            class="button"
            onclick="flipCamera()"
          >
            Flip
          </button>
        </div>

        <div id="camera-status">
          Camera ready.
        </div>

        <div id="camera-preview"></div>

        <canvas
          id="camera-canvas"
          style="display:none"
        ></canvas>

      </div>
    `
  );

  startCamera();
}

async function startCamera() {
  const video =
    document.getElementById("camera-video");

  const status =
    document.getElementById("camera-status");

  if (!video) return;

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    if (status) {
      status.textContent =
        "Camera unavailable. Use HTTPS or localhost.";
    }

    return;
  }

  try {
    stopCamera();

    if (status) {
      status.textContent =
        "Starting camera...";
    }

    cameraStream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          },
          facingMode: {
            ideal: cameraFacing
          }
        },
        audio: false
      });

    video.srcObject =
      cameraStream;

    await video.play();

    if (status) {
      status.textContent =
        "Camera connected ✓";
    }

    // Try to select Freenove/USB camera if available
    try {
      const devices =
        await navigator.mediaDevices.enumerateDevices();

      const cameras =
        devices.filter(
          d => d.kind === "videoinput"
        );

      const matching =
        cameras.find(d =>
          /freenove|usb|webcam|camera/i.test(
            d.label
          )
        );

      if (
        matching &&
        cameraStream &&
        cameraStream.getVideoTracks()[0]
          ?.getSettings()
          ?.deviceId !== matching.deviceId
      ) {
        cameraStream
          .getTracks()
          .forEach(track => track.stop());

        cameraStream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: {
                exact:
                  matching.deviceId
              }
            },
            audio: false
          });

        video.srcObject =
          cameraStream;

        await video.play();

        if (status) {
          status.textContent =
            "USB/Freenove camera connected ✓";
        }
      }
    } catch (deviceError) {
      console.warn(
        "Could not select preferred camera:",
        deviceError
      );
    }

  } catch (error) {
    console.error(
      "Camera error:",
      error
    );

    if (status) {
      status.textContent =
        "Camera permission/device error.";
    }
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
    document.getElementById("camera-preview");

  if (
    !video ||
    !canvas ||
    !preview ||
    !video.videoWidth
  ) {
    alert(
      "Start the camera first."
    );

    return;
  }

  canvas.width =
    video.videoWidth;

  canvas.height =
    video.videoHeight;

  const ctx =
    canvas.getContext("2d");

  ctx.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const image =
    canvas.toDataURL(
      "image/png"
    );

  preview.innerHTML = `
    <img
      src="${image}"
      style="
        width:100%;
        margin-top:10px;
        border-radius:12px;
      "
    >
  `;

  const photos =
    JSON.parse(
      localStorage.getItem(
        "pear-photos"
      ) || "[]"
    );

  photos.unshift(image);

  localStorage.setItem(
    "pear-photos",
    JSON.stringify(
      photos.slice(0, 30)
    )
  );
}

function stopCamera() {
  if (!cameraStream) return;

  cameraStream
    .getTracks()
    .forEach(track =>
      track.stop()
    );

  cameraStream = null;

  const video =
    document.getElementById(
      "camera-video"
    );

  if (video) {
    video.srcObject = null;
  }
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
          accept="image/png"
          multiple
          onchange="loadPhotos(event)"
        >

        <div
          id="photo-grid"
          class="photos"
          style="margin-top:10px"
        ></div>

      </div>
    `
  );

  renderSavedPhotos();
}

function renderSavedPhotos() {
  const grid =
    document.getElementById(
      "photo-grid"
    );

  if (!grid) return;

  const photos =
    JSON.parse(
      localStorage.getItem(
        "pear-photos"
      ) || "[]"
    );

  if (!photos.length) {
    grid.innerHTML =
      "<p>No photos yet.</p>";

    return;
  }

  grid.innerHTML =
    photos.map(
      image => `
        <img
          src="${image}"
          alt="Saved photo"
        >
      `
    ).join("");
}

function loadPhotos(event) {
  const grid =
    document.getElementById(
      "photo-grid"
    );

  if (!grid) return;

  const files =
    Array.from(
      event.target.files || []
    );

  files.forEach(file => {
    if (file.type !== "image/png") {
      alert(
        "Please choose PNG images only."
      );

      return;
    }

    const url =
      URL.createObjectURL(file);

    grid.innerHTML += `
      <img
        src="${url}"
        alt="PNG photo"
      >
    `;
  });
}

// ============================================================
// SPLASHFACE
// ============================================================

function splashfaceApp() {
  openApp(
    "SplashFace",
    `
      <div class="card">

        <h2>🌊 SplashFace</h2>

        <button
          class="button"
          onclick="newPost()"
        >
          New Post
        </button>

        <div
          id="splash-feed"
          style="margin-top:10px"
        >

          <div class="stock">
            <div>
              <strong>
                Pear User
              </strong>

              <p>
                Welcome to SplashFace 🍐
              </p>
            </div>
          </div>

        </div>

      </div>
    `
  );
}

function newPost() {
  const feed =
    document.getElementById(
      "splash-feed"
    );

  if (!feed) return;

  const card =
    document.createElement("div");

  card.className =
    "stock";

  card.innerHTML = `
    <div style="width:100%">

      <strong>
        New SplashFace Post
      </strong>

      <textarea
        id="new-splash-post"
        placeholder="What's happening?"
        style="margin-top:8px"
      ></textarea>

      <button
        class="button"
        onclick="publishSplashPost()"
        style="margin-top:8px"
      >
        Post
      </button>

    </div>
  `;

  feed.prepend(card);

  addKeyboardSupport();
}

function publishSplashPost() {
  const input =
    document.getElementById(
      "new-splash-post"
    );

  const feed =
    document.getElementById(
      "splash-feed"
    );

  if (!input || !feed) return;

  const text =
    input.value.trim();

  if (!text) return;

  const post =
    document.createElement("div");

  post.className =
    "stock";

  post.innerHTML = `
    <div>
      <strong>
        You
      </strong>

      <p>
        ${escapeHTML(text)}
      </p>

      <button
        class="button"
        onclick="commentSplash(this)"
      >
        Comment
      </button>

      <div class="comments"></div>
    </div>
  `;

  feed.prepend(post);

  input.value = "";

  hidePearKeyboard(true);
}

function commentSplash(button) {
  const parent =
    button.closest(".stock");

  if (!parent) return;

  let area =
    parent.querySelector(
      ".comment-area"
    );

  if (area) return;

  area =
    document.createElement("div");

  area.className =
    "comment-area";

  area.innerHTML = `
    <input
      type="text"
      placeholder="Write a comment..."
      class="comment-input"
    >

    <button
      class="button"
      onclick="submitSplashComment(this)"
    >
      Send
    </button>
  `;

  parent.appendChild(area);

  addKeyboardSupport();
}

function submitSplashComment(button) {
  const area =
    button.closest(
      ".comment-area"
    );

  if (!area) return;

  const input =
    area.querySelector(
      ".comment-input"
    );

  const parent =
    button.closest(".stock");

  const comments =
    parent?.querySelector(
      ".comments"
    );

  if (!input || !comments) return;

  const text =
    input.value.trim();

  if (!text) return;

  comments.innerHTML += `
    <div class="bubble">
      ${escapeHTML(text)}
    </div>
  `;

  input.value = "";

  hidePearKeyboard(true);
}

// ============================================================
// STOCKS
// ============================================================

function stocksApp() {
  const stocks = [
    ["AAPL","Apple","$229.87","+1.8%"],
    ["MSFT","Microsoft","$532.44","+0.9%"],
    ["TSLA","Tesla","$318.26","-1.2%"],
    ["PEAR","Pear Inc.","$99.99","+4.2%"]
  ];

  openApp(
    "Stocks",
    `
      <div class="card">

        <h2>📈 Stocks</h2>

        ${stocks.map(
          stock => `
            <div
              class="stock"
              onclick="stockDetails('${stock[0]}')"
              style="cursor:pointer"
            >

              <span>
                <strong>
                  ${stock[0]}
                </strong>

                <br>

                <small>
                  ${stock[1]}
                </small>
              </span>

              <span>
                <strong>
                  ${stock[2]}
                </strong>

                <br>

                <small>
                  ${stock[3]}
                </small>
              </span>

            </div>
          `
        ).join("")}

      </div>
    `
  );
}

function stockDetails(symbol) {
  openApp(
    "Stock Details",
    `
      <div class="card">

        <h2>${escapeHTML(symbol)}</h2>

        <div class="map">
          📈
        </div>

        <p>
          Live Pear Market simulation.
        </p>

        <button
          class="button"
          onclick="closeApp()"
        >
          Done
        </button>

      </div>
    `
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

        <div class="map">
          📍
        </div>

        <h3>
          Pear Park
        </h3>

        <p>
          12 Pear Street
        </p>

        <button
          class="button"
          onclick="startRoute(this)"
        >
          Start Route
        </button>

      </div>
    `
  );
}

function startRoute(button) {
  button.textContent =
    "Route Started ✓";
}

// ============================================================
// WEATHER
// ============================================================

function weatherApp() {
  openApp(
    "Weather",
    `
      <div class="card">

        <div
          style="
            text-align:center;
            font-size:60px;
            padding:20px;
          "
        >
          ☀️

          <div
            style="
              font-size:44px;
              font-weight:900;
            "
          >
            24°
          </div>
        </div>

        <h2>
          Sunny
        </h2>

        <p>
          Feels like 25°
        </p>

        <div class="stock">
          <span>Today</span>
          <strong>24°</strong>
        </div>

        <div class="stock">
          <span>Tomorrow</span>
          <strong>26°</strong>
        </div>

      </div>
    `
  );
}

// ============================================================
// NOTES
// ============================================================

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
          style="width:100%"
        >

        <textarea
          id="note-body"
          placeholder="Write your note..."
          style="margin-top:8px"
        ></textarea>

        <button
          class="button"
          onclick="saveNote()"
        >
          Save Note
        </button>

        <div
          id="notes-list"
          style="margin-top:10px"
        ></div>

      </div>
    `
  );

  renderNotes();
}

function renderNotes() {
  const list =
    document.getElementById(
      "notes-list"
    );

  if (!list) return;

  const notes =
    JSON.parse(
      localStorage.getItem(
        "pear-notes"
      ) || "[]"
    );

  list.innerHTML =
    notes.map(
      (note, index) => `
        <div
          class="stock"
          onclick="editNote(${index})"
        >
          <div>
            <strong>
              ${escapeHTML(note.title)}
            </strong>

            <p>
              ${escapeHTML(
                note.body.slice(0, 80)
              )}
            </p>
          </div>
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

  if (!title || !body) return;

  const notes =
    JSON.parse(
      localStorage.getItem(
        "pear-notes"
      ) || "[]"
    );

  notes.unshift({
    title:
      title.value.trim() ||
      "Untitled",

    body:
      body.value
  });

  localStorage.setItem(
    "pear-notes",
    JSON.stringify(
      notes.slice(0, 50)
    )
  );

  title.value = "";
  body.value = "";

  hidePearKeyboard(true);

  renderNotes();
}

function editNote(index) {
  const notes =
    JSON.parse(
      localStorage.getItem(
        "pear-notes"
      ) || "[]"
    );

  const note =
    notes[index];

  if (!note) return;

  const title =
    document.getElementById(
      "note-title"
    );

  const body =
    document.getElementById(
      "note-body"
    );

  if (!title || !body) return;

  title.value =
    note.title;

  body.value =
    note.body;

  title.focus();

  showPearKeyboard(title);
}

// ============================================================
// CLOCK
// ============================================================

let clockTimer = null;

function clockApp() {
  openApp(
    "Clock",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <div
          id="clock-time"
          style="
            font-size:42px;
            font-weight:900;
            padding:25px 0;
          "
        >
          --:--:--
        </div>

        <p>
          Local time
        </p>

      </div>
    `
  );

  updateClock();

  clearInterval(clockTimer);

  clockTimer =
    setInterval(
      updateClock,
      1000
    );
}

function updateClock() {
  const element =
    document.getElementById(
      "clock-time"
    );

  if (!element) {
    clearInterval(clockTimer);
    return;
  }

  element.textContent =
    new Date().toLocaleTimeString(
      [],
      {
        hour:
          "numeric",

        minute:
          "2-digit",

        second:
          "2-digit"
      }
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

        <label
          style="
            display:flex;
            justify-content:space-between;
            padding:12px;
          "
        >
          Dark Mode

          <input
            id="dark-toggle"
            type="checkbox"
          >
        </label>

        <label
          style="
            display:flex;
            justify-content:space-between;
            padding:12px;
          "
        >
          Animations

          <input
            id="animation-toggle"
            type="checkbox"
          >
        </label>

        <button
          class="button"
          onclick="resetPearData()"
        >
          Reset Saved Data
        </button>

      </div>
    `
  );

  const dark =
    document.getElementById(
      "dark-toggle"
    );

  const animations =
    document.getElementById(
      "animation-toggle"
    );

  if (dark) {
    dark.checked =
      localStorage.getItem(
        "pear-dark"
      ) === "true";

    dark.onchange =
      e => {
        localStorage.setItem(
          "pear-dark",
          e.target.checked
            ? "true"
            : "false"
        );

        document.body.classList.toggle(
          "dark-mode",
          e.target.checked
        );
      };
  }

  if (animations) {
    animations.checked =
      localStorage.getItem(
        "pear-animations"
      ) === "true";

    animations.onchange =
      e => {
        localStorage.setItem(
          "pear-animations",
          e.target.checked
            ? "true"
            : "false"
        );

        document.body.classList.toggle(
          "no-animations",
          e.target.checked
        );
      };
  }
}

function resetPearData() {
  localStorage.clear();

  location.reload();
}

// ============================================================
// PEARTUNES / MUSIC
// ============================================================

function pearTunesApp() {
  openApp(
    "PearTunes",
    `
      <div class="card">

        <h2>🎵 PearTunes</h2>

        <div class="big">
          ♫
        </div>

        <div class="stock">
          <span>
            Pearadise
          </span>

          <button
            class="button"
            onclick="playSong(this,'Pearadise')"
          >
            ▶
          </button>
        </div>

        <div class="stock">
          <span>
            Sunset Drive
          </span>

          <button
            class="button"
            onclick="playSong(this,'Sunset Drive')"
          >
            ▶
          </button>
        </div>

        <div class="stock">
          <span>
            Electric Orchard
          </span>

          <button
            class="button"
            onclick="playSong(this,'Electric Orchard')"
          >
            ▶
          </button>
        </div>

        <div
          id="music-status"
          style="text-align:center"
        ></div>

      </div>
    `
  );
}

function playSong(button, song) {
  const status =
    document.getElementById(
      "music-status"
    );

  if (status) {
    status.textContent =
      `Playing: ${song} ♪`;
  }

  button.textContent =
    "⏸";
}

// ============================================================
// PHONE
// ============================================================

function phoneApp() {
  openApp(
    "Phone",
    `
      <div class="card">

        <div class="big">
          ☎
        </div>

        <h2
          style="text-align:center"
        >
          Pear Phone
        </h2>

        <input
          id="phone-number"
          type="text"
          placeholder="Phone number"
          style="width:100%"
        >

        <button
          class="button"
          onclick="callNumber()"
          style="margin-top:8px"
        >
          Call
        </button>

        <div
          id="call-status"
          style="text-align:center;margin-top:10px"
        ></div>

      </div>
    `
  );
}

function callNumber() {
  const input =
    document.getElementById(
      "phone-number"
    );

  const status =
    document.getElementById(
      "call-status"
    );

  if (!input || !status) return;

  if (!input.value.trim()) {
    status.textContent =
      "Enter a phone number.";

    return;
  }

  status.textContent =
    `Calling ${input.value}...`;
}

// ============================================================
// MAIL
// ============================================================

function mailApp() {
  openApp(
    "Mail",
    `
      <div class="card">

        <h2>✉️ Mail</h2>

        <div class="stock">
          <div>
            <strong>
              Welcome to Pear OS
            </strong>

            <p>
              Your Pear Phone is ready.
            </p>
          </div>

          <small>
            9:41
          </small>
        </div>

        <div class="stock">
          <div>
            <strong>
              PearTunes
            </strong>

            <p>
              New music available.
            </p>
          </div>

          <small>
            8:30
          </small>
        </div>

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
        style="text-align:center"
      >

        <div
          style="
            font-size:90px;
            padding:25px;
          "
        >
          🧭
        </div>

        <h2>
          North
        </h2>

        <p>
          0°
        </p>

      </div>
    `
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

        <h2>▶ Videos</h2>

        <div
          class="stock"
          onclick="videoMessage()"
        >
          <span>
            Pear Phone Demo
          </span>

          <button
            class="button"
          >
            ▶
          </button>
        </div>

        <div
          id="video-status"
          style="text-align:center"
        ></div>

      </div>
    `
  );
}

function videoMessage() {
  const status =
    document.getElementById(
      "video-status"
    );

  if (status) {
    status.textContent =
      "Playing Pear Phone Demo ▶";
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

        <h2>🔤 Lingo</h2>

        <p>
          Guess the five-letter word.
        </p>

        <input
          id="lingo-input"
          type="text"
          maxlength="5"
          placeholder="Guess"
          style="width:100%"
        >

        <button
          class="button"
          onclick="checkLingo()"
          style="margin-top:8px"
        >
          Guess
        </button>

        <div
          id="lingo-result"
          style="margin-top:10px"
        ></div>

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

  if (!input || !result) return;

  const guess =
    input.value.trim().toLowerCase();

  if (guess === "pear") {
    result.textContent =
      "Correct! 🍐";
  } else {
    result.textContent =
      "Try again!";
  }
}

function tumsApp() {
  openApp(
    "Tums",
    `
      <div class="card">

        <h2>🍬 Tums</h2>

        <p>
          Pear Phone Tums tracker.
        </p>

        <button
          class="button"
          onclick="takeTums(this)"
        >
          Take One
        </button>

        <div
          id="tums-count"
          style="margin-top:10px"
        >
          Taken: 0
        </div>

      </div>
    `
  );
}

let tumsCount = 0;

function takeTums(button) {
  tumsCount++;

  const count =
    document.getElementById(
      "tums-count"
    );

  if (count) {
    count.textContent =
      `Taken: ${tumsCount}`;
  }

  button.textContent =
    "Taken ✓";
}

function danwarpApp() {
  openApp(
    "DanWarp",
    `
      <div class="card">

        <h2>🌀 DanWarp</h2>

        <p>
          Warp through the Pear Phone.
        </p>

        <button
          class="button"
          onclick="warpEffect(this)"
        >
          WARP
        </button>

        <div
          id="warp-result"
          class="big"
        ></div>

      </div>
    `
  );
}

function warpEffect(button) {
  button.textContent =
    "WARPING...";

  const result =
    document.getElementById(
      "warp-result"
    );

  setTimeout(() => {
    if (result) {
      result.textContent =
        "🌀✨";
    }

    button.textContent =
      "WARP AGAIN";
  }, 700);
}

function imageApp() {
  openApp(
    "Image Studio",
    `
      <div class="card">

        <h2>🖼️ Image Studio</h2>

        <input
          type="file"
          accept="image/png"
          onchange="loadSingleImage(event)"
        >

        <div
          id="single-image"
          style="margin-top:10px"
        >
        </div>

      </div>
    `
  );
}

function loadSingleImage(event) {
  const file =
    event.target.files?.[0];

  if (!file) return;

  if (file.type !== "image/png") {
    alert(
      "Please choose a PNG image."
    );

    event.target.value = "";

    return;
  }

  const image =
    document.getElementById(
      "single-image"
    );

  if (!image) return;

  image.innerHTML = `
    <img
      id="studio-image"
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
      <div
        class="card"
        style="text-align:center"
      >

        <h2>⏱️ Chrono</h2>

        <div
          id="chrono-time"
          class="big"
        >
          00:00
        </div>

        <button
          class="button"
          onclick="startChrono()"
        >
          Start
        </button>

        <button
          class="button"
          onclick="resetChrono()"
        >
          Reset
        </button>

      </div>
    `
  );
}

let chronoSeconds = 0;
let chronoTimer = null;

function startChrono() {
  if (chronoTimer) return;

  chronoTimer =
    setInterval(() => {
      chronoSeconds++;

      const element =
        document.getElementById(
          "chrono-time"
        );

      if (!element) {
        clearInterval(
          chronoTimer
        );

        chronoTimer = null;

        return;
      }

      const minutes =
        String(
          Math.floor(
            chronoSeconds / 60
          )
        ).padStart(2,"0");

      const seconds =
        String(
          chronoSeconds % 60
        ).padStart(2,"0");

      element.textContent =
        `${minutes}:${seconds}`;
    },1000);
}

function resetChrono() {
  clearInterval(
    chronoTimer
  );

  chronoTimer = null;
  chronoSeconds = 0;

  const element =
    document.getElementById(
      "chrono-time"
    );

  if (element) {
    element.textContent =
      "00:00";
  }
}

function zaplookApp() {
  openApp(
    "ZapLook",
    `
      <div class="card">

        <h2>⚡ ZapLook</h2>

        <input
          id="zaplook-input"
          type="text"
          placeholder="Search..."
          style="width:100%"
        >

        <button
          class="button"
          onclick="zapSearch()"
          style="margin-top:8px"
        >
          Zap
        </button>

        <div
          id="zap-result"
          style="margin-top:10px"
        ></div>

      </div>
    `
  );
}

function zapSearch() {
  const input =
    document.getElementById(
      "zaplook-input"
    );

  const result =
    document.getElementById(
      "zap-result"
    );

  if (!input || !result) return;

  const value =
    input.value.trim();

  result.textContent =
    value
      ? `ZapLook searched for "${value}".`
      : "Type something first.";
}

function monkeyApp() {
  openApp(
    "Monkey",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <h2>🐒 Monkey</h2>

        <div
          id="monkey-face"
          style="
            font-size:90px;
            padding:20px;
          "
        >
          🐒
        </div>

        <button
          class="button"
          onclick="monkeyJump()"
        >
          Make Monkey Jump
        </button>

      </div>
    `
  );
}

function monkeyJump() {
  const face =
    document.getElementById(
      "monkey-face"
    );

  if (!face) return;

  face.textContent =
    "🙈";

  setTimeout(() => {
    face.textContent =
      "🐒";
  },500);
}

function remarkApp() {
  openApp(
    "Remark",
    `
      <div class="card">

        <h2>💭 Remark</h2>

        <textarea
          id="remark-input"
          placeholder="Write a remark..."
        ></textarea>

        <button
          class="button"
          onclick="saveRemark()"
          style="margin-top:8px"
        >
          Save
        </button>

        <div
          id="remark-result"
          style="margin-top:10px"
        ></div>

      </div>
    `
  );
}

function saveRemark() {
  const input =
    document.getElementById(
      "remark-input"
    );

  const result =
    document.getElementById(
      "remark-result"
    );

  if (!input || !result) return;

  const text =
    input.value.trim();

  if (!text) return;

  result.innerHTML = `
    <div class="bubble me">
      ${escapeHTML(text)}
    </div>
  `;

  input.value = "";

  hidePearKeyboard(true);
}

// ============================================================
// KEYBOARD DEMO
// ============================================================

function keyboardDemo() {
  openApp(
    "Keyboard Test",
    `
      <div class="card">

        <h2>⌨️ Keyboard Test</h2>

        <input
          id="keyboard-test"
          type="text"
          placeholder="Type here..."
          style="width:100%"
        >

        <p>
          Tap the text box to open
          the Pear keyboard.
        </p>

      </div>
    `
  );
}

// ============================================================
// TYPING GAME
// ============================================================

let typingGameTimer = null;

function startTypingGame() {
  openApp(
    "Typing Game",
    `
      <div class="card">

        <h2>⌨️ Typing Game</h2>

        <p>
          Type the word:
        </p>

        <h1
          id="typing-word"
          style="text-align:center"
        >
          PEAR
        </h1>

        <input
          id="typing-input"
          type="text"
          placeholder="Type the word..."
          style="width:100%"
        >

        <div
          id="typing-result"
          style="margin-top:10px"
        ></div>

      </div>
    `
  );

  setTimeout(() => {
    const input =
      document.getElementById(
        "typing-input"
      );

    if (input) {
      input.focus();
    }
  },100);
}

function stopTypingGame() {
  clearInterval(
    typingGameTimer
  );

  typingGameTimer = null;
}

// ============================================================
// PAGE 1 APP CONNECTIONS
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
      "pointerup",
      e => {
        e.preventDefault();
        e.stopPropagation();

        connections[id]();
      }
    );
  });
}

// ============================================================
// PAGE 2 APP CONNECTIONS
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
      "pointerup",
      e => {
        e.preventDefault();
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
  const goHome = e => {
    e.preventDefault();
    e.stopPropagation();

    hidePearKeyboard(true);
    closeApp();
  };

  homeButton.addEventListener(
    "pointerdown",
    goHome,
    true
  );

  homeButton.addEventListener(
    "pointerup",
    e => {
      e.preventDefault();
      e.stopPropagation();
    },
    true
  );

  homeButton.addEventListener(
    "touchstart",
    goHome,
    {
      passive:false,
      capture:true
    }
  );

  homeButton.addEventListener(
    "click",
    goHome,
    true
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
  "page-two",
  "page-switch-up",
  "page-switch-down"
);

if (pageDots) {
  pageDots.textContent =
    "● ○";
}

console.log(
  "🍐 Pear Phone OS loaded successfully."
);
// ============================================================
// PART 2 — ADDITIONAL PEAR PHONE APPS
// ============================================================

// ============================================================
// WEATHER DETAILS
// ============================================================

function weatherDetails() {
  openApp(
    "Weather Details",
    `
      <div class="card">

        <h2>☀️ Weather</h2>

        <div
          style="
            text-align:center;
            padding:15px;
          "
        >
          <div style="font-size:70px">
            ☀️
          </div>

          <div
            style="
              font-size:48px;
              font-weight:900;
            "
          >
            24°
          </div>

          <div>
            Sunny
          </div>
        </div>

        <div class="stock">
          <span>
            Feels Like
          </span>
          <strong>
            25°
          </strong>
        </div>

        <div class="stock">
          <span>
            Humidity
          </span>
          <strong>
            42%
          </strong>
        </div>

        <div class="stock">
          <span>
            Wind
          </span>
          <strong>
            12 km/h
          </strong>
        </div>

      </div>
    `
  );
}

// ============================================================
// MUSIC PLAYER
// ============================================================

let currentSong = null;
let musicPlaying = false;

function musicPlayerApp() {
  openApp(
    "Music",
    `
      <div class="card">

        <h2>🎵 Now Playing</h2>

        <div
          style="
            text-align:center;
            padding:20px;
          "
        >

          <div
            id="album-art"
            style="
              width:150px;
              height:150px;
              margin:auto;
              border-radius:20px;
              background:
                linear-gradient(
                  135deg,
                  #b7e58a,
                  #6ebc45
                );
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:70px;
            "
          >
            🍐
          </div>

          <h2 id="current-song">
            Nothing Playing
          </h2>

          <p id="current-artist">
            PearTunes
          </p>

        </div>

        <div
          style="
            display:flex;
            justify-content:center;
            gap:8px;
          "
        >

          <button
            class="button"
            onclick="previousSong()"
          >
            ⏮
          </button>

          <button
            class="button"
            onclick="toggleMusic()"
            id="music-play-button"
          >
            ▶
          </button>

          <button
            class="button"
            onclick="nextSong()"
          >
            ⏭
          </button>

        </div>

        <div
          id="music-progress"
          style="
            height:6px;
            background:#ddd;
            border-radius:5px;
            margin-top:15px;
            overflow:hidden;
          "
        >
          <div
            id="music-progress-bar"
            style="
              width:0%;
              height:100%;
              background:#168ee8;
            "
          ></div>
        </div>

      </div>
    `
  );

  if (!currentSong) {
    currentSong = 0;
  }

  updateMusicDisplay();
}

const musicSongs = [
  {
    title: "Pearadise",
    artist: "PearTunes"
  },
  {
    title: "Sunset Drive",
    artist: "PearTunes"
  },
  {
    title: "Electric Orchard",
    artist: "PearTunes"
  },
  {
    title: "Fruit Bowl",
    artist: "PearTunes"
  }
];

let musicProgressTimer = null;
let musicProgress = 0;

function updateMusicDisplay() {
  const song =
    musicSongs[currentSong];

  if (!song) return;

  const title =
    document.getElementById(
      "current-song"
    );

  const artist =
    document.getElementById(
      "current-artist"
    );

  const button =
    document.getElementById(
      "music-play-button"
    );

  if (title) {
    title.textContent =
      song.title;
  }

  if (artist) {
    artist.textContent =
      song.artist;
  }

  if (button) {
    button.textContent =
      musicPlaying
        ? "⏸"
        : "▶";
  }
}

function toggleMusic() {
  musicPlaying =
    !musicPlaying;

  updateMusicDisplay();

  clearInterval(
    musicProgressTimer
  );

  if (!musicPlaying) {
    return;
  }

  musicProgressTimer =
    setInterval(() => {
      musicProgress += 1;

      const bar =
        document.getElementById(
          "music-progress-bar"
        );

      if (bar) {
        bar.style.width =
          Math.min(
            musicProgress,
            100
          ) + "%";
      }

      if (musicProgress >= 100) {
        nextSong();
      }
    }, 1000);
}

function nextSong() {
  musicProgress = 0;

  currentSong =
    (currentSong + 1) %
    musicSongs.length;

  updateMusicDisplay();

  const bar =
    document.getElementById(
      "music-progress-bar"
    );

  if (bar) {
    bar.style.width =
      "0%";
  }
}

function previousSong() {
  musicProgress = 0;

  currentSong =
    (currentSong - 1 +
      musicSongs.length) %
    musicSongs.length;

  updateMusicDisplay();

  const bar =
    document.getElementById(
      "music-progress-bar"
    );

  if (bar) {
    bar.style.width =
      "0%";
  }
}

// ============================================================
// SIMPLE CALCULATOR
// ============================================================

let calculatorValue = "";

function calculatorApp() {
  calculatorValue = "";

  openApp(
    "Calculator",
    `
      <div class="card">

        <h2>🧮 Calculator</h2>

        <input
          id="calculator-display"
          type="text"
          readonly
          value="0"
          style="
            width:100%;
            font-size:25px;
            text-align:right;
            margin-bottom:10px;
          "
        >

        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(4,1fr);
            gap:5px;
          "
        >

          ${[
            "7","8","9","÷",
            "4","5","6","×",
            "1","2","3","−",
            "0",".","=","+"
          ].map(
            key => `
              <button
                class="button"
                onclick="calculatorPress('${key}')"
                style="
                  min-height:42px;
                "
              >
                ${key}
              </button>
            `
          ).join("")}

        </div>

        <button
          class="button"
          onclick="calculatorClear()"
          style="
            width:100%;
            margin-top:6px;
          "
        >
          Clear
        </button>

      </div>
    `
  );
}

function calculatorPress(key) {
  const display =
    document.getElementById(
      "calculator-display"
    );

  if (!display) return;

  if (key === "=") {
    try {
      const expression =
        calculatorValue
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/−/g, "-");

      calculatorValue =
        String(
          Function(
            `"use strict";
             return (${expression})`
          )()
        );

      display.value =
        calculatorValue;
    } catch {
      calculatorValue = "";

      display.value =
        "Error";
    }

    return;
  }

  calculatorValue += key;

  display.value =
    calculatorValue;
}

function calculatorClear() {
  calculatorValue = "";

  const display =
    document.getElementById(
      "calculator-display"
    );

  if (display) {
    display.value =
      "0";
  }
}

// ============================================================
// CALENDAR
// ============================================================

function calendarApp() {
  const date =
    new Date();

  const month =
    date.toLocaleString(
      "default",
      {
        month:"long"
      }
    );

  const year =
    date.getFullYear();

  openApp(
    "Calendar",
    `
      <div class="card">

        <h2>📅 ${month} ${year}</h2>

        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(7,1fr);
            gap:4px;
            text-align:center;
          "
        >

          ${[
            "S","M","T","W","T","F","S"
          ].map(
            day => `
              <strong>
                ${day}
              </strong>
            `
          ).join("")}

          ${createCalendarDays(
            date
          )}

        </div>

      </div>
    `
  );
}

function createCalendarDays(date) {
  const firstDay =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();

  const daysInMonth =
    new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

  let html = "";

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    html += "<div></div>";
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    const today =
      day === date.getDate();

    html += `
      <div
        style="
          padding:8px 2px;
          border-radius:8px;
          ${
            today
              ? "background:#168ee8;color:white;font-weight:900;"
              : ""
          }
        "
      >
        ${day}
      </div>
    `;
  }

  return html;
}

// ============================================================
// REMINDERS
// ============================================================

function remindersApp() {
  openApp(
    "Reminders",
    `
      <div class="card">

        <h2>🔔 Reminders</h2>

        <div class="row">

          <input
            id="reminder-input"
            type="text"
            placeholder="Reminder..."
            style="flex:1"
          >

          <button
            class="button"
            onclick="addReminder()"
          >
            Add
          </button>

        </div>

        <div
          id="reminder-list"
          style="margin-top:10px"
        ></div>

      </div>
    `
  );

  renderReminders();
}

function renderReminders() {
  const list =
    document.getElementById(
      "reminder-list"
    );

  if (!list) return;

  const reminders =
    JSON.parse(
      localStorage.getItem(
        "pear-reminders"
      ) || "[]"
    );

  if (!reminders.length) {
    list.innerHTML =
      "<p>No reminders.</p>";

    return;
  }

  list.innerHTML =
    reminders.map(
      (reminder,index) => `
        <div
          class="stock"
        >

          <span>
            ${escapeHTML(
              reminder
            )}
          </span>

          <button
            class="button"
            onclick="deleteReminder(${index})"
          >
            ✓
          </button>

        </div>
      `
    ).join("");
}

function addReminder() {
  const input =
    document.getElementById(
      "reminder-input"
    );

  if (!input) return;

  const value =
    input.value.trim();

  if (!value) return;

  const reminders =
    JSON.parse(
      localStorage.getItem(
        "pear-reminders"
      ) || "[]"
    );

  reminders.push(value);

  localStorage.setItem(
    "pear-reminders",
    JSON.stringify(
      reminders
    )
  );

  input.value = "";

  hidePearKeyboard(true);

  renderReminders();
}

function deleteReminder(index) {
  const reminders =
    JSON.parse(
      localStorage.getItem(
        "pear-reminders"
      ) || "[]"
    );

  reminders.splice(
    index,
    1
  );

  localStorage.setItem(
    "pear-reminders",
    JSON.stringify(
      reminders
    )
  );

  renderReminders();
}

// ============================================================
// CONTACTS
// ============================================================

function contactsApp() {
  openApp(
    "Contacts",
    `
      <div class="card">

        <h2>👥 Contacts</h2>

        <input
          id="contact-search"
          type="text"
          placeholder="Search contacts..."
          style="width:100%"
          oninput="filterContacts()"
        >

        <div
          id="contacts-list"
          style="margin-top:10px"
        ></div>

      </div>
    `
  );

  renderContacts();
}

const pearContacts = [
  {
    name:"Pear User",
    number:"555-0101"
  },
  {
    name:"Pear Support",
    number:"555-0199"
  },
  {
    name:"SplashFace",
    number:"555-0123"
  },
  {
    name:"PearTunes",
    number:"555-0144"
  }
];

function renderContacts(filter = "") {
  const list =
    document.getElementById(
      "contacts-list"
    );

  if (!list) return;

  const filtered =
    pearContacts.filter(
      contact =>
        contact.name
          .toLowerCase()
          .includes(
            filter.toLowerCase()
          )
    );

  list.innerHTML =
    filtered.map(
      contact => `
        <div
          class="stock"
          onclick="contactSelected('${escapeHTML(contact.number)}')"
        >

          <div>
            <strong>
              ${escapeHTML(
                contact.name
              )}
            </strong>

            <br>

            <small>
              ${escapeHTML(
                contact.number
              )}
            </small>
          </div>

          <span>
            ☎
          </span>

        </div>
      `
    ).join("");
}

function filterContacts() {
  const input =
    document.getElementById(
      "contact-search"
    );

  renderContacts(
    input
      ? input.value
      : ""
  );
}

function contactSelected(number) {
  openApp(
    "Contact",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <div
          style="
            font-size:70px;
            padding:20px;
          "
        >
          👤
        </div>

        <h2>
          ${escapeHTML(number)}
        </h2>

        <button
          class="button"
          onclick="callNumberDirect('${escapeHTML(number)}')"
        >
          Call
        </button>

      </div>
    `
  );
}

function callNumberDirect(number) {
  openApp(
    "Phone",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <div class="big">
          ☎
        </div>

        <h2>
          Calling...
        </h2>

        <p>
          ${escapeHTML(number)}
        </p>

        <button
          class="button"
          onclick="closeApp()"
        >
          End Call
        </button>

      </div>
    `
  );
}

// ============================================================
// CALCULATOR EXTRA
// ============================================================

function percentageCalculatorApp() {
  openApp(
    "Percent",
    `
      <div class="card">

        <h2>％ Percentage</h2>

        <input
          id="percent-number"
          type="text"
          placeholder="Number"
          style="width:100%"
        >

        <input
          id="percent-value"
          type="text"
          placeholder="Percent"
          style="
            width:100%;
            margin-top:7px;
          "
        >

        <button
          class="button"
          onclick="calculatePercent()"
          style="margin-top:7px"
        >
          Calculate
        </button>

        <div
          id="percent-result"
          style="
            text-align:center;
            margin-top:12px;
            font-size:25px;
            font-weight:900;
          "
        ></div>

      </div>
    `
  );
}

function calculatePercent() {
  const number =
    parseFloat(
      document.getElementById(
        "percent-number"
      )?.value
    );

  const percent =
    parseFloat(
      document.getElementById(
        "percent-value"
      )?.value
    );

  const result =
    document.getElementById(
      "percent-result"
    );

  if (
    Number.isNaN(number) ||
    Number.isNaN(percent)
  ) {
    if (result) {
      result.textContent =
        "Enter both numbers.";
    }

    return;
  }

  if (result) {
    result.textContent =
      number *
      (percent / 100);
  }
}

// ============================================================
// MAP EXTRA
// ============================================================

function locationDetailsApp() {
  openApp(
    "Location",
    `
      <div class="card">

        <h2>📍 Location</h2>

        <div class="map">
          📍
        </div>

        <p>
          Pear Street
        </p>

        <p>
          Pear City
        </p>

        <button
          class="button"
          onclick="findLocation(this)"
        >
          Find My Location
        </button>

      </div>
    `
  );
}

function findLocation(button) {
  if (!navigator.geolocation) {
    button.textContent =
      "Location unavailable";

    return;
  }

  button.textContent =
    "Finding...";

  navigator.geolocation.getCurrentPosition(
    position => {
      button.textContent =
        "Location Found ✓";

      const parent =
        button.parentElement;

      if (parent) {
        parent.innerHTML += `
          <p>
            Latitude:
            ${position.coords.latitude.toFixed(4)}
          </p>

          <p>
            Longitude:
            ${position.coords.longitude.toFixed(4)}
          </p>
        `;
      }
    },
    () => {
      button.textContent =
        "Location unavailable";
    }
  );
}

// ============================================================
// RANDOM PEAR FACTS
// ============================================================

function pearFactsApp() {
  openApp(
    "Pear Facts",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <div
          style="
            font-size:80px;
            padding:15px;
          "
        >
          🍐
        </div>

        <h2>
          Pear Fact
        </h2>

        <p
          id="pear-fact"
          style="font-size:17px"
        >
          Click the button for
          a random fact.
        </p>

        <button
          class="button"
          onclick="randomPearFact()"
        >
          New Fact
        </button>

      </div>
    `
  );
}

function randomPearFact() {
  const facts = [
    "Pears are part of the rose family.",
    "Pears can be green, yellow, red, or brown.",
    "Pears ripen from the inside out.",
    "Pear trees can live for many decades.",
    "The Pear Phone is fictional but extremely cool."
  ];

  const element =
    document.getElementById(
      "pear-fact"
    );

  if (element) {
    element.textContent =
      facts[
        Math.floor(
          Math.random() *
          facts.length
        )
      ];
  }
}

// ============================================================
// SIMPLE GAMES
// ============================================================

function reactionGameApp() {
  openApp(
    "Reaction",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <h2>⚡ Reaction Test</h2>

        <p>
          Press START and wait for the
          screen to change.
        </p>

        <button
          id="reaction-button"
          class="button"
          onclick="startReactionGame()"
        >
          START
        </button>

        <div
          id="reaction-result"
          style="
            margin-top:15px;
            font-size:20px;
            font-weight:900;
          "
        ></div>

      </div>
    `
  );
}

let reactionStart = 0;
let reactionTimeout = null;

function startReactionGame() {
  const button =
    document.getElementById(
      "reaction-button"
    );

  const result =
    document.getElementById(
      "reaction-result"
    );

  if (!button || !result) return;

  button.textContent =
    "WAIT...";

  result.textContent =
    "";

  clearTimeout(
    reactionTimeout
  );

  reactionTimeout =
    setTimeout(() => {
      reactionStart =
        performance.now();

      button.textContent =
        "CLICK!";
    }, Math.random() * 3000 + 1000);

  button.onclick =
    reactionClick;
}

function reactionClick() {
  const button =
    document.getElementById(
      "reaction-button"
    );

  const result =
    document.getElementById(
      "reaction-result"
    );

  if (!button || !result) return;

  if (!reactionStart) {
    result.textContent =
      "Too early!";

    clearTimeout(
      reactionTimeout
    );

    button.textContent =
      "TRY AGAIN";

    button.onclick =
      startReactionGame;

    return;
  }

  const time =
    Math.round(
      performance.now() -
      reactionStart
    );

  result.textContent =
    `${time} ms`;

  reactionStart = 0;

  button.textContent =
    "PLAY AGAIN";

  button.onclick =
    startReactionGame;
}

// ============================================================
// END OF PART 2
// ============================================================
// ============================================================
// PART 3 — MORE PEAR PHONE APPS + INTERACTIVE FEATURES
// ============================================================

// ============================================================
// SPLASHFACE EXTRA FEATURES
// ============================================================

function splashProfileApp() {
  openApp(
    "SplashFace Profile",
    `
      <div class="card" style="text-align:center">

        <div
          style="
            width:85px;
            height:85px;
            margin:auto;
            border-radius:50%;
            background:linear-gradient(135deg,#63c5ff,#8b6cff);
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:42px;
          "
        >
          😎
        </div>

        <h2>Pear User</h2>

        <p>
          Pear Phone user since today 🍐
        </p>

        <div
          style="
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:5px;
            margin-top:15px;
          "
        >

          <div class="stock">
            <strong>12</strong>
            <small>Posts</small>
          </div>

          <div class="stock">
            <strong>48</strong>
            <small>Friends</small>
          </div>

          <div class="stock">
            <strong>126</strong>
            <small>Likes</small>
          </div>

        </div>

        <button
          class="button"
          onclick="editSplashProfile()"
          style="margin-top:10px"
        >
          Edit Profile
        </button>

      </div>
    `
  );
}

function editSplashProfile() {
  openApp(
    "Edit Profile",
    `
      <div class="card">

        <h2>✏️ Edit Profile</h2>

        <label>
          Display Name
        </label>

        <input
          id="profile-name"
          type="text"
          value="Pear User"
          style="width:100%;margin-top:5px"
        >

        <label
          style="display:block;margin-top:10px"
        >
          Bio
        </label>

        <textarea
          id="profile-bio"
          placeholder="Write your bio..."
        >Pear Phone user 🍐</textarea>

        <button
          class="button"
          onclick="saveSplashProfile()"
          style="margin-top:8px"
        >
          Save Profile
        </button>

      </div>
    `
  );
}

function saveSplashProfile() {
  const name =
    document.getElementById(
      "profile-name"
    );

  const bio =
    document.getElementById(
      "profile-bio"
    );

  if (!name || !bio) return;

  localStorage.setItem(
    "pear-profile-name",
    name.value
  );

  localStorage.setItem(
    "pear-profile-bio",
    bio.value
  );

  hidePearKeyboard(true);

  openApp(
    "SplashFace Profile",
    `
      <div class="card" style="text-align:center">

        <div
          style="
            width:85px;
            height:85px;
            margin:auto;
            border-radius:50%;
            background:linear-gradient(135deg,#63c5ff,#8b6cff);
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:42px;
          "
        >
          😎
        </div>

        <h2>
          ${escapeHTML(name.value || "Pear User")}
        </h2>

        <p>
          ${escapeHTML(bio.value || "")}
        </p>

        <button
          class="button"
          onclick="editSplashProfile()"
        >
          Edit Profile
        </button>

      </div>
    `
  );
}

// ============================================================
// PHOTO STUDIO
// ============================================================

function photoStudioApp() {
  openApp(
    "Photo Studio",
    `
      <div class="card">

        <h2>🎨 Photo Studio</h2>

        <input
          type="file"
          accept="image/png"
          onchange="openStudioPhoto(event)"
        >

        <div
          id="studio-preview"
          style="margin-top:10px"
        >
          <p>
            Choose a PNG image to begin.
          </p>
        </div>

        <div
          id="studio-controls"
          style="display:none;margin-top:10px"
        >

          <button
            class="button"
            onclick="studioRotate()"
          >
            Rotate
          </button>

          <button
            class="button"
            onclick="studioZoomIn()"
          >
            Zoom +
          </button>

          <button
            class="button"
            onclick="studioZoomOut()"
          >
            Zoom −
          </button>

          <button
            class="button"
            onclick="studioReset()"
          >
            Reset
          </button>

        </div>

      </div>
    `
  );
}

let studioRotation = 0;
let studioScale = 1;

function openStudioPhoto(event) {
  const file =
    event.target.files?.[0];

  if (!file) return;

  if (file.type !== "image/png") {
    alert("Please choose a PNG image.");
    event.target.value = "";
    return;
  }

  const preview =
    document.getElementById(
      "studio-preview"
    );

  const controls =
    document.getElementById(
      "studio-controls"
    );

  if (!preview) return;

  studioRotation = 0;
  studioScale = 1;

  preview.innerHTML = `
    <img
      id="studio-edit-image"
      src="${URL.createObjectURL(file)}"
      style="
        width:100%;
        border-radius:12px;
        transform-origin:center;
      "
    >
  `;

  if (controls) {
    controls.style.display = "block";
  }
}

function updateStudioImage() {
  const image =
    document.getElementById(
      "studio-edit-image"
    );

  if (!image) return;

  image.style.transform =
    `rotate(${studioRotation}deg)
     scale(${studioScale})`;
}

function studioRotate() {
  studioRotation =
    (studioRotation + 90) % 360;

  updateStudioImage();
}

function studioZoomIn() {
  studioScale =
    Math.min(
      studioScale + 0.1,
      2
    );

  updateStudioImage();
}

function studioZoomOut() {
  studioScale =
    Math.max(
      studioScale - 0.1,
      0.5
    );

  updateStudioImage();
}

function studioReset() {
  studioRotation = 0;
  studioScale = 1;

  updateStudioImage();
}

// ============================================================
// STOPWATCH
// ============================================================

let stopwatchTimer = null;
let stopwatchTime = 0;

function stopwatchApp() {
  openApp(
    "Stopwatch",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <h2>⏱ Stopwatch</h2>

        <div
          id="stopwatch-display"
          style="
            font-size:46px;
            font-weight:900;
            padding:20px;
          "
        >
          00:00.0
        </div>

        <button
          class="button"
          onclick="toggleStopwatch()"
          id="stopwatch-toggle"
        >
          Start
        </button>

        <button
          class="button"
          onclick="resetStopwatch()"
        >
          Reset
        </button>

      </div>
    `
  );

  updateStopwatchDisplay();
}

function toggleStopwatch() {
  const button =
    document.getElementById(
      "stopwatch-toggle"
    );

  if (stopwatchTimer) {
    clearInterval(
      stopwatchTimer
    );

    stopwatchTimer = null;

    if (button) {
      button.textContent =
        "Resume";
    }

    return;
  }

  stopwatchTimer =
    setInterval(() => {
      stopwatchTime += 100;

      updateStopwatchDisplay();
    },100);

  if (button) {
    button.textContent =
      "Pause";
  }
}

function updateStopwatchDisplay() {
  const display =
    document.getElementById(
      "stopwatch-display"
    );

  if (!display) return;

  const minutes =
    Math.floor(
      stopwatchTime / 60000
    );

  const seconds =
    Math.floor(
      (stopwatchTime % 60000) /
      1000
    );

  const tenths =
    Math.floor(
      (stopwatchTime % 1000) /
      100
    );

  display.textContent =
    `${String(minutes).padStart(2,"0")}:` +
    `${String(seconds).padStart(2,"0")}.` +
    `${tenths}`;
}

function resetStopwatch() {
  clearInterval(
    stopwatchTimer
  );

  stopwatchTimer = null;
  stopwatchTime = 0;

  updateStopwatchDisplay();

  const button =
    document.getElementById(
      "stopwatch-toggle"
    );

  if (button) {
    button.textContent =
      "Start";
  }
}

// ============================================================
// TO-DO LIST
// ============================================================

function todoApp() {
  openApp(
    "To-Do",
    `
      <div class="card">

        <h2>✅ To-Do</h2>

        <div class="row">

          <input
            id="todo-input"
            type="text"
            placeholder="Add a task..."
            style="flex:1"
          >

          <button
            class="button"
            onclick="addTodo()"
          >
            Add
          </button>

        </div>

        <div
          id="todo-list"
          style="margin-top:10px"
        ></div>

      </div>
    `
  );

  renderTodos();
}

function renderTodos() {
  const list =
    document.getElementById(
      "todo-list"
    );

  if (!list) return;

  const todos =
    JSON.parse(
      localStorage.getItem(
        "pear-todos"
      ) || "[]"
    );

  if (!todos.length) {
    list.innerHTML =
      "<p>No tasks yet.</p>";
    return;
  }

  list.innerHTML =
    todos.map(
      (todo,index) => `
        <div
          class="stock"
          style="
            ${
              todo.done
                ? "opacity:.55;text-decoration:line-through;"
                : ""
            }
          "
        >

          <span
            onclick="toggleTodo(${index})"
            style="cursor:pointer"
          >
            ${escapeHTML(todo.text)}
          </span>

          <button
            class="button"
            onclick="deleteTodo(${index})"
          >
            ×
          </button>

        </div>
      `
    ).join("");
}

function addTodo() {
  const input =
    document.getElementById(
      "todo-input"
    );

  if (!input) return;

  const text =
    input.value.trim();

  if (!text) return;

  const todos =
    JSON.parse(
      localStorage.getItem(
        "pear-todos"
      ) || "[]"
    );

  todos.push({
    text:text,
    done:false
  });

  localStorage.setItem(
    "pear-todos",
    JSON.stringify(todos)
  );

  input.value = "";

  hidePearKeyboard(true);

  renderTodos();
}

function toggleTodo(index) {
  const todos =
    JSON.parse(
      localStorage.getItem(
        "pear-todos"
      ) || "[]"
    );

  if (!todos[index]) return;

  todos[index].done =
    !todos[index].done;

  localStorage.setItem(
    "pear-todos",
    JSON.stringify(todos)
  );

  renderTodos();
}

function deleteTodo(index) {
  const todos =
    JSON.parse(
      localStorage.getItem(
        "pear-todos"
      ) || "[]"
    );

  todos.splice(
    index,
    1
  );

  localStorage.setItem(
    "pear-todos",
    JSON.stringify(todos)
  );

  renderTodos();
}

// ============================================================
// TIMER
// ============================================================

let timerInterval = null;
let timerSeconds = 0;

function timerApp() {
  openApp(
    "Timer",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <h2>⏲ Timer</h2>

        <input
          id="timer-minutes"
          type="text"
          placeholder="Minutes"
          style="
            width:100%;
            text-align:center;
          "
        >

        <div
          id="timer-display"
          style="
            font-size:48px;
            font-weight:900;
            padding:20px;
          "
        >
          00:00
        </div>

        <button
          class="button"
          onclick="startTimer()"
        >
          Start
        </button>

        <button
          class="button"
          onclick="resetTimer()"
        >
          Reset
        </button>

      </div>
    `
  );
}

function startTimer() {
  const input =
    document.getElementById(
      "timer-minutes"
    );

  const display =
    document.getElementById(
      "timer-display"
    );

  if (!input || !display) return;

  const minutes =
    parseInt(
      input.value,
      10
    );

  if (
    Number.isNaN(minutes) ||
    minutes <= 0
  ) {
    display.textContent =
      "Enter minutes";
    return;
  }

  clearInterval(
    timerInterval
  );

  timerSeconds =
    minutes * 60;

  updateTimerDisplay();

  timerInterval =
    setInterval(() => {
      timerSeconds--;

      updateTimerDisplay();

      if (timerSeconds <= 0) {
        clearInterval(
          timerInterval
        );

        timerInterval = null;

        display.textContent =
          "DONE! 🔔";
      }
    },1000);
}

function updateTimerDisplay() {
  const display =
    document.getElementById(
      "timer-display"
    );

  if (!display) return;

  const minutes =
    Math.floor(
      timerSeconds / 60
    );

  const seconds =
    timerSeconds % 60;

  display.textContent =
    `${String(minutes).padStart(2,"0")}:` +
    `${String(seconds).padStart(2,"0")}`;
}

function resetTimer() {
  clearInterval(
    timerInterval
  );

  timerInterval = null;
  timerSeconds = 0;

  updateTimerDisplay();
}

// ============================================================
// RANDOM NUMBER GENERATOR
// ============================================================

function randomNumberApp() {
  openApp(
    "Random",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <h2>🎲 Random Number</h2>

        <input
          id="random-min"
          type="text"
          placeholder="Minimum"
          style="width:100%"
        >

        <input
          id="random-max"
          type="text"
          placeholder="Maximum"
          style="
            width:100%;
            margin-top:7px;
          "
        >

        <div
          id="random-result"
          style="
            font-size:48px;
            font-weight:900;
            padding:20px;
          "
        >
          ?
        </div>

        <button
          class="button"
          onclick="generateRandomNumber()"
        >
          Generate
        </button>

      </div>
    `
  );
}

function generateRandomNumber() {
  const min =
    parseInt(
      document.getElementById(
        "random-min"
      )?.value,
      10
    );

  const max =
    parseInt(
      document.getElementById(
        "random-max"
      )?.value,
      10
    );

  const result =
    document.getElementById(
      "random-result"
    );

  if (!result) return;

  if (
    Number.isNaN(min) ||
    Number.isNaN(max) ||
    min > max
  ) {
    result.textContent =
      "?";
    return;
  }

  result.textContent =
    Math.floor(
      Math.random() *
      (max - min + 1)
    ) + min;
}

// ============================================================
// COIN FLIP
// ============================================================

function coinFlipApp() {
  openApp(
    "Coin Flip",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <h2>🪙 Coin Flip</h2>

        <div
          id="coin"
          style="
            font-size:100px;
            padding:20px;
          "
        >
          🪙
        </div>

        <div
          id="coin-result"
          style="
            font-size:24px;
            font-weight:900;
          "
        >
          Tap Flip
        </div>

        <button
          class="button"
          onclick="flipCoin()"
        >
          Flip
        </button>

      </div>
    `
  );
}

function flipCoin() {
  const coin =
    document.getElementById(
      "coin"
    );

  const result =
    document.getElementById(
      "coin-result"
    );

  if (!coin || !result) return;

  coin.textContent =
    "🔄";

  setTimeout(() => {
    const heads =
      Math.random() < 0.5;

    coin.textContent =
      heads ? "🙂" : "🪙";

    result.textContent =
      heads
        ? "Heads!"
        : "Tails!";
  },500);
}

// ============================================================
// DICE ROLL
// ============================================================

function diceApp() {
  openApp(
    "Dice",
    `
      <div
        class="card"
        style="text-align:center"
      >

        <h2>🎲 Dice</h2>

        <div
          id="dice-result"
          style="
            font-size:100px;
            padding:20px;
          "
        >
          🎲
        </div>

        <button
          class="button"
          onclick="rollDice()"
        >
          Roll Dice
        </button>

      </div>
    `
  );
}

function rollDice() {
  const result =
    document.getElementById(
      "dice-result"
    );

  if (!result) return;

  const faces = [
    "⚀",
    "⚁",
    "⚂",
    "⚃",
    "⚄",
    "⚅"
  ];

  result.textContent =
    faces[
      Math.floor(
        Math.random() * 6
      )
    ];
}

// ============================================================
// COLOR PICKER
// ============================================================

function colorPickerApp() {
  openApp(
    "Color Picker",
    `
      <div class="card">

        <h2>🎨 Color Picker</h2>

        <input
          id="color-input"
          type="color"
          value="#8bc34a"
          style="
            width:100%;
            height:70px;
          "
          oninput="updateColorPreview()"
        >

        <div
          id="color-preview"
          style="
            height:130px;
            border-radius:15px;
            background:#8bc34a;
            margin-top:10px;
          "
        ></div>

        <div
          id="color-value"
          style="
            text-align:center;
            font-weight:900;
            margin-top:10px;
          "
        >
          #8BC34A
        </div>

      </div>
    `
  );
}

function updateColorPreview() {
  const input =
    document.getElementById(
      "color-input"
    );

  const preview =
    document.getElementById(
      "color-preview"
    );

  const value =
    document.getElementById(
      "color-value"
    );

  if (!input) return;

  if (preview) {
    preview.style.background =
      input.value;
  }

  if (value) {
    value.textContent =
      input.value.toUpperCase();
  }
}

// ============================================================
// TEXT COUNTER
// ============================================================

function textCounterApp() {
  openApp(
    "Text Counter",
    `
      <div class="card">

        <h2>🔢 Text Counter</h2>

        <textarea
          id="counter-text"
          placeholder="Type something..."
          oninput="updateTextCounter()"
        ></textarea>

        <div
          class="stock"
          style="margin-top:8px"
        >
          <span>
            Characters
          </span>

          <strong id="character-count">
            0
          </strong>
        </div>

        <div class="stock">
          <span>
            Words
          </span>

          <strong id="word-count">
            0
          </strong>
        </div>

      </div>
    `
  );
}

function updateTextCounter() {
  const input =
    document.getElementById(
      "counter-text"
    );

  if (!input) return;

  const text =
    input.value;

  const characters =
    document.getElementById(
      "character-count"
    );

  const words =
    document.getElementById(
      "word-count"
    );

  if (characters) {
    characters.textContent =
      text.length;
  }

  if (words) {
    const trimmed =
      text.trim();

    words.textContent =
      trimmed
        ? trimmed.split(/\s+/).length
        : 0;
  }
}

// ============================================================
// END OF PART 3
// ============================================================
// ============================================================
// PART 4 — FINAL APP CONNECTIONS + INITIALIZATION
// ============================================================

// ============================================================
// EXTRA APP CONNECTIONS
// ============================================================

function connectExtraApps() {
  const connections = {

    // Optional Page 1 extras
    "calculator": calculatorApp,
    "calendar": calendarApp,
    "reminders": remindersApp,
    "contacts": contactsApp,
    "percent": percentageCalculatorApp,
    "location": locationDetailsApp,
    "facts": pearFactsApp,
    "reaction": reactionGameApp,
    "stopwatch": stopwatchApp,
    "todo": todoApp,
    "timer": timerApp,
    "random": randomNumberApp,
    "coin": coinFlipApp,
    "dice": diceApp,
    "colors": colorPickerApp,
    "counter": textCounterApp,

    // Extra music
    "music-player": musicPlayerApp,

    // Extra SplashFace
    "splash-profile": splashProfileApp,

    // Extra image tools
    "photo-studio": photoStudioApp,

    // Keyboard demo
    "keyboard": keyboardDemo,

    // Typing game
    "typing": startTypingGame
  };

  Object.keys(connections).forEach(id => {

    const button =
      document.getElementById(id);

    if (!button) return;

    button.addEventListener(
      "pointerup",
      e => {

        e.preventDefault();
        e.stopPropagation();

        connections[id]();
      }
    );

  });
}

// ============================================================
// DATA-APP CONNECTIONS
// ============================================================

function connectDataAppButtons() {

  document.querySelectorAll(
    "[data-app]"
  ).forEach(button => {

    // Prevent duplicate listeners
    if (
      button.dataset.pearConnected === "true"
    ) {
      return;
    }

    button.dataset.pearConnected =
      "true";

    button.addEventListener(
      "pointerup",
      e => {

        e.preventDefault();
        e.stopPropagation();

        const app =
          button.dataset.app;

        if (!app) return;

        switch (app) {

          case "messages":
            messagesApp();
            break;

          case "camera":
            cameraApp();
            break;

          case "photos":
            photosApp();
            break;

          case "weather":
            weatherApp();
            break;

          case "maps":
            mapsApp();
            break;

          case "notes":
            notesApp();
            break;

          case "stocks":
            stocksApp();
            break;

          case "clock":
            clockApp();
            break;

          case "settings":
            settingsApp();
            break;

          case "phone":
            phoneApp();
            break;

          case "mail":
            mailApp();
            break;

          case "compass":
            compassApp();
            break;

          case "music":
          case "peartunes":
            pearTunesApp();
            break;

          case "videos":
            videosApp();
            break;

          case "splashface":
            splashfaceApp();
            break;

          case "lingo":
            lingoApp();
            break;

          case "tums":
            tumsApp();
            break;

          case "danwarp":
            danwarpApp();
            break;

          case "image":
            imageApp();
            break;

          case "chrono":
            chronoApp();
            break;

          case "zaplook":
            zaplookApp();
            break;

          case "monkey":
            monkeyApp();
            break;

          case "remark":
            remarkApp();
            break;

          case "calculator":
            calculatorApp();
            break;

          case "calendar":
            calendarApp();
            break;

          case "reminders":
            remindersApp();
            break;

          case "contacts":
            contactsApp();
            break;

          case "stopwatch":
            stopwatchApp();
            break;

          case "todo":
            todoApp();
            break;

          case "timer":
            timerApp();
            break;

          case "random":
            randomNumberApp();
            break;

          case "coin":
            coinFlipApp();
            break;

          case "dice":
            diceApp();
            break;

          case "colors":
            colorPickerApp();
            break;

          case "counter":
            textCounterApp();
            break;

          case "keyboard":
            keyboardDemo();
            break;

          case "typing":
            startTypingGame();
            break;

          default:
            openApp(
              "Pear OS",
              `
                <div
                  class="card"
                  style="text-align:center"
                >
                  <h2>🍐 Pear OS</h2>

                  <p>
                    ${escapeHTML(app)}
                    opened.
                  </p>
                </div>
              `
            );
        }
      }
    );
  });
}

// ============================================================
// BACK BUTTON SAFETY
// ============================================================

document.addEventListener(
  "pointerup",
  e => {

    const back =
      e.target.closest(
        ".back-button"
      );

    if (!back) return;

    e.preventDefault();
    e.stopPropagation();

    closeApp();
  },
  true
);

// ============================================================
// HOME BUTTON — FINAL SAFETY HANDLER
// ============================================================

const physicalHome =
  document.getElementById("home");

if (physicalHome) {

  const pressHome = e => {

    e.preventDefault();
    e.stopImmediatePropagation();

    hidePearKeyboard(true);

    closeApp();

  };

  physicalHome.addEventListener(
    "pointerdown",
    pressHome,
    {
      capture:true
    }
  );

  physicalHome.addEventListener(
    "touchstart",
    pressHome,
    {
      capture:true,
      passive:false
    }
  );

  physicalHome.addEventListener(
    "click",
    pressHome,
    true
  );
}

// ============================================================
// PREVENT APP WINDOW TOUCHES FROM BECOMING PAGE SWIPES
// ============================================================

if (overlay) {

  overlay.addEventListener(
    "touchstart",
    e => {
      e.stopPropagation();
    },
    {
      passive:true
    }
  );

  overlay.addEventListener(
    "touchend",
    e => {
      e.stopPropagation();
    },
    {
      passive:true
    }
  );

  overlay.addEventListener(
    "mousedown",
    e => {
      e.stopPropagation();
    }
  );

  overlay.addEventListener(
    "mouseup",
    e => {
      e.stopPropagation();
    }
  );
}

// ============================================================
// PREVENT KEYBOARD TOUCHES FROM PAGE SWIPES
// ============================================================

document.addEventListener(
  "touchstart",
  e => {

    const keyboard =
      e.target.closest(
        "#pear-keyboard"
      );

    if (keyboard) {
      e.stopPropagation();
    }

  },
  {
    capture:true,
    passive:true
  }
);

document.addEventListener(
  "touchend",
  e => {

    const keyboard =
      e.target.closest(
        "#pear-keyboard"
      );

    if (keyboard) {
      e.stopPropagation();
    }

  },
  {
    capture:true,
    passive:true
  }
);

// ============================================================
// STOP PAGE SWITCHING WHEN DRAGGING INSIDE APP
// ============================================================

if (appWindow) {

  appWindow.addEventListener(
    "pointerdown",
    e => {
      e.stopPropagation();
    },
    true
  );

  appWindow.addEventListener(
    "pointerup",
    e => {
      e.stopPropagation();
    },
    true
  );

}

// ============================================================
// INITIAL PAGE STATE
// ============================================================

function initializePearPhone() {

  currentPage = 1;

  if (phone) {

    phone.classList.remove(
      "page-two",
      "page-switch-up",
      "page-switch-down"
    );

  }

  if (pageDots) {
    pageDots.textContent =
      "● ○";
  }

  hidePearKeyboard(true);

}

// ============================================================
// CLEANUP WHEN LEAVING THE PAGE
// ============================================================

window.addEventListener(
  "beforeunload",
  () => {

    stopCamera();

    clearInterval(
      clockTimer
    );

    clearInterval(
      chronoTimer
    );

    clearInterval(
      stopwatchTimer
    );

    clearInterval(
      timerInterval
    );

    clearInterval(
      musicProgressTimer
    );

    clearTimeout(
      reactionTimeout
    );

    stopTypingGame();

  }
);

// ============================================================
// CONNECT EVERYTHING
// ============================================================

connectPage1Apps();

connectPage2Apps();

connectExtraApps();

connectDataAppButtons();

initializePearPhone();

// ============================================================
// FINAL CONSOLE MESSAGE
// ============================================================

console.log(
  "🍐 Pear Phone OS loaded successfully."
);

console.log(
  "Page 1 apps connected."
);

console.log(
  "Page 2 apps connected."
);

console.log(
  "Swipe UP = Page 2."
);

console.log(
  "Swipe DOWN = Page 1."
);

console.log(
  "Home button connected."
);

// ============================================================
// END OF PEAR PHONE OS
// ============================================================
