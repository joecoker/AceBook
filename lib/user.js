const DatabaseConnection = require('./database_connection')
const bcrypt = require('bcrypt');

class User {

  static async create(firstName, lastName, email, password, dob, profilePicture = null, database = 'acebook') {
    const dbc = new DatabaseConnection(database)

    if (await User.checkUserExists(email)) {
      return false;
    }

    const saltRounds = 10;

    let encryptedPw = bcrypt.hashSync(password, saltRounds);

    let userDetails = await dbc.query(
      `INSERT INTO users (firstname, lastname, email, password, dob, profilepictureurl) ` +
      `VALUES ('${firstName}', '${lastName}', '${email}','${encryptedPw}', '${dob}', '${profilePicture}') ` +
      `RETURNING *`
    )
    return userDetails.rows;
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
