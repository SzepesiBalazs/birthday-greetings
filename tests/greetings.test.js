import fs from "fs";
import MessageSender from "../src/MessageSender";

jest.mock("fs", () => ({
    readFile: jest.fn()
}));

const mockDate = mockedDate => {
    jest 
    .spyOn(global, "Date")
    .mockImplementation(() => new Date(mockedDate));
}



