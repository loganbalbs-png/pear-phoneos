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
