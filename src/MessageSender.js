import fs from "fs/promises";
import User from "./User.js";

export default class MessageSender {
  constructor() {
    this.friends = [];
    this.execute();
  }

  async execute() {
    const data = await this.readFriends();
    const birthdayCounter = this.populateFriends(data);
    const message = this.sendMessages(birthdayCounter);

    return message;
  }

  async readFriends() {
    const data = await fs.readFile("./friendsData.json", "utf8");
    return JSON.parse(data);
  }

  populateFriends(parsed) {
    for (let i = 0; i < parsed.length; i++) {
      const f = parsed[i];
      const user = new User(f.last_name, f.first_name, f.dob, f.email);
      this.friends.push(user);
    }
    return this.friends;
  }

  sendMessages(friends) {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();

    let birthdayCounter = 0;

    for (let i = 0; i < friends.length; i++) {
      const user = friends[i];
      const dob = new Date(user.dob);

      if (dob.getDate() === todayDay && dob.getMonth() === todayMonth) {
        birthdayCounter++;
      }
    }

    if (birthdayCounter <= 0) {
      return {
        count: 0,
        message: `Nobody has birthday right now.`,
      };
    }

    return {
      count: birthdayCounter,
      message: `Today, ${birthdayCounter} of my friends have birthday.`,
    };
  }
}

