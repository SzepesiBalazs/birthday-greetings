import fs from "fs";
import User from "./User.js";

export default class MessageSender {
  constructor() {
    this.friends = [];
    this.getFriends();
  }

  getFriends() {
    fs.readFile("./friendsData.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const parsed = JSON.parse(data);

      for (let i = 0; i < parsed.length; i++) {
        const f = parsed[i];
        const user = new User(
          f.last_name,
          f.first_name,
          f.dob,
          f.email
        );
        this.friends.push(user);
      }
      
      this.sendMessages();
    });
  }

  sendMessages() {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth(); 

    let birthdayCounter = 0;

    for (let i = 0; i < this.friends.length; i++) {
      const user = this.friends[i];
      const dob = new Date(user.dob);

      if (
        dob.getDate() === todayDay &&
        dob.getMonth() === todayMonth
      ) {
        console.log(
          `Happy birthday, ${user.first_name}! Have a nice day!`
        );
        birthdayCounter++;
      }
    }

    if (birthdayCounter <= 0) {
      console.log("Nobody has a birthday right now.");
  } else {
    console.log(
        `Today, ${birthdayCounter} of my friends have birthday.`
        )
  }
  }
}

new MessageSender();
