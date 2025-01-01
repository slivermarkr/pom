import { Pomodoro } from "./pomodoro.js";
const container = document.querySelector(".container");
const timeContainer = document.querySelector(".timeContainer");
const selection = document.querySelectorAll(".selection");
const btnGrp = document.querySelector(".btnGroup");
const streakCount = document.querySelector(".streakCount");

const pom = new Pomodoro();

const defaultTime = { time: 25, short: 5, long: 15 };
// const defaultTime = { time: 0.1, short: 0.1, long: 0.1 };
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

function timeOverAlert(data) {
  pom.pauseTimer();
  initDisplay(data.min, data.sec);
  refresh(state.timerID);
  console.log("Timer over");
  console.log(state);
}

function initDisplay(min, sec = "0", message = "It's time to PomDeezNutz!") {
  timeContainer.textContent = "";
  timeContainer.textContent = `${pad(min)}:${pad(sec)}`;
  document.title = `${pad(min)}:${pad(sec)} - ${message}`;
  streakCount.textContent = `#${state.streak}`;
}

function createBtn(type) {
  const btn = document.createElement("button");
  if (type === "Start") {
    btn.setAttribute("id", "startBtn");
    btn.textContent = "Start!";
  } else {
    btn.setAttribute("id", "stopBtn");
    btn.textContent = "Stop";
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
  parent.appendChild(btn);
}

function updateState(selectionId) {
  highlightCurrTimer(selectionId);
  let stopBtn = undefined;
  if (document.querySelector("#stopBtn")) {
    stopBtn = document.querySelector("#stopBtn");
  }
  switch (selectionId) {
    case "Pomodoro":
      state.activeTimer = timeInMilliSeconds.time;
      state.timerID = selectionId;
      initDisplay(defaultTime.time, undefined, undefined);
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
  if (stopBtn) {
    toggleButtons("Start", stopBtn, btnGrp);
  }
}

function getNextTimer(timerID) {
  if (timerID == "Pomodoro") {
    ++state.loopCount;
    if (state.loopCount === 4) {
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
  updateState(nextTimer);
}

selection.forEach(function (selectionEl) {
  selectionEl.addEventListener("click", (e) => {
    updateState(selectionEl.textContent.trim());
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
  initDisplay(defaultTime.time);
  highlightCurrTimer(state.timerID);
})();

container.addEventListener("click", (e) => {
  if (!e.target.id.includes("startBtn")) return;
  const stopBtn = createBtn("Stop");
  btnGrp.appendChild(stopBtn);

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
  e.target.remove();
});
