const fs = require("fs");
const MessageSender = require("../src/MessageSender.js").default;

jest.mock("fs", () => ({
  readFile: jest.fn(),
}));

describe("Birthday-Greetings", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test("calls fs.readFile when MessageSender is created", () => {
    fs.readFile.mockImplementation((path, enc, cb) => cb(null, "[]"));
    new MessageSender();

    expect(fs.readFile).toHaveBeenCalledTimes(1);
  });

  test("sendMessages when there are NO birthdays", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01"));

    const sender = new MessageSender();
    const result = sender.sendMessages();

    expect(sender.birthdayCounter).toBe(0);
    expect(result).toBe("Nobody has birthday right now.");
  });

  test("sendMessages when there ARE birthdays", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-05"));

    fs.readFile.mockImplementation((path, enc, cb) =>
      cb(
        null,
        JSON.stringify([
          {
            first_name: "Anna",
            last_name: "Kovacs",
            dob: "1999-05-05",
            email: "anna.kovacs@foobar.com",
          },
        ]),
      ),
    );

    const sender = new MessageSender();
    const result = sender.sendMessages();

    expect(sender.friends.length).toBe(1);
    expect(sender.birthdayCounter).toBe(1);
    expect(result).toBe("Today, 1 of my friends have birthday.");
  });

  test("loads user even if date of birth is missing", () => {
    fs.readFile.mockImplementation((path, enc, cb) =>
      cb(
        null,
        JSON.stringify([
          {
            first_name: "Anna",
            last_name: "Kovacs",
            email: "anna@foo.com",
          },
        ]),
      ),
    );

    const sender = new MessageSender();

    expect(sender.friends.length).toBe(1);
    expect(sender.friends[0].dob).toBeUndefined();
  });

  test("loads user when dob exists but is an invalid date due to timezones", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-05"));

    fs.readFile.mockImplementation((path, enc, cb) =>
      cb(
        null,
        JSON.stringify([
          {
            first_name: "Anna",
            last_name: "Kovacs",
            dob: "1999-05-05 GMT+99:99",
            email: "anna@foo.com",
          },
        ]),
      ),
    );

    const sender = new MessageSender();
    const result = sender.sendMessages();

    expect(sender.friends.length).toBe(1);
    expect(sender.friends[0].dob).toBe("1999-05-05 GMT+99:99");
    expect(sender.birthdayCounter).toBe(0);
  });

  test.each([
    [
      "missing first_name",
      { last_name: "Kovacs", dob: "1999-05-05", email: "anna@foo.com" },
      1,
    ],
    [
      "missing last_name",
      { first_name: "Anna", dob: "1999-05-05", email: "anna@foo.com" },
      1,
    ],
    [
      "missing email",
      { first_name: "Anna", last_name: "Kovacs", dob: "1999-05-05" },
      1,
    ],
    [
      "missing dob",
      { first_name: "Anna", last_name: "Kovacs", email: "anna@foo.com" },
      0,
    ],
  ])("loads user when %s", (_description, inputUser, expectedBirthdayCount) => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-05"));

    fs.readFile.mockImplementation((path, enc, cb) =>
      cb(null, JSON.stringify([inputUser])),
    );

    const sender = new MessageSender();
    sender.sendMessages();

    expect(sender.friends.length).toBe(1);
    expect(sender.birthdayCounter).toBe(expectedBirthdayCount);
  });

  test.each([
    [
      "first_name is integer",
      {
        first_name: 123,
        last_name: "Kovacs",
        dob: "1999-05-05",
        email: "anna@foo.com",
      },
      1,
    ],
    [
      "last_name is integer",
      {
        first_name: "Anna",
        last_name: 456,
        dob: "1999-05-05",
        email: "anna@foo.com",
      },
      1,
    ],
    [
      "email is integer",
      {
        first_name: "Anna",
        last_name: "Kovacs",
        dob: "1999-05-05",
        email: 789,
      },
      1,
    ],
    [
      "dob is integer",
      {
        first_name: "Anna",
        last_name: "Kovacs",
        dob: 19990505,
        email: "anna@foo.com",
      },
      0,
    ],
  ])("loads user when %s", (_description, inputUser, expectedBirthdayCount) => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-05"));

    fs.readFile.mockImplementation((path, enc, cb) =>
      cb(null, JSON.stringify([inputUser])),
    );

    const sender = new MessageSender();
    sender.sendMessages();

    expect(sender.friends.length).toBe(1);
    expect(sender.birthdayCounter).toBe(expectedBirthdayCount);
  });
});
