export default class User {
  constructor(parsedData) {
    this.last_name = parsedData.last_name;
    this.first_name = parsedData.first_name;
    this.dob = parsedData.dob;
    this.email = parsedData.email;
  }
}
