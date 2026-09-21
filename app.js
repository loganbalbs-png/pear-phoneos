const phone = document.getElementById("phone-container");

const overlay =
  document.getElementById("overlay");

const appWindow =
  document.getElementById("app-window");

const pageDots =
  document.getElementById("page-dots");

let currentPage = 1;


/* ============================================================
   PAGE SWITCHING
   ============================================================ */

let touchStartX = null;
let touchStartY = null;
let touchMoved = false;

let mouseStartX = null;
let mouseStartY = null;
let mouseDragging = false;

let swipeLocked = false;

function showPage(page) {

  if (
    page === currentPage ||
    swipeLocked
  ) {
    return;
  }

  currentPage = page;

  closeApp();

  if (page === 2) {

    phone.classList.add(
      "page-two"
    );

  } else {

    phone.classList.remove(
      "page-two"
    );

  }

  if (pageDots) {

    pageDots.textContent =
      page === 1
        ? "● ○"
        : "○ ●";

  }

}


/* ============================================================
   TOUCH PAGE SWITCHING
   ============================================================ */

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


/* ============================================================
   MOUSE PAGE SWITCHING
   ============================================================ */

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


/* ============================================================
   KEYBOARD PAGE SWITCHING
   ============================================================ */

window.addEventListener(
  "keydown",
  e => {

    if (
      e.key === "ArrowUp"
    ) {

      showPage(2);

    }

    if (
      e.key === "ArrowDown"
    ) {

      showPage(1);

    }

    if (
      e.key === "Escape"
    ) {

      closeApp();

    }

  }
);


/* ============================================================
   APP SYSTEM
   ============================================================ */

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


/* ============================================================
   CUSTOM PEAR KEYBOARD
   ============================================================ */

let keyboardVisible =
  false;

let keyboardShift =
  false;

let activeKeyboardField =
  null;


/* ------------------------------------------------------------
   WATCH FOR TEXT FIELD CLICKS
   ------------------------------------------------------------ */

function addKeyboardSupport() {

  setTimeout(
    () => {

      const fields =
        appWindow.querySelectorAll(
          "input[type='text'], input:not([type]), textarea"
        );

      fields.forEach(
        field => {

          /*
           * Remember the field as soon as it is
           * touched. This is important because
           * clicking the custom keyboard itself
           * can otherwise move focus away.
           */

          field.addEventListener(
            "pointerdown",
            () => {

              activeKeyboardField =
                field;

            }
          );


          /*
           * The keyboard appears when the
           * actual text field is clicked.
           */

          field.addEventListener(
            "click",
            event => {

              event.stopPropagation();

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


/* ------------------------------------------------------------
   SHOW KEYBOARD
   ------------------------------------------------------------ */

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


    /*
     * Prevent the phone/page swipe system
     * from treating a keyboard tap as a
     * phone gesture.
     */

    keyboard.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        event.stopPropagation();

      }
    );


    keyboard.addEventListener(
      "mousedown",
      event => {

        event.preventDefault();

        event.stopPropagation();

      }
    );


    keyboard.addEventListener(
      "touchstart",
      event => {

        event.preventDefault();

        event.stopPropagation();

      },
      {
        passive: false
      }
    );

  }


  keyboard.style.display =
    "block";


  setTimeout(
    () => {

      keyboard.classList.add(
        "keyboard-show"
      );

    },
    10
  );

}


/* ------------------------------------------------------------
   HIDE KEYBOARD
   ------------------------------------------------------------ */

function hidePearKeyboard(
  immediate = false
) {

  const keyboard =
    document.getElementById(
      "pear-keyboard"
    );

  keyboardVisible =
    false;

  activeKeyboardField =
    null;

  if (!keyboard) {
    return;
  }

  keyboard.classList.remove(
    "keyboard-show"
  );


  if (immediate) {

    keyboard.style.display =
      "none";

    return;

  }


  setTimeout(
    () => {

      keyboard.style.display =
        "none";

    },
    250
  );

}


/* ------------------------------------------------------------
   FIND ACTIVE TEXT FIELD
   ------------------------------------------------------------ */

function getFocusedField() {

  /*
   * Use the remembered field first.
   * This means pressing a keyboard key
   * won't lose the text field just because
   * the keyboard button received the tap.
   */

  if (
    activeKeyboardField &&
    document.body.contains(
      activeKeyboardField
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

    return active;

  }


  return null;

}


/* ------------------------------------------------------------
   INSERT TEXT
   ------------------------------------------------------------ */

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


/* ------------------------------------------------------------
   LETTER KEY
   ------------------------------------------------------------ */

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


/* ------------------------------------------------------------
   SPACE
   ------------------------------------------------------------ */

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


/* ------------------------------------------------------------
   ENTER
   ------------------------------------------------------------ */

function keyboardEnter() {

  const field =
    getFocusedField();


  if (!field) {

    hidePearKeyboard(
      true
    );

    return;

  }


  /*
   * Let the text field know Enter was
   * pressed, but ALWAYS close the
   * Pear keyboard afterward.
   */

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


/* ------------------------------------------------------------
   BACKSPACE
   ------------------------------------------------------------ */

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


/* ------------------------------------------------------------
   SHIFT
   ------------------------------------------------------------ */

function keyboardShiftKey() {

  keyboardShift =
    !keyboardShift;

}


/* ------------------------------------------------------------
   NUMBER
   ------------------------------------------------------------ */

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


/* ============================================================
   MESSAGES
   ============================================================ */

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
    "Sounds good!"
  ],

  Alex: [
    "Hey!",
    "What's up?",
    "See you soon.",
    "LOL 😂"
  ],

  Pear: [
    "🍐 Pear!",
    "Welcome to Pear Phone.",
    "Your phone is working!",
    "This is awesome!"
  ]

};


let currentChat =
  null;


let messageHistory =
  JSON.parse(
    localStorage.getItem(
      "pear-message-history"
    ) || "{}"
  );


function messagesApp() {

  openApp(
    "Messages",
    `

      <div
        class="card"
      >

        <h2>
          💬 Messages
        </h2>

        <div
          id="contact-list"
        >

          ${Object.keys(
            messageContacts
          ).map(
            name => `
              <button
                onclick="openChat('${name}')"
                style="
                  width:100%;
                  margin-bottom:6px;
                "
              >
                💬 ${name}
              </button>
            `
          ).join("")}

        </div>

      </div>

    `
  );

}


function openChat(
  name
) {

  currentChat =
    name;


  if (
    !messageHistory[name]
  ) {

    messageHistory[name] =
      [];

  }


  renderChat();

}


function renderChat() {

  const name =
    currentChat;


  const history =
    messageHistory[name] ||
    [];


  openApp(
    name,
    `

      <div
        class="card"
      >

        <div
          id="chat-messages"
          style="
            min-height:180px;
            max-height:260px;
            overflow:auto;
          "
        >

          ${
            history.length
              ? history.map(
                  message => `
                    <div
                      class="post"
                    >
                      ${escapeHTML(
                        message
                      )}
                    </div>
                  `
                ).join("")
              : `
                <div
                  class="post"
                >
                  Start a conversation with
                  ${escapeHTML(
                    name
                  )}.
                </div>
              `
          }

        </div>


        <input
          id="chat-input"
          type="text"
          placeholder="Message..."
        >


        <button
          onclick="sendMessage()"
        >
          Send
        </button>

      </div>

    `
  );

}


function sendMessage() {

  const input =
    document.getElementById(
      "chat-input"
    );


  if (
    !input ||
    !input.value.trim() ||
    !currentChat
  ) {

    return;

  }


  const text =
    input.value;


  if (
    !messageHistory[
      currentChat
    ]
  ) {

    messageHistory[
      currentChat
    ] = [];

  }


  messageHistory[
    currentChat
  ].push(
    text
  );


  localStorage.setItem(
    "pear-message-history",
    JSON.stringify(
      messageHistory
    )
  );


  const reply =
    randomReply(
      currentChat
    );


  setTimeout(
    () => {

      if (
        !messageHistory[
          currentChat
        ]
      ) {
        return;
      }


      messageHistory[
        currentChat
      ].push(
        reply
      );


      localStorage.setItem(
        "pear-message-history",
        JSON.stringify(
          messageHistory
        )
      );


      if (
        overlay.classList.contains(
          "open"
        ) &&
        currentChat
      ) {

        renderChat();

      }

    },
    700
  );


  renderChat();

}


function randomReply(
  name
) {

  const replies =
    messageContacts[
      name
    ] ||
    [
      "Hey!",
      "Okay!",
      "Sounds good!",
      "😂",
      "No way!"
    ];


  return replies[
    Math.floor(
      Math.random() *
      replies.length
    )
  ];

}


/* ============================================================
   CAMERA
   ============================================================ */

let cameraStream =
  null;

let cameraFacing =
  "user";


function cameraApp() {

  openApp(
    "Camera",
    `

      <div
        class="card"
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
            background:#000;
            border-radius:12px;
          "
        ></video>


        <button
          onclick="startCamera()"
        >
          ▶ Start Camera
        </button>


        <button
          onclick="flipCamera()"
        >
          🔄 Flip
        </button>


        <button
          onclick="capturePhoto()"
        >
          📸 Take Photo
        </button>


        <div
          id="camera-preview"
        ></div>

      </div>

    `
  );


  startCamera();

}


async function startCamera() {

  try {

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices
        .getUserMedia
    ) {

      alert(
        "Camera access is not available in this browser."
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
      await navigator.mediaDevices
        .getUserMedia(
          {
            video: {
              facingMode: {
                ideal:
                  cameraFacing
              },

              width: {
                ideal: 1280
              },

              height: {
                ideal: 720
              }
            },

            audio: false
          }
        );


    video.srcObject =
      cameraStream;


    await video.play();


    /*
     * After permission is granted,
     * look for the Freenove camera.
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


      const preferred =
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
        preferred &&
        preferred.deviceId &&
        cameraStream
      ) {

        const currentTrack =
          cameraStream
            .getVideoTracks()[0];


        if (
          currentTrack &&
          currentTrack
            .getSettings()
            .deviceId !==
            preferred.deviceId
        ) {

          currentTrack.stop();


          const preferredStream =
            await navigator
              .mediaDevices
              .getUserMedia(
                {
                  video: {
                    deviceId: {
                      exact:
                        preferred.deviceId
                    },

                    width: {
                      ideal: 1280
                    },

                    height: {
                      ideal: 720
                    }
                  },

                  audio: false
                }
              );


          cameraStream =
            preferredStream;


          video.srcObject =
            preferredStream;


          await video.play();

        }

      }

    } catch (
      deviceError
    ) {

      console.warn(
        "Could not select preferred camera:",
        deviceError
      );

    }

  } catch (
    error
  ) {

    console.error(
      "Camera error:",
      error
    );


    alert(
      "Camera could not be started. Make sure the camera is connected and browser camera permission is allowed."
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


  const preview =
    document.getElementById(
      "camera-preview"
    );


  if (
    !video ||
    !preview ||
    !video.videoWidth
  ) {

    alert(
      "Start the camera first."
    );

    return;

  }


  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    video.videoWidth;

  canvas.height =
    video.videoHeight;


  const context =
    canvas.getContext(
      "2d"
    );


  context.drawImage(
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


  let photos =
    JSON.parse(
      localStorage.getItem(
        "pear-photos"
      ) || "[]"
    );


  photos.unshift(
    image
  );


  photos =
    photos.slice(
      0,
      30
    );


  localStorage.setItem(
    "pear-photos",
    JSON.stringify(
      photos
    )
  );

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
      track =>
        track.stop()
    );


  cameraStream =
    null;

}


/* ============================================================
   PHOTOS
   ============================================================ */

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


        <div
          id="photo-grid"
          style="
            display:grid;
            grid-template-columns:
              repeat(3,1fr);
            gap:8px;
            margin-top:10px;
          "
        ></div>

      </div>

    `
  );


  renderSavedPhotos();

}


function loadPhotos(
  event
) {

  const files =
    Array.from(
      event.target.files ||
      []
    ).filter(
      file =>
        file.type ===
        "image/png"
    );


  const saved =
    JSON.parse(
      localStorage.getItem(
        "pear-photos"
      ) || "[]"
    );


  Promise.all(
    files.map(
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

      const combined = [
        ...images,
        ...saved
      ].slice(
        0,
        30
      );


      localStorage.setItem(
        "pear-photos",
        JSON.stringify(
          combined
        )
      );


      renderSavedPhotos();

    }
  );

}


function renderSavedPhotos() {

  const grid =
    document.getElementById(
      "photo-grid"
    );


  if (!grid) {
    return;
  }


  const photos =
    JSON.parse(
      localStorage.getItem(
        "pear-photos"
      ) || "[]"
    );


  if (!photos.length) {

    grid.innerHTML = `

      <p
        style="
          grid-column:1/-1;
          text-align:center;
        "
      >
        No photos yet.
      </p>

    `;

    return;

  }


  grid.innerHTML =
    photos.map(
      photo => `

        <img
          src="${photo}"
          style="
            width:100%;
            aspect-ratio:1;
            object-fit:cover;
            border-radius:8px;
          "
        >

      `
    ).join("");

}


/* ============================================================
   SPLASHFACE
   ============================================================ */

let splashPosts =
  JSON.parse(
    localStorage.getItem(
      "pear-splash-posts"
    ) || "[]"
  );


function splashfaceApp() {

  openApp(
    "SplashFace",
    `

      <div
        class="card"
      >

        <h2>
          📸 SplashFace
        </h2>


        <button
          onclick="newPost()"
        >
          ➕ New Post
        </button>


        <div
          id="splash-posts"
        >

          ${
            splashPosts.length

              ? splashPosts
                  .map(
                    (
                      post,
                      index
                    ) => `

                      <div
                        class="post"
                      >

                        <strong>
                          ${escapeHTML(
                            post.text
                          )}
                        </strong>


                        <p>
                          ❤️
                          ${
                            post.likes ||
                            0
                          }
                        </p>


                        ${
                          post.comments &&
                          post.comments.length

                            ? post.comments
                                .map(
                                  comment =>
                                    `
                                      <div>
                                        💬
                                        ${escapeHTML(
                                          comment
                                        )}
                                      </div>
                                    `
                                )
                                .join("")

                            : ""
                        }


                        <button
                          onclick="likeSplash(${index})"
                        >
                          ❤️ Like
                        </button>


                        <button
                          onclick="commentSplash(${index})"
                        >
                          💬 Comment
                        </button>

                      </div>

                    `
                  )
                  .join("")

              : `

                  <div
                    class="post"
                  >
                    No posts yet.
                  </div>

                `
          }

        </div>

      </div>

    `
  );

}


function newPost() {

  openApp(
    "New SplashFace Post",
    `

      <div
        class="card"
      >

        <h2>
          📸 New Post
        </h2>


        <textarea
          id="splash-new-post"
          placeholder="What's happening?"
        ></textarea>


        <button
          onclick="saveSplashPost()"
        >
          Post
        </button>

      </div>

    `
  );

}


function saveSplashPost() {

  const input =
    document.getElementById(
      "splash-new-post"
    );


  if (
    !input ||
    !input.value.trim()
  ) {

    return;

  }


  splashPosts.unshift(
    {
      text:
        input.value,

      likes:
        0,

      comments:
        []
    }
  );


  localStorage.setItem(
    "pear-splash-posts",
    JSON.stringify(
      splashPosts
    )
  );


  splashfaceApp();

}


function likeSplash(
  index
) {

  if (
    !splashPosts[index]
  ) {
    return;
  }


  splashPosts[index].likes =
    (
      splashPosts[index]
        .likes ||
      0
    ) + 1;


  localStorage.setItem(
    "pear-splash-posts",
    JSON.stringify(
      splashPosts
    )
  );


  splashfaceApp();

}


function commentSplash(
  index
) {

  if (
    !splashPosts[index]
  ) {
    return;
  }


  openApp(
    "Comment",
    `

      <div
        class="card"
      >

        <h2>
          💬 Comment
        </h2>


        <textarea
          id="splash-comment"
          placeholder="Write a comment..."
        ></textarea>


        <button
          onclick="saveSplashComment(${index})"
        >
          Post Comment
        </button>

      </div>

    `
  );

}


function saveSplashComment(
  index
) {

  const input =
    document.getElementById(
      "splash-comment"
    );


  if (
    !input ||
    !input.value.trim() ||
    !splashPosts[index]
  ) {

    return;

  }


  if (
    !Array.isArray(
      splashPosts[index]
        .comments
    )
  ) {

    splashPosts[index]
      .comments = [];

  }


  splashPosts[index]
    .comments.push(
      input.value
    );


  localStorage.setItem(
    "pear-splash-posts",
    JSON.stringify(
      splashPosts
    )
  );


  splashfaceApp();

}


/* ============================================================
   STOCKS
   ============================================================ */

function stocksApp() {

  const stocks = [

    [
      "AAPL",
      "Apple",
      "$229.87",
      "+1.8%"
    ],

    [
      "MSFT",
      "Microsoft",
      "$532.44",
      "+0.9%"
    ],

    [
      "TSLA",
      "Tesla",
      "$318.26",
      "-1.2%"
    ],

    [
      "PEAR",
      "Pear Inc.",
      "$99.99",
      "+4.2%"
    ]

  ];


  openApp(
    "Stocks",
    `

      <div
        class="card"
      >

        <h2>
          📈 Stocks
        </h2>


        ${stocks.map(
          stock => `

            <div
              class="post"
            >

              <strong>
                ${stock[0]}
              </strong>

              <br>

              ${stock[1]}

              <br>

              <strong>
                ${stock[2]}
              </strong>

              <span>
                ${stock[3]}
              </span>

            </div>

          `
        ).join("")}

      </div>

    `
  );

}


/* ============================================================
   MAPS
   ============================================================ */

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
          style="
            height:180px;
            display:grid;
            place-items:center;
            background:
              linear-gradient(
                135deg,
                #d8e8ca,
                #e8dfb5
              );
            border-radius:12px;
            font-size:50px;
          "
        >
          📍
        </div>


        <h3>
          Pear Park
        </h3>


        <p>
          12 Pear Street
        </p>


        <button
          onclick="startRoute(this)"
        >
          Start Route
        </button>

      </div>

    `
  );

}


function startRoute(
  button
) {

  if (button) {

    button.textContent =
      "Route Started ✓";

  }

}


/* ============================================================
   WEATHER
   ============================================================ */

function weatherApp() {

  openApp(
    "Weather",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          ☀️ Weather
        </h2>


        <div
          style="
            font-size:65px;
          "
        >
          ☀️
        </div>


        <div
          style="
            font-size:48px;
            font-weight:bold;
          "
        >
          24°
        </div>


        <p>
          Sunny
        </p>


        <p>
          Feels like 25°
        </p>


        <button
          onclick="randomWeather()"
        >
          🔄 Refresh
        </button>

      </div>

    `
  );

}


function randomWeather() {

  const weather = [

    [
      "☀️",
      "Sunny",
      "24°"
    ],

    [
      "🌧️",
      "Rainy",
      "17°"
    ],

    [
      "⛅",
      "Partly Cloudy",
      "21°"
    ],

    [
      "❄️",
      "Snow",
      "-2°"
    ]

  ];


  const result =
    weather[
      Math.floor(
        Math.random() *
        weather.length
      )
    ];


  const card =
    document.querySelector(
      ".app-content .card"
    );


  if (!card) {
    return;
  }


  card.innerHTML = `

    <h2>
      ${result[0]}
      Weather
    </h2>


    <div
      style="
        font-size:65px;
      "
    >
      ${result[0]}
    </div>


    <div
      style="
        font-size:48px;
        font-weight:bold;
      "
    >
      ${result[2]}
    </div>


    <p>
      ${result[1]}
    </p>


    <button
      onclick="randomWeather()"
    >
      🔄 Refresh
    </button>

  `;

}


/* ============================================================
   NOTES
   ============================================================ */

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


        <div>

          ${
            notes.map(
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


  notes.unshift(
    {
      title:
        title &&
        title.value
          ? title.value
          : "Untitled",

      body:
        body.value
    }
  );


  localStorage.setItem(
    "pear-notes",
    JSON.stringify(
      notes
    )
  );


  notesApp();

}


function deleteNote(
  index
) {

  notes.splice(
    index,
    1
  );


  localStorage.setItem(
    "pear-notes",
    JSON.stringify(
      notes
    )
  );


  notesApp();

}


/* ============================================================
   PEARTUNES
   ============================================================ */

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
          class="post"
        >

          🍐 Pearadise

          <button
            onclick="playSong(this,'Pearadise')"
          >
            ▶
          </button>

        </div>


        <div
          class="post"
        >

          🌅 Sunset Drive

          <button
            onclick="playSong(this,'Sunset Drive')"
          >
            ▶
          </button>

        </div>


        <div
          class="post"
        >

          ⚡ Electric Orchard

          <button
            onclick="playSong(this,'Electric Orchard')"
          >
            ▶
          </button>

        </div>


        <div
          id="music-status"
          style="
            margin-top:10px;
            font-weight:bold;
          "
        >
          Select a song.
        </div>

      </div>

    `
  );

}


function playSong(
  button,
  song
) {

  const status =
    document.getElementById(
      "music-status"
    );


  if (status) {

    status.textContent =
      "▶ Playing: " +
      song;

  }

}


/* ============================================================
   SETTINGS
   ============================================================ */

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

      <div
        class="card"
      >

        <h2>
          ⌨️ Pear Keyboard
        </h2>


        <input
          id="keyboard-test"
          type="text"
          placeholder="Type here..."
        >


        <p>
          Tap the text box and use
          the Pear keyboard.
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
    "Built for the Pear Phone"
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


function resetNotes() {

  notes = [];

  localStorage.removeItem(
    "pear-notes"
  );

  notesApp();

}


function resetPhone() {

  if (
    confirm(
      "Reset Pear Phone data?"
    )
  ) {

    localStorage.clear();

    location.reload();

  }

}


function playDemoTone() {

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


/* ============================================================
   CLOCK
   ============================================================ */

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
            font-size:48px;
            font-weight:bold;
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


  clearInterval(
    window.pearClockInterval
  );


  window.pearClockInterval =
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


/* ============================================================
   VIDEOS
   ============================================================ */

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
          style="
            width:100%;
            margin-top:10px;
            border-radius:10px;
          "
        ></video>

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


  if (player) {

    player.src =
      URL.createObjectURL(
        file
      );


    player
      .play()
      .catch(
        () => {}
      );

  }

}


/* ============================================================
   PHONE
   ============================================================ */

function phoneApp() {

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
            font-size:32px;
            min-height:45px;
            margin:15px;
          "
        ></div>


        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(3,1fr);
            gap:8px;
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
          Clear
        </button>

      </div>

    `
  );

}


function dialNumber(
  number
) {

  const display =
    document.getElementById(
      "phone-number"
    );


  if (display) {

    display.textContent +=
      number;

  }

}


function clearNumber() {

  const display =
    document.getElementById(
      "phone-number"
    );


  if (display) {

    display.textContent =
      "";

  }

}


function makeCall() {

  const display =
    document.getElementById(
      "phone-number"
    );


  if (
    !display ||
    !display.textContent
  ) {

    alert(
      "Enter a phone number first."
    );

    return;

  }


  alert(
    "Calling " +
    display.textContent +
    "..."
  );

}


/* ============================================================
   MAIL
   ============================================================ */

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
        >

          <strong>
            Welcome to Pear OS
          </strong>


          <p>
            Your Pear Phone is ready!
          </p>

        </div>


        <input
          id="mail-subject"
          type="text"
          placeholder="Subject"
        >


        <textarea
          id="mail-body"
          placeholder="Write an email..."
        ></textarea>


        <button
          onclick="sendMail()"
        >
          Send
        </button>

      </div>

    `
  );

}


function sendMail() {

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
    "Email sent!\n\n" +
    (
      subject &&
      subject.value
        ? subject.value
        : "(No subject)"
    )
  );

}


/* ============================================================
   COMPASS
   ============================================================ */

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
          id="compass"
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
          onclick="randomCompass()"
        >
          🔄 Calibrate
        </button>

      </div>

    `
  );

}


function randomCompass() {

  const directions = [

    [
      "North",
      0
    ],

    [
      "Northeast",
      45
    ],

    [
      "East",
      90
    ],

    [
      "Southeast",
      135
    ],

    [
      "South",
      180
    ],

    [
      "Southwest",
      225
    ],

    [
      "West",
      270
    ],

    [
      "Northwest",
      315
    ]

  ];


  const direction =
    directions[
      Math.floor(
        Math.random() *
        directions.length
      )
    ];


  const text =
    document.getElementById(
      "compass-direction"
    );


  const compass =
    document.getElementById(
      "compass"
    );


  if (text) {

    text.textContent =
      direction[0] +
      " · " +
      direction[1] +
      "°";

  }


  if (compass) {

    compass.style.transform =
      `rotate(${direction[1]}deg)`;

  }

}


/* ============================================================
   PAGE 2 APPS
   ============================================================ */

function lingoApp() {

  openApp(
    "Lingo",
    `

      <div
        class="card"
      >

        <h2>
          🗣️ Lingo
        </h2>


        <input
          id="lingo-input"
          type="text"
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
  ) {
    return;
  }


  const dictionary = {

    hello:
      "hola",

    goodbye:
      "adios",

    apple:
      "manzana",

    friend:
      "amigo",

    house:
      "casa",

    water:
      "agua",

    music:
      "musica",

    phone:
      "telefono"

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

    [
      "hello",
      "hola"
    ],

    [
      "apple",
      "manzana"
    ],

    [
      "friend",
      "amigo"
    ],

    [
      "house",
      "casa"
    ],

    [
      "water",
      "agua"
    ]

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


/* ============================================================
   DANWARP
   ============================================================ */

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

      <div
        class="card"
      >

        <h2>
          🌀 DanWarp
        </h2>


        <div
          id="warp-location"
          style="
            font-size:24px;
            margin:15px 0;
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


/* ============================================================
   IMAGE
   ============================================================ */

let imageRotation =
  0;

let imageScale =
  1;


function imageApp() {

  openApp(
    "Image",
    `

      <div
        class="card"
      >

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
        ></div>


        <button
          onclick="rotateImage()"
        >
          🔄 Rotate
        </button>


        <button
          onclick="imageZoom(1.2)"
        >
          🔍 Zoom In
        </button>


        <button
          onclick="imageZoom(.8)"
        >
          🔎 Zoom Out
        </button>


        <button
          onclick="imageFilter()"
        >
          ✨ Filter
        </button>

      </div>

    `
  );

}


function loadSingleImage(
  event
) {

  const file =
    event.target.files[0];


  if (!file) {
    return;
  }


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


  imageRotation =
    0;

  imageScale =
    1;

}


function rotateImage() {

  const image =
    document.getElementById(
      "studio-image"
    );


  if (!image) {
    return;
  }


  imageRotation +=
    90;


  image.style.transform =
    `rotate(${imageRotation}deg)
     scale(${imageScale})`;

}


function imageZoom(
  amount
) {

  const image =
    document.getElementById(
      "studio-image"
    );


  if (!image) {
    return;
  }


  imageScale *=
    amount;


  imageScale =
    Math.max(
      0.5,
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


  if (!image) {
    return;
  }


  image.style.filter =
    image.style.filter
      ? ""
      : "grayscale(100%) contrast(1.2)";

}


/* ============================================================
   CHRONO
   ============================================================ */

function chronoApp() {

  openApp(
    "Chrono",
    `

      <div
        class="card"
      >

        <h2>
          ⏱️ Chrono
        </h2>


        <div
          id="chrono-time"
          style="
            font-size:45px;
          "
        >
          00:00
        </div>


        <button
          onclick="chronoStart()"
        >
          Start
        </button>


        <button
          onclick="chronoStop()"
        >
          Stop
        </button>


        <button
          onclick="chronoReset()"
        >
          Reset
        </button>


        <button
          onclick="chronoChallenge()"
        >
          🎯 Challenge
        </button>

      </div>

    `
  );

}


let chronoSeconds =
  0;

let chronoInterval =
  null;


function chronoStart() {

  if (
    chronoInterval
  ) {
    return;
  }


  chronoInterval =
    setInterval(
      () => {

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

      },
      1000
    );

}


function chronoStop() {

  clearInterval(
    chronoInterval
  );

  chronoInterval =
    null;

}


function chronoReset() {

  chronoStop();


  chronoSeconds =
    0;


  const el =
    document.getElementById(
      "chrono-time"
    );


  if (el) {

    el.textContent =
      "00:00";

  }

}


function chronoChallenge() {

  const target =
    Math.floor(
      Math.random() *
      10
    ) + 5;


  alert(
    "Start the stopwatch and try to stop it at exactly " +
    target +
    " seconds!"
  );

}


function formatTime(
  seconds
) {

  const minutes =
    Math.floor(
      seconds / 60
    );


  const remaining =
    seconds % 60;


  return (
    String(
      minutes
    ).padStart(
      2,
      "0"
    ) +
    ":" +
    String(
      remaining
    ).padStart(
      2,
      "0"
    )
  );

}


/* ============================================================
   ZAPLOOK
   ============================================================ */

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

      <div
        class="card"
      >

        <h2>
          ⚡ ZapLook
        </h2>


        <input
          id="zap-input"
          type="text"
          placeholder="Search..."
        >


        <button
          onclick="zapSearch()"
        >
          🔎 Search
        </button>


        <h3>
          Categories
        </h3>


        ${zapCategories.map(
          category => `

            <button
              onclick="zapCategory('${category}')"
            >
              ${category}
            </button>

          `
        ).join("")}


        <div
          id="zap-result"
        ></div>

      </div>

    `
  );

}


function zapSearch() {

  const input =
    document.getElementById(
      "zap-input"
    );


  if (!input) {
    return;
  }


  const result =
    document.getElementById(
      "zap-result"
    );


  if (!result) {
    return;
  }


  result.innerHTML = `

    <div
      class="card"
    >

      <h3>

        Results for
        "${escapeHTML(
          input.value
        )}"

      </h3>


      <p>
        ⚡ Result #1
      </p>

      <p>
        ⚡ Result #2
      </p>

      <p>
        ⚡ Result #3
      </p>

    </div>

  `;

}


function zapCategory(
  category
) {

  const result =
    document.getElementById(
      "zap-result"
    );


  if (result) {

    result.innerHTML = `

      <div
        class="card"
      >

        <h3>
          ${escapeHTML(
            category
          )}
        </h3>


        <p>
          Discover something interesting!
        </p>

      </div>

    `;

  }

}


/* ============================================================
   MONKEY MINI GAME
   ============================================================ */

let monkeyScore =
  0;


function monkeyApp() {

  monkeyScore =
    0;


  openApp(
    "Monkey",
    `

      <div
        class="card"
        style="
          text-align:center;
        "
      >

        <h2>
          🐒 Monkey Game
        </h2>


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

          <span
            id="banana-score"
          >
            0
          </span>

        </h3>


        <button
          onclick="monkeyJump()"
        >
          🍌 Catch Banana
        </button>


        <button
          onclick="monkeyRandom()"
        >
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


    setTimeout(
      () => {

        if (monkey) {

          monkey.style.transform =
            "translateY(0) rotate(0)";

        }

      },
      300
    );

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


/* ============================================================
   REMARK
   ============================================================ */

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

      <div
        class="card"
      >

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
                (
                  remark,
                  index
                ) => `

                  <div
                    class="post"
                  >

                    ${escapeHTML(
                      remark
                    )}

                    <br>

                    <button
                      onclick="deleteRemark(${index})"
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


function deleteRemark(
  index
) {

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


/* ============================================================
   UTILITY
   ============================================================ */

function escapeHTML(
  value
) {

  return String(
    value
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

        e.preventDefault();
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


  Object.keys(
    connections
  ).forEach(id => {

    const button =
      document.getElementById(id);

    if (!button) return;


    button.addEventListener(
      "click",
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
  document.getElementById(
    "home"
  );


if (homeButton) {

  homeButton.addEventListener(
    "click",
    e => {

      e.preventDefault();
      e.stopPropagation();

      closeApp();

    }
  );

}


// ============================================================
// UTILITY
// ============================================================

function escapeHTML(
  value
) {

  return String(
    value
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
