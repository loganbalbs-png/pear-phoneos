document.addEventListener("DOMContentLoaded", () => {

    const overlay =
        document.getElementById("overlay");

    const appWindow =
        document.getElementById("app-window");


    /* ==========================================
       WINDOW SYSTEM
       ========================================== */

    function openApp(title, content) {

        appWindow.innerHTML = `

            <div class="window-header">

                <button
                    class="back"
                    id="back">
                    ‹
                </button>

                <span>
                    ${title}
                </span>

            </div>

            <div class="window-body">

                ${content}

            </div>

        `;

        overlay.classList.add("open");

        document
            .getElementById("back")
            .onclick = closeApp;
    }


    function closeApp() {

        const video =
            appWindow.querySelector("video");

        if (
            video &&
            video.srcObject
        ) {

            video.srcObject
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );
        }

        overlay.classList.remove("open");

        appWindow.innerHTML = "";
    }


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeApp();

            }

        }
    );


    /* ==========================================
       MESSAGES
       ========================================== */

    document
        .getElementById("messages")
        .onclick = () => {

            const messages =
                JSON.parse(
                    localStorage.getItem(
                        "pearMessages"
                    ) || "[]"
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

                <div class="bubble">
                    this is the classic Pear Phone interface.
                </div>

                ${
                    messages
                        .map(
                            message => `

                                <div class="bubble me">
                                    ${escapeHTML(message)}
                                </div>

                            `
                        )
                        .join("")
                }

                <div
                    class="row"
                    style="margin-top:12px">

                    <input
                        id="messageInput"
                        placeholder="iMessage"
                        style="flex:1">

                    <button
                        class="button"
                        id="send">
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
                .getElementById("send")
                .onclick = () => {

                    const value =
                        input.value.trim();

                    if (!value)
                        return;


                    messages.push(value);


                    localStorage.setItem(
                        "pearMessages",
                        JSON.stringify(
                            messages.slice(-50)
                        )
                    );


                    document
                        .getElementById(
                            "messages"
                        )
                        .click();

                };

        };


    /* ==========================================
       CAMERA
       ========================================== */

    document
        .getElementById("camera")
        .onclick = () => {

            openApp(
                "Camera",

                `

                <video
                    id="cameraVideo"
                    class="camera-video"
                    autoplay
                    playsinline>
                </video>

                <br>

                <button
                    class="button"
                    id="startCamera">
                    Start Camera
                </button>

                <button
                    class="button"
                    id="takePhoto">
                    Take Photo
                </button>

                <canvas
                    id="canvas"
                    style="display:none">
                </canvas>

                <img
                    id="captured"
                    style="
                        display:none;
                        width:100%;
                        margin-top:10px;
                        border-radius:18px;
                    ">

                `
            );


            const video =
                document.getElementById(
                    "cameraVideo"
                );


            document
                .getElementById(
                    "startCamera"
                )
                .onclick = async () => {

                    try {

                        const stream =
                            await navigator
                                .mediaDevices
                                .getUserMedia({
                                    video: {
                                        facingMode:
                                            "environment"
                                    },

                                    audio:false
                                });


                        video.srcObject =
                            stream;

                    }

                    catch(error) {

                        alert(
                            "Camera permission was denied. Allow camera access in Safari."
                        );

                    }

                };


            document
                .getElementById(
                    "takePhoto"
                )
                .onclick = () => {

                    if (
                        !video.videoWidth
                    ) {

                        alert(
                            "Start the camera first."
                        );

                        return;
                    }


                    const canvas =
                        document.getElementById(
                            "canvas"
                        );


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


                    const captured =
                        document.getElementById(
                            "captured"
                        );


                    captured.src =
                        image;

                    captured.style.display =
                        "block";


                    const photos =
                        JSON.parse(
                            localStorage.getItem(
                                "pearPhotos"
                            ) || "[]"
                        );


                    photos.unshift(image);


                    localStorage.setItem(
                        "pearPhotos",
                        JSON.stringify(
                            photos.slice(
                                0,
                                30
                            )
                        )
                    );

                };

        };


    /* ==========================================
       PHOTOS
       ========================================== */

    document
        .getElementById("photos")
        .onclick = () => {

            const photos =
                JSON.parse(
                    localStorage.getItem(
                        "pearPhotos"
                    ) || "[]"
                );


            openApp(
                "Photos",

                `

                <input
                    type="file"
                    id="import"
                    accept="image/*"
                    multiple>

                <br><br>

                <div class="photos">

                    ${
                        photos.length

                        ?

                        photos
                            .map(
                                image =>
                                    `<img src="${image}">`
                            )
                            .join("")

                        :

                        `
                        <p>
                            No photos yet.
                        </p>
                        `
                    }

                </div>

                `
            );


            document
                .getElementById("import")
                .onchange = event => {

                    const files =
                        Array.from(
                            event.target.files
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

                    ).then(images => {

                        localStorage.setItem(
                            "pearPhotos",
                            JSON.stringify(
                                [
                                    ...images,
                                    ...photos
                                ].slice(
                                    0,
                                    30
                                )
                            )
                        );


                        document
                            .getElementById(
                                "photos"
                            )
                            .click();

                    });

                };

        };


    /* ==========================================
       NOTES
       ========================================== */

    document
        .getElementById("notes")
        .onclick = () => {

            openApp(
                "Notes",

                `

                <input
                    id="noteTitle"
                    placeholder="Note title">

                <br><br>

                <textarea
                    id="noteBody"
                    placeholder="Start typing...">
                </textarea>

                <br><br>

                <button
                    class="button"
                    id="saveNote">
                    Save Note
                </button>

                `
            );


            document
                .getElementById(
                    "saveNote"
                )
                .onclick = () => {

                    const title =
                        document
                            .getElementById(
                                "noteTitle"
                            )
                            .value;


                    const body =
                        document
                            .getElementById(
                                "noteBody"
                            )
                            .value;


                    localStorage.setItem(
                        "pearLastNote",
                        JSON.stringify({
                            title,
                            body
                        })
                    );


                    alert(
                        "Note saved 🍐"
                    );

                };

        };


    /* ==========================================
       STOCKS
       ========================================== */

    document
        .getElementById("stocks")
        .onclick = () => {

            openApp(
                "Stocks",

                `

                <div class="stock">

                    <span>
                        <b>AAPL</b>
                        <br>
                        Apple
                    </span>

                    <span>
                        $229.87
                        <br>

                        <small style="color:green">
                            +1.8%
                        </small>
                    </span>

                </div>


                <div class="stock">

                    <span>
                        <b>MSFT</b>
                        <br>
                        Microsoft
                    </span>

                    <span>
                        $532.44
                        <br>

                        <small style="color:green">
                            +0.9%
                        </small>
                    </span>

                </div>


                <div class="stock">

                    <span>
                        <b>TSLA</b>
                        <br>
                        Tesla
                    </span>

                    <span>
                        $318.26
                        <br>

                        <small style="color:red">
                            -1.2%
                        </small>
                    </span>

                </div>


                <div class="stock">

                    <span>
                        <b>PEAR</b>
                        <br>
                        Pear Inc.
                    </span>

                    <span>
                        $99.99
                        <br>

                        <small style="color:green">
                            +4.2%
                        </small>
                    </span>

                </div>

                `
            );

        };


    /* ==========================================
       MAPS
       ========================================== */

    document
        .getElementById("maps")
        .onclick = () => {

            openApp(
                "Maps",

                `

                <div style="
                    height:250px;

                    border-radius:20px;

                    background:
                        linear-gradient(
                            135deg,
                            #d6e5c7,
                            #e9dfb9
                        );

                    display:flex;
                    justify-content:center;
                    align-items:center;

                    font-size:65px;
                ">

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
                    onclick="
                        alert('Route started!')
                    ">
                    Start Route
                </button>

                `
            );

        };


    /* ==========================================
       WEATHER
       ========================================== */

    document
        .getElementById("weather")
        .onclick = () => {

            openApp(
                "Weather",

                `

                <div style="
                    text-align:center;
                    padding:25px;
                ">

                    <div style="
                        font-size:72px;
                    ">
                        ☀️
                    </div>


                    <div style="
                        font-size:60px;
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


                    <p style="color:#777">
                        Today: 18° — 27°
                    </p>

                </div>

                `
            );

        };


    /* ==========================================
       CLOCK
       ========================================== */

    document
        .getElementById("clock")
        .onclick = () => {

            openApp(
                "Clock",

                `

                <div
                    id="bigClock"
                    style="
                        font-size:55px;
                        text-align:center;
                        font-weight:900;
                        padding:35px 0;
                    ">
                </div>

                `
            );


            function updateClock(){

                const clock =
                    document.getElementById(
                        "bigClock"
                    );


                if(!clock)
                    return;


                clock.textContent =
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


            setInterval(
                updateClock,
                1000
            );

        };


    /* ==========================================
       SETTINGS
       ========================================== */

    document
        .getElementById("settings")
        .onclick = () => {

            openApp(
                "Settings",

                `

                <button
                    class="button"
                    id="darkMode">
                    Toggle Display
                </button>

                <br><br>

                <button
                    class="button"
                    id="reset">
                    Reset Pear OS
                </button>

                `
            );


            document
                .getElementById(
                    "darkMode"
                )
                .onclick = () => {

                    document.body.style.filter =
                        document.body.style.filter
                            ?
                            ""
                            :
                            "brightness(.8)";
                };


            document
                .getElementById("reset")
                .onclick = () => {

                    localStorage.clear();

                    location.reload();

                };

        };


    /* ==========================================
       SPLASHFACE
       ========================================== */

    document
        .getElementById("splashface")
        .onclick = () => {

            openApp(
                "SplashFace",

                `

                <div style="
                    text-align:center;
                    padding:35px;
                ">

                    <div style="
                        font-size:65px;
                        font-weight:900;
                        color:#3e73bb;
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

        };


    /* ==========================================
       PEARTUNES / MUSIC
       ========================================== */

    function openMusic(){

        openApp(
            "PearTunes",

            `

            <div style="
                text-align:center;
                padding:15px;
            ">

                <div style="
                    font-size:75px;
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
                    onclick="
                        alert('Playing Pearadise')
                    ">
                    ▶
                </button>

            </div>


            <div class="stock">

                Sunset Drive

                <button
                    class="button"
                    onclick="
                        alert('Playing Sunset Drive')
                    ">
                    ▶
                </button>

            </div>


            <div class="stock">

                Electric Orchard

                <button
                    class="button"
                    onclick="
                        alert('Playing Electric Orchard')
                    ">
                    ▶
                </button>

            </div>

            `
        );
    }


    document
        .getElementById("peartunes")
        .onclick = openMusic;


    document
        .getElementById("music")
        .onclick = openMusic;


    /* ==========================================
       PHONE
       ========================================== */

    document
        .getElementById("phone")
        .onclick = () => {

            openApp(
                "Phone",

                `

                <div style="
                    text-align:center;
                    padding:30px;
                ">

                    <div style="
                        font-size:70px;
                    ">
                        ☎
                    </div>

                    <h2>
                        Phone
                    </h2>

                    <p>
                        Phone calling is not connected
                        in this web demo.
                    </p>

                </div>

                `
            );

        };


    /* ==========================================
       MAIL
       ========================================== */

    document
        .getElementById("mail")
        .onclick = () => {

            openApp(
                "Mail",

                `

                <h2>
                    Inbox
                </h2>


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

        };


    /* ==========================================
       COMPASS
       ========================================== */

    document
        .getElementById("compass")
        .onclick = () => {

            openApp(
                "Compass",

                `

                <div style="
                    text-align:center;
                    padding:35px;
                ">

                    <div style="
                        font-size:100px;
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

        };


    /* ==========================================
       VIDEOS
       ========================================== */

    document
        .getElementById("videos")
        .onclick = () => {

            openApp(
                "Videos",

                `

                <div style="
                    text-align:center;
                    padding:35px;
                ">

                    <div style="
                        font-size:75px;
                    ">
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

        };


    /* ==========================================
       HOME BUTTON
       ========================================== */

    document
        .getElementById("home")
        .onclick =
        closeApp;


    /* ==========================================
       ESCAPE HTML
       ========================================== */

    function escapeHTML(value){

        return String(value)
            .replace(
                /[&<>"']/g,
                character => ({
                    "&":"&amp;",
                    "<":"&lt;",
                    ">":"&gt;",
                    '"':"&quot;",
                    "'":"&#039;"
                }[character])
            );
    }

});
