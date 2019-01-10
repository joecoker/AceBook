const DatabaseConnection = require('./database_connection')
const dbc = new DatabaseConnection()
const bcrypt = require('bcrypt');

class User {

  static async create(firstName, lastName, email, password, dob) {

    if (await User.checkUserExists(email)) {
      return false;
    }
    else {

      const saltRounds = 10;

      let encryptedPw = bcrypt.hashSync(password, saltRounds);

      let userDetails = await dbc.query(`
        INSERT INTO users (firstname, lastname, email, password, dob)
        VALUES ('${firstName}', '${lastName}', '${email}','${encryptedPw}', '${dob}')
        RETURNING *;
      `)
      return userDetails.rows;
    }
  }

  static async checkUserExists(email) {
    let userSelect = await dbc.query(`
      SELECT * FROM users WHERE email = '${email}';
    `)

    return (userSelect.rowCount >= 1)
  }



}

module.exports = User;
