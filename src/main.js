import { Pomodoro } from "./pomodoro.js";
const container = document.querySelector(".container");
const timeContainer = document.querySelector(".timeContainer");
const selection = document.querySelector("#selection");

const pom = new Pomodoro();

const defaultTime = { time: 0.1, short: 0.1, long: 0.2 };
let timeInMilliSeconds = pom.getTimeData(defaultTime);
let dataAfterPause = undefined;

const state = {
  isPaused: false,
  activeTimer: timeInMilliSeconds.time,
  timerID: "Pomodoro",
  loopCount: 0,
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

function refresh(timerID) {
  switch (timerID) {
    case "Pomodoro":
      ++state.loopCount;
      if (state.loopCount === 4) {
        state.loopCount = 0;
        state.activeTimer = timeInMilliSeconds.long;
        state.timerID = "Long Break";
        initDisplay(defaultTime.long);
      } else {
        state.activeTimer = timeInMilliSeconds.short;
        state.timerID = "Short Break";
        initDisplay(defaultTime.short);
      }
      if (stopBtn) {
        toggleButtons("Start", stopBtn, selection);
      }
      break;

    case "Short Break":
      state.activeTimer = timeInMilliSeconds.time;
      state.timerID = "Pomodoro";
      initDisplay(defaultTime.time);
      if (stopBtn) {
        toggleButtons("Start", stopBtn, selection);
      }
      break;

    case "Long Break":
      state.activeTimer = timeInMilliSeconds.time;
      state.timerID = "Pomodoro";
      initDisplay(defaultTime.time);
      if (stopBtn) {
        toggleButtons("Start", stopBtn, selection);
      }
      break;
    default:
      break;
  }
}

selection.addEventListener("change", (e) => {
  let stopBtn = undefined;
  if (document.querySelector("#stopBtn")) {
    stopBtn = document.querySelector("#stopBtn");
  }
  switch (selection.value) {
    case "Pomodoro":
      state.activeTimer = timeInMilliSeconds.time;
      state.timerID = selection.value;
      dataAfterPause = undefined;
      pom.pauseTimer();
      initDisplay(defaultTime.time);
      if (stopBtn) {
        toggleButtons("Start", stopBtn, selection);
      }
      break;

    case "Short Break":
      state.activeTimer = timeInMilliSeconds.short;
      state.timerID = selection.value;
      initDisplay(defaultTime.short);
      dataAfterPause = undefined;
      pom.pauseTimer();
      if (stopBtn) {
        toggleButtons("Start", stopBtn, selection);
      }
      break;

    case "Long Break":
      state.activeTimer = timeInMilliSeconds.long;
      state.timerID = selection.value;
      initDisplay(defaultTime.long);
      dataAfterPause = undefined;
      pom.pauseTimer();
      if (stopBtn) {
        toggleButtons("Start", stopBtn, selection);
      }
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
