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

let pointerStartX = 0;

let pointerStartY = 0;

let pointerActive = false;

function showPage(page) {

  if (page === currentPage) return;

  currentPage = page;

  phone.classList.toggle(
    "page-two",
    page === 2
  );

  if (pageDots) {

    pageDots.textContent =
      page === 2 ? "○ ●" : "● ○";

  }

  closeApp();

}

// Keyboard page switching

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

// ============================================================
// TOUCH / TRACKPAD / MOUSE SWIPING
// ============================================================

phone.addEventListener(
  "pointerdown",
  e => {

    if (
      overlay.classList.contains("open")
    ) return;

    pointerStartX = e.clientX;

    pointerStartY = e.clientY;

    pointerActive = true;

  },
  {
    passive: true
  }
);

phone.addEventListener(
  "pointerup",
  e => {

    if (!pointerActive) return;

    pointerActive = false;

    if (
      overlay.classList.contains("open")
    ) return;

    const dx =
      e.clientX - pointerStartX;

    const dy =
      e.clientY - pointerStartY;

    // Ignore tiny movements

    if (Math.abs(dy) < 60) return;

    // Must be mostly vertical

    if (
      Math.abs(dy) <= Math.abs(dx)
    ) return;

    // Swipe UP = Page 2

    if (
      dy < 0 &&
      currentPage === 1
    ) {

      showPage(2);

      return;

    }

    // Swipe DOWN = Page 1

    if (
      dy > 0 &&
      currentPage === 2
    ) {

      showPage(1);

    }

  },
  {
    passive: true
  }
);

// ============================================================
// APP SYSTEM
// ============================================================

function openApp(title, content) {

  // Always remove the keyboard before
  // opening another application.

  hidePearKeyboard(true);

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

  hidePearKeyboard(true);

  overlay.classList.remove("open");

  appWindow.innerHTML = "";

}

// ============================================================
// CUSTOM PEAR KEYBOARD
// ============================================================

let keyboardVisible = false;

let keyboardShift = false;

let keyboardTarget = null;

function addKeyboardSupport() {

  setTimeout(() => {

    const fields =
      appWindow.querySelectorAll(
        "input[type='text'], input:not([type]), textarea"
      );

    fields.forEach(field => {

      // Keyboard appears when the user
      // actually taps/clicks the text field.

      field.addEventListener(
        "click",
        () => {

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

  if (!input) return;

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
              `<button
                type="button"
                onclick="keyboardKey('${k}')"
              >${k}</button>`
          )
          .join("")}

      </div>

      <div class="pear-keyboard-row">

        ${"ASDFGHJKL"
          .split("")
          .map(
            k =>
              `<button
                type="button"
                onclick="keyboardKey('${k}')"
              >${k}</button>`
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
              `<button
                type="button"
                onclick="keyboardKey('${k}')"
              >${k}</button>`
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

    // IMPORTANT:
    // Keep the keyboard inside the Pear Phone
    // app overlay. Do NOT append it to body.

    overlay.appendChild(keyboard);

    // Prevent keyboard buttons from stealing
    // focus from the active text field.

    keyboard.addEventListener(
      "pointerdown",
      e => {

        if (
          e.target.closest("button")
        ) {

          e.preventDefault();

        }

      }
    );

  }

  keyboard.style.display = "block";

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

  keyboardTarget = null;

  if (!keyboard) return;

  keyboard.classList.remove(
    "keyboard-show"
  );

  if (immediate) {

    keyboard.style.display = "none";

  } else {

    setTimeout(() => {

      if (!keyboardVisible) {

        keyboard.style.display =
          "none";

      }

    }, 250);

  }

}

function getFocusedField() {

  if (

    keyboardTarget &&

    document.contains(
      keyboardTarget
    ) &&

    (
      keyboardTarget.tagName ===
        "INPUT" ||

      keyboardTarget.tagName ===
        "TEXTAREA"
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

      active.tagName ===
        "TEXTAREA"
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

  const character =
    keyboardShift
      ? key
      : key.toLowerCase();

  insertText(
    field,
    character
  );

  keyboardShift = false;

}

function insertText(
  field,
  text
) {

  const start =
    field.selectionStart;

  const end =
    field.selectionEnd;

  field.value =
    field.value.substring(
      0,
      start
    ) +

    text +

    field.value.substring(
      end
    );

  field.selectionStart =
    field.selectionEnd =
      start + text.length;

  field.dispatchEvent(
    new Event(
      "input",
      {
        bubbles: true
      }
    )
  );

}

function keyboardBackspace() {

  const field =
    getFocusedField();

  if (!field) return;

  const start =
    field.selectionStart;

  const end =
    field.selectionEnd;

  if (
    start === 0 &&
    end === 0
  ) return;

  if (start !== end) {

    field.value =
      field.value.substring(
        0,
        start
      ) +

      field.value.substring(
        end
      );

    field.selectionStart =
      field.selectionEnd =
        start;

  } else {

    field.value =
      field.value.substring(
        0,
        start - 1
      ) +

      field.value.substring(
        start
      );

    field.selectionStart =
      field.selectionEnd =
        start - 1;

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

  // Enter should make the keyboard
  // disappear like it did before.

  if (
    field.tagName !== "TEXTAREA"
  ) {

    field.blur();

  }

  hidePearKeyboard(true);

}

// ============================================================
// MESSAGES
// ============================================================

let messageThreads = [

  {
    name: "Alex",
    avatar: "🧑",
    messages: [
      {
        from: "them",
        text: "Yo! You using the Pear Phone?"
      },
      {
        from: "me",
        text: "Obviously 😂"
      }
    ]
  },

  {
    name: "Sam",
    avatar: "👩",
    messages: [
      {
        from: "them",
        text: "Are you coming later?"
      }
    ]
  },

  {
    name: "Jordan",
    avatar: "🧑‍💻",
    messages: [
      {
        from: "them",
        text: "This phone is insane."
      }
    ]
  }

];

function messagesApp() {

  renderMessages();

}

function renderMessages() {

  openApp(
    "Messages",
    `

      <div class="card">

        <h2>
          💬 Messages
        </h2>

        <div
          id="message-list"
        >

          ${messageThreads
            .map(
              (thread, i) => `

                <button
                  class="list-button"
                  onclick="
                    openMessageThread(${i})
                  "
                >

                  <span
                    style="
                      font-size:28px;
                      margin-right:8px;
                    "
                  >
                    ${thread.avatar}
                  </span>

                  <span
                    style="
                      flex:1;
                      text-align:left;
                    "
                  >

                    <strong>
                      ${escapeHTML(
                        thread.name
                      )}
                    </strong>

                    <small
                      style="
                        display:block;
                        opacity:.65;
                      "
                    >
                      ${
                        thread.messages[
                          thread.messages.length - 1
                        ].text
                      }
                    </small>

                  </span>

                  <span>
                    ›
                  </span>

                </button>

              `
            )
            .join("")}

        </div>

      </div>

    `
  );

}

function openMessageThread(index) {

  const thread =
    messageThreads[index];

  openApp(
    thread.name,
    `

      <div
        class="card"
        style="
          display:flex;
          flex-direction:column;
          height:100%;
        "
      >

        <div
          id="chat-messages"
          style="
            flex:1;
            overflow:auto;
            padding:8px;
          "
        >

          ${thread.messages
            .map(
              msg => `

                <div
                  style="
                    display:flex;
                    justify-content:
                      ${
                        msg.from === "me"
                          ? "flex-end"
                          : "flex-start"
                      };
                    margin:7px 0;
                  "
                >

                  <div
                    style="
                      max-width:78%;
                      padding:9px 12px;
                      border-radius:16px;
                      background:
                        ${
                          msg.from === "me"
                            ? "#d9eaff"
                            : "#e9e9e9"
                        };
                      color:#111;
                    "
                  >

                    ${escapeHTML(
                      msg.text
                    )}

                  </div>

                </div>

              `
            )
            .join("")}

        </div>

        <div
          style="
            display:flex;
            gap:5px;
            margin-top:7px;
          "
        >

          <input
            id="message-input"
            type="text"
            placeholder="Message..."
            style="
              flex:1;
              padding:9px;
              border-radius:14px;
              border:1px solid #bbb;
            "
          >

          <button
            class="action-button"
            onclick="
              sendMessage(${index})
            "
          >
            Send
          </button>

        </div>

      </div>

    `
  );

}

function sendMessage(index) {

  const input =
    document.getElementById(
      "message-input"
    );

  if (!input) return;

  const text =
    input.value.trim();

  if (!text) return;

  messageThreads[index].messages.push({
    from: "me",
    text
  });

  openMessageThread(index);

}

// ============================================================
// CAMERA
// ============================================================

let cameraStream = null;

let currentCameraFacing =
  "environment";

function cameraApp() {

  openApp(
    "Camera",
    `

      <div
        class="card"
        style="
          display:flex;
          flex-direction:column;
          gap:8px;
          height:100%;
        "
      >

        <h2>
          📷 Camera
        </h2>

        <video
          id="camera-video"
          autoplay
          playsinline
          muted
          style="
            width:100%;
            flex:1;
            min-height:0;
            object-fit:cover;
            border-radius:10px;
            background:#111;
          "
        ></video>

        <div
          style="
            display:flex;
            gap:6px;
            flex-wrap:wrap;
          "
        >

          <button
            class="action-button"
            onclick="startCamera()"
          >
            Start Camera
          </button>

          <button
            class="action-button"
            onclick="capturePhoto()"
          >
            Capture
          </button>

          <button
            class="action-button"
            onclick="flipCamera()"
          >
            Flip
          </button>

        </div>

        <canvas
          id="camera-canvas"
          style="
            display:none;
          "
        ></canvas>

        <div
          id="camera-result"
        ></div>

      </div>

    `
  );

}

async function startCamera() {

  const video =
    document.getElementById(
      "camera-video"
    );

  if (!video) return;

  stopCamera();

  try {

    cameraStream =
      await navigator.mediaDevices
        .getUserMedia({

          video: {
            facingMode:
              currentCameraFacing
          },

          audio: false

        });

    video.srcObject =
      cameraStream;

    await video.play();

  } catch (error) {

    try {

      cameraStream =
        await navigator.mediaDevices
          .getUserMedia({

            video: true,

            audio: false

          });

      video.srcObject =
        cameraStream;

      await video.play();

    } catch (fallbackError) {

      const result =
        document.getElementById(
          "camera-result"
        );

      if (result) {

        result.innerHTML = `

          <div
            class="card"
            style="
              color:#b00020;
            "
          >

            Camera could not be started.

            <br><br>

            Make sure the camera is
            connected and permission
            is allowed for this page.

          </div>

        `;

      }

    }

  }

}

function stopCamera() {

  if (!cameraStream) return;

  cameraStream
    .getTracks()
    .forEach(
      track => track.stop()
    );

  cameraStream = null;

}

function flipCamera() {

  currentCameraFacing =
    currentCameraFacing ===
      "environment"
      ? "user"
      : "environment";

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

  const result =
    document.getElementById(
      "camera-result"
    );

  if (
    !video ||
    !canvas ||
    !video.videoWidth
  ) {

    if (result) {

      result.innerHTML = `
        <div class="card">
          Start the camera first.
        </div>
      `;

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

  const image =
    canvas.toDataURL(
      "image/png"
    );

  if (result) {

    result.innerHTML = `

      <div class="card">

        <h3>
          Captured Photo
        </h3>

        <img
          src="${image}"
          style="
            width:100%;
            border-radius:10px;
          "
        >

        <a
          class="action-button"
          href="${image}"
          download="pear-photo.png"
          style="
            display:inline-block;
            margin-top:7px;
            text-decoration:none;
          "
        >
          Save PNG
        </a>

      </div>

    `;

  }

}

// ============================================================
// PHOTOS
// ============================================================

let savedPhotos = [];

function photosApp() {

  openApp(
    "Photos",
    `

      <div class="card">

        <h2>
          🖼️ Photos
        </h2>

        <p>
          Your Pear Phone photo library.
        </p>

        <div
          id="photo-grid"
          style="
            display:grid;
            grid-template-columns:
              repeat(2,1fr);
            gap:7px;
          "
        >

          ${
            savedPhotos.length
              ? savedPhotos
                  .map(
                    img => `
                      <img
                        src="${img}"
                        style="
                          width:100%;
                          aspect-ratio:1;
                          object-fit:cover;
                          border-radius:8px;
                        "
                      >
                    `
                  )
                  .join("")
              : `
                <div
                  class="card"
                  style="
                    grid-column:1/-1;
                  "
                >
                  No photos yet.
                  Take one with Camera.
                </div>
              `
          }

        </div>

      </div>

    `
  );

}

// ============================================================
// SPLASHFACE
// ============================================================

let splashPosts = [

  {
    user: "logan",
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
          class="action-button"
          onclick="newSplashPost()"
        >
          + New Post
        </button>

      </div>

      <div
        id="splash-posts"
      >

        ${splashPosts
          .map(
            (post, i) => `

              <div
                class="card"
                style="
                  margin-top:8px;
                "
              >

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
                  class="action-button"
                  onclick="
                    likeSplashPost(${i})
                  "
                >
                  ❤️ ${post.likes}
                </button>

                <button
                  class="action-button"
                  onclick="
                    commentSplashPost(${i})
                  "
                >
                  💬 Comments
                </button>

              </div>

            `
          )
          .join("")}

      </div>

    `
  );

}

function newSplashPost() {

  openApp(
    "New SplashFace Post",
    `

      <div class="card">

        <h2>
          Create Post
        </h2>

        <textarea
          id="splash-new-post"
          placeholder="What's happening?"
          style="
            width:100%;
            min-height:90px;
            resize:none;
            box-sizing:border-box;
            padding:10px;
            border-radius:10px;
            border:1px solid #aaa;
          "
        ></textarea>

        <button
          class="action-button"
          onclick="submitSplashPost()"
        >
          Post
        </button>

      </div>

    `
  );

}

function submitSplashPost() {

  const input =
    document.getElementById(
      "splash-new-post"
    );

  if (!input) return;

  const text =
    input.value.trim();

  if (!text) return;

  splashPosts.unshift({

    user: "logan",

    text,

    likes: 0,

    comments: []

  });

  renderSplashface();

}

function likeSplashPost(index) {

  splashPosts[index].likes++;

  renderSplashface();

}

function commentSplashPost(index) {

  openApp(
    "Comments",
    `

      <div class="card">

        <h2>
          💬 Comments
        </h2>

        <div>

          ${
            splashPosts[index]
              .comments.length

              ? splashPosts[index]
                  .comments
                  .map(
                    c => `
                      <div
                        style="
                          padding:6px 0;
                          border-bottom:
                            1px solid #ddd;
                        "
                      >
                        <strong>
                          @${escapeHTML(
                            c.user
                          )}
                        </strong>

                        ${escapeHTML(
                          c.text
                        )}

                      </div>
                    `
                  )
                  .join("")

              : `
                <p>
                  No comments yet.
                </p>
              `
          }

        </div>

        <input
          id="splash-comment"
          type="text"
          placeholder="Write a comment..."
          style="
            width:100%;
            box-sizing:border-box;
            margin-top:8px;
            padding:9px;
            border-radius:10px;
            border:1px solid #aaa;
          "
        >

        <button
          class="action-button"
          onclick="
            submitSplashComment(${index})
          "
        >
          Comment
        </button>

      </div>

    `
  );

}

function submitSplashComment(index) {

  const input =
    document.getElementById(
      "splash-comment"
    );

  if (!input) return;

  const text =
    input.value.trim();

  if (!text) return;

  splashPosts[index]
    .comments
    .push({

      user: "logan",

      text

    });

  commentSplashPost(index);

}

// ============================================================
// STOCKS
// ============================================================

const stockData = {

  AAPL: {
    name: "Apple",
    price: 227.31,
    change: 1.42
  },

  PPL: {
    name: "Pear Labs",
    price: 84.19,
    change: 4.72
  },

  RPI: {
    name: "Raspberry Industries",
    price: 41.88,
    change: -1.12
  },

  TSLA: {
    name: "Tesla",
    price: 348.77,
    change: 2.31
  }

};

function stocksApp() {

  openApp(
    "Stocks",
    `

      <div class="card">

        <h2>
          📈 Stocks
        </h2>

        ${Object.keys(stockData)
          .map(symbol => {

            const stock =
              stockData[symbol];

            const positive =
              stock.change >= 0;

            return `

              <button
                class="list-button"
                onclick="
                  stockDetails('${symbol}')
                "
              >

                <span>

                  <strong>
                    ${symbol}
                  </strong>

                  <small
                    style="
                      display:block;
                      opacity:.65;
                    "
                  >
                    ${stock.name}
                  </small>

                </span>

                <span>

                  $${stock.price.toFixed(2)}

                  <small
                    style="
                      display:block;
                      color:
                        ${
                          positive
                            ? "#14833b"
                            : "#c62828"
                        };
                    "
                  >
                    ${
                      positive
                        ? "+"
                        : ""
                    }${stock.change}%
                  </small>

                </span>

              </button>

            `;

          })
          .join("")}

      </div>

    `
  );

}

function stockDetails(symbol) {

  const stock =
    stockData[symbol];

  openApp(
    symbol,
    `

      <div class="card">

        <h2>
          ${stock.name}
        </h2>

        <div
          style="
            font-size:32px;
            font-weight:bold;
            margin:10px 0;
          "
        >
          $${stock.price.toFixed(2)}
        </div>

        <div
          style="
            font-size:18px;
            color:
              ${
                stock.change >= 0
                  ? "#14833b"
                  : "#c62828"
              };
          "
        >
          ${
            stock.change >= 0
              ? "+"
              : ""
          }${stock.change}%
        </div>

        <div
          style="
            height:130px;
            margin-top:12px;
            border-radius:10px;
            background:
              linear-gradient(
                135deg,
                #dfe8ff,
                #f7f7f7
              );
            position:relative;
            overflow:hidden;
          "
        >

          <svg
            viewBox="0 0 300 130"
            preserveAspectRatio="none"
            style="
              width:100%;
              height:100%;
            "
          >

            <polyline
              points="
                0,100
                35,86
                65,93
                92,58
                120,70
                150,38
                180,52
                210,28
                240,42
                270,18
                300,25
              "
              fill="none"
              stroke="#3767c7"
              stroke-width="4"
            />

          </svg>

        </div>

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

        <h2>
          🗺️ Pear Maps
        </h2>

        <p>
          Explore the Pear Phone world.
        </p>

        <div
          style="
            height:190px;
            border-radius:12px;
            overflow:hidden;
            background:
              linear-gradient(
                135deg,
                #d9ecff,
                #d9f4dc
              );
            position:relative;
          "
        >

          <div
            style="
              position:absolute;
              width:65%;
              height:4px;
              background:#fff;
              transform:
                rotate(-25deg);
              top:50%;
              left:15%;
            "
          ></div>

          <div
            style="
              position:absolute;
              width:4px;
              height:80%;
              background:#fff;
              transform:
                rotate(18deg);
              top:10%;
              left:48%;
            "
          ></div>

          <div
            style="
              position:absolute;
              left:48%;
              top:44%;
              font-size:32px;
            "
          >
            📍
          </div>

        </div>

        <input
          id="map-search"
          type="text"
          placeholder="Search location..."
          style="
            width:100%;
            box-sizing:border-box;
            padding:9px;
            margin-top:8px;
            border-radius:10px;
            border:1px solid #aaa;
          "
        >

        <button
          class="action-button"
          onclick="searchMap()"
        >
          Search
        </button>

        <div
          id="map-result"
          style="
            margin-top:8px;
          "
        ></div>

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

  if (!input || !result) return;

  const value =
    input.value.trim();

  if (!value) {

    result.innerHTML =
      "Type a location first.";

    return;

  }

  result.innerHTML = `

    <div class="card">

      📍

      <strong>
        ${escapeHTML(value)}
      </strong>

      <br>

      Location found in
      Pear Maps.

    </div>

  `;

}

// ============================================================
// WEATHER
// ============================================================

function weatherApp() {

  const weather =
    [
      {
        day: "Today",
        icon: "☀️",
        temp: "24°"
      },

      {
        day: "Tomorrow",
        icon: "🌤️",
        temp: "22°"
      },

      {
        day: "Friday",
        icon: "🌧️",
        temp: "18°"
      },

      {
        day: "Saturday",
        icon: "⛅",
        temp: "21°"
      }

    ];

  openApp(
    "Weather",
    `

      <div class="card">

        <h2>
          ☀️ Pear Weather
        </h2>

        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(2,1fr);
            gap:7px;
          "
        >

          ${weather
            .map(
              item => `

                <div
                  class="card"
                  style="
                    text-align:center;
                  "
                >

                  <strong>
                    ${item.day}
                  </strong>

                  <div
                    style="
                      font-size:34px;
                      margin:5px 0;
                    "
                  >
                    ${item.icon}
                  </div>

                  <strong>
                    ${item.temp}
                  </strong>

                </div>

              `
            )
            .join("")}

        </div>

        <button
          class="action-button"
          onclick="weatherDetails()"
        >
          Detailed Forecast
        </button>

      </div>

    `
  );

}

function weatherDetails() {

  openApp(
    "Detailed Weather",
    `

      <div class="card">

        <h2>
          🌤️ Forecast Details
        </h2>

        <p>
          Temperature: 24°C
        </p>

        <p>
          Feels like: 25°C
        </p>

        <p>
          Humidity: 54%
        </p>

        <p>
          Wind: 12 km/h
        </p>

        <p>
          UV Index: Moderate
        </p>

        <p>
          Visibility: Excellent
        </p>

      </div>

    `
  );

}

// ============================================================
// NOTES
// ============================================================

let savedNotes = [];

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
          style="
            width:100%;
            min-height:100px;
            box-sizing:border-box;
            padding:10px;
            resize:none;
            border-radius:10px;
            border:1px solid #aaa;
          "
        ></textarea>

        <button
          class="action-button"
          onclick="saveNote()"
        >
          Save Note
        </button>

      </div>

      <div
        class="card"
        style="
          margin-top:8px;
        "
      >

        <h3>
          Saved Notes
        </h3>

        <div
          id="saved-notes"
        >

          ${
            savedNotes.length
              ? savedNotes
                  .map(
                    (note, i) => `

                      <div
                        style="
                          padding:8px 0;
                          border-bottom:
                            1px solid #ddd;
                        "
                      >

                        ${escapeHTML(
                          note
                        )}

                        <button
                          class="action-button"
                          onclick="
                            deleteNote(${i})
                          "
                        >
                          Delete
                        </button>

                      </div>

                    `
                  )
                  .join("")
              : `
                <p>
                  No saved notes.
                </p>
              `
          }

        </div>

      </div>

    `
  );

}

function saveNote() {

  const input =
    document.getElementById(
      "note-text"
    );

  if (!input) return;

  const text =
    input.value.trim();

  if (!text) return;

  savedNotes.unshift(text);

  notesApp();

}

function deleteNote(index) {

  savedNotes.splice(
    index,
    1
  );

  notesApp();

}

// ============================================================
// CLOCK
// ============================================================

let clockInterval = null;

function clockApp() {

  openApp(
    "Clock",
    `

      <div class="card">

        <h2>
          🕐 Pear Clock
        </h2>

        <div
          id="clock-display"
          style="
            text-align:center;
            font-size:38px;
            font-weight:bold;
            margin:20px 0;
          "
        ></div>

        <div
          id="clock-date"
          style="
            text-align:center;
            opacity:.7;
          "
        ></div>

      </div>

    `
  );

  updateClock();

  clearInterval(
    clockInterval
  );

  clockInterval =
    setInterval(
      updateClock,
      1000
    );

}

function updateClock() {

  const display =
    document.getElementById(
      "clock-display"
    );

  const date =
    document.getElementById(
      "clock-date"
    );

  if (!display) {

    clearInterval(
      clockInterval
    );

    return;

  }

  const now =
    new Date();

  display.textContent =
    now.toLocaleTimeString(
      [],
      {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      }
    );

  if (date) {

    date.textContent =
      now.toLocaleDateString(
        [],
        {
          weekday: "long",
          month: "long",
          day: "numeric"
        }
      );

  }

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

        <button
          class="list-button"
          onclick="togglePearDark()"
        >

          <span>
            Dark Mode
          </span>

          <span>
            ${

              localStorage.getItem(
                "pear-dark"
              ) === "true"
                ? "ON"
                : "OFF"

            }
          </span>

        </button>

        <button
          class="list-button"
          onclick="togglePearAnimations()"
        >

          <span>
            Animations
          </span>

          <span>
            ${

              localStorage.getItem(
                "pear-animations"
              ) === "true"
                ? "ON"
                : "OFF"

            }
          </span>

        </button>

        <button
          class="list-button"
          onclick="aboutPearPhone()"
        >

          <span>
            About Pear Phone
          </span>

          <span>
            ›
          </span>

        </button>

      </div>

    `
  );

}

function togglePearDark() {

  const enabled =
    localStorage.getItem(
      "pear-dark"
    ) === "true";

  localStorage.setItem(
    "pear-dark",
    enabled ? "false" : "true"
  );

  document.body.classList.toggle(
    "dark-mode",
    !enabled
  );

  settingsApp();

}

function togglePearAnimations() {

  const enabled =
    localStorage.getItem(
      "pear-animations"
    ) === "true";

  localStorage.setItem(
    "pear-animations",
    enabled ? "false" : "true"
  );

  document.body.classList.toggle(
    "no-animations",
    !enabled
  );

  settingsApp();

}

function aboutPearPhone() {

  openApp(
    "About Pear Phone",
    `

      <div class="card">

        <h2>
          🍐 Pear Phone OS
        </h2>

        <p>
          A fully interactive Pear Phone
          interface running on your
          Raspberry Pi.
        </p>

        <p>
          Version 1.0
        </p>

        <p>
          Built for the Pear Phone
          touchscreen experience.
        </p>

      </div>

    `
  );

}

// ============================================================
// PEARTUNES
// ============================================================

let audioContext = null;

let currentTone = null;

let currentSong = null;

function pearTunesApp() {

  openApp(
    "PearTunes",
    `

      <div class="card">

        <h2>
          🎵 PearTunes
        </h2>

        <div
          id="music-now"
          style="
            padding:12px;
            text-align:center;
            border-radius:10px;
            background:
              rgba(0,0,0,.06);
          "
        >

          Nothing playing

        </div>

        <button
          class="list-button"
          onclick="
            playPearTone(
              'Midnight Pear'
            )
          "
        >

          <span>
            🎵 Midnight Pear
          </span>

          <span>
            ▶
          </span>

        </button>

        <button
          class="list-button"
          onclick="
            playPearTone(
              'Pear Dreams'
            )
          "
        >

          <span>
            🎵 Pear Dreams
          </span>

          <span>
            ▶
          </span>

        </button>

        <button
          class="list-button"
          onclick="
            playPearTone(
              'Raspberry Drive'
            )
          "
        >

          <span>
            🎵 Raspberry Drive
          </span>

          <span>
            ▶
          </span>

        </button>

        <button
          class="action-button"
          onclick="stopPearTone()"
        >
          Stop
        </button>

      </div>

    `
  );

}

function playPearTone(song) {

  currentSong = song;

  const now =
    document.getElementById(
      "music-now"
    );

  if (now) {

    now.innerHTML = `
      <strong>
        ▶ ${escapeHTML(song)}
      </strong>
      <br>
      <small>
        Now Playing
      </small>
    `;

  }

  try {

    if (!audioContext) {

      audioContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

    }

    if (currentTone) {

      currentTone.stop();

    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type =
      "sine";

    oscillator.frequency.value =
      song === "Midnight Pear"
        ? 440
        : song === "Pear Dreams"
          ? 523.25
          : 659.25;

    gain.gain.value =
      0.06;

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start();

    currentTone =
      oscillator;

  } catch (error) {

    // Audio is optional.

  }

}

function stopPearTone() {

  if (currentTone) {

    try {

      currentTone.stop();

    } catch (e) {}

    currentTone = null;

  }

  const now =
    document.getElementById(
      "music-now"
    );

  if (now) {

    now.innerHTML =
      "Nothing playing";

  }

}

// ============================================================
// PHONE
// ============================================================

function phoneApp() {

  openApp(
    "Phone",
    `

      <div class="card">

        <h2>
          📞 Pear Phone
        </h2>

        <div
          id="phone-number"
          style="
            font-size:28px;
            text-align:center;
            min-height:40px;
            margin:10px;
          "
        >
          Enter number
        </div>

        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(3,1fr);
            gap:6px;
          "
        >

          ${[
            "1","2","3",
            "4","5","6",
            "7","8","9",
            "*","0","#"
          ]
            .map(
              number => `

                <button
                  class="action-button"
                  onclick="
                    addPhoneDigit(
                      '${number}'
                    )
                  "
                  style="
                    font-size:20px;
                  "
                >
                  ${number}
                </button>

              `
            )
            .join("")}

        </div>

        <button
          class="action-button"
          onclick="callNumber()"
        >
          📞 Call
        </button>

      </div>

    `
  );

}

function addPhoneDigit(digit) {

  const display =
    document.getElementById(
      "phone-number"
    );

  if (!display) return;

  if (
    display.textContent ===
    "Enter number"
  ) {

    display.textContent = "";

  }

  display.textContent +=
    digit;

}

function callNumber() {

  const display =
    document.getElementById(
      "phone-number"
    );

  if (!display) return;

  const number =
    display.textContent;

  if (
    !number ||
    number === "Enter number"
  ) return;

  alert(
    `Calling ${number}...`
  );

}

// ============================================================
// MAIL
// ============================================================

const mailMessages = [

  {
    from: "Pear Team",
    subject: "Welcome!",
    body:
      "Welcome to Pear Phone OS."
  },

  {
    from: "Raspberry Pi",
    subject: "System Ready",
    body:
      "Your Raspberry Pi is ready."
  },

  {
    from: "SplashFace",
    subject: "New follower",
    body:
      "Someone followed your profile."
  }

];

function mailApp() {

  openApp(
    "Mail",
    `

      <div class="card">

        <h2>
          ✉️ Mail
        </h2>

        ${mailMessages
          .map(
            (mail, i) => `

              <button
                class="list-button"
                onclick="
                  openMail(${i})
                "
              >

                <span
                  style="
                    text-align:left;
                  "
                >

                  <strong>
                    ${escapeHTML(
                      mail.from
                    )}
                  </strong>

                  <small
                    style="
                      display:block;
                      opacity:.65;
                    "
                  >
                    ${escapeHTML(
                      mail.subject
                    )}
                  </small>

                </span>

                <span>
                  ›
                </span>

              </button>

            `
          )
          .join("")}

      </div>

    `
  );

}

function openMail(index) {

  const mail =
    mailMessages[index];

  openApp(
    mail.subject,
    `

      <div class="card">

        <h2>
          ${escapeHTML(
            mail.subject
          )}
        </h2>

        <p>
          <strong>
            From:
          </strong>

          ${escapeHTML(
            mail.from
          )}
        </p>

        <hr>

        <p>
          ${escapeHTML(
            mail.body
          )}
        </p>

      </div>

    `
  );

}

// ============================================================
// COMPASS
// ============================================================

let compassInterval = null;

function compassApp() {

  openApp(
    "Compass",
    `

      <div class="card">

        <h2>
          🧭 Compass
        </h2>

        <div
          style="
            width:180px;
            height:180px;
            border-radius:50%;
            border:6px solid #222;
            margin:15px auto;
            position:relative;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#fafafa;
          "
          id="compass-face"
        >

          <div
            style="
              font-size:34px;
              font-weight:bold;
            "
            id="compass-heading"
          >
            N
          </div>

        </div>

        <div
          id="compass-degrees"
          style="
            text-align:center;
            font-size:20px;
          "
        >
          0°
        </div>

      </div>

    `
  );

  updateCompass();

  clearInterval(
    compassInterval
  );

  compassInterval =
    setInterval(
      updateCompass,
      500
    );

}

function updateCompass() {

  const degrees =
    document.getElementById(
      "compass-degrees"
    );

  const heading =
    document.getElementById(
      "compass-heading"
    );

  if (!degrees || !heading) {

    clearInterval(
      compassInterval
    );

    return;

  }

  const value =
    Math.floor(
      Math.random() * 360
    );

  degrees.textContent =
    `${value}°`;

  if (
    value < 45 ||
    value >= 315
  ) {

    heading.textContent = "N";

  } else if (
    value < 135
  ) {

    heading.textContent = "E";

  } else if (
    value < 225
  ) {

    heading.textContent = "S";

  } else {

    heading.textContent = "W";

  }

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
          🎬 Pear Videos
        </h2>

        <div
          class="card"
          style="
            text-align:center;
            padding:25px;
          "
        >

          ▶️

          <h3>
            No videos yet
          </h3>

          <p>
            Videos you record with the
            camera can appear here.
          </p>

        </div>

      </div>

    `
  );

}

// ============================================================
// END OF PART 1
// ============================================================
// ============================================================
// WEATHER DETAILS / EXTRA WEATHER FEATURES
// ============================================================

function detailedWeatherApp() {

  openApp(
    "Weather Details",
    `

      <div class="card">

        <h2>
          🌤️ Detailed Forecast
        </h2>

        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(2,1fr);
            gap:7px;
          "
        >

          <div class="card">
            <strong>Temperature</strong>
            <div
              style="
                font-size:24px;
                margin-top:5px;
              "
            >
              24°C
            </div>
          </div>

          <div class="card">
            <strong>Feels Like</strong>
            <div
              style="
                font-size:24px;
                margin-top:5px;
              "
            >
              25°C
            </div>
          </div>

          <div class="card">
            <strong>Humidity</strong>
            <div
              style="
                font-size:24px;
                margin-top:5px;
              "
            >
              54%
            </div>
          </div>

          <div class="card">
            <strong>Wind</strong>
            <div
              style="
                font-size:24px;
                margin-top:5px;
              "
            >
              12 km/h
            </div>
          </div>

        </div>

      </div>

      <div class="card">

        <h3>
          Hourly Forecast
        </h3>

        <div
          style="
            display:flex;
            gap:7px;
            overflow-x:auto;
            padding-bottom:4px;
          "
        >

          ${[
            ["Now","☀️","24°"],
            ["1 PM","☀️","25°"],
            ["2 PM","🌤️","25°"],
            ["3 PM","🌤️","24°"],
            ["4 PM","⛅","23°"],
            ["5 PM","⛅","22°"]
          ]
            .map(
              item => `

                <div
                  class="card"
                  style="
                    min-width:62px;
                    text-align:center;
                  "
                >

                  <strong>
                    ${item[0]}
                  </strong>

                  <div
                    style="
                      font-size:24px;
                      margin:5px 0;
                    "
                  >
                    ${item[1]}
                  </div>

                  <strong>
                    ${item[2]}
                  </strong>

                </div>

              `
            )
            .join("")}

        </div>

      </div>

    `
  );

}

// ============================================================
// MUSIC PLAYER
// ============================================================

let musicPlaying = false;

let musicProgress = 0;

let musicInterval = null;

function musicPlayerApp() {

  openApp(
    "Music Player",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <div
          style="
            width:130px;
            height:130px;
            margin:10px auto 15px;
            border-radius:18px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:65px;
            background:
              linear-gradient(
                135deg,
                #d8e7ff,
                #f2dfff
              );
          "
        >
          🍐
        </div>

        <h2>
          Midnight Pear
        </h2>

        <p
          style="
            opacity:.65;
          "
        >
          PearTunes Original
        </p>

        <input
          id="music-progress"
          type="range"
          min="0"
          max="100"
          value="${musicProgress}"
          style="
            width:100%;
          "
          oninput="
            musicProgress =
              Number(this.value)
          "
        >

        <div
          style="
            display:flex;
            justify-content:
              center;
            gap:8px;
            margin-top:12px;
          "
        >

          <button
            class="action-button"
            onclick="
              musicProgress =
                Math.max(
                  0,
                  musicProgress - 10
                );
              updateMusicPlayer();
            "
          >
            ⏮
          </button>

          <button
            class="action-button"
            onclick="
              toggleMusicPlayer()
            "
            style="
              font-size:20px;
            "
          >
            ${musicPlaying ? "⏸" : "▶"}
          </button>

          <button
            class="action-button"
            onclick="
              musicProgress =
                Math.min(
                  100,
                  musicProgress + 10
                );
              updateMusicPlayer();
            "
          >
            ⏭
          </button>

        </div>

      </div>

    `
  );

}

function toggleMusicPlayer() {

  musicPlaying =
    !musicPlaying;

  if (musicPlaying) {

    clearInterval(
      musicInterval
    );

    musicInterval =
      setInterval(() => {

        musicProgress += 1;

        if (
          musicProgress >= 100
        ) {

          musicProgress = 0;

        }

        updateMusicPlayer();

      }, 1000);

  } else {

    clearInterval(
      musicInterval
    );

  }

  updateMusicPlayer();

}

function updateMusicPlayer() {

  const slider =
    document.getElementById(
      "music-progress"
    );

  if (slider) {

    slider.value =
      musicProgress;

  }

  const playButton =
    appWindow.querySelector(
      "button[onclick*='toggleMusicPlayer']"
    );

  if (playButton) {

    playButton.textContent =
      musicPlaying
        ? "⏸"
        : "▶";

  }

}

// ============================================================
// CALCULATOR
// ============================================================

let calculatorValue = "";

function calculatorApp() {

  calculatorValue = "";

  openApp(
    "Calculator",
    `

      <div
        class="card"
        style="
          max-width:320px;
          margin:auto;
        "
      >

        <div
          id="calculator-display"
          style="
            background:#111;
            color:#fff;
            min-height:55px;
            border-radius:10px;
            padding:10px;
            box-sizing:border-box;
            font-size:28px;
            text-align:right;
            margin-bottom:8px;
            overflow:hidden;
          "
        >
          0
        </div>

        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(4,1fr);
            gap:5px;
          "
        >

          ${[
            "C",
            "(",
            ")",
            "÷",
            "7",
            "8",
            "9",
            "×",
            "4",
            "5",
            "6",
            "−",
            "1",
            "2",
            "3",
            "+",
            "0",
            ".",
            "%",
            "="
          ]
            .map(
              key => `

                <button
                  class="action-button"
                  onclick="
                    calculatorPress(
                      '${key}'
                    )
                  "
                  style="
                    min-height:42px;
                    font-size:17px;
                  "
                >
                  ${key}
                </button>

              `
            )
            .join("")}

        </div>

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

  if (key === "C") {

    calculatorValue = "";

  } else if (key === "=") {

    try {

      let expression =
        calculatorValue
          .replaceAll("×","*")
          .replaceAll("÷","/")
          .replaceAll("−","-");

      // Only allow calculator characters.

      if (
        !/^[0-9+\-*/().%\s]+$/
          .test(expression)
      ) {

        throw new Error(
          "Invalid expression"
        );

      }

      calculatorValue =
        String(
          Function(
            `"use strict";
             return (${expression})`
          )()
        );

    } catch (error) {

      calculatorValue =
        "Error";

    }

  } else {

    if (
      calculatorValue ===
      "Error"
    ) {

      calculatorValue = "";

    }

    calculatorValue += key;

  }

  display.textContent =
    calculatorValue || "0";

}

// ============================================================
// CALENDAR
// ============================================================

let calendarDate =
  new Date();

function calendarApp() {

  const year =
    calendarDate.getFullYear();

  const month =
    calendarDate.getMonth();

  const first =
    new Date(
      year,
      month,
      1
    );

  const last =
    new Date(
      year,
      month + 1,
      0
    );

  const monthName =
    first.toLocaleDateString(
      [],
      {
        month:"long",
        year:"numeric"
      }
    );

  const startDay =
    first.getDay();

  let cells = "";

  for (
    let i = 0;
    i < startDay;
    i++
  ) {

    cells += `
      <div></div>
    `;

  }

  for (
    let day = 1;
    day <= last.getDate();
    day++
  ) {

    const today =
      new Date();

    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    cells += `

      <button
        type="button"
        onclick="
          selectCalendarDate(
            ${year},
            ${month},
            ${day}
          )
        "
        style="
          min-height:34px;
          border:1px solid #ddd;
          border-radius:7px;
          background:
            ${
              isToday
                ? "#dceaff"
                : "#fff"
            };
          font-weight:
            ${
              isToday
                ? "bold"
                : "normal"
            };
        "
      >
        ${day}
      </button>

    `;

  }

  openApp(
    "Calendar",
    `

      <div class="card">

        <div
          style="
            display:flex;
            align-items:center;
            justify-content:
              space-between;
            gap:5px;
          "
        >

          <button
            class="action-button"
            onclick="
              calendarDate.setMonth(
                calendarDate.getMonth()-1
              );
              calendarApp();
            "
          >
            ‹
          </button>

          <h2
            style="
              margin:0;
            "
          >
            ${monthName}
          </h2>

          <button
            class="action-button"
            onclick="
              calendarDate.setMonth(
                calendarDate.getMonth()+1
              );
              calendarApp();
            "
          >
            ›
          </button>

        </div>

        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(7,1fr);
            gap:4px;
            margin-top:10px;
            text-align:center;
          "
        >

          ${[
            "S",
            "M",
            "T",
            "W",
            "T",
            "F",
            "S"
          ]
            .map(
              day => `
                <strong>
                  ${day}
                </strong>
              `
            )
            .join("")}

          ${cells}

        </div>

      </div>

      <div
        id="calendar-selected"
        class="card"
        style="
          margin-top:8px;
          display:none;
        "
      ></div>

    `
  );

}

function selectCalendarDate(
  year,
  month,
  day
) {

  const selected =
    document.getElementById(
      "calendar-selected"
    );

  if (!selected) return;

  selected.style.display =
    "block";

  selected.innerHTML = `

    <strong>
      ${new Date(
        year,
        month,
        day
      ).toLocaleDateString(
        [],
        {
          weekday:"long",
          month:"long",
          day:"numeric",
          year:"numeric"
        }
      )}
    </strong>

    <p
      style="
        margin-bottom:0;
        opacity:.7;
      "
    >
      No events scheduled.
    </p>

  `;

}

// ============================================================
// REMINDERS
// ============================================================

let reminders = [];

function remindersApp() {

  openApp(
    "Reminders",
    `

      <div class="card">

        <h2>
          🔔 Reminders
        </h2>

        <input
          id="reminder-input"
          type="text"
          placeholder="Add a reminder..."
          style="
            width:100%;
            box-sizing:border-box;
            padding:9px;
            border-radius:10px;
            border:1px solid #aaa;
          "
        >

        <button
          class="action-button"
          onclick="addReminder()"
        >
          Add Reminder
        </button>

      </div>

      <div class="card">

        ${
          reminders.length
            ? reminders
                .map(
                  (reminder,i) => `

                    <div
                      style="
                        display:flex;
                        align-items:center;
                        gap:7px;
                        padding:7px 0;
                        border-bottom:
                          1px solid #ddd;
                      "
                    >

                      <input
                        type="checkbox"
                        ${
                          reminder.done
                            ? "checked"
                            : ""
                        }
                        onchange="
                          toggleReminder(
                            ${i}
                          )
                        "
                      >

                      <span
                        style="
                          flex:1;
                          ${
                            reminder.done
                              ? "text-decoration:line-through;opacity:.5;"
                              : ""
                          }
                        "
                      >
                        ${escapeHTML(
                          reminder.text
                        )}
                      </span>

                      <button
                        class="action-button"
                        onclick="
                          deleteReminder(
                            ${i}
                          )
                        "
                      >
                        ×
                      </button>

                    </div>

                  `
                )
                .join("")
            : `
              <p>
                No reminders.
              </p>
            `
        }

      </div>

    `
  );

}

function addReminder() {

  const input =
    document.getElementById(
      "reminder-input"
    );

  if (!input) return;

  const text =
    input.value.trim();

  if (!text) return;

  reminders.push({
    text,
    done:false
  });

  remindersApp();

}

function toggleReminder(index) {

  if (!reminders[index]) return;

  reminders[index].done =
    !reminders[index].done;

  remindersApp();

}

function deleteReminder(index) {

  reminders.splice(
    index,
    1
  );

  remindersApp();

}

// ============================================================
// CONTACTS
// ============================================================

let contacts = [

  {
    name:"Alex",
    number:"555-0101",
    emoji:"🧑"
  },

  {
    name:"Sam",
    number:"555-0102",
    emoji:"👩"
  },

  {
    name:"Jordan",
    number:"555-0103",
    emoji:"🧑‍💻"
  },

  {
    name:"Pear Support",
    number:"1-800-PEAR",
    emoji:"🍐"
  }

];

function contactsApp() {

  openApp(
    "Contacts",
    `

      <div class="card">

        <h2>
          👥 Contacts
        </h2>

        ${contacts
          .map(
            (contact,i) => `

              <button
                class="list-button"
                onclick="
                  contactDetails(
                    ${i}
                  )
                "
              >

                <span
                  style="
                    font-size:26px;
                  "
                >
                  ${contact.emoji}
                </span>

                <span
                  style="
                    flex:1;
                    text-align:left;
                  "
                >

                  <strong>
                    ${escapeHTML(
                      contact.name
                    )}
                  </strong>

                  <small
                    style="
                      display:block;
                      opacity:.6;
                    "
                  >
                    ${escapeHTML(
                      contact.number
                    )}
                  </small>

                </span>

                <span>
                  ›
                </span>

              </button>

            `
          )
          .join("")}

      </div>

    `
  );

}

function contactDetails(index) {

  const contact =
    contacts[index];

  openApp(
    contact.name,
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <div
          style="
            font-size:65px;
          "
        >
          ${contact.emoji}
        </div>

        <h2>
          ${escapeHTML(
            contact.name
          )}
        </h2>

        <p>
          ${escapeHTML(
            contact.number
          )}
        </p>

        <button
          class="action-button"
          onclick="
            alert(
              'Calling ${escapeHTML(
                contact.number
              )}...'
            )
          "
        >
          📞 Call
        </button>

        <button
          class="action-button"
          onclick="
            openApp(
              'Message',
              \`
                <div class="card">
                  <h2>
                    Message ${escapeHTML(
                      contact.name
                    )}
                  </h2>

                  <input
                    id="contact-message"
                    type="text"
                    placeholder="Type a message..."
                    style="
                      width:100%;
                      box-sizing:border-box;
                      padding:9px;
                      border-radius:10px;
                      border:1px solid #aaa;
                    "
                  >

                  <button
                    class="action-button"
                    onclick="
                      alert('Message sent!')
                    "
                  >
                    Send
                  </button>
                </div>
              \`
            )
          "
        >
          💬 Message
        </button>

      </div>

    `
  );

}

// ============================================================
// PERCENTAGE CALCULATOR
// ============================================================

function percentageApp() {

  openApp(
    "Percentage Calculator",
    `

      <div class="card">

        <h2>
          % Percentage
        </h2>

        <input
          id="percent-number"
          type="text"
          placeholder="Number"
          inputmode="decimal"
          style="
            width:100%;
            box-sizing:border-box;
            padding:9px;
            border-radius:10px;
            border:1px solid #aaa;
            margin-bottom:7px;
          "
        >

        <input
          id="percent-value"
          type="text"
          placeholder="Percent"
          inputmode="decimal"
          style="
            width:100%;
            box-sizing:border-box;
            padding:9px;
            border-radius:10px;
            border:1px solid #aaa;
          "
        >

        <button
          class="action-button"
          onclick="
            calculatePercentage()
          "
        >
          Calculate
        </button>

        <div
          id="percentage-result"
          class="card"
          style="
            margin-top:8px;
          "
        >
          Result will appear here.
        </div>

      </div>

    `
  );

}

function calculatePercentage() {

  const number =
    Number(
      document.getElementById(
        "percent-number"
      ).value
    );

  const percent =
    Number(
      document.getElementById(
        "percent-value"
      ).value
    );

  const result =
    document.getElementById(
      "percentage-result"
    );

  if (
    !Number.isFinite(number) ||
    !Number.isFinite(percent)
  ) {

    result.textContent =
      "Enter valid numbers.";

    return;

  }

  result.innerHTML = `

    <strong>
      ${percent}% of ${number}
    </strong>

    <div
      style="
        font-size:28px;
        margin-top:5px;
      "
    >
      ${
        number *
        (percent / 100)
      }
    </div>

  `;

}

// ============================================================
// LOCATION
// ============================================================

function locationApp() {

  openApp(
    "Location",
    `

      <div class="card">

        <h2>
          📍 My Location
        </h2>

        <p>
          Pear Phone can request your
          current browser location.
        </p>

        <button
          class="action-button"
          onclick="getPearLocation()"
        >
          Find Me
        </button>

        <div
          id="location-result"
          style="
            margin-top:10px;
          "
        ></div>

      </div>

    `
  );

}

function getPearLocation() {

  const result =
    document.getElementById(
      "location-result"
    );

  if (!result) return;

  if (
    !navigator.geolocation
  ) {

    result.textContent =
      "Location is not supported.";

    return;

  }

  result.textContent =
    "Finding location...";

  navigator.geolocation.getCurrentPosition(

    position => {

      result.innerHTML = `

        <div class="card">

          Latitude:
          <strong>
            ${position.coords.latitude.toFixed(5)}
          </strong>

          <br>

          Longitude:
          <strong>
            ${position.coords.longitude.toFixed(5)}
          </strong>

          <br><br>

          Accuracy:
          ${Math.round(
            position.coords.accuracy
          )} m

        </div>

      `;

    },

    error => {

      result.innerHTML = `

        <div class="card">

          Unable to get your location.

          <br><br>

          Please allow location
          permission in the browser.

        </div>

      `;

    }

  );

}

// ============================================================
// PEAR FACTS
// ============================================================

const pearFacts = [

  "The Pear Phone runs Pear OS.",

  "Pear Phone apps are designed for the touchscreen.",

  "Pear Phone includes a custom keyboard.",

  "Pear Phone can use a connected camera.",

  "The Pear Phone home screen has multiple pages.",

  "Swipe upward to explore more apps.",

  "PearTunes is the built-in music experience.",

  "SplashFace is the social network.",

  "The Pear Phone loves pears 🍐"

];

function pearFactsApp() {

  openApp(
    "Pear Facts",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <div
          style="
            font-size:75px;
          "
        >
          🍐
        </div>

        <h2>
          Pear Fact
        </h2>

        <p
          id="pear-fact"
          style="
            font-size:18px;
            min-height:50px;
          "
        >
          ${pearFacts[0]}
        </p>

        <button
          class="action-button"
          onclick="randomPearFact()"
        >
          Another Fact
        </button>

      </div>

    `
  );

}

function randomPearFact() {

  const element =
    document.getElementById(
      "pear-fact"
    );

  if (!element) return;

  element.textContent =
    pearFacts[
      Math.floor(
        Math.random() *
        pearFacts.length
      )
    ];

}

// ============================================================
// REACTION GAME
// ============================================================

let reactionStart = 0;

let reactionTimer = null;

function reactionGameApp() {

  openApp(
    "Reaction Game",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          ⚡ Reaction Game
        </h2>

        <p>
          Wait for the screen to turn
          green, then tap it.
        </p>

        <button
          id="reaction-button"
          onclick="reactionPress()"
          style="
            width:100%;
            min-height:150px;
            border:0;
            border-radius:15px;
            font-size:30px;
            background:#ddd;
          "
        >
          START
        </button>

        <div
          id="reaction-result"
          style="
            margin-top:10px;
            font-size:20px;
          "
        ></div>

      </div>

    `
  );

}

function reactionPress() {

  const button =
    document.getElementById(
      "reaction-button"
    );

  const result =
    document.getElementById(
      "reaction-result"
    );

  if (!button || !result) return;

  if (
    button.dataset.ready ===
    "true"
  ) {

    const reaction =
      Date.now() -
      reactionStart;

    button.dataset.ready =
      "false";

    button.style.background =
      "#ddd";

    button.textContent =
      "START AGAIN";

    result.textContent =
      `Reaction time: ${reaction} ms`;

    clearTimeout(
      reactionTimer
    );

    return;

  }

  if (
    button.dataset.waiting ===
    "true"
  ) {

    clearTimeout(
      reactionTimer
    );

    button.dataset.waiting =
      "false";

    result.textContent =
      "Too early! Try again.";

    button.textContent =
      "START";

    return;

  }

  button.dataset.waiting =
    "true";

  button.textContent =
    "WAIT...";

  result.textContent =
    "";

  const delay =
    1000 +
    Math.random() * 4000;

  reactionTimer =
    setTimeout(() => {

      button.dataset.waiting =
        "false";

      button.dataset.ready =
        "true";

      button.style.background =
        "#65c466";

      button.textContent =
        "TAP NOW!";

      reactionStart =
        Date.now();

    }, delay);

}

// ============================================================
// EXTRA PAGE 2 UTILITIES
// ============================================================

function lingoApp() {

  const words = [

    ["Hello","Bonjour"],

    ["Goodbye","Au revoir"],

    ["Thank you","Merci"],

    ["Friend","Ami"],

    ["Apple","Pomme"],

    ["Pear","Poire"]

  ];

  openApp(
    "Lingo",
    `

      <div class="card">

        <h2>
          🌎 Lingo
        </h2>

        <p>
          Learn a few words.
        </p>

        <div
          id="lingo-word"
          class="card"
          style="
            text-align:center;
            font-size:20px;
          "
        >

          ${words[0][0]}

        </div>

        <button
          class="action-button"
          onclick="
            nextLingoWord()
          "
        >
          Translate
        </button>

      </div>

    `
  );

  window.pearLingoWords =
    words;

  window.pearLingoIndex =
    0;

}

function nextLingoWord() {

  if (
    !window.pearLingoWords
  ) return;

  window.pearLingoIndex++;

  if (
    window.pearLingoIndex >=
    window.pearLingoWords.length
  ) {

    window.pearLingoIndex = 0;

  }

  const word =
    window.pearLingoWords[
      window.pearLingoIndex
    ];

  const display =
    document.getElementById(
      "lingo-word"
    );

  if (!display) return;

  display.innerHTML = `

    <strong>
      ${word[0]}
    </strong>

    <br>

    <span
      style="
        opacity:.65;
      "
    >
      ${word[1]}
    </span>

  `;

}

// ============================================================
// SPLASHFACE SECOND PAGE CONNECTION
// ============================================================

function splashPageApp() {

  splashfaceApp();

}

// ============================================================
// THUMB APP
// ============================================================

let thumbScore = 0;

function tumsApp() {

  thumbScore = 0;

  openApp(
    "Thumb",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <div
          style="
            font-size:75px;
          "
        >
          👍
        </div>

        <h2>
          Thumb Challenge
        </h2>

        <p>
          Tap the thumb as many times
          as possible.
        </p>

        <div
          id="thumb-score"
          style="
            font-size:28px;
            font-weight:bold;
          "
        >
          0
        </div>

        <button
          class="action-button"
          onclick="tapThumb()"
          style="
            font-size:40px;
            width:100%;
            min-height:90px;
          "
        >
          👍
        </button>

      </div>

    `
  );

}

function tapThumb() {

  thumbScore++;

  const score =
    document.getElementById(
      "thumb-score"
    );

  if (score) {

    score.textContent =
      thumbScore;

  }

}

// ============================================================
// DANWARP
// ============================================================

function danwarpApp() {

  openApp(
    "DanWarp",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          🌀 DanWarp
        </h2>

        <div
          id="warp-display"
          style="
            height:150px;
            border-radius:15px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:55px;
            background:
              radial-gradient(
                circle,
                #fff,
                #cddcff,
                #8aa8ff
              );
          "
        >
          🌀
        </div>

        <button
          class="action-button"
          onclick="activateWarp()"
        >
          Activate Warp
        </button>

      </div>

    `
  );

}

function activateWarp() {

  const display =
    document.getElementById(
      "warp-display"
    );

  if (!display) return;

  display.animate(
    [
      {
        transform:
          "rotate(0deg) scale(1)"
      },

      {
        transform:
          "rotate(360deg) scale(1.25)"
      },

      {
        transform:
          "rotate(720deg) scale(1)"
      }
    ],
    {
      duration:900
    }
  );

}

// ============================================================
// IMAGE APP
// ============================================================

function imageApp() {

  openApp(
    "Image",
    `

      <div class="card">

        <h2>
          🖼️ Image Studio
        </h2>

        <div
          id="image-preview"
          style="
            min-height:180px;
            border-radius:12px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:
              linear-gradient(
                135deg,
                #e4efff,
                #f9e6ff
              );
            font-size:65px;
          "
        >
          🍐
        </div>

        <input
          id="image-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          style="
            margin-top:10px;
            width:100%;
          "
        >

      </div>

    `
  );

  const input =
    document.getElementById(
      "image-upload"
    );

  if (!input) return;

  input.addEventListener(
    "change",
    () => {

      const file =
        input.files[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload =
        e => {

          const preview =
            document.getElementById(
              "image-preview"
            );

          if (!preview) return;

          preview.innerHTML = `

            <img
              src="${e.target.result}"
              style="
                width:100%;
                height:100%;
                max-height:220px;
                object-fit:contain;
                border-radius:12px;
              "
            >

          `;

        };

      reader.readAsDataURL(
        file
      );

    }
  );

}

// ============================================================
// CHRONO
// ============================================================

let chronoStart = null;

let chronoInterval = null;

function chronoApp() {

  openApp(
    "Chrono",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          ⏱️ Chrono
        </h2>

        <div
          id="chrono-display"
          style="
            font-size:42px;
            font-weight:bold;
            margin:20px 0;
          "
        >
          00:00.00
        </div>

        <button
          class="action-button"
          onclick="startChrono()"
        >
          Start
        </button>

        <button
          class="action-button"
          onclick="stopChrono()"
        >
          Stop
        </button>

        <button
          class="action-button"
          onclick="resetChrono()"
        >
          Reset
        </button>

      </div>

    `
  );

}

function startChrono() {

  if (chronoStart !== null)
    return;

  chronoStart =
    Date.now();

  clearInterval(
    chronoInterval
  );

  chronoInterval =
    setInterval(
      updateChrono,
      20
    );

}

function stopChrono() {

  chronoStart = null;

  clearInterval(
    chronoInterval
  );

}

function resetChrono() {

  stopChrono();

  const display =
    document.getElementById(
      "chrono-display"
    );

  if (display) {

    display.textContent =
      "00:00.00";

  }

}

function updateChrono() {

  if (chronoStart === null)
    return;

  const display =
    document.getElementById(
      "chrono-display"
    );

  if (!display) {

    stopChrono();

    return;

  }

  const elapsed =
    Date.now() -
    chronoStart;

  const minutes =
    Math.floor(
      elapsed / 60000
    );

  const seconds =
    Math.floor(
      (elapsed % 60000) /
      1000
    );

  const milliseconds =
    elapsed % 1000;

  display.textContent =

    String(minutes)
      .padStart(2,"0") +

    ":" +

    String(seconds)
      .padStart(2,"0") +

    "." +

    String(
      milliseconds
    )
      .padStart(3,"0")
      .slice(0,2);

}

// ============================================================
// ZAPLOOK
// ============================================================

function zaplookApp() {

  openApp(
    "ZapLook",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          ⚡ ZapLook
        </h2>

        <div
          id="zap-display"
          style="
            min-height:150px;
            border-radius:15px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:70px;
          "
        >
          👀
        </div>

        <button
          class="action-button"
          onclick="zapLook()"
        >
          ZAP
        </button>

      </div>

    `
  );

}

function zapLook() {

  const display =
    document.getElementById(
      "zap-display"
    );

  if (!display) return;

  const emojis = [
    "👀",
    "⚡",
    "😎",
    "🤯",
    "🍐",
    "🔥",
    "✨"
  ];

  display.textContent =
    emojis[
      Math.floor(
        Math.random() *
        emojis.length
      )
    ];

  display.animate(
    [
      {
        transform:
          "scale(.3) rotate(-20deg)",
        opacity:0
      },

      {
        transform:
          "scale(1.2) rotate(10deg)",
        opacity:1
      },

      {
        transform:
          "scale(1) rotate(0)",
        opacity:1
      }
    ],
    {
      duration:450
    }
  );

}

// ============================================================
// MONKEY
// ============================================================

let monkeyCount = 0;

function monkeyApp() {

  monkeyCount = 0;

  openApp(
    "Monkey",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <div
          id="monkey"
          style="
            font-size:90px;
          "
        >
          🐒
        </div>

        <h2>
          Monkey Button
        </h2>

        <div
          id="monkey-count"
          style="
            font-size:28px;
            font-weight:bold;
          "
        >
          0
        </div>

        <button
          class="action-button"
          onclick="monkeyTap()"
          style="
            width:100%;
            min-height:65px;
          "
        >
          TAP THE MONKEY
        </button>

      </div>

    `
  );

}

function monkeyTap() {

  monkeyCount++;

  const count =
    document.getElementById(
      "monkey-count"
    );

  const monkey =
    document.getElementById(
      "monkey"
    );

  if (count) {

    count.textContent =
      monkeyCount;

  }

  if (monkey) {

    monkey.animate(
      [
        {
          transform:
            "scale(1)"
        },

        {
          transform:
            "scale(1.3) rotate(-8deg)"
        },

        {
          transform:
            "scale(1)"
        }
      ],
      {
        duration:180
      }
    );

  }

}

// ============================================================
// REMARK
// ============================================================

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
          placeholder="Write a thought..."
          style="
            width:100%;
            box-sizing:border-box;
            min-height:110px;
            resize:none;
            padding:10px;
            border-radius:10px;
            border:1px solid #aaa;
          "
        ></textarea>

        <button
          class="action-button"
          onclick="saveRemark()"
        >
          Save Remark
        </button>

        <div
          id="remark-result"
          style="
            margin-top:8px;
          "
        ></div>

      </div>

    `
  );

}

function saveRemark() {

  const input =
    document.getElementById(
      "remark-text"
    );

  const result =
    document.getElementById(
      "remark-result"
    );

  if (!input || !result)
    return;

  const text =
    input.value.trim();

  if (!text) {

    result.textContent =
      "Write something first.";

    return;

  }

  result.innerHTML = `

    <div class="card">

      ✓ Remark saved.

      <p>
        ${escapeHTML(text)}
      </p>

    </div>

  `;

}

// ============================================================
// PAGE 2 WEATHER
// ============================================================

function p2WeatherApp() {

  weatherApp();

}

// ============================================================
// PAGE 2 MUSIC
// ============================================================

function p2MusicApp() {

  pearTunesApp();

}

// ============================================================
// PAGE 2 SETTINGS
// ============================================================

function p2SettingsApp() {

  settingsApp();

}

// ============================================================
// PAGE 2 PHONE
// ============================================================

function p2PhoneApp() {

  phoneApp();

}

// ============================================================
// PAGE 2 MAIL
// ============================================================

function p2MailApp() {

  mailApp();

}

// ============================================================
// PAGE 2 COMPASS
// ============================================================

function p2CompassApp() {

  compassApp();

}

// ============================================================
// END OF PART 2
// ============================================================
// ============================================================
// PHOTO STUDIO
// ============================================================

function photoStudioApp() {

  openApp(
    "Photo Studio",
    `

      <div class="card">

        <h2>
          📸 Photo Studio
        </h2>

        <p>
          Create a simple Pear Phone
          photo effect.
        </p>

        <input
          id="studio-file"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          style="
            width:100%;
            margin-bottom:8px;
          "
        >

        <div
          id="studio-preview"
          style="
            min-height:170px;
            border-radius:12px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#e9edf5;
            overflow:hidden;
          "
        >
          🍐
        </div>

        <div
          style="
            display:flex;
            gap:5px;
            flex-wrap:wrap;
            margin-top:8px;
          "
        >

          <button
            class="action-button"
            onclick="
              studioEffect('normal')
            "
          >
            Normal
          </button>

          <button
            class="action-button"
            onclick="
              studioEffect('soft')
            "
          >
            Soft
          </button>

          <button
            class="action-button"
            onclick="
              studioEffect('mono')
            "
          >
            Mono
          </button>

          <button
            class="action-button"
            onclick="
              studioEffect('bright')
            "
          >
            Bright
          </button>

        </div>

      </div>

    `
  );

  const input =
    document.getElementById(
      "studio-file"
    );

  if (!input) return;

  input.addEventListener(
    "change",
    () => {

      const file =
        input.files[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload =
        event => {

          const preview =
            document.getElementById(
              "studio-preview"
            );

          if (!preview) return;

          preview.innerHTML = `

            <img
              id="studio-image"
              src="${event.target.result}"
              style="
                width:100%;
                height:100%;
                max-height:220px;
                object-fit:contain;
              "
            >

          `;

        };

      reader.readAsDataURL(
        file
      );

    }
  );

}

function studioEffect(effect) {

  const image =
    document.getElementById(
      "studio-image"
    );

  if (!image) return;

  if (effect === "normal") {

    image.style.filter =
      "none";

  }

  if (effect === "soft") {

    image.style.filter =
      "brightness(1.08) saturate(.8)";

  }

  if (effect === "mono") {

    image.style.filter =
      "grayscale(1)";

  }

  if (effect === "bright") {

    image.style.filter =
      "brightness(1.2) saturate(1.2)";

  }

}

// ============================================================
// STOPWATCH
// ============================================================

let stopwatchRunning = false;

let stopwatchStarted = 0;

let stopwatchElapsed = 0;

let stopwatchInterval = null;

function stopwatchApp() {

  openApp(
    "Stopwatch",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          ⏱️ Stopwatch
        </h2>

        <div
          id="stopwatch-display"
          style="
            font-size:42px;
            font-weight:bold;
            margin:20px 0;
          "
        >
          00:00.00
        </div>

        <button
          class="action-button"
          onclick="
            toggleStopwatch()
          "
        >
          ${stopwatchRunning ? "Pause" : "Start"}
        </button>

        <button
          class="action-button"
          onclick="
            resetStopwatch()
          "
        >
          Reset
        </button>

      </div>

    `
  );

}

function toggleStopwatch() {

  if (
    stopwatchRunning
  ) {

    stopwatchElapsed +=
      Date.now() -
      stopwatchStarted;

    stopwatchRunning =
      false;

    clearInterval(
      stopwatchInterval
    );

  } else {

    stopwatchStarted =
      Date.now();

    stopwatchRunning =
      true;

    clearInterval(
      stopwatchInterval
    );

    stopwatchInterval =
      setInterval(
        updateStopwatch,
        25
      );

  }

  stopwatchApp();

}

function updateStopwatch() {

  const display =
    document.getElementById(
      "stopwatch-display"
    );

  if (!display) {

    clearInterval(
      stopwatchInterval
    );

    return;

  }

  let elapsed =
    stopwatchElapsed;

  if (
    stopwatchRunning
  ) {

    elapsed +=
      Date.now() -
      stopwatchStarted;

  }

  const minutes =
    Math.floor(
      elapsed / 60000
    );

  const seconds =
    Math.floor(
      (elapsed % 60000) /
      1000
    );

  const milliseconds =
    Math.floor(
      (elapsed % 1000) / 10
    );

  display.textContent =
    String(minutes)
      .padStart(2,"0") +

    ":" +

    String(seconds)
      .padStart(2,"0") +

    "." +

    String(milliseconds)
      .padStart(2,"0");

}

function resetStopwatch() {

  stopwatchRunning =
    false;

  stopwatchElapsed =
    0;

  stopwatchStarted =
    0;

  clearInterval(
    stopwatchInterval
  );

  stopwatchApp();

}

// ============================================================
// TO-DO
// ============================================================

let todoItems = [];

function todoApp() {

  openApp(
    "To-Do",
    `

      <div class="card">

        <h2>
          ✅ To-Do
        </h2>

        <input
          id="todo-input"
          type="text"
          placeholder="What do you need to do?"
          style="
            width:100%;
            box-sizing:border-box;
            padding:9px;
            border-radius:10px;
            border:1px solid #aaa;
          "
        >

        <button
          class="action-button"
          onclick="addTodo()"
        >
          Add Task
        </button>

      </div>

      <div class="card">

        ${
          todoItems.length
            ? todoItems
                .map(
                  (item,index) => `

                    <div
                      style="
                        display:flex;
                        gap:7px;
                        align-items:center;
                        padding:7px 0;
                        border-bottom:
                          1px solid #ddd;
                      "
                    >

                      <input
                        type="checkbox"
                        ${
                          item.done
                            ? "checked"
                            : ""
                        }
                        onchange="
                          toggleTodo(
                            ${index}
                          )
                        "
                      >

                      <span
                        style="
                          flex:1;
                          ${
                            item.done
                              ? "text-decoration:line-through;opacity:.5;"
                              : ""
                          }
                        "
                      >
                        ${escapeHTML(
                          item.text
                        )}
                      </span>

                      <button
                        class="action-button"
                        onclick="
                          deleteTodo(
                            ${index}
                          )
                        "
                      >
                        ×
                      </button>

                    </div>

                  `
                )
                .join("")
            : `
              <p>
                No tasks yet.
              </p>
            `
        }

      </div>

    `
  );

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

  todoItems.push({
    text,
    done:false
  });

  todoApp();

}

function toggleTodo(index) {

  if (!todoItems[index])
    return;

  todoItems[index].done =
    !todoItems[index].done;

  todoApp();

}

function deleteTodo(index) {

  todoItems.splice(
    index,
    1
  );

  todoApp();

}

// ============================================================
// TIMER
// ============================================================

let timerSeconds = 60;

let timerInterval = null;

function timerApp() {

  openApp(
    "Timer",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          ⏲️ Timer
        </h2>

        <input
          id="timer-input"
          type="text"
          value="60"
          placeholder="Seconds"
          style="
            width:100%;
            box-sizing:border-box;
            padding:10px;
            border-radius:10px;
            border:1px solid #aaa;
            text-align:center;
            font-size:20px;
          "
        >

        <div
          id="timer-display"
          style="
            font-size:46px;
            font-weight:bold;
            margin:18px 0;
          "
        >
          01:00
        </div>

        <button
          class="action-button"
          onclick="startTimer()"
        >
          Start
        </button>

        <button
          class="action-button"
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
      "timer-input"
    );

  if (input) {

    const value =
      Number(input.value);

    if (
      Number.isFinite(value) &&
      value > 0
    ) {

      timerSeconds =
        Math.floor(value);

    }

  }

  clearInterval(
    timerInterval
  );

  updateTimer();

  timerInterval =
    setInterval(() => {

      timerSeconds--;

      updateTimer();

      if (
        timerSeconds <= 0
      ) {

        clearInterval(
          timerInterval
        );

        timerSeconds = 0;

        updateTimer();

        try {

          if (
            navigator.vibrate
          ) {

            navigator.vibrate(
              [200,100,200]
            );

          }

        } catch (e) {}

      }

    }, 1000);

}

function updateTimer() {

  const display =
    document.getElementById(
      "timer-display"
    );

  if (!display) {

    clearInterval(
      timerInterval
    );

    return;

  }

  const minutes =
    Math.floor(
      timerSeconds / 60
    );

  const seconds =
    timerSeconds % 60;

  display.textContent =
    String(minutes)
      .padStart(2,"0") +

    ":" +

    String(seconds)
      .padStart(2,"0");

}

function resetTimer() {

  clearInterval(
    timerInterval
  );

  timerSeconds = 60;

  timerApp();

}

// ============================================================
// RANDOM NUMBER
// ============================================================

function randomNumberApp() {

  openApp(
    "Random Number",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          🎲 Random Number
        </h2>

        <input
          id="random-min"
          type="text"
          value="1"
          placeholder="Minimum"
          style="
            width:100%;
            box-sizing:border-box;
            padding:9px;
            border-radius:10px;
            border:1px solid #aaa;
            margin-bottom:6px;
          "
        >

        <input
          id="random-max"
          type="text"
          value="100"
          placeholder="Maximum"
          style="
            width:100%;
            box-sizing:border-box;
            padding:9px;
            border-radius:10px;
            border:1px solid #aaa;
          "
        >

        <div
          id="random-number"
          style="
            font-size:55px;
            font-weight:bold;
            margin:18px 0;
          "
        >
          ?
        </div>

        <button
          class="action-button"
          onclick="generateRandomNumber()"
        >
          Generate
        </button>

      </div>

    `
  );

}

function generateRandomNumber() {

  const minInput =
    document.getElementById(
      "random-min"
    );

  const maxInput =
    document.getElementById(
      "random-max"
    );

  const result =
    document.getElementById(
      "random-number"
    );

  if (
    !minInput ||
    !maxInput ||
    !result
  ) return;

  let min =
    Number(minInput.value);

  let max =
    Number(maxInput.value);

  if (
    !Number.isFinite(min) ||
    !Number.isFinite(max)
  ) {

    result.textContent =
      "?";

    return;

  }

  if (min > max) {

    [
      min,
      max
    ] =
      [
        max,
        min
      ];

  }

  const number =
    Math.floor(
      Math.random() *
      (max - min + 1)
    ) +
    min;

  result.textContent =
    number;

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
        style="
          text-align:center;
        "
      >

        <h2>
          🪙 Coin Flip
        </h2>

        <div
          id="coin-display"
          style="
            width:120px;
            height:120px;
            border-radius:50%;
            margin:20px auto;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#f1d77b;
            border:5px solid #c6a942;
            font-size:30px;
            font-weight:bold;
          "
        >
          ?
        </div>

        <button
          class="action-button"
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
      "coin-display"
    );

  if (!coin) return;

  coin.textContent =
    "🪙";

  coin.animate(
    [
      {
        transform:
          "rotateY(0deg)"
      },

      {
        transform:
          "rotateY(900deg)"
      },

      {
        transform:
          "rotateY(1800deg)"
      }
    ],
    {
      duration:700
    }
  );

  setTimeout(() => {

    coin.textContent =
      Math.random() < .5
        ? "HEADS"
        : "TAILS";

  }, 700);

}

// ============================================================
// DICE
// ============================================================

function diceApp() {

  openApp(
    "Dice",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          🎲 Dice
        </h2>

        <div
          id="dice-display"
          style="
            font-size:90px;
            margin:15px;
          "
        >
          ⚀
        </div>

        <div
          id="dice-result"
          style="
            font-size:22px;
            margin-bottom:8px;
          "
        >
          Roll the dice
        </div>

        <button
          class="action-button"
          onclick="rollDice()"
        >
          Roll
        </button>

      </div>

    `
  );

}

function rollDice() {

  const display =
    document.getElementById(
      "dice-display"
    );

  const result =
    document.getElementById(
      "dice-result"
    );

  if (!display || !result)
    return;

  const value =
    Math.floor(
      Math.random() * 6
    ) + 1;

  const diceFaces = [
    "⚀",
    "⚁",
    "⚂",
    "⚃",
    "⚄",
    "⚅"
  ];

  display.textContent =
    diceFaces[value - 1];

  result.textContent =
    `You rolled ${value}`;

  display.animate(
    [
      {
        transform:
          "rotate(-20deg) scale(.7)"
      },

      {
        transform:
          "rotate(20deg) scale(1.15)"
      },

      {
        transform:
          "rotate(0) scale(1)"
      }
    ],
    {
      duration:350
    }
  );

}

// ============================================================
// COLOR PICKER
// ============================================================

function colorPickerApp() {

  openApp(
    "Color Picker",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          🎨 Color Picker
        </h2>

        <input
          id="pear-color"
          type="color"
          value="#7fcf62"
          style="
            width:100%;
            height:70px;
          "
          oninput="
            updatePearColor()
          "
        >

        <div
          id="color-preview"
          style="
            height:100px;
            margin-top:10px;
            border-radius:12px;
            background:#7fcf62;
          "
        ></div>

        <div
          id="color-value"
          style="
            font-size:18px;
            margin-top:8px;
            font-weight:bold;
          "
        >
          #7FCF62
        </div>

      </div>

    `
  );

}

function updatePearColor() {

  const input =
    document.getElementById(
      "pear-color"
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

        <h2>
          🔤 Text Counter
        </h2>

        <textarea
          id="counter-text"
          placeholder="Start typing..."
          style="
            width:100%;
            min-height:120px;
            box-sizing:border-box;
            padding:10px;
            resize:none;
            border-radius:10px;
            border:1px solid #aaa;
          "
          oninput="
            updateTextCounter()
          "
        ></textarea>

        <div
          class="card"
          style="
            margin-top:8px;
          "
        >

          <div>
            Characters:
            <strong
              id="character-count"
            >
              0
            </strong>
          </div>

          <div>
            Words:
            <strong
              id="word-count"
            >
              0
            </strong>
          </div>

          <div>
            Lines:
            <strong
              id="line-count"
            >
              0
            </strong>
          </div>

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

  const lines =
    document.getElementById(
      "line-count"
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

  if (lines) {

    lines.textContent =
      text
        ? text.split("\n").length
        : 0;

  }

}

// ============================================================
// TYPING GAME
// ============================================================

let typingGameInterval = null;

let typingGameStart = null;

let typingGameTarget = "";

let typingGameScore = 0;

const typingWords = [

  "pear",

  "phone",

  "raspberry",

  "splash",

  "camera",

  "music",

  "keyboard",

  "touchscreen",

  "apple",

  "weather",

  "messages",

  "photos"

];

function typingGameApp() {

  stopTypingGame();

  typingGameScore = 0;

  typingGameTarget =
    randomTypingWord();

  openApp(
    "Typing Game",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          ⌨️ Typing Game
        </h2>

        <p>
          Type the word shown below
          as quickly as possible.
        </p>

        <div
          id="typing-target"
          style="
            font-size:34px;
            font-weight:bold;
            margin:15px 0;
          "
        >
          ${typingGameTarget}
        </div>

        <input
          id="typing-input"
          type="text"
          placeholder="Type here..."
          autocomplete="off"
          style="
            width:100%;
            box-sizing:border-box;
            padding:10px;
            border-radius:10px;
            border:1px solid #aaa;
            text-align:center;
            font-size:18px;
          "
        >

        <div
          id="typing-score"
          style="
            margin-top:10px;
          "
        >
          Score: 0
        </div>

      </div>

    `
  );

  const input =
    document.getElementById(
      "typing-input"
    );

  if (!input) return;

  typingGameStart =
    Date.now();

  input.addEventListener(
    "input",
    () => {

      if (
        input.value.toLowerCase() ===
        typingGameTarget
      ) {

        const elapsed =
          Date.now() -
          typingGameStart;

        typingGameScore++;

        input.value = "";

        const score =
          document.getElementById(
            "typing-score"
          );

        if (score) {

          score.textContent =
            `Score: ${typingGameScore} • ${elapsed} ms`;

        }

        typingGameTarget =
          randomTypingWord();

        const target =
          document.getElementById(
            "typing-target"
          );

        if (target) {

          target.textContent =
            typingGameTarget;

        }

        typingGameStart =
          Date.now();

      }

    }
  );

}

function randomTypingWord() {

  return typingWords[
    Math.floor(
      Math.random() *
      typingWords.length
    )
  ];

}

function stopTypingGame() {

  clearInterval(
    typingGameInterval
  );

  typingGameInterval =
    null;

}

// ============================================================
// EXTRA PAGE 2 APP ALIASES
// ============================================================

function p2LingoApp() {

  lingoApp();

}

function p2SplashApp() {

  splashfaceApp();

}

function p2ThumbApp() {

  tumsApp();

}

function p2DanWarpApp() {

  danwarpApp();

}

function p2ImageApp() {

  imageApp();

}

function p2ChronoApp() {

  chronoApp();

}

function p2ZapLookApp() {

  zaplookApp();

}

function p2MonkeyApp() {

  monkeyApp();

}

function p2RemarkApp() {

  remarkApp();

}

// ============================================================
// END OF PART 3
// ============================================================
// ============================================================
// PAGE 1 APP CONNECTIONS
// ============================================================

const page1Connections = {

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

// ============================================================
// PAGE 2 APP CONNECTIONS
// IMPORTANT:
// EACH HOTSPOT ONLY OPENS ITS OWN APP
// ============================================================

const page2Connections = {

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

// ============================================================
// CONNECT PAGE 1
// ============================================================

function connectPage1Apps() {

  Object.keys(
    page1Connections
  ).forEach(id => {

    const button =
      document.getElementById(id);

    const app =
      page1Connections[id];

    if (
      !button ||
      typeof app !== "function"
    ) return;

    // Remove any old handler that may
    // have been attached by another
    // version of the script.

    button.onclick = null;

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();

        if (
          currentPage !== 1
        ) return;

        app();

      }
    );

  });

}

// ============================================================
// CONNECT PAGE 2
// ============================================================

function connectPage2Apps() {

  Object.keys(
    page2Connections
  ).forEach(id => {

    const button =
      document.getElementById(id);

    const app =
      page2Connections[id];

    if (
      !button ||
      typeof app !== "function"
    ) return;

    button.onclick = null;

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();

        if (
          currentPage !== 2
        ) return;

        app();

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

  homeButton.onclick = null;

  homeButton.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      closeApp();

    }
  );

}

// ============================================================
// BACK BUTTON SUPPORT
// ============================================================

document.addEventListener(
  "click",
  event => {

    const back =
      event.target.closest(
        ".back"
      );

    if (!back) return;

    event.preventDefault();

    event.stopPropagation();

    closeApp();

  },
  true
);

// ============================================================
// PREVENT APP WINDOW FROM BEING TREATED
// AS A PHONE SWIPE
// ============================================================

overlay.addEventListener(
  "pointerdown",
  event => {

    event.stopPropagation();

  },
  true
);

overlay.addEventListener(
  "pointerup",
  event => {

    event.stopPropagation();

  },
  true
);

overlay.addEventListener(
  "touchstart",
  event => {

    event.stopPropagation();

  },
  true
);

overlay.addEventListener(
  "touchend",
  event => {

    event.stopPropagation();

  },
  true
);

// ============================================================
// KEYBOARD TOUCH SAFETY
// ============================================================

document.addEventListener(
  "pointerdown",
  event => {

    const keyboard =
      event.target.closest(
        "#pear-keyboard"
      );

    if (!keyboard) return;

    event.stopPropagation();

  },
  true
);

// ============================================================
// APP WINDOW SAFETY
// ============================================================

appWindow.addEventListener(
  "pointerdown",
  event => {

    event.stopPropagation();

  },
  true
);

appWindow.addEventListener(
  "pointerup",
  event => {

    event.stopPropagation();

  },
  true
);

// ============================================================
// INITIAL PAGE
// ============================================================

function initializePearPhone() {

  currentPage = 1;

  phone.classList.remove(
    "page-two"
  );

  phone.classList.remove(
    "page-switch-up"
  );

  phone.classList.remove(
    "page-switch-down"
  );

  if (pageDots) {

    pageDots.textContent =
      "● ○";

  }

  closeApp();

}

// ============================================================
// OPTIONAL EXTRA APP CONNECTIONS
// These allow the detailed apps above
// to be used if their hotspot exists.
// ============================================================

const extraConnections = {

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

function connectExtraApps() {

  Object.keys(
    extraConnections
  ).forEach(id => {

    const element =
      document.getElementById(id);

    if (!element) return;

    // The main Page 2 connection is
    // already responsible for this.
    // Do not attach another listener.
    //
    // This prevents one tap from opening
    // two apps.

  });

}

// ============================================================
// DATA-APP SUPPORT
// ============================================================

const dataAppConnections = {

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
    pearTunesApp,

  lingo:
    lingoApp,

  thumb:
    tumsApp,

  danwarp:
    danwarpApp,

  image:
    imageApp,

  chrono:
    chronoApp,

  zaplook:
    zaplookApp,

  monkey:
    monkeyApp,

  remark:
    remarkApp

};

function connectDataAppButtons() {

  const elements =
    document.querySelectorAll(
      "[data-app]"
    );

  elements.forEach(
    element => {

      const name =
        element.dataset.app;

      const app =
        dataAppConnections[name];

      if (
        typeof app !== "function"
      ) return;

      element.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();

          app();

        }
      );

    }
  );

}

// ============================================================
// CLEANUP
// ============================================================

window.addEventListener(
  "beforeunload",
  () => {

    stopCamera();

    stopTypingGame();

    clearInterval(
      clockInterval
    );

    clearInterval(
      compassInterval
    );

    clearInterval(
      musicInterval
    );

    clearInterval(
      chronoInterval
    );

    clearInterval(
      stopwatchInterval
    );

    clearInterval(
      timerInterval
    );

  }
);

// ============================================================
// START PEAR PHONE
// ============================================================

connectPage1Apps();

connectPage2Apps();

connectExtraApps();

connectDataAppButtons();

initializePearPhone();

// ============================================================
// DEBUG INFORMATION
// ============================================================

console.log(
  "🍐 Pear Phone OS loaded"
);

console.log(
  "Page 1 apps connected:",
  Object.keys(
    page1Connections
  ).length
);

console.log(
  "Page 2 apps connected:",
  Object.keys(
    page2Connections
  ).length
);

console.log(
  "Swipe UP → Page 2"
);

console.log(
  "Swipe DOWN → Page 1"
);

console.log(
  "Home → Close app"
);

console.log(
  "Keyboard → Tap a text field"
);

// ============================================================
// END OF PART 4
// ============================================================
// ============================================================
// FINAL PEAR PHONE SAFETY / INITIALIZATION
// ============================================================

// Make sure the keyboard can never remain visible
// after an app is closed.

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.hidden
    ) {

      hidePearKeyboard(true);

      stopCamera();

    }

  }
);

// ============================================================
// CLOSE KEYBOARD WHEN CLICKING OUTSIDE
// ============================================================

document.addEventListener(
  "click",
  event => {

    if (!keyboardVisible)
      return;

    const keyboard =
      document.getElementById(
        "pear-keyboard"
      );

    const target =
      event.target;

    // Keep keyboard open when
    // interacting with the keyboard.

    if (
      keyboard &&
      keyboard.contains(target)
    ) {

      return;

    }

    // Keep keyboard open when
    // tapping the currently
    // selected input.

    if (
      keyboardTarget &&
      target === keyboardTarget
    ) {

      return;

    }

  },
  true
);

// ============================================================
// KEEP TEXT INPUT FOCUS WITH THE PEAR KEYBOARD
// ============================================================

document.addEventListener(
  "focusin",
  event => {

    const field =
      event.target;

    if (
      !field.matches(
        "input[type='text'], input:not([type]), textarea"
      )
    ) {

      return;

    }

    // Do not automatically open the keyboard
    // merely because something received focus.
    //
    // The keyboard is opened by the actual
    // click handler in addKeyboardSupport().

    keyboardTarget =
      field;

  }
);

// ============================================================
// RESET WHEN THE APP WINDOW IS EMPTY
// ============================================================

const appObserver =
  new MutationObserver(
    () => {

      if (
        !appWindow.innerHTML.trim()
      ) {

        hidePearKeyboard(true);

      }

    }
  );

appObserver.observe(
  appWindow,
  {
    childList:true,
    subtree:true
  }
);

// ============================================================
// FINAL INITIAL STATE
// ============================================================

if (phone) {

  phone.classList.remove(
    "page-two"
  );

  phone.classList.remove(
    "page-switch-up"
  );

  phone.classList.remove(
    "page-switch-down"
  );

}

if (overlay) {

  overlay.classList.remove(
    "open"
  );

}

hidePearKeyboard(true);

// ============================================================
// PEAR PHONE READY
// ============================================================

console.log(
  "🍐 Pear Phone is ready."
);

console.log(
  "📱 Page 1: connected."
);

console.log(
  "📱 Page 2: connected."
);

console.log(
  "👆 Swipe up for Page 2."
);

console.log(
  "👇 Swipe down for Page 1."
);

console.log(
  "⌨️ Tap a text field for the keyboard."
);

console.log(
  "↵ Enter closes the keyboard."
);

console.log(
  "🏠 Home closes the current app."
);

// ============================================================
// END OF PEAR PHONE OS
// ============================================================
