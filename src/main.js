import { Pomodoro } from "./pomodoro.js";
const startBtn = document.querySelector("#startBtn");
const timeContainer = document.querySelector(".timeContainer");

const pom = new Pomodoro();

const defaultTime = { time: 25, short: 5, long: 10 };

function pad(string) {
  return String(string).padStart(2, 0);
}

startBtn.addEventListener("click", () => {
  const timeInMilliSeconds = pom.getTimeData(defaultTime);
  pom.initTimer(timeInMilliSeconds.time, function updateDisplay(data) {
    timeContainer.textContent = "";
    timeContainer.textContent = `${data.min}:${data.sec}`;
  });
  console.log(timeInMilliSeconds);
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
