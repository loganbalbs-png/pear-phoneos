(() => {
  "use strict";

  const phone = document.getElementById("phone");
  const overlay = document.getElementById("overlay");
  const app = document.getElementById("app");
  const keyboard = document.getElementById("keyboard");
  const flash = document.getElementById("flash");

  let startY = null;
  let mouseStartY = null;

  let keyboardTarget = null;
  let stream = null;
  let clockTimer = null;

  const esc = value =>
    String(value).replace(/[&<>"']/g, char => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    }[char]));

  /* =========================================================
     CLOSE APP
     ========================================================= */

  function closeApp(){
    if(stream){
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }

    clearInterval(clockTimer);
    clockTimer = null;

    keyboard.classList.remove("show");
    keyboardTarget = null;

    overlay.classList.remove("open");

    app.innerHTML = "";
  }

  /* =========================================================
     OPEN APP
     ========================================================= */

  function openWindow(title, html){
    closeApp();

    app.innerHTML = `
      <div class="head">
        <button id="back" aria-label="Back">‹</button>
        <span>${esc(title)}</span>
      </div>

      <div class="body">
        ${html}
      </div>
    `;

    overlay.classList.add("open");

    const back = document.getElementById("back");

    if(back){
      back.onclick = closeApp;
    }
  }

  /* =========================================================
     APP ROUTER
     ========================================================= */

  function launch(id){

    switch(id){

      case "messages":
        return messages();

      case "camera":
        return camera();

      case "photos":
        return photos();

      case "notes":
        return notes();

      case "stocks":
        return stocks();

      case "maps":
        return maps();

      case "weather":
        return weather();

      case "clock":
        return clock();

      case "settings":
        return settings();

      case "peartunes":
      case "music":
        return music();

      case "phone":
        return simple(
          "Phone",
          `
          <div class="big">☎</div>
          <p style="text-align:center">
            Pear Phone calling is ready for hardware integration.
          </p>
          `
        );

      case "mail":
        return simple(
          "Mail",
          `
          <h3>Inbox</h3>

          <div class="stock">
            <b>Welcome to Pear OS</b>
            <span>9:41</span>
          </div>

          <div class="stock">
            <b>Your Pear Phone is ready!</b>
            <span>Today</span>
          </div>
          `
        );

      case "compass":
        return simple(
          "Compass",
          `
          <div class="big">🧭</div>
          <p style="text-align:center">
            North · 0°
          </p>
          `
        );

      case "splashface":
        return simple(
          "SplashFace",
          `
          <div class="big">Sf</div>

          <p style="text-align:center">
            Welcome to SplashFace.
          </p>

          <button id="splash">
            Make a Splash
          </button>

          <p id="splashText"
             style="text-align:center;font-weight:bold">
          </p>
          `
        );

      case "videos":
        return simple(
          "Videos",
          `
          <div class="big">▶</div>

          <p style="text-align:center">
            No videos yet.
          </p>

          <button id="videoTest">
            Test Video Player
          </button>

          <p id="videoStatus"
             style="text-align:center">
          </p>
          `
        );

      default:
        return simple(
          "Pear OS",
          `<p>${esc(id)} opened.</p>`
        );
    }
  }

  /* =========================================================
     SIMPLE APP
     ========================================================= */

  function simple(title, html){
    openWindow(title, html);

    if(title === "SplashFace"){
      const splash = document.getElementById("splash");

      if(splash){
        splash.onclick = () => {
          const text = document.getElementById("splashText");

          if(text){
            text.textContent =
              "✨ You just made a Splash! ✨";
          }
        };
      }
    }

    if(title === "Videos"){
      const test = document.getElementById("videoTest");

      if(test){
        test.onclick = () => {
          const status =
            document.getElementById("videoStatus");

          if(status){
            status.textContent =
              "Video player ready.";
          }
        };
      }
    }
  }

  /* =========================================================
     MESSAGES
     ========================================================= */

  function messages(){

    const saved =
      JSON.parse(
        localStorage.getItem("pearMessages") || "[]"
      );

    openWindow(
      "Messages",

      `
      <div class="bubble">
        Hey 👋
      </div>

      <div class="bubble">
        Welcome to Pear Phone.
      </div>

      ${
        saved.map(message => `
          <div class="bubble me">
            ${esc(message)}
          </div>
        `).join("")
      }

      <div class="row" style="margin-top:8px">

        <input
          id="messageInput"
          style="flex:1"
          placeholder="Message"
          autocomplete="off"
        >

        <button id="sendMessage">
          Send
        </button>

      </div>
      `
    );

    const input =
      document.getElementById("messageInput");

    const send =
      document.getElementById("sendMessage");

    send.onclick = () => {

      const value =
        input.value.trim();

      if(!value) return;

      saved.push(value);

      localStorage.setItem(
        "pearMessages",
        JSON.stringify(saved.slice(-50))
      );

      messages();
    };

    input.onkeydown = event => {

      if(event.key === "Enter"){
        event.preventDefault();
        send.click();
      }

    };
  }

  /* =========================================================
     CAMERA
     ========================================================= */

  async function camera(){

    openWindow(
      "Camera",

      `
      <video
        id="cameraVideo"
        class="video"
        autoplay
        playsinline
      ></video>

      <div
        class="row"
        style="margin-top:7px"
      >

        <button id="startCamera">
          Start Camera
        </button>

        <button id="takePhoto">
          Take Photo
        </button>

      </div>

      <p
        id="cameraStatus"
        style="font-size:11px;color:#666"
      >
        Connecting to camera…
      </p>

      <canvas
        id="cameraCanvas"
        hidden
      ></canvas>

      <img
        id="cameraPhoto"
        style="
          display:none;
          width:100%;
          margin-top:7px;
          border-radius:10px;
        "
        alt="Captured photo"
      >
      `
    );

    document.getElementById(
      "startCamera"
    ).onclick = startCamera;

    document.getElementById(
      "takePhoto"
    ).onclick = takePhoto;

    await startCamera();
  }

  /* =========================================================
     START CAMERA
     ========================================================= */

  async function startCamera(){

    const video =
      document.getElementById("cameraVideo");

    const status =
      document.getElementById("cameraStatus");

    if(!video || !status) return;

    if(!navigator.mediaDevices ||
       !navigator.mediaDevices.getUserMedia){

      status.textContent =
        "Camera unavailable. Use HTTPS and Chromium/Safari.";

      return;
    }

    try{

      if(stream){
        stream.getTracks()
          .forEach(track => track.stop());
      }

      stream =
        await navigator.mediaDevices.getUserMedia({
          video:{
            facingMode:{
              ideal:"environment"
            }
          },
          audio:false
        });

      video.srcObject = stream;

      await video.play();

      status.textContent =
        "Camera connected ✓";

    }catch(error){

      console.error(error);

      status.textContent =
        "Camera permission/device error. Check browser permissions and USB camera connection.";
    }
  }

  /* =========================================================
     TAKE PHOTO
     ========================================================= */

  function takePhoto(){

    const video =
      document.getElementById("cameraVideo");

    const canvas =
      document.getElementById("cameraCanvas");

    const image =
      document.getElementById("cameraPhoto");

    if(!video || !video.videoWidth){

      alert("Start the camera first.");

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

    const data =
      canvas.toDataURL(
        "image/jpeg",
        .9
      );

    image.src = data;
    image.style.display = "block";

    const photos =
      JSON.parse(
        localStorage.getItem("pearPhotos") || "[]"
      );

    photos.unshift(data);

    localStorage.setItem(
      "pearPhotos",
      JSON.stringify(
        photos.slice(0,24)
      )
    );

    flash.classList.remove("go");

    void flash.offsetWidth;

    flash.classList.add("go");
  }

  /* =========================================================
     PHOTOS
     ========================================================= */

  function photos(){

    const saved =
      JSON.parse(
        localStorage.getItem("pearPhotos") || "[]"
      );

    openWindow(
      "Photos",

      `
      <input
        id="importPhotos"
        type="file"
        accept="image/*"
        multiple
      >

      <div style="height:7px"></div>

      <div class="photos">

        ${
          saved.length

          ?

          saved.map(image => `
            <img
              src="${image}"
              alt="Pear Phone photo"
            >
          `).join("")

          :

          `
          <p
            style="
              grid-column:1/-1;
              text-align:center;
            "
          >
            No photos yet.
          </p>
          `
        }

      </div>
      `
    );

    const importer =
      document.getElementById(
        "importPhotos"
      );

    importer.onchange =
      async event => {

        const imported = [];

        for(
          const file
          of event.target.files
        ){

          imported.push(
            await new Promise(resolve => {

              const reader =
                new FileReader();

              reader.onload =
                () => resolve(
                  reader.result
                );

              reader.readAsDataURL(
                file
              );
            })
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
      };
  }

  /* =========================================================
     NOTES
     ========================================================= */

  function notes(){

    const saved =
      JSON.parse(
        localStorage.getItem("pearNotes") || "[]"
      );

    openWindow(
      "Notes",

      `
      ${
        saved.map((note,index) => `
          <div
            class="stock"
            data-note="${index}"
            style="cursor:pointer"
          >

            <b>
              ${esc(note.title)}
            </b>

            <span>
              ${esc(
                note.body.slice(0,45)
              )}
            </span>

          </div>
        `).join("")
      }

      <input
        id="noteTitle"
        style="width:100%;margin-bottom:7px"
        placeholder="Title"
      >

      <textarea
        id="noteBody"
        placeholder="Write your note…"
      ></textarea>

      <button
        id="saveNote"
        style="margin-top:7px"
      >
        Save Note
      </button>
      `
    );

    document
      .querySelectorAll("[data-note]")
      .forEach(element => {

        element.onclick = () => {

          const note =
            saved[
              Number(
                element.dataset.note
              )
            ];

          document.getElementById(
            "noteTitle"
          ).value =
            note.title;

          document.getElementById(
            "noteBody"
          ).value =
            note.body;
        };
      });

    document.getElementById(
      "saveNote"
    ).onclick = () => {

      const title =
        document.getElementById(
          "noteTitle"
        ).value.trim();

      const body =
        document.getElementById(
          "noteBody"
        ).value;

      saved.unshift({
        title:
          title || "Untitled",

        body
      });

      localStorage.setItem(
        "pearNotes",
        JSON.stringify(
          saved.slice(0,50)
        )
      );

      notes();
    };
  }

  /* =========================================================
     STOCKS
     ========================================================= */

  function stocks(){

    const data = [
      ["AAPL","Apple","$229.87","+1.8%"],
      ["MSFT","Microsoft","$532.44","+0.9%"],
      ["TSLA","Tesla","$318.26","-1.2%"],
      ["PEAR","Pear Inc.","$99.99","+4.2%"]
    ];

    openWindow(
      "Stocks",

      data.map(stock => `
        <div class="stock">

          <span>
            <b>${stock[0]}</b>
            <br>
            <small>${stock[1]}</small>
          </span>

          <span>
            <b>${stock[2]}</b>
            <br>
            <small
              style="
                color:
                ${
                  stock[3].startsWith("-")
                  ? "red"
                  : "green"
                }
              "
            >
              ${stock[3]}
            </small>
          </span>

        </div>
      `).join("")
    );
  }

  /* =========================================================
     MAPS
     ========================================================= */

  function maps(){

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
        12 Pear Street · 5 min away
      </p>

      <button id="route">
        Start Route
      </button>

      <p
        id="routeStatus"
        style="text-align:center;font-weight:bold"
      ></p>
      `
    );

    document.getElementById(
      "route"
    ).onclick = () => {

      document.getElementById(
        "routeStatus"
      ).textContent =
        "Route Started ✓";
    };
  }

  /* =========================================================
     WEATHER
     ========================================================= */

  function weather(){

    simple(
      "Weather",

      `
      <div class="big">

        ☀️

        <br>

        <span style="font-size:38px">
          24°
        </span>

      </div>

      <p style="text-align:center">
        Sunny · Feels like 25°
      </p>
      `
    );
  }

  /* =========================================================
     CLOCK
     ========================================================= */

  function clock(){

    openWindow(
      "Clock",

      `
      <div
        id="clockDisplay"
        class="big"
      >
        --:--:--
      </div>

      <p
        style="
          text-align:center;
          color:#777;
        "
      >
        Local time
      </p>
      `
    );

    function updateClock(){

      const display =
        document.getElementById(
          "clockDisplay"
        );

      if(display){

        display.textContent =
          new Date().toLocaleTimeString(
            [],
            {
              hour:"numeric",
              minute:"2-digit",
              second:"2-digit"
            }
          );
      }
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

  function settings(){

    openWindow(
      "Settings",

      `
      <label
        style="
          display:flex;
          justify-content:space-between;
          padding:10px;
        "
      >
        Dark app

        <input
          id="darkMode"
          type="checkbox"
        >
      </label>

      <br>

      <button id="resetPear">
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

    dark.onchange =
      event => {

        localStorage.setItem(
          "pearDark",
          event.target.checked
            ? "1"
            : "0"
        );
      };

    document.getElementById(
      "resetPear"
    ).onclick = () => {

      localStorage.clear();

      location.reload();
    };
  }

  /* =========================================================
     MUSIC
     ========================================================= */

  function music(){

    openWindow(
      "PearTunes",

      `
      <div class="big">
        ♫
      </div>

      <div class="stock">
        <span>Pearadise</span>
        <button class="playSong">▶</button>
      </div>

      <div class="stock">
        <span>Sunset Drive</span>
        <button class="playSong">▶</button>
      </div>

      <div class="stock">
        <span>Electric Orchard</span>
        <button class="playSong">▶</button>
      </div>

      <p
        id="musicStatus"
        style="
          text-align:center;
          font-weight:bold;
        "
      ></p>
      `
    );

    document
      .querySelectorAll(".playSong")
      .forEach(button => {

        button.onclick = () => {

          document.getElementById(
            "musicStatus"
          ).textContent =
            "♫ Now Playing";
        };
      });
  }

  /* =========================================================
     CUSTOM KEYBOARD
     ========================================================= */

  function buildKeyboard(){

    keyboard.innerHTML = "";

    const rows = [
      "1234567890",
      "QWERTYUIOP",
      "ASDFGHJKL⌫",
      "ZXCVBNM,.↵"
    ];

    rows.forEach(row => {

      [...row].forEach(key => {

        const button =
          document.createElement(
            "button"
          );

        button.textContent = key;

        button.onclick = event => {

          event.preventDefault();

          if(!keyboardTarget){
            return;
          }

          if(key === "⌫"){

            keyboardTarget.value =
              keyboardTarget.value.slice(
                0,
                -1
              );

          }else if(key === "↵"){

            keyboardTarget.dispatchEvent(
              new KeyboardEvent(
                "keydown",
                {
                  key:"Enter",
                  bubbles:true
                }
              )
            );

          }else{

            keyboardTarget.value +=
              key.toLowerCase();
          }

          keyboardTarget.dispatchEvent(
            new Event(
              "input",
              {
                bubbles:true
              }
            )
          );
        };

        keyboard.appendChild(
          button
        );
      });
    });

    const space =
      document.createElement(
        "button"
      );

    space.textContent =
      "SPACE";

    space.className =
      "space";

    space.onclick = event => {

      event.preventDefault();

      if(keyboardTarget){

        keyboardTarget.value +=
          " ";

        keyboardTarget.dispatchEvent(
          new Event(
            "input",
            {
              bubbles:true
            }
          )
        );
      }
    };

    const done =
      document.createElement(
        "button"
      );

    done.textContent =
      "DONE";

    done.className =
      "wide";

    done.onclick = () => {

      keyboard.classList.remove(
        "show"
      );

      keyboardTarget = null;
    };

    keyboard.appendChild(space);
    keyboard.appendChild(done);
  }

  /* =========================================================
     SHOW KEYBOARD WHEN TEXT FIELD IS FOCUSED
     ========================================================= */

  app.addEventListener(
    "focusin",
    event => {

      const element =
        event.target;

      if(
        element.matches(
          "input:not([type=file]), textarea"
        )
      ){

        keyboardTarget =
          element;

        keyboard.classList.add(
          "show"
        );
      }
    }
  );

  /* =========================================================
     APP CLICK ROUTING
     ========================================================= */

  phone.addEventListener(
    "click",
    event => {

      const target =
        event.target.closest(
          "[data-app]"
        );

      if(!target){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      launch(
        target.dataset.app
      );
    }
  );

  /* =========================================================
     HOME BUTTON
     ========================================================= */

  document.getElementById(
    "home"
  ).onclick = event => {

    event.preventDefault();
    event.stopPropagation();

    phone.classList.remove(
      "page-two"
    );

    phone.classList.add(
      "page-one"
    );

    closeApp();
  };

  /* =========================================================
     PAGE SWITCHING
     UP = PAGE 2
     DOWN = PAGE 1
     ========================================================= */

  function showPage(number){

    closeApp();

    if(number === 2){

      phone.classList.remove(
        "page-one"
      );

      phone.classList.add(
        "page-two"
      );

    }else{

      phone.classList.remove(
        "page-two"
      );

      phone.classList.add(
        "page-one"
      );
    }

    flash.classList.remove("go");

    void flash.offsetWidth;

    flash.classList.add("go");
  }

  /* =========================================================
     TOUCH SWIPE
     ========================================================= */

  phone.addEventListener(
    "touchstart",
    event => {

      if(
        overlay.classList.contains(
          "open"
        )
      ){
        return;
      }

      startY =
        event.touches[0].clientY;

    },
    {
      passive:true
    }
  );

  phone.addEventListener(
    "touchend",
    event => {

      if(startY === null){
        return;
      }

      const endY =
        event.changedTouches[0].clientY;

      const distance =
        endY - startY;

      startY = null;

      if(
        Math.abs(distance) < 45
      ){
        return;
      }

      /*
        SWIPE UP = PAGE 2
        SWIPE DOWN = PAGE 1
      */

      if(distance < 0){

        showPage(2);

      }else{

        showPage(1);
      }

    },
    {
      passive:true
    }
  );

  /* =========================================================
     MOUSE / TRACKPAD DRAG
     ========================================================= */

  phone.addEventListener(
    "mousedown",
    event => {

      if(
        overlay.classList.contains(
          "open"
        )
      ){
        return;
      }

      mouseStartY =
        event.clientY;
    }
  );

  phone.addEventListener(
    "mouseup",
    event => {

      if(mouseStartY === null){
        return;
      }

      const distance =
        event.clientY -
        mouseStartY;

      mouseStartY = null;

      if(
        Math.abs(distance) < 45
      ){
        return;
      }

      if(distance < 0){

        showPage(2);

      }else{

        showPage(1);
      }
    }
  );

  /* =========================================================
     KEYBOARD CONTROLS
     ========================================================= */

  window.addEventListener(
    "keydown",
    event => {

      if(event.key === "ArrowUp"){

        event.preventDefault();

        showPage(2);
      }

      if(event.key === "ArrowDown"){

        event.preventDefault();

        showPage(1);
      }

      if(event.key === "Escape"){

        closeApp();
      }
    }
  );

  /* =========================================================
     CLOSE APP WHEN CLICKING OUTSIDE WINDOW
     ========================================================= */

  overlay.addEventListener(
    "click",
    event => {

      if(
        event.target === overlay
      ){

        closeApp();
      }
    }
  );

  /* =========================================================
     INITIALIZE
     ========================================================= */

  buildKeyboard();

  showPage(1);

})();
