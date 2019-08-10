const uuidv4 = require('uuid/v4');

class User{
  constructor(name, phone, uuid) {
    this.name = name;
    this.phone = phone;

    if (uuid === undefined) {
      this.id = uuidv4();
    } else {
      this.id = uuid;
    }
  }
}

module.exports = User;