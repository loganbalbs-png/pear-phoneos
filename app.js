(() => {
"use strict";

/* =========================================================
   ELEMENTS
   ========================================================= */

const phone = document.getElementById("phone");
const overlay = document.getElementById("overlay");
const app = document.getElementById("app");
const keyboard = document.getElementById("keyboard");
const flash = document.getElementById("page-flash");

let currentPage = 1;
let touchStartY = null;
let mouseStartY = null;
let keyboardTarget = null;

let cameraStream = null;
let clockTimer = null;
let musicTimer = null;
let stopwatchTimer = null;

let cameraFacing = "environment";

let stopwatchSeconds = 0;

/* =========================================================
   STORAGE
   ========================================================= */

function getJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* =========================================================
   ESCAPE HTML
   ========================================================= */

function esc(value) {
  return String(value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

/* =========================================================
   CLOSE APP
   ========================================================= */

function closeApp() {

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  clearInterval(clockTimer);
  clearInterval(musicTimer);
  clearInterval(stopwatchTimer);

  clockTimer = null;
  musicTimer = null;
  stopwatchTimer = null;

  keyboardTarget = null;
  keyboard.classList.remove("show");

  overlay.classList.remove("open");

  app.innerHTML = "";
}

/* =========================================================
   OPEN APP WINDOW
   ========================================================= */

function openApp(title, content, setup) {

  closeApp();

  app.innerHTML = `
    <div class="app-head">
      <button id="app-back">‹</button>
      <div class="app-title">${esc(title)}</div>
      <button id="app-home">⌂</button>
    </div>

    <div class="app-body">
      ${content}
    </div>
  `;

  overlay.classList.add("open");

  document.getElementById("app-back").onclick = closeApp;
  document.getElementById("app-home").onclick = closeApp;

  if (setup) setup();

  wireInputs();
}

/* =========================================================
   INPUT / KEYBOARD
   ========================================================= */

function wireInputs() {

  app.querySelectorAll("input:not([type=file]),textarea").forEach(element => {

    element.addEventListener("focus", () => {
      keyboardTarget = element;
      keyboard.classList.add("show");
    });

    element.addEventListener("blur", () => {
      setTimeout(() => {
        if (document.activeElement !== element) {
          keyboardTarget = null;
          keyboard.classList.remove("show");
        }
      },100);
    });

  });
}

/* =========================================================
   CUSTOM KEYBOARD
   ========================================================= */

function buildKeyboard() {

  keyboard.innerHTML = "";

  const rows = [
    "1234567890",
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
  ];

  rows.forEach(row => {

    [...row].forEach(letter => {

      const button = document.createElement("button");

      button.textContent = letter;

      button.onclick = () => {

        if (!keyboardTarget) return;

        keyboardTarget.value += letter.toLowerCase();

        keyboardTarget.dispatchEvent(
          new Event("input",{bubbles:true})
        );
      };

      keyboard.appendChild(button);
    });
  });

  const back = document.createElement("button");

  back.textContent = "⌫";

  back.onclick = () => {

    if (!keyboardTarget) return;

    keyboardTarget.value =
      keyboardTarget.value.slice(0,-1);

    keyboardTarget.dispatchEvent(
      new Event("input",{bubbles:true})
    );
  };

  keyboard.appendChild(back);

  const space = document.createElement("button");

  space.textContent = "SPACE";
  space.className = "space";

  space.onclick = () => {

    if (!keyboardTarget) return;

    keyboardTarget.value += " ";

    keyboardTarget.dispatchEvent(
      new Event("input",{bubbles:true})
    );
  };

  keyboard.appendChild(space);

  const enter = document.createElement("button");

  enter.textContent = "↵";
  enter.className = "wide";

  enter.onclick = () => {

    if (!keyboardTarget) return;

    keyboardTarget.dispatchEvent(
      new KeyboardEvent("keydown",{key:"Enter",bubbles:true})
    );
  };

  keyboard.appendChild(enter);

  const done = document.createElement("button");

  done.textContent = "DONE";
  done.className = "wide";

  done.onclick = () => {

    keyboard.classList.remove("show");

    if (keyboardTarget) {
      keyboardTarget.blur();
    }

    keyboardTarget = null;
  };

  keyboard.appendChild(done);
}

/* =========================================================
   PAGE SWITCHING
   ========================================================= */

function setPage(page) {

  if (page === currentPage) return;

  closeApp();

  currentPage = page;

  phone.classList.toggle("page-two", page === 2);

  flash.classList.remove("go");

  void flash.offsetWidth;

  flash.classList.add("go");
}

function swipe(distance) {

  if (Math.abs(distance) < 45) return;

  if (distance < 0) {
    setPage(2);
  } else {
    setPage(1);
  }
}

/* =========================================================
   TOUCH
   ========================================================= */

phone.addEventListener("touchstart", event => {

  if (overlay.classList.contains("open")) return;

  touchStartY = event.touches[0].clientY;

},{passive:true});

phone.addEventListener("touchend", event => {

  if (touchStartY === null) return;

  const endY = event.changedTouches[0].clientY;

  swipe(endY - touchStartY);

  touchStartY = null;

},{passive:true});

/* =========================================================
   MOUSE
   ========================================================= */

phone.addEventListener("mousedown", event => {

  if (overlay.classList.contains("open")) return;

  mouseStartY = event.clientY;

});

phone.addEventListener("mouseup", event => {

  if (mouseStartY === null) return;

  swipe(event.clientY - mouseStartY);

  mouseStartY = null;

});

/* =========================================================
   KEYBOARD PAGE CONTROL
   ========================================================= */

window.addEventListener("keydown", event => {

  if (event.key === "ArrowUp") {
    setPage(2);
  }

  if (event.key === "ArrowDown") {
    setPage(1);
  }

  if (event.key === "Escape") {
    closeApp();
  }

});

/* =========================================================
   APP ROUTER
   ========================================================= */

phone.addEventListener("click", event => {

  const button = event.target.closest("[data-app]");

  if (!button) return;

  event.preventDefault();
  event.stopPropagation();

  launch(button.dataset.app);
});

phone.addEventListener("click", event => {

  const home = event.target.closest("[data-home]");

  if (!home) return;

  event.preventDefault();
  event.stopPropagation();

  closeApp();
  setPage(1);
});

/* =========================================================
   APP LAUNCHER
   ========================================================= */

function launch(id) {

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

    case "peartunes":
    case "music":
      music();
      break;

    case "splashface":
      splashface();
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

    case "videos":
      videos();
      break;

    default:
      openApp(
        "Pear OS",
        `<div class="hero">
          <div class="big-number">${esc(id)}</div>
          <div class="muted">Pear application</div>
        </div>`
      );
  }
}

/* =========================================================
   MESSAGES
   ========================================================= */

function messages() {

  const contacts = [
    ["A","Alex","Hey! Are you using Pear OS?"],
    ["J","Jordan","That phone looks insane."],
    ["S","Sam","Send me the photo!"]
  ];

  const saved = getJSON("pearThreads", {});

  openApp(
    "Messages",
    `
      <div class="card">
        <strong>Messages</strong>
        <div class="muted">Your Pear contacts</div>
      </div>

      <div id="contact-list">
        ${contacts.map((c,i) => `
          <div class="contact" data-contact="${i}">
            <div class="avatar">${c[0]}</div>
            <div>
              <strong>${c[1]}</strong>
              <div class="muted">${c[2]}</div>
            </div>
          </div>
        `).join("")}
      </div>

      <div id="message-thread"></div>
    `,
    () => {

      const list = document.getElementById("contact-list");
      const thread = document.getElementById("message-thread");

      function showThread(index) {

        const person = contacts[index];

        const history =
          saved[person[1]] ||
          [
            {
              from:"them",
              text:person[2]
            }
          ];

        thread.innerHTML = `
          <div class="card">
            <strong>${person[1]}</strong>

            <div style="margin-top:8px">
              ${history.map(message => `
                <div class="message ${message.from === "me" ? "me" : ""}">
                  ${esc(message.text)}
                </div>
              `).join("")}
            </div>

            <div class="row" style="margin-top:7px">
              <input id="message-input"
                     class="text-input"
                     placeholder="Message ${person[1]}">

              <button class="app-button" id="message-send">
                Send
              </button>
            </div>
          </div>
        `;

        wireInputs();

        const input =
          document.getElementById("message-input");

        document.getElementById("message-send").onclick = () => {

          const text = input.value.trim();

          if (!text) return;

          history.push({
            from:"me",
            text
          });

          saved[person[1]] = history.slice(-30);

          setJSON("pearThreads",saved);

          showThread(index);
        };

        input.onkeydown = event => {

          if (
            event.key === "Enter" &&
            !event.shiftKey
          ) {
            event.preventDefault();

            document.getElementById(
              "message-send"
            ).click();
          }
        };
      }

      list.querySelectorAll("[data-contact]")
        .forEach(button => {

          button.onclick = () => {
            showThread(Number(button.dataset.contact));
          };

        });
    }
  );
}

/* =========================================================
   CAMERA
   ========================================================= */

async function camera() {

  openApp(
    "Camera",
    `
      <div class="camera-frame">

        <video
          id="camera-video"
          autoplay
          playsinline>
        </video>

        <div class="camera-crosshair"></div>

      </div>

      <div class="camera-controls">

        <button
          class="app-button"
          id="camera-start">
          Start
        </button>

        <button
          class="app-button"
          id="camera-snap">
          ●
        </button>

        <button
          class="app-button"
          id="camera-flip">
          Flip
        </button>

      </div>

      <div id="camera-status"
           class="muted"
           style="margin-top:7px">
        Camera ready.
      </div>

      <div id="camera-result"></div>

      <canvas id="camera-canvas" hidden></canvas>
    `,
    () => {

      document.getElementById(
        "camera-start"
      ).onclick = startCamera;

      document.getElementById(
        "camera-snap"
      ).onclick = takePhoto;

      document.getElementById(
        "camera-flip"
      ).onclick = async () => {

        cameraFacing =
          cameraFacing === "environment"
            ? "user"
            : "environment";

        await startCamera();
      };
    }
  );

  await startCamera();
}

async function startCamera() {

  const video =
    document.getElementById("camera-video");

  const status =
    document.getElementById("camera-status");

  if (!video || !navigator.mediaDevices?.getUserMedia) {

    if (status) {
      status.textContent =
        "Camera access is not available in this browser.";
    }

    return;
  }

  try {

    if (cameraStream) {
      cameraStream.getTracks().forEach(
        track => track.stop()
      );
    }

    cameraStream =
      await navigator.mediaDevices.getUserMedia({
        video:{
          facingMode:{
            ideal:cameraFacing
          }
        },
        audio:false
      });

    video.srcObject = cameraStream;

    await video.play();

    status.textContent =
      "Camera connected ✓";

  } catch(error) {

    console.error(error);

    status.textContent =
      "Camera permission/device error.";
  }
}

function takePhoto() {

  const video =
    document.getElementById("camera-video");

  const canvas =
    document.getElementById("camera-canvas");

  const result =
    document.getElementById("camera-result");

  if (!video?.videoWidth) {

    alert("Start the camera first.");

    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context =
    canvas.getContext("2d");

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const image =
    canvas.toDataURL("image/jpeg",.9);

  result.innerHTML = `
    <div class="card">
      <strong>Captured</strong>
      <img
        src="${image}"
        style="width:100%;border-radius:10px;margin-top:6px">
    </div>
  `;

  const photos =
    getJSON("pearPhotos",[]);

  photos.unshift(image);

  setJSON(
    "pearPhotos",
    photos.slice(0,30)
  );
}

/* =========================================================
   PHOTOS
   ========================================================= */

function photos() {

  const saved =
    getJSON("pearPhotos",[]);

  openApp(
    "Photos",
    `
      <div class="card">
        <input
          id="photo-import"
          type="file"
          accept="image/*"
          multiple>
      </div>

      <div class="photo-grid" id="photo-grid">

        ${
          saved.length
            ? saved.map((image,index) => `
                <img
                  src="${image}"
                  data-photo="${index}">
              `).join("")
            : `
              <div
                class="muted"
                style="grid-column:1/-1;text-align:center;padding:30px">
                No photos yet.
              </div>
            `
        }

      </div>
    `,
    () => {

      document.getElementById(
        "photo-import"
      ).onchange = async event => {

        const files =
          [...event.target.files];

        const imported = [];

        for (const file of files) {

          imported.push(
            await new Promise(resolve => {

              const reader =
                new FileReader();

              reader.onload =
                () => resolve(reader.result);

              reader.readAsDataURL(file);
            })
          );
        }

        setJSON(
          "pearPhotos",
          [...imported,...saved].slice(0,30)
        );

        photos();
      };

      document
        .querySelectorAll("[data-photo]")
        .forEach(image => {

          image.onclick = () => {

            openApp(
              "Photo",
              `
                <img
                  src="${saved[Number(image.dataset.photo)]}"
                  style="
                    width:100%;
                    border-radius:14px;
                    display:block;
                  ">

                <button
                  class="app-button"
                  id="delete-photo"
                  style="margin-top:8px">
                  Delete
                </button>
              `,
              () => {

                document.getElementById(
                  "delete-photo"
                ).onclick = () => {

                  const index =
                    Number(image.dataset.photo);

                  saved.splice(index,1);

                  setJSON("pearPhotos",saved);

                  photos();
                };
              }
            );
          };
        });
    }
  );
}

/* =========================================================
   NOTES
   ========================================================= */

function notes() {

  const saved =
    getJSON("pearNotes",[]);

  openApp(
    "Notes",
    `
      <input
        id="note-search"
        placeholder="Search notes..."
        style="margin-bottom:7px">

      <div id="notes-list">

        ${
          saved.length
            ? saved.map((note,index) => `
                <div
                  class="note-item"
                  data-note="${index}">

                  <strong>${esc(note.title)}</strong>

                  <div class="muted">
                    ${esc(note.body.slice(0,70))}
                  </div>

                </div>
              `).join("")
            : `
              <div class="muted"
                   style="padding:15px;text-align:center">
                No notes yet.
              </div>
            `
        }

      </div>

      <div class="card">

        <input
          id="note-title"
          placeholder="Note title">

        <textarea
          id="note-body"
          placeholder="Write something..."></textarea>

        <button
          class="app-button"
          id="save-note">
          Save Note
        </button>

      </div>
    `,
    () => {

      const list =
        document.getElementById("notes-list");

      document
        .querySelectorAll("[data-note]")
        .forEach(item => {

          item.onclick = () => {

            const note =
              saved[Number(item.dataset.note)];

            document.getElementById(
              "note-title"
            ).value = note.title;

            document.getElementById(
              "note-body"
            ).value = note.body;
          };
        });

      document.getElementById(
        "save-note"
      ).onclick = () => {

        const title =
          document.getElementById(
            "note-title"
          ).value.trim();

        const body =
          document.getElementById(
            "note-body"
          ).value.trim();

        if (!title && !body) return;

        saved.unshift({
          title:title || "Untitled",
          body:body
        });

        setJSON(
          "pearNotes",
          saved.slice(0,50)
        );

        notes();
      };

      document.getElementById(
        "note-search"
      ).oninput = event => {

        const query =
          event.target.value.toLowerCase();

        list.querySelectorAll(
          "[data-note]"
        ).forEach(item => {

          item.style.display =
            item.textContent
              .toLowerCase()
              .includes(query)
                ? ""
                : "none";
        });
      };

      wireInputs();
    }
  );
}

/* =========================================================
   STOCKS
   ========================================================= */

function stocks() {

  const data = [
    ["AAPL","Apple","229.87","+1.8%",1],
    ["MSFT","Microsoft","532.44","+0.9%",1],
    ["TSLA","Tesla","318.26","-1.2%",0],
    ["PEAR","Pear Inc.","99.99","+4.2%",1]
  ];

  openApp(
    "Stocks",
    `
      <div class="hero">

        <div class="muted">
          PEAR MARKET
        </div>

        <div class="big-number">
          +2.84%
        </div>

        <div class="muted">
          Market today
        </div>

      </div>

      ${data.map(stock => `

        <div class="stock-row">

          <div>
            <strong>${stock[0]}</strong>
            <div class="muted">${stock[1]}</div>
          </div>

          <svg
            class="chart"
            viewBox="0 0 72 32">

            <polyline
              points="0,24 12,18 22,21 31,10 43,14 54,7 72,9"
              fill="none"
              stroke="${stock[4] ? "#59d89b" : "#ff7070"}"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"/>

          </svg>

          <div style="text-align:right">

            <strong>
              $${stock[2]}
            </strong>

            <div
              style="
                color:${stock[4] ? "#65e0a0" : "#ff7777"};
                font-size:10px">
              ${stock[3]}
            </div>

          </div>

        </div>

      `).join("")}

      <button
        class="app-button"
        id="refresh-stocks">
        Refresh Market
      </button>
    `,
    () => {

      document.getElementById(
        "refresh-stocks"
      ).onclick = () => {

        const value =
          (Math.random()*4+1).toFixed(2);

        document.querySelector(
          ".big-number"
        ).textContent =
          "+" + value + "%";

      };
    }
  );
}

/* =========================================================
   MAPS
   ========================================================= */

function maps() {

  openApp(
    "Maps",
    `
      <div class="card">

        <input
          id="map-search"
          placeholder="Search Pear Maps...">

      </div>

      <div class="map-box">

        <div class="map-road"></div>

        <div
          class="pin"
          style="left:48%;top:45%">
        </div>

        <div
          class="pin"
          style="left:23%;top:70%">
        </div>

        <div
          class="pin"
          style="left:72%;top:25%">
        </div>

      </div>

      <div class="card">

        <strong>Pear Park</strong>

        <div class="muted">
          12 Pear Street · 5 min
        </div>

        <button
          class="app-button"
          id="route-button"
          style="margin-top:7px">
          Start Route
        </button>

      </div>
    `,
    () => {

      document.getElementById(
        "route-button"
      ).onclick = event => {

        event.target.textContent =
          "Route Started ✓";
      };
    }
  );
}

/* =========================================================
   WEATHER
   ========================================================= */

function weather() {

  openApp(
    "Weather",
    `
      <div class="hero weather-main">

        <div>

          <div class="muted">
            PEAR CITY
          </div>

          <div class="big-number">
            24°
          </div>

          <div>
            Sunny
          </div>

          <div class="muted">
            Feels like 25°
          </div>

        </div>

        <div class="weather-icon">
          ☀️
        </div>

      </div>

      <div class="card">

        <strong>Hourly</strong>

        <div class="forecast" style="margin-top:7px">

          <div>10<br>☀️<br>24°</div>
          <div>11<br>☀️<br>25°</div>
          <div>12<br>☀️<br>26°</div>
          <div>1<br>⛅<br>25°</div>
          <div>2<br>⛅<br>24°</div>

        </div>

      </div>

      <div class="card">

        <strong>5 Day Forecast</strong>

        <div class="forecast" style="margin-top:7px">

          <div>Mon<br>☀️<br>25°</div>
          <div>Tue<br>⛅<br>23°</div>
          <div>Wed<br>🌧️<br>19°</div>
          <div>Thu<br>☀️<br>22°</div>
          <div>Fri<br>☀️<br>24°</div>

        </div>

      </div>
    `
  );
}

/* =========================================================
   CLOCK
   ========================================================= */

function clock() {

  openApp(
    "Clock",
    `
      <div class="clock-face">

        <div class="clock-time"
             id="clock-time">
          --:--:--
        </div>

        <div class="muted">
          Pear local time
        </div>

      </div>

      <div class="card">

        <strong>Stopwatch</strong>

        <div
          id="stopwatch"
          style="
            font-size:24px;
            font-weight:900;
            margin:7px 0">
          00:00
        </div>

        <button
          class="app-button"
          id="start-stopwatch">
          Start
        </button>

        <button
          class="app-button"
          id="reset-stopwatch">
          Reset
        </button>

      </div>
    `,
    () => {

      const time =
        document.getElementById("clock-time");

      function update() {

        time.textContent =
          new Date().toLocaleTimeString([],{
            hour:"numeric",
            minute:"2-digit",
            second:"2-digit"
          });
      }

      update();

      clockTimer =
        setInterval(update,1000);

      let running = false;

      stopwatchSeconds = 0;

      function updateStopwatch() {

        const min =
          String(
            Math.floor(stopwatchSeconds/60)
          ).padStart(2,"0");

        const sec =
          String(
            stopwatchSeconds%60
          ).padStart(2,"0");

        document.getElementById(
          "stopwatch"
        ).textContent =
          `${min}:${sec}`;
      }

      document.getElementById(
        "start-stopwatch"
      ).onclick = event => {

        running = !running;

        event.target.textContent =
          running ? "Pause" : "Start";

        if (running) {

          stopwatchTimer =
            setInterval(() => {

              stopwatchSeconds++;

              updateStopwatch();

            },1000);

        } else {

          clearInterval(stopwatchTimer);
        }
      };

      document.getElementById(
        "reset-stopwatch"
      ).onclick = () => {

        clearInterval(stopwatchTimer);

        running = false;

        stopwatchSeconds = 0;

        updateStopwatch();

        document.getElementById(
          "start-stopwatch"
        ).textContent = "Start";
      };
    }
  );
}

/* =========================================================
   SETTINGS
   ========================================================= */

function settings() {

  const dark =
    localStorage.getItem("pearDark") === "1";

  openApp(
    "Settings",
    `
      <div class="card">

        <div class="setting">

          <span>
            Dark display
          </span>

          <input
            class="switch"
            id="dark-switch"
            type="checkbox"
            ${dark ? "checked" : ""}>

        </div>

        <div class="setting">

          <span>
            Sound effects
          </span>

          <input
            class="switch"
            id="sound-switch"
            type="checkbox"
            checked>

        </div>

        <div class="setting">

          <span>
            Animations
          </span>

          <input
            class="switch"
            id="animation-switch"
            type="checkbox"
            checked>

        </div>

      </div>

      <div class="card">

        <strong>Display brightness</strong>

        <input
          id="brightness"
          type="range"
          min="50"
          max="120"
          value="100"
          style="margin-top:8px">

      </div>

      <div class="card">

        <strong>Storage</strong>

        <div class="muted" style="margin-top:4px">
          Photos, notes and messages are saved locally.
        </div>

        <button
          class="app-button"
          id="reset-data"
          style="margin-top:8px">
          Reset Pear OS Data
        </button>

      </div>
    `,
    () => {

      const darkSwitch =
        document.getElementById(
          "dark-switch"
        );

      darkSwitch.onchange = event => {

        localStorage.setItem(
          "pearDark",
          event.target.checked ? "1" : "0"
        );

        phone.style.filter =
          event.target.checked
            ? "brightness(.78)"
            : "";
      };

      document.getElementById(
        "brightness"
      ).oninput = event => {

        phone.style.filter =
          `brightness(${event.target.value}%)`;
      };

      document.getElementById(
        "reset-data"
      ).onclick = () => {

        if (
          confirm(
            "Reset saved Pear OS data?"
          )
        ) {

          localStorage.clear();

          location.reload();
        }
      };
    }
  );
}

/* =========================================================
   PEARTUNES / MUSIC
   ========================================================= */

function music() {

  const tracks = [
    "Pearadise",
    "Sunset Drive",
    "Electric Orchard",
    "Neon Orchard"
  ];

  openApp(
    "PearTunes",
    `
      <div class="album">
        ♫
      </div>

      <div
        id="now-playing"
        style="
          text-align:center;
          font-weight:900">
        Nothing Playing
      </div>

      <div
        class="progress"
        style="margin:9px 0">
        <div id="music-progress"></div>
      </div>

      ${tracks.map((track,index) => `
        <div
          class="stock-row">

          <div>
            <strong>${track}</strong>
            <div class="muted">
              PearTunes · ${3+index}:2${index}
            </div>
          </div>

          <button
            class="app-button"
            data-track="${esc(track)}">
            ▶
          </button>

        </div>
      `).join("")}
    `,
    () => {

      document
        .querySelectorAll("[data-track]")
        .forEach(button => {

          button.onclick = () => {

            document.getElementById(
              "now-playing"
            ).textContent =
              button.dataset.track;

            let progress = 0;

            clearInterval(musicTimer);

            musicTimer =
              setInterval(() => {

                progress += 2;

                if (progress > 100) {
                  progress = 0;
                }

                document.getElementById(
                  "music-progress"
                ).style.width =
                  progress + "%";

              },500);
          };
        });
    }
  );
}

/* =========================================================
   SPLASHFACE
   ========================================================= */

function splashface() {

  let posts =
    getJSON(
      "pearPosts",
      [
        {
          name:"Pear Team",
          text:"Welcome to SplashFace!",
          likes:42
        },
        {
          name:"Jordan",
          text:"The Pear Phone is finally online.",
          likes:17
        }
      ]
    );

  openApp(
    "SplashFace",
    `
      <div class="hero">

        <div
          style="
            font-size:28px;
            font-weight:900">
          SplashFace
        </div>

        <div class="muted">
          Pear social network
        </div>

      </div>

      <div class="card">

        <textarea
          id="post-text"
          placeholder="What's happening?">
        </textarea>

        <button
          class="app-button"
          id="post-button">
          Post
        </button>

      </div>

      <div id="feed">

        ${renderPosts(posts)}

      </div>
    `,
    () => {

      document.getElementById(
        "post-button"
      ).onclick = () => {

        const input =
          document.getElementById(
            "post-text"
          );

        const text =
          input.value.trim();

        if (!text) return;

        posts.unshift({
          name:"You",
          text,
          likes:0
        });

        setJSON(
          "pearPosts",
          posts.slice(0,30)
        );

        splashface();
      };

      document
        .querySelectorAll("[data-like]")
        .forEach(button => {

          button.onclick = () => {

            posts[
              Number(button.dataset.like)
            ].likes++;

            setJSON(
              "pearPosts",
              posts
            );

            splashface();
          };
        });
    }
  );
}

function renderPosts(posts) {

  return posts.map((post,index) => `

    <div class="card">

      <strong>${esc(post.name)}</strong>

      <div style="margin:7px 0">
        ${esc(post.text)}
      </div>

      <button
        class="app-button"
        data-like="${index}">
        ♡ ${post.likes}
      </button>

    </div>

  `).join("");
}

/* =========================================================
   PHONE
   ========================================================= */

function phoneApp() {

  openApp(
    "Phone",
    `
      <div class="card">

        <div
          id="dial-display"
          class="dial-display">
        </div>

        <div class="dial-grid">

          ${[
            "1","2","3",
            "4","5","6",
            "7","8","9",
            "*","0","#"
          ].map(number => `
            <button
              data-digit="${number}">
              ${number}
            </button>
          `).join("")}

        </div>

        <div
          style="
            display:flex;
            gap:5px;
            margin-top:6px">

          <button
            class="app-button"
            id="call-button"
            style="flex:1">
            ☎ Call
          </button>

          <button
            class="app-button"
            id="clear-number">
            Clear
          </button>

        </div>

      </div>

      <div class="card">

        <strong>Recent</strong>

        <div class="muted"
             style="margin-top:6px">
          No recent calls.
        </div>

      </div>
    `,
    () => {

      const display =
        document.getElementById(
          "dial-display"
        );

      document
        .querySelectorAll("[data-digit]")
        .forEach(button => {

          button.onclick = () => {

            display.textContent +=
              button.dataset.digit;
          };
        });

      document.getElementById(
        "clear-number"
      ).onclick = () => {

        display.textContent = "";
      };

      document.getElementById(
        "call-button"
      ).onclick = () => {

        if (!display.textContent) return;

        alert(
          "Calling " +
          display.textContent +
          "..."
        );
      };
    }
  );
}

/* =========================================================
   MAIL
   ========================================================= */

function mail() {

  openApp(
    "Mail",
    `
      <div class="card">

        <strong>Inbox</strong>

        <div class="muted">
          3 messages
        </div>

      </div>

      <div class="contact">

        <div class="avatar">
          P
        </div>

        <div>

          <strong>Pear Team</strong>

          <div class="muted">
            Welcome to Pear OS
          </div>

        </div>

      </div>

      <div class="contact">

        <div class="avatar">
          J
        </div>

        <div>

          <strong>Jordan</strong>

          <div class="muted">
            Check out this phone!
          </div>

        </div>

      </div>

      <button
        class="app-button"
        id="compose-mail">
        Compose
      </button>
    `,
    () => {

      document.getElementById(
        "compose-mail"
      ).onclick = () => {

        openApp(
          "New Mail",
          `
            <input
              placeholder="To"
              style="margin-bottom:6px">

            <input
              placeholder="Subject"
              style="margin-bottom:6px">

            <textarea
              placeholder="Message">
            </textarea>

            <button
              class="app-button"
              id="send-mail">
              Send
            </button>
          `,
          () => {

            document.getElementById(
              "send-mail"
            ).onclick = () => {

              alert("Message sent!");

              mail();
            };
          }
        );
      };
    }
  );
}

/* =========================================================
   COMPASS
   ========================================================= */

function compass() {

  openApp(
    "Compass",
    `
      <div class="card"
           style="text-align:center">

        <div class="compass">

          <div
            class="compass-arrow"
            id="compass-arrow">
          </div>

          <strong>N</strong>

        </div>

        <div
          id="heading"
          style="
            font-size:24px;
            font-weight:900">
          0°
        </div>

        <div class="muted">
          Device orientation
        </div>

      </div>
    `,
    () => {

      function orientation(event) {

        const heading =
          event.webkitCompassHeading ??
          event.alpha ??
          0;

        document.getElementById(
          "heading"
        ).textContent =
          Math.round(heading) + "°";

        document.getElementById(
          "compass-arrow"
        ).style.transform =
          `rotate(${heading}deg)`;
      }

      window.addEventListener(
        "deviceorientation",
        orientation
      );
    }
  );
}

/* =========================================================
   VIDEOS
   ========================================================= */

function videos() {

  openApp(
    "Videos",
    `
      <div class="card">

        <input
          id="video-file"
          type="file"
          accept="video/*">

      </div>

      <div id="video-area">

        <div
          class="hero"
          style="text-align:center">

          <div style="font-size:35px">
            ▶
          </div>

          <strong>
            Your Videos
          </strong>

          <div class="muted">
            Choose a video to play it.
          </div>

        </div>

      </div>
    `,
    () => {

      document.getElementById(
        "video-file"
      ).onchange = event => {

        const file =
          event.target.files[0];

        if (!file) return;

        const url =
          URL.createObjectURL(file);

        document.getElementById(
          "video-area"
        ).innerHTML = `
          <video
            controls
            autoplay
            style="
              width:100%;
              border-radius:13px">
            <source src="${url}">
          </video>
        `;
      };
    }
  );
}

/* =========================================================
   INITIALIZE
   ========================================================= */

buildKeyboard();

phone.classList.remove("page-two");

currentPage = 1;

})();
