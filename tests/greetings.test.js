const fs = require("fs");
const MessageSender = require("../src/MessageSender.js").default;
const RealDate = Date;

jest.mock("fs", () => ({
  readFile: jest.fn(),
}));

const mockDate = (mockedDate) => {
  jest.spyOn(global, "Date").mockImplementation(() => {
    return new RealDate(mockedDate);
  });
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Birthday-Greetings", () => {
  test("calls fs.readFile when MessageSender is created", () => {
    fs.readFile.mockImplementation(() => {});
    new MessageSender();
    expect(fs.readFile).toHaveBeenCalledTimes(1);
  });

  test("sendMessages when there are NO birthdays", (done) => {
    mockDate("2024-01-01");

    fs.readFile.mockImplementation(() => {
      JSON.stringify([
        {
          first_name: "John",
          last_name: "Doe",
          dob: "2000-01-16",
          email: "john.doe@foobar.com",
        },
      ]);
    });

    const sender = new MessageSender();

    setImmediate(() => {
      expect(() => sender.sendMessages()).not.toThrow();
      done();
    });
  });

  test("sendMessages when there are birthdays", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-05"));

    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(
        null,
        JSON.stringify([
          {
            first_name: "Kovacs",
            last_name: "Anna",
            dob: "1999-05-05",
            email: "anna.kovacs@foobar.com",
          },
        ]),
      );
    });

    const sender = new MessageSender();
    sender.sendMessages();

    expect(sender.friends.length).toBe(1);
  });

  test("loads user even if date of birth is missing", () => {
  fs.readFile.mockImplementation((path, enc, cb) => {
    cb(
      null,
      JSON.stringify([
        {
          first_name: "Anna",
          last_name: "Kovacs",
          email: "anna@foo.com",
        },
      ])
    );
  });

  const sender = new MessageSender();

  expect(sender.friends.length).toBe(1);
  expect(sender.friends[0].dob).toBeUndefined();
});
});


