document.addEventListener("DOMContentLoaded", () => {
"use strict";

/* =========================================================
   PEAR PHONE OS — APP ICONS
   ========================================================= */

const ICONS = {

messages: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="msg" cx="35%" cy="25%">
<stop offset="0" stop-color="#a2ff8c"/>
<stop offset=".6" stop-color="#35dc48"/>
<stop offset="1" stop-color="#07951f"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#msg)"
stroke="#080808"
stroke-width="5"/>

<ellipse cx="50" cy="22" rx="28" ry="8"
fill="white"
opacity=".2"/>

<circle cx="50" cy="50" r="39"
fill="none"
stroke="white"
stroke-opacity=".25"
stroke-width="2"/>

<path
d="M27 37c0-7 5-12 12-12h22c7 0 12 5 12 12v15c0 7-5 12-12 12H48L37 74V64h-1c-5 0-9-5-9-12z"
fill="white"/>

<circle cx="42" cy="45" r="3" fill="#45cc3e"/>
<circle cx="50" cy="45" r="3" fill="#45cc3e"/>
<circle cx="58" cy="45" r="3" fill="#45cc3e"/>
</svg>`,

camera: `
<svg viewBox="0 0 100 100">

<defs>
<radialGradient id="cameraBody" cx="30%" cy="20%">
<stop stop-color="#f7f7f7"/>
<stop offset=".55" stop-color="#aaa"/>
<stop offset="1" stop-color="#444"/>
</radialGradient>

<radialGradient id="cameraLens" cx="35%" cy="30%">
<stop stop-color="#d9f7ff"/>
<stop offset=".3" stop-color="#7ba0bd"/>
<stop offset=".7" stop-color="#283744"/>
<stop offset="1" stop-color="#050608"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#cameraBody)"
stroke="#070707"
stroke-width="5"/>

<ellipse cx="50" cy="21" rx="28" ry="8"
fill="white"
opacity=".18"/>

<rect x="19" y="34"
width="62"
height="38"
rx="8"
fill="#303236"
stroke="#111"
stroke-width="3"/>

<rect x="32" y="27"
width="18"
height="9"
rx="3"
fill="#222"/>

<circle cx="51" cy="53"
r="17"
fill="url(#cameraLens)"
stroke="#d2dae0"
stroke-width="2"/>

<circle cx="51" cy="53"
r="8"
fill="#253846"/>

<circle cx="55" cy="49"
r="3"
fill="white"
opacity=".7"/>
</svg>`,

splashface: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="sf" cx="30%" cy="20%">
<stop stop-color="#c3e3ff"/>
<stop offset=".55" stop-color="#6499de"/>
<stop offset="1" stop-color="#204996"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#sf)"
stroke="#070707"
stroke-width="5"/>

<ellipse cx="50" cy="21" rx="28" ry="8"
fill="white"
opacity=".18"/>

<text
x="50"
y="64"
text-anchor="middle"
font-family="Arial Black,Arial"
font-size="42"
fill="white">
Sf
</text>
</svg>`,

stocks: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="stocks" cx="30%" cy="20%">
<stop stop-color="#e7fcff"/>
<stop offset=".55" stop-color="#73cfef"/>
<stop offset="1" stop-color="#277ab9"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#stocks)"
stroke="#070707"
stroke-width="5"/>

<ellipse cx="50" cy="21" rx="28" ry="8"
fill="white"
opacity=".17"/>

<polyline
points="15,69 28,56 39,63 48,43 59,55 71,34 85,45"
fill="none"
stroke="white"
stroke-width="4.5"
stroke-linecap="round"
stroke-linejoin="round"/>
</svg>`,

maps: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="maps" cx="30%" cy="20%">
<stop stop-color="#fffde3"/>
<stop offset=".6" stop-color="#e4dd91"/>
<stop offset="1" stop-color="#b39b3e"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#maps)"
stroke="#070707"
stroke-width="5"/>

<path d="M12 27l27-9 23 10 26-10"
stroke="#66b34b"
stroke-width="13"
fill="none"/>

<path d="M15 74l24-13 21 9 26-12"
stroke="#eee"
stroke-width="10"
fill="none"/>

<path d="M29 10l9 80M62 7l7 85"
stroke="#f8f8f8"
stroke-width="7"/>

<circle cx="57" cy="47"
r="11"
fill="#e43131"
stroke="white"
stroke-width="3"/>

<circle cx="57" cy="47"
r="4"
fill="white"/>
</svg>`,

photos: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="photos" cx="30%" cy="20%">
<stop stop-color="#fff"/>
<stop offset="1" stop-color="#d6d7da"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#photos)"
stroke="#070707"
stroke-width="5"/>

<g transform="translate(50 50)">
<ellipse rx="9" ry="30" fill="#ff3b30"/>
<ellipse rx="9" ry="30" fill="#ff9f0a" transform="rotate(45)"/>
<ellipse rx="9" ry="30" fill="#34c759" transform="rotate(90)"/>
<ellipse rx="9" ry="30" fill="#5ac8fa" transform="rotate(135)"/>
<ellipse rx="9" ry="30" fill="#007aff" transform="rotate(180)"/>
<ellipse rx="9" ry="30" fill="#5856d6" transform="rotate(225)"/>
<ellipse rx="9" ry="30" fill="#af52de" transform="rotate(270)"/>
<ellipse rx="9" ry="30" fill="#ff2d55" transform="rotate(315)"/>
<circle r="11" fill="white"/>
<circle r="5" fill="#ddd"/>
</g>
</svg>`,

weather: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="weather" cx="30%" cy="20%">
<stop stop-color="#e9fbff"/>
<stop offset=".6" stop-color="#72c8fa"/>
<stop offset="1" stop-color="#277fc5"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#weather)"
stroke="#070707"
stroke-width="5"/>

<ellipse cx="50" cy="20" rx="28" ry="8"
fill="white"
opacity=".18"/>

<circle cx="62" cy="39" r="16"
fill="#ffd43b"/>

<circle cx="42" cy="56" r="14"
fill="white"/>

<circle cx="58" cy="53" r="18"
fill="white"/>

<rect x="38" y="54"
width="40"
height="16"
rx="8"
fill="white"/>
</svg>`,

notes: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="notes" cx="30%" cy="20%">
<stop stop-color="white"/>
<stop offset="1" stop-color="#d6d6d6"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#notes)"
stroke="#070707"
stroke-width="5"/>

<rect x="14" y="15"
width="72"
height="29"
fill="#ffd72e"/>

<path d="M14 44h72"
stroke="#222"
stroke-width="5"/>

<line x1="21" y1="56" x2="79" y2="56"
stroke="#888"
stroke-width="2"/>

<line x1="21" y1="66" x2="79" y2="66"
stroke="#888"
stroke-width="2"/>

<line x1="21" y1="76" x2="63" y2="76"
stroke="#888"
stroke-width="2"/>
</svg>`,

peartunes: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="peartunes" cx="30%" cy="20%">
<stop stop-color="#ff9ae4"/>
<stop offset=".58" stop-color="#eb53c4"/>
<stop offset="1" stop-color="#9d117c"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#peartunes)"
stroke="#070707"
stroke-width="5"/>

<ellipse cx="50" cy="20" rx="28" ry="8"
fill="white"
opacity=".17"/>

<path d="M61 23v39M61 23l19-5v38"
fill="none"
stroke="white"
stroke-width="6"
stroke-linecap="round"/>

<circle cx="51" cy="67" r="10" fill="white"/>
<circle cx="70" cy="59" r="10" fill="white"/>
</svg>`,

settings: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="settings" cx="30%" cy="20%">
<stop stop-color="#f6f6f6"/>
<stop offset=".6" stop-color="#a4a4a4"/>
<stop offset="1" stop-color="#4f4f4f"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#settings)"
stroke="#070707"
stroke-width="5"/>

<ellipse cx="50" cy="20" rx="28" ry="8"
fill="white"
opacity=".15"/>

<circle cx="50" cy="50"
r="21"
fill="none"
stroke="#3c3c3c"
stroke-width="9"/>

<circle cx="50" cy="50"
r="8"
fill="#777"/>
</svg>`,

clock: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="clock" cx="30%" cy="20%">
<stop stop-color="#fff"/>
<stop offset="1" stop-color="#ceced0"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#clock)"
stroke="#070707"
stroke-width="5"/>

<circle cx="50" cy="50" r="34"
fill="white"
stroke="#666"
stroke-width="2"/>

<line x1="50" y1="50"
x2="50" y2="29"
stroke="#222"
stroke-width="4"
stroke-linecap="round"/>

<line x1="50" y1="50"
x2="67" y2="57"
stroke="#222"
stroke-width="4"
stroke-linecap="round"/>

<circle cx="50" cy="50"
r="4"
fill="#222"/>
</svg>`,

videos: `
<svg viewBox="0 0 100 100">
<defs>
<linearGradient id="videos"
x1="0" y1="0"
x2="0" y2="1">
<stop stop-color="#fff"/>
<stop offset=".55" stop-color="#f7f7f7"/>
<stop offset="1" stop-color="#55d1d1"/>
</linearGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#videos)"
stroke="#070707"
stroke-width="5"/>

<path d="M15 36h70"
stroke="#222"
stroke-width="8"/>

<path d="M24 27l9-9M40 29l9-12M56 29l9-12M72 29l9-10"
stroke="#111"
stroke-width="5"
stroke-linecap="round"/>

<polygon points="42,43 42,67 68,55"
fill="white"
stroke="#222"
stroke-width="3"/>
</svg>`,

phone: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="phone" cx="30%" cy="20%">
<stop stop-color="#a0ff95"/>
<stop offset=".6" stop-color="#42d95a"/>
<stop offset="1" stop-color="#159a2a"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#phone)"
stroke="#070707"
stroke-width="5"/>

<path d="M34 25c-4 3-5 10-1 17 7 13 15 21 28 28 7 4 14 3 17-1l4-6-14-9-5 6c-6-4-11-9-15-15l5-5-9-14z"
fill="white"/>
</svg>`,

mail: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="mail" cx="30%" cy="20%">
<stop stop-color="#fff"/>
<stop offset=".6" stop-color="#e9ebed"/>
<stop offset="1" stop-color="#8e9399"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#mail)"
stroke="#070707"
stroke-width="5"/>

<rect x="20" y="31"
width="60"
height="40"
rx="5"
fill="#4c7ba9"
stroke="#222"
stroke-width="2"/>

<path d="M22 34l28 24 28-24"
fill="none"
stroke="white"
stroke-width="4"/>

<path d="M22 68l20-19M78 68L58 49"
fill="none"
stroke="#d8ebff"
stroke-width="3"/>
</svg>`,

compass: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="compass" cx="30%" cy="20%">
<stop stop-color="#efffff"/>
<stop offset=".55" stop-color="#83bfe1"/>
<stop offset="1" stop-color="#236291"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#compass)"
stroke="#070707"
stroke-width="5"/>

<circle cx="50" cy="50"
r="30"
fill="#b7bfca"
stroke="#293541"
stroke-width="3"/>

<polygon points="50,20 57,50 50,80 43,50"
fill="#e33c38"/>

<polygon points="50,20 43,50 50,80 57,50"
fill="#fff"/>

<circle cx="50" cy="50"
r="5"
fill="#222"/>
</svg>`,

music: `
<svg viewBox="0 0 100 100">
<defs>
<radialGradient id="music" cx="30%" cy="20%">
<stop stop-color="#ffe97e"/>
<stop offset=".65" stop-color="#ffb82b"/>
<stop offset="1" stop-color="#db6a10"/>
</radialGradient>
</defs>

<circle cx="50" cy="50" r="47"
fill="url(#music)"
stroke="#070707"
stroke-width="5"/>

<path d="M59 24v39M59 24l20-5v37"
fill="none"
stroke="white"
stroke-width="6"
stroke-linecap="round"/>

<circle cx="49" cy="68" r="10" fill="white"/>
<circle cx="69" cy="61" r="10" fill="white"/>
</svg>`
};

/* =========================================================
   APPS
   ========================================================= */

const apps = [
    {id:"messages",label:"Messages",icon:ICONS.messages,badge:5},
    {id:"camera",label:"Camera",icon:ICONS.camera},
    {id:"splashface",label:"SplashFace",icon:ICONS.splashface},
    {id:"stocks",label:"Stocks",icon:ICONS.stocks},
    {id:"maps",label:"Maps",icon:ICONS.maps},
    {id:"photos",label:"Photos",icon:ICONS.photos},
    {id:"weather",label:"Weather",icon:ICONS.weather},
    {id:"notes",label:"Notes",icon:ICONS.notes},
    {id:"peartunes",label:"PearTunes",icon:ICONS.peartunes},
    {id:"settings",label:"Settings",icon:ICONS.settings},
    {id:"clock",label:"Clock",icon:ICONS.clock},
    {id:"videos",label:"Videos",icon:ICONS.videos}
];

const dockApps = [
    {id:"phone",label:"Phone",icon:ICONS.phone},
    {id:"mail",label:"Mail",icon:ICONS.mail},
    {id:"compass",label:"Compass",icon:ICONS.compass},
    {id:"music",label:"Music",icon:ICONS.music}
];

/* =========================================================
   CSS
   ========================================================= */

const style = document.createElement("style");

style.textContent = `

*{
box-sizing:border-box;
}

body{
margin:0;
min-height:100vh;
background:white;
font-family:Arial,Helvetica,sans-serif;
display:flex;
align-items:center;
justify-content:center;
overflow:hidden;
}

#pearOS{
width:100%;
height:100vh;
display:flex;
align-items:center;
justify-content:center;
}

.pear-phone{
position:relative;

width:430px;
height:820px;

background:
linear-gradient(
135deg,
#202329,
#080a0d 35%,
#020303 75%,
#14171b
);

border:3px solid #555a60;

border-radius:
49% 49% 43% 43%
/
29% 29% 57% 57%;

box-shadow:
inset 9px 9px 18px rgba(255,255,255,.10),
inset -18px -25px 30px rgba(0,0,0,.95),
0 30px 70px rgba(0,0,0,.35);

overflow:hidden;
}

/* METAL PANEL */

.top-panel{
position:absolute;
left:8%;
right:8%;
top:4%;
height:25%;

background:
radial-gradient(
circle,
rgba(110,125,145,.35) 1px,
transparent 1.5px
);

background-size:12px 12px;

border-radius:40%;
}

.meter{
position:absolute;
border-radius:50%;

background:
radial-gradient(
circle at 35% 25%,
#bfd8ef,
#7186aa 45%,
#17223d 72%,
#07090e
);

border:4px solid #172137;

box-shadow:
inset 0 0 0 2px #6377a3,
0 3px 7px rgba(0,0,0,.8);

display:flex;
align-items:center;
justify-content:center;
}

.meter1{
width:30%;
aspect-ratio:1;
left:5%;
top:18%;
}

.meter2{
width:22%;
aspect-ratio:1;
left:39%;
top:0;
}

.meter3{
width:29%;
aspect-ratio:1;
right:5%;
top:15%;
}

.dial{
width:70%;
height:42%;
background:#edf5ff;
border-radius:50%;
position:relative;
}

.dial:before{
content:"";
position:absolute;
left:12%;
right:12%;
bottom:25%;
height:3px;
background:#29497c;
transform:rotate(-15deg);
}

.signal-bars{
display:flex;
align-items:end;
gap:2px;
height:45%;
}

.signal-bars span{
width:4px;
background:#58d8ff;
border-radius:3px;
}

.signal-bars span:nth-child(1){height:9px}
.signal-bars span:nth-child(2){height:15px}
.signal-bars span:nth-child(3){height:21px}
.signal-bars span:nth-child(4){height:27px}
.signal-bars span:nth-child(5){height:33px}

/* PHONE SCREEN */

.phone-screen{
position:absolute;

left:11%;
right:11%;

top:20%;
bottom:25%;

border:4px solid #05070b;

border-radius:
37% 37% 42% 42%
/
19% 19% 24% 24%;

overflow:hidden;

background:
radial-gradient(
circle at 50% 15%,
rgba(112,205,255,.75),
transparent 38%
),
radial-gradient(
circle at 50% 55%,
#1652d8,
#0c2d9a 58%,
#071c57
);

box-shadow:
inset 0 0 35px rgba(0,0,0,.35),
0 5px 12px rgba(0,0,0,.5);
}

/* STATUS */

.status-bar{
height:27px;

display:flex;
align-items:center;
justify-content:space-between;

padding:0 12px;

color:white;

font-size:10px;
font-weight:bold;

text-shadow:
0 1px 3px #000;
}

.phone-title{
text-align:center;

color:white;

font-size:12px;
font-weight:bold;

margin-bottom:4px;

text-shadow:
0 1px 3px #000;
}

/* APP GRID */

.app-grid{
position:relative;

display:grid;

grid-template-columns:
repeat(3,1fr);

gap:10px 3px;

padding:6px 13px;

height:70%;

overflow-y:auto;

scrollbar-width:none;
}

.app-grid::-webkit-scrollbar{
display:none;
}

.app-button{
border:0;
background:none;

color:white;

display:flex;
flex-direction:column;
align-items:center;

gap:3px;

cursor:pointer;

font-size:9px;
font-weight:bold;

text-shadow:
0 1px 3px #000;
}

/* ICON */

.app-icon{
position:relative;

width:57px;
height:57px;

filter:
drop-shadow(
0 3px 2px rgba(0,0,0,.7)
);

transition:
transform .12s ease;
}

.app-icon svg{
width:100%;
height:100%;
}

.app-button:hover .app-icon{
transform:
translateY(-2px)
scale(1.07);
}

.app-button:active .app-icon{
transform:
scale(.92);
}

/* MESSAGE BADGE */

.badge{
position:absolute;

right:-3px;
top:-4px;

min-width:18px;
height:18px;

border-radius:50%;

background:
linear-gradient(
#ff6868,
#d71919
);

border:2px solid white;

color:white;

display:flex;
align-items:center;
justify-content:center;

font-size:9px;

box-shadow:
0 2px 4px rgba(0,0,0,.6);
}

/* DOCK */

.dock{
position:absolute;

left:6%;
right:6%;

bottom:0;

height:18%;

display:flex;
align-items:center;
justify-content:space-around;

background:
linear-gradient(
rgba(150,160,185,.05),
rgba(150,160,185,.35)
);

border-top:
1px solid rgba(255,255,255,.18);
}

.dock .app-button{
width:25%;
}

.dock .app-icon{
width:50px;
height:50px;
}

.dock span:last-child{
display:none;
}

/* HOME BUTTON */

.home-button{
position:absolute;

left:50%;
bottom:3%;

transform:translateX(-50%);

width:67px;
height:67px;

border-radius:50%;

border:2px solid #555;

background:
radial-gradient(
circle at 35% 28%,
#505050,
#151515 60%,
#050505
);

box-shadow:
inset 0 0 14px #000,
0 4px 8px #000;

cursor:pointer;
}

.home-button:after{
content:"";

position:absolute;

left:50%;
top:50%;

width:31px;
height:31px;

transform:
translate(-50%,-50%)
rotate(-35deg);

border:3px solid white;

border-top-color:transparent;

border-radius:50%;
}

/* APP WINDOW */

.app-overlay{
position:fixed;

inset:0;

display:none;

align-items:center;
justify-content:center;

background:
rgba(0,0,0,.55);

backdrop-filter:blur(4px);

z-index:999;
}

.app-overlay.open{
display:flex;
}

.app-window{
width:min(430px,92vw);
max-height:88vh;

background:
linear-gradient(
#fafafa,
#e8eaed
);

border-radius:25px;

overflow:hidden;

box-shadow:
0 20px 70px rgba(0,0,0,.5);
}

.app-header{
display:flex;
align-items:center;

padding:12px;

gap:10px;

border-bottom:
1px solid #ccc;

background:
linear-gradient(#fff,#e8e8e8);
}

.back-button{
width:33px;
height:33px;

border-radius:50%;

border:1px solid #bbb;

background:
linear-gradient(#fff,#ddd);

font-size:25px;

cursor:pointer;
}

.app-content{
padding:16px;
overflow:auto;

max-height:calc(88vh - 60px);
}

.chat{
padding:10px 13px;

border-radius:17px;

background:#e0e3e8;

width:max-content;

max-width:80%;

margin-bottom:8px;
}

.chat.me{
margin-left:auto;

background:
linear-gradient(#57b7ff,#1287e0);

color:white;
}

input,
textarea{
font-family:Arial;

border:1px solid #bbb;

border-radius:12px;

padding:10px;
}

textarea{
width:100%;
height:180px;
resize:vertical;
}

button{
cursor:pointer;
}

.photo-grid{
display:grid;

grid-template-columns:
repeat(3,1fr);

gap:7px;
}

.photo-grid img{
width:100%;
aspect-ratio:1;

object-fit:cover;

border-radius:12px;
}

.stock{
display:flex;
justify-content:space-between;

padding:12px;

margin-bottom:8px;

background:white;

border:1px solid #ddd;

border-radius:13px;
}

.map{
height:250px;

border-radius:18px;

background:
linear-gradient(
135deg,
#cee2c0,
#e9e3bd
);

position:relative;
}

.map-pin{
position:absolute;

left:55%;
top:40%;

font-size:50px;
}

.big-clock{
font-size:55px;

font-weight:bold;

text-align:center;

padding:35px 0;
}

/* MOBILE */

@media(max-width:600px){

.pear-phone{
width:82vw;
height:91vh;
}

.app-icon{
width:49px;
height:49px;
}

.app-button{
font-size:8px;
}

.dock .app-icon{
width:45px;
height:45px;
}
}

`;

document.head.appendChild(style);

/* =========================================================
   CREATE PHONE
   ========================================================= */

const root=document.createElement("div");

root.id="pearOS";

root.innerHTML=`

<div class="pear-phone">

<div class="top-panel">

<div class="meter meter1">
<div class="dial"></div>
</div>

<div class="meter meter2">
<div class="signal-bars">
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
</div>
</div>

<div class="meter meter3"></div>

</div>


<section class="phone-screen">

<div class="status-bar">

<span id="status-time">
9:41
</span>

<span>
PEAR
</span>

<span>
◔ ◉ ▰
</span>

</div>


<div class="phone-title">
Pear Phone OS
</div>


<div
class="app-grid"
id="app-grid">
</div>


<div
class="dock"
id="dock">
</div>


</section>


<button
class="home-button"
id="home-button"
aria-label="Home">
</button>


</div>


<div
class="app-overlay"
id="app-overlay">

<div
class="app-window"
id="app-window">
</div>

</div>

`;

document.body.appendChild(root);


/* =========================================================
   BUILD APPS
   ========================================================= */

const grid=
document.getElementById("app-grid");

const dock=
document.getElementById("dock");

function createApp(app){

const button=
document.createElement("button");

button.className="app-button";

button.dataset.app=
app.id;

button.innerHTML=`

<div class="app-icon">

${app.icon}

${app.badge ?
`<span class="badge">${app.badge}</span>`
:
""}

</div>

<span>
${app.label}
</span>

`;

return button;
}

apps.forEach(
app => grid.appendChild(
createApp(app)
)
);

dockApps.forEach(
app => dock.appendChild(
createApp(app)
)
);


/* =========================================================
   APP WINDOWS
   ========================================================= */

const overlay=
document.getElementById("app-overlay");

const appWindow=
document.getElementById("app-window");

function closeApp(){

overlay.classList.remove("open");

appWindow.innerHTML="";
}

function openApp(title,html){

appWindow.innerHTML=`

<div class="app-header">

<button
class="back-button"
id="back">
‹
</button>

<strong>
${title}
</strong>

</div>

<div class="app-content">

${html}

</div>
`;

overlay.classList.add("open");

document
.getElementById("back")
.addEventListener(
"click",
closeApp
);
}


/* =========================================================
   APP ROUTER
   ========================================================= */

function launchApp(id){

switch(id){

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


case "peartunes":
case "music":

openMusic();

break;


case "phone":

openApp(
"Phone",
`
<div style="text-align:center;padding:30px">

<div style="font-size:70px">
☎
</div>

<h2>Phone</h2>

<p>
Phone calling is not connected yet.
</p>

</div>
`
);

break;


case "mail":

openApp(
"Mail",
`
<h2>Inbox</h2>

<div class="stock">

<div>
<strong>
Welcome to Pear OS
</strong>

<br>

<small>
Pear Team
</small>

</div>

</div>
`
);

break;


case "compass":

openApp(
"Compass",
`
<div style="text-align:center">

<div style="
width:120px;
margin:auto;
">
${ICONS.compass}
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

break;


case "videos":

openApp(
"Videos",
`
<div style="text-align:center;padding:30px">

<div style="font-size:70px">
▶
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

break;

}

}


/* =========================================================
   MESSAGES
   ========================================================= */

function openMessages(){

let messages=
JSON.parse(
localStorage.getItem("pearMessages") ||
"[]"
);

openApp(
"Messages",
`

<div>

<div class="chat">
hey 👋
</div>

<div class="chat">
welcome to Pear Phone OS 🍐
</div>

<div class="chat">
this is a working web phone.
</div>

${messages.map(
m=>`
<div class="chat me">
${escapeHTML(m)}
</div>
`
).join("")}

</div>


<div style="
display:flex;
gap:7px;
margin-top:10px;
">

<input
id="message-input"
placeholder="iMessage"
style="flex:1"
>

<button id="send-message">
Send
</button>

</div>
`
);

const input=
document.getElementById(
"message-input"
);

const send=
document.getElementById(
"send-message"
);

function sendMessage(){

const text=
input.value.trim();

if(!text) return;

messages.push(text);

localStorage.setItem(
"pearMessages",
JSON.stringify(
messages.slice(-50)
)
);

openMessages();
}

send.onclick=
sendMessage;

input.addEventListener(
"keydown",
e=>{
if(e.key==="Enter")
sendMessage();
}
);

}


/* =========================================================
   CAMERA
   ========================================================= */

async function openCamera(){

openApp(
"Camera",
`

<video
id="camera-video"
autoplay
playsinline
style="
width:100%;
border-radius:18px;
background:#000;
">
</video>

<div style="
display:flex;
gap:8px;
margin-top:10px;
">

<button id="camera-start">
Start Camera
</button>

<button id="camera-take">
Take Photo
</button>

</div>

<canvas
id="camera-canvas"
style="display:none">
</canvas>

<img
id="camera-photo"
style="
display:none;
width:100%;
margin-top:10px;
border-radius:18px;
">

`
);

const video=
document.getElementById(
"camera-video"
);

const canvas=
document.getElementById(
"camera-canvas"
);

const photo=
document.getElementById(
"camera-photo"
);

let stream=null;

async function startCamera(){

try{

stream =
await navigator.mediaDevices.getUserMedia({
video:true,
audio:false
});

video.srcObject=
stream;

}

catch(error){

alert(
"Camera permission was denied."
);

}

}

document
.getElementById("camera-start")
.onclick=
startCamera;

document
.getElementById("camera-take")
.onclick=()=>{

if(!video.videoWidth){

alert(
"Start the camera first."
);

return;
}

canvas.width=
video.videoWidth;

canvas.height=
video.videoHeight;

canvas
.getContext("2d")
.drawImage(
video,
0,
0
);

const image=
canvas.toDataURL(
"image/jpeg",
.9
);

photo.src=image;

photo.style.display=
"block";

let photos=
JSON.parse(
localStorage.getItem("pearPhotos") ||
"[]"
);

photos.unshift(image);

localStorage.setItem(
"pearPhotos",
JSON.stringify(
photos.slice(0,25)
)
);

};

startCamera();

}


/* =========================================================
   PHOTOS
   ========================================================= */

function openPhotos(){

const photos=
JSON.parse(
localStorage.getItem("pearPhotos") ||
"[]"
);

openApp(
"Photos",
`

<input
id="photo-import"
type="file"
accept="image/*"
multiple
>

<div style="height:12px"></div>

<div class="photo-grid">

${
photos.length

?

photos.map(
photo=>
`<img src="${photo}">`
).join("")

:

`
<div style="
grid-column:1/-1;
text-align:center;
padding:30px;
color:#777;
">
No photos yet.
</div>
`
}

</div>
`
);

document
.getElementById("photo-import")
.addEventListener(
"change",
async event=>{

const files=
Array.from(
event.target.files
);

const imported=
await Promise.all(

files.map(
file=>

new Promise(resolve=>{

const reader=
new FileReader();

reader.onload=()=>
resolve(
reader.result
);

reader.readAsDataURL(file);

})

)

);

localStorage.setItem(
"pearPhotos",
JSON.stringify(
[
...imported,
...photos
].slice(0,25)
)
);

openPhotos();

}
);

}


/* =========================================================
   NOTES
   ========================================================= */

function openNotes(){

let notes=
JSON.parse(
localStorage.getItem("pearNotes") ||
"[]"
);

openApp(
"Notes",
`

<div>

${notes.map(
(note,i)=>

`
<div
class="stock"
data-note="${i}"
style="cursor:pointer">

<div>

<strong>
${escapeHTML(
note.title ||
"Untitled"
)}
</strong>

<br>

<small>
${escapeHTML(
(note.body || "")
.slice(0,80)
)}
</small>

</div>

</div>
`

).join("")}

</div>


<input
id="note-title"
placeholder="Note title"
style="width:100%;margin-bottom:8px"
>

<textarea
id="note-body"
placeholder="Start typing..."
>
</textarea>

<br><br>

<button id="save-note">
Save Note
</button>

`
);

document
.querySelectorAll("[data-note]")
.forEach(
element=>{

element.onclick=()=>{

const note=
notes[
Number(
element.dataset.note
)
];

document
.getElementById("note-title")
.value=
note.title || "";

document
.getElementById("note-body")
.value=
note.body || "";

};

}
);

document
.getElementById("save-note")
.onclick=()=>{

const note={

title:
document
.getElementById("note-title")
.value
.trim()
||
"Untitled",

body:
document
.getElementById("note-body")
.value
};

notes.unshift(note);

localStorage.setItem(
"pearNotes",
JSON.stringify(
notes.slice(0,50)
)
);

openNotes();

};

}


/* =========================================================
   STOCKS
   ========================================================= */

function openStocks(){

const stocks=[

["AAPL","Apple","$229.87","+1.8%",true],

["MSFT","Microsoft","$532.44","+0.9%",true],

["TSLA","Tesla","$318.26","-1.2%",false],

["PEAR","Pear Inc.","$99.99","+4.2%",true]

];

openApp(
"Stocks",

`

${stocks.map(
s=>

`
<div class="stock">

<div>
<strong>
${s[0]}
</strong>

<br>

<small>
${s[1]}
</small>

</div>

<div style="
text-align:right">

<strong>
${s[2]}
</strong>

<br>

<small style="
color:${s[4] ? "#0a9a3a":"#d92727"};
">

${s[3]}

</small>

</div>

</div>
`

).join("")}

`
);

}


/* =========================================================
   MAPS
   ========================================================= */

function openMaps(){

openApp(
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
onclick="alert('Route started!')">
Start Route
</button>

`
);

}


/* =========================================================
   WEATHER
   ========================================================= */

function openWeather(){

openApp(
"Weather",
`

<div style="
text-align:center;
padding:20px;
">

<div style="
font-size:70px;
">
☀️
</div>

<div style="
font-size:60px;
font-weight:bold;
">
24°
</div>

<h3>
Sunny
</h3>

<p>
Feels like 25°
</p>

<p style="
color:#777;
">
Today: 18° — 27°
</p>

</div>

`
);

}


/* =========================================================
   CLOCK
   ========================================================= */

function openClock(){

openApp(
"Clock",
`

<div
id="clock-display"
class="big-clock">
</div>

<p style="
text-align:center;
color:#777;
">
Local Time
</p>

`
);

function updateClock(){

const display=
document.getElementById(
"clock-display"
);

if(!display) return;

display.textContent=
new Date().toLocaleTimeString(
[],
{
hour:"numeric",
minute:"2-digit",
second:"2-digit"
}
);

}

updateClock();

const timer=
setInterval(
updateClock,
1000
);

}


/* =========================================================
   MUSIC
   ========================================================= */

function openMusic(){

openApp(
"PearTunes",
`

<div style="
text-align:center;
">

<div style="
font-size:70px;
color:#dd36b4;
">
♫
</div>

<h2>
PearTunes
</h2>

</div>

<div class="stock">
Pearadise
<button onclick="alert('Playing Pearadise')">
▶
</button>
</div>

<div class="stock">
Sunset Drive
<button onclick="alert('Playing Sunset Drive')">
▶
</button>
</div>

<div class="stock">
Electric Orchard
<button onclick="alert('Playing Electric Orchard')">
▶
</button>
</div>

`
);

}


/* =========================================================
   SETTINGS
   ========================================================= */

function openSettings(){

openApp(
"Settings",
`

<div class="stock">

<span>
Dark Mode
</span>

<input
id="dark-mode"
type="checkbox">
</div>

<button id="reset-phone">
Reset Pear OS
</button>

`
);

document
.getElementById("dark-mode")
.onchange=
event=>{

document.body.style.filter=
event.target.checked
?
"brightness(.8)"
:
"";

};

document
.getElementById("reset-phone")
.onclick=()=>{

localStorage.clear();

location.reload();

};

}


/* =========================================================
   APP CLICK HANDLER
   ========================================================= */

document.addEventListener(
"click",
event=>{

const button=
event.target.closest(
"[data-app]"
);

if(!button) return;

launchApp(
button.dataset.app
);

}
);


/* =========================================================
   HOME BUTTON
   ========================================================= */

document
.getElementById("home-button")
.onclick=
closeApp;


/* =========================================================
   STATUS CLOCK
   ========================================================= */

function updateStatus(){

document
.getElementById("status-time")
.textContent=

new Date().toLocaleTimeString(
[],
{
hour:"numeric",
minute:"2-digit"
}
);

}

updateStatus();

setInterval(
updateStatus,
1000
);


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value){

return String(value)
.replace(
/[&<>"']/g,
char=>({

"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"

}[char])
);

}

});
