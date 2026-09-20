(()=>{
const P=document.getElementById('phone');
const O=document.getElementById('overlay');
const A=document.getElementById('app');
const K=document.getElementById('keyboard');
const p1=document.getElementById('page1');
const p2=document.getElementById('page2');

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


/* =========================
   CLOSE APP
========================= */

function close(){

  if(stream){
    stream.getTracks().forEach(t=>t.stop());
    stream=null;
  }

  clearInterval(timer);
  timer=null;

  K.classList.remove('show');

  target=null;

  O.classList.remove('open');

  A.innerHTML='';
}


/* =========================
   OPEN APP WINDOW
========================= */

function win(title,html){

  close();

  A.innerHTML=`
    <div class="head">
      <button id="back">‹</button>
      <span>${esc(title)}</span>
    </div>

    <div class="body">
      ${html}
    </div>
  `;

  O.classList.add('open');

  const back=document.getElementById('back');

  if(back){
    back.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      close();
    };
  }

  wire();
}


function simple(title,html){
  win(title,html);
}


/* =========================
   APP LAUNCHER
========================= */

function launch(id){

  switch(id){

    case 'messages':
      messages();
      break;

    case 'camera':
      camera();
      break;

    case 'photos':
      photos();
      break;

    case 'notes':
      notes();
      break;

    case 'stocks':
      stocks();
      break;

    case 'maps':
      maps();
      break;

    case 'weather':
      weather();
      break;

    case 'clock':
      clock();
      break;

    case 'settings':
      settings();
      break;

    case 'peartunes':
    case 'music':
      music();
      break;

    case 'phone':
      phone();
      break;

    case 'mail':
      mail();
      break;

    case 'compass':
      compass();
      break;

    case 'splashface':
      splashface();
      break;

    case 'videos':
      videos();
      break;

    default:
      simple(
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

  let saved=localStorage.getItem('pearMessages');

  let list=saved ? JSON.parse(saved) : [];

  win('Messages',`

    <div id="chat">

      <div class="bubble">
        Hey 👋
      </div>

      <div class="bubble">
        Welcome to Pear Phone.
      </div>

      ${
        list.map(x=>`
          <div class="bubble me">
            ${esc(x)}
          </div>
        `).join('')
      }

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

    <div style="margin-top:6px">

      <button id="autoReply">
        Auto Reply
      </button>

      <button id="clearChat">
        Clear
      </button>

    </div>

  `);

  const input=document.getElementById('mi');

  document.getElementById('send').onclick=()=>{

    const value=input.value.trim();

    if(!value)return;

    list.push(value);

    localStorage.setItem(
      'pearMessages',
      JSON.stringify(list.slice(-50))
    );

    messages();
  };

  input.onkeydown=e=>{
    if(e.key==='Enter'){
      document.getElementById('send').click();
    }
  };

  document.getElementById('autoReply').onclick=()=>{

    list.push(
      'PearBot: Got your message! 🍐'
    );

    localStorage.setItem(
      'pearMessages',
      JSON.stringify(list.slice(-50))
    );

    messages();
  };

  document.getElementById('clearChat').onclick=()=>{

    localStorage.removeItem(
      'pearMessages'
    );

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
        Start Camera
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

  const video=document.getElementById('vid');
  const status=document.getElementById('cs');

  if(!video)return;

  if(!navigator.mediaDevices ||
     !navigator.mediaDevices.getUserMedia){

    status.textContent=
      'Camera unavailable.';

    return;
  }

  try{

    if(stream){
      stream.getTracks().forEach(t=>t.stop());
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

    video.srcObject=stream;

    await video.play();

    status.textContent=
      'Camera connected ✓';

  }catch(error){

    console.error(error);

    status.textContent=
      'Camera permission/device error.';

  }
}


function snap(){

  const video=document.getElementById('vid');
  const canvas=document.getElementById('cv');
  const image=document.getElementById('pic');

  if(!video || !video.videoWidth){

    alert(
      'Start the camera first.'
    );

    return;
  }

  canvas.width=video.videoWidth;
  canvas.height=video.videoHeight;

  canvas
    .getContext('2d')
    .drawImage(
      video,
      0,
      0
    );

  const data=
    canvas.toDataURL(
      'image/jpeg',
      .9
    );

  image.src=data;
  image.style.display='block';

  let photosSaved=
    JSON.parse(
      localStorage.pearPhotos || '[]'
    );

  photosSaved.unshift(data);

  localStorage.pearPhotos=
    JSON.stringify(
      photosSaved.slice(0,24)
    );
}


/* =========================
   PHOTOS
========================= */

function photos(){

  let list=
    JSON.parse(
      localStorage.pearPhotos || '[]'
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
        list.length

        ?

        list.map(image=>`
          <img src="${image}">
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

    <div style="margin-top:6px">

      <button id="clearPhotos">
        Clear Photos
      </button>

    </div>

  `);

  document.getElementById('imp').onchange=
  async event=>{

    const files=event.target.files;

    let imported=[];

    for(const file of files){

      imported.push(
        await new Promise(resolve=>{

          const reader=
            new FileReader();

          reader.onload=()=>{
            resolve(reader.result);
          };

          reader.readAsDataURL(file);

        })
      );
    }

    localStorage.pearPhotos=
      JSON.stringify(
        [...imported,...list].slice(0,24)
      );

    photos();
  };

  document.getElementById('clearPhotos').onclick=()=>{

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

  let list=
    JSON.parse(
      localStorage.pearNotes || '[]'
    );

  win('Notes',`

    <div>

      ${
        list.map((note,index)=>`

          <div
            class="stock"
            data-note="${index}">

            <b>
              ${esc(note.t)}
            </b>

            <span>
              ${esc(
                note.b.slice(0,35)
              )}
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
      placeholder="Write your note...">
    </textarea>

    <div style="margin-top:4px">

      <button id="saveNote">
        Save Note
      </button>

      <button id="newNote">
        New
      </button>

    </div>

  `);

  document
    .querySelectorAll('[data-note]')
    .forEach(item=>{

      item.onclick=()=>{

        const note=
          list[
            item.dataset.note
          ];

        document.getElementById('nt').value=
          note.t;

        document.getElementById('nb').value=
          note.b;
      };

    });

  document.getElementById('saveNote').onclick=()=>{

    const title=
      document.getElementById('nt').value.trim()
      ||'Untitled';

    const body=
      document.getElementById('nb').value;

    list.unshift({
      t:title,
      b:body
    });

    localStorage.pearNotes=
      JSON.stringify(
        list.slice(0,50)
      );

    notes();
  };

  document.getElementById('newNote').onclick=()=>{

    document.getElementById('nt').value='';
    document.getElementById('nb').value='';

    document.getElementById('nt').focus();
  };
}


/* =========================
   STOCKS
========================= */

function stocks(){

  const data=[
    ['AAPL','Apple','$229.87','+1.8%'],
    ['MSFT','Microsoft','$532.44','+0.9%'],
    ['TSLA','Tesla','$318.26','-1.2%'],
    ['PEAR','Pear Inc.','$99.99','+4.2%']
  ];

  win('Stocks',`

    <p>
      <b>Market Watch</b>
    </p>

    ${
      data.map(stock=>`

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

      `).join('')
    }

    <button id="refreshStocks">
      Refresh Prices
    </button>

  `);

  document.getElementById('refreshStocks').onclick=()=>{
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

    <h3>
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

  document.getElementById('route').onclick=e=>{

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

  document.getElementById('locate').onclick=()=>{

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

    <h2 style="text-align:center;margin:0">
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

    <button id="refreshWeather">
      Refresh Weather
    </button>

  `);

  document.getElementById(
    'refreshWeather'
  ).onclick=weather;
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

    <p style="
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

  const update=()=>{

    const element=
      document.getElementById('ct');

    if(element){

      element.textContent=
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

  update();

  timer=setInterval(
    update,
    1000
  );

  document.getElementById('alarm').onclick=()=>{

    const status=
      document.getElementById(
        'alarmStatus'
      );

    status.textContent=
      'Alarm set! ⏰';

    setTimeout(()=>{

      const current=
        document.getElementById(
          'alarmStatus'
        );

      if(current){
        current.textContent=
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

    <label style="
      display:flex;
      justify-content:space-between;
      padding:8px">

      Dark app

      <input
        id="dark"
        type="checkbox">

    </label>

    <label style="
      display:flex;
      justify-content:space-between;
      padding:8px">

      Sounds

      <input
        id="sounds"
        type="checkbox">

    </label>

    <button id="reset">
      Reset Saved Data
    </button>

    <p style="
      font-size:10px;
      color:#777">
      Pear Phone OS v1.0
    </p>

  `);

  document.getElementById('dark').checked=
    localStorage.pearDark==='1';

  document.getElementById('sounds').checked=
    localStorage.pearSounds!=='0';

  document.getElementById('dark').onchange=e=>{
    localStorage.pearDark=
      e.target.checked?'1':'0';
  };

  document.getElementById('sounds').onchange=e=>{
    localStorage.pearSounds=
      e.target.checked?'1':'0';
  };

  document.getElementById('reset').onclick=()=>{

    if(confirm('Reset Pear Phone data?')){

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

      <button data-song="Pearadise">
        ▶
      </button>

    </div>

    <div class="stock">

      <span>
        Sunset Drive
      </span>

      <button data-song="Sunset Drive">
        ▶
      </button>

    </div>

    <div class="stock">

      <span>
        Electric Orchard
      </span>

      <button data-song="Electric Orchard">
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
    .querySelectorAll('[data-song]')
    .forEach(button=>{

      button.onclick=()=>{

        document.getElementById(
          'musicStatus'
        ).textContent=
          '▶ Playing '+
          button.dataset.song;
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

    <div style="
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
        ].map(n=>`

          <button class="dial">
            ${n}
          </button>

        `).join('')
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
    .forEach(button=>{

      button.onclick=()=>{

        document.getElementById(
          'number'
        ).value+=
          button.textContent.trim();

      };
    });

  document.getElementById('call').onclick=()=>{

    const number=
      document.getElementById(
        'number'
      ).value;

    document.getElementById(
      'callStatus'
    ).textContent=
      number
      ?
      'Calling '+number+'…'
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

  document.getElementById('compose').onclick=()=>{

    document.getElementById(
      'mailBox'
    ).innerHTML=`

      <input
        id="emailTo"
        style="
          width:100%;
          margin-top:5px"
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

  document.getElementById('mailBox').onclick=e=>{

    if(e.target.id==='sendMail'){

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

    const degree=
      Math.floor(
        Math.random()*360
      );

    let direction;

    if(degree<45 || degree>=315)
      direction='North';
    else if(degree<135)
      direction='East';
    else if(degree<225)
      direction='South';
    else
      direction='West';

    document.getElementById(
      'degrees'
    ).textContent=
      degree+'°';

    document.getElementById(
      'direction'
    ).textContent=
      direction;
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

    <h3 style="text-align:center">
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

  document.getElementById('post').onclick=()=>{

    const text=
      document.getElementById(
        'postText'
      );

    const value=text.value.trim();

    if(!value)return;

    document.getElementById(
      'feed'
    ).innerHTML=
      `
      <div class="bubble me">
        ${esc(value)}
      </div>
      `
      +
      document.getElementById(
        'feed'
      ).innerHTML;

    text.value='';
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

      <button data-video="Pear Phone Tour">
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

      <button data-video="Making Pear OS">
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
    .querySelectorAll('[data-video]')
    .forEach(button=>{

      button.onclick=()=>{

        document.getElementById(
          'videoStatus'
        ).textContent=
          '▶ Playing '+
          button.dataset.video;
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
  ].forEach(row=>{

    [...row].forEach(key=>{

      const button=
        document.createElement(
          'button'
        );

      button.textContent=key;

      button.onclick=()=>{

        if(!target)return;

        if(key==='⌫'){

          target.value=
            target.value.slice(0,-1);

        }else if(key==='↵'){

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
            key.toLowerCase();
        }
      };

      K.appendChild(button);
    });
  });

  const space=
    document.createElement('button');

  space.textContent='SPACE';
  space.className='space';

  space.onclick=()=>{

    if(target)
      target.value+=' ';
  };

  const done=
    document.createElement('button');

  done.textContent='DONE';
  done.className='wide';

  done.onclick=()=>{

    K.classList.remove('show');

    target=null;
  };

  K.append(
    space,
    done
  );
}


/* =========================
   INPUTS
========================= */

function wire(){

  A
    .querySelectorAll(
      'input:not([type=file]),textarea'
    )
    .forEach(input=>{

      input.onfocus=()=>{

        target=input;

        K.classList.add('show');
      };
    });
}

buildK();


/* =====================================================
   IMPORTANT APP CLICK FIX
   ===================================================== */

function handleAppClick(e){

  const button=
    e.target.closest(
      '[data-app]'
    );

  if(!button)return;

  e.preventDefault();
  e.stopPropagation();

  const app=
    button.getAttribute(
      'data-app'
    );

  if(app){
    launch(app);
  }
}


/*
   Use pointerup AND click.

   This makes the icons work with:
   - Raspberry Pi touchscreen
   - mouse
   - trackpad
   - normal browser clicks
*/

P.addEventListener(
  'pointerup',
  e=>{

    if(
      e.target.closest(
        '[data-app]'
      )
    ){

      handleAppClick(e);
    }
  },
  true
);

P.addEventListener(
  'click',
  e=>{

    if(
      e.target.closest(
        '[data-app]'
      )
    ){

      handleAppClick(e);
    }
  },
  true
);


/* =========================
   PAGE SWITCHING
========================= */

function page(number){

  currentPage=number;

  if(number===1){

    p1.style.display='block';

    p2.style.display='none';

  }else{

    p1.style.display='none';

    p2.style.display='grid';
  }

  /*
     NO FLASH.
     NO ZOOM.
     NO WEIRD ANIMATION.
     Page simply changes.
  */
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


/* =====================================================
   PAGE SWIPING
   ===================================================== */

let startX=0;
let startY=0;
let swiping=false;

P.addEventListener(
  'pointerdown',
  e=>{

    /*
       Don't start a page swipe while
       an app is open.
    */

    if(O.classList.contains('open'))
      return;

    startX=e.clientX;
    startY=e.clientY;

    swiping=true;
  },
  {passive:true}
);


P.addEventListener(
  'pointerup',
  e=>{

    if(!swiping)
      return;

    swiping=false;

    const dx=
      e.clientX-startX;

    const dy=
      e.clientY-startY;

    /*
       Normal physical swipe:

       UP   = Page 2
       DOWN = Page 1

       We also accept horizontal movement
       because the entire Pear Phone is
       rotated 90 degrees.
    */

    if(
      Math.abs(dy)>=35 &&
      Math.abs(dy)>Math.abs(dx)
    ){

      if(dy<0)
        page(2);
      else
        page(1);

      return;
    }

    /*
       Because the phone is rotated,
       also allow horizontal swipes.
    */

    if(
      Math.abs(dx)>=35 &&
      Math.abs(dx)>Math.abs(dy)
    ){

      if(dx<0)
        page(2);
      else
        page(1);
    }
  },
  {passive:true}
);


/* =========================
   KEYBOARD PAGE CONTROLS
========================= */

window.addEventListener(
  'keydown',
  e=>{

    if(
      e.key==='ArrowUp' ||
      e.key==='ArrowRight'
    ){

      e.preventDefault();

      page(2);
    }

    if(
      e.key==='ArrowDown' ||
      e.key==='ArrowLeft'
    ){

      e.preventDefault();

      page(1);
    }

    if(e.key==='Escape'){

      close();
    }
  }
);


/* =========================
   START PAGE 1
========================= */

page(1);

})();
