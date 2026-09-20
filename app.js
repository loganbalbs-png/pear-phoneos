(()=>{
const P=document.getElementById('phone'),
O=document.getElementById('overlay'),
A=document.getElementById('app'),
K=document.getElementById('keyboard'),
F=document.getElementById('flash'),
p1=document.getElementById('page1'),
p2=document.getElementById('page2');

let sy=null;
let target=null;
let stream=null;
let timer=null;
let currentPage=1;

const esc=s=>String(s).replace(/[&<>"']/g,c=>({
'&':'&amp;',
'<':'&lt;',
'>':'&gt;',
'"':'&quot;',
"'":'&#39;'
}[c]));

/* CLOSE APP */

function close(){

 if(stream){
   stream.getTracks().forEach(t=>t.stop());
   stream=null;
 }

 clearInterval(timer);

 K.classList.remove('show');

 target=null;

 O.classList.remove('open');

 A.innerHTML='';
}


/* CREATE APP WINDOW */

function win(t,h){

 close();

 A.innerHTML=`
 <div class="head">
   <button id="back">‹</button>
   <span>${esc(t)}</span>
 </div>

 <div class="body">
   ${h}
 </div>
 `;

 O.classList.add('open');

 const back=document.getElementById('back');

 if(back)
   back.onclick=close;

 wire();
}


function simple(t,h){
 win(t,h);
}


/* APP LAUNCHER */

function launch(id){

 switch(id){

   case'messages':
     return messages();

   case'camera':
     return camera();

   case'photos':
     return photos();

   case'notes':
     return notes();

   case'stocks':
     return stocks();

   case'maps':
     return maps();

   case'weather':
     return weather();

   case'clock':
     return clock();

   case'settings':
     return settings();

   case'peartunes':
   case'music':
     return music();

   case'phone':
     return phone();

   case'mail':
     return mail();

   case'compass':
     return compass();

   case'splashface':
     return splashface();

   case'videos':
     return videos();

   default:
     return simple(
       'Pear OS',
       `
       <div class="big">🍐</div>
       <p style="text-align:center">
         ${esc(id)} opened.
       </p>
       `
     );
 }
}


/* =========================
   MESSAGES
========================= */

function messages(){

 let s=JSON.parse(
   localStorage.pearMessages||'[]'
 );

 win('Messages',`

 <div id="chat">

   <div class="bubble">
     Hey 👋
   </div>

   <div class="bubble">
     Welcome to Pear Phone.
   </div>

   ${s.map(x=>`
     <div class="bubble me">
       ${esc(x)}
     </div>
   `).join('')}

 </div>

 <div class="row">

   <input
     id="mi"
     style="flex:1"
     placeholder="Message">

   <button id="send">
     Send
   </button>

 </div>

 <div style="margin-top:7px">

   <button id="clearChat">
     Clear
   </button>

   <button id="autoReply">
     Auto Reply
   </button>

 </div>

 `);

 const input=document.getElementById('mi');

 document.getElementById('send').onclick=()=>{

   const v=input.value.trim();

   if(!v)return;

   s.push(v);

   localStorage.pearMessages=
     JSON.stringify(s.slice(-50));

   messages();
 };

 input.onkeydown=e=>{

   if(e.key==='Enter')
     document.getElementById('send').click();

 };

 document.getElementById('clearChat').onclick=()=>{

   localStorage.removeItem('pearMessages');

   messages();

 };

 document.getElementById('autoReply').onclick=()=>{

   s.push('PearBot: Got your message! 🍐');

   localStorage.pearMessages=
     JSON.stringify(s.slice(-50));

   messages();

 };
}


/* =========================
   CAMERA
========================= */

async function camera(){

 win('Camera',`

 <video
   id="vid"
   class="video"
   autoplay
   playsinline>
 </video>

 <div class="row" style="margin-top:5px">

   <button id="start">
     Start
   </button>

   <button id="snap">
     Take Photo
   </button>

 </div>

 <p
   id="cs"
   style="font-size:10px;color:#666">
   Starting camera…
 </p>

 <canvas id="cv" hidden></canvas>

 <img
   id="pic"
   style="
     display:none;
     width:100%;
     margin-top:5px;
     border-radius:7px">

 `);

 document.getElementById('start').onclick=startCam;

 document.getElementById('snap').onclick=snap;

 await startCam();
}


async function startCam(){

 const v=document.getElementById('vid');

 const s=document.getElementById('cs');

 if(!v)return;

 if(!navigator.mediaDevices?.getUserMedia){

   s.textContent=
     'Camera unavailable.';

   return;
 }

 try{

   if(stream){

     stream
       .getTracks()
       .forEach(t=>t.stop());

   }

   stream=
     await navigator.mediaDevices.getUserMedia({
       video:{
         facingMode:{
           ideal:'environment'
         }
       },
       audio:false
     });

   v.srcObject=stream;

   await v.play();

   s.textContent=
     'Camera connected ✓';

 }catch(e){

   console.error(e);

   s.textContent=
     'Camera permission/device error.';

 }
}


function snap(){

 const v=document.getElementById('vid');

 const c=document.getElementById('cv');

 const im=document.getElementById('pic');

 if(!v?.videoWidth){

   alert(
     'Start the camera first.'
   );

   return;
 }

 c.width=v.videoWidth;

 c.height=v.videoHeight;

 c.getContext('2d')
   .drawImage(v,0,0);

 const d=
   c.toDataURL(
     'image/jpeg',
     .9
   );

 im.src=d;

 im.style.display='block';

 let a=
   JSON.parse(
     localStorage.pearPhotos||'[]'
   );

 a.unshift(d);

 localStorage.pearPhotos=
   JSON.stringify(
     a.slice(0,24)
   );
}


/* =========================
   PHOTOS
========================= */

function photos(){

 let a=
   JSON.parse(
     localStorage.pearPhotos||'[]'
   );

 win('Photos',`

 <input
   id="imp"
   type="file"
   accept="image/*"
   multiple>

 <div style="height:5px"></div>

 <div class="photos">

 ${
   a.length

   ?

   a.map(x=>`
     <img src="${x}">
   `).join('')

   :

   `
   <p style="
     grid-column:1/-1;
     text-align:center">
     No photos yet.
   </p>
   `
 }

 </div>

 <div style="margin-top:7px">

   <button id="clearPhotos">
     Clear Photos
   </button>

 </div>

 `);

 document.getElementById('imp').onchange=
 async e=>{

   let n=[];

   for(const f of e.target.files){

     n.push(
       await new Promise(r=>{

         let q=new FileReader;

         q.onload=()=>r(q.result);

         q.readAsDataURL(f);

       })
     );
   }

   localStorage.pearPhotos=
     JSON.stringify(
       [...n,...a].slice(0,24)
     );

   photos();
 };

 document.getElementById(
   'clearPhotos'
 ).onclick=()=>{

   localStorage.removeItem(
     'pearPhotos'
   );

   photos();
 };
}


/* =========================
   NOTES
========================= */

function notes(){

 let a=
   JSON.parse(
     localStorage.pearNotes||'[]'
   );

 win('Notes',`

 <div id="notesList">

 ${
   a.map((n,i)=>`

   <div
     class="stock"
     data-n="${i}">

     <b>
       ${esc(n.t)}
     </b>

     <span>
       ${esc(n.b.slice(0,35))}
     </span>

   </div>

   `).join('')
 }

 </div>

 <input
   id="nt"
   style="
     width:100%;
     margin-bottom:4px"
   placeholder="Title">

 <textarea
   id="nb"
   placeholder="Write your note…">
 </textarea>

 <div style="margin-top:4px">

   <button id="save">
     Save Note
   </button>

   <button id="newNote">
     New
   </button>

 </div>

 `);

 document
   .querySelectorAll('[data-n]')
   .forEach(x=>{

     x.onclick=()=>{

       let n=a[x.dataset.n];

       document.getElementById(
         'nt'
       ).value=n.t;

       document.getElementById(
         'nb'
       ).value=n.b;

     };

   });

 document.getElementById(
   'save'
 ).onclick=()=>{

   let t=
     document.getElementById(
       'nt'
     ).value||'Untitled';

   let b=
     document.getElementById(
       'nb'
     ).value||'';

   a.unshift({
     t:t,
     b:b
   });

   localStorage.pearNotes=
     JSON.stringify(
       a.slice(0,50)
     );

   notes();
 };

 document.getElementById(
   'newNote'
 ).onclick=()=>{

   document.getElementById(
     'nt'
   ).value='';

   document.getElementById(
     'nb'
   ).value='';

   document.getElementById(
     'nt'
   ).focus();

 };
}


/* =========================
   STOCKS
========================= */

function stocks(){

 let d=[

   [
     'AAPL',
     'Apple',
     '$229.87',
     '+1.8%'
   ],

   [
     'MSFT',
     'Microsoft',
     '$532.44',
     '+0.9%'
   ],

   [
     'TSLA',
     'Tesla',
     '$318.26',
     '-1.2%'
   ],

   [
     'PEAR',
     'Pear Inc.',
     '$99.99',
     '+4.2%'
   ]

 ];

 win('Stocks',`

 <p>
   <b>Market Watch</b>
 </p>

 ${d.map(x=>`

 <div class="stock">

   <span>

     <b>
       ${x[0]}
     </b>

     <br>

     <small>
       ${x[1]}
     </small>

   </span>

   <span>

     <b>
       ${x[2]}
     </b>

     <br>

     <small>
       ${x[3]}
     </small>

   </span>

 </div>

 `).join('')}

 <button id="refreshStocks">
   Refresh Prices
 </button>

 <p
   style="
     font-size:10px;
     color:#777">
   Market simulator
 </p>

 `);

 document.getElementById(
   'refreshStocks'
 ).onclick=()=>{

   d=d.map(x=>{

     let change=
       (Math.random()*6-3);

     let price=
       parseFloat(
         x[2].replace('$','')
       )+change;

     return[
       x[0],
       x[1],
       '$'+price.toFixed(2),
       (change>=0?'+':'')+
       change.toFixed(2)+'%'
     ];

   });

   stocks();
 };
}


/* =========================
   MAPS
========================= */

function maps(){

 win('Maps',`

 <div class="map">
   📍
 </div>

 <h3
   style="margin:5px 0">
   Pear Park
 </h3>

 <p>
   12 Pear Street · 5 min away
 </p>

 <button id="route">
   Start Route
 </button>

 <button id="locate">
   Find Me
 </button>

 <p
   id="mapStatus"
   style="
     font-size:10px;
     color:#777">
   Ready
 </p>

 `);

 document.getElementById(
   'route'
 ).onclick=e=>{

   e.target.textContent=
     'Routing…';

   setTimeout(()=>{

     e.target.textContent=
       'Arrived ✓';

     document.getElementById(
       'mapStatus'
     ).textContent=
       'You reached Pear Park.';

   },1000);

 };

 document.getElementById(
   'locate'
 ).onclick=()=>{

   document.getElementById(
     'mapStatus'
   ).textContent=
     'Current location found ✓';

 };
}


/* =========================
   WEATHER
========================= */

function weather(){

 win('Weather',`

 <div class="big">
   ☀️
 </div>

 <h2
   style="text-align:center;margin:0">
   24°
 </h2>

 <p style="text-align:center">
   Sunny · Feels like 25°
 </p>

 <div class="stock">
   <span>Today</span>
   <b>24°</b>
 </div>

 <div class="stock">
   <span>Tomorrow</span>
   <b>22° 🌤️</b>
 </div>

 <div class="stock">
   <span>Saturday</span>
   <b>19° ☁️</b>
 </div>

 <button id="weatherRefresh">
   Refresh Weather
 </button>

 `);

 document.getElementById(
   'weatherRefresh'
 ).onclick=()=>{

   weather();

 };
}


/* =========================
   CLOCK
========================= */

function clock(){

 win('Clock',`

 <div
   id="ct"
   class="big">
   --:--:--
 </div>

 <p
   style="
     text-align:center;
     color:#777">
   Local time
 </p>

 <button id="alarm">
   Set 10 Second Alarm
 </button>

 <p
   id="alarmStatus"
   style="text-align:center;font-size:10px">
 </p>

 `);

 let f=()=>{

   let e=
     document.getElementById(
       'ct'
     );

   if(e){

     e.textContent=
       new Date().toLocaleTimeString(
         [],
         {
           hour:'numeric',
           minute:'2-digit',
           second:'2-digit'
         }
       );

   }

 };

 f();

 timer=setInterval(
   f,
   1000
 );

 document.getElementById(
   'alarm'
 ).onclick=()=>{

   let s=
     document.getElementById(
       'alarmStatus'
     );

   s.textContent=
     'Alarm set! ⏰';

   setTimeout(()=>{

     if(
       document.getElementById(
         'alarmStatus'
       )
     ){

       document.getElementById(
         'alarmStatus'
       ).textContent=
         '⏰ Alarm!';

     }

   },10000);

 };
}


/* =========================
   SETTINGS
========================= */

function settings(){

 win('Settings',`

 <label
   style="
     display:flex;
     justify-content:space-between;
     padding:8px 2px">

   Dark app

   <input
     id="dark"
     type="checkbox">

 </label>

 <label
   style="
     display:flex;
     justify-content:space-between;
     padding:8px 2px">

   Sounds

   <input
     id="sounds"
     type="checkbox">

 </label>

 <button id="reset">
   Reset Saved Data
 </button>

 <p
   style="
     font-size:10px;
     color:#777">
   Pear Phone OS v1.0
 </p>

 `);

 document.getElementById(
   'dark'
 ).checked=
   localStorage.pearDark==='1';

 document.getElementById(
   'sounds'
 ).checked=
   localStorage.pearSounds!=='0';

 document.getElementById(
   'dark'
 ).onchange=e=>{

   localStorage.pearDark=
     e.target.checked?'1':'0';

 };

 document.getElementById(
   'sounds'
 ).onchange=e=>{

   localStorage.pearSounds=
     e.target.checked?'1':'0';

 };

 document.getElementById(
   'reset'
 ).onclick=()=>{

   if(
     confirm(
       'Reset Pear Phone data?'
     )
   ){

     localStorage.clear();

     location.reload();

   }

 };
}


/* =========================
   MUSIC
========================= */

function music(){

 win('PearTunes',`

 <div class="big">
   ♫
 </div>

 <div class="stock">

   <span>
     Pearadise
   </span>

   <button
     data-song="Pearadise">
     ▶
   </button>

 </div>

 <div class="stock">

   <span>
     Sunset Drive
   </span>

   <button
     data-song="Sunset Drive">
     ▶
   </button>

 </div>

 <div class="stock">

   <span>
     Electric Orchard
   </span>

   <button
     data-song="Electric Orchard">
     ▶
   </button>

 </div>

 <p
   id="musicStatus"
   style="
     text-align:center;
     font-size:10px">
 </p>

 `);

 document
   .querySelectorAll(
     '[data-song]'
   )
   .forEach(b=>{

     b.onclick=()=>{

       document.getElementById(
         'musicStatus'
       ).textContent=
         '▶ Playing '+
         b.dataset.song;

     };

   });
}


/* =========================
   PHONE
========================= */

function phone(){

 win('Phone',`

 <div class="big">
   ☎
 </div>

 <input
   id="number"
   style="width:100%"
   placeholder="Phone number">

 <div
   style="
     display:grid;
     grid-template-columns:repeat(3,1fr);
     gap:4px;
     margin-top:6px">

 ${
   [
     '1','2','3',
     '4','5','6',
     '7','8','9',
     '*','0','#'
   ]
   .map(n=>`
     <button class="dial">
       ${n}
     </button>
   `)
   .join('')
 }

 </div>

 <button
   id="call"
   style="
     width:100%;
     margin-top:5px">
   Call
 </button>

 <p
   id="callStatus"
   style="
     text-align:center;
     font-size:10px">
 </p>

 `);

 document
   .querySelectorAll('.dial')
   .forEach(b=>{

     b.onclick=()=>{

       document.getElementById(
         'number'
       ).value+=
         b.textContent.trim();

     };

   });

 document.getElementById(
   'call'
 ).onclick=()=>{

   const n=
     document.getElementById(
       'number'
     ).value;

   document.getElementById(
     'callStatus'
   ).textContent=
     n
     ?
     'Calling '+n+'…'
     :
     'Enter a number first.';

 };
}


/* =========================
   MAIL
========================= */

function mail(){

 win('Mail',`

 <h3>
   Inbox
 </h3>

 <div class="stock">

   <span>

     <b>
       Welcome to Pear OS
     </b>

     <br>

     <small>
       Your phone is ready.
     </small>

   </span>

   <span>
     9:41
   </span>

 </div>

 <div class="stock">

   <span>

     <b>
       PearTunes
     </b>

     <br>

     <small>
       New music available.
     </small>

   </span>

   <span>
     8:32
   </span>

 </div>

 <button id="compose">
   Compose
 </button>

 <div id="mailBox"></div>

 `);

 document.getElementById(
   'compose'
 ).onclick=()=>{

   document.getElementById(
     'mailBox'
   ).innerHTML=`

   <input
     id="emailTo"
     style="
       width:100%;
       margin-top:6px"
     placeholder="To">

   <textarea
     id="emailBody"
     placeholder="Message">
   </textarea>

   <button id="sendMail">
     Send Email
   </button>

   `;

   wire();
 };

 document.getElementById(
   'mailBox'
 ).onclick=e=>{

   if(
     e.target.id==='sendMail'
   ){

     document.getElementById(
       'mailBox'
     ).innerHTML=
       '<p>✓ Email sent.</p>';

   }

 };
}


/* =========================
   COMPASS
========================= */

function compass(){

 win('Compass',`

 <div
   class="big"
   id="compassFace">
   🧭
 </div>

 <h2
   id="degrees"
   style="text-align:center">
   0°
 </h2>

 <p
   id="direction"
   style="text-align:center">
   North
 </p>

 <button id="rotateCompass">
   Rotate Compass
 </button>

 `);

 document.getElementById(
   'rotateCompass'
 ).onclick=()=>{

   let d=
     Math.floor(
       Math.random()*360
     );

   let dir=
     d<45||d>=315
     ?
     'North'
     :
     d<135
     ?
     'East'
     :
     d<225
     ?
     'South'
     :
     'West';

   document.getElementById(
     'degrees'
   ).textContent=
     d+'°';

   document.getElementById(
     'direction'
   ).textContent=
     dir;

 };
}


/* =========================
   SPLASHFACE
========================= */

function splashface(){

 win('SplashFace',`

 <div class="big">
   Sf
 </div>

 <h3
   style="text-align:center">
   SplashFace
 </h3>

 <p style="text-align:center">
   What's happening?
 </p>

 <textarea
   id="postText"
   placeholder="Write a post...">
 </textarea>

 <button id="post">
   Post
 </button>

 <div
   id="feed"
   style="margin-top:6px">
 </div>

 `);

 document.getElementById(
   'post'
 ).onclick=()=>{

   const box=
     document.getElementById(
       'postText'
     );

   const v=box.value.trim();

   if(!v)return;

   document.getElementById(
     'feed'
   ).innerHTML=
     `<div class="bubble me">
       ${esc(v)}
     </div>`+
     document.getElementById(
       'feed'
     ).innerHTML;

   box.value='';

 };
}


/* =========================
   VIDEOS
========================= */

function videos(){

 win('Videos',`

 <div class="big">
   ▶
 </div>

 <div class="stock">

   <span>

     <b>
       Pear Phone Tour
     </b>

     <br>

     <small>
       2:14
     </small>

   </span>

   <button
     data-video="Pear Phone Tour">
     ▶
   </button>

 </div>

 <div class="stock">

   <span>

     <b>
       Making Pear OS
     </b>

     <br>

     <small>
       4:21
     </small>

   </span>

   <button
     data-video="Making Pear OS">
     ▶
   </button>

 </div>

 <p
   id="videoStatus"
   style="
     text-align:center;
     font-size:10px">
 </p>

 `);

 document
   .querySelectorAll(
     '[data-video]'
   )
   .forEach(b=>{

     b.onclick=()=>{

       document.getElementById(
         'videoStatus'
       ).textContent=
         '▶ Playing '+
         b.dataset.video;

     };

   });
}


/* =========================
   KEYBOARD
========================= */

function buildK(){

 K.innerHTML='';

 [
   '1234567890',
   'QWERTYUIOP',
   'ASDFGHJKL⌫',
   'ZXCVBNM,.↵'
 ].forEach(r=>{

   [...r].forEach(k=>{

     let b=
       document.createElement(
         'button'
       );

     b.textContent=k;

     b.onclick=()=>{

       if(!target)return;

       if(k==='⌫'){

         target.value=
           target.value.slice(0,-1);

       }else if(k==='↵'){

         target.dispatchEvent(
           new KeyboardEvent(
             'keydown',
             {
               key:'Enter'
             }
           )
         );

       }else{

         target.value+=
           k.toLowerCase();

       }

     };

     K.appendChild(b);

   });

 });

 let sp=
   document.createElement(
     'button'
   );

 sp.textContent='SPACE';

 sp.className='space';

 sp.onclick=()=>{

   if(target)
     target.value+=' ';

 };

 let done=
   document.createElement(
     'button'
   );

 done.textContent='DONE';

 done.className='wide';

 done.onclick=()=>{

   K.classList.remove(
     'show'
   );

   target=null;

 };

 K.append(
   sp,
   done
 );
}


/* =========================
   INPUT WIRING
========================= */

function wire(){

 A.querySelectorAll(
   'input:not([type=file]),textarea'
 ).forEach(e=>{

   e.onfocus=()=>{

     target=e;

     K.classList.add(
       'show'
     );

   };

 });
}

buildK();


/* =========================
   APP CLICKING
========================= */

P.addEventListener(
 'click',
 e=>{

   const b=
     e.target.closest(
       '[data-app]'
     );

   if(!b)return;

   e.preventDefault();

   e.stopPropagation();

   launch(
     b.dataset.app
   );

 }
);


/* =========================
   PAGE SWITCHING
========================= */

function page(n){

 currentPage=n;

 if(n===1){

   p1.style.display='block';

   p2.style.display='none';

 }else{

   p1.style.display='none';

   p2.style.display='grid';

 }

 F.classList.remove(
   'go'
 );

 void F.offsetWidth;

 F.classList.add(
   'go'
 );
}


/* =========================
   HOME BUTTON
========================= */

document
 .getElementById('home')
 .addEventListener(
   'click',
   e=>{

     e.preventDefault();

     e.stopPropagation();

     close();

     page(1);

   }
 );


/* =========================
   RELIABLE TOUCH / MOUSE /
   TRACKPAD PAGE SWITCHING
========================= */

let startX=0;
let startY=0;
let dragging=false;

P.addEventListener(
 'pointerdown',
 e=>{

   if(
     O.classList.contains(
       'open'
     )
   )return;

   startX=e.clientX;

   startY=e.clientY;

   dragging=true;

   try{

     P.setPointerCapture(
       e.pointerId
     );

   }catch(err){}

 }
);


P.addEventListener(
 'pointerup',
 e=>{

   if(!dragging)return;

   dragging=false;

   const dx=
     e.clientX-startX;

   const dy=
     e.clientY-startY;

   /*
    * UP = PAGE 2
    * DOWN = PAGE 1
    */

   if(
     Math.abs(dy)>30 &&
     Math.abs(dy)>Math.abs(dx)
   ){

     if(dy<0){

       page(2);

     }else{

       page(1);

     }

   }

 }
);


P.addEventListener(
 'pointercancel',
 ()=>{
   dragging=false;
 }
);


/* =========================
   KEYBOARD CONTROLS
========================= */

window.addEventListener(
 'keydown',
 e=>{

   if(
     e.key==='ArrowUp'
   ){

     e.preventDefault();

     page(2);

   }

   if(
     e.key==='ArrowDown'
   ){

     e.preventDefault();

     page(1);

   }

   if(
     e.key==='Escape'
   ){

     close();

   }

 }
);


/* =========================
   START
========================= */

page(1);

})();
