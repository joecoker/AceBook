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
      return userDetails.rows[0];
    }
  }

  static async checkUserExists(email) {
    let userSelect = await dbc.query(`
      SELECT * FROM users WHERE email = '${email}';
    `)
    return (userSelect.rowCount >= 1)
  }

  static async signIn(email, password) {

    let results = await dbc.query(`
      SELECT * FROM users WHERE email = '${email}';
    `)

    if (results.rows.length === 0){
      return undefined;
    } else if (await this.checkPassword(results.rows[0].password, password)) {
      return results.rows[0];
    } else {
      return false;
    }
  }

  static async checkPassword(dbPassword, enteredPassword) {
    return await bcrypt.compareSync(enteredPassword, dbPassword)
  }

  static async getProfile(userId)  {
    let userDetails = await dbc.query(`
      SELECT firstname, lastname, email, dob::TEXT, profilepictureurl, createdat
      FROM users
      WHERE userid = '${userId}';
      `)

      return userDetails.rows[0];
  }
}

module.exports = User;
