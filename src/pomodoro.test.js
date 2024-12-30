const Pomodoro = require("./pomodoro.js");

const pom = new Pomodoro();
const MIN = 1000 * 60;

const result = {
  time: MIN * 25,
  short: MIN * 5,
  long: MIN * 10,
};

const input = {
  time: 25,
  short: 5,
  long: 10,
};

test("pom.getTimeData() should return an object w/ time converted in milliseconds", function () {
  expect(pom.getTimeData(input)).toEqual(result);
});

test("pom.initTimer() returns object w/ time remaining", function () {
  expect(pom.initTimer(result.time)).toEqual({});
});
