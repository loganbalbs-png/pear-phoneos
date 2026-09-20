(()=>{
const P=document.getElementById('phone'),
O=document.getElementById('overlay'),
A=document.getElementById('app'),
K=document.getElementById('keyboard'),
F=document.getElementById('flash'),
p1=document.getElementById('page1'),
p2=document.getElementById('page2');

let sy=null,target=null,stream=null,timer=null;

const esc=s=>String(s).replace(/[&<>\"']/g,c=>({
'&':'&amp;',
'<':'&lt;',
'>':'&gt;',
'\"':'&quot;',
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
<div class=head>
<button id=back>‹</button>
<span>${esc(t)}</span>
</div>
<div class=body>${h}</div>
`;

O.classList.add('open');

document.getElementById('back').onclick=close;

wire()
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
return simple(
'Phone',
'<div class=big>☎</div><p style="text-align:center">Phone app ready. Calling hardware can be added later.</p>'
);

case'mail':
return simple(
'Mail',
'<h3>Inbox</h3><div class=stock><b>Welcome to Pear OS</b><span>9:41</span></div>'
);

case'compass':
return simple(
'Compass',
'<div class=big>🧭</div><p style="text-align:center">North · 0°</p>'
);

case'splashface':
return simple(
'SplashFace',
'<div class=big>Sf</div><p style="text-align:center">Welcome to SplashFace.</p>'
);

case'videos':
return simple(
'Videos',
'<div class=big>▶</div><p style="text-align:center">No videos yet.</p>'
);

default:
return simple(
'Pear OS',
esc(id)+' opened.'
);

}
}

function messages(){

let s=JSON.parse(
localStorage.pearMessages||'[]'
);

win(
'Messages',

s.map(x=>`
<div class="bubble me">
${esc(x)}
</div>
`).join('')

+

`
<div class=bubble>
Hey 👋
</div>

<div class=bubble>
Welcome to Pear Phone.
</div>

<div class=row>
<input
id=mi
style="flex:1"
placeholder="Message"
>

<button id=send>
Send
</button>
</div>
`
);

let i=document.getElementById('mi');

document.getElementById('send').onclick=()=>{

let v=i.value.trim();

if(v){

s.push(v);

localStorage.pearMessages=
JSON.stringify(
s.slice(-50)
);

messages()
}
};

i.onkeydown=e=>{

if(e.key==='Enter'){
document.getElementById('send').click()
}

}
}

async function camera(){

win(
'Camera',

`
<video
id=vid
class=video
autoplay
playsinline>
</video>

<div
class=row
style="margin-top:6px">

<button id=start>
Start Camera
</button>

<button id=snap>
Take Photo
</button>

</div>

<p
id=cs
style="font-size:11px;color:#666">
Starting camera…
</p>

<canvas
id=cv
hidden>
</canvas>

<img
id=pic
style="
display:none;
width:100%;
margin-top:6px;
border-radius:10px">
`
);

document.getElementById('start').onclick=startCam;
document.getElementById('snap').onclick=snap;

await startCam()
}

async function startCam(){

let v=document.getElementById('vid'),
s=document.getElementById('cs');

if(!v)return;

if(!navigator.mediaDevices?.getUserMedia){

s.textContent=
'Camera unavailable. Use HTTPS/current Chromium.';

return
}

try{

if(stream){
stream.getTracks().forEach(t=>t.stop())
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

s.textContent='Camera connected ✓'

}catch(e){

console.error(e);

s.textContent=
'Camera permission/device error. Check browser permissions and USB connection.'
}
}

function snap(){

let v=document.getElementById('vid'),
c=document.getElementById('cv'),
im=document.getElementById('pic');

if(!v?.videoWidth)
return alert('Start the camera first.');

c.width=v.videoWidth;
c.height=v.videoHeight;

c.getContext('2d').drawImage(
v,
0,
0
);

let d=c.toDataURL(
'image/jpeg',
.9
);

im.src=d;
im.style.display='block';

let a=JSON.parse(
localStorage.pearPhotos||'[]'
);

a.unshift(d);

localStorage.pearPhotos=
JSON.stringify(
a.slice(0,24)
)
}

function photos(){

let a=JSON.parse(
localStorage.pearPhotos||'[]'
);

win(
'Photos',

`
<input
id=imp
type=file
accept="image/*"
multiple>

<div style="height:6px"></div>

<div class=photos>

${
a.length

?

a.map(x=>`
<img src="${x}">
`).join('')

:

`
<p
style="
grid-column:1/-1;
text-align:center">
No photos yet.
</p>
`
}

</div>
`
);

document.getElementById('imp').onchange=
async e=>{

let n=[];

for(
const f of e.target.files
){

n.push(
await new Promise(r=>{

let q=new FileReader;

q.onload=()=>r(q.result);

q.readAsDataURL(f)

})
)
}

localStorage.pearPhotos=
JSON.stringify(
[...n,...a].slice(0,24)
);

photos()
}
}

function notes(){

let a=JSON.parse(
localStorage.pearNotes||'[]'
);

win(
'Notes',

a.map((n,i)=>`
<div
class="stock"
data-n=${i}>

<b>
${esc(n.t)}
</b>

<span>
${esc(n.b.slice(0,45))}
</span>

</div>
`).join('')

+

`
<input
id=nt
style="width:100%"
placeholder="Title">

<textarea
id=nb
placeholder="Write your note…">
</textarea>

<button id=save>
Save Note
</button>
`
);

document
.querySelectorAll('[data-n]')
.forEach(x=>{

x.onclick=()=>{

let n=a[x.dataset.n];

nt.value=n.t;
nb.value=n.b
}
});

document.getElementById('save').onclick=()=>{

a.unshift({
t:nt.value||'Untitled',
b:nb.value
});

localStorage.pearNotes=
JSON.stringify(
a.slice(0,50)
);

notes()
}
}

function stocks(){

let d=[
['AAPL','Apple','$229.87','+1.8%'],
['MSFT','Microsoft','$532.44','+0.9%'],
['TSLA','Tesla','$318.26','-1.2%'],
['PEAR','Pear Inc.','$99.99','+4.2%']
];

win(
'Stocks',

d.map(x=>`

<div class=stock>

<span>
<b>${x[0]}</b>
<br>
<small>${x[1]}</small>
</span>

<span>
<b>${x[2]}</b>
<br>
<small>${x[3]}</small>
</span>

</div>

`).join('')
)
}

function maps(){

win(
'Maps',

`
<div class=map>
📍
</div>

<h3>
Pear Park
</h3>

<p>
12 Pear Street · 5 min away
</p>

<button id=route>
Start Route
</button>
`
);

document.getElementById('route').onclick=
e=>e.target.textContent='Route Started ✓'
}

function weather(){

simple(
'Weather',

`
<div class=big>
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
)
}

function clock(){

win(
'Clock',

`
<div
id=ct
class=big>
--:--:--
</div>

<p
style="
text-align:center;
color:#777">
Local time
</p>
`
);

let f=()=>{

let e=document.getElementById('ct');

if(e)

e.textContent=
new Date().toLocaleTimeString(
[],
{
hour:'numeric',
minute:'2-digit',
second:'2-digit'
}
)
};

f();

timer=setInterval(
f,
1000
)
}

function settings(){

win(
'Settings',

`
<label
style="
display:flex;
justify-content:space-between;
padding:10px">

Dark app

<input
id=dark
type=checkbox>

</label>

<button id=reset>
Reset saved data
</button>
`
);

dark.checked=
localStorage.pearDark==='1';

dark.onchange=
e=>localStorage.pearDark=
e.target.checked?'1':'0';

reset.onclick=()=>{

localStorage.clear();
location.reload()

}
}

function music(){

win(
'PearTunes',

`
<div class=big>
♫
</div>

<div class=stock>
Pearadise
<button>▶</button>
</div>

<div class=stock>
Sunset Drive
<button>▶</button>
</div>

<div class=stock>
Electric Orchard
<button>▶</button>
</div>
`
)
}

function buildK(){

K.innerHTML='';

[
'1234567890',
'QWERTYUIOP',
'ASDFGHJKL⌫',
'ZXCVBNM,.↵'
]

.forEach(r=>

[...r].forEach(k=>{

let b=document.createElement('button');

b.textContent=k;

b.onclick=()=>{

if(!target)return;

if(k==='⌫')

target.value=
target.value.slice(0,-1);

else if(k==='↵')

target.dispatchEvent(
new KeyboardEvent(
'keydown',
{
key:'Enter'
}
)
);

else

target.value+=
k.toLowerCase()
};

K.appendChild(b)

})
);

let sp=document.createElement('button');

sp.textContent='SPACE';
sp.className='space';

sp.onclick=()=>{

if(target)
target.value+=' '
};

let done=document.createElement('button');

done.textContent='DONE';
done.className='wide';

done.onclick=()=>{

K.classList.remove('show');
target=null
};

K.append(
sp,
done
)
}

function wire(){

A
.querySelectorAll(
'input:not([type=file]),textarea'
)
.forEach(e=>

e.onfocus=()=>{

target=e;
K.classList.add('show')

}
)
}

buildK();

P.addEventListener(
'click',
e=>{

let b=e.target.closest('[data-app]');

if(b){

e.preventDefault();
e.stopPropagation();

launch(
b.dataset.app
)
}

}
);

document.getElementById('home').onclick=()=>{

p1.style.display='block';
p2.style.display='none';

close()
};

function page(n){

p1.style.display=
n===1?'block':'none';

p2.style.display=
n===2?'grid':'none';

F.classList.remove('go');

void F.offsetWidth;

F.classList.add('go')
}

P.addEventListener(
'touchstart',
e=>{

if(!O.classList.contains('open'))

sy=e.touches[0].clientY

},
{
passive:true
}
);

P.addEventListener(
'touchend',
e=>{

if(sy==null)return;

let d=
e.changedTouches[0].clientY-sy;

sy=null;

if(Math.abs(d)>45)

page(
d<0?2:1
)

},
{
passive:true
}
);

let my=null;

P.addEventListener(
'mousedown',
e=>{

if(!O.classList.contains('open'))

my=e.clientY

}
);

P.addEventListener(
'mouseup',
e=>{

if(my==null)return;

let d=e.clientY-my;

my=null;

if(Math.abs(d)>45)

page(
d<0?2:1
)

}
);

window.onkeydown=e=>{

if(e.key==='ArrowUp')
page(2);

if(e.key==='ArrowDown')
page(1);

if(e.key==='Escape')
close()

};

page(1);

})();
