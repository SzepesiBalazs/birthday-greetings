const fs = require("fs");
const MessageSender = require ("../src/MessageSender.js").default;

jest.mock("fs", () => ({
    readFile: jest.fn()
}));

const mockDate = mockedDate => {
    jest 
    .spyOn(global, "Date")
    .mockImplementation(() => new Date(mockedDate));
}

afterEach(() => {
  jest.restoreAllMocks();
});



describe("Birthday-Greetings", ()=> {
test("calls fs.readFile when MessageSender is created", () => {
  fs.readFile.mockImplementation(() => {});

  new MessageSender();
  
  expect(fs.readFile).toHaveBeenCalledTimes(1);
});

})