function login() {
  let user = document.getElementById("username").value.trim();
  let pass = document.getElementById("password").value.trim();

  if (user === "" || pass === "") {
    document.getElementById("loginError").innerText =
      "Enter username & password";
    return;
  }

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("appBox").classList.remove("hidden");

  document.getElementById("userDisplay").innerText =
    "Welcome " + user;

  startClock();
}

function logout() {
  location.reload();
}

function toggleTheme() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}

function startClock() {
  setInterval(() => {
    let now = new Date();
    document.getElementById("clockDisplay").innerText =
      now.toLocaleTimeString();

    updateWork(now);
  }, 1000);
}

function updateWork(now) {
  let workMin = parseInt(document.getElementById("workHours").value);

  let h = parseInt(document.getElementById("loginHour").value || 9);
  let m = parseInt(document.getElementById("loginMinute").value || 0);
  let ampm = document.getElementById("loginAMPM").value;

  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;

  let loginTime = new Date();
  loginTime.setHours(h, m, 0);

  let diff = Math.floor((now - loginTime) / 60000);
  let remaining = workMin - diff;

  let percent = Math.min((diff / workMin) * 100, 100);
  let bar = document.getElementById("progressBar");

  bar.style.width = percent + "%";
  bar.innerText = Math.floor(percent) + "%";

  if (remaining > 0) {
    document.getElementById("leaveTime").innerText =
      "Remaining: " + formatTime(remaining);
    document.getElementById("leaveTime").style.color = "#00f7ff";
  } else {
    let overtime = Math.abs(remaining);
    document.getElementById("leaveTime").innerText =
      "🔥 Overtime: " + formatTime(overtime);
    document.getElementById("leaveTime").style.color = "#ff4b2b";
  }
}

function formatTime(min) {
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}

window.onload = function () {
  let h = document.getElementById("loginHour");
  let m = document.getElementById("loginMinute");

  for (let i = 1; i <= 12; i++) {
    h.innerHTML += `<option>${i}</option>`;
  }

  for (let i = 0; i < 60; i++) {
    m.innerHTML += `<option>${i}</option>`;
  }
};
