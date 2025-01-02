import { Pomodoro } from "./pomodoro.js";

const container = document.querySelector(".container");
const timeContainer = document.querySelector(".timeContainer");
const selection = document.querySelectorAll(".selection");
const btnGrp = document.querySelector(".btnGroup");
const streakCount = document.querySelector(".streakCount");
const settingsBtn = document.querySelector("#settings");
const dialog = document.querySelector("#settingsDialog");
const form = document.querySelector("form");
const closeBtn = document.querySelector("#closeDialog");

const pom = new Pomodoro();

const defaultTime = { time: 25, short: 5, long: 20 };

let longBreakInterval = 4;
let timeInMilliSeconds = pom.getTimeData(defaultTime);
let dataAfterPause = undefined;

const state = {
  isPaused: false,
  activeTimer: timeInMilliSeconds.time,
  timerID: "Pomodoro",
  loopCount: 0,
  streak: 0,
};

function pad(string) {
  return String(string).padStart(2, 0);
}

function fetchData(data) {
  initDisplay(data.min, data.sec);
  dataAfterPause = data;
}

function timeOverAlert() {
  pom.pauseTimer();
  refresh(state.timerID);
}

function initDisplay(min, sec = "0") {
  timeContainer.textContent = "";
  timeContainer.textContent = `${pad(min)}:${pad(sec)}`;
  document.title = `${pad(min)}:${pad(sec)} - ${titleDisplay(state.timerID)}`;
}

function titleDisplay(activeTimer) {
  let message = "";
  activeTimer === "Pomodoro"
    ? (message = "It's time to pomdeeznuts!")
    : activeTimer === "Short Break"
    ? (message = "It's time  for a short break")
    : activeTimer === "Long Break"
    ? (message = "It's time for long break")
    : "Pomodoro";
  return message;
}
// TODO: create a more intuitive way of removing and adding buttons

function createBtn(type) {
  const btn = document.createElement("button");
  if (type === "Start") {
    btn.setAttribute("id", "startBtn");
    btn.textContent = "Start!";
  } else if (type === "Stop") {
    btn.setAttribute("id", "stopBtn");
    btn.textContent = "Stop";
  } else {
    btn.setAttribute("id", "nextBtn");
    btn.textContent = "";
  }
  return btn;
}

function toggleButtons(btnToCreate, btnToDelete, parent) {
  const btn = document.createElement("button");
  if (btnToCreate === "Start") {
    btn.setAttribute("id", "startBtn");
    btn.textContent = "Start!";
  } else {
    btn.setAttribute("id", "stopBtn");
    btn.textContent = "Stop";
  }
  btnToDelete.remove();
  parent.append(btn);
}

function createNextBtn() {
  const btn = createBtn("Next");
  btn.style.background = "url(../images/next-button.png) no-repeat top right";
  btn.addEventListener("click", () => {
    timeOverAlert();
    btn.remove();
  });
  return btn;
}

function timerOnclickHandler(id) {
  highlightCurrTimer(id);
  let stopBtn = undefined;
  if (document.querySelector("#stopBtn")) {
    stopBtn = document.querySelector("#stopBtn");
  }
  updateState(id);
  if (stopBtn) {
    toggleButtons("Start", stopBtn, btnGrp);
    document.querySelector("#nextBtn").remove();
  }
}

function updateState(selectionId) {
  switch (selectionId) {
    case "Pomodoro":
      state.activeTimer = timeInMilliSeconds.time;
      state.timerID = selectionId;
      initDisplay(defaultTime.time, undefined, "It's time to pomdeeznuts!");
      highlightCurrTimer(selectionId);
      break;

    case "Short Break":
      state.activeTimer = timeInMilliSeconds.short;
      state.timerID = selectionId;
      initDisplay(defaultTime.short, undefined, "It's time for a short break");
      highlightCurrTimer(selectionId);
      break;

    case "Long Break":
      state.activeTimer = timeInMilliSeconds.long;
      state.timerID = selectionId;
      initDisplay(defaultTime.long, undefined, "It's time for a long break");
      highlightCurrTimer(selectionId);
      break;
    default:
      break;
  }
}

function getNextTimer(timerID) {
  if (timerID == "Pomodoro") {
    ++state.loopCount;
    if (state.loopCount === longBreakInterval) {
      state.loopCount = 0;
      state.streak++;
      return "Long Break";
    } else {
      return "Short Break";
    }
  }
  return "Pomodoro";
}

function refresh(timerID) {
  const nextTimer = getNextTimer(timerID);
  timerOnclickHandler(nextTimer);
  streakCount.textContent = `#${state.streak}`;
}

selection.forEach(function (selectionEl) {
  selectionEl.addEventListener("click", (e) => {
    timerOnclickHandler(selectionEl.textContent.trim());
    dataAfterPause = undefined;
    pom.pauseTimer();
  });
});

function runTheTimer(timer) {
  pom.initTimer(timer, fetchData, timeOverAlert);
}

function highlightCurrTimer(timerID) {
  const getId = timerID.trim().split(" ")[0];

  const theme = `${getId}Theme`;

  container.className = "container";

  selection.forEach(function (selectionEl) {
    selectionEl.className = "selection";
    selectionEl.classList.remove("active");
    selectionEl.classList.add(theme);
  });

  const targetEl = document.querySelector(`.selection[data-id="${getId}"]`);
  targetEl.classList.add("active");
  container.className = `container ${theme}`;
}

(function init() {
  initDisplay(defaultTime.time, undefined);
  highlightCurrTimer(state.timerID);
})();

container.addEventListener("click", (e) => {
  if (!e.target.id.includes("startBtn")) return;
  const stopBtn = createBtn("Stop");
  const nextBtn = createNextBtn();
  btnGrp.appendChild(stopBtn);
  btnGrp.appendChild(nextBtn);

  if (state.isPaused) {
    if (dataAfterPause) {
      state.activeTimer = dataAfterPause.timeInMilli;
    }
    runTheTimer(state.activeTimer);
    state.isPaused = false;
  } else {
    runTheTimer(state.activeTimer);
  }

  e.target.remove();
});

container.addEventListener("click", (e) => {
  if (!e.target.id.includes("stopBtn")) return;

  const startBtn = createBtn("Start");
  {
    pom.pauseTimer();
    state.isPaused = true;
  }
  btnGrp.appendChild(startBtn);
  document.querySelector("#nextBtn").remove();
  e.target.remove();
});

settingsBtn.addEventListener("click", (e) => {
  dialog.showModal();

  form.querySelector("#pomInp").value = defaultTime.time;
  form.querySelector("#shortInp").value = defaultTime.short;
  form.querySelector("#longInp").value = defaultTime.long;
  form.querySelector("#longBreakIntervalInp").value = longBreakInterval;
});

closeBtn.addEventListener("click", (e) => {
  dialog.close();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  defaultTime.time = form.querySelector("#pomInp").value;
  defaultTime.short = form.querySelector("#shortInp").value;
  defaultTime.long = form.querySelector("#longInp").value;
  longBreakInterval = +form.querySelector("#longBreakIntervalInp").value;

  timeInMilliSeconds = pom.getTimeData(defaultTime);
  timerOnclickHandler(state.timerID);
  dialog.close();
});
