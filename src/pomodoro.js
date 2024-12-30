const MIN = 1000 * 60;

const classicOption = {
  time: MIN * 25,
  shortBreak: MIN * 5,
  long: MIN * 10,
};
const extendedOption = {
  time: MIN * 60,
  shortBreak: MIN * 10,
  long: MIN * 20,
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function pomodoro() {
  const getTime = function (option) {
    if (option === "classic") {
      return classicOption;
    } else if (option === "extended") {
      return extendedOption;
    }
    if (typeof option === "object") {
      return option;
    } else {
      return "Invalid";
    }
  };

  const runPomodoro = function ({ time, long, shortBreak }) {
    let remaining = time;
    const timeObj = { minutes: undefined, seconds: undefined };
    setInterval(function () {
      remaining = remaining - 1000;
      timeObj.minutes = Math.floor((remaining % 3.6e6) / 60000);
      timeObj.seconds = Math.floor(((remaining % 3.6e6) % 60000) / 1000);

      console.log(timeObj);
    }, 1000);
  };
  return {
    runPomodoro,
    getTime,
  };
}

const pom = pomodoro();
console.log(pom.runPomodoro(classicOption));
module.exports = pomodoro;
