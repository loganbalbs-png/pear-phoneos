// Pear Phone OS
// Put this in: app.js

document.addEventListener("DOMContentLoaded", () => {
    const screen = document.querySelector(".phone-screen");

    const apps = [
        { name: "Messages", icon: "💬", color: "#36d64f" },
        { name: "Camera", icon: "📷", color: "#777" },
        { name: "SplashFace", icon: "SF", color: "#2478e8" },
        { name: "Stocks", icon: "📈", color: "#4db9ff" },
        { name: "Maps", icon: "🗺️", color: "#ffd43b" },
        { name: "Photos", icon: "🌈", color: "#ffffff" },
        { name: "Weather", icon: "🌤️", color: "#58a9ff" },
        { name: "Notes", icon: "📝", color: "#ffffff" },
        { name: "PearTunes", icon: "♫", color: "#e83cac" },
        { name: "Settings", icon: "⚙️", color: "#999" },
        { name: "Clock", icon: "🕘", color: "#ffffff" },
        { name: "Videos", icon: "🎬", color: "#55d6d6" }
    ];

    // Create app grid
    const appGrid = document.createElement("div");
    appGrid.className = "app-grid";

    apps.forEach(app => {
        const button = document.createElement("button");
        button.className = "app-button";

        button.innerHTML = `
            <div class="app-icon" style="background:${app.color}">
                ${app.icon}
            </div>
            <span>${app.name}</span>
        `;

        button.addEventListener("click", () => openApp(app.name));
        appGrid.appendChild(button);
    });

    screen.appendChild(appGrid);

    // Open apps
    function openApp(appName) {

        let content = "";

        switch (appName) {

            case "Messages":
                content = `
                    <h2>Messages</h2>
                    <div class="message">hey 👋</div>
                    <div class="message">welcome to Pear Phone OS 🍐</div>

                    <input id="messageInput"
                           placeholder="iMessage"
                           style="width:80%;padding:10px;border-radius:12px;border:1px solid #ccc">

                    <button onclick="sendMessage()"
                            style="padding:10px;border-radius:12px">
                        Send
                    </button>
                `;
                break;

            case "Camera":
                content = `
                    <h2>Camera</h2>

                    <video id="camera"
                           autoplay
                           playsinline
                           style="width:100%;border-radius:20px;background:black">
                    </video>

                    <button onclick="startCamera()">
                        Start Camera
                    </button>
                `;
                break;

            case "Photos":
                content = `
                    <h2>Photos</h2>

                    <input type="file"
                           accept="image/*"
                           multiple
                           onchange="loadPhotos(event)">

                    <div id="photoGrid"></div>
                `;
                break;

            case "Weather":
                content = `
                    <h2>Weather</h2>

                    <div style="text-align:center">
                        <div style="font-size:70px">☀️</div>
                        <div style="font-size:45px;font-weight:bold">24°</div>
                        <p>Sunny</p>
                    </div>
                `;
                break;

            case "Clock":
                content = `
                    <h2>Clock</h2>

                    <div id="bigClock"
                         style="font-size:55px;text-align:center;font-weight:bold">
                    </div>
                `;

                setTimeout(updateClock, 100);
                break;

            case "Notes":
                content = `
                    <h2>Notes</h2>

                    <textarea id="notes"
                              placeholder="Write a note..."
                              style="width:100%;height:180px">
                    </textarea>

                    <button onclick="saveNotes()">
                        Save
                    </button>
                `;

                setTimeout(() => {
                    document.getElementById("notes").value =
                        localStorage.getItem("pearNotes") || "";
                }, 50);

                break;

            case "Settings":
                content = `
                    <h2>Settings</h2>

                    <button onclick="toggleDarkMode()">
                        Toggle Dark Mode
                    </button>

                    <button onclick="resetPhone()">
                        Reset Pear Phone
                    </button>
                `;
                break;

            case "Maps":
                content = `
                    <h2>Maps</h2>

                    <div style="
                        height:300px;
                        border-radius:20px;
                        background:#cce0bc;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:70px;">
                        📍
                    </div>

                    <p>Pear Park</p>
                `;
                break;

            case "Stocks":
                content = `
                    <h2>Stocks</h2>

                    <p>🍎 AAPL — $229.87</p>
                    <p>💻 MSFT — $532.44</p>
                    <p>🚗 TSLA — $318.26</p>
                    <p>🍐 PEAR — $99.99</p>
                `;
                break;

            case "PearTunes":
                content = `
                    <h2>PearTunes</h2>

                    <button onclick="playMusic('Pearadise')">
                        ▶ Pearadise
                    </button>

                    <button onclick="playMusic('Sunset Drive')">
                        ▶ Sunset Drive
                    </button>

                    <button onclick="playMusic('Electric Orchard')">
                        ▶ Electric Orchard
                    </button>
                `;
                break;

            default:
                content = `
                    <h2>${appName}</h2>
                    <p>This Pear Phone app is coming soon 🍐</p>
                `;
        }

        showAppWindow(content);
    }

    // App window
    function showAppWindow(content) {

        const window = document.createElement("div");

        window.className = "app-window";

        window.innerHTML = `
            <div class="app-header">
                <button id="backButton">‹</button>
                <strong>Pear OS</strong>
            </div>

            <div class="app-content">
                ${content}
            </div>
        `;

        document.body.appendChild(window);

        document
            .getElementById("backButton")
            .addEventListener("click", () => {
                window.remove();
            });
    }

    // Messages
    window.sendMessage = function () {

        const input =
            document.getElementById("messageInput");

        if (!input || input.value.trim() === "") return;

        const message = document.createElement("div");

        message.className = "message";

        message.textContent = input.value;

        input.parentElement.appendChild(message);

        input.value = "";
    };

    // Camera
    window.startCamera = async function () {

        try {

            const video =
                document.getElementById("camera");

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true
                });

            video.srcObject = stream;

        } catch (error) {

            alert(
                "Camera permission was denied. " +
                "Make sure you're using HTTPS and allow camera access."
            );
        }
    };

    // Photos
    window.loadPhotos = function (event) {

        const grid =
            document.getElementById("photoGrid");

        grid.innerHTML = "";

        [...event.target.files].forEach(file => {

            const image =
                document.createElement("img");

            image.src =
                URL.createObjectURL(file);

            image.style.width = "100px";
            image.style.height = "100px";
            image.style.objectFit = "cover";
            image.style.borderRadius = "15px";
            image.style.margin = "5px";

            grid.appendChild(image);
        });
    };

    // Notes
    window.saveNotes = function () {

        const notes =
            document.getElementById("notes").value;

        localStorage.setItem("pearNotes", notes);

        alert("Note saved 🍐");
    };

    // Clock
    function updateClock() {

        const clock =
            document.getElementById("bigClock");

        if (!clock) return;

        const now = new Date();

        clock.textContent =
            now.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            });

        setTimeout(updateClock, 1000);
    }

    // Music
    window.playMusic = function(song) {
        alert("▶ Playing: " + song);
    };

    // Dark mode
    window.toggleDarkMode = function() {

        document.body.classList.toggle("dark-mode");
    };

    // Reset
    window.resetPhone = function() {

        localStorage.clear();

        location.reload();
    };
});
