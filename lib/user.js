const dbc = require('../database_connection')
const bcrypt = require('bcrypt');

class User {

  static async create(firstName, lastName, email, password, dob) {

    if (await User.checkUserExists(email)) {
      return false;
    }
    else {
      const saltRounds = 10;
      let encryptedPw = bcrypt.hashSync(password, saltRounds);
      let userDetails = await dbc.query(
        'INSERT INTO users (firstname, lastname, email, password, dob) ' +
        'VALUES ($1, $2, $3, $4, $5) ' +
        'RETURNING *;'
      , [firstName, lastName, email, encryptedPw, dob])
      return userDetails.rows[0];
    }
  }

  static async checkUserExists(email) {
    let userSelect = await dbc.query(
      'SELECT * FROM users WHERE email = $1;'
    , [email])
    return (userSelect.rowCount >= 1)
  }

  static async signIn(email, password) {

    let results = await dbc.query(
      'SELECT * FROM users WHERE email = $1;'
    , [email]);

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
    let userDetails = await dbc.query(
      'SELECT userid, firstname, lastname, email, dob::TEXT, profilepictureurl, createdat ' +
      'FROM users ' +
      'WHERE userid = $1;'
      , [userId])

    let profilepictureurl = userDetails.rows[0].profilepictureurl;

    if (profilepictureurl === null || profilepictureurl === "") {
      userDetails.rows[0].profilepictureurl = '/images/default_profile.jpg';
    }

    return userDetails.rows[0];
  }

  static async updateProfile(userId, firstName, lastName, email, dob, picUrl) {
    let updatedUserDetails = await dbc.query(
      'UPDATE users ' +
      'SET firstname = $1, lastname = $2, email = $3, ' +
      'dob = $4, profilepictureurl = $5 ' +
      'WHERE userid = $6 ' +
      'RETURNING userid, firstname, lastname, email, dob::TEXT, profilepictureurl, createdat;'
      , [firstName, lastName, email, dob, picUrl, userId])

      return updatedUserDetails.rows[0];
  }


}



module.exports = User;
