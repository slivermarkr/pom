const pomodoro = require("./pomodoro.js");

const pom = pomodoro();
const MIN = 1000 * 60;

test("test for the classic pomodoro option", function () {
  expect(pom.getTime("classic")).toEqual({
    time: MIN * 25,
    shortBreak: MIN * 5,
    long: MIN * 10,
  });
});

test("test for the extended pomodoro option", function () {
  expect(pom.getTime("extended")).toEqual({
    time: MIN * 60,
    shortBreak: MIN * 10,
    long: MIN * 20,
  });
});

test("test for the classic pomodoro option", function () {
  expect(pom.getTime(4)).toBe("Invalid");
});

test("test for the custom pomodoro option", function () {
  input = {
    time: MIN * 45,
    shortBreak: MIN * 5,
    long: MIN * 10,
  };
  expect(pom.getTime(input)).toEqual(input);
});
