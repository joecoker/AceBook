const DatabaseConnection = require('./database_connection')
const dbc = new DatabaseConnection

class User {

  static async create(firstName, lastName, email, password, dob, profilePicture = null) {
      let userDetails = await dbc.query(
        `INSERT INTO users (firstname, lastname, email, password, dob, profilepictureurl) ` +
        `VALUES ('${firstName}', '${lastName}', '${email}','${password}', '${dob}', '${profilePicture}') ` +
        `RETURNING *`
      )
      return userDetails.rows;
  }

}

module.exports = User;
