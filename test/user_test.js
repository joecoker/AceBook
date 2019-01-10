const expect = require('chai').expect;
const User = require('../lib/user');
const DatabaseConnection = require('../lib/database_connection');
const dbc = new DatabaseConnection();

describe('User', function() {

 afterEach('Truncating dev database', function (){
  const database = new DatabaseConnection("acebook_dev")
  database.query('TRUNCATE posts RESTART IDENTITY CASCADE;')
  database.query('TRUNCATE users RESTART IDENTITY CASCADE;')
 })

 describe('#create', function() {
  it("creates a new user", async function() {

   var user = await User.create('Test', 'Person', 'test@test.com', 'qwerty', '1993-04-23');

   const database = new DatabaseConnection("acebook_dev")
   user = await database.query('SELECT * FROM users;')

   expect(user.rows[0].firstname).equal("Test");
   expect(user.rows[0].lastname).equal("Person");
   expect(user.rows[0].email).equal("test@test.com");
   expect(user.rows[0].password).equal("qwerty");

  })
 })
})
