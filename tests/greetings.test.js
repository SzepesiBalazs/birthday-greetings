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

    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(
        null,
        JSON.stringify([
          {
            first_name: "John",
            last_name: "Doe",
            dob: "2000-01-16",
            email: "john.doe@foobar.com",
          },
        ]),
      );
    });

    const sender = new MessageSender();

    setImmediate(() => {
      expect(() => sender.sendMessages()).not.toThrow();
      done();
    });
  });



  
  test("sendMessages when there are birthdays", (done) => {
    mockDate("2024-05-05");

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

    setImmediate(() => {
      sender.sendMessages();
      expect(sender.friends.length).toBe(1);
      done();
    });
  });
});
