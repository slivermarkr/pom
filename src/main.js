import { Pomodoro } from "./pomodoro.js";
const container = document.querySelector(".container");
const timeContainer = document.querySelector(".timeContainer");
const selection = document.querySelector("#selection");

const pom = new Pomodoro();

const defaultTime = { time: 0.1, short: 0.1, long: 0.1 };
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

function updateDisplay(data) {
  timeContainer.textContent = "";
  timeContainer.textContent = `${pad(data.min)}:${pad(data.sec)}`;

  dataAfterPause = data;
}

function initDisplay(min, sec = "0") {
  timeContainer.textContent = "";
  timeContainer.textContent = `${pad(min)}:${pad(sec)}`;
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

function toggleButtons(btnToCreate, btnToDelete, adjacentEl) {
  const btn = document.createElement("button");
  if (btnToCreate === "Start") {
    btn.setAttribute("id", "startBtn");
    btn.textContent = "Start!";
  } else {
    btn.setAttribute("id", "stopBtn");
    btn.textContent = "Stop";
  }
  btnToDelete.remove();
  adjacentEl.insertAdjacentElement("beforebegin", btn);
}

function updateState(selectionId) {
  let stopBtn = undefined;
  if (document.querySelector("#stopBtn")) {
    stopBtn = document.querySelector("#stopBtn");
  }
  switch (selectionId) {
    case "Pomodoro":
      state.activeTimer = timeInMilliSeconds.time;
      state.timerID = selectionId;
      initDisplay(defaultTime.time);
      break;

    case "Short Break":
      state.activeTimer = timeInMilliSeconds.short;
      state.timerID = selectionId;
      initDisplay(defaultTime.short);
      break;

    case "Long Break":
      state.activeTimer = timeInMilliSeconds.long;
      state.timerID = selectionId;
      initDisplay(defaultTime.long);
      break;
    default:
      break;
  }
  if (stopBtn) {
    toggleButtons("Start", stopBtn, selection);
  }
}

function refresh(timerID) {
  switch (timerID) {
    case "Pomodoro":
      ++state.loopCount;
      if (state.loopCount === 4) {
        state.loopCount = 0;
        state.streak++;
        updateState("Long Break");
      } else {
        updateState("Short Break");
      }
      break;

    case "Short Break":
      updateState("Pomodoro");
      break;

    case "Long Break":
      updateState("Pomodoro");
      break;
    default:
      break;
  }
}

selection.addEventListener("change", (e) => {
  console.log(selection.value);
  switch (selection.value) {
    case "Pomodoro":
      updateState(selection.value);
      dataAfterPause = undefined;
      pom.pauseTimer();
      break;

    case "Short Break":
      updateState(selection.value);
      dataAfterPause = undefined;
      pom.pauseTimer();
      break;

    case "Long Break":
      updateState(selection.value);
      dataAfterPause = undefined;
      pom.pauseTimer();
      break;
    default:
      break;
  }
});

function runTheTimer(timer) {
  pom.initTimer(timer, updateDisplay);
}

container.addEventListener("click", (e) => {
  if (!e.target.id.includes("startBtn")) return;
  const stopBtn = createBtn("Stop");
  selection.insertAdjacentElement("beforebegin", stopBtn);

  if (state.isPaused) {
    if (dataAfterPause) {
      state.activeTimer = dataAfterPause.timeInMilli;
    }
    runTheTimer(state.activeTimer);
    state.isPaused = false;
  } else {
    runTheTimer(state.activeTimer);

    setTimeout(function just() {
      pom.pauseTimer();
      console.log("before", state);
      refresh(state.timerID);
      console.log("after", state);
    }, state.activeTimer);
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
  selection.insertAdjacentElement("beforebegin", startBtn);
  e.target.remove();
});
