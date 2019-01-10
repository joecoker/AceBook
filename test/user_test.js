const expect = require('chai').expect;
const User = require('../lib/user');
const DatabaseConnection = require('../lib/database_connection');
const dbc = new DatabaseConnection();
const DatabaseHelpers = require('./database_helpers')

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
   // expect(user.rows[0].password).equal("qwerty");

  })

  it("cannot create an existing user", async function() {

    var user = await User.create('Test', 'Person', 'test@test.com', 'qwerty', '1993-04-23');
    var user = await User.create('Test', 'Person', 'test@test.com', 'qwerty', '1993-04-23');

    expect(user).equal(false);

  })
 })

 describe('#checkUserExists', function() {
  it('returns true if user exists', async function() {

   var user = await User.create('Test', 'Person', 'test@test.com', 'qwerty', '1993-04-23');

   // const database = new DatabaseConnection("acebook_dev")

   var exists = await User.checkUserExists('test@test.com')

   expect(exists).equal(true);
  })

  it('returns false if user does not exist', async function() {

   var user = await User.create('Test', 'Person', 'test@test.com', 'qwerty', '1993-04-23');

   // const database = new DatabaseConnection("acebook_dev")

   var exists = await User.checkUserExists('not_a_user@test.com')

   expect(exists).equal(false);
  })

 })

 describe('#signIn', function() {
   it('returns a users details if they exist', async function() {

    let userId = await DatabaseHelpers.createUser();

    const user = User.signIn('ben@johnson.com', 'steroids');

    expect(user.rows[0].firstname).equal("Ben");
    expect(user.rows[0].lastname).equal("Johnson");
    expect(user.rows[0].email).equal("ben@johnson.com");
    expect(user.rows[0].dob).equal("1993-04-23");

   })
 })

})
