const expect = require('chai').expect;
const User = require('../lib/user');
const DatabaseHelpers = require('./database_helpers')
const DatabaseConnection = require('../lib/database_connection')
const dbc = new DatabaseConnection();

describe('User', function() {

  before('set database to acebook_dev', async function() {
    await DatabaseHelpers.setDevDatabase();
  })

  afterEach('Truncating dev database', async function (){
    await DatabaseHelpers.truncateDatabase();
  })

  describe('#create', function() {
    it("creates a new user", async function() {

      await User.create('Test', 'Person', 'test@test.com', 'qwerty', '1993-04-23');

      let user = await dbc.query('SELECT * FROM users;');

      expect(user.rows[0].firstname).equal("Test");
      expect(user.rows[0].lastname).equal("Person");
      expect(user.rows[0].email).equal("test@test.com");
    })

    it("cannot create an existing user", async function() {

      await User.create('Test', 'Person', 'test@test.com', 'qwerty', '1993-04-23');
      var user = await User.create('Test', 'Person', 'test@test.com', 'qwerty', '1993-04-23');
 
      expect(user).equal(false);
    })
  })

  describe('#checkUserExists', function() {
    it('returns true if user exists', async function() {

      await User.create('Test', 'Person', 'test@test.com', 'qwerty', '1993-04-23');
      var exists = await User.checkUserExists('test@test.com');

      expect(exists).equal(true);
    })

    it('returns false if user does not exist', async function() {

      await User.create('Test', 'Person', 'test@test.com', 'qwerty', '1993-04-23');
      var exists = await User.checkUserExists('not_a_user@test.com');

      expect(exists).equal(false);
    })
  })

  // describe('#signIn', function() {
  //   it('returns a users details if they exist', async function() {

  //     await DatabaseHelpers.createUser();

  //     const user = User.signIn('ben@johnson.com', 'steroids');

  //     expect(user.rows[0].firstname).equal("Ben");
  //     expect(user.rows[0].lastname).equal("Johnson");
  //     expect(user.rows[0].email).equal("ben@johnson.com");
  //     expect(user.rows[0].dob).equal("1993-04-23");
  //   })
  // })

  after('set database to acebook', async function() {
    await DatabaseHelpers.setLiveDatabase();
  })
})
