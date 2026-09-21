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

  const pageOne =
    document.getElementById("page1");

  const pageTwo =
    document.getElementById("page2");

  if (pageOne && pageTwo) {

    pageOne.style.display =
      page === 1
        ? "block"
        : "none";

    pageTwo.style.display =
      page === 2
        ? "grid"
        : "none";

  }

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


// ============================================================
// KEYBOARD PAGE SWITCHING
// ============================================================

document.addEventListener(
  "keydown",
  e => {

    if (
      e.target.matches(
        "input, textarea, select"
      )
    ) {
      return;
    }

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

  }
);


// ============================================================
// TOUCH PAGE SWITCHING
// ============================================================

phone.addEventListener(
  "touchstart",
  e => {

    if (
      overlay.classList.contains(
        "open"
      )
    ) {
      return;
    }

    const t =
      e.touches[0];

    touchStartX =
      t.clientX;

    touchStartY =
      t.clientY;

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
      overlay.classList.contains(
        "open"
      )
    ) {
      return;
    }

    const t =
      e.touches[0];

    const dx =
      t.clientX -
      touchStartX;

    const dy =
      t.clientY -
      touchStartY;

    if (
      Math.abs(dy) > 30 &&
      Math.abs(dy) >
        Math.abs(dx)
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
      overlay.classList.contains(
        "open"
      ) ||
      !touchMoved ||
      swipeLocked
    ) {
      return;
    }

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
      Math.abs(dy) <=
        Math.abs(dx)
    ) {
      return;
    }

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

    setTimeout(
      () => {

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
// MOUSE / TRACKPAD PAGE SWITCHING
// ============================================================

phone.addEventListener(
  "mousedown",
  e => {

    if (
      overlay.classList.contains(
        "open"
      )
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
  e => {

    if (
      !mouseDragging
    ) {
      return;
    }

    mouseDragging = false;

    if (
      overlay.classList.contains(
        "open"
      )
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
      Math.abs(dy) <=
        Math.abs(dx)
    ) {
      return;
    }

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

function openApp(
  title,
  content
) {

  hidePearKeyboard(
    true
  );

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

  overlay.classList.add(
    "open"
  );

  addKeyboardSupport();

}


function closeApp() {

  stopCamera();

  stopTypingGame();

  hidePearKeyboard(
    true
  );

  overlay.classList.remove(
    "open"
  );

  appWindow.innerHTML = "";

}


// ============================================================
// CUSTOM PEAR KEYBOARD
// ============================================================

let keyboardVisible =
  false;

let keyboardShift =
  false;

let activeKeyboardField =
  null;


function addKeyboardSupport() {

  setTimeout(
    () => {

      const fields =
        appWindow.querySelectorAll(
          "input[type='text'], input:not([type]), textarea"
        );

      fields.forEach(
        field => {

          field.addEventListener(
            "pointerdown",
            () => {

              activeKeyboardField =
                field;

            }
          );


          field.addEventListener(
            "click",
            () => {

              activeKeyboardField =
                field;

              try {

                field.focus({
                  preventScroll:
                    true
                });

              } catch {

                field.focus();

              }

              showPearKeyboard(
                field
              );

            }
          );

        }
      );

    },
    50
  );

}


function showPearKeyboard(
  input
) {

  if (!input) {
    return;
  }

  activeKeyboardField =
    input;

  keyboardVisible =
    true;

  let keyboard =
    document.getElementById(
      "pear-keyboard"
    );


  if (!keyboard) {

    keyboard =
      document.createElement(
        "div"
      );

    keyboard.id =
      "pear-keyboard";


    keyboard.innerHTML = `

      <div
        class="pear-keyboard-row"
      >

        ${
          "QWERTYUIOP"
            .split("")
            .map(
              k => `
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


      <div
        class="pear-keyboard-row"
      >

        ${
          "ASDFGHJKL"
            .split("")
            .map(
              k => `
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


      <div
        class="pear-keyboard-row"
      >

        <button
          type="button"
          onclick="keyboardShiftKey()"
        >
          ⇧
        </button>

        ${
          "ZXCVBNM"
            .split("")
            .map(
              k => `
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


      <div
        class="pear-keyboard-row bottom"
      >

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


    overlay.appendChild(
      keyboard
    );


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

  }


  keyboard.style.display =
    "grid";


  setTimeout(
    () => {

      keyboard.classList.add(
        "keyboard-show"
      );

    },
    10
  );

}


function hidePearKeyboard(
  immediate = false
) {

  activeKeyboardField =
    null;

  const keyboard =
    document.getElementById(
      "pear-keyboard"
    );


  if (!keyboard) {

    keyboardVisible =
      false;

    return;

  }


  keyboard.classList.remove(
    "keyboard-show"
  );

  keyboardVisible =
    false;


  if (immediate) {

    keyboard.style.display =
      "none";

    return;

  }


  setTimeout(
    () => {

      if (
        !keyboardVisible
      ) {

        keyboard.style.display =
          "none";

      }

    },
    250
  );

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
      active.tagName ===
        "INPUT" ||
      active.tagName ===
        "TEXTAREA"
    )
  ) {

    activeKeyboardField =
      active;

    return active;

  }


  return null;

}


function insertText(
  field,
  text
) {

  if (!field) {
    return;
  }


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


  const position =
    start +
    text.length;


  try {

    field.setSelectionRange(
      position,
      position
    );

  } catch {}


  field.dispatchEvent(
    new Event(
      "input",
      {
        bubbles: true
      }
    )
  );

}


function keyboardKey(
  key
) {

  const field =
    getFocusedField();


  if (!field) {
    return;
  }


  const character =
    keyboardShift
      ? key.toUpperCase()
      : key.toLowerCase();


  insertText(
    field,
    character
  );


  keyboardShift =
    false;

}


function keyboardSpace() {

  const field =
    getFocusedField();


  if (!field) {
    return;
  }


  insertText(
    field,
    " "
  );

}


function keyboardEnter() {

  const field =
    getFocusedField();


  if (!field) {

    hidePearKeyboard(
      true
    );

    return;

  }


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


  hidePearKeyboard(
    true
  );

}


function keyboardBackspace() {

  const field =
    getFocusedField();


  if (!field) {
    return;
  }


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


  if (
    start !== end
  ) {

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

    } catch {}


  } else if (
    start > 0
  ) {

    field.value =
      field.value.substring(
        0,
        start - 1
      ) +
      field.value.substring(
        start
      );


    try {

      field.setSelectionRange(
        start - 1,
        start - 1
      );

    } catch {}

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


  if (!field) {
    return;
  }


  insertText(
    field,
    "123"
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

        <div
          id="contact-list"
        >

          ${
            Object.keys(
              messageContacts
            )
            .map(
              name => `

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


function openChat(
  name
) {

  const messages =
    messageContacts[name] ||
    [];


  openApp(

    name,

    `

      <div
        class="card"
      >

        <div
          id="chat-box"
        >

          ${
            messages
              .slice(0, 2)
              .map(
                msg => `

                  <div
                    class="message received"
                  >

                    ${escapeHTML(
                      msg
                    )}

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


function sendMessage(
  name
) {

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
  ) {

    return;

  }


  chat.innerHTML += `

    <div
      class="message sent"
    >

      ${escapeHTML(
        input.value
      )}

    </div>

  `;


  input.value = "";


  setTimeout(
    () => {

      randomReply(
        name
      );

    },
    600
  );

}


function randomReply(
  name
) {

  const chat =
    document.getElementById(
      "chat-box"
    );


  if (!chat) {
    return;
  }


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

      ${escapeHTML(
        reply
      )}

    </div>

  `;

}


function newMessage() {

  openApp(

    "New Message",

    `

      <div
        class="card"
      >

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

let cameraStream =
  null;

let cameraFacing =
  "user";


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
          muted
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


    if (!video) {
      return;
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

          facingMode:
            cameraFacing

        },

        audio: false

      });


    video.srcObject =
      cameraStream;

    video.muted =
      true;

    video.setAttribute(
      "playsinline",
      ""
    );


    try {

      await video.play();

    } catch (
      playError
    ) {

      console.warn(
        "Camera video play was blocked:",
        playError
      );

    }


    /*
     * After permission is granted,
     * check the available video devices.
     *
     * The Freenove FNK0056 is a Raspberry Pi
     * CSI camera. If Raspberry Pi OS exposes
     * it to Chromium as a video input, it will
     * appear here.
     */

    try {

      const devices =
        await navigator
          .mediaDevices
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
            /camera|csi|rp1|raspberry|libcamera/i.test(
              device.label
            )
        );


      if (
        freenove &&
        freenove.deviceId &&
        freenove.deviceId !==
          currentDeviceId
      ) {

        if (
          currentTrack
        ) {

          currentTrack.stop();

        }


        cameraStream =
          await navigator
            .mediaDevices
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

        video.muted =
          true;

        video.setAttribute(
          "playsinline",
          ""
        );


        try {

          await video.play();

        } catch (
          playError
        ) {

          console.warn(
            "Preferred camera video play was blocked:",
            playError
          );

        }

      }

    } catch (
      deviceError
    ) {

      console.warn(
        "Could not select the named camera. Using the active camera instead.",
        deviceError
      );

    }

  } catch (
    error
  ) {

    console.error(
      "Pear Phone camera error:",
      error
    );


    alert(
      "Camera access was not available. Make sure the Freenove camera is connected, the Raspberry Pi camera is enabled, and Chromium has camera permission."
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
  ) {

    return;

  }


  if (
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
    canvas.getContext(
      "2d"
    );


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
        border-radius:12px;
        margin-top:10px;
      "
    >

  `;

}


function stopCamera() {

  if (
    !cameraStream
  ) {
    return;
  }


  cameraStream
    .getTracks()
    .forEach(
      track => {

        track.stop();

      }
    );


  cameraStream =
    null;

}


// ============================================================
// SPLASHFACE
// ============================================================

let splashPosts = [

  {

    user:
      "loganbalbs",

    text:
      "Living my best Pear Phone life 🍐📱",

    likes:
      24,

    comments:
      []

  },

  {

    user:
      "sam",

    text:
      "This phone is actually insane 😂",

    likes:
      12,

    comments:
      []

  },

  {

    user:
      "chloe",

    text:
      "New post!!! ✨",

    likes:
      31,

    comments:
      []

  }

];


function splashfaceApp() {

  renderSplashface();

}


function renderSplashface() {

  openApp(

    "SplashFace",

    `

      <div
        class="card"
      >

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


        <div
          id="splash-feed"
        >

          ${
            splashPosts
              .map(
                (
                  post,
                  index
                ) => `

                  <div
                    class="post"
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
                      onclick="likeSplash(${index})"
                    >

                      ❤️
                      ${post.likes}

                    </button>


                    <button
                      onclick="commentSplash(${index})"
                    >

                      💬
                      ${post.comments.length}

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
                                        💬
                                        ${escapeHTML(
                                          c
                                        )}
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


function likeSplash(
  index
) {

  splashPosts[index].likes++;

  renderSplashface();

}


function commentSplash(
  index
) {

  openApp(

    "Comment",

    `

      <div
        class="card"
      >

        <h2>
          💬 Add Comment
        </h2>


        <textarea
          id="splash-comment-text"
          placeholder="Write a comment..."
        ></textarea>


        <button
          onclick="publishSplashComment(${index})"
        >

          📤 Post Comment

        </button>


        <button
          onclick="renderSplashface()"
        >

          Cancel

        </button>

      </div>

    `

  );

}


function publishSplashComment(
  index
) {

  const input =
    document.getElementById(
      "splash-comment-text"
    );


  if (
    !input ||
    !input.value.trim()
  ) {

    return;

  }


  splashPosts[index]
    .comments
    .push(
      input.value.trim()
    );


  renderSplashface();

}


function newPost() {

  openApp(

    "New Post",

    `

      <div
        class="card"
      >

        <h2>
          ➕ New SplashFace Post
        </h2>


        <textarea
          id="new-post-text"
          placeholder="What's on your mind?"
        ></textarea>


        <button
          onclick="publishNewPost()"
        >

          📤 Post

        </button>


        <button
          onclick="renderSplashface()"
        >

          Cancel

        </button>

      </div>

    `

  );

}


function publishNewPost() {

  const input =
    document.getElementById(
      "new-post-text"
    );


  if (
    !input ||
    !input.value.trim()
  ) {

    return;

  }


  splashPosts.unshift({

    user:
      "loganbalbs",

    text:
      input.value.trim(),

    likes:
      0,

    comments:
      []

  });


  renderSplashface();

}


function shuffleSplash() {

  splashPosts =
    [
      ...splashPosts
    ].sort(
      () =>
        Math.random() -
        0.5
    );


  renderSplashface();

}


// ============================================================
// STOCKS
// ============================================================

let stockData = {

  AAPL:
    227.40,

  TSLA:
    355.20,

  GOOG:
    255.10,

  AMZN:
    232.80,

  NFLX:
    112.30,

  NVDA:
    182.60

};


let portfolio = {

  cash:
    10000,

  holdings:
    {}

};


function stocksApp() {

  const rows =

    Object.keys(
      stockData
    )
    .map(
      symbol => `

        <div
          class="stock-row"
        >

          <strong>
            ${symbol}
          </strong>


          <span>
            $${stockData[symbol].toFixed(2)}
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

      <div
        class="card"
      >

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
  ).forEach(
    symbol => {

      stockData[symbol] +=
        (
          Math.random() -
          0.5
        ) * 15;


      if (
        stockData[symbol] <
        1
      ) {

        stockData[symbol] =
          1;

      }

    }
  );


  stocksApp();

}


function stockDetails(
  symbol
) {

  openApp(

    symbol,

    `

      <div
        class="card"
      >

        <h2>
          ${symbol}
        </h2>


        <h1>

          $${stockData[symbol].toFixed(2)}

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

      </div>

    `

  );

}
function stockDetails(
  symbol
) {

  openApp(

    symbol,

    `

      <div
        class="card"
      >

        <h2>
          ${symbol}
        </h2>


        <h1>

          $${stockData[symbol].toFixed(2)}

        </h1>


        <p>
          Simulated Pear Market
        </p>


        <button
          onclick="buyStock('${symbol}')"
        >

          🟢 Buy 1

        </button>


        <button
          onclick="sellStock('${symbol}')"
        >

          🔴 Sell 1

        </button>


        <button
          onclick="stocksApp()"
        >

          ← Back to Stocks

        </button>

      </div>

    `

  );

}


function buyStock(
  symbol
) {

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


  portfolio.cash -=
    price;


  if (
    !portfolio.holdings[symbol]
  ) {

    portfolio.holdings[symbol] =
      0;

  }


  portfolio.holdings[symbol]++;


  stockDetails(
    symbol
  );

}


function sellStock(
  symbol
) {

  if (
    !portfolio.holdings[symbol] ||
    portfolio.holdings[symbol] <= 0
  ) {

    alert(
      "You don't own this stock."
    );

    return;

  }


  portfolio.cash +=
    stockData[symbol];


  portfolio.holdings[symbol]--;


  stockDetails(
    symbol
  );

}


function addStock() {

  const symbol =
    prompt(
      "Enter a stock symbol:"
    );


  if (!symbol) {
    return;
  }


  const clean =
    symbol
      .trim()
      .toUpperCase();


  if (
    !clean
  ) {
    return;
  }


  if (
    stockData[clean]
  ) {

    alert(
      "That stock already exists."
    );

    return;

  }


  stockData[clean] =
    Math.random() * 400 + 10;


  stocksApp();

}


function showPortfolio() {

  const holdings =
    Object.keys(
      portfolio.holdings
    )
    .filter(
      symbol =>
        portfolio.holdings[symbol] >
        0
    );


  openApp(

    "Portfolio",

    `

      <div
        class="card"
      >

        <h2>
          💼 Portfolio
        </h2>


        <h3>

          Cash:
          $${portfolio.cash.toFixed(2)}

        </h3>


        ${
          holdings.length

            ? holdings
                .map(
                  symbol => `

                    <div
                      class="post"
                    >

                      <strong>
                        ${symbol}
                      </strong>

                      <br>

                      Shares:
                      ${portfolio.holdings[symbol]}

                      <br>

                      Value:
                      $${(
                        portfolio.holdings[symbol] *
                        stockData[symbol]
                      ).toFixed(2)}

                    </div>

                  `
                )
                .join("")

            : `

                <p>
                  You don't own any stocks yet.
                </p>

              `
        }

      </div>

    `

  );

}


// ============================================================
// MAPS
// ============================================================

let mapDestination =
  "Pear Park";


function mapsApp() {

  openApp(

    "Maps",

    `

      <div
        class="card"
      >

        <h2>
          🗺️ Maps
        </h2>


        <div
          class="fake-map"
        >

          <div
            class="map-road road-one"
          ></div>

          <div
            class="map-road road-two"
          ></div>

          <div
            class="map-pin"
          >
            📍
          </div>

        </div>


        <h3>
          ${escapeHTML(
            mapDestination
          )}
        </h3>


        <p>
          12 Pear Street
        </p>


        <button
          onclick="chooseDestination()"
        >

          🔎 Search Destination

        </button>


        <button
          onclick="startRoute(this)"
        >

          🚗 Start Route

        </button>


        <button
          onclick="showNearby()"
        >

          📍 Nearby

        </button>


        <div
          id="map-status"
        >

          Ready to navigate.

        </div>

      </div>

    `

  );

}


function chooseDestination() {

  const destination =
    prompt(
      "Where do you want to go?"
    );


  if (
    !destination ||
    !destination.trim()
  ) {
    return;
  }


  mapDestination =
    destination.trim();


  mapsApp();

}


function startRoute(
  button
) {

  if (button) {

    button.textContent =
      "✓ Route Started";

  }


  const status =
    document.getElementById(
      "map-status"
    );


  if (status) {

    status.textContent =
      "Navigating to " +
      mapDestination +
      "...";

  }

}


function showNearby() {

  const status =
    document.getElementById(
      "map-status"
    );


  if (status) {

    status.innerHTML = `

      📍 Pear Café<br>
      🏪 Pear Market<br>
      🌳 Pear Park<br>
      ⛽ Pear Gas

    `;

  }

}


// ============================================================
// PHOTOS
// ============================================================

let pearPhotos =
  JSON.parse(
    localStorage.getItem(
      "pear-photos"
    ) || "[]"
  );


function photosApp() {

  openApp(

    "Photos",

    `

      <div
        class="card"
      >

        <h2>
          🖼️ Photos
        </h2>


        <input
          type="file"
          accept="image/png"
          multiple
          onchange="loadPhotos(event)"
        >


        <button
          onclick="clearPhotos()"
        >

          🗑️ Clear Photos

        </button>


        <div
          id="photo-grid"
          class="photo-grid"
        >

          ${
            pearPhotos.length

              ? pearPhotos
                  .map(
                    (
                      photo,
                      index
                    ) => `

                      <div
                        class="photo-item"
                      >

                        <img
                          src="${photo}"
                          onclick="viewPhoto(${index})"
                        >

                      </div>

                    `
                  )
                  .join("")

              : `

                  <p>
                    No photos yet.
                  </p>

                `
          }

        </div>

      </div>

    `

  );

}


function loadPhotos(
  event
) {

  const files =
    Array.from(
      event.target.files ||
      []
    );


  const pngFiles =
    files.filter(
      file =>
        file.type ===
        "image/png"
    );


  if (
    files.length &&
    !pngFiles.length
  ) {

    alert(
      "Please choose PNG images."
    );

    return;

  }


  Promise.all(

    pngFiles.map(
      file =>
        new Promise(
          resolve => {

            const reader =
              new FileReader();


            reader.onload =
              () =>
                resolve(
                  reader.result
                );


            reader.readAsDataURL(
              file
            );

          }
        )
    )

  ).then(
    images => {

      pearPhotos =
        [
          ...images,
          ...pearPhotos
        ].slice(
          0,
          40
        );


      localStorage.setItem(
        "pear-photos",
        JSON.stringify(
          pearPhotos
        )
      );


      photosApp();

    }
  );

}


function viewPhoto(
  index
) {

  if (
    !pearPhotos[index]
  ) {
    return;
  }


  openApp(

    "Photo",

    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <img
          src="${pearPhotos[index]}"
          style="
            max-width:100%;
            max-height:350px;
            border-radius:12px;
          "
        >


        <button
          onclick="photosApp()"
        >

          ← Back

        </button>

      </div>

    `

  );

}


function clearPhotos() {

  if (
    !confirm(
      "Delete all saved photos?"
    )
  ) {
    return;
  }


  pearPhotos = [];


  localStorage.removeItem(
    "pear-photos"
  );


  photosApp();

}


// ============================================================
// WEATHER
// ============================================================

const weatherStates = [

  {
    icon:
      "☀️",

    temperature:
      24,

    condition:
      "Sunny",

    feels:
      25

  },

  {
    icon:
      "⛅",

    temperature:
      21,

    condition:
      "Partly Cloudy",

    feels:
      22

  },

  {
    icon:
      "🌧️",

    temperature:
      16,

    condition:
      "Rain",

    feels:
      15

  },

  {
    icon:
      "🌨️",

    temperature:
      4,

    condition:
      "Snow",

    feels:
      1

  },

  {
    icon:
      "🌤️",

    temperature:
      19,

    condition:
      "Mostly Sunny",

    feels:
      20

  }

];


let currentWeather =
  weatherStates[0];


function weatherApp() {

  openApp(

    "Weather",

    `

      <div
        class="card weather-card"
        style="
          text-align:center;
        "
      >

        <h2>
          ☀️ Weather
        </h2>


        <div
          style="
            font-size:70px;
          "
        >

          ${currentWeather.icon}

        </div>


        <div
          style="
            font-size:52px;
            font-weight:900;
          "
        >

          ${currentWeather.temperature}°

        </div>


        <h3>

          ${currentWeather.condition}

        </h3>


        <p>

          Feels like
          ${currentWeather.feels}°

        </p>


        <button
          onclick="refreshWeather()"
        >

          🔄 Refresh

        </button>


        <button
          onclick="weatherForecast()"
        >

          📅 Forecast

        </button>

      </div>

    `

  );

}


function refreshWeather() {

  currentWeather =
    weatherStates[
      Math.floor(
        Math.random() *
        weatherStates.length
      )
    ];


  weatherApp();

}


function weatherForecast() {

  openApp(

    "Forecast",

    `

      <div
        class="card"
      >

        <h2>
          📅 5 Day Forecast
        </h2>


        <div class="post">

          Monday
          ☀️
          24°

        </div>


        <div class="post">

          Tuesday
          ⛅
          22°

        </div>


        <div class="post">

          Wednesday
          🌧️
          17°

        </div>


        <div class="post">

          Thursday
          ☀️
          23°

        </div>


        <div class="post">

          Friday
          🌤️
          21°

        </div>


        <button
          onclick="weatherApp()"
        >

          ← Back

        </button>

      </div>

    `

  );

}


// ============================================================
// NOTES
// ============================================================

let pearNotes =
  JSON.parse(
    localStorage.getItem(
      "pear-notes"
    ) || "[]"
  );


function notesApp() {

  openApp(

    "Notes",

    `

      <div
        class="card"
      >

        <h2>
          📝 Notes
        </h2>


        <input
          id="note-title"
          type="text"
          placeholder="Title"
        >


        <textarea
          id="note-body"
          placeholder="Write your note..."
        ></textarea>


        <button
          onclick="saveNote()"
        >

          💾 Save Note

        </button>


        <div
          id="notes-list"
        >

          ${
            pearNotes
              .map(
                (
                  note,
                  index
                ) => `

                  <div
                    class="post"
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


                    <button
                      onclick="deleteNote(${index})"
                    >

                      🗑️ Delete

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
        ? title.value.trim()
        : "Untitled",

    body:
      body.value.trim()

  });


  pearNotes =
    pearNotes.slice(
      0,
      50
    );


  localStorage.setItem(
    "pear-notes",
    JSON.stringify(
      pearNotes
    )
  );


  notesApp();

}


function deleteNote(
  index
) {

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


// ============================================================
// PEARTUNES
// ============================================================

let currentSong =
  null;


const pearSongs = [

  "Pearadise",

  "Sunset Drive",

  "Electric Orchard",

  "Pear Phone Dreams",

  "Fruit Loop"

];


function pearTunesApp() {

  openApp(

    "PearTunes",

    `

      <div
        class="card"
      >

        <h2>
          🎵 PearTunes
        </h2>


        <div
          id="music-player"
          style="
            text-align:center;
            padding:15px;
          "
        >

          ${
            currentSong
              ? "▶ " +
                escapeHTML(
                  currentSong
                )
              : "Choose a song"
          }

        </div>


        ${
          pearSongs
            .map(
              song => `

                <div
                  class="post"
                >

                  <strong>
                    ${escapeHTML(
                      song
                    )}
                  </strong>


                  <button
                    onclick="playSong('${song}')"
                  >

                    ▶

                  </button>

                </div>

              `
            )
            .join("")
        }


        <button
          onclick="shuffleSong()"
        >

          🔀 Shuffle

        </button>


        <button
          onclick="stopSong()"
        >

          ⏹ Stop

        </button>

      </div>

    `

  );

}


function playSong(
  song
) {

  currentSong =
    song;


  pearTunesApp();

}


function shuffleSong() {

  currentSong =
    pearSongs[
      Math.floor(
        Math.random() *
        pearSongs.length
      )
    ];


  pearTunesApp();

}


function stopSong() {

  currentSong =
    null;


  pearTunesApp();

}


// ============================================================
// SETTINGS
// ============================================================

function settingsApp() {

  openApp(

    "Settings",

    `

      <div
        class="card"
      >

        <h2>
          ⚙️ Settings
        </h2>


        <h3>
          Appearance
        </h3>


        <button
          onclick="toggleDarkMode()"
        >

          🌙 Dark Mode

        </button>


        <button
          onclick="toggleAnimations()"
        >

          ✨ Toggle Animations

        </button>


        <h3>
          Screen
        </h3>


        <label>

          Brightness

          <input
            type="range"
            min="50"
            max="120"
            value="100"
            oninput="changeBrightness(this.value)"
          >

        </label>


        <h3>
          Sound
        </h3>


        <button
          onclick="testSound()"
        >

          🔊 Test Sound

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


function changeBrightness(
  value
) {

  phone.style.filter =
    `brightness(${value}%)`;

}


function testSound() {

  try {

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;


    if (!AudioContext) {
      return;
    }


    const context =
      new AudioContext();


    const oscillator =
      context.createOscillator();


    const gain =
      context.createGain();


    oscillator.frequency.value =
      600;


    gain.gain.value =
      0.05;


    oscillator.connect(
      gain
    );


    gain.connect(
      context.destination
    );


    oscillator.start();


    oscillator.stop(
      context.currentTime +
      0.15
    );

  } catch {}

}


function keyboardDemo() {

  openApp(

    "Keyboard Test",

    `

      <div
        class="card"
      >

        <h2>
          ⌨️ Pear Keyboard
        </h2>


        <input
          id="keyboard-test"
          type="text"
          placeholder="Tap here and type..."
        >


        <p>
          Tap the text box to open
          the Pear Phone keyboard.
        </p>

      </div>

    `

  );

}


function phoneInfo() {

  alert(

    "🍐 PEAR PHONE\n\n" +
    "Pear Phone OS\n" +
    "Version 2.0\n" +
    "Raspberry Pi Edition"

  );

}


function batteryInfo() {

  alert(
    "🔋 Battery: 87%"
  );

}


function storageInfo() {

  alert(
    "💾 Storage: 42 GB available"
  );

}


function resetPhone() {

  if (
    !confirm(
      "Reset saved Pear Phone data?"
    )
  ) {

    return;

  }


  localStorage.clear();

  location.reload();

}


// ============================================================
// CLOCK
// ============================================================

let clockInterval =
  null;


function clockApp() {

  openApp(

    "Clock",

    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          🕐 Clock
        </h2>


        <div
          id="clock-time"
          style="
            font-size:46px;
            font-weight:900;
          "
        >

          --:--:--

        </div>


        <p>
          Local Time
        </p>


        <button
          onclick="clockFormat()"
        >

          12 / 24 Hour

        </button>

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


let clock24 =
  false;


function updateClock() {

  const element =
    document.getElementById(
      "clock-time"
    );


  if (!element) {
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
          "2-digit",

        hour12:
          !clock24

      }
    );

}


function clockFormat() {

  clock24 =
    !clock24;


  updateClock();

}


// ============================================================
// VIDEOS
// ============================================================

function videosApp() {

  openApp(

    "Videos",

    `

      <div
        class="card"
      >

        <h2>
          ▶ Videos
        </h2>


        <input
          type="file"
          accept="video/*"
          onchange="loadVideo(event)"
        >


        <video
          id="video-player"
          controls
          playsinline
          style="
            width:100%;
            margin-top:10px;
            border-radius:12px;
            background:#000;
          "
        ></video>


        <p>
          Choose a video from the
          Raspberry Pi or computer.
        </p>

      </div>

    `

  );

}


function loadVideo(
  event
) {

  const file =
    event.target.files[0];


  if (!file) {
    return;
  }


  const player =
    document.getElementById(
      "video-player"
    );


  if (!player) {
    return;
  }


  player.src =
    URL.createObjectURL(
      file
    );


  player.play()
    .catch(
      () => {}
    );

}


// ============================================================
// PHONE
// ============================================================

let dialedNumber =
  "";


function phoneApp() {

  dialedNumber =
    "";


  openApp(

    "Phone",

    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          ☎️ Phone
        </h2>


        <div
          id="phone-number"
          style="
            font-size:30px;
            min-height:45px;
            margin:15px;
            font-weight:bold;
          "
        >
          &nbsp;
        </div>


        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(3,1fr);
            gap:7px;
          "
        >

          ${
            [
              "1","2","3",
              "4","5","6",
              "7","8","9",
              "*","0","#"
            ]
            .map(
              number => `

                <button
                  onclick="dialNumber('${number}')"
                >

                  ${number}

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

          ⌫ Clear

        </button>

      </div>

    `

  );

}


function dialNumber(
  number
) {

  dialedNumber +=
    number;


  const display =
    document.getElementById(
      "phone-number"
    );


  if (display) {

    display.textContent =
      dialedNumber;

  }

}


function clearNumber() {

  dialedNumber =
    "";


  const display =
    document.getElementById(
      "phone-number"
    );


  if (display) {

    display.innerHTML =
      "&nbsp;";

  }

}


function makeCall() {

  if (
    !dialedNumber
  ) {

    alert(
      "Enter a phone number first."
    );

    return;

  }


  alert(
    "Calling " +
    dialedNumber +
    "..."
  );

}


// ============================================================
// MAIL
// ============================================================

function mailApp() {

  openApp(

    "Mail",

    `

      <div
        class="card"
      >

        <h2>
          ✉️ Mail
        </h2>


        <div
          class="post"
          onclick="openMail('Welcome to Pear OS')"
        >

          <strong>
            Welcome to Pear OS
          </strong>


          <p>
            Your Pear Phone is ready!
          </p>

        </div>


        <div
          class="post"
          onclick="openMail('PearTunes Update')"
        >

          <strong>
            PearTunes Update
          </strong>


          <p>
            New music is waiting for you.
          </p>

        </div>


        <button
          onclick="composeMail()"
        >

          ✏️ Compose

        </button>

      </div>

    `

  );

}


function openMail(
  subject
) {

  openApp(

    subject,

    `

      <div
        class="card"
      >

        <h2>
          ${escapeHTML(
            subject
          )}
        </h2>


        <p>

          This is a Pear Phone
          demo email.

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


function composeMail() {

  openApp(

    "Compose",

    `

      <div
        class="card"
      >

        <input
          id="mail-to"
          type="text"
          placeholder="To..."
        >


        <input
          id="mail-subject"
          type="text"
          placeholder="Subject..."
        >


        <textarea
          id="mail-body"
          placeholder="Write your email..."
        ></textarea>


        <button
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


  if (
    !body ||
    !body.value.trim()
  ) {

    return;

  }


  alert(
    "Email sent! ✉️"
  );


  mailApp();

}


// ============================================================
// COMPASS
// ============================================================

let compassAngle =
  0;


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

        <h2>
          🧭 Compass
        </h2>


        <div
          id="compass-dial"
          style="
            font-size:100px;
            transition:.5s;
          "
        >

          🧭

        </div>


        <h2
          id="compass-direction"
        >

          North · 0°

        </h2>


        <button
          onclick="rotateCompass()"
        >

          🔄 Calibrate

        </button>

      </div>

    `

  );

}


function rotateCompass() {

  compassAngle =
    Math.floor(
      Math.random() *
      360
    );


  const directions = [

    "North",
    "Northeast",
    "East",
    "Southeast",
    "South",
    "Southwest",
    "West",
    "Northwest"

  ];


  const direction =
    directions[
      Math.round(
        compassAngle /
        45
      ) % 8
    ];


  const dial =
    document.getElementById(
      "compass-dial"
    );


  const text =
    document.getElementById(
      "compass-direction"
    );


  if (dial) {

    dial.style.transform =
      `rotate(${compassAngle}deg)`;

  }


  if (text) {

    text.textContent =
      direction +
      " · " +
      compassAngle +
      "°";

  }

}


// ============================================================
// PART 2 ENDS HERE
// ============================================================
