const DatabaseConnection = require('./database_connection')
const bcrypt = require('bcrypt');

class User {

  static async create(firstName, lastName, email, password, dob, database = 'acebook') {
    const dbc = new DatabaseConnection(database)

    if (await User.checkUserExists(email, database)) {
      return false;
    }
    else {

      const saltRounds = 10;

      let encryptedPw = bcrypt.hashSync(password, saltRounds);

      let userDetails = await dbc.query(
        `INSERT INTO users (firstname, lastname, email, password, dob) ` +
        `VALUES ('${firstName}', '${lastName}', '${email}','${encryptedPw}', '${dob}') ` +
        `RETURNING *`
      )
      return userDetails.rows;
    }
  }

  static async checkUserExists(email, database = 'acebook') {
    const dbc = new DatabaseConnection(database)
    let userSelect = await dbc.query(
      `SELECT FROM users WHERE email = '${email}'`
    )

    return (userSelect.rowCount >= 1)
  }



}

module.exports = User;
