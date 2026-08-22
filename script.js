function toggleTheme() {
  let isDark = document.body.classList.contains("dark");

  document.body.classList.toggle("dark", !isDark);
  document.body.classList.toggle("light", isDark);

  localStorage.setItem("theme", isDark ? "light" : "dark");

  themeBtn.innerText = isDark ? "🌙" : "☀️";
}


function login() {
  let u = username.value;
  let p = password.value;
  let n = parseInt(u);

  if (n >= 101 && n <= 150 && u === p) {

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", u);

    showApp();

  } else {

    loginError.innerText = "Invalid";

  }
}


function logout() {

  localStorage.clear();

  location.reload();

}


function showApp() {

  loginBox.classList.add("hidden");

  appBox.classList.remove("hidden");

  userDisplay.innerText =
    "User: " + localStorage.getItem("username");

}


function pad(n) {
  return n.toString().padStart(2, "0");
}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

  let now = new Date();

  let h = now.getHours();
  let m = pad(now.getMinutes());
  let s = pad(now.getSeconds());

  let ap = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;

  let dateStr = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  clockDisplay.innerText =
    `📅 ${dateStr}  ⏰ ${h}:${m}:${s} ${ap}`;

  calculateWork();

}


/* =========================================================
   BREAK CALCULATION
========================================================= */

function getBreaks() {

  return breakTimes.value
    .split(/[\s,]+/)
    .map(n => parseInt(n))
    .filter(n => !isNaN(n))
    .reduce((a, b) => a + b, 0);

}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress(min, target) {

  if (!target || target <= 0) {

    progressBar.style.width = "0%";
    progressBar.innerText = "0%";

    if (typeof progressPercent !== "undefined") {
      progressPercent.innerText = "0%";
    }

    return;
  }

  let p = Math.min((min / target) * 100, 100);

  let percent = Math.floor(p);

  /* Main progress bar */
  progressBar.style.width = p + "%";

  progressBar.innerText = percent + "%";


  /* Daily Progress percentage */
  if (typeof progressPercent !== "undefined") {
    progressPercent.innerText = percent + "%";
  }


  /* Remaining card progress */
  let remainingBar =
    document.getElementById("remainingProgressBar");

  let remainingPercent =
    document.getElementById("remainingPercent");

  if (remainingBar) {
    remainingBar.style.width = p + "%";
  }

  if (remainingPercent) {
    remainingPercent.innerText = percent + "%";
  }

}


/* =========================================================
   COUNTDOWN
========================================================= */

function updateCountdown(ld) {

  let diff = ld - new Date();

  if (diff <= 0) {

    countdown.innerText = "✅ Done";

    return;

  }

  let h =
    Math.floor(diff / 3600000);

  let m =
    Math.floor(diff % 3600000 / 60000);

  let s =
    Math.floor(diff % 60000 / 1000);

  countdown.innerText =
    `⏳ ${h}h ${m}m ${s}s`;

}


/* =========================================================
   TABS
========================================================= */

function openTab(tabId, btn) {

  document
    .querySelectorAll(".tab-content")
    .forEach(tab =>
      tab.classList.remove("active-tab")
    );


  document
    .querySelectorAll(".tab-btn")
    .forEach(button =>
      button.classList.remove("active")
    );


  document
    .getElementById(tabId)
    .classList.add("active-tab");


  btn.classList.add("active");

}


/* =========================================================
   SUB TABS
========================================================= */

function openSubTab(tabId, btn) {

  document
    .querySelectorAll(".sub-tab-content")
    .forEach(tab => {

      tab.classList.remove("active-sub-tab");

      tab.style.display = "none";

    });


  document
    .querySelectorAll(".sub-tab-btn")
    .forEach(button =>
      button.classList.remove("active")
    );


  let el =
    document.getElementById(tabId);

  el.classList.add("active-sub-tab");

  el.style.display = "block";


  btn.classList.add("active");

}


/* =========================================================
   WORK CALCULATION
========================================================= */

function calculateWork() {

  let h12 =
    +loginHour.value;

  let m =
    +loginMinute.value;

  let ap =
    loginAMPM.value;


  let h =
    h12 % 12 +
    (ap === "PM" ? 12 : 0);


  let start =
    new Date();

  start.setHours(
    h,
    m,
    0,
    0
  );


  let now =
    new Date();


  /*
    If the current time is before login time,
    treat the login as yesterday.
  */
  if (now < start) {

    start.setDate(
      start.getDate() - 1
    );

  }


  /* Total breaks in minutes */
  let breaks =
    getBreaks();


  /* Worked time */
  let worked =
    (now - start) -
    breaks * 60000;


  if (worked < 0) {
    worked = 0;
  }


  let min =
    Math.floor(
      worked / 60000
    );


  let hh =
    Math.floor(min / 60);

  let mm =
    min % 60;


  result.innerText =
    `Worked: ${hh}h ${mm}m`;


  /* =====================================================
     BREAK TOTAL
  ===================================================== */

  let bH =
    Math.floor(breaks / 60);

  let bM =
    breaks % 60;


  totalBreak.innerText =
    `⏸ Total Break Taken: ${bH}h ${bM}m`;


  /* =====================================================
     WORK TARGET
  ===================================================== */

  let target;


  if (workHours.value === "custom") {

    let customH =
      +customHours.value || 0;

    let customM =
      +customMinutes.value || 0;


    target =
      (customH * 60) +
      customM;

  } else {

    target =
      +workHours.value;

  }


  /* =====================================================
     REMAINING / OVERTIME
  ===================================================== */

  let rem =
    target - min;


  if (rem > 0) {

    remaining.innerText = "";

    remaining.style.display = "none";

  } else {

    remaining.style.display = "block";

    remaining.innerText =
      `Overtime: ${Math.floor(-rem / 60)}h ${(-rem % 60)}m`;

  }


  /* =====================================================
     LEAVE TIME
  ===================================================== */

  let leave =
    new Date(
      start.getTime() +
      breaks * 60000 +
      target * 60000
    );


  let lh =
    leave.getHours();

  let lm =
    pad(leave.getMinutes());

  let lap =
    lh >= 12 ? "PM" : "AM";


  lh =
    lh % 12 || 12;


  if (
    leave.getDate() !==
    start.getDate()
  ) {

    leaveTime.innerText =
      `⏱ Tomorrow at ${lh}:${lm} ${lap}`;

  } else {

    leaveTime.innerText =
      `⏱ Leave at ${lh}:${lm} ${lap}`;

  }


  /* Countdown */
  updateCountdown(leave);


  /* Progress */
  updateProgress(
    min,
    target
  );

}


/* =========================================================
   WORK DURATION CHANGE
========================================================= */

workHours.addEventListener(
  "change",
  () => {

    if (
      workHours.value ===
      "custom"
    ) {

      customHoursField
        .classList
        .remove("hidden");

    } else {

      customHoursField
        .classList
        .add("hidden");

    }


    calculateWork();

  }
);


/* =========================================================
   CUSTOM HOURS / MINUTES
========================================================= */

customHours.addEventListener(
  "change",
  calculateWork
);


customMinutes.addEventListener(
  "change",
  calculateWork
);


/* =========================================================
   INITIAL PAGE LOAD
========================================================= */

window.onload = () => {


  /* Login hours: 1–12 */
  for (
    let i = 1;
    i <= 12;
    i++
  ) {

    loginHour.add(
      new Option(
        i,
        i
      )
    );

  }


  /* Login minutes: 0–59 */
  for (
    let i = 0;
    i < 60;
    i++
  ) {

    loginMinute.add(
      new Option(
        pad(i),
        i
      )
    );

  }


  /* =====================================================
     CUSTOM WORK HOURS: 1–23
  ===================================================== */

  for (
    let i = 1;
    i <= 23;
    i++
  ) {

    customHours.add(
      new Option(
        `${pad(i)} hours`,
        i
      )
    );

  }


  /* =====================================================
     CUSTOM WORK MINUTES: 1–59
  ===================================================== */

  for (
    let i = 1;
    i <= 59;
    i++
  ) {

    customMinutes.add(
      new Option(
        `${pad(i)} minutes`,
        i
      )
    );

  }


  /* =====================================================
     THEME
  ===================================================== */

  let t =
    localStorage.getItem("theme") ||
    "dark";


  document.body.classList.add(t);


  themeBtn.innerText =
    t === "dark"
      ? "☀️"
      : "🌙";


  /* =====================================================
     LOGIN STATE
  ===================================================== */

  if (
    localStorage.getItem(
      "loggedIn"
    )
  ) {

    showApp();

  }


  /* =====================================================
     CLOCK
  ===================================================== */

  updateClock();

  setInterval(
    updateClock,
    1000
  );

};
