function Pomodoro() {
  const MIN = 1000 * 60;

  let timerId = undefined;

  const getTimeData = function ({ time, short, long }) {
    // we are converting minutes to milliseconds.
    const timeData = {
      time: MIN * time,
      short: MIN * short,
      long: MIN * long,
    };
    return timeData;
  };

  const initTimer = function (timeInput, displayCallback) {
    //timeInput comes in millisecons.
    const time = {
      min: undefined,
      sec: undefined,
      timeInMilli: timeInput,
    };

    timerId = setInterval(function () {
      time.timeInMilli = time.timeInMilli - 1000;
      time.min = Math.floor((time.timeInMilli % 3.6e6) / 60000);
      time.sec = Math.floor(((time.timeInMilli % 3.6e6) % 60000) / 1000);
      displayCallback(time);
    }, 1000);
  };

  const getTimerId = () => timerId;

  const pauseTimer = function () {
    timerId = getTimerId();
    clearInterval(timerId);
  };
  return {
    getTimeData,
    initTimer,
    pauseTimer,
  };
}

const pom = new Pomodoro();
const millis = pom.getTimeData({ time: 25, short: 5, long: 10 });
let pausedData = undefined;

pom.initTimer(millis.time, function (data) {
  console.log(data);
  pausedData = data;
});

setTimeout(function () {
  pom.pauseTimer();
  console.log("This is the paused data", pausedData);
  setTimeout(function () {
    pom.initTimer(pausedData.timeInMilli, function (data) {
      console.log(data);
      pausedData = data;
    });
  }, 3000);
}, 3000);

module.exports = Pomodoro;
