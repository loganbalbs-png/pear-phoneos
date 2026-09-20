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

function close(){
 if(stream){
   stream.getTracks().forEach(t=>t.stop());
   stream=null
 }
 clearInterval(timer);
 K.classList.remove('show');
 target=null;
 O.classList.remove('open');
 A.innerHTML=''
}

function win(t,h){
 close();

 A.innerHTML=`
 <div class="head">
   <button id="back">‹</button>
   <span>${esc(t)}</span>
 </div>
 <div class="body">${h}</div>
 `;

 O.classList.add('open');

 document.getElementById('back').onclick=close;

 wire();
}

function simple(t,h){
 win(t,h)
}

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
   return simple('Pear OS',`
   <div class="big">🍐</div>
   <p style="text-align:center">${esc(id)} opened.</p>
   `)
 }
}


/* MESSAGES */

function messages(){

 let s=JSON.parse(localStorage.pearMessages||'[]');

 win('Messages',`

 <div id="chat" style="min-height:90px">
   <div class="bubble">Hey 👋</div>
   <div class="bubble">Welcome to Pear Phone.</div>
   ${s.map(x=>`<div class="bubble me">${esc(x)}</div>`).join('')}
 </div>

 <div class="row">
   <input id="mi" style="flex:1" placeholder="Message">
   <button id="send">Send</button>
 </div>

 <div style="margin-top:7px">
   <button id="clearChat">Clear</button>
   <button id="autoReply">Auto Reply</button>
 </div>
 `);

 let i=document.getElementById('mi');

 document.getElementById('send').onclick=()=>{
   let v=i.value.trim();

   if(v){
     s.push(v);
     localStorage.pearMessages=JSON.stringify(s.slice(-50));
     messages()
   }
 };

 i.onkeydown=e=>{
   if(e.key==='Enter'){
     document.getElementById('send').click()
   }
 };

 document.getElementById('clearChat').onclick=()=>{
   localStorage.removeItem('pearMessages');
   messages()
 };

 document.getElementById('autoReply').onclick=()=>{
   s.push('PearBot: Got your message! 🍐');
   localStorage.pearMessages=JSON.stringify(s.slice(-50));
   messages()
 }
}


/* CAMERA */

async function camera(){

 win('Camera',`

 <video id="vid" class="video" autoplay playsinline></video>

 <div class="row" style="margin-top:5px">
   <button id="start">Start</button>
   <button id="snap">Take Photo</button>
 </div>

 <p id="cs" style="font-size:10px;color:#666">
 Starting camera…
 </p>

 <canvas id="cv" hidden></canvas>

 <img id="pic"
      style="display:none;width:100%;margin-top:5px;border-radius:7px">

 `);

 document.getElementById('start').onclick=startCam;
 document.getElementById('snap').onclick=snap;

 await startCam()
}

async function startCam(){

 let v=document.getElementById('vid');
 let s=document.getElementById('cs');

 if(!v)return;

 if(!navigator.mediaDevices?.getUserMedia){
   s.textContent='Camera unavailable.';
   return
 }

 try{

   if(stream)
     stream.getTracks().forEach(t=>t.stop());

   stream=await navigator.mediaDevices.getUserMedia({
     video:{
       facingMode:{ideal:'environment'}
     },
     audio:false
   });

   v.srcObject=stream;

   await v.play();

   s.textContent='Camera connected ✓'

 }catch(e){

   console.error(e);

   s.textContent='Camera permission/device error.'
 }
}

function snap(){

 let v=document.getElementById('vid'),
     c=document.getElementById('cv'),
     im=document.getElementById('pic');

 if(!v?.videoWidth){
   alert('Start the camera first.');
   return
 }

 c.width=v.videoWidth;
 c.height=v.videoHeight;

 c.getContext('2d').drawImage(v,0,0);

 let d=c.toDataURL('image/jpeg',.9);

 im.src=d;
 im.style.display='block';

 let a=JSON.parse(localStorage.pearPhotos||'[]');

 a.unshift(d);

 localStorage.pearPhotos=JSON.stringify(a.slice(0,24))
}


/* PHOTOS */

function photos(){

 let a=JSON.parse(localStorage.pearPhotos||'[]');

 win('Photos',`

 <input id="imp" type="file" accept="image/*" multiple>

 <div style="height:5px"></div>

 <div class="photos">
 ${
 a.length
 ?
 a.map(x=>`<img src="${x}">`).join('')
 :
 '<p style="grid-column:1/-1;text-align:center">No photos yet.</p>'
 }
 </div>

 <div style="margin-top:7px">
   <button id="clearPhotos">Clear Photos</button>
 </div>

 `);

 document.getElementById('imp').onchange=async e=>{

   let n=[];

   for(const f of e.target.files){

     n.push(await new Promise(r=>{

       let q=new FileReader;

       q.onload=()=>r(q.result);

       q.readAsDataURL(f)

     }))
   }

   localStorage.pearPhotos=
     JSON.stringify([...n,...a].slice(0,24));

   photos()
 };

 document.getElementById('clearPhotos').onclick=()=>{
   localStorage.removeItem('pearPhotos');
   photos()
 }
}


/* NOTES */

function notes(){

 let a=JSON.parse(localStorage.pearNotes||'[]');

 win('Notes',`

 <div id="notesList">
 ${
 a.map((n,i)=>`
   <div class="stock" data-n="${i}">
     <b>${esc(n.t)}</b>
     <span>${esc(n.b.slice(0,35))}</span>
   </div>
 `).join('')
 }
 </div>

 <input id="nt"
        style="width:100%;margin-bottom:4px"
        placeholder="Title">

 <textarea id="nb"
           placeholder="Write your note…"></textarea>

 <div style="margin-top:4px">
   <button id="save">Save Note</button>
   <button id="newNote">New</button>
 </div>
 `);

 document.querySelectorAll('[data-n]').forEach(x=>{

   x.onclick=()=>{

     let n=a[x.dataset.n];

     nt.value=n.t;
     nb.value=n.b
   }
 });

 document.getElementById('save').onclick=()=>{

   let t=nt.value||'Untitled';
   let b=nb.value||'';

   a.unshift({t,b});

   localStorage.pearNotes=
     JSON.stringify(a.slice(0,50));

   notes()
 };

 document.getElementById('newNote').onclick=()=>{
   nt.value='';
   nb.value='';
   nt.focus()
 }
}


/* STOCKS */

function stocks(){

 let d=[
  ['AAPL','Apple','$229.87','+1.8%'],
  ['MSFT','Microsoft','$532.44','+0.9%'],
  ['TSLA','Tesla','$318.26','-1.2%'],
  ['PEAR','Pear Inc.','$99.99','+4.2%']
 ];

 win('Stocks',`

 <p><b>Market Watch</b></p>

 ${d.map((x,i)=>`

 <div class="stock">
   <span>
     <b>${x[0]}</b><br>
     <small>${x[1]}</small>
   </span>

   <span>
     <b>${x[2]}</b><br>
     <small>${x[3]}</small>
   </span>
 </div>

 `).join('')}

 <button id="refreshStocks">Refresh Prices</button>
 <p id="stockStatus" style="font-size:10px;color:#777">
 Last updated just now
 </p>
 `);

 document.getElementById('refreshStocks').onclick=()=>{

   d=d.map(x=>{

     let n=(Math.random()*6-3).toFixed(2);

     return[
       x[0],
       x[1],
       '$'+(parseFloat(x[2].replace('$',''))+parseFloat(n)).toFixed(2),
       (n>=0?'+':'')+n+'%'
     ]
   });

   stocks()
 }
}


/* MAPS */

function maps(){

 win('Maps',`

 <div class="map">📍</div>

 <h3 style="margin:5px 0">Pear Park</h3>

 <p>12 Pear Street · 5 min away</p>

 <button id="route">Start Route</button>

 <button id="locate">Find Me</button>

 <p id="mapStatus"
    style="font-size:10px;color:#777">
   Ready
 </p>
 `);

 document.getElementById('route').onclick=e=>{
   e.target.textContent='Routing…';

   setTimeout(()=>{
     e.target.textContent='Arrived ✓';
     document.getElementById('mapStatus').textContent=
       'You reached Pear Park.'
   },1000)
 };

 document.getElementById('locate').onclick=()=>{
   document.getElementById('mapStatus').textContent=
     'Current location found ✓'
 }
}


/* WEATHER */

function weather(){

 let temps=[22,23,24,25,21];

 win('Weather',`

 <div class="big">☀️</div>

 <h2 style="text-align:center;margin:0">24°</h2>

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

 <button id="weatherRefresh">Refresh Weather</button>

 `);

 document.getElementById('weatherRefresh').onclick=()=>{
   weather()
 }
}


/* CLOCK */

function clock(){

 win('Clock',`

 <div id="ct" class="big">--:--:--</div>

 <p style="text-align:center;color:#777">
 Local time
 </p>

 <button id="alarm">Set 10 Second Alarm</button>

 <p id="alarmStatus"
    style="text-align:center;font-size:10px">
 </p>
 `);

 let f=()=>{

   let e=document.getElementById('ct');

   if(e)
     e.textContent=
       new Date().toLocaleTimeString([],{
         hour:'numeric',
         minute:'2-digit',
         second:'2-digit'
       })
 };

 f();

 timer=setInterval(f,1000);

 document.getElementById('alarm').onclick=()=>{

   let s=document.getElementById('alarmStatus');

   s.textContent='Alarm set! ⏰';

   setTimeout(()=>{

     if(document.getElementById('alarmStatus'))
       document.getElementById('alarmStatus').textContent=
         '⏰ Alarm!'

   },10000)
 }
}


/* SETTINGS */

function settings(){

 win('Settings',`

 <label style="
 display:flex;
 justify-content:space-between;
 padding:8px 2px">

 Dark app

 <input id="dark" type="checkbox">

 </label>

 <label style="
 display:flex;
 justify-content:space-between;
 padding:8px 2px">

 Sounds

 <input id="sounds" type="checkbox">

 </label>

 <button id="reset">Reset Saved Data</button>

 <p style="font-size:10px;color:#777">
 Pear Phone OS v1.0
 </p>
 `);

 dark.checked=localStorage.pearDark==='1';

 sounds.checked=
   localStorage.pearSounds!=='0';

 dark.onchange=e=>{
   localStorage.pearDark=
     e.target.checked?'1':'0'
 };

 sounds.onchange=e=>{
   localStorage.pearSounds=
     e.target.checked?'1':'0'
 };

 reset.onclick=()=>{

   if(confirm('Reset Pear Phone data?')){

     localStorage.clear();
     location.reload()
   }
 }
}


/* MUSIC */

function music(){

 win('PearTunes',`

 <div class="big">♫</div>

 <div class="stock">
   <span>Pearadise</span>
   <button data-song="Pearadise">▶</button>
 </div>

 <div class="stock">
   <span>Sunset Drive</span>
   <button data-song="Sunset Drive">▶</button>
 </div>

 <div class="stock">
   <span>Electric Orchard</span>
   <button data-song="Electric Orchard">▶</button>
 </div>

 <p id="musicStatus"
    style="text-align:center;font-size:10px">
 </p>
 `);

 document.querySelectorAll('[data-song]').forEach(b=>{

   b.onclick=()=>{

     document.getElementById('musicStatus').textContent=
       '▶ Playing '+b.dataset.song
   }
 })
}


/* PHONE */

function phone(){

 win('Phone',`

 <div class="big">☎</div>

 <input id="number"
        style="width:100%"
        placeholder="Phone number">

 <div style="
 display:grid;
 grid-template-columns:repeat(3,1fr);
 gap:4px;
 margin-top:6px">

 ${['1','2','3','4','5','6','7','8','9','*','0','#']
   .map(n=>`<button class="dial">${n}</button>`).join('')}

 </div>

 <button id="call"
         style="width:100%;margin-top:5px">
   Call
 </button>

 <p id="callStatus"
    style="text-align:center;font-size:10px">
 </p>
 `);

 document.querySelectorAll('.dial').forEach(b=>{

   b.onclick=()=>{
     number.value+=b.textContent
   }
 });

 document.getElementById('call').onclick=()=>{

   let n=number.value;

   document.getElementById('callStatus').textContent=
     n?'Calling '+n+'…':'Enter a number first.'
 }
}


/* MAIL */

function mail(){

 win('Mail',`

 <h3>Inbox</h3>

 <div class="stock">
   <span>
     <b>Welcome to Pear OS</b><br>
     <small>Your phone is ready.</small>
   </span>
   <span>9:41</span>
 </div>

 <div class="stock">
   <span>
     <b>PearTunes</b><br>
     <small>New music available.</small>
   </span>
   <span>8:32</span>
 </div>

 <button id="compose">Compose</button>

 <div id="mailBox"></div>
 `);

 document.getElementById('compose').onclick=()=>{

   document.getElementById('mailBox').innerHTML=`

   <input id="emailTo"
          style="width:100%;margin-top:6px"
          placeholder="To">

   <textarea id="emailBody"
             placeholder="Message"></textarea>

   <button id="sendMail">Send Email</button>
   `
 };

 document.getElementById('mailBox').onclick=e=>{

   if(e.target.id==='sendMail'){

     document.getElementById('mailBox').innerHTML=
       '<p>✓ Email sent.</p>'
   }
 }
}


/* COMPASS */

function compass(){

 win('Compass',`

 <div class="big" id="compassFace">
   🧭
 </div>

 <h2 id="degrees"
     style="text-align:center">
   0°
 </h2>

 <p style="text-align:center">
   North
 </p>

 <button id="rotateCompass">
   Rotate Compass
 </button>
 `);

 document.getElementById('rotateCompass').onclick=()=>{

   let d=Math.floor(Math.random()*360);

   let dir=
     d<45||d>=315?'North':
     d<135?'East':
     d<225?'South':'West';

   document.getElementById('degrees').textContent=d+'°';

   document.querySelector('.body p').textContent=dir
 }
}


/* SPLASHFACE */

function splashface(){

 win('SplashFace',`

 <div class="big">Sf</div>

 <h3 style="text-align:center">
   SplashFace
 </h3>

 <p style="text-align:center">
   What's happening?
 </p>

 <textarea id="postText"
           placeholder="Write a post..."></textarea>

 <button id="post">
   Post
 </button>

 <div id="feed" style="margin-top:6px">
 </div>
 `);

 document.getElementById('post').onclick=()=>{

   let v=document.getElementById('postText').value.trim();

   if(!v)return;

   document.getElementById('feed').innerHTML=
     `<div class="bubble me">
       ${esc(v)}
     </div>`+
     document.getElementById('feed').innerHTML;

   document.getElementById('postText').value=''
 }
}


/* VIDEOS */

function videos(){

 win('Videos',`

 <div class="big">▶</div>

 <div class="stock">
   <span>
     <b>Pear Phone Tour</b><br>
     <small>2:14</small>
   </span>

   <button data-video="Pear Phone Tour">
     ▶
   </button>
 </div>

 <div class="stock">
   <span>
     <b>Making Pear OS</b><br>
     <small>4:21</small>
   </span>

   <button data-video="Making Pear OS">
     ▶
   </button>
 </div>

 <p id="videoStatus"
    style="text-align:center;font-size:10px">
 </p>
 `);

 document.querySelectorAll('[data-video]').forEach(b=>{

   b.onclick=()=>{

     document.getElementById('videoStatus').textContent=
       '▶ Playing '+b.dataset.video
   }
 })
}


/* KEYBOARD */

function buildK(){

 K.innerHTML='';

 [
   '1234567890',
   'QWERTYUIOP',
   'ASDFGHJKL⌫',
   'ZXCVBNM,.↵'
 ].forEach(r=>{

   [...r].forEach(k=>{

     let b=document.createElement('button');

     b.textContent=k;

     b.onclick=()=>{

       if(!target)return;

       if(k==='⌫')
         target.value=target.value.slice(0,-1);

       else if(k==='↵')
         target.dispatchEvent(
           new KeyboardEvent('keydown',{key:'Enter'})
         );

       else
         target.value+=k.toLowerCase()
     };

     K.appendChild(b)
   })
 });

 let sp=document.createElement('button');

 sp.textContent='SPACE';
 sp.className='space';

 sp.onclick=()=>{
   if(target)target.value+=' '
 };

 let done=document.createElement('button');

 done.textContent='DONE';
 done.className='wide';

 done.onclick=()=>{
   K.classList.remove('show');
   target=null
 };

 K.append(sp,done)
}


/* INPUT KEYBOARD */

function wire(){

 A.querySelectorAll(
   'input:not([type=file]),textarea'
 ).forEach(e=>{

   e.onfocus=()=>{
     target=e;
     K.classList.add('show')
   }
 })
}

buildK();


/* APP CLICKING */

P.addEventListener('click',e=>{

 let b=e.target.closest('[data-app]');

 if(b){

   e.preventDefault();
   e.stopPropagation();

   launch(b.dataset.app)
 }
});


/* HOME */

document.getElementById('home').onclick=()=>{

 currentPage=1;

 p1.style.display='block';
 p2.style.display='none';

 close()
};


/* PAGE SWITCH */

function page(n){

 currentPage=n;

 p1.style.display=n===1?'block':'none';

 p2.style.display=n===2?'grid':'none';

 F.classList.remove('go');

 void F.offsetWidth;

 F.classList.add('go')
}


/* TOUCH SWIPE */

P.addEventListener('touchstart',e=>{

 if(!O.classList.contains('open'))
   sy=e.touches[0].clientY

},{passive:true});


P.addEventListener('touchend',e=>{

 if(sy==null)return;

 let d=e.changedTouches[0].clientY-sy;

 sy=null;

 if(Math.abs(d)>35){

   if(d<0)
     page(2);
   else
     page(1)
 }

},{passive:true});


/* MOUSE / TRACKPAD DRAG */

let my=null;

P.addEventListener('mousedown',e=>{

 if(!O.classList.contains('open'))
   my=e.clientY
});

P.addEventListener('mouseup',e=>{

 if(my==null)return;

 let d=e.clientY-my;

 my=null;

 if(Math.abs(d)>35){

   if(d<0)
     page(2);
   else
     page(1)
 }
});


/* KEYBOARD */

window.addEventListener('keydown',e=>{

 if(e.key==='ArrowUp'){
   e.preventDefault();
   page(2)
 }

 if(e.key==='ArrowDown'){
   e.preventDefault();
   page(1)
 }

 if(e.key==='Escape')
   close()
});


/* START */

page(1);

})();
