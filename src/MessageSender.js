import fs from "fs";
import User from "./User.js";

export default class MessageSender {
  constructor() {
    this.parsedData = [];
    this.friends = [];
    this.birthdayCounter = 0;
    this.execute();
  }

  execute() {
    this.readFile();
    this.validateBirthday();
    this.sendMessages();
  }

  readFile(path = "./friendsData.json", encoding = "utf8") {
    fs.readFile(path, encoding, (err, data) => {
      if (err && !data) {
        throw new Error("No friends found!");
      }

      this.parsedData = JSON.parse(data);
    });
  }

  validateBirthday() {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();

    for (let i = 0; i < this.parsedData.length; i++) {
      const user = this.populateFriends(i);

      if (!user.dob) {
        continue;
      }

      const dob = new Date(user.dob);
      if (dob.getDate() === todayDay && dob.getMonth() === todayMonth) {
        this.birthdayCounter++;
      }
    }
  }

  populateFriends(i) {
    const user = new User(this.parsedData[i]);
    this.friends.push(user);
    return user;
  }

  sendMessages() {
    if (this.birthdayCounter <= 0) {
      return  `Nobody has birthday right now.`
    }

    return `Today, ${this.birthdayCounter} of my friends have birthday.`
    
  }
}
