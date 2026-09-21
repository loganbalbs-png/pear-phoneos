/* ============================================================
   PEAR PHONE OS — WORKING APP.JS
   Uses the existing index.html exactly as it is.
   ============================================================ */

(() => {
  "use strict";

  /* ==========================================================
     CORE ELEMENTS
     ========================================================== */

  const phone = document.getElementById("phone-container");
  const overlay = document.getElementById("overlay");
  const appWindow = document.getElementById("app-window");
  const home = document.getElementById("home");

  if (!phone || !overlay || !appWindow) {
    console.error("Pear Phone OS: required HTML elements not found.");
    return;
  }

  let currentPage = 1;
  let currentApp = null;

  let cameraStream = null;
  let keyboardTarget = null;
  let keyboardShift = false;
  let keyboardNumbers = false;

  let swipeStartX = 0;
  let swipeStartY = 0;
  let mouseStartX = 0;
  let mouseStartY = 0;
  let mouseDragging = false;

  let clockTimer = null;
  let stopwatchTimer = null;
  let chronoTimer = null;
  let monkeyTimer = null;
  let zapTimer = null;
  let typingTimer = null;

  /* ==========================================================
     BASIC HELPERS
     ========================================================== */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function closeApp() {
    stopCamera();
    clearInterval(clockTimer);
    clearInterval(stopwatchTimer);
    clearInterval(chronoTimer);
    clearInterval(monkeyTimer);
    clearInterval(zapTimer);
    clearInterval(typingTimer);

    clockTimer = null;
    stopwatchTimer = null;
    chronoTimer = null;
    monkeyTimer = null;
    zapTimer = null;
    typingTimer = null;

    hidePearKeyboard();

    currentApp = null;

    overlay.classList.remove("open");
    appWindow.innerHTML = "";
  }

  window.closeApp = closeApp;

  function openApp(title, html) {
    closeApp();

    currentApp = title;

    appWindow.innerHTML = `
      <div class="window-header">
        <button
          class="back"
          type="button"
          id="app-back"
          aria-label="Back"
        >‹</button>

        <strong>${escapeHTML(title)}</strong>
      </div>

      <div class="window-body">
        ${html}
      </div>
    `;

    overlay.classList.add("open");

    const back = document.getElementById("app-back");

    if (back) {
      back.addEventListener("click", closeApp);
      back.addEventListener(
        "touchend",
        event => {
          event.preventDefault();
          event.stopPropagation();
          closeApp();
        },
        { passive: false }
      );
    }

    setupTextInputs();
  }

  window.openApp = openApp;

  /* ==========================================================
     PAGE SWITCHING
     ========================================================== */

  function showPage(page) {
    currentPage = page === 2 ? 2 : 1;

    closeApp();

    phone.classList.toggle(
      "page-two",
      currentPage === 2
    );
  }

  window.showPage = showPage;

  function goToPage2() {
    showPage(2);
  }

  function goToPage1() {
    showPage(1);
  }

  /* ==========================================================
     SWIPE / DRAG PAGE SWITCHING
     ========================================================== */

  phone.addEventListener(
    "touchstart",
    event => {
      if (event.target.closest("#overlay")) return;

      const touch = event.touches[0];

      swipeStartX = touch.clientX;
      swipeStartY = touch.clientY;
    },
    { passive: true }
  );

  phone.addEventListener(
    "touchend",
    event => {
      if (event.target.closest("#overlay")) return;

      const touch = event.changedTouches[0];

      const dx = touch.clientX - swipeStartX;
      const dy = touch.clientY - swipeStartY;

      if (
        Math.abs(dy) > Math.abs(dx) &&
        Math.abs(dy) > 40
      ) {
        if (dy < 0) {
          goToPage2();
        } else {
          goToPage1();
        }
      }
    },
    { passive: true }
  );

  phone.addEventListener("mousedown", event => {
    if (event.target.closest("#overlay")) return;

    mouseDragging = true;
    mouseStartX = event.clientX;
    mouseStartY = event.clientY;
  });

  window.addEventListener("mouseup", event => {
    if (!mouseDragging) return;

    mouseDragging = false;

    const dx = event.clientX - mouseStartX;
    const dy = event.clientY - mouseStartY;

    if (
      Math.abs(dy) > Math.abs(dx) &&
      Math.abs(dy) > 40
    ) {
      if (dy < 0) {
        goToPage2();
      } else {
        goToPage1();
      }
    }
  });

  document.addEventListener("keydown", event => {
    if (
      event.target &&
      (
        event.target.matches("input") ||
        event.target.matches("textarea")
      )
    ) {
      return;
    }

    if (event.key === "ArrowUp") {
      goToPage2();
    }

    if (event.key === "ArrowDown") {
      goToPage1();
    }

    if (event.key === "Escape") {
      closeApp();
    }
  });

  /* ==========================================================
     HOME BUTTON
     ========================================================== */

  function homePressed(event) {
    event.preventDefault();
    event.stopPropagation();
    closeApp();
    goToPage1();
  }

  home.addEventListener("click", homePressed);

  home.addEventListener(
    "touchend",
    homePressed,
    { passive: false }
  );

  /* ==========================================================
     CUSTOM KEYBOARD
     ========================================================== */

  function createKeyboard() {
    if (document.getElementById("pear-keyboard")) {
      return;
    }

    const keyboard = document.createElement("div");

    keyboard.id = "pear-keyboard";

    keyboard.innerHTML = `
      <div class="pear-keyboard-row">
        <button type="button" data-key="q">Q</button>
        <button type="button" data-key="w">W</button>
        <button type="button" data-key="e">E</button>
        <button type="button" data-key="r">R</button>
        <button type="button" data-key="t">T</button>
        <button type="button" data-key="y">Y</button>
        <button type="button" data-key="u">U</button>
        <button type="button" data-key="i">I</button>
        <button type="button" data-key="o">O</button>
        <button type="button" data-key="p">P</button>
      </div>

      <div class="pear-keyboard-row">
        <button type="button" data-key="a">A</button>
        <button type="button" data-key="s">S</button>
        <button type="button" data-key="d">D</button>
        <button type="button" data-key="f">F</button>
        <button type="button" data-key="g">G</button>
        <button type="button" data-key="h">H</button>
        <button type="button" data-key="j">J</button>
        <button type="button" data-key="k">K</button>
        <button type="button" data-key="l">L</button>
      </div>

      <div class="pear-keyboard-row">
        <button type="button" data-action="shift">⇧</button>
        <button type="button" data-key="z">Z</button>
        <button type="button" data-key="x">X</button>
        <button type="button" data-key="c">C</button>
        <button type="button" data-key="v">V</button>
        <button type="button" data-key="b">B</button>
        <button type="button" data-key="n">N</button>
        <button type="button" data-key="m">M</button>
        <button type="button" data-action="backspace">⌫</button>
      </div>

      <div class="pear-keyboard-row bottom">
        <button type="button" data-action="numbers">123</button>
        <button type="button" data-action="space">SPACE</button>
        <button type="button" data-action="enter">↵</button>
      </div>
    `;

    phone.appendChild(keyboard);

    keyboard.addEventListener("click", event => {
      const button = event.target.closest("button");

      if (!button) return;

      event.preventDefault();
      event.stopPropagation();

      const action = button.dataset.action;
      const key = button.dataset.key;

      if (action === "shift") {
        keyboardShift = !keyboardShift;
        updateKeyboardLabels();
        return;
      }

      if (action === "numbers") {
        keyboardNumbers = !keyboardNumbers;
        updateKeyboardLabels();
        return;
      }

      if (action === "backspace") {
        keyboardBackspace();
        return;
      }

      if (action === "space") {
        keyboardInsert(" ");
        return;
      }

      if (action === "enter") {
        keyboardEnter();
        return;
      }

      if (key) {
        keyboardInsert(
          keyboardShift
            ? key.toUpperCase()
            : key
        );

        keyboardShift = false;
        updateKeyboardLabels();
      }
    });

    keyboard.addEventListener(
      "touchstart",
      event => {
        event.stopPropagation();
      },
      { passive: true }
    );

    return keyboard;
  }

  function updateKeyboardLabels() {
    const keyboard =
      document.getElementById("pear-keyboard");

    if (!keyboard) return;

    keyboard
      .querySelectorAll("[data-key]")
      .forEach(button => {
        const key = button.dataset.key;

        button.textContent =
          keyboardShift
            ? key.toUpperCase()
            : key.toLowerCase();
      });
  }

  function showPearKeyboard(input) {
    if (!input) return;

    createKeyboard();

    keyboardTarget = input;

    const keyboard =
      document.getElementById("pear-keyboard");

    if (!keyboard) return;

    keyboard.style.display = "block";

    requestAnimationFrame(() => {
      keyboard.classList.add("keyboard-show");
    });

    updateKeyboardLabels();
  }

  window.showPearKeyboard = showPearKeyboard;

  function hidePearKeyboard() {
    const keyboard =
      document.getElementById("pear-keyboard");

    if (!keyboard) {
      keyboardTarget = null;
      return;
    }

    keyboard.classList.remove("keyboard-show");

    setTimeout(() => {
      if (!keyboard.classList.contains("keyboard-show")) {
        keyboard.style.display = "none";
      }
    }, 280);

    keyboardTarget = null;
    keyboardShift = false;
  }

  window.hidePearKeyboard = hidePearKeyboard;

  function keyboardInsert(text) {
    if (!keyboardTarget) return;

    const input = keyboardTarget;

    const start =
      typeof input.selectionStart === "number"
        ? input.selectionStart
        : input.value.length;

    const end =
      typeof input.selectionEnd === "number"
        ? input.selectionEnd
        : input.value.length;

    input.value =
      input.value.slice(0, start) +
      text +
      input.value.slice(end);

    const position =
      start + text.length;

    input.focus();

    try {
      input.setSelectionRange(
        position,
        position
      );
    } catch (_) {}

    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    input.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );
  }

  function keyboardBackspace() {
    if (!keyboardTarget) return;

    const input = keyboardTarget;

    const start =
      typeof input.selectionStart === "number"
        ? input.selectionStart
        : input.value.length;

    const end =
      typeof input.selectionEnd === "number"
        ? input.selectionEnd
        : input.value.length;

    if (start !== end) {
      input.value =
        input.value.slice(0, start) +
        input.value.slice(end);

      input.focus();

      try {
        input.setSelectionRange(
          start,
          start
        );
      } catch (_) {}
    } else if (start > 0) {
      input.value =
        input.value.slice(0, start - 1) +
        input.value.slice(start);

      input.focus();

      try {
        input.setSelectionRange(
          start - 1,
          start - 1
        );
      } catch (_) {}
    }

    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
  }

  function keyboardEnter() {
    const input = keyboardTarget;

    hidePearKeyboard();

    if (input) {
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true
        })
      );

      input.blur();
    }
  }

  function setupTextInputs() {
    const fields =
      appWindow.querySelectorAll(
        "input:not([type='file']), textarea"
      );

    fields.forEach(field => {
      field.addEventListener("focus", () => {
        showPearKeyboard(field);
      });

      field.addEventListener("click", () => {
        showPearKeyboard(field);
      });

      field.addEventListener("touchstart", () => {
        setTimeout(() => {
          showPearKeyboard(field);
        }, 0);
      }, { passive: true });
    });
  }

  /* ==========================================================
     MESSAGES
     ========================================================== */

  let messages = JSON.parse(
    localStorage.getItem("pear-messages") ||
    "[]"
  );

  if (!messages.length) {
    messages = [
      {
        text: "Hey! Welcome to Pear Phone 🍐",
        me: false
      },
      {
        text: "This phone is actually pretty cool.",
        me: true
      }
    ];
  }

  function messagesApp() {
    openApp(
      "Messages",
      `
        <div class="card">

          <h2>💬 Messages</h2>

          <div
            style="
              display:flex;
              flex-direction:column;
              gap:4px;
              margin-bottom:10px;
            "
          >

            ${
              messages.length
                ? messages.map(message => `
                    <div
                      class="bubble ${
                        message.me ? "me" : ""
                      }"
                    >
                      ${escapeHTML(message.text)}
                    </div>
                  `).join("")
                : `
                  <p>
                    No messages yet.
                  </p>
                `
            }

          </div>

          <div class="row">

            <input
              id="message-input"
              type="text"
              placeholder="iMessage..."
              style="flex:1"
            >

            <button
              class="button"
              type="button"
              id="message-send"
            >
              Send
            </button>

          </div>

          <br>

          <button
            class="button"
            type="button"
            id="receive-message"
          >
            📩 Receive Message
          </button>

          <button
            class="button"
            type="button"
            id="clear-messages"
          >
            🗑️ Clear
          </button>

        </div>
      `
    );

    document
      .getElementById("message-send")
      ?.addEventListener(
        "click",
        sendMessage
      );

    document
      .getElementById("receive-message")
      ?.addEventListener(
        "click",
        receiveMessage
      );

    document
      .getElementById("clear-messages")
      ?.addEventListener(
        "click",
        () => {
          messages = [];
          saveMessages();
          messagesApp();
        }
      );
  }

  function saveMessages() {
    localStorage.setItem(
      "pear-messages",
      JSON.stringify(messages)
    );
  }

  function sendMessage() {
    const input =
      document.getElementById("message-input");

    if (!input || !input.value.trim()) return;

    messages.push({
      text: input.value,
      me: true
    });

    saveMessages();
    messagesApp();
  }

  function receiveMessage() {
    const list = [
      "What are you doing? 👀",
      "Your Pear Phone is insane 😂",
      "Call me when you get this.",
      "🍐🍐🍐",
      "Did you see that?!",
      "This is actually so cool.",
      "Pear Phone supremacy.",
      "I need your help lol"
    ];

    messages.push({
      text:
        list[
          Math.floor(
            Math.random() * list.length
          )
        ],
      me: false
    });

    saveMessages();
    messagesApp();
  }

  /* ==========================================================
     CAMERA
     ========================================================== */

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
            muted
          ></video>

          <canvas
            id="camera-canvas"
            style="
              display:none;
              width:100%;
              margin-top:8px;
              border-radius:12px;
            "
          ></canvas>

          <div class="row" style="flex-wrap:wrap;margin-top:8px">

            <button
              class="button"
              type="button"
              id="start-camera"
            >
              ▶ Camera
            </button>

            <button
              class="button"
              type="button"
              id="take-photo"
            >
              📸 Capture
            </button>

            <button
              class="button"
              type="button"
              id="stop-camera"
            >
              ⏹ Stop
            </button>

          </div>

          <p id="camera-status">
            Connecting to camera...
          </p>

        </div>
      `
    );

    document
      .getElementById("start-camera")
      ?.addEventListener(
        "click",
        startCamera
      );

    document
      .getElementById("take-photo")
      ?.addEventListener(
        "click",
        takePhoto
      );

    document
      .getElementById("stop-camera")
      ?.addEventListener(
        "click",
        stopCamera
      );

    await startCamera();
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
          "Camera is not supported by this browser.";
      }
      return;
    }

    stopCamera();

    try {
      cameraStream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user"
          },
          audio: false
        });

      video.srcObject =
        cameraStream;

      if (status) {
        status.textContent =
          "Camera connected ✓";
      }
    } catch (error) {
      console.error(error);

      if (status) {
        status.textContent =
          "Camera permission denied or unavailable.";
      }
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream
        .getTracks()
        .forEach(track => track.stop());

      cameraStream = null;
    }

    const video =
      document.getElementById("camera-video");

    if (video) {
      video.srcObject = null;
    }
  }

  function takePhoto() {
    const video =
      document.getElementById("camera-video");

    const canvas =
      document.getElementById("camera-canvas");

    const status =
      document.getElementById("camera-status");

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

    const ctx =
      canvas.getContext("2d");

    ctx.drawImage(
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

  /* ==========================================================
     SPLASHFACE
     ========================================================== */

  let splashPosts = JSON.parse(
    localStorage.getItem(
      "pear-splash-posts"
    ) || "[]"
  );

  if (!splashPosts.length) {
    splashPosts = [
      {
        user: "PearUser",
        text: "Just got my Pear Phone 🍐",
        likes: 12
      },
      {
        user: "Dan",
        text: "This phone is actually amazing.",
        likes: 7
      }
    ];
  }

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
            id="splash-post"
          >
            Post
          </button>

          <div style="margin-top:10px">

            ${
              splashPosts.map(
                (post, index) => `
                  <div
                    class="card"
                    style="margin-bottom:7px"
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
                      data-like="${index}"
                    >
                      ❤️ ${post.likes}
                    </button>

                  </div>
                `
              ).join("")
            }

          </div>

        </div>
      `
    );

    document
      .getElementById("splash-post")
      ?.addEventListener(
        "click",
        () => {

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

          localStorage.setItem(
            "pear-splash-posts",
            JSON.stringify(splashPosts)
          );

          splashfaceApp();
        }
      );

    appWindow
      .querySelectorAll("[data-like]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset.like
              );

            splashPosts[index].likes++;

            localStorage.setItem(
              "pear-splash-posts",
              JSON.stringify(splashPosts)
            );

            splashfaceApp();
          }
        );

      });
  }

  /* ==========================================================
     STOCKS
     ========================================================== */

  let stocks = [
    ["PEAR", "Pear Inc.", 184.27, 2.41],
    ["PPL", "Pear Labs", 92.14, -1.13],
    ["DAN", "DanWarp", 47.82, 4.76],
    ["SPL", "SplashFace", 61.32, -0.42]
  ];

  function stocksApp() {
    openApp(
      "Stocks",
      `
        <div class="card">

          <h2>📈 Stocks</h2>

          ${
            stocks.map(
              stock => `
                <div class="stock">

                  <div>
                    <strong>
                      ${stock[0]}
                    </strong>
                    <br>
                    <small>
                      ${escapeHTML(stock[1])}
                    </small>
                  </div>

                  <div style="text-align:right">

                    <strong>
                      $${stock[2].toFixed(2)}
                    </strong>

                    <br>

                    <small>
                      ${
                        stock[3] >= 0
                          ? "▲"
                          : "▼"
                      }
                      ${Math.abs(stock[3]).toFixed(2)}%
                    </small>

                  </div>

                </div>
              `
            ).join("")
          }

          <button
            class="button"
            type="button"
            id="refresh-stocks"
          >
            🔄 Refresh
          </button>

        </div>
      `
    );

    document
      .getElementById("refresh-stocks")
      ?.addEventListener(
        "click",
        () => {

          stocks.forEach(stock => {

            const change =
              Math.random() * 4 - 2;

            stock[3] =
              change;

            stock[2] *=
              1 + change / 100;
          });

          stocksApp();
        }
      );
  }

  /* ==========================================================
     MAPS
     ========================================================== */

  function mapsApp() {
    const places = [
      "🍐 Pear Headquarters",
      "🏫 Pear University",
      "🏟️ Pear Stadium",
      "🎬 Pear Studios",
      "🌳 Pear Park",
      "☕ Pear Café"
    ];

    openApp(
      "Maps",
      `
        <div class="card">

          <h2>🗺️ Pear Maps</h2>

          <div class="map">
            🗺️
          </div>

          <div style="margin-top:8px">

            ${places.map(
              (place, index) => `
                <button
                  class="button"
                  type="button"
                  data-map="${index}"
                  style="
                    width:100%;
                    margin-bottom:5px;
                    text-align:left;
                  "
                >
                  ${place}
                </button>
              `
            ).join("")}

          </div>

          <div
            id="map-result"
            style="font-weight:700"
          ></div>

        </div>
      `
    );

    appWindow
      .querySelectorAll("[data-map]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const distance =
              Math.floor(
                Math.random() * 20
              ) + 1;

            document
              .getElementById(
                "map-result"
              )
              .innerHTML = `
                📍 ${escapeHTML(
                  places[
                    Number(button.dataset.map)
                  ]
                )}
                <br>
                🚗 ${distance} km away
                <br>
                ⏱️ ${distance + 4} minutes
              `;
          }
        );

      });
  }

  /* ==========================================================
     PHOTOS
     ========================================================== */

  let photos = JSON.parse(
    localStorage.getItem(
      "pear-photos"
    ) || "[]"
  );

  function photosApp() {
    openApp(
      "Photos",
      `
        <div class="card">

          <h2>🖼️ Photos</h2>

          <input
            id="photo-files"
            type="file"
            accept="image/*"
            multiple
          >

          <div
            class="photos"
            style="margin-top:10px"
          >

            ${
              photos.length
                ? photos.map(
                    src => `
                      <img
                        src="${src}"
                        alt="Pear photo"
                      >
                    `
                  ).join("")
                : `
                  <p>
                    No photos yet.
                  </p>
                `
            }

          </div>

          <button
            class="button"
            type="button"
            id="clear-photos"
          >
            🗑️ Clear
          </button>

        </div>
      `
    );

    document
      .getElementById("photo-files")
      ?.addEventListener(
        "change",
        event => {

          Array.from(
            event.target.files || []
          ).forEach(file => {

            if (
              !file.type.startsWith("image/")
            ) {
              return;
            }

            const reader =
              new FileReader();

            reader.onload =
              e => {

                photos.push(
                  e.target.result
                );

                localStorage.setItem(
                  "pear-photos",
                  JSON.stringify(photos)
                );

                photosApp();
              };

            reader.readAsDataURL(file);
          });
        }
      );

    document
      .getElementById("clear-photos")
      ?.addEventListener(
        "click",
        () => {

          photos = [];

          localStorage.removeItem(
            "pear-photos"
          );

          photosApp();
        }
      );
  }

  /* ==========================================================
     WEATHER
     ========================================================== */

  let temperature =
    Number(
      localStorage.getItem(
        "pear-temperature"
      )
    ) || 22;

  function weatherApp() {
    openApp(
      "Weather",
      `
        <div class="card">

          <h2>☀️ Weather</h2>

          <div
            style="
              text-align:center;
              font-size:55px;
            "
          >
            ☀️
          </div>

          <h1
            style="text-align:center"
          >
            ${temperature}°C
          </h1>

          <p style="text-align:center">
            Sunny · Pear City
          </p>

          <button
            class="button"
            type="button"
            id="refresh-weather"
          >
            🔄 Refresh
          </button>

          <div
            style="
              display:grid;
              grid-template-columns:repeat(3,1fr);
              gap:5px;
              margin-top:10px;
            "
          >

            <div class="card">
              ☀️<br>
              Today
            </div>

            <div class="card">
              🌤️<br>
              Tomorrow
            </div>

            <div class="card">
              🌧️<br>
              Friday
            </div>

          </div>

        </div>
      `
    );

    document
      .getElementById("refresh-weather")
      ?.addEventListener(
        "click",
        () => {

          temperature =
            Math.floor(
              Math.random() * 21
            ) + 10;

          localStorage.setItem(
            "pear-temperature",
            temperature
          );

          weatherApp();
        }
      );
  }

  /* ==========================================================
     NOTES
     ========================================================== */

  let notes = JSON.parse(
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
            style="
              width:100%;
              margin-bottom:7px;
            "
          >

          <textarea
            id="note-body"
            placeholder="Write your note..."
          ></textarea>

          <button
            class="button"
            type="button"
            id="save-note"
          >
            💾 Save
          </button>

          <button
            class="button"
            type="button"
            id="clear-notes"
          >
            🗑️ Clear
          </button>

          <div style="margin-top:10px">

            ${
              notes.map(
                (note, index) => `
                  <div
                    class="card"
                    style="margin-bottom:6px"
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
                      data-delete-note="${index}"
                    >
                      Delete
                    </button>

                  </div>
                `
              ).join("")
            }

          </div>

        </div>
      `
    );

    document
      .getElementById("save-note")
      ?.addEventListener(
        "click",
        saveNote
      );

    document
      .getElementById("clear-notes")
      ?.addEventListener(
        "click",
        () => {

          notes = [];

          localStorage.removeItem(
            "pear-notes"
          );

          notesApp();
        }
      );

    appWindow
      .querySelectorAll("[data-delete-note]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            notes.splice(
              Number(
                button.dataset.deleteNote
              ),
              1
            );

            localStorage.setItem(
              "pear-notes",
              JSON.stringify(notes)
            );

            notesApp();
          }
        );

      });
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

    notes.unshift({
      title:
        title?.value.trim() ||
        "Untitled Note",
      body:
        body.value
    });

    localStorage.setItem(
      "pear-notes",
      JSON.stringify(notes)
    );

    notesApp();
  }

  /* ==========================================================
     PEARTUNES / MUSIC
     ========================================================== */

  const songs = [
    ["Pear Paradise", "Pear Radio", "🍐"],
    ["Midnight Drive", "Pear Sounds", "🌙"],
    ["Pixel Dreams", "Pear Sounds", "✨"],
    ["Summer Loading", "Pear Radio", "☀️"],
    ["Retro Future", "Pear Sounds", "💿"]
  ];

  let songIndex = 0;
  let musicPlaying = false;

  function pearTunesApp() {
    openApp(
      "PearTunes",
      `
        <div class="card">

          <h2>🎵 PearTunes</h2>

          <div style="text-align:center">

            <div
              style="
                width:120px;
                height:120px;
                margin:10px auto;
                border-radius:18px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:55px;
                background:
                  linear-gradient(
                    135deg,
                    #b8f3c8,
                    #77c9ff
                  );
              "
            >
              ${songs[songIndex][2]}
            </div>

            <h3>
              ${escapeHTML(songs[songIndex][0])}
            </h3>

            <small>
              ${escapeHTML(songs[songIndex][1])}
            </small>

          </div>

          <div
            class="row"
            style="
              justify-content:center;
              margin-top:10px;
            "
          >

            <button
              class="button"
              type="button"
              id="previous-song"
            >
              ⏮
            </button>

            <button
              class="button"
              type="button"
              id="toggle-music"
            >
              ${
                musicPlaying
                  ? "⏸"
                  : "▶"
              }
            </button>

            <button
              class="button"
              type="button"
              id="next-song"
            >
              ⏭
            </button>

          </div>

          <div style="margin-top:10px">

            ${songs.map(
              (song, index) => `
                <button
                  class="button"
                  type="button"
                  data-song="${index}"
                  style="
                    width:100%;
                    text-align:left;
                    margin-bottom:4px;
                  "
                >
                  ${song[2]}
                  ${escapeHTML(song[0])}
                </button>
              `
            ).join("")}

          </div>

        </div>
      `
    );

    document
      .getElementById("previous-song")
      ?.addEventListener(
        "click",
        previousSong
      );

    document
      .getElementById("next-song")
      ?.addEventListener(
        "click",
        nextSong
      );

    document
      .getElementById("toggle-music")
      ?.addEventListener(
        "click",
        () => {

          musicPlaying =
            !musicPlaying;

          pearTunesApp();
        }
      );

    appWindow
      .querySelectorAll("[data-song]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            songIndex =
              Number(
                button.dataset.song
              );

            musicPlaying =
              true;

            pearTunesApp();
          }
        );

      });
  }

  function previousSong() {
    songIndex =
      (
        songIndex -
        1 +
        songs.length
      ) % songs.length;

    pearTunesApp();
  }

  function nextSong() {
    songIndex =
      (
        songIndex +
        1
      ) % songs.length;

    pearTunesApp();
  }

  /* ==========================================================
     SETTINGS
     ========================================================== */

  function settingsApp() {
    openApp(
      "Settings",
      `
        <div class="card">

          <h2>⚙️ Settings</h2>

          <h3>Appearance</h3>

          <button
            class="button"
            type="button"
            id="dark-mode"
          >
            🌙 Dark / Light Mode
          </button>

          <h3>Sound</h3>

          <button
            class="button"
            type="button"
            id="sound-test"
          >
            🔔 Test Sound
          </button>

          <h3>Keyboard</h3>

          <button
            class="button"
            type="button"
            id="keyboard-demo"
          >
            ⌨️ Test Keyboard
          </button>

          <h3>Phone</h3>

          <button
            class="button"
            type="button"
            id="phone-info"
          >
            🍐 Pear Phone Info
          </button>

        </div>
      `
    );

    document
      .getElementById("dark-mode")
      ?.addEventListener(
        "click",
        () => {

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
      );

    document
      .getElementById("sound-test")
      ?.addEventListener(
        "click",
        playDemoTone
      );

    document
      .getElementById("phone-info")
      ?.addEventListener(
        "click",
        () => {

          openApp(
            "Pear Phone",
            `
              <div class="card">

                <h2>🍐 Pear Phone</h2>

                <p>
                  Pear Phone OS
                </p>

                <p>
                  Version 2.0
                </p>

                <p>
                  Status: Online 🟢
                </p>

              </div>
            `
          );
        }
      );

    document
      .getElementById("keyboard-demo")
      ?.addEventListener(
        "click",
        () => {

          openApp(
            "Keyboard",
            `
              <div class="card">

                <h2>⌨️ Pear Keyboard</h2>

                <input
                  id="keyboard-test"
                  type="text"
                  placeholder="Tap here and type..."
                >

                <p>
                  The keyboard appears only when
                  you tap the text field.
                </p>

              </div>
            `
          );

          const input =
            document.getElementById(
              "keyboard-test"
            );

          if (input) {
            input.focus();
            showPearKeyboard(input);
          }
        }
      );
  }

  function playDemoTone() {
    try {
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
        600;

      gain.gain.value =
        0.08;

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();

      oscillator.stop(
        context.currentTime + 0.15
      );
    } catch (_) {}
  }

  /* ==========================================================
     CLOCK
     ========================================================== */

  let stopwatchSeconds = 0;
  let stopwatchRunning = false;

  function clockApp() {
    openApp(
      "Clock",
      `
        <div class="card">

          <h2>🕐 Clock</h2>

          <div
            id="clock-time"
            style="
              text-align:center;
              font-size:32px;
              font-weight:900;
            "
          >
            ${new Date().toLocaleTimeString()}
          </div>

          <p style="text-align:center">
            ${new Date().toLocaleDateString()}
          </p>

          <hr>

          <h3>⏱ Stopwatch</h3>

          <div
            id="stopwatch"
            style="
              text-align:center;
              font-size:30px;
              font-weight:900;
            "
          >
            ${formatStopwatch(stopwatchSeconds)}
          </div>

          <button
            class="button"
            type="button"
            id="stopwatch-toggle"
          >
            ${
              stopwatchRunning
                ? "⏸ Pause"
                : "▶ Start"
            }
          </button>

          <button
            class="button"
            type="button"
            id="stopwatch-reset"
          >
            ↻ Reset
          </button>

        </div>
      `
    );

    clockTimer =
      setInterval(() => {

        const element =
          document.getElementById(
            "clock-time"
          );

        if (element) {
          element.textContent =
            new Date().toLocaleTimeString();
        }

      }, 1000);

    document
      .getElementById("stopwatch-toggle")
      ?.addEventListener(
        "click",
        toggleStopwatch
      );

    document
      .getElementById("stopwatch-reset")
      ?.addEventListener(
        "click",
        resetStopwatch
      );

    if (stopwatchRunning) {
      startStopwatchTimer();
    }
  }

  function formatStopwatch(seconds) {
    const minutes =
      Math.floor(seconds / 60);

    const secondsPart =
      seconds % 60;

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(secondsPart).padStart(2, "0")
    );
  }

  function toggleStopwatch() {
    stopwatchRunning =
      !stopwatchRunning;

    if (stopwatchRunning) {
      startStopwatchTimer();
    } else {
      clearInterval(stopwatchTimer);
    }

    clockApp();
  }

  function startStopwatchTimer() {
    clearInterval(stopwatchTimer);

    stopwatchTimer =
      setInterval(() => {

        stopwatchSeconds++;

        const display =
          document.getElementById(
            "stopwatch"
          );

        if (display) {
          display.textContent =
            formatStopwatch(
              stopwatchSeconds
            );
        }

      }, 1000);
  }

  function resetStopwatch() {
    clearInterval(stopwatchTimer);

    stopwatchRunning =
      false;

    stopwatchSeconds =
      0;

    clockApp();
  }

  /* ==========================================================
     VIDEOS
     ========================================================== */

  let videoPlaying = false;

  function videosApp() {
    openApp(
      "Videos",
      `
        <div class="card">

          <h2>🎬 Videos</h2>

          <div
            style="
              height:170px;
              border-radius:14px;
              background:#111;
              color:white;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:50px;
            "
          >
            ${
              videoPlaying
                ? "▶️"
                : "⏸"
            }
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
            id="video-toggle"
          >
            ${
              videoPlaying
                ? "⏸ Pause"
                : "▶ Play"
            }
          </button>

          <button
            class="button"
            type="button"
            id="random-video"
          >
            🎲 Random
          </button>

        </div>
      `
    );

    document
      .getElementById("video-toggle")
      ?.addEventListener(
        "click",
        () => {

          videoPlaying =
            !videoPlaying;

          videosApp();
        }
      );

    document
      .getElementById("random-video")
      ?.addEventListener(
        "click",
        () => {

          const titles = [
            "Pear Phone Review",
            "Top Pear Tricks",
            "Pear OS Hidden Features",
            "Funny Pear Moments",
            "Pear Phone Unboxing"
          ];

          const title =
            titles[
              Math.floor(
                Math.random() *
                titles.length
              )
            ];

          openApp(
            "Video",
            `
              <div class="card">

                <h2>
                  🎬 ${escapeHTML(title)}
                </h2>

                <div
                  style="
                    height:170px;
                    background:#111;
                    color:white;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:50px;
                    border-radius:14px;
                  "
                >
                  ▶️
                </div>

                <p>
                  Playing Pear Video.
                </p>

              </div>
            `
          );
        }
      );
  }

  /* ==========================================================
     PHONE
     ========================================================== */

  let dialNumber = "";

  function phoneApp() {
    openApp(
      "Phone",
      `
        <div class="card">

          <h2>☎️ Phone</h2>

          <input
            id="dial-display"
            type="tel"
            value="${escapeHTML(dialNumber)}"
            placeholder="Number"
            style="
              width:100%;
              text-align:center;
              font-size:22px;
              margin-bottom:7px;
            "
          >

          <div
            style="
              display:grid;
              grid-template-columns:repeat(3,1fr);
              gap:5px;
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
                  data-dial="${number}"
                >
                  ${number}
                </button>
              `
            ).join("")}

          </div>

          <button
            class="button"
            type="button"
            id="call-number"
            style="width:100%;margin-top:7px"
          >
            📞 Call
          </button>

          <button
            class="button"
            type="button"
            id="delete-digit"
          >
            ⌫ Delete
          </button>

          <button
            class="button"
            type="button"
            id="clear-dial"
          >
            Clear
          </button>

          <p
            id="call-status"
            style="text-align:center;font-weight:800"
          ></p>

        </div>
      `
    );

    const display =
      document.getElementById(
        "dial-display"
      );

    appWindow
      .querySelectorAll("[data-dial]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            dialNumber +=
              button.dataset.dial;

            if (display) {
              display.value =
                dialNumber;
            }
          }
        );

      });

    document
      .getElementById("delete-digit")
      ?.addEventListener(
        "click",
        () => {

          dialNumber =
            dialNumber.slice(0, -1);

          if (display) {
            display.value =
              dialNumber;
          }
        }
      );

    document
      .getElementById("clear-dial")
      ?.addEventListener(
        "click",
        () => {

          dialNumber = "";

          if (display) {
            display.value = "";
          }
        }
      );

    document
      .getElementById("call-number")
      ?.addEventListener(
        "click",
        () => {

          const status =
            document.getElementById(
              "call-status"
            );

          if (!dialNumber) {
            status.textContent =
              "Enter a number first.";
            return;
          }

          status.textContent =
            `Calling ${dialNumber}... 📞`;
        }
      );
  }

  /* ==========================================================
     MAIL
     ========================================================== */

  let mail = [
    {
      from: "Pear Support",
      subject: "Welcome to Pear OS",
      body: "Thanks for using your Pear Phone!"
    },
    {
      from: "Pear News",
      subject: "New update available",
      body: "Your Pear Phone is running perfectly."
    }
  ];

  function mailApp() {
    openApp(
      "Mail",
      `
        <div class="card">

          <h2>✉️ Mail</h2>

          ${
            mail.map(
              (message, index) => `
                <button
                  class="button"
                  type="button"
                  data-mail="${index}"
                  style="
                    width:100%;
                    text-align:left;
                    margin-bottom:6px;
                  "
                >
                  <strong>
                    ${escapeHTML(message.from)}
                  </strong>
                  <br>
                  ${escapeHTML(message.subject)}
                </button>
              `
            ).join("")
          }

          <button
            class="button"
            type="button"
            id="compose-mail"
          >
            ✏️ Compose
          </button>

        </div>
      `
    );

    appWindow
      .querySelectorAll("[data-mail]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const message =
              mail[
                Number(button.dataset.mail)
              ];

            openApp(
              "Mail",
              `
                <div class="card">

                  <h2>
                    ${escapeHTML(
                      message.subject
                    )}
                  </h2>

                  <strong>
                    From:
                  </strong>

                  ${escapeHTML(
                    message.from
                  )}

                  <hr>

                  <p>
                    ${escapeHTML(
                      message.body
                    )}
                  </p>

                </div>
              `
            );
          }
        );

      });

    document
      .getElementById("compose-mail")
      ?.addEventListener(
        "click",
        composeMail
      );
  }

  function composeMail() {
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
            id="send-mail"
          >
            📤 Send
          </button>

        </div>
      `
    );

    document
      .getElementById("send-mail")
      ?.addEventListener(
        "click",
        () => {

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

          mail.unshift({
            from:
              `You → ${
                to?.value || "Unknown"
              }`,
            subject:
              subject?.value ||
              "No Subject",
            body:
              body?.value || ""
          });

          mailApp();
        }
      );
  }

  /* ==========================================================
     COMPASS
     ========================================================== */

  let compassHeading = 0;

  function compassApp() {
    openApp(
      "Compass",
      `
        <div class="card">

          <h2>🧭 Compass</h2>

          <div
            id="compass-circle"
            style="
              width:150px;
              height:150px;
              margin:15px auto;
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
            id="compass-heading"
            style="text-align:center"
          >
            ${compassHeading}°
          </h2>

          <p
            id="compass-direction"
            style="text-align:center"
          >
            ${compassDirection()}
          </p>

          <button
            class="button"
            type="button"
            id="calibrate-compass"
          >
            🔄 Calibrate
          </button>

        </div>
      `
    );

    document
      .getElementById("calibrate-compass")
      ?.addEventListener(
        "click",
        () => {

          compassHeading =
            Math.floor(
              Math.random() * 360
            );

          const circle =
            document.getElementById(
              "compass-circle"
            );

          const heading =
            document.getElementById(
              "compass-heading"
            );

          const direction =
            document.getElementById(
              "compass-direction"
            );

          circle.style.transform =
            `rotate(${compassHeading}deg)`;

          heading.textContent =
            `${compassHeading}°`;

          direction.textContent =
            compassDirection();
        }
      );
  }

  function compassDirection() {
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
        compassHeading / 45
      ) % 8
    ];
  }

  /* ==========================================================
     TUMS / TYPING
     ========================================================== */

  const typingSentences = [
    "Pear Phone",
    "Welcome to Pear OS",
    "Pear Phone is awesome",
    "Touch the screen",
    "The quick brown fox",
    "Raspberry Pi",
    "Pear Phone forever",
    "Type this sentence"
  ];

  let typingSentence =
    typingSentences[0];

  let typingStartTime = 0;

  function tumsApp() {
    openApp(
      "Tums",
      `
        <div class="card">

          <h2>⌨️ Tums Typing</h2>

          <p>
            Type the sentence below.
          </p>

          <div
            style="
              padding:12px;
              background:#e8e8e8;
              border-radius:12px;
              font-weight:900;
              margin-bottom:8px;
            "
          >
            ${escapeHTML(typingSentence)}
          </div>

          <textarea
            id="typing-input"
            placeholder="Start typing..."
            rows="4"
          ></textarea>

          <p id="typing-result">
            Ready!
          </p>

          <button
            class="button"
            type="button"
            id="typing-new"
          >
            🔄 New Sentence
          </button>

        </div>
      `
    );

    const input =
      document.getElementById(
        "typing-input"
      );

    if (input) {

      typingStartTime =
        Date.now();

      input.addEventListener(
        "input",
        () => {

          const result =
            document.getElementById(
              "typing-result"
            );

          if (
            input.value ===
            typingSentence
          ) {

            const elapsed =
              Math.max(
                1,
                (Date.now() -
                  typingStartTime) /
                  1000
              );

            const words =
              typingSentence
                .trim()
                .split(/\s+/)
                .length;

            const wpm =
              Math.round(
                words /
                (elapsed / 60)
              );

            result.innerHTML =
              `🎉 Complete! ${wpm} WPM`;

          } else {

            const correct =
              input.value ===
              typingSentence.slice(
                0,
                input.value.length
              );

            result.textContent =
              correct
                ? "Keep going..."
                : "❌ Check your typing.";

          }
        }
      );
    }

    document
      .getElementById("typing-new")
      ?.addEventListener(
        "click",
        () => {

          typingSentence =
            typingSentences[
              Math.floor(
                Math.random() *
                typingSentences.length
              )
            ];

          tumsApp();
        }
      );
  }

  /* ==========================================================
     PAGE 2 — LINGO
     ========================================================== */

  function lingoApp() {
    const dictionary = {
      hello: "hola",
      goodbye: "adios",
      apple: "manzana",
      friend: "amigo",
      house: "casa",
      water: "agua",
      music: "musica",
      phone: "telefono",
      pear: "pera"
    };

    openApp(
      "Lingo",
      `
        <div class="card">

          <h2>🗣️ Lingo</h2>

          <input
            id="lingo-input"
            type="text"
            placeholder="Type a word..."
          >

          <button
            class="button"
            type="button"
            id="translate-lingo"
          >
            Translate
          </button>

          <div
            id="lingo-result"
            style="
              margin-top:10px;
              font-size:20px;
              font-weight:900;
            "
          ></div>

          <button
            class="button"
            type="button"
            id="lingo-quiz"
          >
            🎯 Word Quiz
          </button>

        </div>
      `
    );

    document
      .getElementById("translate-lingo")
      ?.addEventListener(
        "click",
        () => {

          const input =
            document.getElementById(
              "lingo-input"
            );

          const result =
            document.getElementById(
              "lingo-result"
            );

          const word =
            input.value
              .trim()
              .toLowerCase();

          result.textContent =
            dictionary[word] ||
            "No translation found.";
        }
      );

    document
      .getElementById("lingo-quiz")
      ?.addEventListener(
        "click",
        () => {

          const choices =
            Object.entries(
              dictionary
            );

          const choice =
            choices[
              Math.floor(
                Math.random() *
                choices.length
              )
            ];

          const answer =
            prompt(
              `Translate "${choice[0]}"`
            );

          if (
            answer &&
            answer.trim().toLowerCase() ===
            choice[1]
          ) {
            alert("Correct! 🎉");
          } else {
            alert(
              `Answer: ${choice[1]}`
            );
          }
        }
      );
  }

  /* ==========================================================
     PAGE 2 — SPLASH
     ========================================================== */

  let splashCount = 0;

  function p2SplashApp() {
    openApp(
      "Splash",
      `
        <div class="card">

          <h2>💦 Splash</h2>

          <div
            style="
              text-align:center;
              font-size:65px;
            "
          >
            💦
          </div>

          <h1
            style="text-align:center"
            id="splash-count"
          >
            ${splashCount}
          </h1>

          <button
            class="button"
            type="button"
            id="splash-button"
          >
            💦 SPLASH!
          </button>

          <button
            class="button"
            type="button"
            id="splash-reset"
          >
            Reset
          </button>

        </div>
      `
    );

    document
      .getElementById("splash-button")
      ?.addEventListener(
        "click",
        () => {

          splashCount++;

          const count =
            document.getElementById(
              "splash-count"
            );

          count.textContent =
            splashCount;
        }
      );

    document
      .getElementById("splash-reset")
      ?.addEventListener(
        "click",
        () => {

          splashCount = 0;

          const count =
            document.getElementById(
              "splash-count"
            );

          count.textContent = 0;
        }
      );
  }

  /* ==========================================================
     PAGE 2 — THUMB
     ========================================================== */

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
              background:#eee;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:65px;
              cursor:pointer;
            "
          >
            👍
          </div>

          <h2
            style="text-align:center"
            id="thumb-count"
          >
            ${thumbCount}
          </h2>

          <button
            class="button"
            type="button"
            id="thumb-reset"
          >
            Reset
          </button>

        </div>
      `
    );

    document
      .getElementById("thumb-button")
      ?.addEventListener(
        "click",
        () => {

          thumbCount++;

          const count =
            document.getElementById(
              "thumb-count"
            );

          count.textContent =
            thumbCount;
        }
      );

    document
      .getElementById("thumb-reset")
      ?.addEventListener(
        "click",
        () => {

          thumbCount = 0;

          document
            .getElementById(
              "thumb-count"
            )
            .textContent = 0;
        }
      );
  }

  /* ==========================================================
     PAGE 2 — DANWARP
     ========================================================== */

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
            style="
              text-align:center;
              font-size:23px;
              font-weight:900;
              padding:15px;
            "
          >
            Ready...
          </div>

          <button
            class="button"
            type="button"
            id="warp-button"
          >
            ⚡ WARP
          </button>

          <button
            class="button"
            type="button"
            id="random-warp"
          >
            🎲 Random
          </button>

          <div
            style="
              height:8px;
              background:#ddd;
              border-radius:10px;
              margin-top:12px;
            "
          >
            <div
              id="warp-energy"
              style="
                height:100%;
                width:100%;
                background:#7d6cff;
                border-radius:10px;
              "
            ></div>
          </div>

        </div>
      `
    );

    function doWarp() {

      const location =
        warpLocations[
          Math.floor(
            Math.random() *
            warpLocations.length
          )
        ];

      const element =
        document.getElementById(
          "warp-location"
        );

      const energy =
        document.getElementById(
          "warp-energy"
        );

      element.textContent =
        "🌀 WARPING...";

      energy.style.width =
        "15%";

      setTimeout(() => {

        element.textContent =
          `📍 ${location}`;

        energy.style.width =
          "100%";

      }, 650);
    }

    document
      .getElementById("warp-button")
      ?.addEventListener(
        "click",
        doWarp
      );

    document
      .getElementById("random-warp")
      ?.addEventListener(
        "click",
        doWarp
      );
  }

  /* ==========================================================
     PAGE 2 — IMAGE
     ========================================================== */

  let imageClicks = 0;

  function imageApp() {
    openApp(
      "Image",
      `
        <div class="card">

          <h2>🖼️ Image</h2>

          <div
            id="image-object"
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
              transition:transform .15s;
            "
          >
            🍐
          </div>

          <p
            style="text-align:center"
            id="image-count"
          >
            Interactions: ${imageClicks}
          </p>

        </div>
      `
    );

    document
      .getElementById("image-object")
      ?.addEventListener(
        "click",
        () => {

          imageClicks++;

          const object =
            document.getElementById(
              "image-object"
            );

          object.style.transform =
            `rotate(${
              Math.random() * 16 - 8
            }deg) scale(1.08)`;

          setTimeout(() => {

            if (object) {
              object.style.transform =
                "rotate(0deg) scale(1)";
            }

          }, 160);

          document
            .getElementById(
              "image-count"
            )
            .textContent =
            `Interactions: ${imageClicks}`;
        }
      );
  }

  /* ==========================================================
     PAGE 2 — CHRONO
     ========================================================== */

  let chronoSeconds = 10;

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
              margin:15px;
            "
          >
            ${chronoSeconds}
          </div>

          <button
            class="button"
            type="button"
            id="chrono-start"
          >
            ▶ Start
          </button>

          <button
            class="button"
            type="button"
            id="chrono-reset"
          >
            ↻ Reset
          </button>

          <button
            class="button"
            type="button"
            id="chrono-add"
          >
            +10 Seconds
          </button>

        </div>
      `
    );

    document
      .getElementById("chrono-start")
      ?.addEventListener(
        "click",
        () => {

          clearInterval(chronoTimer);

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

                chronoTimer = null;

                if (display) {
                  display.textContent =
                    "DONE! 🎉";
                }
              }

            }, 1000);
        }
      );

    document
      .getElementById("chrono-reset")
      ?.addEventListener(
        "click",
        () => {

          clearInterval(
            chronoTimer
          );

          chronoSeconds =
            10;

          chronoApp();
        }
      );

    document
      .getElementById("chrono-add")
      ?.addEventListener(
        "click",
        () => {

          chronoSeconds +=
            10;

          const display =
            document.getElementById(
              "chrono-display"
            );

          display.textContent =
            chronoSeconds;
        }
      );
  }

  /* ==========================================================
     PAGE 2 — ZAPLOOK
     ========================================================== */

  let zapScore = 0;
  let zapRunning = false;

  function zaplookApp() {
    openApp(
      "ZapLook",
      `
        <div class="card">

          <h2>⚡ ZapLook</h2>

          <p>
            Hit the target!
          </p>

          <div
            id="zap-arena"
            style="
              position:relative;
              height:190px;
              background:#111;
              border-radius:15px;
              overflow:hidden;
            "
          >

            <button
              id="zap-target"
              type="button"
              style="
                position:absolute;
                width:50px;
                height:50px;
                border:0;
                border-radius:50%;
                background:#fff;
                font-size:24px;
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
            id="zap-start"
          >
            ▶ Start
          </button>

          <button
            class="button"
            type="button"
            id="zap-stop"
          >
            ⏹ Stop
          </button>

        </div>
      `
    );

    const target =
      document.getElementById(
        "zap-target"
      );

    target.addEventListener(
      "click",
      () => {

        if (!zapRunning) return;

        zapScore++;

        document
          .getElementById(
            "zap-score"
          )
          .textContent =
          zapScore;

        moveZap();
      }
    );

    document
      .getElementById("zap-start")
      ?.addEventListener(
        "click",
        () => {

          zapRunning = true;

          clearInterval(
            zapTimer
          );

          moveZap();

          zapTimer =
            setInterval(
              moveZap,
              700
            );
        }
      );

    document
      .getElementById("zap-stop")
      ?.addEventListener(
        "click",
        () => {

          zapRunning = false;

          clearInterval(
            zapTimer
          );

          zapTimer = null;
        }
      );
  }

  function moveZap() {
    const arena =
      document.getElementById(
        "zap-arena"
      );

    const target =
      document.getElementById(
        "zap-target"
      );

    if (
      !arena ||
      !target
    ) return;

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

  /* ==========================================================
     PAGE 2 — MONKEY
     ========================================================== */

  let monkeyScore = 0;
  let monkeyRunning = false;
  let monkeyTime = 20;

  function monkeyApp() {
    openApp(
      "Monkey",
      `
        <div class="card">

          <h2>🐒 Monkey</h2>

          <p>
            Catch the monkey!
          </p>

          <div
            id="monkey-arena"
            style="
              position:relative;
              height:190px;
              border-radius:15px;
              overflow:hidden;
              background:
                linear-gradient(
                  135deg,
                  #d9f7c8,
                  #a8df9b
                );
            "
          >

            <button
              id="monkey-target"
              type="button"
              style="
                position:absolute;
                border:0;
                background:transparent;
                font-size:48px;
                cursor:pointer;
              "
            >
              🐒
            </button>

          </div>

          <p>
            Score:
            <strong id="monkey-score">
              ${monkeyScore}
            </strong>

            &nbsp;&nbsp;

            Time:
            <strong id="monkey-time">
              ${monkeyTime}
            </strong>
          </p>

          <button
            class="button"
            type="button"
            id="monkey-start"
          >
            ▶ Start
          </button>

          <button
            class="button"
            type="button"
            id="monkey-reset"
          >
            ↻ Reset
          </button>

        </div>
      `
    );

    document
      .getElementById("monkey-target")
      ?.addEventListener(
        "click",
        () => {

          if (!monkeyRunning) return;

          monkeyScore++;

          document
            .getElementById(
              "monkey-score"
            )
            .textContent =
            monkeyScore;

          moveMonkey();
        }
      );

    document
      .getElementById("monkey-start")
      ?.addEventListener(
        "click",
        startMonkey
      );

    document
      .getElementById("monkey-reset")
      ?.addEventListener(
        "click",
        () => {

          clearInterval(
            monkeyTimer
          );

          monkeyRunning =
            false;

          monkeyScore =
            0;

          monkeyTime =
            20;

          monkeyApp();
        }
      );

    moveMonkey();
  }

  function startMonkey() {
    clearInterval(monkeyTimer);

    monkeyRunning =
      true;

    monkeyScore =
      0;

    monkeyTime =
      20;

    document
      .getElementById(
        "monkey-score"
      )
      .textContent = 0;

    document
      .getElementById(
        "monkey-time"
      )
      .textContent = 20;

    moveMonkey();

    monkeyTimer =
      setInterval(() => {

        monkeyTime--;

        const time =
          document.getElementById(
            "monkey-time"
          );

        if (time) {
          time.textContent =
            monkeyTime;
        }

        if (
          monkeyTime <= 0
        ) {

          clearInterval(
            monkeyTimer
          );

          monkeyRunning =
            false;

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
    ) return;

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

  /* ==========================================================
     PAGE 2 — REMARK
     ========================================================== */

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

          <button
            class="button"
            type="button"
            id="save-remark"
          >
            💾 Save
          </button>

          <button
            class="button"
            type="button"
            id="clear-remarks"
          >
            🗑️ Clear All
          </button>

          <div style="margin-top:10px">

            ${
              remarks.map(
                (remark, index) => `
                  <div
                    class="card"
                    style="margin-bottom:6px"
                  >

                    ${escapeHTML(remark)}

                    <br>

                    <button
                      class="button"
                      type="button"
                      data-delete-remark="${index}"
                    >
                      Delete
                    </button>

                  </div>
                `
              ).join("")
            }

          </div>

        </div>
      `
    );

    document
      .getElementById("save-remark")
      ?.addEventListener(
        "click",
        saveRemark
      );

    document
      .getElementById("clear-remarks")
      ?.addEventListener(
        "click",
        () => {

          remarks = [];

          localStorage.removeItem(
            "pear-remarks"
          );

          remarkApp();
        }
      );

    appWindow
      .querySelectorAll(
        "[data-delete-remark]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            remarks.splice(
              Number(
                button.dataset.deleteRemark
              ),
              1
            );

            localStorage.setItem(
              "pear-remarks",
              JSON.stringify(remarks)
            );

            remarkApp();
          }
        );

      });
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
      JSON.stringify(remarks)
    );

    remarkApp();
  }

  /* ==========================================================
     PAGE 2 — SETTINGS
     ========================================================== */

  function p2SettingsApp() {
    openApp(
      "Settings",
      `
        <div class="card">

          <h2>⚙️ Pear Settings</h2>

          <button
            class="button"
            type="button"
            id="p2-dark"
          >
            🌙 Dark / Light
          </button>

          <button
            class="button"
            type="button"
            id="p2-info"
          >
            📱 Device Info
          </button>

          <button
            class="button"
            type="button"
            id="p2-keyboard"
          >
            ⌨️ Keyboard Test
          </button>

        </div>
      `
    );

    document
      .getElementById("p2-dark")
      ?.addEventListener(
        "click",
        () => {

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
      );

    document
      .getElementById("p2-info")
      ?.addEventListener(
        "click",
        () => {

          openApp(
            "Device Info",
            `
              <div class="card">

                <h2>🍐 Pear Phone</h2>

                <p>
                  Pear Phone OS
                </p>

                <p>
                  Version 2.0
                </p>

                <p>
                  Camera:
                  ${
                    cameraStream
                      ? "Connected 🟢"
                      : "Ready"
                  }
                </p>

                <p>
                  Status:
                  Online 🟢
                </p>

              </div>
            `
          );
        }
      );

    document
      .getElementById("p2-keyboard")
      ?.addEventListener(
        "click",
        () => {

          openApp(
            "Keyboard",
            `
              <div class="card">

                <h2>⌨️ Pear Keyboard</h2>

                <input
                  id="p2-keyboard-input"
                  type="text"
                  placeholder="Tap here and type..."
                >

              </div>
            `
          );

          const input =
            document.getElementById(
              "p2-keyboard-input"
            );

          if (input) {
            input.focus();
            showPearKeyboard(input);
          }
        }
      );
  }

  /* ==========================================================
     PAGE 2 — PHONE
     ========================================================== */

  function p2PhoneApp() {
    openApp(
      "Phone",
      `
        <div class="card">

          <h2>☎️ Phone</h2>

          <button
            class="button"
            type="button"
            data-contact="Pear Support"
          >
            🍐 Pear Support
          </button>

          <button
            class="button"
            type="button"
            data-contact="Mom"
          >
            👩 Mom
          </button>

          <button
            class="button"
            type="button"
            data-contact="Friend"
          >
            👤 Friend
          </button>

          <p
            id="p2-call-status"
            style="
              text-align:center;
              font-weight:800;
            "
          ></p>

          <input
            id="p2-number"
            type="tel"
            placeholder="Phone number"
          >

          <button
            class="button"
            type="button"
            id="p2-call"
          >
            📞 Call
          </button>

        </div>
      `
    );

    appWindow
      .querySelectorAll("[data-contact]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            document
              .getElementById(
                "p2-call-status"
              )
              .textContent =
              `Calling ${
                button.dataset.contact
              }... 📞`;
          }
        );

      });

    document
      .getElementById("p2-call")
      ?.addEventListener(
        "click",
        () => {

          const number =
            document.getElementById(
              "p2-number"
            );

          const status =
            document.getElementById(
              "p2-call-status"
            );

          if (
            !number.value.trim()
          ) {
            status.textContent =
              "Enter a number.";
            return;
          }

          status.textContent =
            `Calling ${number.value}... 📞`;
        }
      );
  }

  /* ==========================================================
     PAGE 2 — MAIL
     ========================================================== */

  function p2MailApp() {
    openApp(
      "Mail",
      `
        <div class="card">

          <h2>✉️ Mail</h2>

          <div class="card">
            <strong>
              🍐 Pear Support
            </strong>
            <br>
            Welcome to Pear OS!
          </div>

          <div class="card">
            <strong>
              🎵 PearTunes
            </strong>
            <br>
            New music is available.
          </div>

          <button
            class="button"
            type="button"
            id="p2-compose"
          >
            ✏️ Compose
          </button>

        </div>
      `
    );

    document
      .getElementById("p2-compose")
      ?.addEventListener(
        "click",
        composeMail
      );
  }

  /* ==========================================================
     PAGE 2 — COMPASS
     ========================================================== */

  function p2CompassApp() {
    openApp(
      "Compass",
      `
        <div class="card">

          <h2>🧭 Compass</h2>

          <div
            id="p2-compass"
            style="
              width:150px;
              height:150px;
              margin:15px auto;
              border:5px solid #111;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:45px;
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
            ${compassDirection()}
          </p>

          <button
            class="button"
            type="button"
            id="p2-calibrate"
          >
            🔄 Calibrate
          </button>

        </div>
      `
    );

    document
      .getElementById("p2-calibrate")
      ?.addEventListener(
        "click",
        () => {

          compassHeading =
            Math.floor(
              Math.random() * 360
            );

          const compass =
            document.getElementById(
              "p2-compass"
            );

          compass.style.transform =
            `rotate(${compassHeading}deg)`;

          document
            .getElementById(
              "p2-heading"
            )
            .textContent =
            `${compassHeading}°`;

          document
            .getElementById(
              "p2-direction"
            )
            .textContent =
            compassDirection();
        }
      );
  }

  /* ==========================================================
     PAGE 2 MUSIC
     ========================================================== */

  function p2MusicApp() {
    pearTunesApp();
  }

  /* ==========================================================
     EXACT APP ROUTING
     ========================================================== */

  const page1Apps = {
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

  const page2Apps = {
    "p2-lingo": lingoApp,
    "p2-splash": p2SplashApp,
    "p2-thumb": thumbApp,
    "p2-danwarp": danwarpApp,
    "p2-image": imageApp,
    "p2-chrono": chronoApp,
    "p2-zaplook": zaplookApp,
    "p2-weather": weatherApp,
    "p2-music": p2MusicApp,
    "p2-monkey": monkeyApp,
    "p2-remark": remarkApp,
    "p2-settings": p2SettingsApp,
    "p2-phone": p2PhoneApp,
    "p2-mail": p2MailApp,
    "p2-compass": p2CompassApp,
    "p2-music2": p2MusicApp
  };

  /* ==========================================================
     BIND EACH ICON ONCE
     ========================================================== */

  function bindAppButtons(appMap) {
    Object.entries(appMap).forEach(
      ([id, appFunction]) => {

        const button =
          document.getElementById(id);

        if (!button) {
          console.warn(
            "Pear Phone: missing hotspot:",
            id
          );
          return;
        }

        button.addEventListener(
          "click",
          event => {

            event.preventDefault();
            event.stopPropagation();

            appFunction();
          }
        );

        button.addEventListener(
          "touchend",
          event => {

            event.preventDefault();
            event.stopPropagation();

            appFunction();
          },
          { passive: false }
        );
      }
    );
  }

  bindAppButtons(page1Apps);
  bindAppButtons(page2Apps);

  /* ==========================================================
     INPUT KEYBOARD — ONLY AFTER USER CLICKS/TAPS INPUT
     ========================================================== */

  document.addEventListener(
    "focusin",
    event => {

      const target =
        event.target;

      if (!target) return;

      if (
        target.matches(
          "#overlay input:not([type='file']), #overlay textarea"
        )
      ) {
        showPearKeyboard(target);
      }
    }
  );

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
        target.matches(
          "#overlay input:not([type='file']), #overlay textarea"
        )
      ) {

        event.preventDefault();

        hidePearKeyboard();

        target.blur();
      }
    }
  );

  /* ==========================================================
     DON'T LET APP WINDOW SWIPES CHANGE PAGES
     ========================================================== */

  overlay.addEventListener(
    "touchstart",
    event => {
      event.stopPropagation();
    },
    { passive: true }
  );

  overlay.addEventListener(
    "touchmove",
    event => {
      event.stopPropagation();
    },
    { passive: true }
  );

  overlay.addEventListener(
    "touchend",
    event => {
      event.stopPropagation();
    },
    { passive: true }
  );

  /* ==========================================================
     RESTORE DARK MODE
     ========================================================== */

  if (
    localStorage.getItem(
      "pear-dark"
    ) === "true"
  ) {
    document.body.classList.add(
      "dark-mode"
    );
  }

  /* ==========================================================
     START ON PAGE 1
     ========================================================== */

  phone.classList.remove(
    "page-two"
  );

  currentPage = 1;

  console.log(
    "🍐 Pear Phone OS loaded successfully."
  );

})();
