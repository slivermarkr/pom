import { Pomodoro } from "./pomodoro.js";
const startBtn = document.querySelector("#startBtn");
const container = document.querySelector(".container");
const btnGrp = document.querySelector(".btnGroup");
const timeContainer = document.querySelector(".timeContainer");
const selection = document.querySelector("#selection");

const pom = new Pomodoro();

const state = {
  isPaused: false,
};

const defaultTime = { time: 25, short: 5, long: 10 };
let dataAfterPause = undefined;

function pad(string) {
  return String(string).padStart(2, 0);
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
container.addEventListener("click", (e) => {
  if (!e.target.id.includes("startBtn")) return;
  const stopBtn = createBtn("Stop");
  selection.insertAdjacentElement("beforebegin", stopBtn);

  let timeInMilliSeconds = pom.getTimeData(defaultTime);

  if (state.isPaused) {
    timeInMilliSeconds.time = dataAfterPause.timeInMilli;
    state.isPaused = false;
    console.log(timeInMilliSeconds);
  }

  {
    pom.initTimer(timeInMilliSeconds.time, function updateDisplay(data) {
      timeContainer.textContent = "";
      timeContainer.textContent = `${pad(data.min)}:${pad(data.sec)}`;

      dataAfterPause = data;
    });
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

//const millis = pom.getTimeData({ time: 25, short: 5, long: 10 });
//let pausedData = undefined;
//
//pom.initTimer(millis.time, function (data) {
//  console.log(data);
//  pausedData = data;
//});
//
//setTimeout(function () {
//  pom.pauseTimer();
//  console.log("This is the paused data", pausedData);
//  setTimeout(function () {
//    pom.initTimer(pausedData.timeInMilli, function (data) {
//      console.log(data);
//      pausedData = data;
//    });
//  }, 3000);
//}, 3000);
console.log("Hello");
