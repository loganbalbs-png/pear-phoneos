/*
============================================================
PEAR PHONE OS
============================================================

This file is loaded by index.html.

IMPORTANT:
Do not put another app.js script on the page.

The app router uses ONE event listener and data-app IDs.
That prevents neighboring icons from opening the wrong app.

Camera:
- Uses navigator.mediaDevices.getUserMedia()
- Uses the real connected camera
- Allows camera selection
- Takes photos
- Saves photos into Photos
============================================================
*/

document.addEventListener("DOMContentLoaded", () => {

  "use strict";


  /* ========================================================
     ELEMENTS
     ======================================================== */

  const phone = document.getElementById("phone-container");

  const overlay = document.getElementById("app-overlay");

  const appWindow = document.getElementById("app-window");

  const homeButton = document.getElementById("home");

  const keyboard = document.getElementById("pear-keyboard");

  const transition = document.getElementById("page-transition");


  /* ========================================================
     APP STATE
     ======================================================== */

  let currentCameraStream = null;

  let currentCameraDeviceId = "";

  let activeInput = null;

  let currentPage = 1;

  let touchStartX = 0;

  let touchStartY = 0;

  let mouseStartX = 0;

  let mouseStartY = 0;

  let mouseDragging = false;


  /* ========================================================
     LOCAL STORAGE HELPERS
     ======================================================== */

  function readJSON(key, fallback) {

    try {

      const value = localStorage.getItem(key);

      if (!value) return fallback;

      return JSON.parse(value);

    } catch {

      return fallback;

    }

  }


  function writeJSON(key, value) {

    try {

      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

    } catch (error) {

      console.error("Pear OS storage error:", error);

    }

  }


  /* ========================================================
     HTML ESCAPE
     ======================================================== */

  function escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  /* ========================================================
     APP WINDOW
     ======================================================== */

  function openWindow(title, content) {

    stopCamera();

    hideKeyboard();

    appWindow.innerHTML = `

      <div class="app-header">

        <button
          class="back-button"
          id="app-back"
          aria-label="Back">
          ‹
        </button>

        <div class="window-title">
          ${escapeHTML(title)}
        </div>

      </div>

      <div class="app-content">
        ${content}
      </div>

    `;

    overlay.classList.add("open");

    const back = document.getElementById("app-back");

    if (back) {

      back.addEventListener(
        "click",
        closeWindow
      );

    }

    setupKeyboardInputs();

  }


  function closeWindow() {

    stopCamera();

    hideKeyboard();

    overlay.classList.remove("open");

    appWindow.innerHTML = "";

  }


  /* ========================================================
     HOME
     ======================================================== */

  homeButton.addEventListener("click", event => {

    event.preventDefault();

    event.stopPropagation();

    closeWindow();

  });


  /* ========================================================
     APP ROUTER
     ========================================================

     THIS IS THE IMPORTANT PART.

     Every button contains:

     data-app="camera"

     or:

     data-app="messages"

     etc.

     There is ONE listener.

     No neighboring button gets involved.
     ======================================================== */

  phone.addEventListener("click", event => {

    const button = event.target.closest("[data-app]");

    if (!button) return;

    event.preventDefault();

    event.stopPropagation();

    const appID = button.getAttribute("data-app");

    if (!appID) return;

    launchApp(appID);

  });


  /* ========================================================
     APP ROUTER FUNCTION
     ======================================================== */

  function launchApp(appID) {

    switch (appID) {

      case "messages":
        openMessages();
        break;

      case "camera":
        openCamera();
        break;

      case "splashface":
        openSplashFace();
        break;

      case "stocks":
        openStocks();
        break;

      case "maps":
        openMaps();
        break;

      case "photos":
        openPhotos();
        break;

      case "weather":
        openWeather();
        break;

      case "notes":
        openNotes();
        break;

      case "peartunes":
        openPearTunes();
        break;

      case "settings":
        openSettings();
        break;

      case "clock":
        openClock();
        break;

      case "videos":
        openVideos();
        break;

      case "phone":
        openPhone();
        break;

      case "mail":
        openMail();
        break;

      case "compass":
        openCompass();
        break;

      case "music":
        openMusic();
        break;

      default:

        console.warn(
          "Unknown Pear OS app:",
          appID
        );

    }

  }


  /* ========================================================
     MESSAGES
     ======================================================== */

  function openMessages() {

    const messages = readJSON(
      "pearMessages",
      []
    );

    openWindow(
      "Messages",
      `

      <div class="chat-list">

        <div class="chat-bubble">
          hey 👋
        </div>

        <div class="chat-bubble">
          welcome to Pear Phone OS 🍐
        </div>

        ${messages.map(message => `

          <div class="chat-bubble me">
            ${escapeHTML(message)}
          </div>

        `).join("")}

      </div>

      <div class="compose-row">

        <input
          id="message-input"
          type="text"
          placeholder="iMessage">

        <button
          class="button"
          id="send-message">
          Send
        </button>

      </div>

      `
    );


    const input =
      document.getElementById("message-input");

    const send =
      document.getElementById("send-message");


    function sendMessage() {

      const text =
        input.value.trim();

      if (!text) return;

      messages.push(text);

      writeJSON(
        "pearMessages",
        messages.slice(-50)
      );

      openMessages();

    }


    send.addEventListener(
      "click",
      sendMessage
    );


    input.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {

          sendMessage();

        }

      }
    );

  }


  /* ========================================================
     CAMERA
     ======================================================== */

  async function openCamera() {

    openWindow(
      "Camera",
      `

      <div class="camera-container">

        <video
          id="pear-camera-video"
          class="camera-video"
          autoplay
          playsinline
          muted>
        </video>

        <div
          id="camera-status"
          class="camera-status">
          Starting camera...
        </div>

        <select
          id="camera-select"
          class="camera-select">
          <option>
            Detecting cameras...
          </option>
        </select>

        <div class="camera-controls">

          <button
            class="button"
            id="start-camera">
            ▶ Start
          </button>

          <button
            class="button"
            id="take-photo">
            📸 Take Photo
          </button>

          <button
            class="button"
            id="switch-camera">
            🔄 Switch
          </button>

        </div>

        <img
          id="captured-photo"
          class="captured-photo"
          alt="Captured photo">

      </div>

      `
    );


    const video =
      document.getElementById(
        "pear-camera-video"
      );

    const status =
      document.getElementById(
        "camera-status"
      );

    const select =
      document.getElementById(
        "camera-select"
      );

    const startButton =
      document.getElementById(
        "start-camera"
      );

    const takeButton =
      document.getElementById(
        "take-photo"
      );

    const switchButton =
      document.getElementById(
        "switch-camera"
      );

    const photo =
      document.getElementById(
        "captured-photo"
      );


    /* --------------------------------------------------------
       CHECK CAMERA SUPPORT
       -------------------------------------------------------- */

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      status.textContent =
        "Camera is not available in this browser.";

      startButton.disabled = true;

      takeButton.disabled = true;

      switchButton.disabled = true;

      return;

    }


    /* --------------------------------------------------------
       GET CAMERA LIST
       -------------------------------------------------------- */

    async function loadCameras() {

      try {

        const devices =
          await navigator.mediaDevices.enumerateDevices();

        const cameras =
          devices.filter(
            device =>
              device.kind === "videoinput"
          );


        select.innerHTML = "";


        if (!cameras.length) {

          const option =
            document.createElement("option");

          option.textContent =
            "No camera detected";

          select.appendChild(option);

          return;

        }


        cameras.forEach(
          (camera, index) => {

            const option =
              document.createElement(
                "option"
              );

            option.value =
              camera.deviceId;

            option.textContent =
              camera.label ||
              `Camera ${index + 1}`;

            select.appendChild(option);

          }
        );


        if (currentCameraDeviceId) {

          select.value =
            currentCameraDeviceId;

        }

      } catch (error) {

        console.error(
          "Camera enumeration error:",
          error
        );

      }

    }


    /* --------------------------------------------------------
       START CAMERA
       -------------------------------------------------------- */

    async function startCamera(deviceId = "") {

      stopCamera();

      status.textContent =
        "Requesting camera permission...";


      try {

        let videoConstraints;


        /*
          If a specific camera was selected,
          use that exact camera.

          Otherwise use the default/environment
          camera.
        */

        if (deviceId) {

          videoConstraints = {

            deviceId: {
              exact: deviceId
            },

            width: {
              ideal:1280
            },

            height: {
              ideal:720
            }

          };

        } else {

          videoConstraints = {

            facingMode: {
              ideal:"environment"
            },

            width: {
              ideal:1280
            },

            height: {
              ideal:720
            }

          };

        }


        currentCameraStream =
          await navigator.mediaDevices
            .getUserMedia({

              video:videoConstraints,

              audio:false

            });


        video.srcObject =
          currentCameraStream;


        currentCameraDeviceId =
          currentCameraStream
            .getVideoTracks()[0]
            ?.getSettings()
            ?.deviceId || "";


        await video.play();


        status.textContent =
          "Camera connected ✓";


        /*
          After permission is granted,
          browsers expose the camera names.
        */

        await loadCameras();


      } catch (error) {

        console.error(
          "Pear Camera error:",
          error
        );


        status.textContent =
          cameraErrorMessage(error);

      }

    }


    /* --------------------------------------------------------
       CAMERA ERROR MESSAGE
       -------------------------------------------------------- */

    function cameraErrorMessage(error) {

      if (!error) {

        return "Could not start camera.";

      }


      if (
        error.name ===
        "NotAllowedError"
      ) {

        return (
          "Camera permission was denied. " +
          "Allow camera access and press Start."
        );

      }


      if (
        error.name ===
        "NotFoundError"
      ) {

        return (
          "No camera was found. " +
          "Check the USB camera connection."
        );

      }


      if (
        error.name ===
        "NotReadableError"
      ) {

        return (
          "Camera is already being used " +
          "by another program."
        );

      }


      if (
        error.name ===
        "SecurityError"
      ) {

        return (
          "Camera requires HTTPS or localhost."
        );

      }


      return (
        "Camera error: " +
        error.name
      );

    }


    /* --------------------------------------------------------
       TAKE PHOTO
       -------------------------------------------------------- */

    function takePhoto() {

      if (!video.videoWidth) {

        status.textContent =
          "Start the camera first.";

        return;

      }


      const canvas =
        document.createElement("canvas");


      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;


      const context =
        canvas.getContext("2d");


      /*
        Draw the REAL camera frame.
      */

      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );


      const image =
        canvas.toDataURL(
          "image/jpeg",
          .88
        );


      photo.src =
        image;

      photo.style.display =
        "block";


      /*
        Save to Pear Photos.
      */

      const photos =
        readJSON(
          "pearPhotos",
          []
        );


      photos.unshift(image);


      /*
        Keep the latest 20 photos.
      */

      writeJSON(
        "pearPhotos",
        photos.slice(0,20)
      );


      status.textContent =
        "Photo captured ✓";

    }


    /* --------------------------------------------------------
       BUTTON EVENTS
       -------------------------------------------------------- */

    startButton.addEventListener(
      "click",
      () => {

        startCamera(
          select.value || ""
        );

      }
    );


    takeButton.addEventListener(
      "click",
      takePhoto
    );


    switchButton.addEventListener(
      "click",
      async () => {

        const cameras =
          Array.from(
            select.options
          );

        if (cameras.length < 2) {

          status.textContent =
            "Only one camera detected.";

          return;

        }


        let index =
          select.selectedIndex;


        index =
          (index + 1) %
          cameras.length;


        select.selectedIndex =
          index;


        await startCamera(
          select.value
        );

      }
    );


    select.addEventListener(
      "change",
      () => {

        if (select.value) {

          startCamera(
            select.value
          );

        }

      }
    );


    /*
      Automatically start the camera.
    */

    await startCamera();


    /*
      Refresh camera names after permission.
    */

    await loadCameras();

  }


  /* ========================================================
     STOP CAMERA
     ======================================================== */

  function stopCamera() {

    if (!currentCameraStream) {

      return;

    }


    currentCameraStream
      .getTracks()
      .forEach(track => {

        track.stop();

      });


    currentCameraStream = null;

  }


  /* ========================================================
     PHOTOS
     ======================================================== */

  function openPhotos() {

    const photos =
      readJSON(
        "pearPhotos",
        []
      );


    openWindow(
      "Photos",
      `

      <input
        type="file"
        id="photo-import"
        accept="image/*"
        multiple>

      <div style="height:7px"></div>

      <div
        class="photo-grid"
        id="photo-grid">

        ${
          photos.length

          ?

          photos.map(
            (image,index) => `

              <img
                src="${image}"
                data-photo-index="${index}"
                alt="Photo ${index + 1}">

            `
          ).join("")

          :

          `
            <div
              class="empty"
              style="grid-column:1/-1">
              No photos yet.
            </div>
          `
        }

      </div>

      `
    );


    const input =
      document.getElementById(
        "photo-import"
      );


    input.addEventListener(
      "change",
      event => {

        const files =
          Array.from(
            event.target.files
          );


        if (!files.length) return;


        const imported =
          [];


        let completed = 0;


        files.forEach(file => {

          const reader =
            new FileReader();


          reader.onload =
            () => {

              imported.push(
                reader.result
              );


              completed++;


              if (
                completed ===
                files.length
              ) {

                writeJSON(
                  "pearPhotos",
                  [
                    ...imported,
                    ...photos
                  ].slice(0,20)
                );


                openPhotos();

              }

            };


          reader.readAsDataURL(
            file
          );

        });

      }
    );


    document
      .querySelectorAll(
        "[data-photo-index]"
      )
      .forEach(image => {

        image.addEventListener(
          "click",
          () => {

            image.requestFullscreen?.();

          }
        );

      });

  }


  /* ========================================================
     NOTES
     ======================================================== */

  function openNotes() {

    const notes =
      readJSON(
        "pearNotes",
        []
      );


    openWindow(
      "Notes",
      `

      <div
        class="note-list">

        ${
          notes.length

          ?

          notes.map(
            (note,index) => `

              <div
                class="saved-note"
                data-note="${index}">

                <strong>
                  ${escapeHTML(
                    note.title ||
                    "Untitled"
                  )}
                </strong>

                <div
                  style="
                    color:#777;
                    font-size:11px;
                    margin-top:2px;
                  ">

                  ${escapeHTML(
                    (note.body || "")
                      .slice(0,80)
                  )}

                </div>

              </div>

            `
          ).join("")

          :

          `<div class="empty">
             No notes yet.
           </div>`

        }

      </div>


      <input
        class="note-title"
        id="note-title"
        placeholder="Note title">


      <textarea
        class="note-body"
        id="note-body"
        placeholder="Start typing..."></textarea>


      <div style="height:5px"></div>


      <button
        class="button"
        id="save-note">
        Save Note
      </button>

      `
    );


    document
      .getElementById("save-note")
      .addEventListener(
        "click",
        () => {

          const title =
            document
              .getElementById(
                "note-title"
              )
              .value
              .trim();


          const body =
            document
              .getElementById(
                "note-body"
              )
              .value
              .trim();


          if (!title && !body) {

            return;

          }


          notes.unshift({

            title:
              title ||
              "Untitled",

            body,

            date:
              new Date()
                .toISOString()

          });


          writeJSON(
            "pearNotes",
            notes.slice(0,30)
          );


          openNotes();

        }
      );


    document
      .querySelectorAll(
        "[data-note]"
      )
      .forEach(note => {

        note.addEventListener(
          "click",
          () => {

            const index =
              Number(
                note.dataset.note
              );

            const saved =
              notes[index];


            document
              .getElementById(
                "note-title"
              )
              .value =
              saved.title || "";


            document
              .getElementById(
                "note-body"
              )
              .value =
              saved.body || "";

          }
        );

      });

  }


  /* ========================================================
     STOCKS
     ======================================================== */

  function openStocks() {

    const stocks = [

      [
        "PEAR",
        "Pear Inc.",
        "$99.99",
        "+4.2%",
        true
      ],

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
      ]

    ];


    openWindow(
      "Stocks",
      `

      <div class="stock-list">

        ${stocks.map(
          stock => `

          <div class="stock-row">

            <div>

              <strong>
                ${stock[0]}
              </strong>

              <div
                style="
                  color:#777;
                  font-size:10px;
                ">

                ${stock[1]}

              </div>

            </div>

            <div
              style="
                text-align:right;
              ">

              <strong>
                ${stock[2]}
              </strong>

              <div
                class="
                  ${stock[4]
                    ? "positive"
                    : "negative"}
                ">

                ${stock[3]}

              </div>

            </div>

          </div>

        `
        ).join("")}

      </div>

      `
    );

  }


  /* ========================================================
     MAPS
     ======================================================== */

  function openMaps() {

    openWindow(
      "Maps",
      `

      <div class="map">

        <div class="map-pin">
          📍
        </div>

      </div>


      <h3>
        Pear Park
      </h3>

      <p>
        12 Pear Street · 5 min away
      </p>


      <button
        class="button"
        id="route-button">

        Start Route

      </button>

      `
    );


    document
      .getElementById(
        "route-button"
      )
      .addEventListener(
        "click",
        event => {

          event.target.textContent =
            "Route Started ✓";

        }
      );

  }


  /* ========================================================
     WEATHER
     ======================================================== */

  function openWeather() {

    openWindow(
      "Weather",
      `

      <div class="weather-card">

        <div class="weather-icon">
          ☀️
        </div>

        <div class="temperature">
          24°
        </div>

        <h3>
          Sunny
        </h3>

        <p>
          Feels like 25°
        </p>

        <p>
          Today: 18° — 27°
        </p>

      </div>

      `
    );

  }


  /* ========================================================
     CLOCK
     ======================================================== */

  let clockTimer = null;


  function openClock() {

    openWindow(
      "Clock",
      `

      <div
        class="big-clock"
        id="big-clock">

        --:--:--

      </div>

      <div
        style="
          text-align:center;
          color:#777;
        ">

        Local time

      </div>

      `
    );


    clearInterval(
      clockTimer
    );


    function updateClock() {

      const element =
        document.getElementById(
          "big-clock"
        );


      if (!element) return;


      element.textContent =
        new Date()
          .toLocaleTimeString(
            [],
            {
              hour:"numeric",
              minute:"2-digit",
              second:"2-digit"
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


  /* ========================================================
     SETTINGS
     ======================================================== */

  function openSettings() {

    const dark =
      localStorage.getItem(
        "pearDark"
      ) === "1";


    openWindow(
      "Settings",
      `

      <div class="settings-row">

        <span>
          Dark Mode
        </span>

        <input
          id="dark-toggle"
          type="checkbox"
          ${dark ? "checked" : ""}>

      </div>


      <div class="settings-row">

        <span>
          Clear Photos
        </span>

        <button
          class="button"
          id="clear-photos">

          Clear

        </button>

      </div>


      <div class="settings-row">

        <span>
          Reset Pear OS
        </span>

        <button
          class="button"
          id="reset-os">

          Reset

        </button>

      </div>

      `
    );


    document
      .getElementById(
        "dark-toggle"
      )
      .addEventListener(
        "change",
        event => {

          localStorage.setItem(
            "pearDark",
            event.target.checked
              ? "1"
              : "0"
          );

        }
      );


    document
      .getElementById(
        "clear-photos"
      )
      .addEventListener(
        "click",
        () => {

          localStorage.removeItem(
            "pearPhotos"
          );

          alert(
            "Pear Photos cleared."
          );

        }
      );


    document
      .getElementById(
        "reset-os"
      )
      .addEventListener(
        "click",
        () => {

          localStorage.clear();

          location.reload();

        }
      );

  }


  /* ========================================================
     SPLASHFACE
     ======================================================== */

  function openSplashFace() {

    openWindow(
      "SplashFace",
      `

      <div
        style="
          text-align:center;
          padding:20px;
        ">

        <div
          style="
            font-size:50px;
            font-weight:900;
            color:#3974c5;
          ">

          Sf

        </div>

        <h2>
          SplashFace
        </h2>

        <p>
          Welcome back!
        </p>

        <button
          class="button"
          id="post-button">

          Create Post

        </button>

      </div>

      `
    );


    document
      .getElementById(
        "post-button"
      )
      .addEventListener(
        "click",
        () => {

          alert(
            "Your post was shared! 📸"
          );

        }
      );

  }


  /* ========================================================
     PEARTUNES
     ======================================================== */

  function openPearTunes() {

    openWindow(
      "PearTunes",
      `

      <div
        style="
          text-align:center;
          padding:5px 0 10px;
        ">

        <div
          style="
            font-size:50px;
            color:#dc3eb6;
          ">

          ♫

        </div>

        <h2>
          PearTunes
        </h2>

      </div>


      <div class="stock-list">

        <div class="stock-row">

          <span>
            Pearadise
          </span>

          <button
            class="button"
            data-song="Pearadise">

            ▶

          </button>

        </div>


        <div class="stock-row">

          <span>
            Sunset Drive
          </span>

          <button
            class="button"
            data-song="Sunset Drive">

            ▶

          </button>

        </div>


        <div class="stock-row">

          <span>
            Electric Orchard
          </span>

          <button
            class="button"
            data-song="Electric Orchard">

            ▶

          </button>

        </div>

      </div>

      `
    );


    document
      .querySelectorAll(
        "[data-song]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            alert(
              "Playing " +
              button.dataset.song
            );

          }
        );

      });

  }


  /* ========================================================
     PHONE
     ======================================================== */

  function openPhone() {

    openWindow(
      "Phone",
      `

      <div
        style="
          text-align:center;
          padding:15px;
        ">

        <div
          style="
            font-size:55px;
          ">

          ☎

        </div>

        <h2>
          Phone
        </h2>

        <p>
          Pear Phone calling
          interface.
        </p>


        <button
          class="button"
          id="fake-call">

          Call Pear Support

        </button>

      </div>

      `
    );


    document
      .getElementById(
        "fake-call"
      )
      .addEventListener(
        "click",
        () => {

          alert(
            "Calling Pear Support..."
          );

        }
      );

  }


  /* ========================================================
     MAIL
     ======================================================== */

  function openMail() {

    openWindow(
      "Mail",
      `

      <h3>
        Inbox
      </h3>


      <div class="stock-row">

        <div>

          <strong>
            Welcome to Pear OS
          </strong>

          <div
            style="
              color:#777;
              font-size:10px;
            ">

            Pear Team

          </div>

        </div>

      </div>


      <div
        style="
          height:5px;
        ">
      </div>


      <div class="stock-row">

        <div>

          <strong>
            Camera Ready
          </strong>

          <div
            style="
              color:#777;
              font-size:10px;
            ">

            Pear Photos

          </div>

        </div>

      </div>

      `
    );

  }


  /* ========================================================
     COMPASS
     ======================================================== */

  function openCompass() {

    openWindow(
      "Compass",
      `

      <div
        style="
          text-align:center;
          padding:15px;
        ">

        <div
          id="compass-arrow"
          style="
            font-size:75px;
            transition:transform .4s;
          ">

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


  /* ========================================================
     VIDEOS
     ======================================================== */

  function openVideos() {

    openWindow(
      "Videos",
      `

      <div
        style="
          text-align:center;
          padding:20px;
        ">

        <div
          style="
            font-size:60px;
          ">

          🎬

        </div>

        <h2>
          Videos
        </h2>

        <p>
          Your videos will appear here.
        </p>

      </div>

      `
    );

  }


  /* ========================================================
     MUSIC
     ======================================================== */

  function openMusic() {

    openPearTunes();

  }


  /* ========================================================
     CUSTOM KEYBOARD
     ======================================================== */

  function setupKeyboardInputs() {

    const inputs =
      appWindow.querySelectorAll(
        "input[type='text'], textarea"
      );


    inputs.forEach(input => {

      input.addEventListener(
        "focus",
        () => {

          activeInput =
            input;

          showKeyboard();

        }
      );


      input.addEventListener(
        "click",
        () => {

          activeInput =
            input;

          showKeyboard();

        }
      );

    });

  }


  function showKeyboard() {

    if (!activeInput) return;

    keyboard.classList.add(
      "show"
    );

  }


  function hideKeyboard() {

    keyboard.classList.remove(
      "show"
    );

    activeInput = null;

  }


  /* ========================================================
     KEYBOARD BUTTONS
     ======================================================== */

  keyboard
    .querySelectorAll(
      ".keyboard-key"
    )
    .forEach(key => {

      key.addEventListener(
        "click",
        event => {

          event.preventDefault();

          if (!activeInput) return;


          const value =
            key.textContent;


          if (value === "⌫") {

            activeInput.value =
              activeInput.value.slice(
                0,
                -1
              );

            return;

          }


          if (value === "SPACE") {

            insertText(" ");

            return;

          }


          if (value === "↵") {

            activeInput.dispatchEvent(
              new KeyboardEvent(
                "keydown",
                {
                  key:"Enter",
                  bubbles:true
                }
              )
            );

            return;

          }


          if (value === "123") {

            return;

          }


          insertText(
            value.toLowerCase()
          );

        }
      );

    });


  function insertText(text) {

    if (!activeInput) return;


    const start =
      activeInput.selectionStart ??
      activeInput.value.length;


    const end =
      activeInput.selectionEnd ??
      activeInput.value.length;


    activeInput.value =
      activeInput.value.slice(
        0,
        start
      ) +
      text +
      activeInput.value.slice(
        end
      );


    const newPosition =
      start + text.length;


    activeInput.setSelectionRange(
      newPosition,
      newPosition
    );


    activeInput.dispatchEvent(
      new Event(
        "input",
        {
          bubbles:true
        }
      )
    );

  }


  /* ========================================================
     SWIPE / PAGE SYSTEM
     ========================================================

     Swipe UP   = Page 2
     Swipe DOWN = Page 1

     The actual phone image remains the background.
     ======================================================== */

  phone.addEventListener(
    "touchstart",
    event => {

      if (
        event.touches.length !== 1
      ) return;


      touchStartX =
        event.touches[0].clientX;

      touchStartY =
        event.touches[0].clientY;

    },
    {
      passive:true
    }
  );


  phone.addEventListener(
    "touchend",
    event => {

      if (
        event.changedTouches.length !== 1
      ) return;


      const endX =
        event.changedTouches[0].clientX;

      const endY =
        event.changedTouches[0].clientY;


      const dx =
        endX - touchStartX;

      const dy =
        endY - touchStartY;


      if (
        Math.abs(dy) >
        Math.abs(dx) &&
        Math.abs(dy) > 40
      ) {

        if (dy < 0) {

          goToPage(2);

        } else {

          goToPage(1);

        }

      }

    },
    {
      passive:true
    }
  );


  /* ========================================================
     MOUSE / TRACKPAD DRAG
     ======================================================== */

  phone.addEventListener(
    "mousedown",
    event => {

      if (event.button !== 0)
        return;


      mouseDragging = true;

      mouseStartX =
        event.clientX;

      mouseStartY =
        event.clientY;

    }
  );


  window.addEventListener(
    "mouseup",
    event => {

      if (!mouseDragging)
        return;


      mouseDragging = false;


      const dx =
        event.clientX -
        mouseStartX;

      const dy =
        event.clientY -
        mouseStartY;


      if (
        Math.abs(dy) >
        Math.abs(dx) &&
        Math.abs(dy) > 50
      ) {

        if (dy < 0) {

          goToPage(2);

        } else {

          goToPage(1);

        }

      }

    }
  );


  /* ========================================================
     KEYBOARD ARROWS
     ======================================================== */

  window.addEventListener(
    "keydown",
    event => {

      /*
        Do not switch pages while
        typing into an input.
      */

      const target =
        event.target;


      if (
        target &&
        (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA"
        )
      ) {

        return;

      }


      if (
        event.key === "ArrowUp"
      ) {

        goToPage(2);

      }


      if (
        event.key === "ArrowDown"
      ) {

        goToPage(1);

      }

    }
  );


  /* ========================================================
     PAGE SWITCH
     ======================================================== */

  function goToPage(page) {

    if (page !== 1 && page !== 2)
      return;


    if (currentPage === page)
      return;


    currentPage =
      page;


    transition.className =
      page === 2
        ? "animate-up"
        : "animate-down";


    /*
      Page 2 uses the exact page2.png
      supplied for the project.

      Page 1 returns to pear-phone.jpg.
    */

    if (page === 2) {

      phone.style.backgroundImage =
        'url("page2.png")';

    } else {

      phone.style.backgroundImage =
        'url("pear-phone.jpg")';

    }


    /*
      Page 2 currently hides Page 1
      hotspots so they cannot accidentally
      launch Page 1 apps.
    */

    document
      .querySelectorAll(
        ".hotspot"
      )
      .forEach(button => {

        button.style.display =
          page === 1
            ? ""
            : "none";

      });


    setTimeout(
      () => {

        transition.className =
          "";

      },
      400
    );

  }


  /* ========================================================
     OVERLAY CLICK
     ======================================================== */

  overlay.addEventListener(
    "click",
    event => {

      /*
        Clicking outside the app window
        isn't possible inside the phone
        because the overlay fills the app
        region, but keep this here.
      */

      if (
        event.target === overlay
      ) {

        closeWindow();

      }

    }
  );


  /* ========================================================
     CLEANUP
     ======================================================== */

  window.addEventListener(
    "beforeunload",
    () => {

      stopCamera();

      clearInterval(
        clockTimer
      );

    }
  );


  /* ========================================================
     DEBUG MESSAGE
     ======================================================== */

  console.log(
    "%cPear Phone OS loaded successfully.",
    "font-weight:bold;font-size:16px;color:#36a846"
  );

  console.log(
    "App routing is using data-app IDs."
  );

  console.log(
    "Camera uses navigator.mediaDevices.getUserMedia()."
  );

});
