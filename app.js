// ========================================
// PEAR PHONE
// ========================================

const appWindow = document.getElementById("appWindow");
const appTitle = document.getElementById("appTitle");
const appContent = document.getElementById("appContent");


// ========================================
// OPEN AN APP
// ========================================

function openApp(appName) {

    appTitle.textContent = appName;

    let content = "";

    switch (appName) {

        case "Pear Mail":
            content = `
                <h2>✉️ Pear Mail</h2>
                <p>No new messages.</p>
            `;
            break;


        case "Pear Music":
            content = `
                <h2>🎵 Pear Music</h2>
                <p>Now Playing</p>

                <button onclick="alert('Playing music!')">
                    ▶ Play
                </button>
            `;
            break;


        case "Pear Camera":
            content = `
                <h2>📷 Pear Camera</h2>
                <p>Camera opened.</p>

                <button onclick="takePicture()">
                    Take Picture
                </button>
            `;
            break;


        case "Pear Maps":
            content = `
                <h2>🗺️ Pear Maps</h2>
                <p>Where would you like to go?</p>

                <input
                    type="text"
                    placeholder="Search location..."
                >

                <button onclick="alert('Searching...')">
                    Search
                </button>
            `;
            break;


        case "Pear Messages":
            content = `
                <h2>💬 Pear Messages</h2>

                <p>Mom: Where are you?</p>
                <p>Chloe: I'm coming!</p>

                <input
                    type="text"
                    id="messageInput"
                    placeholder="Message..."
                >

                <button onclick="sendMessage()">
                    Send
                </button>
            `;
            break;


        case "Pear Photos":
            content = `
                <h2>🖼️ Pear Photos</h2>
                <p>Your photo library is empty.</p>
            `;
            break;


        case "Pear Browser":
            content = `
                <h2>🌐 Pear Browser</h2>

                <input
                    type="text"
                    id="browserInput"
                    placeholder="Search the web..."
                >

                <button onclick="searchBrowser()">
                    Search
                </button>
            `;
            break;


        case "Pear TV":
            content = `
                <h2>📺 Pear TV</h2>
                <p>Welcome to Pear TV!</p>

                <button onclick="alert('Playing show...')">
                    ▶ Watch
                </button>
            `;
            break;


        case "Pear Games":
            content = `
                <h2>🎮 Pear Games</h2>

                <p>Choose a game:</p>

                <button onclick="alert('Game loading...')">
                    Snake
                </button>

                <button onclick="alert('Game loading...')">
                    Tic Tac Toe
                </button>
            `;
            break;


        case "Pear Notes":
            content = `
                <h2>📝 Pear Notes</h2>

                <textarea
                    id="notes"
                    rows="6"
                    placeholder="Write a note..."
                ></textarea>

                <br><br>

                <button onclick="saveNote()">
                    Save
                </button>
            `;
            break;


        case "Pear Weather":
            content = `
                <h2>☀️ Pear Weather</h2>

                <p>Today's Weather</p>

                <h1>☀️ 22°C</h1>

                <p>Sunny</p>
            `;
            break;


        case "Settings":
            content = `
                <h2>⚙️ Settings</h2>

                <p>Wi-Fi: Connected</p>
                <p>Bluetooth: On</p>
                <p>Battery: 87%</p>
            `;
            break;


        default:
            content = `
                <h2>${appName}</h2>
                <p>This app isn't available yet.</p>
            `;
    }

    appContent.innerHTML = content;

    appWindow.classList.add("active");
}


// ========================================
// CLOSE APP
// ========================================

function closeApp() {
    appWindow.classList.remove("active");
}


// ========================================
// CAMERA
// ========================================

function takePicture() {
    alert("📸 Picture taken!");
}


// ========================================
// MESSAGES
// ========================================

function sendMessage() {

    const input = document.getElementById("messageInput");

    if (!input.value.trim()) {
        alert("Type a message first!");
        return;
    }

    alert("Message sent!");

    input.value = "";
}


// ========================================
// BROWSER
// ========================================

function searchBrowser() {

    const input = document.getElementById("browserInput");

    if (!input.value.trim()) {
        alert("Enter something to search.");
        return;
    }

    window.open(
        "https://www.google.com/search?q=" +
        encodeURIComponent(input.value),
        "_blank"
    );
}


// ========================================
// NOTES
// ========================================

function saveNote() {

    const note = document.getElementById("notes").value;

    localStorage.setItem("pearNote", note);

    alert("Note saved!");
}
