//const classicOption = {
//  time: MIN * 25,
//  shortBreak: MIN * 5,
//  long: MIN * 10,
//};
//const extendedOption = {
//  time: MIN * 60,
//  shortBreak: MIN * 10,
//  long: MIN * 20,
//};

function Pomodoro() {
  const MIN = 1000 * 60;

  const getTimeData = function ({ time, short, long }) {
    // we are converting minutes to milliseconds.
    const timeData = {
      time: MIN * time,
      short: MIN * short,
      long: MIN * long,
    };
    return timeData;
  };

  const initTimer = function (timeInput) {
    //timeInput comes in millisecons.
    const time = {
      min: undefined,
      sec: undefined,
      timeInMilli: timeInput,
    };

    setInterval(function () {
      time.timeInMilli = time.timeInMilli - 1000;
      time.min = Math.floor((time.timeInMilli % 3.6e6) / 60000);
      time.sec = Math.floor(((time.timeInMilli % 3.6e6) % 60000) / 1000);
      console.log(time);
      return time;
    }, 1000);
  };

  return {
    getTimeData,
    initTimer,
  };
}
const pom = new Pomodoro();
const millis = pom.getTimeData({ time: 25, short: 5, long: 10 });
console.log(pom.initTimer(millis.time));
module.exports = Pomodoro;
