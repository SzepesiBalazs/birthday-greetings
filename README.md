# birthday-greetings


In this coding kata, my goal is to send a birthday greetings to every single user, but instead of typing it manually.

I have a few ideas, on how I want to see it build up:

1. I need a JSON file, where the users are located. Every user has the same informations: First name, Last name, Date Of Birth, Email address.

2. Create a main class named MessageSender.

3. Create a different User.js for every single user.

4. I have a friends array. In this loop, I can create a new function. I need to access user.dob, and compare it to New Date, which is stringified and formatted. (Current date equals dob D-M-Y)

5. If user has no birthday, nothing happens. If user has birthday, send a message to them with their name. SendMessage function (inside the loop) ((every single person goes through the loop, if its their birthday there will be more actions)) if user.dob = current date, then send message where argument is user. 