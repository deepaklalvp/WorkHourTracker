function toggleTheme(){
 let isDark = document.body.classList.contains("dark");
 document.body.classList.toggle("dark", !isDark);
 document.body.classList.toggle("light", isDark);
 localStorage.setItem("theme", isDark ? "light":"dark");
 themeBtn.innerText = isDark ? "🌙":"☀️";
}

function login(){
 let u=username.value,p=password.value,n=parseInt(u);
 if(n>=101&&n<=150&&u===p){
  localStorage.setItem("loggedIn","true");
  localStorage.setItem("username",u);
  showApp();
 } else loginError.innerText="Invalid";
}

function logout(){
 localStorage.clear();
 location.reload();
}

function showApp(){
 loginBox.classList.add("hidden");
 appBox.classList.remove("hidden");
 userDisplay.innerText="User: "+localStorage.getItem("username");
}

function pad(n){return n.toString().padStart(2,'0');}

function updateClock() {
  let now = new Date();

  let h = now.getHours(),
      m = pad(now.getMinutes()),
      s = pad(now.getSeconds());

  let ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  let dateStr = now.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  clockDisplay.innerText = `📅 ${dateStr}  ⏰ ${h}:${m}:${s} ${ap}`;

  calculateWork();
}
function getBreaks(){
 return breakTimes.value.split(/[\s,]+/)
 .map(n=>parseInt(n))
 .filter(n=>!isNaN(n))
 .reduce((a,b)=>a+b,0);
}

function updateProgress(min,target){
 let p=Math.min(min/target*100,100);
 progressBar.style.width=p+"%";
 progressBar.innerText=Math.floor(p)+"%";
}

function updateCountdown(ld){
 let diff=ld-new Date();
 if(diff<=0){countdown.innerText="✅ Done";return;}
 let h=Math.floor(diff/3600000);
 let m=Math.floor(diff%3600000/60000);
 let s=Math.floor(diff%60000/1000);
 countdown.innerText=`⏳ ${h}h ${m}m ${s}s`;
}
function openTab(tabId, btn){

  // hide all tab contents
  document.querySelectorAll('.tab-content')
    .forEach(tab => tab.classList.remove('active-tab'));

  // remove active button class
  document.querySelectorAll('.tab-btn')
    .forEach(button => button.classList.remove('active'));

  // show selected tab
  document.getElementById(tabId)
    .classList.add('active-tab');

  // highlight active button
  btn.classList.add('active');
}
function openSubTab(tabId, btn){

  // hide all
  document.querySelectorAll('.sub-tab-content')
    .forEach(tab => {
      tab.classList.remove('active-sub-tab');
      tab.style.display = "none";
    });

  // remove active buttons
  document.querySelectorAll('.sub-tab-btn')
    .forEach(button => button.classList.remove('active'));

  // show selected
  let el = document.getElementById(tabId);
  el.classList.add('active-sub-tab');
  el.style.display = "block";

  // active button
  btn.classList.add('active');
}

function calculateWork(){
 let h12=+loginHour.value,m=+loginMinute.value,ap=loginAMPM.value;
 let h=h12%12+(ap==="PM"?12:0);

 let start=new Date(); start.setHours(h,m,0);
 let now=new Date(); 
 if(now<start) now.setDate(now.getDate()+1);

 let breaks = getBreaks();

 let worked=(now-start)-breaks*60000;
 if(worked<0) worked=0;

 let min=Math.floor(worked/60000);
 let hh=Math.floor(min/60),mm=min%60;

 result.innerText=`Worked: ${hh}h ${mm}m`;

 let bH = Math.floor(breaks / 60);
 let bM = breaks % 60;
 totalBreak.innerText = `⏸ Total Break Taken: ${bH}h ${bM}m`;

 let target=+workHours.value;
 let rem = target - min;

if (rem > 0) {
  remaining.innerText = "";
  remaining.style.display = "none";
} else {
  remaining.style.display = "block";
  remaining.innerText =
    `Overtime: ${Math.floor(-rem / 60)}h ${(-rem % 60)}m`;
}

 let leave=new Date(start.getTime()+breaks*60000+target*60000);

 let lh=leave.getHours(),lm=pad(leave.getMinutes()),lap=lh>=12?"PM":"AM";
 lh=lh%12||12;

 leaveTime.innerText=
 leave.getDate()!=start.getDate()?
 `⏱ Tomorrow at ${lh}:${lm} ${lap}`:
 `⏱ Leave at ${lh}:${lm} ${lap}`;

 updateCountdown(leave);
 updateProgress(min,target);
}


window.onload=()=>{
 for(let i=1;i<=12;i++) loginHour.add(new Option(i,i));
 for(let i=0;i<60;i++) loginMinute.add(new Option(pad(i),i));

 let t=localStorage.getItem("theme")||"dark";
 document.body.classList.add(t);
 themeBtn.innerText = t==="dark"?"☀️":"🌙";

 if(localStorage.getItem("loggedIn")) showApp();

 setInterval(updateClock,1000);
};
