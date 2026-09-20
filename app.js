document.addEventListener("DOMContentLoaded", () => {

const phone = document.getElementById("phone-container");
const overlay = document.getElementById("overlay");
const appWindow = document.getElementById("app-window");

let activeKeyboardField = null;
let keyboardShift = false;


/* =========================================================
   ESCAPE HTML
========================================================= */

function esc(value){

  return String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[char])
  );

}


/* =========================================================
   CLOSE APP
========================================================= */

function closeApp(){

  const video = appWindow.querySelector("video");

  if(video && video.srcObject){

    video.srcObject
      .getTracks()
      .forEach(track => track.stop());

  }

  hidePearKeyboard();

  overlay.classList.remove("open");

  appWindow.innerHTML = "";

}


/* =========================================================
   OPEN APP
========================================================= */

function openApp(title, html){

  hidePearKeyboard();

  appWindow.innerHTML = `

    <div class="window-header">

      <button
        class="back"
        id="app-back">
        ‹
      </button>

      <span>${esc(title)}</span>

    </div>

    <div class="window-body">

      ${html}

    </div>

  `;

  overlay.classList.add("open");

  document
    .getElementById("app-back")
    .onclick = closeApp;

}


/* =========================================================
   PAGE SWITCHING
========================================================= */

let startY = 0;

phone.addEventListener("touchstart", event => {

  if(overlay.classList.contains("open")) return;

  startY = event.touches[0].clientY;

}, {passive:true});


phone.addEventListener("touchend", event => {

  if(overlay.classList.contains("open")) return;

  const endY = event.changedTouches[0].clientY;

  const difference = endY - startY;

  if(Math.abs(difference) < 50) return;

  if(difference < 0){

    phone.classList.add("page-two");

  }else{

    phone.classList.remove("page-two");

  }

}, {passive:true});


document.addEventListener("keydown", event => {

  if(overlay.classList.contains("open")) return;

  if(event.key === "ArrowUp"){

    phone.classList.add("page-two");

  }

  if(event.key === "ArrowDown"){

    phone.classList.remove("page-two");

  }

});


/* =========================================================
   KEYBOARD
   HIDDEN UNTIL TEXT FIELD IS CLICKED
========================================================= */

function showPearKeyboard(input){

  if(!input) return;

  activeKeyboardField = input;

  let keyboard =
    document.getElementById("pear-keyboard");


  if(!keyboard){

    keyboard = document.createElement("div");

    keyboard.id = "pear-keyboard";

    keyboard.innerHTML = `

      <div class="pear-keyboard-row">

        <button data-key="q">Q</button>
        <button data-key="w">W</button>
        <button data-key="e">E</button>
        <button data-key="r">R</button>
        <button data-key="t">T</button>
        <button data-key="y">Y</button>
        <button data-key="u">U</button>
        <button data-key="i">I</button>
        <button data-key="o">O</button>
        <button data-key="p">P</button>

      </div>

      <div class="pear-keyboard-row">

        <button data-key="a">A</button>
        <button data-key="s">S</button>
        <button data-key="d">D</button>
        <button data-key="f">F</button>
        <button data-key="g">G</button>
        <button data-key="h">H</button>
        <button data-key="j">J</button>
        <button data-key="k">K</button>
        <button data-key="l">L</button>

      </div>

      <div class="pear-keyboard-row">

        <button data-key="z">Z</button>
        <button data-key="x">X</button>
        <button data-key="c">C</button>
        <button data-key="v">V</button>
        <button data-key="b">B</button>
        <button data-key="n">N</button>
        <button data-key="m">M</button>

      </div>

      <div class="pear-keyboard-row bottom">

        <button id="keyboard-shift">
          ⇧
        </button>

        <button id="keyboard-space">
          SPACE
        </button>

        <button id="keyboard-backspace">
          ⌫
        </button>

      </div>

    `;

    overlay.appendChild(keyboard);


    keyboard
      .querySelectorAll("[data-key]")
      .forEach(button => {

        button.addEventListener("pointerdown", event => {

          event.preventDefault();

          typeKeyboardCharacter(
            button.dataset.key
          );

        });

      });


    document
      .getElementById("keyboard-space")
      .addEventListener("pointerdown", event => {

        event.preventDefault();

        typeKeyboardCharacter(" ");

      });


    document
      .getElementById("keyboard-backspace")
      .addEventListener("pointerdown", event => {

        event.preventDefault();

        backspaceKeyboard();

      });


    document
      .getElementById("keyboard-shift")
      .addEventListener("pointerdown", event => {

        event.preventDefault();

        keyboardShift = !keyboardShift;

      });

  }


  keyboard.style.display = "block";


  requestAnimationFrame(() => {

    keyboard.classList.add(
      "keyboard-show"
    );

  });

}


/* =========================================================
   TYPE CHARACTER
========================================================= */

function typeKeyboardCharacter(character){

  const input = activeKeyboardField;

  if(!input) return;

  const start =
    input.selectionStart ?? input.value.length;

  const end =
    input.selectionEnd ?? input.value.length;


  let text = character;


  if(character !== " "){

    text = keyboardShift
      ? character.toUpperCase()
      : character.toLowerCase();

  }


  input.value =
    input.value.substring(0,start) +
    text +
    input.value.substring(end);


  input.selectionStart =
    input.selectionEnd =
    start + text.length;


  input.dispatchEvent(
    new Event("input", {
      bubbles:true
    })
  );


  if(keyboardShift){

    keyboardShift = false;

  }

}


/* =========================================================
   BACKSPACE
========================================================= */

function backspaceKeyboard(){

  const input = activeKeyboardField;

  if(!input) return;


  const start =
    input.selectionStart ?? input.value.length;

  const end =
    input.selectionEnd ?? input.value.length;


  if(start !== end){

    input.value =
      input.value.substring(0,start) +
      input.value.substring(end);

    input.selectionStart =
      input.selectionEnd =
      start;

  }

  else if(start > 0){

    input.value =
      input.value.substring(0,start - 1) +
      input.value.substring(end);

    input.selectionStart =
      input.selectionEnd =
      start - 1;

  }


  input.dispatchEvent(
    new Event("input", {
      bubbles:true
    })
  );

}


/* =========================================================
   HIDE KEYBOARD
========================================================= */

function hidePearKeyboard(){

  activeKeyboardField = null;

  const keyboard =
    document.getElementById("pear-keyboard");

  if(!keyboard) return;


  keyboard.classList.remove(
    "keyboard-show"
  );


  setTimeout(() => {

    if(!activeKeyboardField){

      keyboard.style.display = "none";

    }

  },300);

}


/* =========================================================
   ONLY SHOW KEYBOARD WHEN INPUT/TEXTAREA IS CLICKED
========================================================= */

appWindow.addEventListener("focusin", event => {

  const element = event.target;

  if(
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA"
  ){

    showPearKeyboard(element);

  }

});


/* =========================================================
   CLICKING OUTSIDE A TEXT FIELD HIDES KEYBOARD
========================================================= */

appWindow.addEventListener("pointerdown", event => {

  const clickedInput =
    event.target.closest(
      "input, textarea, #pear-keyboard"
    );

  if(!clickedInput){

    hidePearKeyboard();

  }

});


/* =========================================================
   MESSAGES
========================================================= */

function messages(){

  const data =
    JSON.parse(
      localStorage.getItem("pearMessages") || "[]"
    );


  openApp(
    "Messages",

    `

    <div class="bubble">
      hey 👋
    </div>

    <div class="bubble">
      welcome to Pear Phone OS 🍐
    </div>

    ${data.map(message => `
      <div class="bubble me">
        ${esc(message)}
      </div>
    `).join("")}

    <div class="row">

      <input
        id="message-input"
        style="flex:1"
        placeholder="iMessage">

      <button
        class="button"
        id="send-message">
        Send
      </button>

    </div>

    `
  );


  document
    .getElementById("send-message")
    .onclick = () => {

      const input =
        document.getElementById("message-input");

      const text =
        input.value.trim();

      if(!text) return;


      data.push(text);

      localStorage.setItem(
        "pearMessages",
        JSON.stringify(data.slice(-50))
      );

      messages();

    };

}


/* =========================================================
   NOTES
========================================================= */

function notes(){

  const data =
    JSON.parse(
      localStorage.getItem("pearNotes") || "[]"
    );


  openApp(
    "Notes",

    `

    ${data.map((note,index) => `

      <div
        class="stock"
        data-note="${index}">

        <div>

          <b>
            ${esc(note.title || "Untitled")}
          </b>

          <br>

          <small>
            ${esc((note.body || "").slice(0,80))}
          </small>

        </div>

      </div>

    `).join("")}


    <input
      id="note-title"
      placeholder="Note title"
      style="width:100%;margin-bottom:7px">


    <textarea
      id="note-body"
      placeholder="Start typing..."></textarea>


    <br><br>


    <button
      class="button"
      id="save-note">

      Save Note

    </button>

    `
  );


  document
    .getElementById("save-note")
    .onclick = () => {

      const title =
        document.getElementById("note-title").value;

      const body =
        document.getElementById("note-body").value;


      data.unshift({
        title:title || "Untitled",
        body
      });


      localStorage.setItem(
        "pearNotes",
        JSON.stringify(data.slice(0,50))
      );


      notes();

    };


  document
    .querySelectorAll("[data-note]")
    .forEach(element => {

      element.onclick = () => {

        const note =
          data[
            Number(element.dataset.note)
          ];


        document.getElementById(
          "note-title"
        ).value = note.title || "";


        document.getElementById(
          "note-body"
        ).value = note.body || "";

      };

    });

}


/* =========================================================
   CAMERA
========================================================= */

async function camera(){

  openApp(
    "Camera",

    `

    <video
      id="camera-video"
      class="camera-video"
      autoplay
      playsinline>
    </video>

    <br>

    <button
      class="button"
      id="camera-start">
      Start Camera
    </button>

    <button
      class="button"
      id="camera-snap">
      Take Photo
    </button>

    <canvas
      id="camera-canvas"
      hidden>
    </canvas>

    <img
      id="camera-photo"
      style="
        display:none;
        width:100%;
        margin-top:10px;
        border-radius:15px;
      ">

    `
  );


  const video =
    document.getElementById("camera-video");

  const canvas =
    document.getElementById("camera-canvas");

  const photo =
    document.getElementById("camera-photo");


  let stream = null;


  document
    .getElementById("camera-start")
    .onclick = async () => {

      try{

        stream =
          await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:false
          });

        video.srcObject = stream;

      }catch{

        alert(
          "Camera permission was denied."
        );

      }

    };


  document
    .getElementById("camera-snap")
    .onclick = () => {

      if(!video.videoWidth){

        alert(
          "Start the camera first."
        );

        return;

      }


      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;


      canvas
        .getContext("2d")
        .drawImage(
          video,
          0,
          0
        );


      const image =
        canvas.toDataURL(
          "image/jpeg",
          .9
        );


      photo.src = image;

      photo.style.display =
        "block";


      const photos =
        JSON.parse(
          localStorage.getItem("pearPhotos") || "[]"
        );


      photos.unshift(image);


      localStorage.setItem(
        "pearPhotos",
        JSON.stringify(
          photos.slice(0,30)
        )
      );

    };

}


/* =========================================================
   PHOTOS
========================================================= */

function photos(){

  const data =
    JSON.parse(
      localStorage.getItem("pearPhotos") || "[]"
    );


  openApp(
    "Photos",

    `

    <input
      id="photo-import"
      type="file"
      accept="image/*"
      multiple>

    <br><br>

    <div class="photos">

      ${
        data.length
        ?
        data.map(image =>
          `<img src="${image}">`
        ).join("")
        :
        "<p>No photos yet.</p>"
      }

    </div>

    `
  );


  document
    .getElementById("photo-import")
    .onchange = event => {

      const files =
        [...event.target.files];


      Promise.all(
        files.map(file =>
          new Promise(resolve => {

            const reader =
              new FileReader();

            reader.onload =
              () => resolve(reader.result);

            reader.readAsDataURL(file);

          })
        )
      ).then(images => {

        localStorage.setItem(
          "pearPhotos",
          JSON.stringify(
            [
              ...images,
              ...data
            ].slice(0,30)
          )
        );

        photos();

      });

    };

}


/* =========================================================
   STOCKS
========================================================= */

function stocks(){

  openApp(
    "Stocks",

    `

    ${[
      ["AAPL","Apple","$229.87","+1.8%"],
      ["MSFT","Microsoft","$532.44","+0.9%"],
      ["TSLA","Tesla","$318.26","-1.2%"],
      ["PEAR","Pear Inc.","$99.99","+4.2%"]
    ].map(stock => `

      <div class="stock">

        <span>

          <b>${stock[0]}</b>

          <br>

          <small>
            ${stock[1]}
          </small>

        </span>

        <span>

          <b>${stock[2]}</b>

          <br>

          <small>
            ${stock[3]}
          </small>

        </span>

      </div>

    `).join("")}

    `
  );

}


/* =========================================================
   MAPS
========================================================= */

function maps(){

  openApp(
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

    <button
      class="button"
      onclick="alert('Route started!')">

      Start Route

    </button>

    `
  );

}


/* =========================================================
   WEATHER
========================================================= */

function weather(){

  openApp(
    "Weather",

    `

    <div
      style="
        text-align:center;
        padding:20px;
      ">

      <div style="font-size:65px">
        ☀️
      </div>

      <div
        style="
          font-size:55px;
          font-weight:900;
        ">

        24°

      </div>

      <h3>
        Sunny
      </h3>

      <p>
        Feels like 25°
      </p>

    </div>

    `
  );

}


/* =========================================================
   CLOCK
========================================================= */

function clock(){

  openApp(
    "Clock",

    `

    <div
      id="big-clock"
      style="
        font-size:42px;
        text-align:center;
        font-weight:900;
        padding:35px 0;
      ">

    </div>

    `
  );


  const update = () => {

    const element =
      document.getElementById("big-clock");

    if(element){

      element.textContent =
        new Date().toLocaleTimeString(
          [],
          {
            hour:"numeric",
            minute:"2-digit",
            second:"2-digit"
          }
        );

    }

  };


  update();

  const timer =
    setInterval(update,1000);

  setTimeout(
    () => clearInterval(timer),
    3600000
  );

}


/* =========================================================
   PEARTUNES
========================================================= */

function peartunes(){

  openApp(
    "PearTunes",

    `

    <div
      style="
        text-align:center;
        padding:10px;
      ">

      <div
        style="
          font-size:65px;
          color:#df42b6;
        ">

        ♫

      </div>

      <h2>
        PearTunes
      </h2>

    </div>


    <div class="stock">

      Pearadise

      <button
        class="button"
        onclick="alert('Playing Pearadise')">

        ▶

      </button>

    </div>


    <div class="stock">

      Sunset Drive

      <button
        class="button"
        onclick="alert('Playing Sunset Drive')">

        ▶

      </button>

    </div>


    <div class="stock">

      Electric Orchard

      <button
        class="button"
        onclick="alert('Playing Electric Orchard')">

        ▶

      </button>

    </div>

    `
  );

}


/* =========================================================
   SETTINGS
========================================================= */

function settings(){

  openApp(
    "Settings",

    `

    <h3>
      Pear Phone Settings
    </h3>

    <button
      class="button"
      id="display-button">

      Toggle Display

    </button>

    <br><br>

    <button
      class="button"
      id="reset-button">

      Reset Pear OS

    </button>

    `
  );


  document
    .getElementById("display-button")
    .onclick = () => {

      document.body.style.filter =
        document.body.style.filter
        ? ""
        : "brightness(.82)";

    };


  document
    .getElementById("reset-button")
    .onclick = () => {

      localStorage.clear();

      location.reload();

    };

}


/* =========================================================
   PHONE
========================================================= */

function phoneApp(){

  openApp(
    "Phone",

    `

    <div
      style="
        text-align:center;
        padding:25px;
      ">

      <div style="font-size:65px">
        ☎
      </div>

      <h2>
        Phone
      </h2>

      <p>
        Pear Phone calling
      </p>

      <input
        id="phone-number"
        placeholder="Enter number"
        style="width:100%;">

      <br><br>

      <button
        class="button"
        onclick="alert('Calling...')">

        Call

      </button>

    </div>

    `
  );

}


/* =========================================================
   MAIL
========================================================= */

function mail(){

  openApp(
    "Mail",

    `

    <h3>
      Inbox
    </h3>

    <div class="stock">

      <div>

        <b>
          Welcome to Pear OS
        </b>

        <br>

        <small>
          Pear Team
        </small>

      </div>

    </div>

    `
  );

}


/* =========================================================
   COMPASS
========================================================= */

function compass(){

  openApp(
    "Compass",

    `

    <div
      style="
        text-align:center;
        padding:25px;
      ">

      <div style="font-size:85px">
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


/* =========================================================
   VIDEOS
========================================================= */

function videos(){

  openApp(
    "Videos",

    `

    <div
      style="
        text-align:center;
        padding:25px;
      ">

      <div style="font-size:65px">
        🎬
      </div>

      <h2>
        Videos
      </h2>

      <p>
        No videos yet.
      </p>

    </div>

    `
  );

}


/* =========================================================
   SPLASHFACE
========================================================= */

function splashface(){

  openApp(
    "SplashFace",

    `

    <div
      style="
        text-align:center;
        padding:25px;
      ">

      <div
        style="
          font-size:60px;
          font-weight:900;
          color:#3f73be;
        ">

        Sf

      </div>

      <h2>
        SplashFace
      </h2>

      <p>
        Welcome back!
      </p>

    </div>

    `
  );

}


/* =========================================================
   TUMPS / THUMBS UP TYPING GAME
========================================================= */

let typingTimer = null;
let typingStart = 0;

const typingSentences = [

  "The quick brown fox jumps over the lazy dog.",

  "Pear Phone OS is ready for another adventure.",

  "I can type really fast when I concentrate.",

  "The best ideas sometimes start with a tiny screen.",

  "Welcome to the coolest phone in the world.",

  "Today is going to be a great day.",

  "The Raspberry Pi is running Pear Phone OS.",

  "Never underestimate a tiny touchscreen computer.",

  "I wonder what secret apps are hiding here.",

  "Everything is better with a little bit of fun."

];


function tumsApp(){

  const sentence =
    typingSentences[
      Math.floor(
        Math.random() *
        typingSentences.length
      )
    ];


  openApp(
    "Thumbs Up",

    `

    <div
      style="
        text-align:center;
        padding:5px;
      ">

      <div style="font-size:50px">
        👍
      </div>

      <h3>
        Typing Challenge
      </h3>

      <p>
        Type the sentence as fast as you can.
      </p>

    </div>


    <div
      style="
        background:#fff;
        border:1px solid #ddd;
        border-radius:12px;
        padding:12px;
        line-height:1.4;
      ">

      ${esc(sentence)}

    </div>


    <br>


    <input
      id="typing-input"
      placeholder="Tap here to start typing..."
      style="width:100%;"
      disabled>


    <br><br>


    <button
      class="button"
      id="typing-start">

      GO!

    </button>


    <p id="typing-time">
      Time: 0.00s
    </p>

    <p id="typing-result"></p>

    `
  );


  document
    .getElementById("typing-start")
    .onclick = () => {

      const input =
        document.getElementById(
          "typing-input"
        );


      input.disabled = false;

      input.value = "";

      input.focus();

      typingStart = Date.now();


      clearInterval(typingTimer);


      typingTimer =
        setInterval(() => {

          const time =
            (
              Date.now() -
              typingStart
            ) / 1000;


          const display =
            document.getElementById(
              "typing-time"
            );


          if(display){

            display.textContent =
              `Time: ${time.toFixed(2)}s`;

          }

        },50);


      showPearKeyboard(input);

    };


  document
    .getElementById("typing-input")
    .addEventListener("input", event => {

      if(event.target.value === sentence){

        clearInterval(typingTimer);

        const time =
          (
            Date.now() -
            typingStart
          ) / 1000;


        document.getElementById(
          "typing-result"
        ).innerHTML =
          `🎉 Finished in <b>${time.toFixed(2)} seconds!</b>`;

        hidePearKeyboard();

      }

    });

}


/* =========================================================
   PAGE 2 APPS
========================================================= */

function lingoApp(){

  openApp(
    "Lingo",

    `

    <h2>
      Lingo
    </h2>

    <p>
      Guess the word!
    </p>

    <input
      id="lingo-input"
      placeholder="Type your guess"
      style="width:100%;">

    <br><br>

    <button
      class="button"
      onclick="alert('Nice guess!')">

      Guess

    </button>

    `
  );

}


function danwarpApp(){

  openApp(
    "DanWarp",

    `

    <div
      style="
        text-align:center;
        padding:20px;
      ">

      <div style="font-size:60px">
        🌀
      </div>

      <h2>
        DanWarp
      </h2>

      <p>
        Warp mode activated.
      </p>

      <button
        class="button"
        onclick="alert('WARP!')">

        WARP

      </button>

    </div>

    `
  );

}


function imageApp(){

  openApp(
    "Image",

    `

    <h3>
      Image Studio
    </h3>

    <input
      id="image-input"
      type="file"
      accept="image/*">

    <br><br>

    <img
      id="image-preview"
      style="
        display:none;
        width:100%;
        border-radius:12px;
      ">

    `
  );


  document
    .getElementById("image-input")
    .onchange = event => {

      const file =
        event.target.files[0];

      if(!file) return;


      const reader =
        new FileReader();


      reader.onload = () => {

        const preview =
          document.getElementById(
            "image-preview"
          );


        preview.src =
          reader.result;

        preview.style.display =
          "block";

      };


      reader.readAsDataURL(file);

    };

}


function chronoApp(){

  openApp(
    "Chrono",

    `

    <div
      style="
        text-align:center;
        padding:20px;
      ">

      <div
        id="chrono-time"
        style="
          font-size:48px;
          font-weight:900;
        ">

        00:00

      </div>

      <br>

      <button
        class="button"
        id="chrono-start">

        Start

      </button>

    </div>

    `
  );


  let seconds = 0;
  let timer = null;


  document
    .getElementById("chrono-start")
    .onclick = () => {

      if(timer) return;


      timer =
        setInterval(() => {

          seconds++;


          const minutes =
            Math.floor(
              seconds / 60
            );


          const secs =
            seconds % 60;


          document
            .getElementById("chrono-time")
            .textContent =
            `${String(minutes).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;

        },1000);

    };

}


function zaplookApp(){

  openApp(
    "ZapLook",

    `

    <div
      style="
        text-align:center;
        padding:20px;
      ">

      <div style="font-size:65px">
        ⚡
      </div>

      <h2>
        ZapLook
      </h2>

      <p>
        Search something instantly.
      </p>

      <input
        id="zap-input"
        placeholder="Search..."
        style="width:100%;">

    </div>

    `
  );

}


function monkeyApp(){

  let score = 0;


  openApp(
    "Monkey",

    `

    <div
      style="
        text-align:center;
        padding:15px;
      ">

      <div style="font-size:75px">
        🐒
      </div>

      <h2>
        Catch the Monkey!
      </h2>

      <p>
        Score: <span id="monkey-score">0</span>
      </p>

      <button
        class="button"
        id="monkey-button">

        🐒 TAP ME

      </button>

    </div>

    `
  );


  document
    .getElementById("monkey-button")
    .onclick = () => {

      score++;

      document.getElementById(
        "monkey-score"
      ).textContent = score;

    };

}


function remarkApp(){

  openApp(
    "Remark",

    `

    <h3>
      Remark
    </h3>

    <textarea
      id="remark-input"
      placeholder="Write something..."></textarea>

    <br><br>

    <button
      class="button"
      onclick="alert('Saved!')">

      Save

    </button>

    `
  );

}


/* =========================================================
   APP ROUTER
   ONE ICON = ONE APP
========================================================= */

const appRoutes = {

  messages:messages,

  camera:camera,

  splashface:splashface,

  stocks:stocks,

  maps:maps,

  photos:photos,

  weather:weather,

  notes:notes,

  peartunes:peartunes,

  settings:settings,

  clock:clock,

  videos:videos,

  phone:phoneApp,

  mail:mail,

  compass:compass,

  music:peartunes,


  /* PAGE 2 */

  "p2-lingo":lingoApp,

  "p2-splash":splashface,

  "p2-thumb":tumsApp,

  "p2-danwarp":danwarpApp,

  "p2-image":imageApp,

  "p2-chrono":chronoApp,

  "p2-zaplook":zaplookApp,

  "p2-weather":weather,

  "p2-music":peartunes,

  "p2-monkey":monkeyApp,

  "p2-remark":remarkApp,

  "p2-settings":settings,

  "p2-phone":phoneApp,

  "p2-mail":mail,

  "p2-compass":compass,

  "p2-music2":peartunes

};


/* =========================================================
   CONNECT EACH ICON ONCE
========================================================= */

Object.keys(appRoutes).forEach(id => {

  const element =
    document.getElementById(id);

  if(!element) return;


  element.onclick = event => {

    event.preventDefault();

    event.stopPropagation();

    appRoutes[id]();

  };

});


/* =========================================================
   HOME
========================================================= */

document
  .getElementById("home")
  .onclick = event => {

    event.preventDefault();

    event.stopPropagation();

    closeApp();

  };


/* =========================================================
   CLOSE WHEN CLICKING OUTSIDE APP
========================================================= */

overlay.addEventListener(
  "click",
  event => {

    if(event.target === overlay){

      closeApp();

    }

  }
);

});
