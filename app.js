/* =========================================================
   PEAR PHONE OS — APP.JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const overlay = document.getElementById("overlay");
  const appWindow = document.getElementById("app-window");
  const homeButton = document.getElementById("home");
  const keyboard = document.getElementById("pear-keyboard");
  const phoneContainer = document.getElementById("phone-container");

  if (!overlay || !appWindow || !phoneContainer) {
    console.error("Pear Phone OS: required elements are missing.");
    return;
  }


  /* =======================================================
     STORAGE
     ======================================================= */

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);

      if (value === null) {
        return fallback;
      }

      return JSON.parse(value);

    } catch (error) {
      console.warn("Storage read failed:", key, error);
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Storage save failed:", key, error);
    }
  }


  /* =======================================================
     APP STATE
     ======================================================= */

  const state = {

    messages: read("pearMessages", [
      {
        from: "Pear",
        text: "Welcome to Pear Messages 🍐",
        me: false
      }
    ]),

    notes: read("pearNotes", []),

    photos: read("pearPhotos", []),

    posts: read("pearPosts", [
      {
        user: "Chloe",
        text: "pear phone day 🍐✨",
        likes: 24,
        comments: 5
      },
      {
        user: "Sam",
        text: "who put this app on my phone 😭",
        likes: 17,
        comments: 2
      },
      {
        user: "Cat",
        text: "I FOUND A BUTTON!!! 💕",
        likes: 41,
        comments: 9
      }
    ]),

    calls: read("pearCalls", []),

    stocks: read("pearStocks", [
      "PEAR",
      "APL",
      "NFLX",
      "NICK",
      "GOOG"
    ]),

    settings: read("pearSettings", {
      dark: false,
      sound: true,
      large: false
    })

  };


  /* =======================================================
     HELPERS
     ======================================================= */

  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  }


  function now() {

    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });

  }


  function toast(message) {

    let toastElement = document.getElementById("pear-toast");

    if (!toastElement) {

      toastElement = document.createElement("div");

      toastElement.id = "pear-toast";

      Object.assign(toastElement.style, {

        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: "10000",
        padding: "12px 18px",
        borderRadius: "15px",
        background: "rgba(20,20,20,.92)",
        color: "white",
        fontSize: "14px",
        fontWeight: "700",
        boxShadow: "0 8px 30px rgba(0,0,0,.35)",
        pointerEvents: "none",
        opacity: "0",
        transition: "opacity .2s ease"

      });

      document.body.appendChild(toastElement);

    }

    toastElement.textContent = message;

    toastElement.style.opacity = "1";

    clearTimeout(toastElement._timer);

    toastElement._timer = setTimeout(() => {

      toastElement.style.opacity = "0";

    }, 1500);

  }


  /* =======================================================
     APP WINDOW
     ======================================================= */

  function openWindow(title, content) {

    appWindow.innerHTML = `

      <div class="window-header">

        <button
          class="back"
          id="pear-back"
          aria-label="Back"
        >‹</button>

        <span>${escapeHTML(title)}</span>

      </div>

      <div class="window-body">
        ${content}
      </div>

    `;

    overlay.classList.add("open");

    hideKeyboard();

    const back = document.getElementById("pear-back");

    if (back) {

      back.addEventListener("click", closeWindow);

    }

  }


  function closeWindow() {

    stopCamera();

    overlay.classList.remove("open");

    appWindow.innerHTML = "";

    hideKeyboard();

  }


  /* =======================================================
     HOME BUTTON
     ======================================================= */

  if (homeButton) {

    homeButton.addEventListener("click", (event) => {

      event.preventDefault();
      event.stopPropagation();

      closeWindow();

    });

  }


  /* =======================================================
     EXACT APP ROUTING
     ======================================================= */

  phoneContainer.addEventListener("click", (event) => {

    const button = event.target.closest("[data-app]");

    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const app = button.dataset.app;

    if (!app) return;

    launchApp(app);

  });


  /* =======================================================
     APP LAUNCHER
     ======================================================= */

  function launchApp(app) {

    switch (app) {

      case "messages":
        openMessages();
        break;

      case "camera":
        openCamera();
        break;

      case "photos":
        openPhotos();
        break;

      case "notes":
        openNotes();
        break;

      case "stocks":
        openStocks();
        break;

      case "maps":
        openMaps();
        break;

      case "weather":
        openWeather();
        break;

      case "clock":
        openClock();
        break;

      case "settings":
        openSettings();
        break;

      case "splashface":
        openSplashFace();
        break;

      case "peartunes":
      case "music":
        openMusic();
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

      default:
        openSimple(
          "Pear OS",
          `
            <div style="text-align:center;padding:30px;">
              <div style="font-size:55px;">🍐</div>
              <h2>${escapeHTML(app)}</h2>
              <p>This Pear app is ready to be customized.</p>
            </div>
          `
        );

    }

  }


  /* =======================================================
     MESSAGES
     ======================================================= */

  function openMessages() {

    const messagesHTML = state.messages.length

      ? state.messages.map(message => `

          <div
            class="bubble ${message.me ? "me" : ""}"
          >

            ${escapeHTML(message.text)}

            <div style="
              font-size:9px;
              opacity:.65;
              margin-top:3px;
            ">
              ${message.me ? "You" : escapeHTML(message.from || "Pear")}
            </div>

          </div>

        `).join("")

      : `
        <p style="text-align:center;color:#777;">
          No messages yet.
        </p>
      `;


    openWindow(
      "Messages",
      `

        <div id="messages-list">
          ${messagesHTML}
        </div>

        <div style="
          position:sticky;
          bottom:0;
          background:#f4f5f7;
          padding-top:7px;
        ">

          <div class="row">

            <input
              id="message-input"
              type="text"
              placeholder="iMessage"
              autocomplete="off"
            >

            <button
              class="button"
              id="send-message"
            >
              Send
            </button>

          </div>

        </div>

      `
    );


    const input = document.getElementById("message-input");

    const send = () => {

      const text = input.value.trim();

      if (!text) return;

      state.messages.push({
        from: "You",
        text,
        me: true
      });

      save("pearMessages", state.messages);

      openMessages();

      setTimeout(() => {

        state.messages.push({
          from: "Pear",
          text: "Got it 🍐",
          me: false
        });

        save("pearMessages", state.messages);

        openMessages();

      }, 600);

    };


    document
      .getElementById("send-message")
      ?.addEventListener("click", send);


    input?.addEventListener("keydown", (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        send();

      }

    });

  }


  /* =======================================================
     CAMERA
     ======================================================= */

  let activeCameraStream = null;


  async function openCamera() {

    openWindow(
      "Camera",
      `

        <video
          class="camera-video"
          id="camera-video"
          autoplay
          playsinline
          muted
        ></video>

        <div style="
          display:flex;
          gap:7px;
          margin-top:8px;
        ">

          <button
            class="button"
            id="start-camera"
          >
            Start
          </button>

          <button
            class="button"
            id="take-photo"
          >
            📸
          </button>

        </div>

        <canvas
          id="camera-canvas"
          style="display:none;"
        ></canvas>

        <img
          id="captured-photo"
          style="
            display:none;
            width:100%;
            margin-top:9px;
            border-radius:12px;
          "
          alt="Captured photo"
        >

        <p
          id="camera-status"
          style="
            color:#777;
            font-size:11px;
          "
        >
          Starting camera...
        </p>

      `
    );


    const video =
      document.getElementById("camera-video");

    const canvas =
      document.getElementById("camera-canvas");

    const photo =
      document.getElementById("captured-photo");

    const status =
      document.getElementById("camera-status");


    async function startCamera() {

      if (!navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia) {

        status.textContent =
          "Camera access is not available in this browser.";

        return;

      }


      try {

        stopCamera();

        status.textContent =
          "Requesting camera...";

        activeCameraStream =
          await navigator.mediaDevices.getUserMedia({

            video: {
              facingMode: {
                ideal: "environment"
              }
            },

            audio: false

          });


        video.srcObject =
          activeCameraStream;


        await video.play().catch(() => {});


        status.textContent =
          "Camera ready 📸";

      }

      catch (error) {

        console.error("Camera error:", error);

        status.textContent =
          "Camera permission was denied or no camera was found.";

      }

    }


    function takePhoto() {

      if (!video.videoWidth) {

        toast("Start the camera first.");

        return;

      }


      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;


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
        canvas.toDataURL(
          "image/jpeg",
          0.9
        );


      photo.src = image;

      photo.style.display =
        "block";


      state.photos.unshift(image);

      state.photos =
        state.photos.slice(0, 30);


      save(
        "pearPhotos",
        state.photos
      );


      status.textContent =
        "Photo saved to Photos 🍐";

    }


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


    startCamera();

  }


  function stopCamera() {

    if (!activeCameraStream) return;

    activeCameraStream
      .getTracks()
      .forEach(track => track.stop());

    activeCameraStream = null;

  }


  /* =======================================================
     PHOTOS
     ======================================================= */

  function openPhotos() {

    const photos = state.photos;


    const gallery = photos.length

      ? `
        <div class="photos">

          ${photos.map((photo, index) => `

            <img
              src="${photo}"
              alt="Photo ${index + 1}"
              data-photo-index="${index}"
              style="cursor:pointer;"
            >

          `).join("")}

        </div>
      `

      : `
        <div style="
          text-align:center;
          padding:35px 10px;
          color:#777;
        ">

          <div style="font-size:55px;">
            📷
          </div>

          <h3>No Photos</h3>

          <p>
            Take a photo in Camera and it will appear here.
          </p>

        </div>
      `;


    openWindow(
      "Photos",
      gallery
    );


    appWindow
      .querySelectorAll("[data-photo-index]")
      .forEach(image => {

        image.addEventListener(
          "click",
          () => {

            const index =
              Number(
                image.dataset.photoIndex
              );

            const selected =
              state.photos[index];

            openWindow(
              "Photo",
              `

                <img
                  src="${selected}"
                  style="
                    width:100%;
                    border-radius:14px;
                  "
                  alt="Photo"
                >

                <button
                  class="button"
                  id="delete-photo"
                  style="margin-top:8px;"
                >
                  Delete
                </button>

              `
            );


            document
              .getElementById("delete-photo")
              ?.addEventListener(
                "click",
                () => {

                  state.photos.splice(
                    index,
                    1
                  );

                  save(
                    "pearPhotos",
                    state.photos
                  );

                  openPhotos();

                }
              );

          }
        );

      });

  }


  /* =======================================================
     NOTES
     ======================================================= */

  function openNotes() {

    openWindow(
      "Notes",
      `

        <textarea
          id="notes-editor"
          placeholder="Write something..."
        ></textarea>

        <div style="
          display:flex;
          gap:7px;
          margin-top:7px;
        ">

          <button
            class="button"
            id="save-note"
          >
            Save Note
          </button>

          <button
            class="button"
            id="clear-note"
          >
            Clear
          </button>

        </div>

        <h3>Saved Notes</h3>

        <div id="notes-list">

          ${
            state.notes.length

              ? state.notes.map((note,index) => `

                <div style="
                  background:#fff;
                  border:1px solid #ddd;
                  border-radius:10px;
                  padding:9px;
                  margin-bottom:6px;
                ">

                  <div style="font-size:12px;">
                    ${escapeHTML(note.text)}
                  </div>

                  <small style="color:#777;">
                    ${escapeHTML(note.time || "")}
                  </small>

                  <button
                    class="button"
                    data-delete-note="${index}"
                    style="margin-top:5px;"
                  >
                    Delete
                  </button>

                </div>

              `).join("")

              : `
                <p style="color:#777;">
                  No saved notes.
                </p>
              `
          }

        </div>

      `
    );


    document
      .getElementById("save-note")
      ?.addEventListener(
        "click",
        () => {

          const editor =
            document.getElementById(
              "notes-editor"
            );

          const text =
            editor.value.trim();

          if (!text) {

            toast("Write something first.");

            return;

          }


          state.notes.unshift({
            text,
            time: now()
          });


          save(
            "pearNotes",
            state.notes
          );


          openNotes();

          toast("Note saved 🍐");

        }
      );


    document
      .getElementById("clear-note")
      ?.addEventListener(
        "click",
        () => {

          document.getElementById(
            "notes-editor"
          ).value = "";

        }
      );


    appWindow
      .querySelectorAll("[data-delete-note]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset.deleteNote
              );

            state.notes.splice(
              index,
              1
            );

            save(
              "pearNotes",
              state.notes
            );

            openNotes();

          }
        );

      });

  }


  /* =======================================================
     STOCKS
     ======================================================= */

  function openStocks() {

    const prices = {
      PEAR: 42.18,
      APL: 227.43,
      NFLX: 1182.31,
      NICK: 31.42,
      GOOG: 251.87
    };


    openWindow(
      "Stocks",
      `

        <p style="color:#777;font-size:11px;">
          Market snapshot
        </p>

        ${
          state.stocks.map(symbol => {

            const price =
              prices[symbol] ??
              (Math.random() * 200 + 20);

            const change =
              ((Math.random() * 8) - 4)
                .toFixed(2);

            return `

              <div class="stock">

                <div>

                  <strong>
                    ${escapeHTML(symbol)}
                  </strong>

                  <small
                    style="
                      display:block;
                      color:#777;
                    "
                  >
                    PEAR MARKET
                  </small>

                </div>

                <div style="text-align:right;">

                  <strong>
                    $${price.toFixed(2)}
                  </strong>

                  <small
                    style="
                      display:block;
                      color:${Number(change)>=0
                        ? "#16833b"
                        : "#d33"};
                    "
                  >
                    ${Number(change)>=0 ? "+" : ""}
                    ${change}%
                  </small>

                </div>

              </div>

            `;

          }).join("")
        }

        <button
          class="button"
          id="refresh-stocks"
        >
          Refresh
        </button>

      `
    );


    document
      .getElementById("refresh-stocks")
      ?.addEventListener(
        "click",
        openStocks
      );

  }


  /* =======================================================
     MAPS
     ======================================================= */

  function openMaps() {

    openWindow(
      "Maps",
      `

        <div class="map">
          🗺️
        </div>

        <h3>Where do you want to go?</h3>

        <input
          id="map-search"
          placeholder="Search location..."
        >

        <button
          class="button"
          id="map-go"
          style="margin-top:7px;"
        >
          Search
        </button>

        <div
          id="map-result"
          style="
            margin-top:10px;
            font-size:13px;
          "
        ></div>

      `
    );


    document
      .getElementById("map-go")
      ?.addEventListener(
        "click",
        () => {

          const value =
            document
              .getElementById("map-search")
              .value
              .trim();

          const result =
            document.getElementById(
              "map-result"
            );


          if (!value) {

            result.textContent =
              "Enter a destination.";

            return;

          }


          result.innerHTML = `
            <strong>📍 ${escapeHTML(value)}</strong>
            <br>
            <span style="color:#777;">
              Pear Maps found your destination.
            </span>
          `;

        }
      );

  }


  /* =======================================================
     WEATHER
     ======================================================= */

  function openWeather() {

    const temperature =
      Math.round(
        12 +
        Math.random() * 18
      );


    openWindow(
      "Weather",
      `

        <div style="
          text-align:center;
          padding:15px 5px;
        ">

          <div style="font-size:65px;">
            ☀️
          </div>

          <div style="
            font-size:42px;
            font-weight:900;
          ">
            ${temperature}°
          </div>

          <h3>
            Sunny
          </h3>

          <p style="color:#777;">
            Perfect Pear Phone weather.
          </p>

        </div>

        <div class="stock">
          <span>Humidity</span>
          <strong>52%</strong>
        </div>

        <div class="stock">
          <span>Wind</span>
          <strong>12 km/h</strong>
        </div>

      `
    );

  }


  /* =======================================================
     CLOCK
     ======================================================= */

  function openClock() {

    openWindow(
      "Clock",
      `

        <div
          id="big-clock"
          style="
            text-align:center;
            font-size:38px;
            font-weight:900;
            padding:25px 0;
          "
        >
          ${now()}
        </div>

        <div style="
          text-align:center;
          color:#777;
        ">
          Pear Standard Time
        </div>

      `
    );


    const interval =
      setInterval(() => {

        const clock =
          document.getElementById(
            "big-clock"
          );

        if (!clock) {

          clearInterval(interval);

          return;

        }

        clock.textContent =
          now();

      }, 1000);

  }


  /* =======================================================
     SETTINGS
     ======================================================= */

  function openSettings() {

    openWindow(
      "Settings",
      `

        <div class="stock">

          <span>
            Dark Mode
          </span>

          <button
            class="button"
            id="dark-toggle"
          >
            ${state.settings.dark ? "ON" : "OFF"}
          </button>

        </div>

        <div class="stock">

          <span>
            Large Text
          </span>

          <button
            class="button"
            id="large-toggle"
          >
            ${state.settings.large ? "ON" : "OFF"}
          </button>

        </div>

        <div class="stock">

          <span>
            Sound
          </span>

          <button
            class="button"
            id="sound-toggle"
          >
            ${state.settings.sound ? "ON" : "OFF"}
          </button>

        </div>

        <button
          class="button"
          id="reset-phone"
          style="
            margin-top:10px;
          "
        >
          Reset Pear Phone
        </button>

      `
    );


    document
      .getElementById("dark-toggle")
      ?.addEventListener(
        "click",
        () => {

          state.settings.dark =
            !state.settings.dark;

          save(
            "pearSettings",
            state.settings
          );

          applySettings();

          openSettings();

        }
      );


    document
      .getElementById("large-toggle")
      ?.addEventListener(
        "click",
        () => {

          state.settings.large =
            !state.settings.large;

          save(
            "pearSettings",
            state.settings
          );

          applySettings();

          openSettings();

        }
      );


    document
      .getElementById("sound-toggle")
      ?.addEventListener(
        "click",
        () => {

          state.settings.sound =
            !state.settings.sound;

          save(
            "pearSettings",
            state.settings
          );

          openSettings();

        }
      );


    document
      .getElementById("reset-phone")
      ?.addEventListener(
        "click",
        () => {

          if (
            confirm(
              "Reset Pear Phone data?"
            )
          ) {

            localStorage.clear();

            location.reload();

          }

        }
      );

  }


  function applySettings() {

    document.body.style.filter =
      state.settings.dark
        ? "invert(.9) hue-rotate(180deg)"
        : "";

    document.body.style.fontSize =
      state.settings.large
        ? "18px"
        : "";

  }


  applySettings();


  /* =======================================================
     SPLASHFACE
     ======================================================= */

  function openSplashFace() {

    openWindow(
      "SplashFace",
      `

        <div style="
          text-align:center;
        ">

          <div style="
            font-size:55px;
            margin:10px;
          ">
            🍐
          </div>

          <h2>
            SplashFace
          </h2>

          <p style="color:#777;">
            Your Pear social feed.
          </p>

        </div>

        <div id="splash-feed">

          ${
            state.posts.map(
              (post,index) => `

                <div style="
                  background:#fff;
                  border:1px solid #ddd;
                  border-radius:13px;
                  padding:10px;
                  margin-bottom:8px;
                ">

                  <strong>
                    ${escapeHTML(post.user)}
                  </strong>

                  <p>
                    ${escapeHTML(post.text)}
                  </p>

                  <div style="
                    display:flex;
                    gap:6px;
                  ">

                    <button
                      class="button"
                      data-like="${index}"
                    >
                      ❤️ ${post.likes}
                    </button>

                    <button
                      class="button"
                    >
                      💬 ${post.comments}
                    </button>

                  </div>

                </div>

              `
            ).join("")
          }

        </div>

        <button
          class="button"
          id="new-post"
        >
          New Post
        </button>

      `
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

            state.posts[index].likes++;

            save(
              "pearPosts",
              state.posts
            );

            openSplashFace();

          }
        );

      });


    document
      .getElementById("new-post")
      ?.addEventListener(
        "click",
        () => {

          openWindow(
            "New Post",
            `

              <textarea
                id="post-text"
                placeholder="What's happening?"
              ></textarea>

              <button
                class="button"
                id="post-submit"
                style="margin-top:7px;"
              >
                Post
              </button>

            `
          );


          document
            .getElementById("post-submit")
            ?.addEventListener(
              "click",
              () => {

                const text =
                  document
                    .getElementById(
                      "post-text"
                    )
                    .value
                    .trim();

                if (!text) {

                  toast(
                    "Write something first."
                  );

                  return;

                }


                state.posts.unshift({

                  user: "You",

                  text,

                  likes: 0,

                  comments: 0

                });


                save(
                  "pearPosts",
                  state.posts
                );


                openSplashFace();

              }
            );

        }
      );

  }


  /* =======================================================
     MUSIC
     ======================================================= */

  let audioContext = null;
  let musicPlaying = false;


  function openMusic() {

    openWindow(
      "PearTunes",
      `

        <div style="
          text-align:center;
          padding:15px;
        ">

          <div style="
            font-size:65px;
          ">
            🎵
          </div>

          <h2>
            PearTunes
          </h2>

          <p id="music-status">
            Nothing playing
          </p>

          <button
            class="button"
            id="music-play"
          >
            ▶ Play
          </button>

        </div>

        <div class="stock">
          <span>🍐 Pear Dreams</span>
          <button
            class="button"
            data-song="Pear Dreams"
          >
            Play
          </button>
        </div>

        <div class="stock">
          <span>✨ Pear Day</span>
          <button
            class="button"
            data-song="Pear Day"
          >
            Play
          </button>
        </div>

      `
    );


    document
      .getElementById("music-play")
      ?.addEventListener(
        "click",
        () => {

          toggleMusic();

        }
      );


    appWindow
      .querySelectorAll("[data-song]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const status =
              document.getElementById(
                "music-status"
              );

            status.textContent =
              "Playing " +
              button.dataset.song +
              " 🎵";

            playBeep();

          }
        );

      });

  }


  function playBeep() {

    try {

      audioContext =
        audioContext ||
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

      const oscillator =
        audioContext.createOscillator();

      const gain =
        audioContext.createGain();

      oscillator.frequency.value =
        440;

      oscillator.type =
        "sine";

      gain.gain.value =
        0.05;

      oscillator.connect(gain);

      gain.connect(
        audioContext.destination
      );

      oscillator.start();

      oscillator.stop(
        audioContext.currentTime + .25
      );

    } catch {}

  }


  function toggleMusic() {

    musicPlaying =
      !musicPlaying;

    const status =
      document.getElementById(
        "music-status"
      );

    if (status) {

      status.textContent =
        musicPlaying
          ? "Playing Pear Radio 🎵"
          : "Nothing playing";

    }

    if (musicPlaying) {

      playBeep();

    }

  }


  /* =======================================================
     VIDEOS
     ======================================================= */

  function openVideos() {

    openWindow(
      "Videos",
      `

        <div style="
          text-align:center;
          padding:20px;
        ">

          <div style="
            font-size:65px;
          ">
            ▶️
          </div>

          <h2>
            Pear Videos
          </h2>

          <p style="color:#777;">
            Your videos will appear here.
          </p>

          <button
            class="button"
            id="video-demo"
          >
            Play Demo
          </button>

          <div
            id="video-message"
            style="margin-top:10px;"
          ></div>

        </div>

      `
    );


    document
      .getElementById("video-demo")
      ?.addEventListener(
        "click",
        () => {

          document
            .getElementById(
              "video-message"
            )
            .textContent =
              "▶ Pear Phone demo playing!";

        }
      );

  }


  /* =======================================================
     PHONE
     ======================================================= */

  function openPhone() {

    openWindow(
      "Phone",
      `

        <div style="
          text-align:center;
          padding:10px;
        ">

          <div style="
            font-size:45px;
          ">
            ☎️
          </div>

          <h2 id="phone-number">
            —
          </h2>

        </div>

        <div style="
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:6px;
        ">

          ${
            ["1","2","3","4","5","6","7","8","9","*","0","#"]
              .map(number => `

                <button
                  class="button"
                  data-number="${number}"
                  style="height:38px;"
                >
                  ${number}
                </button>

              `)
              .join("")
          }

        </div>

        <button
          class="button"
          id="call-button"
          style="
            width:100%;
            margin-top:8px;
          "
        >
          📞 Call
        </button>

      `
    );


    let number = "";


    appWindow
      .querySelectorAll("[data-number]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            number +=
              button.dataset.number;

            document
              .getElementById(
                "phone-number"
              )
              .textContent =
              number;

          }
        );

      });


    document
      .getElementById("call-button")
      ?.addEventListener(
        "click",
        () => {

          if (!number) {

            toast(
              "Enter a number first."
            );

            return;

          }


          state.calls.unshift({
            number,
            time: now()
          });


          save(
            "pearCalls",
            state.calls
          );


          toast(
            "Calling " + number
          );

        }
      );

  }


  /* =======================================================
     MAIL
     ======================================================= */

  function openMail() {

    openWindow(
      "Mail",
      `

        <div class="stock">

          <div>

            <strong>
              Welcome to Pear OS
            </strong>

            <small style="
              display:block;
              color:#777;
            ">
              Pear Team
            </small>

          </div>

          <span>
            ›
          </span>

        </div>

        <div class="stock">

          <div>

            <strong>
              Your photos are ready
            </strong>

            <small style="
              display:block;
              color:#777;
            ">
              Pear Photos
            </small>

          </div>

          <span>
            ›
          </span>

        </div>

        <button
          class="button"
          id="compose-mail"
        >
          Compose
        </button>

      `
    );


    document
      .getElementById("compose-mail")
      ?.addEventListener(
        "click",
        () => {

          openWindow(
            "New Mail",
            `

              <input
                placeholder="To"
                id="mail-to"
              >

              <input
                placeholder="Subject"
                id="mail-subject"
                style="margin-top:7px;"
              >

              <textarea
                placeholder="Message"
                id="mail-body"
                style="margin-top:7px;"
              ></textarea>

              <button
                class="button"
                id="send-mail"
                style="margin-top:7px;"
              >
                Send
              </button>

            `
          );


          document
            .getElementById("send-mail")
            ?.addEventListener(
              "click",
              () => {

                toast(
                  "Mail sent ✉️"
                );

                closeWindow();

              }
            );

        }
      );

  }


  /* =======================================================
     COMPASS
     ======================================================= */

  function openCompass() {

    openWindow(
      "Compass",
      `

        <div style="
          text-align:center;
          padding:15px;
        ">

          <div style="
            width:150px;
            height:150px;
            margin:auto;
            border-radius:50%;
            border:5px solid #333;
            background:#fff;
            display:grid;
            place-items:center;
            position:relative;
            font-size:35px;
          ">

            🧭

          </div>

          <h2 id="compass-heading">
            North
          </h2>

          <p id="compass-degree">
            0°
          </p>

        </div>

      `
    );


    if (
      window.DeviceOrientationEvent
    ) {

      window.addEventListener(
        "deviceorientation",
        updateCompass
      );

    }

  }


  function updateCompass(event) {

    const heading =
      event.webkitCompassHeading ??
      event.alpha;

    if (heading == null) return;

    const headingElement =
      document.getElementById(
        "compass-degree"
      );

    const nameElement =
      document.getElementById(
        "compass-heading"
      );

    if (!headingElement ||
        !nameElement) {

      window.removeEventListener(
        "deviceorientation",
        updateCompass
      );

      return;

    }


    const degrees =
      Math.round(heading);


    headingElement.textContent =
      degrees + "°";


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


    const index =
      Math.round(degrees / 45) % 8;


    nameElement.textContent =
      directions[index];

  }


  /* =======================================================
     SIMPLE APP
     ======================================================= */

  function openSimple(title, content) {

    openWindow(
      title,
      content
    );

  }


  /* =======================================================
     CUSTOM KEYBOARD
     ======================================================= */

  let activeInput = null;


  function showKeyboard(input) {

    if (!keyboard) return;

    activeInput = input;

    keyboard.classList.add(
      "visible"
    );

  }


  function hideKeyboard() {

    if (!keyboard) return;

    keyboard.classList.remove(
      "visible"
    );

    activeInput = null;

  }


  document.addEventListener(
    "focusin",
    event => {

      const target =
        event.target;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {

        showKeyboard(target);

      }

    }
  );


  document.addEventListener(
    "focusout",
    event => {

      setTimeout(() => {

        if (
          !document.activeElement ||
          (
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA"
          )
        ) {

          hideKeyboard();

        }

      }, 100);

    }
  );


  /* =======================================================
     KEYBOARD BUTTONS
     ======================================================= */

  if (keyboard) {

    keyboard
      .querySelectorAll(".keyboard-key")
      .forEach(key => {

        key.addEventListener(
          "click",
          event => {

            event.preventDefault();

            if (!activeInput) return;


            const value =
              key.textContent;


            if (value === "⌫") {

              const start =
                activeInput.selectionStart;

              const end =
                activeInput.selectionEnd;


              if (start === end && start > 0) {

                activeInput.value =
                  activeInput.value.slice(
                    0,
                    start - 1
                  ) +
                  activeInput.value.slice(
                    end
                  );


                activeInput.selectionStart =
                  start - 1;

                activeInput.selectionEnd =
                  start - 1;

              } else {

                activeInput.value =
                  activeInput.value.slice(
                    0,
                    start
                  ) +
                  activeInput.value.slice(
                    end
                  );

                activeInput.selectionStart =
                  start;

                activeInput.selectionEnd =
                  start;

              }

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


            const character =
              value === "SPACE"
                ? " "
                : value;


            const start =
              activeInput.selectionStart;

            const end =
              activeInput.selectionEnd;


            activeInput.value =
              activeInput.value.slice(
                0,
                start
              ) +
              character +
              activeInput.value.slice(
                end
              );


            activeInput.selectionStart =
              start + character.length;

            activeInput.selectionEnd =
              start + character.length;


            activeInput.dispatchEvent(
              new Event(
                "input",
                {
                  bubbles:true
                }
              )
            );

          }
        );

      });

  }


  /* =======================================================
     PAGE SWITCHING
     ======================================================= */

  let currentPage = 1;

  let swipeStartX = 0;
  let swipeStartY = 0;

  let mouseDragging = false;


  function switchPage(page) {

    if (page !== 1 &&
        page !== 2) {

      return;

    }


    if (page === currentPage) {
      return;
    }


    const transition =
      document.getElementById(
        "page-transition"
      );


    if (transition) {

      transition.classList.add(
        "active"
      );

    }


    setTimeout(() => {

      currentPage = page;


      if (currentPage === 2) {

        phoneContainer.classList.add(
          "page-two"
        );

      } else {

        phoneContainer.classList.remove(
          "page-two"
        );

      }


      setTimeout(() => {

        if (transition) {

          transition.classList.remove(
            "active"
          );

        }

      }, 120);

    }, 120);

  }


  /* =======================================================
     TOUCH SWIPE
     ======================================================= */

  phoneContainer.addEventListener(
    "touchstart",
    event => {

      if (
        event.touches.length !== 1
      ) {
        return;
      }


      swipeStartX =
        event.touches[0].clientX;

      swipeStartY =
        event.touches[0].clientY;

    },
    {
      passive:true
    }
  );


  phoneContainer.addEventListener(
    "touchend",
    event => {

      if (
        event.changedTouches.length !== 1
      ) {
        return;
      }


      const endX =
        event.changedTouches[0].clientX;

      const endY =
        event.changedTouches[0].clientY;


      const dx =
        endX - swipeStartX;

      const dy =
        endY - swipeStartY;


      if (
        Math.abs(dy) < 45 ||
        Math.abs(dy) < Math.abs(dx)
      ) {

        return;

      }


      /*
        SWIPE UP = PAGE 2
        SWIPE DOWN = PAGE 1
      */

      if (dy < 0) {

        switchPage(2);

      } else {

        switchPage(1);

      }

    },
    {
      passive:true
    }
  );


  /* =======================================================
     MOUSE / TRACKPAD DRAG
     ======================================================= */

  phoneContainer.addEventListener(
    "mousedown",
    event => {

      mouseDragging = true;

      swipeStartX =
        event.clientX;

      swipeStartY =
        event.clientY;

    }
  );


  window.addEventListener(
    "mouseup",
    event => {

      if (!mouseDragging) {
        return;
      }


      mouseDragging = false;


      const dx =
        event.clientX - swipeStartX;

      const dy =
        event.clientY - swipeStartY;


      if (
        Math.abs(dy) < 45 ||
        Math.abs(dy) < Math.abs(dx)
      ) {

        return;

      }


      if (dy < 0) {

        switchPage(2);

      } else {

        switchPage(1);

      }

    }
  );


  /* =======================================================
     MAC KEYBOARD
     ======================================================= */

  window.addEventListener(
    "keydown",
    event => {

      /*
        Don't switch pages while typing.
      */

      const active =
        document.activeElement;

      const typing =
        active &&
        (
          active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA"
        );


      if (typing) {
        return;
      }


      if (event.key === "ArrowUp") {

        event.preventDefault();

        switchPage(2);

      }


      if (event.key === "ArrowDown") {

        event.preventDefault();

        switchPage(1);

      }


      if (event.key === "Escape") {

        closeWindow();

      }

    }
  );


  /* =======================================================
     PREVENT APP WINDOW FROM TRIGGERING PAGE SWIPES
     ======================================================= */

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


  /* =======================================================
     INITIALIZE
     ======================================================= */

  phoneContainer.classList.remove(
    "page-two"
  );

  currentPage = 1;

  console.log(
    "🍐 Pear Phone OS loaded successfully."
  );

});
