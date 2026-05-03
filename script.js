// LOGIN SIMPLE
function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (!user || !pass) {
    document.getElementById("loginError").innerText = "Fill all fields";
    return;
  }

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("appBox").classList.remove("hidden");

  document.getElementById("userDisplay").innerText = "Welcome " + user;

  startClock();
}

// LOGOUT
function logout() {
  location.reload();
}

// THEME
function toggleTheme() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}

// CLOCK
function startClock() {
  setInterval(() => {
    let now = new Date();
    document.getElementById("clockDisplay").innerText =
      now.toLocaleTimeString();

    updateWorkStatus(now);
  }, 1000);
}

// MAIN LOGIC
function updateWorkStatus(now) {
  let workMinutes = parseInt(document.getElementById("workHours").value || 480);

  let loginHour = parseInt(document.getElementById("loginHour").value || 9);
  let loginMin = parseInt(document.getElementById("loginMinute").value || 0);
  let ampm = document.getElementById("loginAMPM").value;

  if (ampm === "PM" && loginHour !== 12) loginHour += 12;
  if (ampm === "AM" && loginHour === 12) loginHour = 0;

  let loginTime = new Date();
  loginTime.setHours(loginHour, loginMin, 0);

  let diffMs = now - loginTime;
  let workedMin = Math.floor(diffMs / 60000);

  let diff = workMinutes - workedMin;

  let bar = document.getElementById("progressBar");
  let percent = Math.min((workedMin / workMinutes) * 100, 100);

  bar.style.width = percent + "%";
  bar.innerText = Math.floor(percent) + "%";

  // OVERTIME LOGIC
  if (diff > 0) {
    document.getElementById("leaveTime").innerText =
      "Remaining: " + formatTime(diff);
    document.getElementById("leaveTime").style.color = "#00f7ff";
  } else {
    let overtime = Math.abs(diff);
    document.getElementById("leaveTime").innerText =
      "🔥 Overtime: " + formatTime(overtime);
    document.getElementById("leaveTime").style.color = "#ff4b2b";
  }
}

// FORMAT TIME
function formatTime(mins) {
  let h = Math.floor(mins / 60);
  let m = mins % 60;
  return `${h}h ${m}m`;
}

// FILL TIME DROPDOWNS
window.onload = function () {
  let hour = document.getElementById("loginHour");
  let min = document.getElementById("loginMinute");

  for (let i = 1; i <= 12; i++) {
    hour.innerHTML += `<option>${i}</option>`;
  }

  for (let i = 0; i < 60; i++) {
    min.innerHTML += `<option>${i}</option>`;
  }
};
