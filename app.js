(() => {

"use strict";

/* =========================================================
   ELEMENTS
   ========================================================= */

const phone =
  document.getElementById("phone");

const page1 =
  document.getElementById("page1");

const page2 =
  document.getElementById("page2");

const overlay =
  document.getElementById("app-overlay");

const appWindow =
  document.getElementById("app-window");

const home =
  document.getElementById("home");

const keyboard =
  document.getElementById("pear-keyboard");

const transition =
  document.getElementById("page-transition");


/* =========================================================
   STATE
   ========================================================= */

let currentPage = 1;

let dragStartY = null;

let keyboardTarget = null;

let cameraStream = null;

let clockTimer = null;


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

  return String(value).replace(
    /[&<>"']/g,
    character => {

      const replacements = {

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        '"': "&quot;",

        "'": "&#39;"

      };

      return replacements[character];

    }
  );

}


/* =========================================================
   OPEN APP
   ========================================================= */

function openApp(id) {

  closeKeyboard();

  switch(id) {

    case "messages":
      messages();
      break;

    case "camera":
      camera();
      break;

    case "photos":
      photos();
      break;

    case "notes":
      notes();
      break;

    case "stocks":
      stocks();
      break;

    case "maps":
      maps();
      break;

    case "weather":
      weather();
      break;

    case "clock":
      clock();
      break;

    case "settings":
      settings();
      break;

    case "splashface":
      splashFace();
      break;

    case "peartunes":
      music();
      break;

    case "music":
      music();
      break;

    case "videos":
      videos();
      break;

    case "phone":
      phoneApp();
      break;

    case "mail":
      mail();
      break;

    case "compass":
      compass();
      break;

    default:
      simple(
        "Pear OS",
        `
        <div class="big">
          ${escapeHTML(id)}
        </div>
        `
      );

  }

}


/* =========================================================
   APP WINDOW
   ========================================================= */

function openWindow(title, content) {

  stopCamera();

  clearInterval(clockTimer);

  appWindow.innerHTML = `

    <div class="app-header">

      <button
        id="app-back"
        aria-label="Back">
        ‹
      </button>

      <span>
        ${escapeHTML(title)}
      </span>

    </div>


    <div class="app-body">

      ${content}

    </div>

  `;

  overlay.classList.add("open");


  document
    .getElementById("app-back")
    .addEventListener(
      "click",
      closeApp
    );


  wireKeyboardInputs();

}


/* =========================================================
   CLOSE APP
   ========================================================= */

function closeApp() {

  stopCamera();

  clearInterval(clockTimer);

  closeKeyboard();

  overlay.classList.remove("open");

  appWindow.innerHTML = "";

}


/* =========================================================
   SIMPLE APP
   ========================================================= */

function simple(title, content) {

  openWindow(
    title,
    content
  );

}


/* =========================================================
   MESSAGES
   ========================================================= */

function messages() {

  const saved =
    JSON.parse(
      localStorage.getItem(
        "pearMessages"
      ) || "[]"
    );


  openWindow(
    "Messages",
    `

    <div>

      <div class="bubble">
        Hey 👋
      </div>

      <div class="bubble">
        Welcome to Pear Phone.
      </div>

      ${

        saved
          .map(
            message => `
              <div class="bubble me">
                ${escapeHTML(message)}
              </div>
            `
          )
          .join("")

      }

    </div>


    <div
      class="row"
      style="margin-top:8px">

      <input
        id="messageInput"
        style="flex:1"
        placeholder="Message">

      <button
        id="sendMessage">
        Send
      </button>

    </div>

    `
  );


  const input =
    document.getElementById(
      "messageInput"
    );


  document
    .getElementById("sendMessage")
    .addEventListener(
      "click",
      () => {

        const value =
          input.value.trim();

        if(!value)
          return;


        saved.push(value);


        localStorage.setItem(
          "pearMessages",
          JSON.stringify(
            saved.slice(-50)
          )
        );


        messages();

      }
    );


  input.addEventListener(
    "keydown",
    event => {

      if(event.key === "Enter") {

        document
          .getElementById(
            "sendMessage"
          )
          .click();

      }

    }
  );

}


/* =========================================================
   CAMERA
   ========================================================= */

async function camera() {

  openWindow(
    "Camera",
    `

    <video
      id="cameraVideo"
      class="camera-video"
      autoplay
      playsinline>
    </video>


    <div
      class="row"
      style="
        margin-top:7px;
        flex-wrap:wrap;
      ">

      <button id="startCamera">
        Start Camera
      </button>

      <button id="takePhoto">
        Take Photo
      </button>

    </div>


    <p
      id="cameraStatus"
      style="
        font-size:11px;
        color:#666;
      ">
      Starting camera...
    </p>


    <canvas
      id="cameraCanvas"
      hidden>
    </canvas>


    <img
      id="capturedPhoto"
      style="
        display:none;
        width:100%;
        margin-top:7px;
        border-radius:12px;
      ">

    `
  );


  document
    .getElementById(
      "startCamera"
    )
    .addEventListener(
      "click",
      startCamera
    );


  document
    .getElementById(
      "takePhoto"
    )
    .addEventListener(
      "click",
      takePhoto
    );


  await startCamera();

}


/* =========================================================
   START CAMERA
   ========================================================= */

async function startCamera() {

  const video =
    document.getElementById(
      "cameraVideo"
    );

  const status =
    document.getElementById(
      "cameraStatus"
    );


  if(!video)
    return;


  if(
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    status.textContent =
      "Camera unavailable. Use HTTPS and a current Chromium browser.";

    return;

  }


  try {

    stopCamera();


    cameraStream =
      await navigator
        .mediaDevices
        .getUserMedia({

          video: {
            facingMode: {
              ideal: "environment"
            }
          },

          audio: false

        });


    video.srcObject =
      cameraStream;


    await video.play();


    status.textContent =
      "Camera connected ✓";

  }

  catch(error) {

    console.error(error);


    status.textContent =
      "Camera permission/device error. Check browser permissions and make sure the camera is connected.";

  }

}


/* =========================================================
   TAKE PHOTO
   ========================================================= */

function takePhoto() {

  const video =
    document.getElementById(
      "cameraVideo"
    );

  const canvas =
    document.getElementById(
      "cameraCanvas"
    );

  const image =
    document.getElementById(
      "capturedPhoto"
    );


  if(
    !video ||
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


  const data =
    canvas.toDataURL(
      "image/jpeg",
      .9
    );


  image.src = data;

  image.style.display =
    "block";


  const saved =
    JSON.parse(
      localStorage.getItem(
        "pearPhotos"
      ) || "[]"
    );


  saved.unshift(data);


  localStorage.setItem(
    "pearPhotos",
    JSON.stringify(
      saved.slice(0,24)
    )
  );

}


/* =========================================================
   STOP CAMERA
   ========================================================= */

function stopCamera() {

  if(cameraStream) {

    cameraStream
      .getTracks()
      .forEach(
        track =>
          track.stop()
      );

    cameraStream = null;

  }


  const video =
    document.getElementById(
      "cameraVideo"
    );


  if(video)
    video.srcObject = null;

}


/* =========================================================
   PHOTOS
   ========================================================= */

function photos() {

  const saved =
    JSON.parse(
      localStorage.getItem(
        "pearPhotos"
      ) || "[]"
    );


  openWindow(
    "Photos",
    `

    <input
      id="photoImport"
      type="file"
      accept="image/*"
      multiple>


    <div
      style="height:7px">
    </div>


    <div class="photos">

      ${

        saved.length

          ? saved
              .map(
                photo => `
                  <img
                    src="${photo}"
                    alt="Photo">
                `
              )
              .join("")

          :

            `
            <p
              style="
                grid-column:1/-1;
                text-align:center;
                color:#777;
              ">
              No photos yet.
            </p>
            `

      }

    </div>

    `
  );


  document
    .getElementById(
      "photoImport"
    )
    .addEventListener(
      "change",
      async event => {

        const files =
          [
            ...event.target.files
          ];


        const imported = [];


        for(
          const file
          of files
        ) {

          const result =
            await new Promise(
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
            );


          imported.push(
            result
          );

        }


        localStorage.setItem(
          "pearPhotos",
          JSON.stringify(
            [
              ...imported,
              ...saved
            ].slice(0,24)
          )
        );


        photos();

      }
    );

}


/* =========================================================
   NOTES
   ========================================================= */

function notes() {

  const saved =
    JSON.parse(
      localStorage.getItem(
        "pearNotes"
      ) || "[]"
    );


  openWindow(
    "Notes",
    `

    <div>

      ${

        saved
          .map(
            (note,index) => `

              <div
                class="stock"
                data-note="${index}">

                <span>

                  <b>
                    ${escapeHTML(
                      note.title
                    )}
                  </b>

                  <br>

                  <small>
                    ${escapeHTML(
                      note.body.slice(
                        0,
                        70
                      )
                    )}
                  </small>

                </span>

              </div>

            `
          )
          .join("")

      }

    </div>


    <input
      id="noteTitle"
      style="
        width:100%;
        margin-bottom:6px;
      "
      placeholder="Title">


    <textarea
      id="noteBody"
      placeholder="Write your note...">
    </textarea>


    <button
      id="saveNote"
      style="margin-top:6px">

      Save Note

    </button>

    `
  );


  document
    .querySelectorAll(
      "[data-note]"
    )
    .forEach(
      element => {

        element.addEventListener(
          "click",
          () => {

            const note =
              saved[
                Number(
                  element.dataset.note
                )
              ];


            document
              .getElementById(
                "noteTitle"
              )
              .value =
              note.title;


            document
              .getElementById(
                "noteBody"
              )
              .value =
              note.body;

          }
        );

      }
    );


  document
    .getElementById(
      "saveNote"
    )
    .addEventListener(
      "click",
      () => {

        const title =
          document
            .getElementById(
              "noteTitle"
            )
            .value
            .trim();


        const body =
          document
            .getElementById(
              "noteBody"
            )
            .value;


        saved.unshift({

          title:
            title || "Untitled",

          body:
            body

        });


        localStorage.setItem(
          "pearNotes",
          JSON.stringify(
            saved.slice(0,50)
          )
        );


        notes();

      }
    );

}


/* =========================================================
   STOCKS
   ========================================================= */

function stocks() {

  const data = [

    [
      "AAPL",
      "Apple",
      "$229.87",
      "+1.8%",
      true
    ],

    [
      "MSFT",
      "Microsoft",
      "$532.44",
      "+0.9%",
      true
    ],

    [
      "TSLA",
      "Tesla",
      "$318.26",
      "-1.2%",
      false
    ],

    [
      "PEAR",
      "Pear Inc.",
      "$99.99",
      "+4.2%",
      true
    ]

  ];


  openWindow(
    "Stocks",

    data
      .map(
        stock => `

          <div class="stock">

            <span>

              <b>
                ${stock[0]}
              </b>

              <br>

              <small>
                ${stock[1]}
              </small>

            </span>


            <span
              style="
                text-align:right;
              ">

              <b>
                ${stock[2]}
              </b>

              <br>

              <small
                style="
                  color:
                    ${stock[4]
                      ? "green"
                      : "red"};
                ">

                ${stock[3]}

              </small>

            </span>

          </div>

        `
      )
      .join("")
  );

}


/* =========================================================
   MAPS
   ========================================================= */

function maps() {

  openWindow(
    "Maps",

    `

    <div class="map">
      📍
    </div>


    <h3>
      Pear Park
    </h3>


    <p>
      12 Pear Street ·
      5 min away
    </p>


    <button id="route">
      Start Route
    </button>

    `
  );


  document
    .getElementById(
      "route"
    )
    .addEventListener(
      "click",
      event => {

        event.target.textContent =
          "Route Started ✓";

      }
    );

}


/* =========================================================
   WEATHER
   ========================================================= */

function weather() {

  openWindow(
    "Weather",

    `

    <div class="big">

      ☀️

      <br>

      <span
        style="font-size:42px">

        24°

      </span>

    </div>


    <p
      style="text-align:center">

      Sunny ·
      Feels like 25°

    </p>

    `
  );

}


/* =========================================================
   CLOCK
   ========================================================= */

function clock() {

  openWindow(
    "Clock",

    `

    <div
      id="clockText"
      class="big">

      --:--:--

    </div>


    <p
      style="
        text-align:center;
        color:#777;
      ">

      Local time

    </p>

    `
  );


  function updateClock() {

    const element =
      document.getElementById(
        "clockText"
      );


    if(!element)
      return;


    element.textContent =
      new Date()
        .toLocaleTimeString(
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


  updateClock();


  clockTimer =
    setInterval(
      updateClock,
      1000
    );

}


/* =========================================================
   SETTINGS
   ========================================================= */

function settings() {

  openWindow(
    "Settings",

    `

    <label
      style="
        display:flex;
        justify-content:space-between;
        padding:10px 0;
        border-bottom:1px solid #ddd;
      ">

      Dark Mode

      <input
        id="darkMode"
        type="checkbox">

    </label>


    <button
      id="resetData"
      style="margin-top:10px">

      Reset Saved Data

    </button>

    `
  );


  const dark =
    document.getElementById(
      "darkMode"
    );


  dark.checked =
    localStorage.getItem(
      "pearDark"
    ) === "1";


  dark.addEventListener(
    "change",
    () => {

      localStorage.setItem(
        "pearDark",
        dark.checked
          ? "1"
          : "0"
      );

    }
  );


  document
    .getElementById(
      "resetData"
    )
    .addEventListener(
      "click",
      () => {

        localStorage.clear();

        location.reload();

      }
    );

}


/* =========================================================
   SPLASHFACE
   ========================================================= */

function splashFace() {

  openWindow(
    "SplashFace",

    `

    <div
      class="big"
      style="color:#3f78c7">

      Sf

    </div>


    <p
      style="text-align:center">

      Welcome to SplashFace.

    </p>

    `
  );

}


/* =========================================================
   MUSIC
   ========================================================= */

function music() {

  openWindow(
    "PearTunes",

    `

    <div
      class="big">

      ♫

    </div>


    <div class="stock">

      <span>
        Pearadise
      </span>

      <button
        data-song="Pearadise">

        ▶

      </button>

    </div>


    <div class="stock">

      <span>
        Sunset Drive
      </span>

      <button
        data-song="Sunset Drive">

        ▶

      </button>

    </div>


    <div class="stock">

      <span>
        Electric Orchard
      </span>

      <button
        data-song="Electric Orchard">

        ▶

      </button>

    </div>

    `
  );


  document
    .querySelectorAll(
      "[data-song]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            button.textContent =
              "✓";

          }
        );

      }
    );

}


/* =========================================================
   VIDEOS
   ========================================================= */

function videos() {

  openWindow(
    "Videos",

    `

    <div class="big">
      ▶
    </div>


    <p
      style="text-align:center">

      Your videos will appear here.

    </p>

    `
  );

}


/* =========================================================
   PHONE
   ========================================================= */

function phoneApp() {

  openWindow(
    "Phone",

    `

    <div class="big">
      ☎
    </div>


    <p
      style="text-align:center">

      Phone is ready.

    </p>

    `
  );

}


/* =========================================================
   MAIL
   ========================================================= */

function mail() {

  openWindow(
    "Mail",

    `

    <h3>
      Inbox
    </h3>


    <div class="stock">

      <span>

        <b>
          Welcome to Pear OS
        </b>

        <br>

        <small>
          Pear Team
        </small>

      </span>


      <span>
        9:41
      </span>

    </div>

    `
  );

}


/* =========================================================
   COMPASS
   ========================================================= */

function compass() {

  openWindow(
    "Compass",

    `

    <div class="big">
      🧭
    </div>


    <p
      style="text-align:center">

      North · 0°

    </p>

    `
  );

}


/* =========================================================
   KEYBOARD
   ========================================================= */

const keyboardRows = [

  [
    "1","2","3","4","5",
    "6","7","8","9","0"
  ],

  [
    "Q","W","E","R","T",
    "Y","U","I","O","P"
  ],

  [
    "A","S","D","F","G",
    "H","J","K","L","⌫"
  ],

  [
    "Z","X","C","V","B",
    "N","M",",",".","↵"
  ]

];


function buildKeyboard() {

  keyboard.innerHTML = "";


  keyboardRows
    .flat()
    .forEach(
      key => {

        const button =
          document.createElement(
            "button"
          );


        button.textContent =
          key;


        button.addEventListener(
          "click",
          () =>
            keyboardPress(key)
        );


        keyboard.appendChild(
          button
        );

      }
    );


  const space =
    document.createElement(
      "button"
    );


  space.textContent =
    "SPACE";


  space.className =
    "space";


  space.addEventListener(
    "click",
    () =>
      insertText(" ")
  );


  keyboard.appendChild(
    space
  );


  const done =
    document.createElement(
      "button"
    );


  done.textContent =
    "DONE";


  done.className =
    "wide";


  done.addEventListener(
    "click",
    closeKeyboard
  );


  keyboard.appendChild(
    done
  );

}


function insertText(text) {

  if(!keyboardTarget)
    return;


  const start =
    keyboardTarget.selectionStart ??
    keyboardTarget.value.length;


  const end =
    keyboardTarget.selectionEnd ??
    start;


  keyboardTarget.value =
    keyboardTarget.value.slice(
      0,
      start
    ) +

    text +

    keyboardTarget.value.slice(
      end
    );


  keyboardTarget.selectionStart =
    start + text.length;


  keyboardTarget.selectionEnd =
    start + text.length;


  keyboardTarget.dispatchEvent(
    new Event(
      "input",
      {
        bubbles:true
      }
    )
  );

}


function keyboardPress(key) {

  if(key === "⌫") {

    if(!keyboardTarget)
      return;


    const position =
      keyboardTarget.selectionStart ??
      keyboardTarget.value.length;


    if(position > 0) {

      keyboardTarget.value =
        keyboardTarget.value.slice(
          0,
          position - 1
        ) +

        keyboardTarget.value.slice(
          position
        );


      keyboardTarget.selectionStart =
        position - 1;

      keyboardTarget.selectionEnd =
        position - 1;

    }


    return;

  }


  if(key === "↵") {

    if(keyboardTarget) {

      keyboardTarget.dispatchEvent(
        new KeyboardEvent(
          "keydown",
          {
            key:"Enter",
            bubbles:true
          }
        )
      );

    }


    return;

  }


  insertText(
    key.toLowerCase()
  );

}


function wireKeyboardInputs() {

  appWindow
    .querySelectorAll(
      'input:not([type="file"]), textarea'
    )
    .forEach(
      element => {

        element.addEventListener(
          "focus",
          () => {

            keyboardTarget =
              element;


            keyboard
              .classList
              .add("show");

          }
        );

      }
    );

}


function closeKeyboard() {

  keyboard
    .classList
    .remove("show");


  keyboardTarget =
    null;

}


buildKeyboard();


/* =========================================================
   PAGE SWITCHING
   ========================================================= */

function setPage(number, animate = true) {

  currentPage =
    number;


  page1.style.display =
    number === 1
      ? "block"
      : "none";


  page2.style.display =
    number === 2
      ? "grid"
      : "none";


  if(animate) {

    transition
      .classList
      .remove("go");


    void transition.offsetWidth;


    transition
      .classList
      .add("go");

  }

}


/* =========================================================
   SWIPE
   ========================================================= */

function finishSwipe(endY) {

  if(dragStartY === null)
    return;


  const distance =
    endY - dragStartY;


  dragStartY =
    null;


  if(
    Math.abs(distance) < 45
  )
    return;


  if(distance < 0) {

    /*
      Swipe UP
      Page 1 -> Page 2
    */

    setPage(
      2,
      true
    );

  }

  else {

    /*
      Swipe DOWN
      Page 2 -> Page 1
    */

    setPage(
      1,
      true
    );

  }

}


/* =========================================================
   TOUCH
   ========================================================= */

phone.addEventListener(
  "touchstart",
  event => {

    if(
      !overlay.classList.contains(
        "open"
      )
    ) {

      dragStartY =
        event.touches[0].clientY;

    }

  },
  {
    passive:true
  }
);


phone.addEventListener(
  "touchend",
  event => {

    finishSwipe(
      event.changedTouches[0]
        .clientY
    );

  },
  {
    passive:true
  }
);


/* =========================================================
   MOUSE DRAG
   ========================================================= */

phone.addEventListener(
  "mousedown",
  event => {

    if(
      !overlay.classList.contains(
        "open"
      )
    ) {

      dragStartY =
        event.clientY;

    }

  }
);


phone.addEventListener(
  "mouseup",
  event => {

    finishSwipe(
      event.clientY
    );

  }
);


/* =========================================================
   KEYBOARD PAGE CONTROLS
   ========================================================= */

window.addEventListener(
  "keydown",
  event => {

    if(
      event.key === "ArrowUp"
    ) {

      setPage(
        2,
        true
      );

    }


    if(
      event.key === "ArrowDown"
    ) {

      setPage(
        1,
        true
      );

    }


    if(
      event.key === "Escape"
    ) {

      closeApp();

    }

  }
);


/* =========================================================
   EXACT APP ROUTING
   ========================================================= */

phone.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-app]"
      );


    if(!button)
      return;


    event.preventDefault();

    event.stopPropagation();


    openApp(
      button.dataset.app
    );

  }
);


/* =========================================================
   HOME
   ========================================================= */

home.addEventListener(
  "click",
  event => {

    event.preventDefault();

    event.stopPropagation();


    setPage(
      1,
      false
    );


    closeApp();

  }
);


/* =========================================================
   PREVENT APP WINDOW FROM TRIGGERING SWIPES
   ========================================================= */

overlay.addEventListener(
  "touchstart",
  event => {
    event.stopPropagation();
  },
  {
    passive:true
  }
);


overlay.addEventListener(
  "touchend",
  event => {
    event.stopPropagation();
  },
  {
    passive:true
  }
);


/* =========================================================
   START ON PAGE 1
   ========================================================= */

setPage(
  1,
  false
);

})();
