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

phone.addEventListener(
  "touchstart",
  e => {

    if (
      overlay.classList.contains("open")
    ) return;

    const t = e.touches[0];

    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchMoved = false;

  },
  { passive: true }
);

phone.addEventListener(
  "touchmove",
  e => {

    if (
      overlay.classList.contains("open")
    ) return;

    const t = e.touches[0];

    const dx =
      t.clientX - touchStartX;

    const dy =
      t.clientY - touchStartY;

    if (
      Math.abs(dy) > 30 &&
      Math.abs(dy) > Math.abs(dx)
    ) {

      touchMoved = true;

    }

  },
  { passive: true }
);

phone.addEventListener(
  "touchend",
  e => {

    if (
      overlay.classList.contains("open") ||
      !touchMoved ||
      swipeLocked
    ) return;

    const t =
      e.changedTouches[0];

    const dx =
      t.clientX - touchStartX;

    const dy =
      t.clientY - touchStartY;

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

  },
  { passive: true }
);

phone.addEventListener(
  "mousedown",
  e => {

    if (
      overlay.classList.contains("open")
    ) return;

    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    mouseDragging = true;

  }
);

phone.addEventListener(
  "mouseup",
  e => {

    if (!mouseDragging) return;

    mouseDragging = false;

    if (
      overlay.classList.contains("open")
    ) return;

    const dx =
      e.clientX - mouseStartX;

    const dy =
      e.clientY - mouseStartY;

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

  }
);

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
let activeKeyboardField = null;

function addKeyboardSupport() {

  setTimeout(() => {

    const fields =
      appWindow.querySelectorAll(
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
        () => {

          activeKeyboardField = field;

          try {

            field.focus({
              preventScroll: true
            });

          } catch (error) {

            field.focus();

          }

          showPearKeyboard(field);

        }
      );

    });

  }, 50);

}

function showPearKeyboard(input) {

  if (!input) return;

  activeKeyboardField = input;

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

        ${
          "QWERTYUIOP"
            .split("")
            .map(k =>
              `
                <button
                  type="button"
                  onclick="keyboardKey('${k}')"
                >
                  ${k}
                </button>
              `
            )
            .join("")
        }

      </div>

      <div class="pear-keyboard-row">

        ${
          "ASDFGHJKL"
            .split("")
            .map(k =>
              `
                <button
                  type="button"
                  onclick="keyboardKey('${k}')"
                >
                  ${k}
                </button>
              `
            )
            .join("")
        }

      </div>

      <div class="pear-keyboard-row">

        <button
          type="button"
          onclick="keyboardShiftKey()"
        >
          ⇧
        </button>

        ${
          "ZXCVBNM"
            .split("")
            .map(k =>
              `
                <button
                  type="button"
                  onclick="keyboardKey('${k}')"
                >
                  ${k}
                </button>
              `
            )
            .join("")
        }

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

    keyboard.addEventListener(
      "pointerdown",
      e => {

        e.preventDefault();

        if (
          activeKeyboardField &&
          document.body.contains(
            activeKeyboardField
          )
        ) {

          try {

            activeKeyboardField.focus({
              preventScroll: true
            });

          } catch (error) {

            activeKeyboardField.focus();

          }

        }

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
      { passive: false }
    );

  }

  keyboard.style.display = "grid";

  setTimeout(() => {

    keyboard.classList.add(
      "keyboard-show"
    );

  }, 10);

}

function hidePearKeyboard(
  immediate = false
) {

  activeKeyboardField = null;

  const keyboard =
    document.getElementById(
      "pear-keyboard"
    );

  if (!keyboard) {

    keyboardVisible = false;
    return;

  }

  keyboard.classList.remove(
    "keyboard-show"
  );

  keyboardVisible = false;

  if (immediate) {

    keyboard.style.display = "none";
    return;

  }

  setTimeout(() => {

    if (!keyboardVisible) {

      keyboard.style.display =
        "none";

    }

  }, 250);

}

function getFocusedField() {

  if (

    activeKeyboardField &&

    document.body.contains(
      activeKeyboardField
    ) &&

    (
      activeKeyboardField.tagName ===
        "INPUT" ||

      activeKeyboardField.tagName ===
        "TEXTAREA"
    )

  ) {

    return activeKeyboardField;

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

    activeKeyboardField = active;

    return active;

  }

  return null;

}

function insertText(
  field,
  text
) {

  if (
    !field ||
    !document.body.contains(field)
  ) return;

  activeKeyboardField = field;

  const start =
    typeof field.selectionStart ===
      "number"

      ? field.selectionStart

      : field.value.length;

  const end =
    typeof field.selectionEnd ===
      "number"

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

  const cursor =
    start + text.length;

  try {

    field.setSelectionRange(
      cursor,
      cursor
    );

  } catch (error) {}

  field.dispatchEvent(
    new Event(
      "input",
      {
        bubbles: true
      }
    )
  );

  field.dispatchEvent(
    new Event(
      "change",
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

  insertText(
    field,
    keyboardShift
      ? key.toUpperCase()
      : key.toLowerCase()
  );

  keyboardShift = false;

}

function keyboardSpace() {

  const field =
    getFocusedField();

  if (field) {

    insertText(
      field,
      " "
    );

  }

}

function keyboardEnter() {

  const field =
    getFocusedField();

  if (!field) return;

  if (
    field.tagName ===
    "TEXTAREA"
  ) {

    insertText(
      field,
      "\n"
    );

  } else {

    field.dispatchEvent(
      new KeyboardEvent(
        "keydown",
        {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true
        }
      )
    );

  }

}

function keyboardBackspace() {

  const field =
    getFocusedField();

  if (!field) return;

  const start =
    typeof field.selectionStart ===
      "number"

      ? field.selectionStart

      : field.value.length;

  const end =
    typeof field.selectionEnd ===
      "number"

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

      field.setSelectionRange(
        start,
        start
      );

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

      field.setSelectionRange(
        start - 1,
        start - 1
      );

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

  field.dispatchEvent(
    new Event(
      "change",
      {
        bubbles: true
      }
    )
  );

}

function keyboardShiftKey() {

  keyboardShift =
    !keyboardShift;

}

function keyboardNumber() {

  const field =
    getFocusedField();

  if (!field) return;

  insertText(
    field,
    "1234567890"
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

        <h2>
          💬 Messages
        </h2>

        <div id="contact-list">

          ${
            Object.keys(
              messageContacts
            )
              .map(name =>
                `
                  <button
                    onclick="openChat('${name}')"
                  >
                    💬 ${name}
                  </button>
                `
              )
              .join("")
          }

        </div>

        <button
          onclick="newMessage()"
        >
          ✏️ New Message
        </button>

        <button
          onclick="alert('3 unread messages')"
        >
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

          ${
            messages
              .slice(0, 2)
              .map(msg =>
                `
                  <div
                    class="message received"
                  >
                    ${escapeHTML(msg)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          id="message-input"
          placeholder="Message..."
        >

        <button
          onclick="sendMessage('${name}')"
        >
          Send
        </button>

        <button
          onclick="randomReply('${name}')"
        >
          🤖 Random Reply
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

  const chat =
    document.getElementById(
      "chat-box"
    );

  if (
    !input ||
    !chat ||
    !input.value.trim()
  ) return;

  chat.innerHTML += `

    <div
      class="message sent"
    >
      ${escapeHTML(input.value)}
    </div>

  `;

  input.value = "";

  setTimeout(
    () => randomReply(name),
    600
  );

}

function randomReply(name) {

  const chat =
    document.getElementById(
      "chat-box"
    );

  if (!chat) return;

  const replies =
    messageContacts[name] ||
    ["Okay!"];

  const reply =
    replies[
      Math.floor(
        Math.random() *
        replies.length
      )
    ];

  chat.innerHTML += `

    <div
      class="message received"
    >
      ${escapeHTML(reply)}
    </div>

  `;

}

function newMessage() {

  openApp(
    "New Message",
    `

      <div class="card">

        <input
          id="new-contact"
          placeholder="Contact"
        >

        <textarea
          id="new-message"
          placeholder="Message..."
        ></textarea>

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
let cameraFacing = "user";

function cameraApp() {

  openApp(
    "Camera",
    `

      <div
        class="card camera-box"
      >

        <video
          id="camera-video"
          autoplay
          playsinline
        ></video>

        <button
          onclick="startCamera()"
        >
          📷 Start Camera
        </button>

        <button
          onclick="capturePhoto()"
        >
          ⭕ Take Photo
        </button>

        <button
          onclick="flipCamera()"
        >
          🔄 Flip Camera
        </button>

        <div
          id="camera-photo"
        ></div>

        <canvas
          id="camera-canvas"
        ></canvas>

      </div>

    `
  );

  startCamera();

}

async function startCamera() {

  try {

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      alert(
        "Camera access requires a browser with camera support and HTTPS (or localhost)."
      );

      return;

    }

    stopCamera();

    const video =
      document.getElementById(
        "camera-video"
      );

    if (!video) return;

    cameraStream =
      await navigator.mediaDevices.getUserMedia({

        video: {

          width: {
            ideal: 1280
          },

          height: {
            ideal: 720
          },

          facingMode:
            cameraFacing

        },

        audio: false

      });

    video.srcObject =
      cameraStream;

    await video.play()
      .catch(() => {});

    try {

      const devices =
        await navigator.mediaDevices
          .enumerateDevices();

      const cameras =
        devices.filter(
          device =>
            device.kind ===
            "videoinput"
        );

      const currentTrack =
        cameraStream
          .getVideoTracks()[0];

      const currentDeviceId =
        currentTrack
          ?.getSettings
          ?.()
          .deviceId || "";

      const freenove =
        cameras.find(
          device =>
            /freenove/i.test(
              device.label
            )
        ) ||

        cameras.find(
          device =>
            /usb|webcam|camera/i.test(
              device.label
            )
        );

      if (
        freenove &&
        freenove.deviceId &&
        freenove.deviceId !==
          currentDeviceId
      ) {

        currentTrack?.stop();

        cameraStream =
          await navigator.mediaDevices
            .getUserMedia({

              video: {

                deviceId: {
                  exact:
                    freenove.deviceId
                },

                width: {
                  ideal: 1280
                },

                height: {
                  ideal: 720
                }

              },

              audio: false

            });

        video.srcObject =
          cameraStream;

        await video.play()
          .catch(() => {});

      }

    } catch (deviceError) {

      console.warn(
        "Could not select the named USB/Freenove camera; using the active camera instead.",
        deviceError
      );

    }

  } catch (error) {

    console.error(
      "Pear Phone camera error:",
      error
    );

    alert(
      "Camera access was not available. Make sure the Freenove camera is connected, allowed in the browser, and the site is running over HTTPS or localhost."
    );

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
    document.getElementById(
      "camera-video"
    );

  const canvas =
    document.getElementById(
      "camera-canvas"
    );

  const preview =
    document.getElementById(
      "camera-photo"
    );

  if (
    !video ||
    !canvas ||
    !preview
  ) return;

  canvas.width =
    video.videoWidth ||
    640;

  canvas.height =
    video.videoHeight ||
    480;

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
      style="
        width:100%;
        border-radius:12px
      "
    >

  `;

}

function stopCamera() {

  if (!cameraStream) return;

  cameraStream
    .getTracks()
    .forEach(track => {

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
    text:
      "Living my best Pear Phone life 🍐📱",
    likes: 24,
    comments: []
  },

  {
    user: "sam",
    text:
      "This phone is actually insane 😂",
    likes: 12,
    comments: []
  },

  {
    user: "chloe",
    text:
      "New post!!! ✨",
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

        <h2>
          👤 SplashFace
        </h2>

        <p>
          Followers: 248
        </p>

        <button
          onclick="newPost()"
        >
          ➕ New Post
        </button>

        <button
          onclick="shuffleSplash()"
        >
          🔀 Discover
        </button>

        <div id="splash-feed">

          ${
            splashPosts
              .map(
                (post, index) => `

                  <div class="post">

                    <strong>
                      @${escapeHTML(
                        post.user
                      )}
                    </strong>

                    <p>
                      ${escapeHTML(
                        post.text
                      )}
                    </p>

                    <button
                      onclick="likeSplash(${index})"
                    >
                      ❤️ ${post.likes}
                    </button>

                    <button
                      onclick="commentSplash(${index})"
                    >
                      💬 ${
                        post.comments.length
                      }
                    </button>

                    ${
                      post.comments.length
                        ? `

                          <div>

                            ${
                              post.comments
                                .map(
                                  c =>
                                    `
                                      <small>
                                        💬 ${escapeHTML(c)}
                                      </small>
                                      <br>
                                    `
                                )
                                .join("")
                            }

                          </div>

                        `
                        : ""
                    }

                  </div>

                `
              )
              .join("")
          }

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
    prompt(
      "Write a comment:"
    );

  if (!comment) return;

  splashPosts[
    index
  ].comments.push(comment);

  renderSplashface();

}

function newPost() {

  const text =
    prompt(
      "What's on your mind?"
    );

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
      () =>
        Math.random() - 0.5
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
    Object.keys(
      stockData
    )
      .map(
        symbol => `

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

        `
      )
      .join("");

  openApp(
    "Stocks",
    `

      <div class="card">

        <h2>
          📈 Stocks
        </h2>

        <h3>
          Cash:
          $${portfolio.cash.toFixed(2)}
        </h3>

        ${rows}

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

        <button
          onclick="showPortfolio()"
        >
          💼 Portfolio
        </button>

      </div>

    `
  );

}

function refreshStocks() {

  Object.keys(
    stockData
  ).forEach(symbol => {

    stockData[symbol] +=
      (Math.random() - 0.5) * 15;

    if (
      stockData[symbol] < 1
    ) {

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

        <h2>
          ${symbol}
        </h2>

        <h1>
          $${stockData[
            symbol
          ].toFixed(2)}
        </h1>

        <button
          onclick="buyStock('${symbol}')"
        >
          Buy 1
        </button>

        <button
          onclick="sellStock('${symbol}')"
        >
          Sell 1
        </button>

        <button
          onclick="stocksApp()"
        >
          ← Back
        </button>

      </div>

    `
  );

}

function buyStock(symbol) {

  const price =
    stockData[symbol];

  if (
    portfolio.cash <
    price
  ) {

    alert(
      "Not enough cash."
    );

    return;

  }

  portfolio.cash -= price;

  portfolio.holdings[symbol] =
    (
      portfolio.holdings[symbol] ||
      0
    ) + 1;

  alert(
    "Bought 1 " +
    symbol
  );

  stocksApp();

}

function sellStock(symbol) {

  if (
    !portfolio.holdings[symbol]
  ) {

    alert(
      "You don't own this stock."
    );

    return;

  }

  portfolio.holdings[symbol]--;

  portfolio.cash +=
    stockData[symbol];

  alert(
    "Sold 1 " +
    symbol
  );

  stocksApp();

}

function showPortfolio() {

  let text =
    "PORTFOLIO\n\n";

  Object.keys(
    portfolio.holdings
  ).forEach(symbol => {

    if (
      portfolio.holdings[symbol] >
      0
    ) {

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
    prompt(
      "Enter stock symbol:"
    );

  if (!symbol) return;

  const upper =
    symbol.toUpperCase();

  stockData[upper] =
    50 +
    Math.random() * 300;

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

        <h2>
          🗺️ Maps
        </h2>

        <input
          id="map-search"
          placeholder="Search a place..."
        >

        <button
          onclick="searchMap()"
        >
          Search
        </button>

        <button
          onclick="routeDemo()"
        >
          🚗 Directions
        </button>

        <button
          onclick="locateMe()"
        >
          📍 Find Me
        </button>

        <button
          onclick="savedMapPlace()"
        >
          ⭐ Save Place
        </button>

        <div
          id="map-result"
        ></div>

        <h3>
          Saved Places
        </h3>

        <div>

          ${
            savedPlaces.length
              ? savedPlaces
                  .map(
                    place =>
                      `
                        <p>
                          📍 ${escapeHTML(
                            place
                          )}
                        </p>
                      `
                  )
                  .join("")
              : "No saved places"
          }

        </div>

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

  if (
    !input ||
    !result
  ) return;

  const query =
    input.value.trim();

  if (!query) {

    result.innerHTML =
      "<p>Type a place first.</p>";

    return;

  }

  result.innerHTML = `

    <div class="post">

      📍
      ${escapeHTML(query)}

      <br><br>

      Location found!

    </div>

  `;

}

function routeDemo() {

  const result =
    document.getElementById(
      "map-result"
    );

  if (!result) return;

  result.innerHTML = `

    <div class="post">

      🚗 Route started!

      <br><br>

      Estimated arrival:
      14 minutes

    </div>

  `;

}

function locateMe() {

  const result =
    document.getElementById(
      "map-result"
    );

  if (!result) return;

  if (
    navigator.geolocation
  ) {

    navigator.geolocation.getCurrentPosition(

      position => {

        result.innerHTML = `

          <div class="post">

            📍 You are here!

            <br>

            Latitude:
            ${position.coords.latitude.toFixed(4)}

            <br>

            Longitude:
            ${position.coords.longitude.toFixed(4)}

          </div>

        `;

      },

      () => {

        result.innerHTML =
          "<p>Location unavailable.</p>";

      }

    );

  }

}

function savedMapPlace() {

  const input =
    document.getElementById(
      "map-search"
    );

  if (
    !input ||
    !input.value.trim()
  ) {

    alert(
      "Search for a place first."
    );

    return;

  }

  savedPlaces.push(
    input.value.trim()
  );

  mapsApp();

}

// ============================================================
// PHOTOS
// ============================================================

let photoLibrary = [];

function photosApp() {

  openApp(
    "Photos",
    `

      <div class="card">

        <h2>
          🖼️ Photos
        </h2>

        <input
          type="file"
          accept="image/png"
          multiple
          onchange="loadPhotos(event)"
        >

        <div
          id="photo-grid"
          class="photo-grid"
        >

          ${
            photoLibrary.length
              ? photoLibrary
                  .map(
                    photo =>
                      `
                        <div
                          class="photo-item"
                        >

                          <img
                            src="${photo}"
                            style="
                              width:100%;
                              border-radius:10px
                            "
                          >

                        </div>
                      `
                  )
                  .join("")
              : `
                  <p>
                    No PNG photos yet.
                  </p>
                `
          }

        </div>

      </div>

    `
  );

}

function loadPhotos(event) {

  const grid =
    document.getElementById(
      "photo-grid"
    );

  if (!grid) return;

  const files =
    Array.from(
      event.target.files
    ).filter(
      file =>
        file.type ===
        "image/png"
    );

  files.forEach(file => {

    const reader =
      new FileReader();

    reader.onload = e => {

      photoLibrary.push(
        e.target.result
      );

      photosApp();

    };

    reader.readAsDataURL(file);

  });

}

// ============================================================
// WEATHER
// ============================================================

function weatherApp() {

  openApp(
    "Weather",
    `

      <div class="card">

        <h2>
          ☀️ Weather
        </h2>

        <div
          style="
            font-size:52px;
            text-align:center
          "
        >
          ☀️
        </div>

        <h1
          style="
            text-align:center
          "
        >
          24°
        </h1>

        <p
          style="
            text-align:center
          "
        >
          Sunny
        </p>

        <p
          style="
            text-align:center
          "
        >
          Feels like 25°
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

  const temps = [
    21,
    22,
    23,
    24,
    25,
    26
  ];

  const temp =
    temps[
      Math.floor(
        Math.random() *
        temps.length
      )
    ];

  openApp(
    "Weather",
    `

      <div class="card">

        <h2>
          ☀️ Weather
        </h2>

        <div
          style="
            font-size:52px;
            text-align:center
          "
        >
          ☀️
        </div>

        <h1
          style="
            text-align:center
          "
        >
          ${temp}°
        </h1>

        <p
          style="
            text-align:center
          "
        >
          Sunny
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

// ============================================================
// NOTES
// ============================================================

let notes =
  JSON.parse(
    localStorage.getItem(
      "pear-notes"
    ) || "[]"
  );

function notesApp() {

  openApp(
    "Notes",
    `

      <div class="card">

        <h2>
          📝 Notes
        </h2>

        <textarea
          id="note-text"
          placeholder="Write a note..."
        ></textarea>

        <button
          onclick="saveNote()"
        >
          💾 Save Note
        </button>

        <button
          onclick="clearNotes()"
        >
          🗑️ Clear Notes
        </button>

        <div>

          ${
            notes.length
              ? notes
                  .map(
                    (note, index) =>
                      `
                        <div
                          class="post"
                        >

                          ${escapeHTML(
                            note
                          )}

                          <br><br>

                          <button
                            onclick="deleteNote(${index})"
                          >
                            Delete
                          </button>

                        </div>
                      `
                  )
                  .join("")
              : `
                  <p>
                    No notes yet.
                  </p>
                `
          }

        </div>

      </div>

    `
  );

}

function saveNote() {

  const text =
    document.getElementById(
      "note-text"
    );

  if (
    !text ||
    !text.value.trim()
  ) return;

  notes.unshift(
    text.value
  );

  localStorage.setItem(
    "pear-notes",
    JSON.stringify(notes)
  );

  notesApp();

}

function deleteNote(index) {

  notes.splice(
    index,
    1
  );

  localStorage.setItem(
    "pear-notes",
    JSON.stringify(notes)
  );

  notesApp();

}

function clearNotes() {

  notes = [];

  localStorage.removeItem(
    "pear-notes"
  );

  notesApp();

}

// ============================================================
// PEARTUNES
// ============================================================

let musicIndex = 0;

const demoSongs = [

  "Pearadise",
  "Sunset Drive",
  "Electric Orchard",
  "Pear Dreams",
  "Midnight Fruit"

];

function pearTunesApp() {

  openApp(
    "PearTunes",
    `

      <div class="card">

        <h2>
          🎵 PearTunes
        </h2>

        <div
          style="
            font-size:48px;
            text-align:center
          "
        >
          🎵
        </div>

        <h3
          id="song-title"
          style="
            text-align:center
          "
        >
          ${demoSongs[
            musicIndex
          ]}
        </h3>

        <button
          onclick="previousSong()"
        >
          ⏮ Previous
        </button>

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

        <button
          onclick="shuffleSongs()"
        >
          🔀 Shuffle
        </button>

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

  oscillator.frequency.value =
    440;

  oscillator.connect(gain);

  gain.connect(
    context.destination
  );

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
    (
      musicIndex + 1
    ) %
    demoSongs.length;

  updateSongTitle();

}

function previousSong() {

  musicIndex--;

  if (
    musicIndex < 0
  ) {

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

  if (!player) return;

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

        <h2>
          ⚙️ Settings
        </h2>

        <h3>
          Appearance
        </h3>

        <button
          onclick="toggleDarkMode()"
        >
          🌙 Dark / Light Mode
        </button>

        <label>

          Brightness

          <input
            type="range"
            min="50"
            max="100"
            value="100"
            oninput="
              changeBrightness(this.value)
            "
          >

        </label>

        <h3>
          Sound
        </h3>

        <button
          onclick="toggleSound()"
        >
          🔊 Sound On / Off
        </button>

        <button
          onclick="testSound()"
        >
          🔔 Test Sound
        </button>

        <h3>
          Animations
        </h3>

        <button
          onclick="toggleAnimations()"
        >
          ✨ Toggle Animations
        </button>

        <h3>
          Keyboard
        </h3>

        <button
          onclick="keyboardDemo()"
        >
          ⌨️ Test Keyboard
        </button>

        <h3>
          Phone
        </h3>

        <button
          onclick="phoneInfo()"
        >
          🍐 Pear Phone Info
        </button>

        <button
          onclick="batteryInfo()"
        >
          🔋 Battery
        </button>

        <button
          onclick="storageInfo()"
        >
          💾 Storage
        </button>

        <h3>
          Data
        </h3>

        <button
          onclick="resetNotes()"
        >
          📝 Clear Notes
        </button>

        <button
          onclick="resetPhone()"
        >
          🔄 Reset Pear Phone
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

function changeBrightness(
  value
) {

  phone.style.filter =
    `brightness(${value}%)`;

}

function toggleSound() {

  const enabled =
    localStorage.getItem(
      "pear-sound"
    ) !== "false";

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

        <h2>
          ⌨️ Pear Keyboard
        </h2>

        <input
          id="keyboard-test"
          placeholder="Type here..."
        >

        <p>
          Tap the keyboard below
          and try it!
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

      showPearKeyboard(
        input
      );

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

  alert(
    "All notes deleted."
  );

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

        <h2>
          🕐 Clock
        </h2>

        <div
          id="live-clock"
          style="
            font-size:32px
          "
        >
          ${new Date().toLocaleTimeString()}
        </div>

        <hr>

        <h3>
          Stopwatch
        </h3>

        <div
          id="stopwatch"
        >
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

        <h3>
          Timer
        </h3>

        <input
          id="timer-input"
          type="number"
          value="60"
          min="1"
        >

        <div
          id="timer"
        >
          01:00
        </div>

        <button
          onclick="startTimer()"
        >
          Start
        </button>

        <button
          onclick="resetTimer()"
        >
          Reset
        </button>

        <h3>
          Alarm
        </h3>

        <input
          id="alarm-time"
          type="time"
        >

        <button
          onclick="setAlarm()"
        >
          Set Alarm
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
      new Date().toLocaleTimeString();

  }

}

setInterval(
  updateClock,
  1000
);

function startStopwatch() {

  if (stopwatchInterval)
    return;

  stopwatchInterval =
    setInterval(() => {

      stopwatchSeconds++;

      const el =
        document.getElementById(
          "stopwatch"
        );

      if (el) {

        el.textContent =
          formatTime(
            stopwatchSeconds
          );

      }

    }, 1000);

}

function stopStopwatch() {

  clearInterval(
    stopwatchInterval
  );

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

    el.textContent =
      "00:00";

  }

}

function startTimer() {

  if (timerInterval)
    return;

  const input =
    document.getElementById(
      "timer-input"
    );

  if (input) {

    timerSeconds =
      Math.max(
        1,
        Number(input.value) ||
        60
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

        timerInterval = null;

        alert(
          "⏰ Timer finished!"
        );

      }

    }, 1000);

}

function resetTimer() {

  clearInterval(
    timerInterval
  );

  timerInterval = null;

  timerSeconds = 60;

  const el =
    document.getElementById(
      "timer"
    );

  if (el) {

    el.textContent =
      "01:00";

  }

}

function setAlarm() {

  const time =
    document.getElementById(
      "alarm-time"
    );

  if (
    !time ||
    !time.value
  ) {

    alert(
      "Choose an alarm time."
    );

    return;

  }

  alert(
    "⏰ Alarm set for " +
    time.value
  );

}

function formatTime(
  seconds
) {

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

        <h2>
          🎬 Videos
        </h2>

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

        <button
          onclick="fullscreenVideo()"
        >
          ⛶ Fullscreen
        </button>

        <button
          onclick="restartVideo()"
        >
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

  if (!video) return;

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

        <h2>
          📞 Phone
        </h2>

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

          ${
            [
              "1","2","3",
              "4","5","6",
              "7","8","9",
              "*","0","#"
            ]
              .map(
                n => `
                  <button
                    onclick="pressNumber('${n}')"
                  >
                    ${n}
                  </button>
                `
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

        <button
          onclick="fakeContacts()"
        >
          👥 Contacts
        </button>

        <button
          onclick="fakeRecents()"
        >
          🕘 Recent Calls
        </button>

      </div>

    `
  );

}

function pressNumber(
  number
) {

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

  openApp(
    "Mail",
    `

      <div class="card">

        <h2>
          📧 Mail
        </h2>

        <div id="email-list">

          ${
            emails
              .map(
                (email, index) => `

                  <div
                    class="post"
                    onclick="
                      openEmail(${index})
                    "
                  >

                    <strong>
                      ${escapeHTML(
                        email.from
                      )}
                    </strong>

                    <br>

                    ${escapeHTML(
                      email.subject
                    )}

                  </div>

                `
              )
              .join("")
          }

        </div>

        <button
          onclick="composeEmail()"
        >
          ✉️ Compose
        </button>

      </div>

    `
  );

}

function openEmail(index) {

  const email =
    emails[index];

  if (!email) return;

  openApp(
    email.subject,
    `

      <div class="card">

        <h2>
          ${escapeHTML(
            email.subject
          )}
        </h2>

        <p>
          From:
          ${escapeHTML(
            email.from
          )}
        </p>

        <hr>

        <p>
          ${escapeHTML(
            email.body
          )}
        </p>

        <button
          onclick="mailApp()"
        >
          ← Back
        </button>

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
          id="email-to"
          placeholder="To..."
        >

        <input
          id="email-subject"
          placeholder="Subject..."
        >

        <textarea
          id="email-body"
          placeholder="Write your email..."
        ></textarea>

        <button
          onclick="sendEmail()"
        >
          Send
        </button>

      </div>

    `
  );

}

function sendEmail() {

  const to =
    document.getElementById(
      "email-to"
    );

  const subject =
    document.getElementById(
      "email-subject"
    );

  const body =
    document.getElementById(
      "email-body"
    );

  if (
    !to ||
    !to.value.trim()
  ) {

    alert(
      "Enter a recipient."
    );

    return;

  }

  alert(
    "Email sent! 📧"
  );

  mailApp();

}

// ============================================================
// COMPASS
// ============================================================

function compassApp() {

  openApp(
    "Compass",
    `

      <div class="card">

        <h2>
          🧭 Compass
        </h2>

        <div
          id="compass-face"
          style="
            width:180px;
            height:180px;
            margin:auto;
            border:8px solid #333;
            border-radius:50%;
            display:grid;
            place-items:center;
            font-size:28px;
          "
        >
          N
        </div>

        <h3
          id="heading"
          style="
            text-align:center
          "
        >
          0°
        </h3>

        <button
          onclick="randomHeading()"
        >
          🔄 Calibrate
        </button>

      </div>

    `
  );

}

function randomHeading() {

  const heading =
    Math.floor(
      Math.random() * 360
    );

  const display =
    document.getElementById(
      "heading"
    );

  if (display) {

    display.textContent =
      heading + "°";

  }

}

// ============================================================
// THUMB
// ============================================================

function thumbApp() {

  openApp(
    "Thumb",
    `

      <div class="card">

        <h2>
          👍 Thumb
        </h2>

        <div
          style="
            font-size:100px;
            text-align:center
          "
        >
          👍
        </div>

        <p
          style="
            text-align:center
          "
        >
          Tap the button!
        </p>

        <button
          onclick="thumbLike()"
        >
          👍 Like
        </button>

        <div
          id="thumb-count"
          style="
            text-align:center;
            font-size:24px;
            margin-top:15px
          "
        >
          0
        </div>

      </div>

    `
  );

}

function tumsApp() {

  thumbApp();

}

function thumbLike() {

  const count =
    document.getElementById(
      "thumb-count"
    );

  if (!count) return;

  count.textContent =
    Number(
      count.textContent
    ) + 1;

}

// ============================================================
// LINGO
// ============================================================

function lingoApp() {

  openApp(
    "Lingo",
    `

      <div class="card">

        <h2>
          🗣️ Lingo
        </h2>

        <input
          id="lingo-input"
          placeholder="Type a word..."
        >

        <button
          onclick="translateLingo()"
        >
          Translate
        </button>

        <button
          onclick="lingoQuiz()"
        >
          🎯 Word Quiz
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

  if (
    !input ||
    !result
  ) return;

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

      ${
        escapeHTML(
          dictionary[word] ||
          "No translation found"
        )
      }

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
    answer
      .toLowerCase()
      .trim() ===
      item[1]
  ) {

    alert(
      "Correct! 🎉"
    );

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

        <h2>
          🌀 DanWarp
        </h2>

        <div
          id="warp-location"
          style="
            font-size:24px
          "
        >
          Ready...
        </div>

        <button
          onclick="warp()"
        >
          ⚡ WARP
        </button>

        <button
          onclick="randomWarp()"
        >
          🎲 Random Destination
        </button>

        <h3>
          Warp Energy
        </h3>

        <div
          id="warp-energy"
        >
          ██████████ 100%
        </div>

      </div>

    `
  );

}

function warp() {

  const location =
    document.getElementById(
      "warp-location"
    );

  const energy =
    document.getElementById(
      "warp-energy"
    );

  if (location) {

    location.textContent =
      "Warping... ⚡";

  }

  if (energy) {

    energy.textContent =
      "██████░░░░ 60%";

  }

  setTimeout(() => {

    if (location) {

      location.textContent =
        "Warp complete! 🚀";

    }

    if (energy) {

      energy.textContent =
        "██████████ 100%";

    }

  }, 1000);

}

function randomWarp() {

  const location =
    document.getElementById(
      "warp-location"
    );

  if (!location) return;

  location.textContent =
    warpLocations[
      Math.floor(
        Math.random() *
        warpLocations.length
      )
    ];

}

// ============================================================
// IMAGE
// ============================================================

function imageApp() {

  openApp(
    "Image",
    `

      <div class="card">

        <h2>
          🖼️ Image Studio
        </h2>

        <input
          type="file"
          accept="image/png"
          onchange="loadSingleImage(event)"
        >

        <div
          id="single-image"
        >

          <p>
            Choose a PNG image.
          </p>

        </div>

      </div>

    `
  );

}

function loadSingleImage(event) {

  const file =
    event.target.files[0];

  if (!file) return;

  if (
    file.type !==
    "image/png"
  ) {

    alert(
      "Please choose a PNG image."
    );

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

// ============================================================
// CHRONO
// ============================================================

function chronoApp() {

  openApp(
    "Chrono",
    `

      <div class="card">

        <h2>
          ⏱️ Chrono
        </h2>

        <div
          id="chrono-display"
          style="
            font-size:44px;
            text-align:center
          "
        >
          00:00:00
        </div>

        <button
          onclick="startChrono()"
        >
          Start
        </button>

        <button
          onclick="stopChrono()"
        >
          Stop
        </button>

        <button
          onclick="resetChrono()"
        >
          Reset
        </button>

      </div>

    `
  );

}

let chronoInterval = null;
let chronoSeconds = 0;

function startChrono() {

  if (chronoInterval)
    return;

  chronoInterval =
    setInterval(() => {

      chronoSeconds++;

      const el =
        document.getElementById(
          "chrono-display"
        );

      if (el) {

        const hours =
          Math.floor(
            chronoSeconds / 3600
          );

        const minutes =
          Math.floor(
            (chronoSeconds % 3600) /
            60
          );

        const seconds =
          chronoSeconds % 60;

        el.textContent =
          String(hours)
            .padStart(2, "0") +
          ":" +
          String(minutes)
            .padStart(2, "0") +
          ":" +
          String(seconds)
            .padStart(2, "0");

      }

    }, 1000);

}

function stopChrono() {

  clearInterval(
    chronoInterval
  );

  chronoInterval = null;

}

function resetChrono() {

  stopChrono();

  chronoSeconds = 0;

  const el =
    document.getElementById(
      "chrono-display"
    );

  if (el) {

    el.textContent =
      "00:00:00";

  }

}

// ============================================================
// ZAPLOOK
// ============================================================

function zaplookApp() {

  openApp(
    "ZapLook",
    `

      <div class="card">

        <h2>
          😎 ZapLook
        </h2>

        <div
          id="zap-face"
          style="
            font-size:100px;
            text-align:center
          "
        >
          😎
        </div>

        <button
          onclick="randomLook()"
        >
          ✨ Random Look
        </button>

        <button
          onclick="zapLookGlow()"
        >
          ⚡ Zap
        </button>

      </div>

    `
  );

}

function randomLook() {

  const faces = [
    "😎",
    "😃",
    "🤓",
    "🥳",
    "😈",
    "🤩",
    "🧐"
  ];

  const face =
    document.getElementById(
      "zap-face"
    );

  if (face) {

    face.textContent =
      faces[
        Math.floor(
          Math.random() *
          faces.length
        )
      ];

  }

}

function zapLookGlow() {

  const face =
    document.getElementById(
      "zap-face"
    );

  if (!face) return;

  face.textContent =
    "⚡😎⚡";

  setTimeout(() => {

    if (face) {

      face.textContent =
        "😎";

    }

  }, 1000);

}

// ============================================================
// MONKEY
// ============================================================

function monkeyApp() {

  openApp(
    "Monkey",
    `

      <div class="card">

        <h2>
          🐒 Monkey
        </h2>

        <div
          id="monkey-face"
          style="
            font-size:100px;
            text-align:center
          "
        >
          🐒
        </div>

        <button
          onclick="monkeyDance()"
        >
          💃 Monkey Dance
        </button>

        <button
          onclick="monkeySpeak()"
        >
          🗣️ Monkey Speak
        </button>

        <p
          id="monkey-text"
          style="
            text-align:center
          "
        >
          Hello!
        </p>

      </div>

    `
  );

}

function monkeyDance() {

  const face =
    document.getElementById(
      "monkey-face"
    );

  if (!face) return;

  face.textContent =
    "🕺🐒💃";

  setTimeout(() => {

    if (face) {

      face.textContent =
        "🐒";

    }

  }, 1000);

}

function monkeySpeak() {

  const phrases = [

    "Ooh ooh ah ah! 🐒",
    "Banana time! 🍌",
    "Who touched my banana?!",
    "🐒🐒🐒"

  ];

  const text =
    document.getElementById(
      "monkey-text"
    );

  if (text) {

    text.textContent =
      phrases[
        Math.floor(
          Math.random() *
          phrases.length
        )
      ];

  }

}

// ============================================================
// REMARK
// ============================================================

let remarks =
  JSON.parse(
    localStorage.getItem(
      "pear-remarks"
    ) || "[]"
  );

function remarkApp() {

  openApp(
    "Remark",
    `

      <div class="card">

        <h2>
          💭 Remark
        </h2>

        <textarea
          id="remark-text"
          placeholder="Write something..."
        ></textarea>

        <button
          onclick="saveRemark()"
        >
          💾 Save
        </button>

        <button
          onclick="clearRemarks()"
        >
          🗑️ Clear All
        </button>

        <div>

          ${
            remarks
              .map(
                (remark, index) => `

                  <div
                    class="post"
                  >

                    ${escapeHTML(
                      remark
                    )}

                    <br>

                    <button
                      onclick="
                        deleteRemark(${index})
                      "
                    >
                      Delete
                    </button>

                  </div>

                `
              )
              .join("")
          }

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

  if (
    !text ||
    !text.value.trim()
  ) {

    return;

  }

  remarks.unshift(
    text.value
  );

  localStorage.setItem(
    "pear-remarks",
    JSON.stringify(
      remarks
    )
  );

  remarkApp();

}

function deleteRemark(index) {

  remarks.splice(
    index,
    1
  );

  localStorage.setItem(
    "pear-remarks",
    JSON.stringify(
      remarks
    )
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

  Object.keys(
    connections
  ).forEach(id => {

    const button =
      document.getElementById(
        id
      );

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

    "p2-lingo":
      lingoApp,

    "p2-splash":
      splashfaceApp,

    "p2-thumb":
      tumsApp,

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
      typeof musicApp ===
      "function"
        ? musicApp
        : pearTunesApp,

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

  Object.keys(
    connections
  ).forEach(id => {

    const button =
      document.getElementById(
        id
      );

    if (!button) return;

    button.addEventListener(
      "pointerdown",
      e => {

        e.preventDefault();
        e.stopPropagation();

      },
      {
        capture: true
      }
    );

    button.addEventListener(
      "pointerup",
      e => {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        connections[id]();

      },
      {
        capture: true
      }
    );

  });

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
  "page-two"
);

if (pageDots) {

  pageDots.textContent =
    "● ○";

}
  }

  if (

    localStorage.getItem(

      "pear-sound"

    ) === "true"

  ) {

    document.body.classList.add(

      "sound-enabled"

    );

  }

  window.addEventListener(

    "beforeunload",

    () => {

      stopCamera();

      stopTypingGame();

      clearInterval(stopwatchInterval);

      clearInterval(timerInterval);

      clearInterval(chronoInterval);

    }

  );

})();
