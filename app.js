document.addEventListener("DOMContentLoaded", () => {

    const overlay =
        document.getElementById("overlay");

    const windowBox =
        document.getElementById("window");


    /* =====================================
       OPEN APP WINDOW
       ===================================== */

    function openApp(title, content) {

        windowBox.innerHTML = `

            <div class="header">

                <button
                    class="back"
                    id="back">
                    ‹
                </button>

                <span>
                    ${title}
                </span>

            </div>

            <div class="content">

                ${content}

            </div>

        `;

        overlay.classList.add("open");


        document
            .getElementById("back")
            .onclick =
            closeApp;
    }


    /* =====================================
       CLOSE APP
       ===================================== */

    function closeApp() {

        const video =
            windowBox.querySelector("video");

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

        windowBox.innerHTML = "";
    }


    /* =====================================
       MESSAGES
       ===================================== */

    document
        .getElementById("messages")
        .onclick = () => {

            let messages =
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
                    style="
                    display:flex;
                    gap:7px;
                    margin-top:12px;
                    ">

                    <input
                        id="messageInput"
                        placeholder="iMessage"
                        style="flex:1">

                    <button
                        class="button"
                        id="sendMessage">
                        Send
                    </button>

                </div>

                `
            );


            document
                .getElementById(
                    "sendMessage"
                )
                .onclick = () => {

                    const input =
                        document.getElementById(
                            "messageInput"
                        );


                    if(
                        !input.value.trim()
                    )
                        return;


                    messages.push(
                        input.value.trim()
                    );


                    localStorage.setItem(
                        "pearMessages",
                        JSON.stringify(
                            messages
                        )
                    );


                    document
                        .getElementById(
                            "messages"
                        )
                        .click();

                };

        };


    /* =====================================
       CAMERA
       ===================================== */

    document
        .getElementById("camera")
        .onclick = () => {

            openApp(
                "Camera",

                `

                <video
                    id="cameraVideo"
                    class="camera-video"
                    style="
                    width:100%;
                    border-radius:18px;
                    background:#000;
                    "
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
                .onclick =
                async () => {

                    try {

                        const stream =
                            await navigator
                                .mediaDevices
                                .getUserMedia({
                                    video:true,
                                    audio:false
                                });


                        video.srcObject =
                            stream;

                    }
                    catch {

                        alert(
                            "Camera access was denied."
                        );

                    }

                };


            document
                .getElementById(
                    "takePhoto"
                )
                .onclick =
                () => {

                    if(
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
                            "image/jpeg"
                        );


                    document
                        .getElementById(
                            "captured"
                        )
                        .src = image;


                    document
                        .getElementById(
                            "captured"
                        )
                        .style.display =
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


    /* =====================================
       PHOTOS
       ===================================== */

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
                    id="photoInput"
                    accept="image/*"
                    multiple>

                <br><br>

                <div class="photo-grid">

                    ${
                        photos.length

                        ?

                        photos
                            .map(
                                photo =>
                                    `<img src="${photo}">`
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
                .getElementById(
                    "photoInput"
                )
                .onchange =
                event => {

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
                    )
                    .then(images => {

                        localStorage.setItem(
                            "pearPhotos",
                            JSON.stringify(
                                [
                                    ...images,
                                    ...photos
                                ].slice(0,30)
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


    /* =====================================
       NOTES
       ===================================== */

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
                    placeholder="Write a note...">
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
                        "pearNote",
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


    /* =====================================
       STOCKS
       ===================================== */

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
                        <small
                            style="color:green">
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
                        <small
                            style="color:green">
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
                        <small
                            style="color:red">
                            -1.2%
                        </small>
                    </span>

                </div>

                `
            );

        };


    /* =====================================
       MAPS
       ===================================== */

    document
        .getElementById("maps")
        .onclick = () => {

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
                    onclick="
                        alert('Route started!')
                    ">
                    Start Route
                </button>

                `
            );

        };


    /* =====================================
       WEATHER
       ===================================== */

    document
        .getElementById("weather")
        .onclick = () => {

            openApp(
                "Weather",

                `

                <div
                    style="
                    text-align:center;
                    padding:25px;
                    ">

                    <div
                        style="
                        font-size:75px">
                        ☀️
                    </div>

                    <div
                        style="
                        font-size:60px;
                        font-weight:bold">
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

        };


    /* =====================================
       CLOCK
       ===================================== */

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
                    padding:30px;
                    font-weight:bold;
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


    /* =====================================
       SETTINGS
       ===================================== */

    document
        .getElementById("settings")
        .onclick = () => {

            openApp(
                "Settings",

                `

                <button
                    class="button"
                    onclick="
                        document.body.style.filter =
                        document.body.style.filter
                        ? ''
                        : 'brightness(.8)'
                    ">
                    Toggle Display
                </button>

                <br><br>

                <button
                    class="button"
                    onclick="
                        localStorage.clear();
                        location.reload();
                    ">
                    Reset Pear OS
                </button>

                `
            );

        };


    /* =====================================
       SPLASHFACE
       ===================================== */

    document
        .getElementById("splashface")
        .onclick = () => {

            openApp(
                "SplashFace",

                `

                <div
                    style="
                    text-align:center;
                    padding:35px;
                    ">

                    <div
                        style="
                        font-size:65px;
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

        };


    /* =====================================
       PEARTUNES
       ===================================== */

    function musicApp(){

        openApp(
            "PearTunes",

            `

            <div
                style="
                text-align:center;
                padding:20px;
                ">

                <div
                    style="
                    font-size:70px;
                    color:#df3fb2;
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

            `
        );
    }


    document
        .getElementById("peartunes")
        .onclick =
        musicApp;


    document
        .getElementById("music")
        .onclick =
        musicApp;


    /* =====================================
       PHONE
       ===================================== */

    document
        .getElementById("phone")
        .onclick = () => {

            openApp(
                "Phone",

                `

                <div
                    style="
                    text-align:center;
                    padding:30px;
                    ">

                    <div
                        style="
                        font-size:70px">
                        ☎
                    </div>

                    <h2>
                        Phone
                    </h2>

                    <p>
                        Phone calling is not
                        connected in this demo.
                    </p>

                </div>

                `
            );

        };


    /* =====================================
       MAIL
       ===================================== */

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


    /* =====================================
       COMPASS
       ===================================== */

    document
        .getElementById("compass")
        .onclick = () => {

            openApp(
                "Compass",

                `

                <div
                    style="
                    text-align:center;
                    font-size:100px;
                    padding:30px;
                    ">

                    🧭

                    <h3>
                        North
                    </h3>

                </div>

                `
            );

        };


    /* =====================================
       VIDEOS
       ===================================== */

    document
        .getElementById("videos")
        .onclick = () => {

            openApp(
                "Videos",

                `

                <div
                    style="
                    text-align:center;
                    padding:30px;
                    ">

                    <div
                        style="font-size:70px">
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


    /* =====================================
       HOME / BACKGROUND
       ===================================== */

    overlay.addEventListener(
        "click",
        event => {

            if(
                event.target === overlay
            ) {

                closeApp();

            }

        }
    );


    /* =====================================
       IPHONE CLOCK
       ===================================== */

    const time =
        document.getElementById("time");


    function updateTime(){

        time.textContent =
            new Date()
                .toLocaleTimeString(
                    [],
                    {
                        hour:"numeric",
                        minute:"2-digit"
                    }
                );

    }


    updateTime();

    setInterval(
        updateTime,
        1000
    );


    /* =====================================
       ESCAPE HTML
       ===================================== */

    function escapeHTML(value){

        return String(value)
            .replace(
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

});
