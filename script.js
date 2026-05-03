function toggleTheme(){
 let isDark = document.body.classList.contains("dark");
 document.body.classList.toggle("dark", !isDark);
 document.body.classList.toggle("light", isDark);
 localStorage.setItem("theme", isDark ? "light":"dark");
 updateThemeIcon();
}

function updateThemeIcon(){
 themeBtn.innerText = document.body.classList.contains("dark") ? "☀️":"🌙";
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

function updateClock(){
 let now=new Date();
 let h=now.getHours(),m=pad(now.getMinutes());
 let ap=h>=12?"PM":"AM"; h=h%12||12;
 clockDisplay.innerText=`${h}:${m} ${ap}`;
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
 progressBar.innerText=Math.floor(p)+"% ⚡";
}

function updateCountdown(ld){
 let diff=ld-new Date();
 if(diff<=0){countdown.innerText="✅ Done";return;}
 let h=Math.floor(diff/3600000);
 let m=Math.floor(diff%3600000/60000);
 let s=Math.floor(diff%60000/1000);
 countdown.innerText=`⏳ ${h}h ${m}m ${s}s`;
}

function calculateWork(){
 let h12=+loginHour.value,m=+loginMinute.value,ap=loginAMPM.value;
 let h=h12%12+(ap==="PM"?12:0);

 let start=new Date(); start.setHours(h,m,0);
 let now=new Date(); if(now<start) now.setDate(now.getDate()+1);

 let breaks=getBreaks();

 let bH=Math.floor(breaks/60), bM=breaks%60;
 totalBreak.innerText=`Break: ${bH}h ${bM}m`;

 let worked=(now-start)-breaks*60000;
 if(worked<0) worked=0;

 let min=Math.floor(worked/60000);
 let hh=Math.floor(min/60),mm=min%60;

 result.innerText=`Worked: ${hh}h ${mm}m`;

 let target=+workHours.value;
 let rem=target-min;

 remaining.innerText=rem>0?
 `Remaining: ${Math.floor(rem/60)}h ${rem%60}m`:
 `Overtime: ${Math.floor(-rem/60)}h ${-rem%60}m`;

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
 updateThemeIcon();

 if(localStorage.getItem("loggedIn")) showApp();

 setInterval(updateClock,1000);
};
