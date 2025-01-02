export function Pomodoro() {
  const MIN = 1000 * 60;

  let timerId = undefined;

  const getTimeData = function ({ time, short, long }) {
    const timeData = {
      time: MIN * time,
      short: MIN * short,
      long: MIN * long,
    };
    return timeData;
  };

  const initTimer = function (timeInput, displayCallback, timerOverCallback) {
    const time = {
      min: undefined,
      sec: undefined,
      timeInMilli: timeInput,
    };

    timerId = setInterval(function () {
      if (time.timeInMilli === 0) {
        timerOverCallback(time);
        return;
      }

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
