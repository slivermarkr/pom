import { Pomodoro } from "./pomodoro.js";
const startBtn = document.querySelector("#startBtn");
const container = document.querySelector(".container");
const btnGrp = document.querySelector(".btnGroup");
const timeContainer = document.querySelector(".timeContainer");
const selection = document.querySelector("#selection");

const pom = new Pomodoro();

const defaultTime = { time: 25, short: 5, long: 10 };
let timeInMilliSeconds = pom.getTimeData(defaultTime);
let dataAfterPause = undefined;

const state = {
  isPaused: false,
  activeTimer: timeInMilliSeconds.time,
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

selection.addEventListener("change", (e) => {
  switch (selection.value) {
    case "Pomodoro":
      state.activeTimer = timeInMilliSeconds.time;
      dataAfterPause = undefined;
      pom.pauseTimer();
      initDisplay(defaultTime.time);
      break;

    case "Short Break":
      state.activeTimer = timeInMilliSeconds.short;
      console.log(state.activeTimer);
      initDisplay(defaultTime.short);
      dataAfterPause = undefined;
      pom.pauseTimer();
      break;

    case "Long Break":
      state.activeTimer = timeInMilliSeconds.long;
      initDisplay(defaultTime.long);
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
      timeInMilliSeconds.time = dataAfterPause.timeInMilli;
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
  selection.insertAdjacentElement("beforebegin", startBtn);
  e.target.remove();
});
